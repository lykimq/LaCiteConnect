import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

/**
 * Main Application Component
 * Sets up the application structure with:
 * - Authentication context for managing user state
 * - React Router for navigation
 * - Protected routes for admin access
 * - Public routes for authentication
 */
const App: React.FC = () => {
  return (
    <Router>
      {/* Provide authentication context to all child components */}
      <AuthProvider>
        <Routes>
          {/* Redirect root path to admin login */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* Public route for admin login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected route for admin dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route redirects to admin login */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
