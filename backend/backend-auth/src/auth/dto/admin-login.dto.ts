import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginDto } from './login.dto';

/**
 * Admin Login DTO
 * Data Transfer Object for admin authentication
 * Extends the base LoginDto with additional validation
 */
export class AdminLoginDto extends LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'Admin email' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Admin password' })
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Admin secret key' })
    adminSecret: string;
}