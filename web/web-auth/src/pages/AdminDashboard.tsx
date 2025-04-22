import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

/**
 * Admin Dashboard Component
 * Displays the admin dashboard with:
 * - User statistics and metrics
 * - Recent activity logs
 * - System status information
 * - Error handling and loading states
 */
const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<any>(null);

    // Fetch dashboard data on component mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await apiService.admin.getDashboard();
                setDashboardData(response);
            } catch (err: any) {
                console.error('Error fetching dashboard data:', err);
                setError(
                    err.response?.data?.message ||
                    'Failed to load dashboard data. Please try again later.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome, {user?.firstName}!
                </Typography>

                <Grid container spacing={3}>
                    {/* User Statistics */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                User Statistics
                            </Typography>
                            <Typography variant="body1">
                                Total Users: {dashboardData?.totalUsers || 0}
                            </Typography>
                            <Typography variant="body1">
                                Active Users: {dashboardData?.activeUsers || 0}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* System Status */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                System Status
                            </Typography>
                            <Typography variant="body1">
                                Status: {dashboardData?.systemStatus || 'Unknown'}
                            </Typography>
                            <Typography variant="body1">
                                Last Updated: {dashboardData?.lastUpdated || 'N/A'}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Recent Activity */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Recent Activity
                            </Typography>
                            {dashboardData?.recentActivity?.length > 0 ? (
                                <ul>
                                    {dashboardData.recentActivity.map((activity: any, index: number) => (
                                        <li key={index}>{activity.description}</li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography variant="body1">No recent activity</Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default AdminDashboard;