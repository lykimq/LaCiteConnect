import { RegistrationStatus, TimeSlotStatus } from '@prisma/client';

export interface Event {
    id: string;
    title: string;
    description: string | null;
    pictureUrl: string | null;
    address: string;
    latitude: number | null;
    longitude: number | null;
    startTime: Date;
    endTime: Date;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    maxParticipants: number | null;
    currentParticipants: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface EventTimeSlot {
    id: string;
    eventId: string;
    startTime: Date;
    endTime: Date;
    maxCapacity: number;
    currentCapacity: number;
    status: TimeSlotStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface EventRegistration {
    id: string;
    eventId: string;
    userId: string | null;
    timeSlotId: string | null;
    registrationStatus: RegistrationStatus;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    numberOfGuests: number;
    additionalNotes: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateRegistrationDto {
    eventId: string;
    timeSlotId?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    numberOfGuests: number;
    additionalNotes?: string;
}