# LaCiteConnect Auth Service

## Overview
This is the authentication service for LaCiteConnect, built with NestJS, TypeScript, and PostgreSQL. It provides secure authentication and authorization for both regular users and administrators.

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

## Code Flow and Implementation Order

The implementation follows a bottom-up approach:
1. First, the database layer is set up with Prisma
2. Then, the data validation layer (DTOs) is implemented
3. Next, the authentication strategies and guards are configured
4. After that, the core business logic is implemented in the service layer
5. Finally, the API endpoints are exposed through the controller

The authentication service follows a specific implementation order to ensure proper dependency management and functionality. Here's the sequence of how the code is structured and executed:

1. **Database Layer (Prisma)**
   - `prisma/schema.prisma`: Defines the database schema and models
   - `src/prisma/prisma.service.ts`: Implements the Prisma client service
   - `src/prisma/prisma.module.ts`: Configures the global Prisma module

2. **Data Transfer Objects (DTOs)**
   - `auth/dto/register-user.dto.ts`: Defines user registration validation
   - `auth/dto/login.dto.ts`: Defines login request validation

3. **Authentication Strategies**
   - `auth/strategies/jwt.strategy.ts`: Implements JWT token validation
   - `auth/guards/roles.guard.ts`: Implements role-based access control

4. **Core Authentication Logic**
   - `auth/auth.service.ts`: Implements business logic for:
     - User registration
     - User authentication
     - Token generation
     - Firebase integration
     - Password hashing

5. **API Layer**
   - `auth/auth.controller.ts`: Exposes REST endpoints for:
     - User registration
     - User login
     - Token management

6. **Module Configuration**
   - `auth/auth.module.ts`: Configures the authentication module with:
     - JWT configuration
     - Passport strategies
     - Service providers
     - Guards

7. **Application Setup**
   - `app.module.ts`: Root module that:
     - Imports all necessary modules
     - Configures global settings
     - Sets up environment variables

8. **Application Entry Point**
   - `main.ts`: Bootstraps the application with:
     - CORS configuration
     - Global validation pipe
     - Swagger documentation
     - Server startup

### Flow of Execution

1. When the application starts, `main.ts` is executed first
2. The `AppModule` is initialized, which imports:
   - `PrismaModule` for database access
   - `AuthModule` for authentication
   - `ConfigModule` for environment variables
3. The `AuthModule` initializes:
   - JWT configuration
   - Passport strategies
   - Authentication services
   - Authorization guards
4. When a request comes in:
   - The appropriate controller endpoint is called
   - The request is validated against DTOs
   - The service layer processes the business logic
   - Database operations are performed through Prisma
   - Authentication strategies validate tokens
   - Role guards check permissions
   - Response is sent back to the client

This architecture ensures:
- Clear separation of concerns
- Proper dependency injection
- Secure authentication flow
- Scalable and maintainable codebase

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
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login as a regular user
- `POST /auth/admin/login` - Login as an admin (requires admin secret)
- `GET /auth/validate` - Validate authentication token
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

## Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET=your_jwt_secret
ADMIN_SECRET=your_admin_secret
```

## Admin Authentication
Admin users are authenticated using a combination of:
1. Email and password
2. Admin secret key (configured in environment variables)

To create an admin user:
1. Set the `ADMIN_SECRET` environment variable
2. Use the admin login endpoint with valid credentials and the admin secret
3. The user must have the 'admin' role in the database

## Security Considerations
- All passwords are hashed using bcrypt
- JWT tokens are signed with a secret key
- Admin access requires a separate secret key
- Role-based access control is enforced
- Input validation is performed on all endpoints
- Firebase integration for additional security

## Make Commands
```bash
make install        # Install dependencies
make start         # Start development server
make build         # Build for production
make test          # Run tests
make test-coverage # Run tests with coverage
make clean         # Clean build artifacts
make lint          # Lint code
make format        # Format code
make type-check    # Check TypeScript types
make dev-setup     # Setup development environment
make prod-setup    # Setup production environment
```

## Development
- Use `make start` for development
- Use `make test` for running tests
- Use `make build` for production build

## Testing
- Unit tests for services and controllers
- Integration tests for API endpoints
- E2E tests for authentication flow

