import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Authentication Controller
 * This controller handles HTTP requests for authentication:
 * - User registration
 * - User login
 * - Token management
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

    // Constructor for the AuthController
    constructor(private readonly authService: AuthService) { }

    /**
     * Register a new user: POST /auth/register
     * @param registerUserDto User registration data
     * @returns Created user information
     */
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    /**
     * Authenticate a user: POST /auth/login
     * @param loginDto User login credentials
     * @returns Authentication tokens and user information
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'User successfully logged in' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}