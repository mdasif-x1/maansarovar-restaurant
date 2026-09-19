# The Maansarovar Restaurant & Food Court

## Full-Stack Restaurant Website & Management Platform

This repository is a full-stack web application showcase featuring a modern, responsive customer-facing website for a dining establishment alongside a secure, authenticated management dashboard. Built as a portfolio project, it demonstrates complete end-to-end business web development — from custom editorial design and table reservations to JWT-secured administrative content management, server-side validation, database migrations, and containerized deployment.

---

## Project Overview

**The Maansarovar Restaurant & Food Court** project is designed to bridge the gap between static promotional landing pages and complex web applications. It provides restaurant customers with an intuitive digital menu, photo gallery, location details, and table booking request form, while empowering business owners to manage menu categories, dish availability, gallery photos, operating hours, and customer reservations in real time without needing code changes or redeployments.

---

## What This Project Demonstrates

- **Responsive Frontend Development**: Custom React single-page application built with TypeScript, Tailwind CSS, and Vite.
- **Restaurant-Oriented UI/UX**: Warm, editorial visual design tailored for hospitality branding, avoiding generic SaaS or AI web template tropes.
- **Table Reservation Workflow**: Server-validated booking system with operating hours enforcement, past date validation, and IP rate limiting.
- **Secure Admin Dashboard**: Authenticated control panel with tabbed navigation for managing business operations.
- **Menu Management**: Dynamic CRUD management for menu items, pricing, availability, and categories.
- **Gallery Management**: Administrative photo gallery curation and metadata management.
- **Restaurant Settings Management**: Dynamic configuration for restaurant operating hours, address, phone, taglines, and branding banners.
- **Secure Image Upload Architecture**: Backend file upload pipeline supporting magic-byte binary header verification, file size enforcement, UUID renaming, and database reference tracking.
- **Authentication & Authorization**: Stateless JWT token authentication with Spring Security.
- **REST API Architecture**: Standardized REST endpoints built with Spring Boot 3 and documented via Swagger / OpenAPI 3.
- **Database Schema Versioning**: Automated SQL migrations using Flyway DB.
- **Docker Containerization**: Multi-stage Docker builds and Docker Compose orchestration with persistent storage volumes.

---

## Customer Experience

The customer-facing application includes the following verified pages and workflows:

- **Home Page**: Features a hero banner with brand messaging, quick location metadata, business overview, operating hours, table booking form, and interactive map embed.
- **Menu Page**: Provides a structured menu preview notice, categorized dish descriptions, pricing hierarchy, and visiting hours info.
- **Gallery Page**: Displays an editorial visual grid showcasing food and ambience photography with clean disclosure notices.
- **About Us**: Presents the restaurant story, location verification, operating hours, and direct booking links.
- **Contact & Bookings**: Combines direct contact quick-actions (Call, WhatsApp, Google Maps directions), verified address information, and the interactive table reservation form.
- **Reservation Request**: Interactive booking form allowing guests to select party size, reservation date, preferred dining time, and special requests.
- **Responsive Mobile Experience**: Dedicated mobile navigation drawer, fluid typography scaling, and touch-friendly interactive controls.

---

## Admin Management

The authenticated admin dashboard provides the following capabilities:

- **Authentication**: Secure admin login page (`/admin/login`) issuing JWT access tokens.
- **Reservation Management**: Filter table requests by status (`ALL`, `NEW`, `CONTACTED`, `CONFIRMED`, `CLOSED`), review customer contact info, update booking status, or remove records.
- **Menu Management**: Create, update, or delete menu items and categories, toggle dish availability, and set chef specials.
- **Gallery Management**: Manage gallery photo entries, captions, and category tags.
- **Restaurant Settings**: Live configuration of restaurant branding, contact phone, email, address, tagline, and operating hours.
- **Media Asset Management**: Upload owner dish photos, logos, or hero banners with reference checking before deletion to prevent broken links.

---

## Security & Engineering

- **Stateless JWT Authentication**: Spring Security handles admin endpoints via Bearer token verification.
- **Admin Authorization**: Protected endpoints require valid JWT credentials; unauthorized requests receive HTTP 401 / 403 responses.
- **Server-Side Request Validation**: Input data validated using Jakarta Validation constraints (`@NotBlank`, `@Email`, `@NotNull`).
- **Reservation Logic Validation**: Backend validates that reservation dates are not in the past and reservation times fall within business operating hours (11:00 AM – 11:00 PM).
- **IP Rate Limiting**: Reservation submission endpoint enforces rate limiting to prevent spam requests (returning HTTP 429 Too Many Requests when limits are exceeded).
- **Image Magic-Byte Validation**: Backend inspects raw binary file headers (magic bytes) to verify genuine `JPEG`, `PNG`, or `WebP` files, rejecting disguised executable or script files.
- **File-Size Restrictions**: Upload pipeline enforces a strict 5 MB file size ceiling.
- **UUID Filenames**: Uploaded files are renamed using UUIDs (`[uuid].[ext]`) to eliminate file overwrites.
- **Path Traversal Protection**: Filename sanitization prevents directory traversal attacks (`../`).
- **Reference-Aware Image Deletion**: Image management API verifies database references prior to deleting physical files from disk.
- **Flyway Migrations**: Relational schema versioning (`V1__init_schema.sql`, `V2__...`) executes automatically on backend boot.
- **Docker Volume Persistence**: MySQL data and uploaded media assets reside in persistent named Docker volumes (`mysql_data`, `uploads_data`).

---

## UI/UX Direction

The interface adheres to an intentional, human-designed hospitality aesthetic:

- **Visual Mood**: Warm Indian hospitality identity featuring rich charcoal (`#1C1917`), cream/ivory surfaces (`#FAF8F5`, `#F5F2EC`), deep forest green (`#1B3628`), and restrained warm saffron accents (`#C8782A`).
- **Typography System**: *Cormorant Garamond* serif for display headings and brand titles, paired with *Inter / Manrope* sans-serif for readable body text, form controls, and labels.
- **Editorial Layout**: Asymmetrical editorial spacing, subtle border lines (`border-cream-300/80`), and restrained container shadows (`shadow-subtle`) instead of generic SaaS template cards.
- **Restrained Motion**: Subtle hover color shifts and quiet drawer transitions without distracting animations or parallax clutter.
- **Responsive Adaptability**: Desktop and mobile layouts designed independently for touch usability and typography balance.

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, React Router DOM v6 |
| **Backend** | Java 21, Spring Boot 3.2, Spring Security, JWT (JJWT 0.12), Jakarta Validation |
| **Database** | MySQL 8.0, Spring Data JPA / Hibernate, Flyway DB Migrations |
| **DevOps & Storage** | Docker, Docker Compose, Persistent Docker Volumes, Nginx Reverse Proxy |
| **Documentation & Tests** | Swagger / OpenAPI 3 (`/swagger-ui.html`), JUnit 5, Mockito |

---

## Architecture

```
[ Client Browser ]
       │
       ▼
[ Nginx Reverse Proxy / Vite Dev Server (Port 3000 / 5173) ]
       │
       ├──► Public Static Assets & Uploads (/uploads/...)
       │
       ▼
[ Spring Boot Backend API (Port 8080) ]
       │
       ├──► Spring Security & JWT Filter
       ├──► Validation & Rate Limiter
       ├──► Image Upload Service (Magic-byte check → Storage Volume)
       │
       ▼
[ MySQL 8.0 Database (Port 3306) ]
```

---

## Local Development

### Prerequisites
- **Node.js**: v20 or v24+
- **Java**: OpenJDK 21
- **Maven**: 3.9+
- **MySQL**: 8.0 (running locally on port 3306 or via Docker)

### 1. Database Setup
Create the MySQL database:
```sql
CREATE DATABASE maansarovar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Service
In PowerShell / Terminal:
```powershell
cd backend
mvn spring-boot:run
```
- **Backend API**: `http://localhost:8080`
- **Swagger API Docs**: `http://localhost:8080/swagger-ui.html`
- **Actuator Health Check**: `http://localhost:8080/actuator/health`

### 3. Frontend Service
In a new PowerShell / Terminal window:
```powershell
cd frontend
npm install
npm run dev
```
- **Vite Dev Server**: `http://localhost:5173` (or `http://localhost:3000` via Docker)

---

## Docker Deployment

To build and launch all services in containerized production mode using Docker Compose:

```powershell
docker compose up --build
```

### Containers & Ports
- `maansarovar_frontend`: Port `3000:80` (Nginx serving built React app & proxying API/uploads)
- `maansarovar_backend`: Port `8080:8080` (Spring Boot API)
- `maansarovar_mysql`: Port `3308:3306` (MySQL Database with persistent volume)

---

## Environment Variables

Copy `.env.example` (or create a `.env` file in the project root) to configure environment variables. Secrets should be customized per environment:

```env
# Database Credentials
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_DATABASE=maansarovar_db
MYSQL_USER=maansarovar_app
MYSQL_PASSWORD=your_secure_app_password

# JWT Security
JWT_SECRET=your_base64_encoded_256bit_secret_key

# Initial Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password
ADMIN_EMAIL=admin@maansarovar.com

# CORS & Upload Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
UPLOAD_DIR=/app/uploads
```

*Note: Never commit sensitive `.env` files containing production secrets to public source control.*

---

## Verification & Auditing

This application has undergone production audit verification:

- **Frontend Production Build**: `npm run build` verified with 0 TypeScript compilation errors.
- **Backend Test Suite**: Automated JUnit 5 & Mockito test suite passed.
- **Docker Compose Startup**: Verified container builds, database initialization, Flyway migration execution, and backend health status.
- **Browser Automation Verification**: Automated Chrome headless test suite (`puppeteer-core`) verified 16/16 UI checks across Desktop (1280×800) and Mobile (375×667) viewports.
- **Security Audit**: Scanned repository for exposed API keys, private keys, and hardcoded credentials (`0` leaked secrets).

---

## Screenshots

> *Screen captures captured during automated browser verification:*

### Desktop Experience
- **Home Page**: Hero section with Cormorant Garamond typography and location metadata.
- **Menu Preview**: Editorial dish layout and visiting hours preview.
- **Gallery**: Photo grid showcasing food and ambience photography.
- **Reservation Form**: Form controls for date, time, party size, and special requests.
- **Admin Dashboard**: Authenticated management interface for reservations, menu, gallery, and settings.

### Mobile Experience
- **Mobile Viewport & Navigation Drawer**: Slide-out mobile drawer with quick action buttons for calling and table booking.

---

## Portfolio Note

This repository demonstrates the capacity to design, architect, build, audit, and containerize a complete, business-grade web application with both public client-facing UX and secure background management systems.

*Built as a full-stack web development portfolio project.*
