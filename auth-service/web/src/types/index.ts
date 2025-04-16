/**
 * Type Definitions
 * This file contains all shared type definitions for the application:
 * - User and authentication types
 * - API request/response types
 * - Component prop types
 */

/**
 * User Role Type
 * Defines the possible roles a user can have in the system
 */
export type UserRole = 'user' | 'admin';

/**
 * User Interface
 * Defines the structure of a user object in the system
 */
export interface User {
    id: string;              // Unique user identifier
    email: string;           // User's email address
    firstName: string;       // User's first name
    lastName: string;        // User's last name
    role: UserRole;          // User's role in the system
    phoneNumber?: string;    // Optional phone number
    phoneRegion?: string;    // Optional phone region code
    sessionType?: string;    // Optional session type preference
    biometricEnabled?: boolean; // Optional biometric authentication preference
    lastLoginAt?: Date;      // Optional timestamp of last login
}

/**
 * Admin Login Credentials
 * Defines the structure of admin login credentials
 */
export interface AdminLoginCredentials {
    email: string;           // Admin email address
    password: string;        // Admin password
    adminSecret: string;     // Admin secret for additional security
}

/**
 * Authentication Response
 * Defines the structure of authentication responses
 */
export interface AuthResponse {
    accessToken: string;     // JWT access token
    user: User;              // User information
}

/**
 * Register User DTO
 * Defines the structure of user registration data
 */
export interface RegisterUserDto {
    email: string;           // User email address
    password: string;        // User password
    firstName: string;       // User first name
    lastName: string;        // User last name
    phoneNumber?: string;    // Optional phone number
    phoneRegion?: string;    // Optional phone region code
    sessionType?: string;    // Optional session type preference
    biometricEnabled?: boolean; // Optional biometric authentication preference
}

/**
 * Login Credentials
 * Defines the structure of user login credentials
 */
export interface LoginCredentials {
    email: string;           // User email address
    password: string;        // User password
}

/**
 * Error Response
 * Defines the structure of error responses from the API
 */
export interface ErrorResponse {
    message: string;         // Error message
    status?: number;         // Optional HTTP status code
    code?: string;           // Optional error code
}

/**
 * API Response
 * Generic type for API responses
 * @template T - Type of the response data
 */
export interface ApiResponse<T> {
    data: T;                // Response data
    status: number;         // HTTP status code
    message?: string;       // Optional response message
}

/**
 * Pagination Parameters
 * Defines the structure of pagination parameters
 */
export interface PaginationParams {
    page: number;           // Current page number
    limit: number;          // Number of items per page
    sortBy?: string;        // Optional field to sort by
    sortOrder?: 'asc' | 'desc'; // Optional sort order
}

/**
 * Paginated Response
 * Generic type for paginated API responses
 * @template T - Type of the paginated items
 */
export interface PaginatedResponse<T> {
    items: T[];             // Array of paginated items
    total: number;          // Total number of items
    page: number;           // Current page number
    limit: number;          // Number of items per page
    totalPages: number;     // Total number of pages
}

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
 * Login credentials interface for authentication
 * @property email - User's email address
 * @property password - User's password
 */
export interface LoginCredentials {
    email: string;
    password: string;
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


