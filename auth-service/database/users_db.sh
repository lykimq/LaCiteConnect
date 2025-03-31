#!/bin/bash

# Variables
DB_NAME="auth_service"  # Replace with your actual database name
DB_USER="postgres"        # Replace with your database user
DB_PASSWORD="Praise_God" # Replace with your database password

# Export environment variables for PostgreSQL connection
export PGPASSWORD=$DB_PASSWORD

# Connect to PostgreSQL and run the schema script
echo "Starting schema setup..."

psql -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

psql -U $DB_USER -d $DB_NAME -c "
-- Define the ENUM type for roles
CREATE TYPE IF NOT EXISTS role_type AS ENUM ('guest', 'user', 'admin');

-- Define the ENUM type for session types
CREATE TYPE IF NOT EXISTS session_type_enum AS ENUM ('session', 'persistent');
"

psql -U $DB_USER -d $DB_NAME -f users_schema.sql

echo "Database schema setup completed successfully!"

# Regenerating indexes for better performance (optional)
psql -U $DB_USER -d $DB_NAME -c "
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_first_name ON users (first_name);
CREATE INDEX IF NOT EXISTS idx_users_last_name ON users (last_name);
CREATE INDEX IF NOT EXISTS idx_users_full_name ON users (full_name);
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users (phone_number);
"

echo "Indexes for performance created successfully!"
