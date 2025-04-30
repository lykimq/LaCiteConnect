import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, LoginFormState, AuthResponse } from '../types/auth.types';
import { authService } from '../services/authService';

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
    }

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const login = async (credentials: LoginCredentials) => {
        try {
            updateFormState({ isLoading: true, error: null });

            if (!credentials.email?.trim()) {
                throw new Error('Email is required');
            }

            if (!validateEmail(credentials.email)) {
                throw new Error('Please enter a valid email address');
            }

            if (!credentials.password?.trim()) {
                throw new Error('Password is required');
            }

            if (!validatePassword(credentials.password)) {
                throw new Error('Password must be at least 6 characters');
            }

            const response = await authService.login(credentials);

            if (formState.rememberMe) {
                await AsyncStorage.setItem('userToken', response.accessToken);
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            updateFormState({
                error: errorMessage,
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
        login,
        validateEmail,
        validatePassword
    };
};
