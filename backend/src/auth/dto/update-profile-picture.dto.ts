import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for updating user profile picture
 * Contains validation rules and Swagger documentation
 */
export class UpdateProfilePictureDto {
    @ApiProperty({ description: 'Profile picture URL or base64 data' })
    @IsString()
    @IsNotEmpty()
    profilePictureUrl: string;
}