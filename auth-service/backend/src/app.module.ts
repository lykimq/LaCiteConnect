import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

/**
 * Root module of the application
 * This module imports all other modules and configures global settings
 */
@Module({
    imports: [
        // Load environment variables from .env file
        ConfigModule.forRoot({
            isGlobal: true, // Make ConfigModule available throughout the application
        }),
        // Import the authentication module
        AuthModule,
        // Import the Prisma module for database access
        PrismaModule,
    ],
})
export class AppModule { }