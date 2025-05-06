#!/bin/bash

# Admin Credentials Management Script
# This script helps manage admin credentials for different environments

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if .env_admin exists
check_env_admin() {
    if [ ! -f .env_admin ]; then
        echo -e "${RED}Error: .env_admin file not found${NC}"
        echo -e "Please copy .env_admin.template to .env_admin and fill in the values"
        exit 1
    fi
}

# Function to load environment variables
load_env() {
    local env=$1
    case $env in
        dev)
            source .env_admin
            export ADMIN_EMAIL=$ADMIN_EMAIL_DEV
            export ADMIN_PASSWORD=$ADMIN_PASSWORD_DEV
            export ADMIN_FIRST_NAME=$ADMIN_FIRST_NAME_DEV
            export ADMIN_LAST_NAME=$ADMIN_LAST_NAME_DEV
            export ADMIN_SECRET=$ADMIN_SECRET_DEV
            ;;
        prod)
            source .env_admin
            export ADMIN_EMAIL=$ADMIN_EMAIL_PROD
            export ADMIN_PASSWORD=$ADMIN_PASSWORD_PROD
            export ADMIN_FIRST_NAME=$ADMIN_FIRST_NAME_PROD
            export ADMIN_LAST_NAME=$ADMIN_LAST_NAME_PROD
            export ADMIN_SECRET=$ADMIN_SECRET_PROD
            ;;
        staging)
            source .env_admin
            export ADMIN_EMAIL=$ADMIN_EMAIL_STAGING
            export ADMIN_PASSWORD=$ADMIN_PASSWORD_STAGING
            export ADMIN_FIRST_NAME=$ADMIN_FIRST_NAME_STAGING
            export ADMIN_LAST_NAME=$ADMIN_LAST_NAME_STAGING
            export ADMIN_SECRET=$ADMIN_SECRET_STAGING
            ;;
        *)
            echo -e "${RED}Invalid environment: $env${NC}"
            echo "Usage: $0 {dev|prod|staging}"
            exit 1
            ;;
    esac

    # Verify all required variables are set
    if [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ] || [ -z "$ADMIN_SECRET" ] || [ -z "$ADMIN_FIRST_NAME" ] || [ -z "$ADMIN_LAST_NAME" ]; then
        echo -e "${RED}Error: Missing required environment variables for $env environment${NC}"
        exit 1
    fi
}

# Function to validate password
validate_password() {
    local password=$1
    # Check if password meets requirements: at least one uppercase, one lowercase, one number, minimum 8 characters
    if [[ ! $password =~ [A-Z] ]] || [[ ! $password =~ [a-z] ]] || [[ ! $password =~ [0-9] ]] || [[ ${#password} -lt 8 ]]; then
        return 1
    fi
    return 0
}

# Function to generate a secure password
generate_password() {
    local length=${1:-16}
    local password
    local attempts=0
    local max_attempts=10

    while [ $attempts -lt $max_attempts ]; do
        # Generate base password
        password=$(openssl rand -base64 $length | tr -d '\n' | tr -d '/' | tr -d '+')

        # Ensure it has required characters
        password="A${password}a1"  # Add uppercase, lowercase, and number

        # Trim to desired length
        password=${password:0:$length}

        # Validate the password
        if validate_password "$password"; then
            echo "$password"
            return 0
        fi

        attempts=$((attempts + 1))
    done

    echo -e "${RED}Failed to generate a valid password after $max_attempts attempts${NC}" >&2
    return 1
}

# Function to update credentials
update_credentials() {
    local env=$1
    local email=$2
    local first_name=$3
    local last_name=$4

    # Generate secure passwords
    local password
    local admin_secret

    if ! password=$(generate_password); then
        echo -e "${RED}Failed to generate valid password${NC}"
        exit 1
    fi

    if ! admin_secret=$(generate_password 32); then
        echo -e "${RED}Failed to generate valid admin secret${NC}"
        exit 1
    fi

    # Update .env_admin file
    sed -i.bak "s/^ADMIN_EMAIL_${env^^}=.*/ADMIN_EMAIL_${env^^}=$email/" .env_admin
    sed -i.bak "s/^ADMIN_PASSWORD_${env^^}=.*/ADMIN_PASSWORD_${env^^}=$password/" .env_admin
    sed -i.bak "s/^ADMIN_FIRST_NAME_${env^^}=.*/ADMIN_FIRST_NAME_${env^^}=$first_name/" .env_admin
    sed -i.bak "s/^ADMIN_LAST_NAME_${env^^}=.*/ADMIN_LAST_NAME_${env^^}=$last_name/" .env_admin
    sed -i.bak "s/^ADMIN_SECRET_${env^^}=.*/ADMIN_SECRET_${env^^}=$admin_secret/" .env_admin

    # Remove backup file
    rm .env_admin.bak

    echo -e "${GREEN}Credentials updated for $env environment${NC}"
    echo -e "${YELLOW}New password: $password${NC}"
    echo -e "${YELLOW}New admin secret: $admin_secret${NC}"
    echo -e "${YELLOW}Please save these credentials in a secure location${NC}"
}

# Function to reset admin user
reset_admin() {
    local env=$1
    check_env_admin
    load_env $env

    # Set database URL for Prisma
    export DATABASE_URL="postgresql://quyen:Praise_God@localhost:5432/auth_service"

    echo -e "${YELLOW}Resetting database schema...${NC}"

    # Reset Prisma migrations
    npx prisma migrate reset --force

    # Create new migration
    npx prisma migrate dev --name init

    # Seed new admin user
    make seed

    echo -e "${GREEN}Admin user has been reset for $env environment${NC}"
}

# Main script
case $1 in
    "setup")
        if [ ! -f .env_admin ]; then
            cp .env_admin.template .env_admin
            echo -e "${GREEN}.env_admin file created${NC}"
            echo -e "${YELLOW}Please edit .env_admin with your credentials${NC}"
        else
            echo -e "${YELLOW}.env_admin file already exists${NC}"
        fi
        ;;
    "update")
        if [ $# -ne 5 ]; then
            echo "Usage: $0 update {dev|prod|staging} email first_name last_name"
            exit 1
        fi
        check_env_admin
        update_credentials $2 $3 $4 $5
        ;;
    "seed")
        if [ $# -ne 2 ]; then
            echo "Usage: $0 seed {dev|prod|staging}"
            exit 1
        fi
        check_env_admin
        load_env $2
        make seed
        ;;
    "reset")
        if [ $# -ne 2 ]; then
            echo "Usage: $0 reset {dev|prod|staging}"
            exit 1
        fi
        reset_admin $2
        ;;
    *)
        echo "Usage: $0 {setup|update|seed|reset} [args]"
        echo "Commands:"
        echo "  setup                    - Create .env_admin file from template"
        echo "  update env email fn ln   - Update credentials for environment"
        echo "  seed env                 - Seed database for environment"
        echo "  reset env                - Reset admin user for environment"
        exit 1
        ;;
esac