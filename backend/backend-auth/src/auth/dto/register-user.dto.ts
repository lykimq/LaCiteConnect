import { IsEmail, IsString, IsOptional, IsEnum, IsBoolean, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Session Type Enum
 * Defines the types of user sessions available
 */
export enum SessionType {
    SESSION = 'session',      // Temporary session
    PERSISTENT = 'persistent', // Long-lasting session
}

/**
 * Register User DTO
 * Data Transfer Object for user registration
 * Contains validation rules and Swagger documentation
 */
export class RegisterUserDto {
    // User email address
    @ApiProperty({ description: 'User email address' })
    @IsEmail()
    email: string;

    // User password
    @ApiProperty({ description: 'User password' })
    @IsString()
    password: string;

    // User first name
    @ApiProperty({ description: 'User first name' })
    @IsString()
    firstName: string;

    // User last name
    @ApiProperty({ description: 'User last name' })
    @IsString()
    lastName: string;

    // User phone number
    @ApiProperty({ description: 'User phone number', required: false })
    @IsOptional()
    @Matches(/^\+?[0-9\s\-]{10,20}$/, {
        message: 'Phone number must be in a valid format',
    })
    phoneNumber?: string;

    // User phone region (country code)
    @ApiProperty({ description: 'Phone region (country code)', required: false })
    @IsOptional()
    @IsString()
    phoneRegion?: string;

    // Session type
    @ApiProperty({ description: 'Session type', enum: SessionType, default: SessionType.SESSION })
    @IsOptional()
    @IsEnum(SessionType)
    sessionType?: SessionType;

    // Enable biometric authentication
    @ApiProperty({ description: 'Enable biometric authentication', default: false })
    @IsOptional()
    @IsBoolean()
    biometricEnabled?: boolean;
}