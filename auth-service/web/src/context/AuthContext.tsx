import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { User, AdminLoginCredentials, AuthResponse } from '../types';

/**
 * Authentication Context Type
 * Defines the shape of the authentication context:
 * - User state and authentication status
 * - Authentication methods
 * - Loading and error states
 */
interface AuthContextType {
    user: User | null;           // Current authenticated user
    token: string | null;        // Current authentication token
    loading: boolean;            // Loading state indicator
    error: string | null;        // Error message if any
    login: (credentials: AdminLoginCredentials) => Promise<void>; // Login method
    logout: () => void;          // Logout method
    isAuthenticated: boolean;    // Authentication status
    isAdmin: boolean;            // Admin status
}

/**
 * Create authentication context with undefined default value
 * This ensures type safety when using the context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * Manages authentication state and provides authentication methods to child components
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    /**
     * Login Method
     * Handles admin authentication and token management
     * @param credentials Admin login credentials
     */
    const login = async (credentials: AdminLoginCredentials) => {
        try {
            setLoading(true);
            setError(null);
            const response: AuthResponse = await apiService.auth.adminLogin(credentials);
            setToken(response.accessToken);
            setUser(response.user);
            localStorage.setItem('token', response.accessToken);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during login');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout Method
     * Clears authentication state and redirects to login
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    /**
     * Token Validation Method
     * Validates stored token and sets user state
     */
    const validateToken = async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            // First validate the token
            await apiService.auth.validateToken();
            // If token is valid, get user info from the token payload
            const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
            setToken(storedToken);
            setUser({
                id: tokenPayload.sub,
                email: tokenPayload.email,
                role: tokenPayload.role,
                firstName: tokenPayload.firstName || '',
                lastName: tokenPayload.lastName || ''
            });
        } catch (err) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Validate token on component mount
    useEffect(() => {
        validateToken();
    }, []);

    // Compute authentication status
    const isAuthenticated = !!token;
    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            error,
            login,
            logout,
            isAuthenticated,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Authentication Context Hook
 * Provides access to authentication context
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * Protected Route Component
 * Wraps routes that require authentication and admin privileges
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
};

