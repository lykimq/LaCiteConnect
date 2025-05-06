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

export interface RegisterCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    phoneRegion?: string;
    sessionType?: SessionType;
    biometricEnabled?: boolean;
}

export interface RegisterFormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    phoneRegion: string;
    profilePictureUrl: string;
    sessionType?: SessionType;
    biometricEnabled?: boolean;
    isLoading: boolean;
    error: string | null;
}

