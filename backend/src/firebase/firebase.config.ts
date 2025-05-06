import * as admin from 'firebase-admin';
import { Logger } from '@nestjs/common';

/**
 * Singleton class for managing Firebase Admin SDK initialization
 * Provides a single instance of the Firebase Admin SDK and ensures it's properly initialized
 * Handles logging and error handling for Firebase Admin SDK initialization
 */

export class FirebaseConfig {
    private static instance: FirebaseConfig;
    private firebaseApp: admin.app.App | null = null;
    private readonly logger = new Logger(FirebaseConfig.name);

    /**
     * Private constructor to prevent direct instantiation
     * Initializes the Firebase Admin SDK
     */
    private constructor() {
        try {
            this.firebaseApp = admin.initializeApp({
                credential: admin.credential.applicationDefault(),
            });
            this.logger.log('Firebase Admin SDK initialized successfully');
        } catch (error) {
            this.logger.warn('Firebase Admin SDK initialization failed, continuing without Firebase features');
            this.logger.debug(error);
        }
    }

    /**
     * Get the singleton instance of FirebaseConfig
     * @returns The singleton instance of FirebaseConfig
     */
    public static getInstance(): FirebaseConfig {
        if (!FirebaseConfig.instance) {
            FirebaseConfig.instance = new FirebaseConfig();
        }
        return FirebaseConfig.instance
    }

    /**
     * Get the Firebase Admin SDK app instance
     * @returns The Firebase Admin SDK app instance or null if not initialized
     */
    public getApp(): admin.app.App | null {
        return this.firebaseApp;
    }

    /**
     * Check if the Firebase Admin SDK is initialized
     * @returns true if the Firebase Admin SDK is initialized, false otherwise
     */
    public isInitialized(): boolean {
        return this.firebaseApp !== null;
    }

}