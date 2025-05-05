import { LoginCredentials, AuthResponse } from '../types/auth.types';

import { API_BASE_URL } from '../config/api';

interface RegisterCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

class AuthService {

    async testConnection(): Promise<boolean> {
        try {
            console.log('Testing connection to:', `${API_BASE_URL}/api/v1/auth/health`);
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            return response.ok;
        } catch (error) {
            console.error('Connection test failed:', error);
            if (error instanceof Error) {
                console.error('Error details:', error.message);
            }
            return false;
        }
    }

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        try {
            console.log('Attempting registration to:', `${API_BASE_URL}/api/v1/auth/register`);
            console.log('Registration credentials:', {
                email: credentials.email,
                password: '******',
                firstName: credentials.firstName,
                lastName: credentials.lastName
            });

            const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            console.log('Registration response status:', response.status);
            const responseData = await response.json();
            console.log('Registration response data:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'Registration failed');
            }

            return responseData;
        } catch (error) {
            console.error('Registration error:', error);
            if (error instanceof Error) {
                if (error.message.includes('Network request failed')) {
                    throw new Error('Unable to connect to the server. Please check your internet connection.');
                }
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            console.log('Attempting login to:', `${API_BASE_URL}/api/v1/auth/login`);
            console.log('Login credentials:', {
                email: credentials.email,
                password: credentials.password ? '******' : undefined,
                sessionType: credentials.sessionType
            });

            const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            console.log('Login response status:', response.status);
            const responseData = await response.json();
            console.log('Login response data:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'Login failed');
            }

            return responseData;
        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof Error) {
                if (error.message.includes('Network request failed')) {
                    throw new Error('Unable to connect to the server. Please check your internet connection.');
                }
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
    }
}

export const authService = new AuthService();