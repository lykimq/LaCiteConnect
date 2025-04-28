import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth.types';
import { config } from '../config';

const API_URL = config.api.baseUrl;

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
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
        const response = await fetch(`${API_URL}/auth/register`, {
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
    },

    async googleLogin(accessToken: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessToken }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Google login failed');
        }

        return response.json();
    },

    async facebookLogin(accessToken: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/facebook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessToken }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Facebook login failed');
        }

        return response.json();
    },

    async appleLogin(identityToken: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/apple`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identityToken }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Apple login failed');
        }

        return response.json();
    },

    async forgotPassword(email: string): Promise<void> {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Password reset request failed');
        }
    },

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Password reset failed');
        }
    },
};