-- Migration V2: Add image metadata fields to menu_items table
ALTER TABLE menu_items ADD COLUMN image_alt_text VARCHAR(255);
ALTER TABLE menu_items ADD COLUMN image_source_type VARCHAR(50) DEFAULT 'OWNER_PHOTO';
