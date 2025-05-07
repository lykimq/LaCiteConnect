#!/bin/bash

# Database setup script for LaCiteConnect Events
# This script creates the database and runs the schema setup

# Exit on error
set -e

# Database configuration
DB_NAME="auth_service"
DB_USER="quyen"
DB_PASSWORD="Praise_God"
DB_HOST="localhost"
DB_PORT="5432"

# Export password for PostgreSQL connection
export PGPASSWORD="$DB_PASSWORD"

# Function to create ENUM types
create_enum_types() {
    echo "Creating ENUM types for events..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
        DO \$\$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
                CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'registration_status') THEN
                CREATE TYPE registration_status AS ENUM ('pending', 'confirmed', 'cancelled', 'waitlisted');
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
                CREATE TYPE notification_type AS ENUM ('email', 'sms', 'push', 'all');
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'time_slot_status') THEN
                CREATE TYPE time_slot_status AS ENUM ('available', 'reserved', 'full', 'cancelled');
            END IF;
        END \$\$;
    "
}

# Function to create indexes
create_indexes() {
    echo "Creating indexes for events..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
        -- Create indexes if they don't exist
        DO \$\$
        BEGIN
            -- Events indexes
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_events_status') THEN
                CREATE INDEX idx_events_status ON events(status);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_events_dates') THEN
                CREATE INDEX idx_events_dates ON events(start_time, end_time);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_events_created_by') THEN
                CREATE INDEX idx_events_created_by ON events(created_by);
            END IF;

            -- Time slots indexes
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_time_slots_event') THEN
                CREATE INDEX idx_time_slots_event ON event_time_slots(event_id);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_time_slots_status') THEN
                CREATE INDEX idx_time_slots_status ON event_time_slots(status);
            END IF;

            -- Registrations indexes
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_registrations_event') THEN
                CREATE INDEX idx_registrations_event ON event_registrations(event_id);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_registrations_user') THEN
                CREATE INDEX idx_registrations_user ON event_registrations(user_id);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_registrations_status') THEN
                CREATE INDEX idx_registrations_status ON event_registrations(registration_status);
            END IF;

            -- Notification preferences indexes
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notification_preferences_registration') THEN
                CREATE INDEX idx_notification_preferences_registration ON event_notification_preferences(registration_id);
            END IF;

            -- Event shares indexes
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_event_shares_event') THEN
                CREATE INDEX idx_event_shares_event ON event_shares(event_id);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_event_shares_user') THEN
                CREATE INDEX idx_event_shares_user ON event_shares(shared_by);
            END IF;
        END \$\$;
    "
}

# Function to run schema setup
run_schema_setup() {
    echo "Running events schema setup..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f events_schema.sql
}

# Main execution
echo "Starting events database setup..."

# Check if PostgreSQL is running
pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER

# Create ENUM types
create_enum_types

# Run schema setup
run_schema_setup

# Create indexes
create_indexes

# Clear the password from environment
unset PGPASSWORD

echo "Events database setup completed successfully."