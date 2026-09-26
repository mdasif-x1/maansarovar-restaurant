package com.maansarovar.restaurant.controller;

import com.maansarovar.restaurant.dto.ApiResponse;
import com.maansarovar.restaurant.dto.AuthRequest;
import com.maansarovar.restaurant.dto.AuthResponse;
import com.maansarovar.restaurant.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for Admin Login & Token Verification")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Admin login to obtain JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request, jakarta.servlet.http.HttpServletRequest httpRequest) {
        String clientIp = extractClientIp(httpRequest);
        AuthResponse response = authService.authenticate(request, clientIp);
        return ResponseEntity.ok(ApiResponse.ok(response, "Login successful"));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke existing JWT tokens for current user")
    public ResponseEntity<ApiResponse<Void>> logout(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            authService.revokeTokens(authentication.getName());
        }
        return ResponseEntity.ok(ApiResponse.ok(null, "Logged out successfully. Tokens invalidated."));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user info")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(Authentication authentication) {
        AuthResponse response = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    private String extractClientIp(jakarta.servlet.http.HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "unknown";
    }
}
