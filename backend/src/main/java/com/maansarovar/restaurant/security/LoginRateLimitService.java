package com.maansarovar.restaurant.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginRateLimitService {

    @Value("${app.security.login.max-attempts:5}")
    private int maxAttempts;

    @Value("${app.security.login.lockout-duration-ms:900000}") // Default: 15 minutes (900,000 ms)
    private long lockoutDurationMs;

    private static class AttemptMetadata {
        int attempts;
        long lastAttemptTimestamp;

        AttemptMetadata(int attempts, long timestamp) {
            this.attempts = attempts;
            this.lastAttemptTimestamp = timestamp;
        }
    }

    private final Map<String, AttemptMetadata> ipAttempts = new ConcurrentHashMap<>();
    private final Map<String, AttemptMetadata> userAttempts = new ConcurrentHashMap<>();

    public boolean isBlocked(String clientIp, String username) {
        long now = System.currentTimeMillis();

        if (checkBlocked(ipAttempts.get(clientIp), now)) {
            return true;
        }

        if (username != null && !username.isBlank()) {
            return checkBlocked(userAttempts.get(username.toLowerCase().trim()), now);
        }

        return false;
    }

    private boolean checkBlocked(AttemptMetadata meta, long now) {
        if (meta == null) {
            return false;
        }
        if (now - meta.lastAttemptTimestamp > lockoutDurationMs) {
            return false; // lockout expired
        }
        return meta.attempts >= maxAttempts;
    }

    public void recordFailedAttempt(String clientIp, String username) {
        long now = System.currentTimeMillis();

        ipAttempts.compute(clientIp, (key, current) -> {
            if (current == null || (now - current.lastAttemptTimestamp > lockoutDurationMs)) {
                return new AttemptMetadata(1, now);
            }
            return new AttemptMetadata(current.attempts + 1, now);
        });

        if (username != null && !username.isBlank()) {
            String normUser = username.toLowerCase().trim();
            userAttempts.compute(normUser, (key, current) -> {
                if (current == null || (now - current.lastAttemptTimestamp > lockoutDurationMs)) {
                    return new AttemptMetadata(1, now);
                }
                return new AttemptMetadata(current.attempts + 1, now);
            });
        }
    }

    public void resetAttempts(String clientIp, String username) {
        ipAttempts.remove(clientIp);
        if (username != null && !username.isBlank()) {
            userAttempts.remove(username.toLowerCase().trim());
        }
    }

    public long getRemainingCooldownSeconds(String clientIp, String username) {
        long now = System.currentTimeMillis();
        long longestRemaining = 0;

        AttemptMetadata ipMeta = ipAttempts.get(clientIp);
        if (ipMeta != null && ipMeta.attempts >= maxAttempts) {
            long remaining = lockoutDurationMs - (now - ipMeta.lastAttemptTimestamp);
            if (remaining > longestRemaining) longestRemaining = remaining;
        }

        if (username != null && !username.isBlank()) {
            AttemptMetadata userMeta = userAttempts.get(username.toLowerCase().trim());
            if (userMeta != null && userMeta.attempts >= maxAttempts) {
                long remaining = lockoutDurationMs - (now - userMeta.lastAttemptTimestamp);
                if (remaining > longestRemaining) longestRemaining = remaining;
            }
        }

        return Math.max(0, (longestRemaining + 999) / 1000);
    }
}
