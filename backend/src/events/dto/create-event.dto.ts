import { IsString, IsOptional, IsNumber, IsDate, IsEnum, Min, Max, IsLatitude, IsLongitude } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Enum representing different event statuses
 */
export enum EventStatus {
    draft = 'draft',
    published = 'published',
    cancelled = 'cancelled',
    completed = 'completed'
}

/**
 * DTO for creating a new event
 */
export class CreateEventDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    pictureUrl?: string;

    @IsString()
    address: string;

    @IsLatitude()
    @IsOptional()
    latitude?: number;

    @IsLongitude()
    @IsOptional()
    longitude?: number;

    @IsDate()
    @Type(() => Date)
    startTime: Date;

    @IsDate()
    @Type(() => Date)
    endTime: Date;

    @IsEnum(EventStatus)
    @IsOptional()
    status?: EventStatus = EventStatus.draft;

    @IsNumber()
    @Min(1)
    @IsOptional()
    maxParticipants?: number;
}