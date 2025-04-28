import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, LoginFormState, AuthResponse } from '../types/auth.types';

export const useLogin = () => {
    const [formState, setFormState] = useState<LoginFormState>({
        email: '',
        password: '',
        rememberMe: false,
        isLoading: false,
        error: null
    });

    const updateFormState = (updates: Partial<LoginFormState>) => {
        setFormState(prev => ({ ...prev, ...updates }));
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const login = async (credentials: LoginCredentials) => {
        try {
            updateFormState({ isLoading: true, error: null });

            if (!validateEmail(credentials.email)) {
                throw new Error('Invalid email format');
            }

            if (!validatePassword(credentials.password)) {
                throw new Error('Password must be at least 6 characters');
            }

            // TODO: Replace with your actual API call
            const response = await fetch('YOUR_API_ENDPOINT/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data: AuthResponse = await response.json();

            if (formState.rememberMe) {
                await AsyncStorage.setItem('userToken', data.token);
            }

            return data;
        } catch (error) {
            updateFormState({
                error: error instanceof Error ? error.message : 'An error occurred',
                isLoading: false
            });
            throw error;
        } finally {
            updateFormState({ isLoading: false });
        }
    };

    return {
        formState,
        updateFormState,
        login
    };
};