import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SessionType } from './register-user.dto';

/**
 * Login DTO
 * Data Transfer Object for user authentication
 * Contains validation rules and Swagger documentation
 */
export class LoginDto {

    // User email address
    @ApiProperty({ description: 'User email address' })
    @IsEmail()
    email: string;

    // User password
    @ApiProperty({ description: 'User password' })
    @IsString()
    password: string;

    // User session type
    @ApiProperty({ description: 'Session type', enum: SessionType, default: SessionType.SESSION })
    @IsOptional()
    @IsEnum(SessionType)
    sessionType?: SessionType;
}