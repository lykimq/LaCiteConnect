/**
 * User role types for role-based access control
 */
export enum RoleType {
    GUEST = 'guest',
    USER = 'user',
    ADMIN = 'admin',
}

/**
 * Session types for authentication persistence
 */
export enum SessionType {
    SESSION = 'session',
    PERSISTENT = 'persistent',
}

/**
 * User interface representing a user in the system
 * @property id - Unique identifier for the user
 * @property email - User's email address
 * @property role - User's role (guest, user, admin)
 * @property firstName - User's first name (optional)
 * @property lastName - User's last name (optional)
 * @property createdAt - Timestamp of user creation (optional)
 * @property updatedAt - Timestamp of last update (optional)
 */
export interface User {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Login credentials interface for authentication
 * @property email - User's email address
 * @property password - User's password
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * User registration data transfer object
 * @property email - User's email address
 * @property password - User's password
 * @property firstName - User's first name (optional)
 * @property lastName - User's last name (optional)
 */
export interface RegisterUserDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

/**
 * Authentication response interface
 * @property user - Authenticated user object
 * @property token - JWT token for subsequent requests
 */
export interface AuthResponse {
    user: User;
    token: string;
}

/**
 * API error interface for standardized error handling
 * @property message - Error message
 * @property statusCode - HTTP status code
 */
export interface ApiError {
    message: string;
    statusCode: number;
}


