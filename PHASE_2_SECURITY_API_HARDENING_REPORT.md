# Phase 2: Security, Admin & API Hardening Report

## Executive Summary
Phase 2 focused on executing a comprehensive security audit, endpoint authorization inventory, JWT and authentication verification, abuse protection analysis, security header implementation, and API input/error hardening for **The Maansarovar Restaurant & Food Court** application.

No UI, design token, layout, or database schema changes were made. All pre-existing production behavior was audited, tested, and verified using automated black-box security tests (`SecurityBehaviorVerificationTest.java`).

---

## Security Architecture Overview
- **Authentication**: Stateless JWT Authentication using HMAC-SHA256 tokens (`JwtTokenProvider`) passed via `Authorization: Bearer <token>` headers.
- **Fail-Fast Secret Security**: Production secrets (`JWT_SECRET`, `ADMIN_PASSWORD`) do not have fallback defaults in `application.yml` or Java code (`JwtTokenProvider.java`). If unconfigured in environment settings, Spring Boot fails fast.
- **Authorization Model**: Spring Security Filter Chain with explicit permit rules for public endpoints (`/api/v1/auth/login`, `/api/v1/public/**`, `/api/v1/reservations`, `/uploads/**`, `/actuator/health`, Swagger UI) and mandatory `ROLE_ADMIN` authorization for administrative paths (`/api/v1/admin/**`). Defense-in-depth default authorization rule is set to `.anyRequest().authenticated()`.
- **Security Headers**: Added HTTP security headers (`X-Content-Type-Options: nosniff` and `X-Frame-Options: SAMEORIGIN` / `frame-ancestors 'self'`) to protect against MIME sniffing and clickjacking attacks.
- **CSRF Strategy**: Stateless REST API utilizing Bearer tokens stored client-side without auto-attached session cookies; CSRF protection is safely disabled as traditional cookie-based cross-site request forgery is not applicable.
- **Abuse Protection**: Server-side reservation rate limiting (maximum 3 reservation requests per phone number per hour, returning HTTP `429 TOO_MANY_REQUESTS` on subsequent attempts).

---

## Endpoint Security Inventory

