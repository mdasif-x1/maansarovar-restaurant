-- Migration V3: Add indexes for query performance, status filtering, and rate limiting lookups

-- Reservations: speed up admin status filtering and rate limiting lookups
CREATE INDEX idx_reservations_status_created ON reservations(status, created_at DESC);
CREATE INDEX idx_reservations_phone_created ON reservations(guest_phone, created_at);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);

-- Menu items: speed up category filtering and availability queries
CREATE INDEX idx_menu_items_category_available ON menu_items(category_id, is_available, display_order);
CREATE INDEX idx_menu_items_available ON menu_items(is_available, display_order);

-- Gallery images: speed up category filtering and active status ordering
CREATE INDEX idx_gallery_images_category_active ON gallery_images(category, is_active, display_order);
CREATE INDEX idx_gallery_images_active ON gallery_images(is_active, display_order);
