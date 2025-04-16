# LaCiteConnect Web Application

## Overview
This is the web application for LaCiteConnect, built with React, TypeScript, and Material-UI. It provides a modern, responsive interface for user authentication and admin dashboard functionality.

## Architecture

### Tech Stack
- **Frontend Framework**: React
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library
- **Build Tool**: Vite

### Design Patterns
- Component-Based Architecture
- Context API for State Management
- Custom Hooks for Reusable Logic
- Higher-Order Components for Authentication
- Container/Presenter Pattern

## Directory Structure

```
web/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── AdminLoginForm.tsx   # Admin login form
│   │   ├── UserLoginForm.tsx    # User login form
│   │   └── RegisterForm.tsx     # User registration form
│   ├── context/                 # React Context providers
│   │   └── AuthContext.tsx      # Authentication context
│   ├── pages/                   # Page components
│   │   ├── AdminLogin.tsx       # Admin login page
│   │   ├── UserLogin.tsx        # User login page
│   │   ├── Register.tsx         # Registration page
│   │   └── AdminDashboard.tsx   # Admin dashboard
│   ├── services/                # API services
│   │   └── api.ts               # API client configuration
│   ├── types/                   # TypeScript types
│   │   └── auth.ts              # Authentication types
│   ├── App.tsx                  # Root component
│   └── main.tsx                 # Application entry point
├── public/                      # Static assets
├── .env                         # Environment variables
├── package.json                # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## Code Flow and Implementation Order

The implementation follows a component-based approach:
1. First, the core authentication context is set up
2. Then, the API service layer is implemented
3. Next, the reusable form components are created
4. After that, the page components are built
5. Finally, the routing and navigation are configured

### Implementation Details

1. **Authentication Context**
   - `context/AuthContext.tsx`: Manages authentication state and provides:
     - User authentication status
     - Login/logout functionality
     - Token management
     - Admin role verification

2. **API Service Layer**
   - `services/api.ts`: Handles API communication with:
     - Axios instance configuration
     - Request/response interceptors
     - Error handling
     - Authentication endpoints

3. **Form Components**
   - `components/AdminLoginForm.tsx`: Admin authentication form with:
     - Email and password fields
     - Admin secret field
     - Error handling
     - Loading states
   - `components/UserLoginForm.tsx`: User authentication form
   - `components/RegisterForm.tsx`: User registration form

4. **Page Components**
   - `pages/AdminLogin.tsx`: Admin login page
   - `pages/UserLogin.tsx`: User login page
   - `pages/Register.tsx`: Registration page
   - `pages/AdminDashboard.tsx`: Admin dashboard with:
     - User statistics
     - System status
     - Recent activity

5. **Application Setup**
   - `App.tsx`: Configures:
     - Routing
     - Theme provider
     - Authentication context
     - Global styles

## Features

### Implemented
- ✅ User Authentication
  - Login form with validation
  - Registration form
  - Token management
  - Session persistence
- ✅ Admin Authentication
  - Admin login form
  - Admin secret verification
  - Role-based access control
- ✅ Admin Dashboard
  - User statistics display
  - System status monitoring
  - Recent activity tracking
- ✅ Responsive Design
  - Mobile-first approach
  - Material-UI components
  - Responsive layouts
- ✅ Error Handling
  - Form validation
  - API error messages
  - Loading states

### Planned Features
- 🔄 User Profile
  - Profile management
  - Password change
  - Account settings
- 🔄 Enhanced Security
  - 2FA support
  - Session timeout
  - Password strength meter
- 🔄 Analytics Dashboard
  - User activity charts
  - System performance metrics
  - Custom reports
- 🔄 Theme Customization
  - Dark/light mode
  - Custom color schemes
  - Responsive typography

## API Integration

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/admin/login` - Admin login
- `POST /auth/register` - User registration
- `GET /auth/validate` - Token validation
- `GET /auth/admin/dashboard` - Admin dashboard data

### Error Handling
- Network errors
- Authentication failures
- Validation errors
- Server errors

## Security Features

### Implemented
- ✅ Secure token storage
- ✅ CSRF protection
- ✅ Input validation
- ✅ XSS prevention
- ✅ CORS configuration
- ✅ HTTPS enforcement

## Development

### Prerequisites
- Node.js >= 18.0.0
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

3. Start development server:
```bash
npm run dev
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

2. Serve the static files:
```bash
npm run preview
```

### Environment Variables
```env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments

### Testing
- Unit tests for components
- Integration tests for forms
- E2E tests for critical flows
- Snapshot testing for UI components

### Performance
- Code splitting
- Lazy loading
- Image optimization
- Bundle size monitoring

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
```

## Development
- Use `make start` for development
- Use `make test` for running tests
- Use `make build` for production build

## Testing
- Unit tests for components and hooks
- Integration tests for forms and API calls
- E2E tests for authentication flow