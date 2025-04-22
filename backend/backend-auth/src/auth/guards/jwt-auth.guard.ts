import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 * This guard extends the Passport JWT strategy to protect routes
 * that require authentication
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }