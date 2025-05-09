# LaCiteConnect Backend Scripts

This directory contains utility scripts for managing the LaCiteConnect application.

## Creating Test Users and Events

The following scripts can be used to populate your development or testing environment with sample data.

### Create Test User

This script creates a test user with predefined credentials.

```bash
# Navigate to the backend directory
cd backend

# Run the script with npm script
npm run create:test-user

# Or using ts-node directly
npm run ts-node scripts/create-test-user.ts
```

After running this script, you'll have a test user with these credentials:
- Email: test@example.com
- Password: Test123!

### Create Test Events

This script creates sample events in the database. It will also create an admin user if one doesn't exist.

```bash
# Navigate to the backend directory
cd backend

# Run the script with npm script
npm run create:test-events

# Or using ts-node directly
npm run ts-node scripts/create-test-events.ts
```

After running this script, you'll have three sample events in the database:
1. Sunday Service
2. Youth Group Meeting
3. Bible Study

## Important Notes

- These scripts check if the data already exists before creating new entries, so it's safe to run them multiple times.
- The scripts require a connection to your database as specified in your environment configuration.
- If you're using a production environment, do not run these scripts to avoid polluting your data.

## Database Connection

Make sure your database connection is properly configured in your `.env` file before running these scripts.

## After Creating Test Data

Once you've created the test data, the mobile app should automatically use the real data from the database instead of the mock data, as long as the user is authenticated with a valid token (not a guest access token).