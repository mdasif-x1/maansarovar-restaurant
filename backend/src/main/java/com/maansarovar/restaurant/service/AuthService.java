package com.maansarovar.restaurant.service;

import com.maansarovar.restaurant.dto.AuthRequest;
import com.maansarovar.restaurant.dto.AuthResponse;
import com.maansarovar.restaurant.entity.AdminUser;
import com.maansarovar.restaurant.exception.ResourceNotFoundException;
import com.maansarovar.restaurant.repository.AdminUserRepository;
import com.maansarovar.restaurant.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AdminUserRepository userRepository;
    private final LoginRateLimitService rateLimitService;

    public AuthResponse authenticate(AuthRequest request, String clientIp) {
        String username = request.getUsername() != null ? request.getUsername().trim() : "";

        if (rateLimitService.isBlocked(clientIp, username)) {
            long remainingSeconds = rateLimitService.getRemainingCooldownSeconds(clientIp, username);
            throw new com.maansarovar.restaurant.exception.TooManyRequestsException(
                    "Too many failed login attempts. Please wait " + (remainingSeconds > 0 ? remainingSeconds : 60) + " seconds before trying again.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, request.getPassword())
            );

            AdminUser user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Reset rate limit on successful credentials
            rateLimitService.resetAttempts(clientIp, username);

            String token = tokenProvider.generateToken(authentication, user.getTokenVersion());

            return AuthResponse.builder()
                    .token(token)
                    .tokenType("Bearer")
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build();

        } catch (org.springframework.security.core.AuthenticationException ex) {
            rateLimitService.recordFailedAttempt(clientIp, username);
            throw ex;
        }
    }

    public AuthResponse authenticate(AuthRequest request) {
        return authenticate(request, "unknown");
    }

    public void revokeTokens(String username) {
        AdminUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        user.setTokenVersion(user.getTokenVersion() + 1);
        userRepository.save(user);
    }

    public AuthResponse getCurrentUser(String username) {
        AdminUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return AuthResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
