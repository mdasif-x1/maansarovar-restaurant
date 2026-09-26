-- Migration V4: Add token_version column for server-side JWT invalidation and revocation upon logout/password reset
ALTER TABLE admin_users ADD COLUMN token_version INT NOT NULL DEFAULT 1;
