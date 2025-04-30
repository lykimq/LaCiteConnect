import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterFormState } from '../types/auth.types';
import { authService } from '../services/authService';

const STORAGE_KEY = '@auth_token';
const TOKEN_EXPIRY_KEY = '@token_expiry';

export const useRegister = () => {
    const [formState, setFormState] = useState<RegisterFormState>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        isLoading: false,
        error: null,
    });

    const updateFormState = (updates: Partial<RegisterFormState>) => {
        setFormState(prev => ({ ...prev, ...updates }));
    };

    const handleRegister = async () => {
        try {
            updateFormState({ isLoading: true, error: null });

            const userData = {
                firstName: formState.firstName,
                lastName: formState.lastName,
                email: formState.email,
                password: formState.password,
            };

            const response = await authService.register(userData);

            if (!response.accessToken || !response.firebaseToken) {
                throw new Error('Invalid response from server: missing tokens');
            }

            // Calculate token expiry (24 hours from now)
            const tokenExpiry = new Date();
            tokenExpiry.setHours(tokenExpiry.getHours() + 24);

            // Store tokens and expiry
            await Promise.all([
                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
                    accessToken: response.accessToken,
                    firebaseToken: response.firebaseToken,
                })),
                AsyncStorage.setItem(TOKEN_EXPIRY_KEY, tokenExpiry.toISOString())
            ]);

            return {
                accessToken: response.accessToken,
                firebaseToken: response.firebaseToken
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
            updateFormState({ error: errorMessage });
            throw error;
        } finally {
            updateFormState({ isLoading: false });
        }
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
        return password === confirmPassword;
    };

    return {
        formState,
        updateFormState,
        handleRegister,
        validateEmail,
        validatePassword,
        validateConfirmPassword,
    };
}