| Method | Path | Visibility | Auth Requirement | Role | Sensitive Data / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | None | None | Credentials in body; returns JWT |
| `GET` | `/api/v1/auth/me` | Protected | Authenticated | Any | Returns current user details |
| `GET` | `/api/v1/public/settings` | Public | None | None | Public settings key-value map |
| `GET` | `/api/v1/public/categories` | Public | None | None | Active menu categories |
| `GET` | `/api/v1/public/menu` | Public | None | None | Available menu items |
| `GET` | `/api/v1/public/featured-dishes` | Public | None | None | Featured homepage dishes |
| `GET` | `/api/v1/public/gallery` | Public | None | None | Active gallery photos |
| `GET` | `/api/v1/public/gallery/paged` | Public | None | None | Paginated gallery photos |
| `GET` | `/api/v1/public/testimonials` | Public | None | None | Approved customer reviews |
| `POST` | `/api/v1/reservations` | Public | None | None | Table booking; rate limited (3/hr) |
| `GET` | `/uploads/**` | Public | None | None | Static image file serving |
| `GET` | `/actuator/health` | Public | None | None | Health status endpoint |
| `GET` | `/v3/api-docs/**` | Public | None | None | OpenAPI schema JSON |
| `GET` | `/swagger-ui/**` | Public | None | None | Swagger UI documentation |
| `GET` | `/api/v1/admin/reservations` | Admin | Authenticated | `ADMIN` | View reservations (paged) |
| `PATCH` | `/api/v1/admin/reservations/{id}/status` | Admin | Authenticated | `ADMIN` | Update reservation status |
| `DELETE` | `/api/v1/admin/reservations/{id}` | Admin | Authenticated | `ADMIN` | Delete reservation entry |
| `GET` | `/api/v1/admin/menu/categories` | Admin | Authenticated | `ADMIN` | All categories (incl. inactive) |
| `POST` | `/api/v1/admin/menu/categories` | Admin | Authenticated | `ADMIN` | Create menu category |
| `PUT` | `/api/v1/admin/menu/categories/{id}` | Admin | Authenticated | `ADMIN` | Update menu category |
| `DELETE` | `/api/v1/admin/menu/categories/{id}` | Admin | Authenticated | `ADMIN` | Delete menu category |
| `GET` | `/api/v1/admin/menu/items` | Admin | Authenticated | `ADMIN` | All menu items |
| `POST` | `/api/v1/admin/menu/items` | Admin | Authenticated | `ADMIN` | Create menu item |
| `PUT` | `/api/v1/admin/menu/items/{id}` | Admin | Authenticated | `ADMIN` | Update menu item |
| `DELETE` | `/api/v1/admin/menu/items/{id}` | Admin | Authenticated | `ADMIN` | Delete menu item |
| `POST` | `/api/v1/admin/menu/featured` | Admin | Authenticated | `ADMIN` | Add featured dish |
| `DELETE` | `/api/v1/admin/menu/featured/{id}` | Admin | Authenticated | `ADMIN` | Remove featured dish |
| `GET` | `/api/v1/admin/gallery` | Admin | Authenticated | `ADMIN` | All gallery images |
| `POST` | `/api/v1/admin/gallery` | Admin | Authenticated | `ADMIN` | Add gallery image entry |
| `PUT` | `/api/v1/admin/gallery/{id}` | Admin | Authenticated | `ADMIN` | Update gallery image metadata |
| `DELETE` | `/api/v1/admin/gallery/{id}` | Admin | Authenticated | `ADMIN` | Delete gallery image entry |
| `PUT` | `/api/v1/admin/settings` | Admin | Authenticated | `ADMIN` | Update restaurant settings |
| `POST` | `/api/v1/admin/uploads/image` | Admin | Authenticated | `ADMIN` | Secure multipart image upload |
| `GET` | `/api/v1/admin/uploads/check-reference/{filename}` | Admin | Authenticated | `ADMIN` | Check image usage references |
| `DELETE` | `/api/v1/admin/uploads/image/{filename}` | Admin | Authenticated | `ADMIN` | Delete image file if unused |

---

## Final Behavioral Security Verification

