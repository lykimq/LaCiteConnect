import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginFormState, LoginCredentials } from '../types/auth.types';
import { authService } from '../services/authService';
import { validateLoginFields } from '../utils/formValidation';

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

    const login = async (credentials: LoginCredentials) => {
        try {
            updateFormState({ isLoading: true, error: null });

            // Validate credentials using the centralized validation
            const validationResult = validateLoginFields({
                email: credentials.email,
                password: credentials.password,
                rememberMe: formState.rememberMe,
                isLoading: false,
                error: null
            });

            if (!validationResult.isValid) {
                throw new Error(Object.values(validationResult.errors)[0]);
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
        login
    };
};