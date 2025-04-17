import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminLoginCredentials } from '../types';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment,
    Snackbar,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/**
 * Admin Login Form Component
 * Handles admin authentication with:
 * - Email and password validation
 * - Admin secret verification
 * - Password visibility toggles
 * - Error handling and loading states
 * - Form submission and navigation
 */
const AdminLoginForm: React.FC = () => {
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

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                p: 3,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 400,
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    align="center"
                >
                    Admin Login
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                        autoFocus
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleTogglePassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Admin Secret"
                        name="adminSecret"
                        type={showAdminSecret ? 'text' : 'password'}
                        value={formData.adminSecret}
                        onChange={handleChange}
                        margin="normal"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleToggleAdminSecret}
                                        edge="end"
                                    >
                                        {showAdminSecret ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Login'
                        )}
                    </Button>
                </form>
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminLoginForm;