# Admin Credentials Management System

## Overview
This document explains the secure management of admin credentials for the LaCiteConnect authentication service. We use a separate `.env_admin` file and a management script to handle admin credentials securely across different environments.

## System Components

### 1. .env_admin.template
- Template file containing the structure for admin credentials
- Contains placeholders for development, staging, and production environments
- Safe to commit to version control as it contains no real credentials
- Located at: `auth-service/backend/.env_admin.template`

### 2. .env_admin
- Actual file containing admin credentials
- NEVER commit this file to version control
- Created by copying `.env_admin.template`
- Contains real credentials for each environment
- Located at: `auth-service/backend/.env_admin`

### 3. admin-credentials.sh
- Management script for handling admin credentials
- Provides commands for setup, updating, seeding, and resetting
- Handles environment-specific credentials
- Located at: `auth-service/backend/scripts/admin-credentials.sh`

## Usage Guide

### Initial Setup
1. Copy the template to create your .env_admin file:
```bash
cd auth-service/backend
./scripts/admin-credentials.sh setup
```

2. Edit the .env_admin file with your credentials:
```bash
nano .env_admin
```

### Managing Credentials

#### Update Credentials
To update credentials for a specific environment:
```bash
./scripts/admin-credentials.sh update {dev|prod|staging} email first_name last_name
```
Example:
```bash
./scripts/admin-credentials.sh update dev admin@example.com John Doe
```
The script will:
- Generate a secure random password
- Generate a secure random admin secret
- Update the .env_admin file
- Display the new credentials (save them securely)

#### Seed Database
To seed the database with admin credentials:
```bash
./scripts/admin-credentials.sh seed {dev|prod|staging}
```
Example:
```bash
./scripts/admin-credentials.sh seed dev
```

#### Reset Admin User
To reset the admin user in the database:
```bash
./scripts/admin-credentials.sh reset {dev|prod|staging}
```
Example:
```bash
./scripts/admin-credentials.sh reset dev
```
This will:
- Delete the existing admin user from the database
- Create a new admin user with the current credentials
- Useful when you need to reset the admin user without changing credentials

## Security Best Practices

### 1. File Management
- Keep `.env_admin` out of version control
- Store `.env_admin` in a secure location
- Use different credentials for each environment
- Rotate credentials regularly

### 2. Password Security
- Use the script's password generator for new passwords
- Store passwords in a secure password manager
- Never share passwords via email or chat
- Change passwords immediately if compromised

### 3. Admin Secret Security
- The admin secret is a separate security layer for admin access
- It should be longer and more complex than regular passwords
- Store it separately from other credentials
- Rotate it regularly, especially after personnel changes
- Never use the same admin secret across environments

### 4. Environment Separation
- Use different email domains for each environment
- Maintain separate credentials for dev/staging/prod
- Never use production credentials in development
- Use environment-specific admin accounts

### 5. Access Control
- Limit access to .env_admin file
- Use secure channels for sharing credentials
- Implement audit logging for admin actions
- Require MFA for admin access

## Emergency Procedures

### 1. Lost Credentials
1. Use the update command to generate new credentials
2. Update the .env_admin file
3. Seed the database with new credentials
4. Document the change

### 2. Compromised Credentials
1. Immediately update credentials using the script
2. Seed the database with new credentials
3. Review access logs
4. Document the incident

### 3. Lost Admin Access
1. Use the reset command to recreate the admin user
2. Verify the new credentials work
3. Update any systems using the admin credentials
4. Document the change

## Production Considerations

### 1. Credential Management
- Use a secure secret management system in production
- Implement automated credential rotation
- Use service accounts where possible
- Monitor for unauthorized access

### 2. Deployment
- Automate credential updates in CI/CD
- Use environment-specific deployment scripts
- Validate credentials before deployment
- Maintain deployment logs

### 3. Monitoring
- Set up alerts for admin account activity
- Monitor failed login attempts
- Track credential usage
- Regular security audits

## Troubleshooting

### Common Issues
1. Missing .env_admin file
   - Run `./scripts/admin-credentials.sh setup`
   - Fill in the credentials

2. Invalid environment
   - Use one of: dev, prod, staging
   - Check environment variable names

3. Permission issues
   - Ensure script is executable: `chmod +x scripts/admin-credentials.sh`
   - Check file ownership and permissions

4. Database issues
   - Check database connection
   - Verify schema is up to date
   - Check for existing admin users

### Getting Help
- Contact system administrator
- Check deployment logs
- Review security documentation
- Document any issues encountered