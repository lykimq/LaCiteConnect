import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import * as bcrypt from 'bcryptjs';
import { Logger } from '@nestjs/common';

/**
 * Authentication Service
 * Handles all authentication-related business logic including:
 * - User registration and management
 * - Password hashing and verification
 * - JWT token generation and validation
 * - Admin authentication and authorization
 */
@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    /**
     * Register a new user in the system
     * @param registerUserDto User registration data including email, password, and personal information
     * @returns Created user information without sensitive data
     * @throws ConflictException if user already exists
     */
    async register(registerUserDto: RegisterUserDto) {
        // Check for existing user to prevent duplicates
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerUserDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        // Handle profile picture (if provided)
        let profilePictureUrl = null;
        if (registerUserDto.profilePictureUrl) {
            try {
                // For now, we'll just store the base64 data as-is
                // In a production environment, you might want to:
                // 1. Upload the image to a storage service like AWS S3
                // 2. Store the URL in the database
                profilePictureUrl = registerUserDto.profilePictureUrl;

                // Remove the profilePictureUrl from the DTO to prevent type errors
                delete registerUserDto.profilePictureUrl;
            } catch (error) {
                this.logger.error('Error processing profile picture:', error);
                // Continue with registration even if image processing fails
            }
        }

        // Generate secure password hash and salt
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(registerUserDto.password, salt);

        // Create user in PostgreSQL database
        const user = await this.prisma.user.create({
            data: {
                email: registerUserDto.email,
                passwordHash,
                passwordSalt: salt,
                firstName: registerUserDto.firstName,
                lastName: registerUserDto.lastName,
                fullName: `${registerUserDto.firstName} ${registerUserDto.lastName}`,
                phoneNumber: registerUserDto.phoneNumber,
                phoneRegion: registerUserDto.phoneRegion,
                sessionType: registerUserDto.sessionType,
                biometricEnabled: registerUserDto.biometricEnabled,
                profilePictureUrl: profilePictureUrl,
                role: 'user',
            },
        });

        // Generate JWT token with user claims
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);

        // Return the same structure as login for consistency
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                profilePictureUrl: user.profilePictureUrl,
            }
        };
    }

    /**
     * Authenticate a user and generate access tokens
     * @param loginDto User login credentials
     * @returns Authentication tokens and user information
     * @throws UnauthorizedException if credentials are invalid
     */
    async login(loginDto: LoginDto) {
        try {
            // Get user from database
            const user = await this.prisma.user.findUnique({
                where: { email: loginDto.email },
            });

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Update last login timestamp
            await this.prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() },
            });

            // Generate JWT token with user claims
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role,
            };

            const accessToken = this.jwtService.sign(payload);

            return {
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    profilePictureUrl: user.profilePictureUrl,
                },
            };
        } catch (error) {
            this.logger.error('Login error:', error);
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    /**
     * Validate user credentials against stored hash
     * @param email User email address
     * @param password User password
     * @returns User information without sensitive data if valid, null otherwise
     */
    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            const { passwordHash, passwordSalt, ...result } = user;
            return result;
        }
        return null;
    }

    /**
     * Validate the current authentication token
     * @returns Token validation result
     * @note This is a placeholder for token validation logic
     */
    async validateToken() {
        return { valid: true };
    }

    /**
     * Authenticate an admin user with additional security checks
     * @param adminLoginDto Admin login credentials including email, password, and admin secret
     * @returns Authentication token and admin information
     * @throws UnauthorizedException if credentials are invalid
     */
    async adminLogin(adminLoginDto: AdminLoginDto) {
        this.logger.debug('Admin login attempt', { email: adminLoginDto.email });

        // Find admin user with case-insensitive email search
        const admin = await this.prisma.user.findFirst({
            where: {
                email: {
                    equals: adminLoginDto.email,
                    mode: 'insensitive'
                },
                role: 'admin',
            },
        });

        if (!admin) {
            this.logger.warn('Admin not found', { email: adminLoginDto.email });
            throw new UnauthorizedException('Admin user not found');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(adminLoginDto.password, admin.passwordHash);
        if (!isPasswordValid) {
            this.logger.warn('Invalid password for admin', { email: adminLoginDto.email });
            throw new UnauthorizedException('Invalid password');
        }

        // Verify admin secret
        const isAdminSecretValid = await bcrypt.compare(adminLoginDto.adminSecret, admin.adminSecretHash || '');
        if (!isAdminSecretValid) {
            this.logger.warn('Invalid admin secret', { email: adminLoginDto.email });
            throw new UnauthorizedException('Invalid admin secret');
        }

        // Generate JWT token with admin claims
        const payload = {
            sub: admin.id,
            email: admin.email,
            role: admin.role,
            firstName: admin.firstName,
            lastName: admin.lastName,
        };

        const accessToken = this.jwtService.sign(payload);

        this.logger.debug('Admin login successful', { email: adminLoginDto.email });
        return {
            accessToken,
            user: {
                id: admin.id,
                email: admin.email,
                role: admin.role,
                firstName: admin.firstName,
                lastName: admin.lastName,
            },
        };
    }

    /**
     * Get admin dashboard data including system status and user statistics
     * @returns Dashboard data with system status, user statistics, and recent activity
     */
    async getAdminDashboard() {
        this.logger.debug('Fetching admin dashboard data');

        try {
            // Get total users count
            const totalUsers = await this.prisma.user.count();
            this.logger.debug(`Total users: ${totalUsers}`);

            // Get active users (users who logged in within the last 24 hours)
            const activeUsers = await this.prisma.user.count({
                where: {
                    lastLoginAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    }
                }
            });
            this.logger.debug(`Active users: ${activeUsers}`);

            // Get recent activity (last 10 logins)
            const recentActivity = await this.prisma.user.findMany({
                where: {
                    lastLoginAt: {
                        not: undefined
                    }
                },
                orderBy: {
                    lastLoginAt: 'desc'
                },
                take: 10,
                select: {
                    email: true,
                    lastLoginAt: true,
                    role: true
                }
            });
            this.logger.debug(`Recent activity count: ${recentActivity.length}`);

            // Format recent activity
            const formattedActivity = recentActivity.map((user: { email: string; lastLoginAt: Date | null; role: string }) => ({
                description: `${user.email} (${user.role}) logged in at ${user.lastLoginAt?.toISOString()}`
            }));

            // Get system status from database
            interface SystemStatusResult {
                status: number;
            }
            const systemStatus = await this.prisma.$queryRaw<SystemStatusResult[]>`
                SELECT 1 as status
                FROM pg_stat_activity
                WHERE datname = current_database()
                LIMIT 1
            `;
            this.logger.debug(`System status check: ${systemStatus.length > 0 ? 'Operational' : 'Unknown'}`);

            const lastUpdated = new Date().toISOString();
            this.logger.debug(`Dashboard data last updated: ${lastUpdated}`);

            return {
                totalUsers,
                activeUsers,
                systemStatus: systemStatus.length > 0 ? 'Operational' : 'Unknown',
                lastUpdated,
                recentActivity: formattedActivity
            };
        } catch (error) {
            this.logger.error('Error fetching dashboard data:', error);
            throw error;
        }
    }

    /**
     * Handle user logout
     * This method can be extended to handle server-side session invalidation
     * or token blacklisting if needed
     * @returns Success message
     */
    async logout(): Promise<{ message: string }> {
        this.logger.log('User logged out');
        // Note: In a stateless JWT system, the token is invalidated client-side
        // If you need server-side token invalidation, implement it here
        return { message: 'Successfully logged out' };
    }

    /**
     * Update user profile picture
     * @param userId User ID
     * @param profilePictureUrl URL or base64 data of the profile picture
     * @returns Updated user information
     */
    async updateProfilePicture(userId: string, profilePictureUrl: string) {
        try {
            // Update user with new profile picture URL
            const user = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    profilePictureUrl,
                    updatedAt: new Date()
                },
            });

            // Return user information without sensitive data
            return {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePictureUrl: user.profilePictureUrl
            };
        } catch (error) {
            this.logger.error('Error updating profile picture:', error);
            throw new Error('Failed to update profile picture');
        }
    }
}