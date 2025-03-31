import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private firebaseApp: admin.app.App;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        const serviceAccount = this.configService.get('FIREBASE_SERVICE_ACCOUNT');
        this.firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccount)),
            projectId: this.configService.get('FIREBASE_PROJECT_ID'),
        });
    }

    async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
        try {
            return await this.firebaseApp.auth().verifyIdToken(token);
        } catch (error) {
            throw new Error('Invalid Firebase token');
        }
    }

    async createUser(email: string, password: string): Promise<admin.auth.UserRecord> {
        try {
            return await this.firebaseApp.auth().createUser({
                email,
                password,
            });
        } catch (error) {
            throw new Error('Failed to create Firebase user');
        }
    }

    async deleteUser(uid: string): Promise<void> {
        try {
            await this.firebaseApp.auth().deleteUser(uid);
        } catch (error) {
            throw new Error('Failed to delete Firebase user');
        }
    }

    async updateUser(uid: string, updateData: admin.auth.UpdateRequest): Promise<admin.auth.UserRecord> {
        try {
            return await this.firebaseApp.auth().updateUser(uid, updateData);
        } catch (error) {
            throw new Error('Failed to update Firebase user');
        }
    }
}