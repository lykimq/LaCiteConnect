#!/bin/bash

# Variables
DB_NAME="auth_service"
DB_USER="quyen"
DB_PASSWORD="Praise_God"

# Function to check if last command was successful
check_error() {
    if [ $? -ne 0 ]; then
        echo "Error: $1"
        exit 1
    fi
}

# Function to check if database exists
check_database() {
    if ! psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
        echo "Database $DB_NAME does not exist. Creating..."
        createdb "$DB_NAME"
        check_error "Failed to create database"
    fi
}

# Export password for PostgreSQL connection
export PGPASSWORD="$DB_PASSWORD"

# Check if PostgreSQL is running
pg_isready
check_error "PostgreSQL is not running"

# Check and create database if needed
check_database

# Connect to PostgreSQL and run the schema script
echo "Starting schema setup..."

# Create extension if not exists
psql -h localhost -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
check_error "Failed to create uuid-ossp extension"

# Create ENUM types
psql -h localhost -U $DB_USER -d $DB_NAME -c "
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
check_error "Failed to create ENUM types"

# Run the schema script
psql -h localhost -U $DB_USER -d $DB_NAME -f users_schema.sql
check_error "Failed to create schema"

echo "Database schema setup completed successfully!"

# Create indexes for better performance
psql -h localhost -U $DB_USER -d $DB_NAME -c "
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email_lower') THEN
        CREATE UNIQUE INDEX idx_users_email_lower ON users (LOWER(email));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_first_name') THEN
        CREATE INDEX idx_users_first_name ON users (first_name);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_last_name') THEN
        CREATE INDEX idx_users_last_name ON users (last_name);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_full_name') THEN
        CREATE INDEX idx_users_full_name ON users (full_name);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_phone_number') THEN
        CREATE INDEX idx_users_phone_number ON users (phone_number);
    END IF;
END \$\$;
"
check_error "Failed to create indexes"

echo "Indexes for performance created successfully!"

# Clear the password from environment
unset PGPASSWORD
