import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminLoginCredentials } from '../types';

/**
 * Admin Login Form Component
 * Handles admin authentication with:
 * - Email and password validation
 * - Admin secret verification
 * - Password visibility toggles
 * - Error handling and loading states
 * - Form submission and navigation
 */
const useAdminLoginForm = () => {
    const navigate = useNavigate();
    const { login, error, loading } = useAuth();
    const [formData, setFormData] = useState<AdminLoginCredentials>({
        email: '',
        password: '',
        adminSecret: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showAdminSecret, setShowAdminSecret] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    /**
     * Handle form input changes
     * @param e React change event
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Handle form submission
     * @param e React form event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate('/admin/dashboard');
        } catch (err: any) {
            const message = err.response?.data?.message || 'An error occurred during login';
            setErrorMessage(message);
            setSnackbarOpen(true);
        }
    };

    /**
     * Toggle password visibility
     */
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    /**
     * Toggle admin secret visibility
     */
    const handleToggleAdminSecret = () => {
        setShowAdminSecret(!showAdminSecret);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return {
        formData,
        showPassword,
        showAdminSecret,
        snackbarOpen,
        errorMessage,
        loading,
        handleChange,
        handleSubmit,
        handleTogglePassword,
        handleToggleAdminSecret,
        handleSnackbarClose,
    };
};

export default useAdminLoginForm;