import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { LoginCredentials, RegisterUserDto, AuthResponse, User, AdminLoginCredentials } from '@/types';

/**
 * API Service Configuration
 * Defines the base configuration for API requests:
 * - Base URL for API endpoints
 * - Default headers for all requests
 * - Response interceptors for error handling
 * - Request interceptors for authentication
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

/**
 * API Service Class
 * Handles all HTTP requests to the backend API:
 * - Authentication endpoints
 * - User management
 * - Admin operations
 */
class ApiService {
    private api: AxiosInstance;

    constructor() {
        // Initialize axios instance with base configuration
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        // Add request interceptor for authentication
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Handle unauthorized access
                    localStorage.removeItem('token');
                    window.location.href = '/admin/login';
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Admin Authentication
     * Handles admin login and token management
     */
    auth = {
        /**
         * Authenticate admin user
         * @param credentials Admin login credentials
         * @returns Authentication response with token and user info
         */
        adminLogin: async (credentials: AdminLoginCredentials): Promise<AuthResponse> => {
            const response = await this.api.post<AuthResponse>('/api/auth/admin/login', credentials);
            return response.data;
        },

        /**
         * Validate current authentication token
         * @returns Token validation result
         */
        validateToken: async (): Promise<{ valid: boolean }> => {
            const response = await this.api.get<{ valid: boolean }>('/api/auth/validate');
            return response.data;
        },

        /**
         * Logout current user
         * @returns Logout confirmation
         */
        logout: async (): Promise<void> => {
            localStorage.removeItem('token');
            window.location.href = '/admin/login';
        },
    };

    /**
     * User Management
     * Handles user-related operations
     */
    users = {
        /**
         * Get current user profile
         * @returns User profile information
         */
        getProfile: async (): Promise<User> => {
            const response = await this.api.get<User>('/api/users/profile');
            return response.data;
        },

        /**
         * Update user profile
         * @param data User profile data to update
         * @returns Updated user profile
         */
        updateProfile: async (data: Partial<User>): Promise<User> => {
            const response = await this.api.put<User>('/api/users/profile', data);
            return response.data;
        },
    };

    /**
     * Admin Dashboard
     * Handles admin-specific operations
     */
    admin = {
        /**
         * Get admin dashboard statistics
         * @returns Dashboard statistics
         */
        getDashboard: async () => {
            const response = await this.api.get('/api/auth/admin/dashboard');
            return response.data;
        },
    };
}

// Export singleton instance of the API service
export const apiService = new ApiService();