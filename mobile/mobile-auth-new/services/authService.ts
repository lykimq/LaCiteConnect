import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth.types';

export const authService = {

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await fetch(`/api/v1/auth/login`, {
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
        const response = await fetch(`/api/v1/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        return response.json();
    }



}