import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Box, Paper, Typography, Button } from '@mui/material';
import { Grid } from '@mui/material';

/**
 * Dashboard page component
 * Displays user information and provides logout functionality
 * Protected route that requires authentication
 */
const Dashboard: React.FC = () => {
    // Authentication context hooks
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    /**
     * Handles user logout
     * Clears authentication state and redirects to login
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            {/* Header section with title and logout button */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography component="h1" variant="h4">
                                    Dashboard
                                </Typography>
                                <Button variant="contained" color="secondary" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Box>
                            {/* User information display */}
                            <Typography variant="body1">
                                Welcome, {user?.email}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Dashboard;