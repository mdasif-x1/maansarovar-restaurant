-- Migration V1: Initial Schema and Seed Data for The Maansarovar Restaurant & Food Court

CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menu_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menu_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id BIGINT NOT NULL,
    is_vegetarian BOOLEAN DEFAULT TRUE,
    is_chef_special BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Ambience', -- Food, Ambience, Family Dining, Events
    image_url VARCHAR(255) NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS featured_dishes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id BIGINT NOT NULL UNIQUE,
    subtitle VARCHAR(200),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(100) NOT NULL,
    guest_phone VARCHAR(20) NOT NULL,
    guest_email VARCHAR(100),
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_guests INT NOT NULL,
    occasion VARCHAR(50) DEFAULT 'Regular Dining',
    special_request TEXT,
    status VARCHAR(30) DEFAULT 'NEW', -- NEW, CONTACTED, CONFIRMED, CLOSED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS restaurant_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    setting_group VARCHAR(50) DEFAULT 'general',
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS testimonials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) DEFAULT 'Lakhimpur Kheri',
    rating INT NOT NULL DEFAULT 5,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- SEED DATA (Confirmed Settings Only)
-- ========================================================

-- Restaurant Settings Seed (Only Verified Details)
INSERT INTO restaurant_settings (setting_key, setting_value, setting_group, description) VALUES
('restaurant_name', 'The Maansarovar Restaurant & Food Court', 'general', 'Official business name'),
('tagline', '', 'general', 'Hero headline tagline'),
('address', 'Beside Zila Panchayat Amrit Sarovar, Sitapur–Lakhimpur Road, Kheri, Lakhimpur Kheri, Uttar Pradesh 262701, India', 'contact', 'Full physical address'),
('phone', '', 'contact', 'Primary contact phone number'),
('whatsapp', '', 'contact', 'WhatsApp reservation number'),
('email', '', 'contact', 'Public inquiry email address'),
('opening_hours', '9:00 AM – 11:00 PM', 'general', 'Daily operational timing text'),
('map_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3521.8485293215887!2d80.75036707616147!3d27.88056637608298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399f33a6d34555b7%3A0x99939f92dff58296!2sThe%20Maansarovar%20Restaurant%20%26%20food%20court!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin', 'location', 'Google Maps Embed URL'),
('google_maps_direct', 'https://www.google.com/maps/place/The+Maansarovar+Restaurant+%26+food+court/@27.8805663,80.7335013,15z/data=!4m10!1m2!2m1!1sRestaurants!3m6!1s0x399f33a6d34555b7:0x99939f92dff58296!8m2!3d27.8805663!4d80.7525557!15sCgtSZXN0YXVyYW50c1oNIgtyZXN0YXVyYW50c5IBCnJlc3RhdXJhbnTgAQA!16s%2Fg%2F11vm5__jmb', 'location', 'Direct Google Maps listing link'),
('menu_notice', 'Our menu will be available soon.', 'general', 'Menu availability notice text'),
('social_facebook', '', 'social', 'Facebook page URL'),
('social_instagram', '', 'social', 'Instagram profile URL'),
('social_tripadvisor', '', 'social', 'TripAdvisor listing URL')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

