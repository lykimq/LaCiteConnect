#!/bin/bash

# Backup script for PostgreSQL users and permissions
BACKUP_DIR="./db_backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/users_permissions_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup users and their permissions
echo "Backing up PostgreSQL users and permissions..."
sudo -u postgres psql -c "
SELECT 'CREATE USER ' || quote_ident(rolname) || ' WITH ' ||
  CASE WHEN rolcanlogin THEN 'LOGIN ' ELSE 'NOLOGIN ' END ||
  CASE WHEN rolsuper THEN 'SUPERUSER ' ELSE 'NOSUPERUSER ' END ||
  CASE WHEN rolinherit THEN 'INHERIT ' ELSE 'NOINHERIT ' END ||
  CASE WHEN rolcreaterole THEN 'CREATEROLE ' ELSE 'NOCREATEROLE ' END ||
  CASE WHEN rolcreatedb THEN 'CREATEDB ' ELSE 'NOCREATEDB ' END ||
  CASE WHEN rolreplication THEN 'REPLICATION ' ELSE 'NOREPLICATION ' END ||
  CASE WHEN rolbypassrls THEN 'BYPASSRLS ' ELSE 'NOBYPASSRLS ' END ||
  'PASSWORD ' || quote_literal(rolpassword) || ';'
FROM pg_authid
WHERE rolname NOT LIKE 'pg_%'
ORDER BY rolname;
" > "$BACKUP_FILE"

# Backup database ownerships
echo "Backing up database ownerships..."
sudo -u postgres psql -c "
SELECT 'ALTER DATABASE ' || quote_ident(datname) || ' OWNER TO ' || quote_ident(rolname) || ';'
FROM pg_database d
JOIN pg_authid a ON (d.datdba = a.oid)
WHERE datname NOT IN ('template0', 'template1', 'postgres')
ORDER BY datname;
" >> "$BACKUP_FILE"

# Backup schema permissions
echo "Backing up schema permissions..."
sudo -u postgres psql -c "
SELECT 'GRANT ' || privilege_type || ' ON SCHEMA ' || table_schema || ' TO ' || grantee || ';'
FROM information_schema.schema_privileges
WHERE grantee NOT LIKE 'pg_%'
ORDER BY table_schema, grantee;
" >> "$BACKUP_FILE"

echo "Backup completed and saved to $BACKUP_FILE"