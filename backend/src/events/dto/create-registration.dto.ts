import { IsString, IsOptional, IsNumber, IsEmail, Min, IsUUID } from 'class-validator';

/**
 * Enum representing different registration statuses
 */
export enum RegistrationStatus {
    pending = 'pending',
    confirmed = 'confirmed',
    cancelled = 'cancelled',
    waitlisted = 'waitlisted'
}

/**
 * DTO for creating a new registration
 */
export class CreateRegistrationDto {
    @IsUUID()
    eventId: string;

    @IsUUID()
    @IsOptional()
    timeSlotId?: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    numberOfGuests?: number = 0;

    @IsString()
    @IsOptional()
    additionalNotes?: string;
}