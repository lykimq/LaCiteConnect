export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    firebaseToken: string;
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export interface LoginFormState {
    email: string;
    password: string;
    rememberMe: boolean;
    isLoading: boolean;
    error: string | null;
}


export interface RegisterCredentials {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface RegisterFormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    isLoading: boolean;
    error: string | null;
}

