-- user_schema.sql

-- Ensure the uuid-ossp extension is available for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    -- Unique identifier for each user, uses UUID to prevent enumeration attacks
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Email with unique constraint and case-insensitive indexing
    email VARCHAR(255) UNIQUE NOT NULL,

    -- Password hash stored using bcrypt or Argon2
    password_hash TEXT NOT NULL,

    -- Salt used for password hashing (bcrypt or Argon2 specific)
    password_salt TEXT NOT NULL,

    -- Token for password recovery
    password_reset_token VARCHAR(255),

    -- User's first and last name, used for efficient search
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    -- Full name generated from first_name and last_name for quick search
    full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,

    -- Phone number with a unique constraint
    phone_number VARCHAR(20) UNIQUE,

    -- Validating the phone number format using regex
    CONSTRAINT phone_number_format CHECK (
        phone_number ~ '^\+?[0-9\s\-]{10,20}$'
    ),

    -- Phone region (country code)
    phone_region VARCHAR(10),

    -- User roles, default is 'guest'
    role ENUM('guest', 'user', 'admin') DEFAULT 'guest' NOT NULL,

    -- User privacy settings stored as JSONB
    privacy_settings JSONB DEFAULT '{}'::jsonb,

    -- Session type to determine login persistence (session or persistent)
    session_type ENUM('session', 'persistent') DEFAULT 'session' NOT NULL,

    -- Flag for biometric authentication (fingerprint/face ID)
    biometric_enabled BOOLEAN DEFAULT false,

    -- Timestamp of last login, updated on login
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Profile picture URL for the user's profile
    profile_picture_url TEXT,

    -- Account creation timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Account last updated timestamp, updated automatically
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Check to ensure valid email format and no more than 255 characters
    CONSTRAINT email_format CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        AND LENGTH(email) <= 255
    )
);

-- Trigger to update the 'updated_at' field whenever the user data is modified
CREATE OR REPLACE FUNCTION update_user_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the update_user_timestamp function on UPDATE
CREATE TRIGGER update_user_timestamp_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_user_timestamp();

-- Indexes for fast searches and better performance
CREATE UNIQUE INDEX idx_users_email_lower ON users (LOWER(email));
CREATE INDEX idx_users_first_name ON users (first_name);
CREATE INDEX idx_users_last_name ON users (last_name);
CREATE INDEX idx_users_full_name ON users (full_name);
CREATE INDEX idx_users_phone_number ON users (phone_number);
