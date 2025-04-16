# LaCiteConnect Admin Web Interface

## Overview
This is the admin web interface for LaCiteConnect, built with React, TypeScript, and Material-UI. It provides a modern and responsive interface for managing users and monitoring system activity, with separate interfaces for regular users and administrators.

## Features
- User authentication (login/logout)
- Admin authentication with secret key
- Role-based access control
- Protected routes
- Responsive design
- Form validation
- Error handling
- Type safety
- Theme customization

## Project Structure
```
src/
├── pages/         # Page components
│   ├── Login.tsx  # Regular user login
│   ├── AdminLogin.tsx  # Admin login
│   ├── DashBoard.tsx  # User dashboard
│   └── AdminDashboard.tsx  # Admin dashboard
├── services/      # API services
│   └── api.ts     # Axios instance and API service methods
├── types/         # TypeScript type definitions
│   └── index.ts  # Shared type definitions
├── context/       # React context providers
│   └── AuthContext.tsx  # Authentication context and provider
├── theme.ts       # Material-UI theme configuration
├── App.tsx        # Main application component
└── index.tsx      # Application entry point
```

## Authentication Flow

### Regular User Authentication
1. User enters credentials on the login page
2. Credentials are sent to the auth service
3. Upon successful authentication:
   - JWT token is stored in localStorage
   - User is redirected to the dashboard

### Admin Authentication
1. Admin enters credentials and admin secret on the admin login page
2. Credentials and secret are sent to the auth service
3. Upon successful authentication:
   - JWT token is stored in localStorage
   - Admin is redirected to the admin dashboard

### Protected Routes
- Regular routes require authentication
- Admin routes require both authentication and admin role
- Unauthorized access redirects to appropriate login page

## State Management
- Uses React Context API for global state management
- Implements custom hooks for authentication
- Manages loading and error states
- Handles token persistence

## API Integration
- Axios instance with interceptors for auth
- Centralized error handling
- Type-safe API calls
- Automatic token management

## UI Components
- Material-UI components with custom theme
- Responsive design
- Form validation
- Error handling and display

## Security Considerations
- JWT tokens are stored securely
- API requests include authentication headers
- Input validation is performed
- Error handling is implemented
- Protected routes are enforced
- Admin access requires additional secret key

## Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- LaCiteConnect Auth Service running on port 3000

## Setup
1. Install dependencies:
```bash
make install
```

2. Setup development environment:
```bash
make dev-setup
```

3. Start development server:
```bash
make start
```

The application will be available at http://localhost:3001

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