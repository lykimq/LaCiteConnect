-- events_schema.sql

-- Ensure the uuid-ossp extension is available for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define ENUM types for events
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE registration_status AS ENUM ('pending', 'confirmed', 'cancelled', 'waitlisted');
CREATE TYPE notification_type AS ENUM ('email', 'sms', 'push', 'all');
CREATE TYPE time_slot_status AS ENUM ('available', 'reserved', 'full', 'cancelled');

-- Create events table
CREATE TABLE events (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    picture_url TEXT,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status event_status DEFAULT 'draft' NOT NULL,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    created_by TEXT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Ensure end_time is after start_time
    CONSTRAINT valid_event_times CHECK (end_time > start_time),

    -- Ensure current_participants doesn't exceed max_participants
    CONSTRAINT valid_participant_count CHECK (
        max_participants IS NULL OR current_participants <= max_participants
    )
);

-- Create time slots table for events with multiple sessions
CREATE TABLE event_time_slots (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    max_capacity INTEGER NOT NULL,
    current_capacity INTEGER DEFAULT 0,
    status time_slot_status DEFAULT 'available' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Ensure end_time is after start_time
    CONSTRAINT valid_time_slot_times CHECK (end_time > start_time),

    -- Ensure current_capacity doesn't exceed max_capacity
    CONSTRAINT valid_capacity CHECK (current_capacity <= max_capacity)
);

-- Create event registrations table
CREATE TABLE event_registrations (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    time_slot_id TEXT REFERENCES event_time_slots(id) ON DELETE SET NULL,
    registration_status registration_status DEFAULT 'pending' NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    number_of_guests INTEGER DEFAULT 0,
    additional_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Ensure valid email format
    CONSTRAINT valid_registration_email CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),

    -- Ensure valid phone number format if provided
    CONSTRAINT valid_registration_phone CHECK (
        phone_number IS NULL OR phone_number ~ '^\+?[0-9\s\-]{10,20}$'
    )
);

-- Create notification preferences table
CREATE TABLE event_notification_preferences (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    registration_id TEXT REFERENCES event_registrations(id) ON DELETE CASCADE NOT NULL,
    notification_type notification_type DEFAULT 'email' NOT NULL,
    reminder_time TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create social sharing tracking table
CREATE TABLE event_shares (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    shared_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    platform VARCHAR(50) NOT NULL,
    share_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers to all tables
CREATE TRIGGER update_events_timestamp
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_time_slots_timestamp
    BEFORE UPDATE ON event_time_slots
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_registrations_timestamp
    BEFORE UPDATE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_notification_preferences_timestamp
    BEFORE UPDATE ON event_notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Create indexes for better performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_dates ON events(start_time, end_time);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_time_slots_event ON event_time_slots(event_id);
CREATE INDEX idx_time_slots_status ON event_time_slots(status);
CREATE INDEX idx_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_registrations_user ON event_registrations(user_id);
CREATE INDEX idx_registrations_status ON event_registrations(registration_status);
CREATE INDEX idx_notification_preferences_registration ON event_notification_preferences(registration_id);
CREATE INDEX idx_event_shares_event ON event_shares(event_id);
CREATE INDEX idx_event_shares_user ON event_shares(shared_by);