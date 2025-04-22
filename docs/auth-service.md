# Authentication Service

This is the authentication microservice for LaCiteConnect, handling user authentication and authorization using NestJS, Firebase Auth, and JWT.

## Features

- Email/Password authentication
- Firebase authentication (Google, Email/Password, Anonymous)
- JWT-based authorization
- Email verification
- Password reset functionality
- User profile management
- Role-based access control (RBAC)
  - Admin role
  - Signed-in user role
  - Guest role
- Social login integration
- Secure password hashing with bcrypt
- PostgreSQL database for user storage

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- Firebase project with Authentication enabled
- Docker (optional)

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=lacite_auth

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1d

# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_SERVICE_ACCOUNT=your_service_account_json

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables
4. Start the development server:
   ```bash
   npm run start:dev
   ```

## Docker

Build the Docker image:
```bash
docker build -t auth-service .
```

Run the container:
```bash
docker run -p 3000:3000 --env-file .env auth-service
```

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api
```

## Available Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email and password
- `POST /auth/firebase` - Login with Firebase token
- `GET /auth/verify-email/:token` - Verify email address
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/profile` - Get user profile (protected)

### User Management

- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user by ID (Admin or self)
- `PUT /users/:id` - Update user (Admin or self)
- `DELETE /users/:id` - Delete user (Admin only)

## Security Features

- JWT-based authentication with configurable expiration
- Firebase token verification
- Password hashing using bcrypt
- Email verification system
- Role-based access control
- CORS enabled
- Input validation using class-validator
- Swagger API documentation with authentication

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Architecture

The service follows a modular architecture with the following components:

- **Auth Module**: Handles authentication and authorization
- **Users Module**: Manages user data and operations
- **Firebase Module**: Integrates with Firebase Authentication
- **Database**: PostgreSQL with TypeORM for data persistence
- **Security**: JWT and Firebase token-based authentication
- **API Documentation**: Swagger/OpenAPI for API documentation