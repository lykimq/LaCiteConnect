export interface LoginCredentials {
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

export interface LoginFormState {
    email: string;
    password: string;
    rememberMe: boolean;
    isLoading: boolean;
    error: string | null;
}


