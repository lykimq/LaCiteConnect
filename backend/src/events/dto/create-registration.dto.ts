import { IsString, IsOptional, IsNumber, IsEmail, Min, IsUUID } from 'class-validator';

export enum RegistrationStatus {
    pending = 'pending',
    confirmed = 'confirmed',
    cancelled = 'cancelled',
    waitlisted = 'waitlisted'
}

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