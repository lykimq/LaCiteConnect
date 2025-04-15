import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/api';

/**
 * Authentication context type definition
 * Defines the shape of the authentication context
 */
interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

/**
 * Creates the authentication context
 * Initialized as undefined to ensure proper type checking
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook for accessing authentication context
 * Ensures context is used within a provider
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * Props interface for AuthProvider component
 */
interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Authentication provider component
 * Manages authentication state and provides authentication methods
 * @param children - Child components that need access to auth context
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // State management for user, loading, and error states
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Effect hook for checking authentication status on mount
     * Validates existing token and sets initial state
     */
    useEffect(() => {
        const validateAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await authService.validateToken();
                    setUser(userData);
                } catch (err) {
                    // Token is invalid or expired
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        validateAuth();
    }, []);

    /**
     * Handles user login
     * @param email - User's email address
     * @param password - User's password
     */
    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.login({ email, password });
            localStorage.setItem('token', response.token);
            setUser(response.user);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during login');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles user logout
     * Removes token and clears user state
     */
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    // Context value object
    const value = {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

