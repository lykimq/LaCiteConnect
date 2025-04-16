import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLoginForm from '../components/AdminLoginForm';
import { Navigate } from 'react-router-dom';

/**
 * Admin Login Page Component
 * Handles the admin login page with:
 * - Authentication state management
 * - Protected route redirection
 * - Login form rendering
 */
const AdminLogin: React.FC = () => {
    const { isAuthenticated, isAdmin } = useAuth();

    // Redirect to dashboard if already authenticated as admin
    if (isAuthenticated && isAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <AdminLoginForm />;
};

export default AdminLogin;