import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * JWT Strategy
 * This strategy handles JWT token validation and user authentication
 * It extends PassportStrategy to implement JWT authentication
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    // Constructor for the JwtStrategy
    constructor(private prisma: PrismaService) {
        super({
            // Extract JWT from Authorization header
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // Don't ignore token expiration
            ignoreExpiration: false,
            // Use JWT secret from environment variables
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    /**
     * Validate the JWT payload and return user information
     * @param payload Decoded JWT payload
     * @returns User information if valid
     * @throws UnauthorizedException if user not found
     */
    async validate(payload: any) {
        // Find user by ID from JWT payload
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        // Return user information without sensitive data
        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }
}