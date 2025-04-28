import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { RegisterFormState, AuthError } from '../types/auth.types';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Platform } from 'react-native';
import { config } from '../config';

WebBrowser.maybeCompleteAuthSession();

const STORAGE_KEY = '@auth_token';

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

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: config.auth.google.webClientId,
        iosClientId: config.auth.google.iosClientId,
        androidClientId: config.auth.google.androidClientId,
        redirectUri: 'myapp://oauth2redirect/google',
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

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
                accessToken: response.accessToken,
                firebaseToken: response.firebaseToken,
            }));

            return response;
        } catch (error) {
            const authError: AuthError = {
                message: error instanceof Error ? error.message : 'An unexpected error occurred',
            };
            updateFormState({ error: authError });
            throw error;
        } finally {
            updateFormState({ isLoading: false });
        }
    };

    const handleGoogleLogin = async () => {
        try {
            updateFormState({ isLoading: true, error: null });

            if (!request) {
                throw new Error('Google auth request not initialized');
            }

            const result = await promptAsync();

            if (result.type === 'success' && result.authentication) {
                const response = await authService.googleLogin(result.authentication.accessToken);

                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
                    accessToken: response.accessToken,
                    firebaseToken: response.firebaseToken,
                }));

                return response;
            }
        } catch (error) {
            const authError: AuthError = {
                message: error instanceof Error ? error.message : 'Google login failed',
            };
            updateFormState({ error: authError });
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
        handleGoogleLogin,
        validateEmail,
        validatePassword,
        validateConfirmPassword,
    };
};