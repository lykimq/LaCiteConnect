import axios from 'axios';
import { LoginCredentials, RegisterUserDto, AuthResponse, ApiError, User } from '@/types';

/**
 * Creates an Axios instance with default configuration
 * - Sets base URL from environment variable or default
 * - Configures default headers
 */
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor for adding authentication token
 * - Checks for token in localStorage
 * - Adds token to Authorization header if present
 * - Maintains security by including token in all requests
 */
api.interceptors.request.use(
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

/**
 * Response interceptor for handling errors
 * - Handles 401 unauthorized errors
 * - Removes invalid token and redirects to login
 * - Provides consistent error handling
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

/**
 * Authentication service methods
 * Provides type-safe methods for authentication operations
 */
export const authService = {
    /**
     * Authenticates a user with email and password
     * @param credentials - User's login credentials
     * @returns Promise with authentication response
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    /**
     * Registers a new user
     * @param userData - User registration data
     * @returns Promise with authentication response
     */
    register: async (userData: RegisterUserDto): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', userData);
        return response.data;
    },

    /**
     * Validates the current authentication token
     * @returns Promise with user data if token is valid
     */
    validateToken: async (): Promise<User> => {
        const response = await api.get<User>('/auth/validate');
        return response.data;
    },

    /**
     * Logs out the current user
     * Removes authentication token from localStorage
     */
    logout: () => {
        localStorage.removeItem('token');
    },
};

export default api;