import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

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

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

    // Event Management
    async createEvent(userId: string, dto: CreateEventDto): Promise<Event> {
        return this.prisma.event.create({
            data: {
                ...dto,
                createdBy: userId,
                currentParticipants: 0,
            },
        });
    }

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

    // Time Slot Management
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

    // Registration Management
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

    // Query Methods
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