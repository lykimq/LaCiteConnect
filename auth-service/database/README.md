# User Authentication and Management System

## Features
- **Email/Password Authentication:** Secure login using email and password.
- **Firebase Authentication:** Supports Google, Email/Password, and Anonymous authentication.
- **JWT-based Authorization:** Secure token-based authentication for user sessions.
- **Email Verification:** Users receive email verification upon registration.
- **Password Reset Functionality:** Users can reset their passwords via a token-based mechanism.
- **User Profile Management:** Users can manage their profile, including first name, last name, and profile picture.
- **Privacy Controls:** Users can control the visibility of their personal information (email, phone number, profile picture, etc.).
- **Biometric Authentication:** Optional biometric login (e.g., fingerprint/face ID) for mobile applications.
- **Roles and Permissions:** User roles defined as `guest`, `user`, or `admin` to control access to different features.

## Database Schema: `users` Table


```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    password_reset_token VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    phone_number VARCHAR(20) UNIQUE,
    phone_region VARCHAR(10),
    role ENUM('guest', 'user', 'admin') DEFAULT 'guest' NOT NULL,
    privacy_settings JSONB DEFAULT '{}'::jsonb,
    session_type ENUM('session', 'persistent') DEFAULT 'session',
    biometric_enabled BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_picture_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT phone_number_format CHECK (phone_number ~ '^\+?[0-9\s\-]{10,20}$'),
    CONSTRAINT email_format CHECK (email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
);
```
### Fields
- id: UUID, unique identifier for the user.
- email: User's email address, unique and required.
- password_hash: Hashed password stored securely (bcrypt/Argon2).
- password_salt: Salt used with the password hash.
- password_reset_token: Token used for password recovery.
- first_name: User's first name.
- last_name: User's last name.
- full_name: Precomputed field combining first and last name for optimized search.
- phone_number: User's phone number, unique.
- phone_region: Country code for international compatibility.
- role: User role (guest, user, or admin).
- privacy_settings: JSONB field for user-defined privacy preferences (e.g., who can see email, phone number, profile picture).
- session_type: Defines whether the user is logged in for a session or persistently.
- biometric_enabled: Indicates whether biometric login is enabled.
- last_login_at: Timestamp of the last login.
- profile_picture_url: URL to the user's profile picture.
- created_at: Timestamp when the account was created.
- updated_at: Timestamp when the account was last updated.

### Indexes
- email (Unique, Indexed for authentication & searches)
- first_name (Indexed for name-based searches)
- last_name (Indexed for name-based searches)
- full_name (Precomputed & Indexed for better performance)
- phone_number (Indexed for contact searches)

### Validation Rules
- Email: Must contain @ symbol, valid domain, and no spaces or special characters (except for . and -). Max length of 255 characters. Case-insensitive uniqueness check.
- Phone Number: Valid phone number format (e.g., +1234567890 or 123-456-7890). Only numbers, spaces, +, and - are allowed.

### Environment Variables
#### Database Configuration

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=Praise_God
DB_NAME=auth_service
```

#### JWT Configuration
JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. It is commonly used to handle user authentication and authorization in web applications.

##### Setting Up JWT Secret and Expiration
1. Generate a JWT Secret;
- The `JWT_SECRET` is a secret key that is used to signed in the JWT token. It should use a strong, random string for security.
- We can use `openssl rand -base64 32`. This will be at the `JWT_SECRET` in `env` file.
2. JWT Expiration:
- `JWT_EXPIRATION` defines how long the token will remain valid. Common values are `1d` (1 day), `1h`, `7d`, etc.
- We can set it as `7d` for this example.

```env
JWT_SECRET=5jLRnqMXlNuS2cR4pcHHRrGV07m3uF9S/00DeYtEg+E=
JWT_EXPIRATION=7d
```

#### Firebase Configuration
1. Set Up Firebase
a. Create a Firebase Project:
- Go to the Firebase Console.
- Click "Add project" (`Auth-Service`) and follow the instructions to create a new Firebase project.

b. Enable Authentication Providers:
- After the project is created, navigate to the **Authentication** section in Firebase Console.
- Under the **Sign-in method** tab, enable Email/Password, Google, or any other authentication providers that we want to use.

c. Generate Firebase Service Account JSON File:
- Go to **Project Settings** (gear icon) > **Service accounts** tab.
- Click on **Generate new private key**. This will download a JSON file to the computer. (`/auth-service/database/auth-service-1619a-firebase-adminsdk-fbsvc-6ccfdf2990.json`)
- This file contains the credentials required to authenticate with Firebase services.

d. Install Firebase Admin SDK::
- In the project directory `auth-service`, install the Firebase Admin SDK to allow the server to interact with Firebase for authentication and other Firebase services.

```
npm install firebase-admin
```
e. Configure Firebase `env` file:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_SERVICE_ACCOUNT=your_service_account_json
```

f. Use Firebase Admin SDK in the Application
In the backend code (e.g., `server.js` or `app.js`), initialize Firebase Admin SDK using the service account JSON and project ID from the `.env` file.
- Make sure to install `dotenv` for loading `.env` variables:
```
npm install dotenv
```


#### Server Configuration
1. Set Up Server Configuration
The server configuration includes setting up the port and the environment (`NODE_ENV`), which helps to determine whether the app is running in development, production, or another environment.
a. Port Configuration:
- The `PORT` variable defines the port on which the server will run. The default value is `3000`.

b. Environment Configuration:
- The `NODE_ENV` variable helps the app understand whether it is running in a development environment (`development`), production (`production`), or testing (`test`).

2. Add to `.env` file:
```
PORT=3000
NODE_ENV=development
```
- `PORT=3000` means the app will run on `http://localhost:3000`
- `NODE_ENV=development` specifies that the app is running in development mode.

3. Use the Server Configuration in The Code:
In the application code (e.g., `server.js`), we can use these environment variables.

#### Install Dependencies
- jsonwebtoken, dotenv, firebase-admin, express