import { useState, useEffect } from 'react';
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
export const useAdminDashboard = () => {
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

    return {
        user,
        loading,
        error,
        dashboardData,
    };
};

export default useAdminDashboard;