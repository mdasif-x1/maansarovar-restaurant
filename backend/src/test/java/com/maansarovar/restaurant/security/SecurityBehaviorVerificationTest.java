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

    @BeforeEach
    void setUp() {
        adminUserRepository.deleteAll();
        AdminUser admin = AdminUser.builder()
                .username("testadmin")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .email("testadmin@maansarovar.com")
                .role("ROLE_ADMIN")
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

        // Requests 1, 2, 3 -> 201 CREATED
        for (int i = 0; i < 3; i++) {
            mockMvc.perform(post("/api/v1/reservations")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isCreated());
        }

        // Request 4 -> 429 TOO_MANY_REQUESTS
        mockMvc.perform(post("/api/v1/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.success").value(false));
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
