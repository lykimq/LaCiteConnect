import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterFormState, RegisterCredentials, AuthResponse, SessionType } from '../types/auth.types';
import { authService } from '../services/authService';

export const useRegister = () => {
    const [formState, setFormState] = useState<RegisterFormState>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        phoneRegion: '+1',
        profilePictureUrl: '',
        sessionType: SessionType.SESSION,
        biometricEnabled: false,
        isLoading: false,
        error: null
    });

    const updateFormState = (updates: Partial<RegisterFormState>) => {
        setFormState(prev => ({ ...prev, ...updates }));
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
        return password === confirmPassword;
    };

    const validatePhoneNumber = (phoneNumber: string, phoneRegion: string): boolean => {
        if (!phoneNumber) return true; // Phone number is optional

        // Combine region code and phone number
        const fullNumber = phoneRegion + phoneNumber;
        console.log('Phone number validation:', {
            original: phoneNumber,
            region: phoneRegion,
            fullNumber: fullNumber
        });

        // Remove all non-digit characters for validation
        const cleanedNumber = fullNumber.replace(/\D/g, '');
        console.log('Cleaned number:', cleanedNumber);

        // Check if we have at least 10 digits (including country code)
        return cleanedNumber.length >= 10;
    };

    const handleRegister = async () => {
        try {
            console.log('useRegister hook: Starting registration');
            updateFormState({ isLoading: true, error: null });

            if (!formState.email?.trim()) {
                console.log('useRegister hook: Email validation failed');
                throw new Error('Email is required');
            }

            if (!validateEmail(formState.email)) {
                console.log('useRegister hook: Email format validation failed');
                throw new Error('Please enter a valid email address');
            }

            if (!formState.password?.trim()) {
                console.log('useRegister hook: Password validation failed');
                throw new Error('Password is required');
            }

            if (!validatePassword(formState.password)) {
                console.log('useRegister hook: Password length validation failed');
                throw new Error('Password must be at least 6 characters');
            }

            if (!validateConfirmPassword(formState.password, formState.confirmPassword)) {
                console.log('useRegister hook: Password confirmation validation failed');
                throw new Error('Passwords do not match');
            }

            if (!formState.firstName?.trim()) {
                console.log('useRegister hook: First name validation failed');
                throw new Error('First name is required');
            }

            if (!formState.lastName?.trim()) {
                console.log('useRegister hook: Last name validation failed');
                throw new Error('Last name is required');
            }

            // Format phone number for backend validation
            let formattedPhoneNumber = '';
            if (formState.phoneNumber) {
                // Remove all non-digit characters
                const cleanedNumber = formState.phoneNumber.replace(/\D/g, '');
                // Add the country code if it's not already there
                if (!cleanedNumber.startsWith(formState.phoneRegion.replace('+', ''))) {
                    formattedPhoneNumber = formState.phoneRegion + cleanedNumber;
                } else {
                    formattedPhoneNumber = '+' + cleanedNumber;
                }
                console.log('Formatted phone number:', formattedPhoneNumber);
            }

            const userData: RegisterCredentials = {
                firstName: formState.firstName.trim(),
                lastName: formState.lastName.trim(),
                email: formState.email.trim(),
                password: formState.password,
                phoneNumber: formattedPhoneNumber || undefined,
                phoneRegion: formState.phoneRegion,
                sessionType: formState.sessionType,
                biometricEnabled: formState.biometricEnabled
            };

            console.log('Sending registration data:', userData);
            const response = await authService.register(userData);
            console.log('Registration successful, storing token');

            // Store the access token
            await AsyncStorage.setItem('userToken', response.accessToken);

            return response;
        } catch (error) {
            console.error('useRegister hook: Error during registration:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
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
        handleRegister,
        validateEmail,
        validatePassword,
        validateConfirmPassword,
        validatePhoneNumber,
    };
};