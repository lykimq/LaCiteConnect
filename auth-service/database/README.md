# LaCiteConnect Database Documentation

## Overview
This directory contains the database setup and schema for LaCiteConnect's authentication service. The database is built using PostgreSQL and includes tables for user management, authentication, and session handling.

## Prerequisites
- PostgreSQL 12 or higher
- Node.js 16 or higher
- npm or yarn
- psql command-line tool
- Bash shell

## Setup Instructions

### 1. Install Dependencies
```bash
cd auth-service/backend
npm install
# or
yarn install
```

### 2. Configure Database Access
Update these variables in `users_db.sh`:
```bash
DB_NAME="auth_service"
DB_USER="quyen"
DB_PASSWORD="Praise_God"
DB_HOST="localhost"
DB_PORT="5432"
```

### 3. Create and Setup Database
```bash
cd auth-service/database
chmod +x users_db.sh
./users_db.sh
```

### 4. Set Up Admin Credentials
```bash
cd auth-service/backend
# Copy the template to create .env_admin
cp .env_admin.template .env_admin

# Edit .env_admin with your credentials
# Make sure to set proper values for:
# ADMIN_EMAIL_DEV
# ADMIN_PASSWORD_DEV
# ADMIN_FIRST_NAME_DEV
# ADMIN_LAST_NAME_DEV
# ADMIN_SECRET_DEV
```

### 5. Run Prisma Migrations
```bash
cd auth-service/backend
npx prisma migrate dev --name init
```

### 6. Seed the Database
```bash
# First time setup
./scripts/admin-credentials.sh setup

# Update credentials if needed
./scripts/admin-credentials.sh update dev your.email@example.com "First Name" "Last Name"

# Seed the database
./scripts/admin-credentials.sh seed dev

# If you need to reset the admin user
./scripts/admin-credentials.sh reset dev
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**:
   ```bash
   # Verify PostgreSQL is running
   pg_isready -h localhost -p 5432 -U quyen

   # Check database exists
   psql -h localhost -U quyen -l
   ```

2. **Prisma Migration Issues**:
   ```bash
   # Reset the database (WARNING: This will delete all data)
   npx prisma migrate reset

   # Generate migrations
   npx prisma migrate dev --name init
   ```

3. **Admin User Issues**:
   ```bash
   # Check if admin user exists
   psql -h localhost -U quyen -d auth_service -c "SELECT email, role FROM users WHERE role = 'admin';"

   # Reset admin user
   ./scripts/admin-credentials.sh reset dev
   ```

### Environment Variables
Make sure these environment variables are set correctly:
```bash
# In .env_admin
ADMIN_EMAIL_DEV=your.email@example.com
ADMIN_PASSWORD_DEV=YourSecurePassword123!
ADMIN_FIRST_NAME_DEV=First
ADMIN_LAST_NAME_DEV=Last
ADMIN_SECRET_DEV=YourAdminSecret123!

# In .env
DATABASE_URL="postgresql://quyen:Praise_God@localhost:5432/auth_service"
```

## Security Considerations

1. **Password Requirements**:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - Special characters are allowed

2. **Environment Files**:
   - Never commit `.env` or `.env_admin` to version control
   - Keep backup copies of credentials in a secure location
   - Use different credentials for development and production

## Maintenance

### Backup Procedures
```bash
# Create a backup
pg_dump -h localhost -U quyen auth_service > backup.sql

# Restore from backup
psql -h localhost -U quyen auth_service < backup.sql
```

### Monitoring
- Regular index maintenance
- Performance monitoring
- Security audits

## Support
For database-related issues, contact the database administrator or refer to the PostgreSQL documentation.

## Database Structure

### Users Table
The `users` table is the core of our authentication system, storing user information and authentication details:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    password_reset_token VARCHAR(255),
    password_reset_expiry TIMESTAMP,
    admin_secret_hash TEXT,
    admin_secret_salt TEXT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    phone_number VARCHAR(20) UNIQUE,
    phone_region VARCHAR(10),
    role role_type DEFAULT 'guest' NOT NULL,
    privacy_settings JSONB DEFAULT '{}'::jsonb,
    session_type session_type_enum DEFAULT 'session' NOT NULL,
    biometric_enabled BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_picture_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Key Features

1. **Security Features**:
   - UUID-based primary keys to prevent enumeration attacks
   - Secure password hashing with salt
   - Admin secret authentication
   - Password reset functionality with expiry
   - Biometric authentication support

2. **Data Validation**:
   - Email format validation
   - Phone number format validation
   - Role type enforcement
   - Session type enforcement

3. **Performance Optimizations**:
   - Indexed fields for fast lookups
   - Generated full name column
   - Optimized search fields

### Indexes
The database includes several indexes for optimal performance:

- `idx_users_email_lower`: Case-insensitive email search
- `idx_users_first_name`: First name search
- `idx_users_last_name`: Last name search
- `idx_users_full_name`: Full name search
- `idx_users_phone_number`: Phone number lookup
- `idx_users_password_reset_token`: Password reset token lookup
- `idx_users_password_reset_expiry`: Password reset expiry management
