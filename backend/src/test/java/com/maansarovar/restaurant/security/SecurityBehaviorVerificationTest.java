package com.maansarovar.restaurant.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maansarovar.restaurant.dto.AuthRequest;
import com.maansarovar.restaurant.dto.ReservationRequest;
import com.maansarovar.restaurant.entity.AdminUser;
import com.maansarovar.restaurant.repository.AdminUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SecurityBehaviorVerificationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private LoginRateLimitService loginRateLimitService;

    @BeforeEach
    void setUp() {
        loginRateLimitService.resetAttempts("127.0.0.1", "testadmin");
        loginRateLimitService.resetAttempts("192.168.1.100", "testadmin");
        adminUserRepository.deleteAll();
        AdminUser admin = AdminUser.builder()
                .username("testadmin")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .email("testadmin@maansarovar.com")
                .role("ROLE_ADMIN")
                .tokenVersion(1)
                .build();
        adminUserRepository.save(admin);
    }

    // 1. Authentication Verification
    @Test
    void testLoginWithInvalidCredentials_Returns401() throws Exception {
        AuthRequest request = new AuthRequest();
        request.setUsername("testadmin");
        request.setPassword("WrongPassword!");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid username or password"));
    }

    @Test
    void testLoginBruteForceRateLimiting_SixthAttemptReturns429() throws Exception {
        AuthRequest request = new AuthRequest();
        request.setUsername("testadmin");
        request.setPassword("WrongPassword!");
        String json = objectMapper.writeValueAsString(request);

        // 5 consecutive failed attempts
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/v1/auth/login")
                            .header("X-Forwarded-For", "192.168.1.100")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isUnauthorized());
        }

        // 6th attempt should be blocked with 429
        mockMvc.perform(post("/api/v1/auth/login")
                        .header("X-Forwarded-For", "192.168.1.100")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testTokenRevocationOnLogout_InvalidatesToken() throws Exception {
        // 1. Login to get token with tokenVersion 1
        AuthRequest loginReq = new AuthRequest();
        loginReq.setUsername("testadmin");
        loginReq.setPassword("Password123!");

        String loginResponse = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(loginResponse).path("data").path("token").asText();

        // 2. Token works initially for protected endpoint
        mockMvc.perform(get("/api/v1/admin/menu/items")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        // 3. User logs out (POST /api/v1/auth/logout with token)
        mockMvc.perform(post("/api/v1/auth/logout")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        // 4. Old token is now rejected with 403 because token_version was incremented
        mockMvc.perform(get("/api/v1/admin/menu/items")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void testProtectedEndpointNoAuthHeader_Returns403() throws Exception {
        mockMvc.perform(get("/api/v1/admin/menu/items"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testProtectedEndpointMalformedJwt_Returns403() throws Exception {
        mockMvc.perform(get("/api/v1/admin/menu/items")
                        .header("Authorization", "Bearer malformed_jwt_token_string"))
                .andExpect(status().isForbidden());
    }

    // 2. Authorization & Role Protection
    @Test
    @WithMockUser(username = "regularuser", roles = {"USER"})
    void testAdminEndpointWithNonAdminRole_Returns403() throws Exception {
        mockMvc.perform(get("/api/v1/admin/menu/items"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "testadmin", roles = {"ADMIN"})
    void testAdminEndpointWithAdminRole_Allowed() throws Exception {
        mockMvc.perform(get("/api/v1/admin/menu/items"))
                .andExpect(status().isOk());
    }

    // 3. Reservation Abuse Protection (4th request -> 429)
    @Test
    void testReservationRateLimiting_FourthRequestReturns429() throws Exception {
        ReservationRequest request = new ReservationRequest();
        request.setGuestName("Test Guest");
        request.setGuestPhone("9876543210");
        request.setReservationDate(LocalDate.now().plusDays(1));
        request.setReservationTime(LocalTime.of(19, 0));
        request.setNumberOfGuests(2);

        String json = objectMapper.writeValueAsString(request);

        // Requests 1, 2, 3 with different times to test rate-limit without triggering duplicate check
        for (int i = 0; i < 3; i++) {
            request.setReservationTime(LocalTime.of(18 + i, 0));
            mockMvc.perform(post("/api/v1/reservations")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated());
        }

        // Request 4 -> 429 TOO_MANY_REQUESTS
        request.setReservationTime(LocalTime.of(22, 0));
        mockMvc.perform(post("/api/v1/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testReservationDuplicateDetection_RejectsDuplicateRequest() throws Exception {
        ReservationRequest request = new ReservationRequest();
        request.setGuestName("Test Guest");
        request.setGuestPhone("9123456780");
        request.setReservationDate(LocalDate.now().plusDays(2));
        request.setReservationTime(LocalTime.of(20, 0));
        request.setNumberOfGuests(4);

        String json = objectMapper.writeValueAsString(request);

        // First attempt succeeds
        mockMvc.perform(post("/api/v1/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated());

        // Exact duplicate attempt is rejected with 400
        mockMvc.perform(post("/api/v1/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("A reservation request for this phone number, date, and time already exists."));
    }

    // 4. Upload Security Verification
    @Test
    void testUnauthenticatedUpload_Returns403() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0});
        mockMvc.perform(multipart("/api/v1/admin/uploads/image").file(file))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "testadmin", roles = {"ADMIN"})
    void testInvalidFileFormatUpload_Returns400() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "malicious.exe", "application/x-msdownload", new byte[]{0x4D, 0x5A, 0, 0});
        mockMvc.perform(multipart("/api/v1/admin/uploads/image").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @WithMockUser(username = "testadmin", roles = {"ADMIN"})
    void testSvgUpload_Rejected() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "image.svg", "image/svg+xml", "<svg></svg>".getBytes());
        mockMvc.perform(multipart("/api/v1/admin/uploads/image").file(file))
                .andExpect(status().isBadRequest());
    }

    // 5. Delete Authorization
    @Test
    void testUnauthenticatedDelete_Returns403() throws Exception {
        mockMvc.perform(delete("/api/v1/admin/menu/items/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "regularuser", roles = {"USER"})
    void testNonAdminDelete_Returns403() throws Exception {
        mockMvc.perform(delete("/api/v1/admin/menu/items/1"))
                .andExpect(status().isForbidden());
    }

    // 6. Security Headers Verification
    @Test
    void testSecurityHeadersPresent() throws Exception {
        mockMvc.perform(get("/api/v1/public/settings"))
                .andExpect(status().isOk())
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(header().string("X-Frame-Options", "SAMEORIGIN"));
    }
}
