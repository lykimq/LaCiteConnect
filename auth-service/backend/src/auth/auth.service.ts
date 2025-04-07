import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import * as admin from 'firebase-admin';

/**
 * Authentication Service
 * This service handles all authentication-related business logic:
 * - User registration
 * - User login
 * - Password hashing
 * - Token generation
 * - Firebase integration
 */
@Injectable()
export class AuthService {

    // Constructor for the AuthService
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {
        // Initialize Firebase Admin
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
    }

    /**
     * Register a new user
     * @param registerUserDto User registration data
     * @returns Created user information
     */
    async register(registerUserDto: RegisterUserDto) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerUserDto.email }, // Check if user already exists
        });

        // If user already exists, throw a conflict exception
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const passwordHash = await bcrypt.hash(registerUserDto.password, salt); // Hash the password

        // Create user in Firebase
        const firebaseUser = await admin.auth().createUser({
            email: registerUserDto.email, // User email address
            password: registerUserDto.password, // User password
            displayName: `${registerUserDto.firstName} ${registerUserDto.lastName}`, // User display name
        });

        // Create user in PostgreSQL
        const user = await this.prisma.user.create({
            data: {
                email: registerUserDto.email, // User email address
                passwordHash, // Password hash
                passwordSalt: salt, // Password salt
                firstName: registerUserDto.firstName, // User first name
                lastName: registerUserDto.lastName, // User last name
                fullName: `${registerUserDto.firstName} ${registerUserDto.lastName}`, // User full name
                phoneNumber: registerUserDto.phoneNumber, // User phone number
                phoneRegion: registerUserDto.phoneRegion, // User phone region
                sessionType: registerUserDto.sessionType, // User session type
                biometricEnabled: registerUserDto.biometricEnabled,
                role: 'user', // Default role for new users
            },
        });

        return {
            id: user.id, // User ID
            email: user.email, // User email address
            firstName: user.firstName, // User first name
            lastName: user.lastName, // User last name
        };
    }

    /**
     * Authenticate a user and generate tokens
     * @param loginDto User login credentials
     * @returns Authentication tokens and user information
     */
    async login(loginDto: LoginDto) {
        // Verify credentials with Firebase
        try {
            const firebaseUser = await admin.auth().getUserByEmail(loginDto.email); // Get user by email
            const customToken = await admin.auth().createCustomToken(firebaseUser.uid); // Create custom token

            // Get user from PostgreSQL
            const user = await this.prisma.user.findUnique({
                where: { email: loginDto.email }, // Get user by email
            });

            // If user not found, throw an unauthorized exception
            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Update last login time
            await this.prisma.user.update({
                where: { id: user.id }, // Update user by ID
                data: { lastLoginAt: new Date() }, // Update last login time
            });

            // Generate JWT token
            const payload = {
                sub: user.id, // User ID
                email: user.email, // User email address
                role: user.role, // User role
            };

            const accessToken = this.jwtService.sign(payload); // Generate JWT token

            return {
                accessToken, // Access token
                firebaseToken: customToken, // Firebase token
                user: {
                    id: user.id, // User ID
                    email: user.email, // User email address
                    firstName: user.firstName, // User first name
                    lastName: user.lastName, // User last name
                    role: user.role, // User role
                },
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    /**
     * Validate user credentials
     * @param email User email
     * @param password User password
     * @returns User information if valid, null otherwise
     */
    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }, // Get user by email
        });

        // If user exists and password is valid, return the user
        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            const { passwordHash, passwordSalt, ...result } = user;
            return result;
        }
        return null;
    }
}