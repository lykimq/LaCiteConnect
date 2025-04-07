# LaCiteConnect Auth Service

## Overview
LaCiteConnect Auth Service is a robust authentication and authorization service built with NestJS, providing secure user management for both web and mobile applications.

## Architecture

### Tech Stack
- **Backend Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Firebase Auth
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker (planned)

### Design Patterns
- Repository Pattern (via Prisma)
- Dependency Injection
- Strategy Pattern (JWT, Firebase)
- Guard Pattern (Role-based authorization)

## Directory Structure

```
backend/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── login.dto.ts     # Login request validation
│   │   │   └── register-user.dto.ts # Registration validation
│   │   ├── guards/              # Authorization guards
│   │   │   └── roles.guard.ts   # Role-based access control
│   │   ├── strategies/          # Authentication strategies
│   │   │   └── jwt.strategy.ts  # JWT authentication
│   │   ├── auth.controller.ts   # API endpoints
│   │   ├── auth.service.ts      # Business logic
│   │   └── auth.module.ts       # Module configuration
│   ├── prisma/                  # Database layer
│   │   ├── prisma.service.ts    # Prisma service
│   │   └── prisma.module.ts     # Prisma module
│   ├── main.ts                  # Application entry point
│   └── app.module.ts            # Root module
├── prisma/
│   └── schema.prisma            # Database schema
├── test/                        # Test files
├── .env                         # Environment variables
├── jest.config.js              # Jest configuration
├── package.json                # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## Features

### Implemented
- ✅ User Registration
  - Email validation
  - Password hashing
  - Firebase integration
  - PostgreSQL storage
- ✅ User Authentication
  - JWT token generation
  - Firebase token generation
  - Session management
- ✅ Role-Based Authorization
  - Guest, User, Admin roles
  - Role guards
- ✅ Database Integration
  - Prisma ORM
  - PostgreSQL schema
  - Migrations

### Planned Features
- 🔄 Password Reset
  - Email verification
  - Token-based reset
- 🔄 Enhanced Security
  - Rate limiting
  - IP blocking
  - 2FA support
- 🔄 User Management
  - Profile updates
  - Account deletion
  - Session management
- 🔄 Analytics
  - Login attempts
  - User activity
- 🔄 API Documentation
  - Swagger integration
  - API versioning

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout (planned)
- `POST /auth/refresh` - Refresh token (planned)
- `POST /auth/reset-password` - Password reset (planned)

### User Management
- `GET /users/profile` - Get user profile (planned)
- `PUT /users/profile` - Update profile (planned)
- `DELETE /users/profile` - Delete account (planned)

## Security Features

### Implemented
- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Firebase integration
- ✅ Input validation
- ✅ SQL injection prevention (via Prisma)

### Planned
- 🔄 Rate limiting
- 🔄 IP blocking
- 🔄 2FA support
- 🔄 Session management
- 🔄 Audit logging

## Development

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL
- Firebase project
- npm or yarn

### Setup
1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Start development server:
```bash
npm run start:dev
```

### Testing
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## Deployment

### Production Setup
1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm run start:prod
```

### Docker Deployment (planned)
```bash
docker build -t laciteconnect-auth .
docker run -p 3000:3000 laciteconnect-auth
```

