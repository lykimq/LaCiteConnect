import { LoginFormState } from '../types/auth.types';

// Base validation functions
const validators = {
    email: (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    password: (password: string) => {
        return password.length >= 6;
    },
    required: (value: string) => {
        return value?.trim().length > 0;
    },
    confirmPassword: (password: string, confirmPassword: string) => {
        return password === confirmPassword;
    }
};

// Error messages
const errorMessages = {
    required: (field: string) => `${field} is required`,
    email: 'Please enter a valid email address',
    password: 'Password must be at least 6 characters long',
    confirmPassword: 'Passwords do not match'
};

// Common validation logic
const validateField = (value: string, fieldName: string, type: 'email' | 'password' | 'required'): string | null => {
    if (!validators.required(value)) {
        return errorMessages.required(fieldName);
    }

    if (type === 'email' && !validators.email(value)) {
        return errorMessages.email;
    }

    if (type === 'password' && !validators.password(value)) {
        return errorMessages.password;
    }

    return null;
};

// Form-specific validation
export const validateLoginFields = (formState: LoginFormState): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    // Validate email
    const emailError = validateField(formState.email, 'Email', 'email');
    if (emailError) errors.email = emailError;

    // Validate password
    const passwordError = validateField(formState.password, 'Password', 'password');
    if (passwordError) errors.password = passwordError;

    return { isValid: Object.keys(errors).length === 0, errors };
};
