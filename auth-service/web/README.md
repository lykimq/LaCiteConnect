# LaCiteConnect Admin Web Interface

## Overview
This is the admin web interface for LaCiteConnect, built with React, TypeScript, and Material-UI. It provides a modern and responsive interface for managing users and monitoring system activity.

## Project Structure
```
src/
├── components/     # Reusable UI components
│   ├── Login.tsx  # Login page with authentication form
│   └── DashBoard.tsx  # Main dashboard after authentication
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

## Code Implementation Flow

### 1. Authentication Flow
1. User enters credentials on the login page
2. Credentials are sent to the auth service
3. Upon successful authentication:
   - JWT token is stored in localStorage
   - User is redirected to the dashboard
4. For protected routes:
   - Token is validated
   - User role is checked
   - Access is granted or denied accordingly

### 2. State Management
- Uses React Context API for global state management
- Implements custom hooks for authentication
- Manages loading and error states
- Handles token persistence

### 3. API Integration
- Axios instance with interceptors for auth
- Centralized error handling
- Type-safe API calls
- Automatic token management

### 4. UI Components
- Material-UI components with custom theme
- Responsive design
- Form validation
- Error handling and display

## File Details

### `src/types/index.ts`
- Defines shared TypeScript interfaces and types
- Includes user, authentication, and API response types
- Ensures type safety across the application

### `src/services/api.ts`
- Configures Axios instance with base URL and headers
- Implements request/response interceptors
- Handles authentication token management
- Provides type-safe API service methods

### `src/context/AuthContext.tsx`
- Manages authentication state
- Provides login/logout functionality
- Handles token persistence
- Exposes authentication state to components

### `src/pages/Login.tsx`
- Implements login form with validation
- Handles form submission and error display
- Manages loading states
- Provides user feedback

### `src/pages/DashBoard.tsx`
- Displays user information
- Provides logout functionality
- Shows authentication status
- Protected route implementation

### `src/App.tsx`
- Sets up routing configuration
- Provides theme and authentication context
- Manages protected routes
- Handles navigation

### `src/theme.ts`
- Configures Material-UI theme
- Defines color palette
- Sets typography styles
- Customizes component styles

## Features
- User authentication (login/logout)
- Protected routes
- Responsive design
- Form validation
- Error handling
- Type safety
- Theme customization

## Tech Stack
- React 18
- TypeScript
- Material-UI
- React Router
- Axios
- Jest (testing)

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

## Security Considerations
- JWT tokens are stored securely
- API requests include authentication headers
- Input validation is performed
- Error handling is implemented
- Protected routes are enforced