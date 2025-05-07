# LaCiteConnect Backend

The backend service for LaCiteConnect, built with NestJS and Prisma ORM, providing a robust API for event management and user authentication.

## 🏗️ Architecture

The backend follows a modular architecture with the following key components:

- **Authentication Service**: Handles user authentication, authorization, and session management
- **User Service**: Manages user profiles, roles, and preferences
- **Event Service**: Handles event creation, management, and registration
- **Database Layer**: PostgreSQL with Prisma ORM for type-safe database operations

## 📦 Database Schema

### User Management
- User profiles with role-based access control
- Secure password handling with bcrypt
- Session management with JWT
- Privacy settings and preferences

### Event Management
- Event creation and management
- Time slot scheduling
- Registration handling
- Notification preferences
- Social sharing capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/laciteconnect"

   # Authentication
   JWT_SECRET="your-jwt-secret"
   JWT_EXPIRATION="1d"

   # Server
   PORT=3000
   NODE_ENV=development
   ```

3. **Database Setup**
   ```bash
   # Run migrations
   npm run migrate

   # Generate Prisma Client
   npm run prisma:generate
   ```

4. **Start the server**
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run start:prod
   ```

## 📦 Available Scripts

### Development
- `npm run start:dev` - Start development server with hot-reload
- `npm run build` - Build the application
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Database
- `npm run migrate` - Run database migrations
- `npm run migrate:deploy` - Deploy migrations to production
- `npm run migrate:reset` - Reset database (development only)
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:format` - Format schema files
- `npm run prisma:validate` - Validate schema files
- `npm run seed` - Seed database with test data

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:debug` - Run tests in debug mode
- `npm run test:e2e` - Run end-to-end tests

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schemas/           # Modular schema files
│   │   ├── users.prisma   # User-related models
│   │   └── events.prisma  # Event-related models
│   └── schema.prisma      # Main schema file
├── scripts/
│   ├── migrate-db.js      # Database migration script
│   └── prisma-command.js  # Prisma command handler
└── src/
    ├── auth/              # Authentication module
    ├── users/             # User management module
    ├── events/            # Event management module
    ├── common/            # Shared utilities
    └── main.ts           # Application entry point
```

## 🔒 Security

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Session management

### Data Protection
- Input validation with class-validator
- Request rate limiting
- CORS protection
- Helmet security headers


## 📝 API Documentation

API documentation is available at `/api` when running the server. The documentation is generated using Swagger/OpenAPI.

## 🔍 Debugging

1. **Development Mode**
   ```bash
   npm run start:debug
   ```

2. **VS Code Configuration**
   Add the following to `.vscode/launch.json`:
   ```json
   {
     "type": "node",
     "request": "launch",
     "name": "Debug NestJS",
     "runtimeExecutable": "npm",
     "runtimeArgs": ["run", "start:debug"],
     "sourceMaps": true,
     "envFile": "${workspaceFolder}/.env"
   }
   ```
