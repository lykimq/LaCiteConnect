import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterFormState, RegisterCredentials, AuthResponse, SessionType } from '../types/auth.types';
import { authService } from '../services/authService';
import { validateRegisterFields } from '../utils/formValidation';

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

            // Validate form using the centralized validation
            const validationResult = validateRegisterFields(formState);
            if (!validationResult.isValid) {
                throw new Error(Object.values(validationResult.errors)[0]);
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
            console.log('Registration successful');

            // Store user data
            if (response.user) {
                await AsyncStorage.setItem('userData', JSON.stringify({
                    id: response.user.id,
                    email: response.user.email,
                    firstName: response.user.firstName,
                    lastName: response.user.lastName,
                    role: response.user.role
                }));
            }

            return response;
        } catch (error) {
            console.error('useRegister hook: Error during registration:', error);
            let errorMessage = 'An error occurred during registration';

            if (error instanceof Error) {
                // Check for specific error messages
                if (error.message.includes('phone_number')) {
                    errorMessage = 'This phone number is already registered. Please use a different number or leave it empty.';
                } else if (error.message.includes('email')) {
                    errorMessage = 'This email is already registered. Please use a different email address.';
                } else {
                    errorMessage = error.message;
                }
            }

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
        validatePhoneNumber,
    };
};