import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Res, Req, Logger, UnauthorizedException, BadRequestException, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response, Request } from 'express';
import { RolesGuard } from './guards/roles.guard';
import { RoleType } from '@prisma/client';
import { Roles } from './decorators';

/**
 * Authentication Controller
 * Handles all HTTP requests related to authentication and authorization:
 * - User registration and management
 * - User authentication and token generation
 * - Admin authentication and dashboard access
 * - Token validation and security
 *
 * All endpoints are documented with Swagger annotations for API documentation
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    // Constructor for the AuthController
    constructor(private readonly authService: AuthService) { }

    /**
     * Register a new user in the system
     * @param registerUserDto User registration data including email, password, and personal information
     * @param res Express response object for sending HTTP responses
     * @returns HTTP response with created user information or error message
     * @throws ConflictException if email already exists
     */
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    async register(@Body() registerUserDto: RegisterUserDto, @Res() res: Response) {
        this.logger.debug(`Register attempt for email: ${registerUserDto.email}`);
        try {
            const result = await this.authService.register(registerUserDto);
            return res.status(HttpStatus.CREATED).json(result);
        } catch (error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * Authenticate a user and generate access tokens
     * @param loginDto User login credentials
     * @param res Express response object for sending HTTP responses
     * @returns HTTP response with authentication tokens and user information
     * @throws UnauthorizedException if credentials are invalid
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'User successfully logged in' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        this.logger.debug(`Login attempt for email: ${loginDto.email}`);
        try {
            const result = await this.authService.login(loginDto);
            return res.json(result);
        } catch (error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * Validate the current authentication token
     * @param req Express request object containing the authentication token
     * @param res Express response object for sending HTTP responses
     * @returns HTTP response with token validation result
     * @throws UnauthorizedException if token is invalid or expired
     */
    @Get('validate')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Validate authentication token' })
    @ApiResponse({ status: 200, description: 'Token is valid' })
    @ApiResponse({ status: 401, description: 'Invalid or expired token' })
    async validateToken(@Req() req: Request, @Res() res: Response) {
        this.logger.debug('Token validation request');
        try {
            const result = await this.authService.validateToken();
            return res.json(result);
        } catch (error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * Authenticate an admin user with additional security checks
     * @param adminLoginDto Admin login credentials including email, password, and admin secret
     * @param res Express response object for sending HTTP responses
     * @returns HTTP response with authentication token and admin information
     * @throws UnauthorizedException if credentials are invalid
     * @throws ForbiddenException if admin secret is invalid
     */
    @Post('admin/login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login admin user' })
    @ApiResponse({ status: 200, description: 'Admin successfully logged in' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 403, description: 'Invalid admin secret' })
    async adminLogin(@Body() adminLoginDto: AdminLoginDto, @Res() res: Response) {
        this.logger.debug(`Admin login attempt for email: ${adminLoginDto.email}`);
        try {
            const result = await this.authService.adminLogin(adminLoginDto);
            return res.json(result);
        } catch (error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * Access the admin dashboard with statistics and management features
     * @returns HTTP response with admin dashboard data
     * @throws UnauthorizedException if user is not authenticated
     * @throws ForbiddenException if user is not an admin
     */
    @Get('admin/dashboard')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.admin)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Access admin dashboard' })
    @ApiResponse({ status: 200, description: 'Admin dashboard data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async getAdminDashboard(@Res() res: Response) {
        this.logger.debug('Admin dashboard access request');
        try {
            const data = await this.authService.getAdminDashboard();
            // Disable caching
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            return res.json(data);
        } catch (error) {
            this.logger.error('Error fetching dashboard data:', error);
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * Handle user logout
     * @param res Express response object
     * @returns HTTP response with logout confirmation
     */
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Logout current user' })
    @ApiResponse({ status: 200, description: 'Successfully logged out' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    async logout(@Res() res: Response) {
        this.logger.debug('Logout request received');
        try {
            const result = await this.authService.logout();
            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * Update user profile picture
     * @param req Request object containing the user data from JWT token
     * @param updateProfilePictureDto DTO containing the profile picture URL
     * @param res Express response object
     * @returns Updated user information
     */
    @Put('profile-picture')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user profile picture' })
    @ApiResponse({ status: 200, description: 'Profile picture updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async updateProfilePicture(
        @Req() req: any,
        @Body() updateProfilePictureDto: UpdateProfilePictureDto,
        @Res() res: Response
    ) {
        this.logger.debug('Update profile picture request');
        try {
            const userId = req.user.id; // Extract user ID from JWT token
            const result = await this.authService.updateProfilePicture(userId, updateProfilePictureDto.profilePictureUrl);
            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            this.logger.error('Error updating profile picture:', error);
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal server error'
            });
        }
    }

    @Get('health')
    @ApiOperation({ summary: 'Check authentication service health' })
    @ApiResponse({ status: 200, description: 'Service is healthy' })
    async healthCheck(@Res() res: Response) {
        this.logger.debug('Health check request received');
        return res.status(HttpStatus.OK).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'auth-service'
        });
    }
}