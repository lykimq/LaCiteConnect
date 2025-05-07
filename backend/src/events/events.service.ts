import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Type representing an event
 */
type Event = {
    id: string;
    title: string;
    description: string | null;
    pictureUrl: string | null;
    address: string;
    latitude: Decimal | null;
    longitude: Decimal | null;
    startTime: Date;
    endTime: Date;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    maxParticipants: number | null;
    currentParticipants: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
};

/**
 * Type representing an event time slot
 */
type EventTimeSlot = {
    id: string;
    eventId: string;
    startTime: Date;
    endTime: Date;
    maxCapacity: number;
    currentCapacity: number;
    status: 'available' | 'reserved' | 'full' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
};

/**
 * Type representing an event registration
 */
type EventRegistration = {
    id: string;
    eventId: string;
    userId: string | null;
    timeSlotId: string | null;
    registrationStatus: 'pending' | 'confirmed' | 'cancelled' | 'waitlisted';
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    numberOfGuests: number;
    additionalNotes: string | null;
    createdAt: Date;
    updatedAt: Date;
};

/**
 * Service for managing events
 */
@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new event
     * @param userId - The ID of the user creating the event
     * @param dto - The data for the new event
     * @returns The created event
     */
    async createEvent(userId: string, dto: CreateEventDto): Promise<Event> {
        return this.prisma.event.create({
            data: {
                ...dto,
                createdBy: userId,
                currentParticipants: 0,
            },
        });
    }

    /**
     * Get an event by ID
     * @param id - The ID of the event to get
     * @returns The event with the given ID
     */
    async getEvent(id: string): Promise<Event & {
        timeSlots: EventTimeSlot[];
        registrations: EventRegistration[];
    }> {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                timeSlots: true,
                registrations: true,
            },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }

        return event;
    }

    /**
     * Update an event
     * @param id - The ID of the event to update
     * @param userId - The ID of the user updating the event
     * @param dto - The data for the updated event
     * @returns The updated event
     */
    async updateEvent(id: string, userId: string, dto: Partial<CreateEventDto>): Promise<Event> {
        const event = await this.prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }

        if (event.createdBy !== userId) {
            throw new BadRequestException('You are not authorized to update this event');
        }

        return this.prisma.event.update({
            where: { id },
            data: dto,
        });
    }

    /**
     * Delete an event
     * @param id - The ID of the event to delete
     * @param userId - The ID of the user deleting the event
     */
    async deleteEvent(id: string, userId: string): Promise<void> {
        const event = await this.prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }

        if (event.createdBy !== userId) {
            throw new BadRequestException('You are not authorized to delete this event');
        }

        await this.prisma.event.delete({
            where: { id },
        });
    }

    /**
     * Create a new time slot for an event
     * @param eventId - The ID of the event to create the time slot for
     * @param userId - The ID of the user creating the time slot
     * @param dto - The data for the new time slot
     * @returns The created time slot
     */
    async createTimeSlot(eventId: string, userId: string, dto: {
        startTime: Date;
        endTime: Date;
        maxCapacity: number;
    }): Promise<EventTimeSlot> {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }

        if (event.createdBy !== userId) {
            throw new BadRequestException('You are not authorized to create time slots for this event');
        }

        return this.prisma.eventTimeSlot.create({
            data: {
                ...dto,
                eventId,
                currentCapacity: 0,
                status: 'available',
            },
        });
    }

    /**
     * Register for an event
     * @param dto - The data for the new registration
     * @returns The created registration
     */
    async registerForEvent(dto: CreateRegistrationDto): Promise<EventRegistration> {
        const event = await this.prisma.event.findUnique({
            where: { id: dto.eventId },
            include: {
                timeSlots: true,
            },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${dto.eventId} not found`);
        }

        if (event.status !== 'published') {
            throw new BadRequestException('Cannot register for an unpublished event');
        }

        if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
            throw new BadRequestException('Event is full');
        }

        // If time slot is specified, validate it
        if (dto.timeSlotId) {
            const timeSlot = event.timeSlots.find((slot: EventTimeSlot) => slot.id === dto.timeSlotId);
            if (!timeSlot) {
                throw new NotFoundException(`Time slot with ID ${dto.timeSlotId} not found`);
            }
            if (timeSlot.currentCapacity >= timeSlot.maxCapacity) {
                throw new BadRequestException('Time slot is full');
            }
        }

        // Create registration
        const registration = await this.prisma.eventRegistration.create({
            data: {
                ...dto,
                registrationStatus: 'pending',
            },
        });

        // Update event and time slot counts
        await this.prisma.event.update({
            where: { id: dto.eventId },
            data: {
                currentParticipants: {
                    increment: 1 + (dto.numberOfGuests || 0),
                },
            },
        });

        if (dto.timeSlotId) {
            await this.prisma.eventTimeSlot.update({
                where: { id: dto.timeSlotId },
                data: {
                    currentCapacity: {
                        increment: 1 + (dto.numberOfGuests || 0),
                    },
                },
            });
        }

        return registration;
    }

    /**
     * Update the status of a registration
     * @param registrationId - The ID of the registration to update
     * @param status - The new status for the registration
     * @returns The updated registration
     */
    async updateRegistrationStatus(
        registrationId: string,
        status: 'confirmed' | 'cancelled' | 'waitlisted',
    ): Promise<EventRegistration> {
        const registration = await this.prisma.eventRegistration.findUnique({
            where: { id: registrationId },
            include: {
                event: true,
                timeSlot: true,
            },
        });

        if (!registration) {
            throw new NotFoundException(`Registration with ID ${registrationId} not found`);
        }

        return this.prisma.eventRegistration.update({
            where: { id: registrationId },
            data: { registrationStatus: status },
        });
    }

    /**
     * Get all upcoming events
     * @returns The upcoming events
     */
    async getUpcomingEvents(): Promise<Event[]> {
        return this.prisma.event.findMany({
            where: {
                status: 'published',
                startTime: {
                    gt: new Date(),
                },
            },
            orderBy: {
                startTime: 'asc',
            },
        });
    }

    /**
     * Get all events created by a user
     * @param userId - The ID of the user to get events for
     * @returns The events created by the user
     */
    async getUserEvents(userId: string): Promise<Event[]> {
        return this.prisma.event.findMany({
            where: {
                createdBy: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /**
     * Get all registrations for a user
     * @param userId - The ID of the user to get registrations for
     * @returns The registrations for the user
     */
    async getUserRegistrations(userId: string): Promise<EventRegistration[]> {
        return this.prisma.eventRegistration.findMany({
            where: {
                userId,
            },
            include: {
                event: true,
                timeSlot: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}