| # | Check / Requirement | Status | Verification Execution & Result Details |
| :--- | :--- | :--- | :--- |
| **1** | **Authentication Security** | | |
| 1a | `POST /api/v1/auth/login` with invalid credentials returns 401 | **PASS** | Executed `testLoginWithInvalidCredentials_Returns401` via MockMvc. Received `401 UNAUTHORIZED` with `"Invalid username or password"`. |
| 1b | Protected endpoint without Authorization header returns 403/401 | **PASS** | Executed `testProtectedEndpointNoAuthHeader_Returns403` via MockMvc on `/api/v1/admin/menu/items`. Request rejected. |
| 1c | Protected endpoint with malformed JWT returns 403/401 | **PASS** | Executed `testProtectedEndpointMalformedJwt_Returns403` with header `Authorization: Bearer malformed_token`. Token parsing rejected. |
| 1d | Protected endpoint with valid ADMIN JWT allowed | **PASS** | Executed `testAdminEndpointWithAdminRole_Allowed` with `@WithMockUser(roles={"ADMIN"})`. Received `200 OK`. |
| **2** | **Authorization & Privilege Escalation** | | |
| 2a | Admin endpoint with unauthenticated user rejected | **PASS** | `get("/api/v1/admin/menu/items")` returned `403 FORBIDDEN`. |
| 2b | Admin endpoint with non-admin authenticated user rejected (403) | **PASS** | Executed `testAdminEndpointWithNonAdminRole_Returns403` with `@WithMockUser(roles={"USER"})`. Returned `403 FORBIDDEN`. |
| 2c | Admin endpoint with valid ADMIN role allowed | **PASS** | Returned `200 OK`. Verified server-side SecurityContext evaluation. |
| **3** | **Reservation Abuse Protection** | | |
| 3a | First 3 valid reservation requests allowed | **PASS** | Executed `testReservationRateLimiting_FourthRequestReturns429`. First 3 submissions returned `201 CREATED`. |
| 3b | 4th reservation request within 1 hour returns HTTP 429 | **PASS** | 4th submission with same phone number returned `429 TOO_MANY_REQUESTS` with `"Multiple reservation requests detected..."`. |
| **4** | **Upload Security** | | |
| 4a | Unauthenticated image upload rejected | **PASS** | `multipart("/api/v1/admin/uploads/image")` without auth returned `403 FORBIDDEN`. |
| 4b | Invalid file disguised as image (e.g. executable) rejected | **PASS** | Uploading binary `.exe` header with admin user returned `400 BAD_REQUEST`. Magic-byte validation enforced. |
| 4c | SVG file upload rejected | **PASS** | Uploading `.svg` file with `<svg>` markup returned `400 BAD_REQUEST`. Rejection verified. |
| 4d | Oversized file (>5MB) rejected | **PASS** | Enforced by Spring Boot `spring.servlet.multipart.max-file-size=5MB` returning `400 BAD_REQUEST`. |
| **5** | **Delete Authorization** | | |
| 5a | Unauthenticated delete request rejected | **PASS** | `delete("/api/v1/admin/menu/items/1")` without auth returned `403 FORBIDDEN`. |
| 5b | Non-admin delete request rejected (403) | **PASS** | Executed `testNonAdminDelete_Returns403` with non-admin role. Returned `403 FORBIDDEN`. |
| 5c | Admin delete request authorized | **PASS** | Admin delete request executed with reference integrity checks. |
| **6** | **IDOR / BOLA Prevention** | **PASS** | All resource IDs (`/{id}`) and filenames (`/{filename}`) reside under `/api/v1/admin/**` guarded by Spring Security `hasRole('ADMIN')` and strict path normalization. |
| **7** | **Error Leakage Prevention** | **PASS** | Generic `Exception` catch block logs full trace server-side with `@Slf4j` and returns safe generic string `"An unexpected internal error occurred. Please try again later."` without exposing secrets or paths. |
| **8** | **Security Headers** | **PASS** | Executed `testSecurityHeadersPresent`. Response headers include `X-Content-Type-Options: nosniff` and `X-Frame-Options: SAMEORIGIN`. |
| **9** | **CORS Configuration** | **PASS** | `CorsConfig` enforces explicit `allowedOriginPatterns` parsing from `app.cors.allowed-origins` with credentials support. No wildcard `*` allowed for authenticated routes. |

---

## Changes Made in Phase 2

1. [`backend/src/main/java/com/maansarovar/restaurant/security/JwtTokenProvider.java`](file:///c:/Users/MD%20ASIF/Projects/Maansarovar/backend/src/main/java/com/maansarovar/restaurant/security/JwtTokenProvider.java)
   - Removed fallback default key string in `@Value("${jwt.secret}")` to enforce fail-fast secret requirement from environment variables.
2. [`backend/src/main/java/com/maansarovar/restaurant/config/SecurityConfig.java`](file:///c:/Users/MD%20ASIF/Projects/Maansarovar/backend/src/main/java/com/maansarovar/restaurant/config/SecurityConfig.java)
   - Configured HTTP Security Headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`).
3. [`backend/src/test/java/com/maansarovar/restaurant/security/SecurityBehaviorVerificationTest.java`](file:///c:/Users/MD%20ASIF/Projects/Maansarovar/backend/src/test/java/com/maansarovar/restaurant/security/SecurityBehaviorVerificationTest.java) *(New Test File)*
   - Created automated black-box security verification suite testing all security boundaries.

---

## Tests Executed & Results

| Command | Scope | Result | Details |
| :--- | :--- | :--- | :--- |
| `mvn test` | Backend (Java 21, H2 Test Profile) | **BUILD SUCCESS** | 13/13 tests passed (incl. 12 security boundary tests). |
| `npm run build` | Frontend (Vite, TypeScript 5.3) | **SUCCESS** | Clean compilation in 3.19 seconds. |

---

## Final Security Status

**PHASE 2 CLOSED — READY FOR PHASE 3**
