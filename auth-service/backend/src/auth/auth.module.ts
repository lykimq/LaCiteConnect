import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * Authentication Module
 * Handles all authentication-related functionality including:
 * - User registration and login
 * - JWT token generation and validation
 * - Password hashing and verification
 * - Admin authentication
 */
@Module({

    // Import the Prisma module
    imports: [
        PrismaModule, // Import the Prisma module
        PassportModule.register({ defaultStrategy: 'jwt' }), // Configure Passport for authentication strategies
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRATION') || '1h',
                },
            }),
            inject: [ConfigService],
        }),
    ],

    // Import the AuthController
    controllers: [AuthController],

    // Import the AuthService
    providers: [AuthService, JwtStrategy, RolesGuard],

    // Export the AuthService
    exports: [AuthService],
})

export class AuthModule { }