import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * Authentication Module
 * This module configures all authentication-related components:
 * - JWT configuration
 * - Passport strategies
 * - Authentication services
 * - Authorization guards
 */
@Module({

    // Import the Prisma module
    imports: [
        PrismaModule, // Import the Prisma module
        PassportModule, // Import the Passport module
        JwtModule.register({
            secret: process.env.JWT_SECRET, // Secret key for the JWT
            signOptions: { expiresIn: '7d' }, // Options for the JWT
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