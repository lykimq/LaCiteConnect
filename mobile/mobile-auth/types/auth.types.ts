export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
    };
    token: string;
}

export interface AuthError {
    message: string;
}

export interface LoginFormState {
    email: string;
    password: string;
    rememberMe: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface RegisterFormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    isLoading: boolean;
    error: AuthError | null;
}

export interface SocialLoginProvider {
    id: string;
    name: string;
    icon: string;
    color: string;
}