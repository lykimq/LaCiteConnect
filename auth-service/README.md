# Authentication Service

This is the authentication microservice for LaCiteConnect, handling user authentication and authorization using NestJS, Firebase Auth, and JWT.

## Features

- Email/Password authentication
- Firebase authentication (Google, Email/Password, Anonymous)
- JWT-based authorization
- Email verification
- Password reset functionality
- User profile management

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- Firebase project with Authentication enabled
- Docker (optional)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

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

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.