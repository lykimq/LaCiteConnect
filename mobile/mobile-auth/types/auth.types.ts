export enum SessionType {
    SESSION = 'session',
    PERSISTENT = 'persistent',
}

export interface LoginCredentials {
    email: string;
    password: string;
    sessionType?: SessionType;
}

export interface AuthResponse {
    accessToken: string;
    firebaseToken?: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}

export interface LoginFormState {
    email: string;
    password: string;
    rememberMe: boolean;
    sessionType?: SessionType;
    isLoading: boolean;
    error: string | null;
}