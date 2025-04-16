-- Delete admin user script
-- This script deletes the admin user from the database
-- It should be used with caution and only in development/staging environments

-- Delete admin user
DELETE FROM "User" WHERE role = 'admin';

-- Reset the sequence if needed
-- ALTER SEQUENCE "User_id_seq" RESTART WITH 1;