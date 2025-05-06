import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseConfig } from './firebase.config';

/**
 * Firebase Authentication Service
 * Handles all Firebase authentication-related operations
 * Provides methods for user management, token verification, and custom token creation
 */
@Injectable()
export class FirebaseAuthService {
    private readonly logger = new Logger(FirebaseAuthService.name);
    private readonly firebaseApp: admin.app.App | null;

    constructor() {
        this.firebaseApp = FirebaseConfig.getInstance().getApp();
    }

    /**
     * Create a new user in Firebase Authentication
     * @param email - The email address of the user
     * @param password - The password of the user
     * @param displayName - The display name of the user
     * @returns The created user record
     */
    async createUser(email: string, password: string, displayName: string): Promise<admin.auth.UserRecord> {
        if (!this.firebaseApp) {
            throw new Error('Firebase Admin SDK is not initialized');
        }

        try {
            return await this.firebaseApp.auth().createUser({
                email,
                password,
                displayName,
            });
        } catch (error) {
            this.logger.error('Error creating user', error);
            throw error;
        }
    }

    /**
     * Get a user by email from Firebase Authentication
     * @param email - The email address of the user
     * @returns The user record or null if the user does not exist
     */
    async getUserByEmail(email: string): Promise<admin.auth.UserRecord | null> {
        if (!this.firebaseApp) {
            throw new Error('Firebase Admin SDK is not initialized');
        }
        try {
            return await this.firebaseApp.auth().getUserByEmail(email);
        } catch (error) {
            this.logger.error('Error getting user by email', error);
            throw error;
        }
    }

    /**
     * Create a custom token for a user
     * @param uid - The unique identifier of the user
     * @returns The custom token
     */
    async createCustomToken(uid: string): Promise<string> {
        if (!this.firebaseApp) {
            throw new Error('Firebase Admin SDK is not initialized');
        }
        try {
            return await this.firebaseApp.auth().createCustomToken(uid);
        } catch (error) {
            this.logger.error('Error creating custom token', error);
            throw error;
        }
    }

    /**
     * Verify an ID token
     * @param idToken - The ID token to verify
     * @returns The decoded ID token
     */
    async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
        if (!this.firebaseApp) {
            throw new Error('Firebase Admin SDK is not initialized');
        }
        try {
            return await this.firebaseApp.auth().verifyIdToken(idToken);
        } catch (error) {
            this.logger.error('Error verifying ID token', error);
            throw error;
        }
    }

    /**
     * Delete a user from Firebase Authentication
     * @param uid - The unique identifier of the user
     */
    async deleteUser(uid: string): Promise<void> {
        if (!this.firebaseApp) {
            throw new Error('Firebase Admin SDK is not initialized');
        }
        try {
            await this.firebaseApp.auth().deleteUser(uid);
        } catch (error) {
            this.logger.error('Error deleting user', error);
            throw error;
        }
    }

    /**
     * Update a user in Firebase Authentication
     * @param uid - The unique identifier of the user
     * @param data - The data to update the user with
     * @returns The updated user record
     */
    async updateUser(uid: string, data: Partial<admin.auth.UpdateRequest>): Promise<admin.auth.UserRecord> {
        if (!this.firebaseApp) {
            throw new Error('Firebase Admin SDK is not initialized');
        }
        try {
            return await this.firebaseApp.auth().updateUser(uid, data);
        } catch (error) {
            this.logger.error('Error updating user', error);
            throw error;
        }
    }

    /**
     * List all users in Firebase Authentication
     * @param maxResults - The maximum number of users to return
     * @param pageToken - The page token to use for pagination
     * @returns The list of users
     */
    async listUsers(maxResults: number = 1000, pageToken?: string): Promise<admin.auth.ListUsersResult> {
        if (!this.firebaseApp) {
            throw new Error('Firebase Admin SDK is not initialized');
        }
        try {
            return await this.firebaseApp.auth().listUsers(maxResults, pageToken);
        } catch (error) {
            this.logger.error('Error listing users', error);
            throw error;
        }
    }

    /**
     * Check if Firebase is initialized
     * @returns boolean indicating if Firebase is initialized
     */
    isInitialized(): boolean {
        return this.firebaseApp !== null;
    }
}