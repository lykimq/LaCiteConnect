import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth.types';
import { API_BASE_URL } from '../config/api';

export const authService = {

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    },

    async register(userData: RegisterCredentials): Promise<AuthResponse> {
        try {
            console.log('Making registration request to:', `${API_BASE_URL}/auth/register`);
            console.log('Request payload:', userData);

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            console.log('Registration response status:', response.status);

            if (!response.ok) {
                const error = await response.json();
                console.error('Registration error:', error);
                throw new Error(error.message || 'Registration failed');
            }

            const result = await response.json();
            console.log('Registration successful:', result);
            return result;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }



}