#!/bin/bash

# Database setup script for LaCiteConnect
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

# Function to check if database exists
check_database_exists() {
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME
}

# Function to create database if it doesn't exist
create_database() {
    if ! check_database_exists; then
        echo "Creating database $DB_NAME..."
        createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
    else
        echo "Database $DB_NAME already exists."
    fi
}

# Function to create ENUM types
create_enum_types() {
    echo "Creating ENUM types..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
        DO \$\$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_type') THEN
                CREATE TYPE role_type AS ENUM ('guest', 'user', 'admin');
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'session_type_enum') THEN
                CREATE TYPE session_type_enum AS ENUM ('session', 'persistent');
            END IF;
        END \$\$;
    "
}

# Function to create indexes
create_indexes() {
    echo "Creating indexes..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
        -- Create indexes if they don't exist
        DO \$\$
        BEGIN
            -- Email index
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email_lower') THEN
                CREATE UNIQUE INDEX idx_users_email_lower ON users (LOWER(email));
            END IF;

            -- Name indexes
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_first_name') THEN
                CREATE INDEX idx_users_first_name ON users (first_name);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_last_name') THEN
                CREATE INDEX idx_users_last_name ON users (last_name);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_full_name') THEN
                CREATE INDEX idx_users_full_name ON users (full_name);
            END IF;

            -- Phone number index
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_phone_number') THEN
                CREATE INDEX idx_users_phone_number ON users (phone_number);
            END IF;

            -- Password reset indexes
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_password_reset_token') THEN
                CREATE INDEX idx_users_password_reset_token ON users (password_reset_token);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_password_reset_expiry') THEN
                CREATE INDEX idx_users_password_reset_expiry ON users (password_reset_expiry);
            END IF;
        END \$\$;
    "
}

# Function to run schema setup
run_schema_setup() {
    echo "Running schema setup..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f users_schema.sql
}

# Main execution
echo "Starting database setup..."

# Check if PostgreSQL is running
pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER

# Create database
create_database

# Create ENUM types
create_enum_types

# Run schema setup
run_schema_setup

# Create indexes
create_indexes

# Clear the password from environment
unset PGPASSWORD

echo "Database setup completed successfully."
