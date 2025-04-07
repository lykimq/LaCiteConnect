import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

// Auth controller for handling authentication routes

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
}