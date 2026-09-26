-- Migration V5: Add compound index for duplicate reservation lookup (guest_phone, reservation_date, reservation_time)
CREATE INDEX idx_reservations_duplicate_lookup ON reservations(guest_phone, reservation_date, reservation_time);
