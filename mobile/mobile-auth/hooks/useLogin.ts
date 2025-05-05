import { useState } from 'react';

interface LoginState {
    email: string;
    password: string;
    isLoading: boolean;
    error: string | null;
}

interface UseLoginReturn {
    loginState: LoginState;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    handleLogin: () => Promise<void>;
    resetError: () => void;
}

export const useLogin = (): UseLoginReturn => {
    const [loginState, setLoginState] = useState<LoginState>({
        email: '',
        password: '',
        isLoading: false,
        error: null,
    });

    const setEmail = (email: string) => {
        setLoginState(prev => ({ ...prev, email }));
    };

    const setPassword = (password: string) => {
        setLoginState(prev => ({ ...prev, password }));
    };

    const resetError = () => {
        setLoginState(prev => ({ ...prev, error: null }));
    };

    const handleLogin = async () => {
        try {
            setLoginState(prev => ({ ...prev, isLoading: true, error: null }));

            // TODO: Implement actual login logic here
            console.log('Login attempted with:', {
                email: loginState.email,
                password: loginState.password,
            });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            setLoginState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
            }));
        } finally {
            setLoginState(prev => ({ ...prev, isLoading: false }));
        }
    };

    return {
        loginState,
        setEmail,
        setPassword,
        handleLogin,
        resetError,
    };
};