import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request as ExpressRequest } from 'express';

/**
 * Enum representing different user roles
 */
export enum RoleType {
    guest = 'guest',
    user = 'user',
    admin = 'admin'
}

/**
 * Interface representing a request with a user object
 */
interface RequestWithUser extends ExpressRequest {
    user: {
        id: string;
        email: string;
        role: RoleType;
    };
}

/**
 * Controller for managing events
 */
@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    // Create a new event
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.user, RoleType.admin)
    createEvent(@Request() req: RequestWithUser, @Body() dto: CreateEventDto) {
        return this.eventsService.createEvent(req.user.id, dto);
    }

    // Get all upcoming events - Public access
    @Get()
    getUpcomingEvents() {
        return this.eventsService.getUpcomingEvents();
    }

    // Get all events created by the user
    @Get('my-events')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.user, RoleType.admin)
    getUserEvents(@Request() req: RequestWithUser) {
        return this.eventsService.getUserEvents(req.user.id);
    }

    // Get all registrations for the user
    @Get('my-registrations')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.user, RoleType.admin)
    getUserRegistrations(@Request() req: RequestWithUser) {
        return this.eventsService.getUserRegistrations(req.user.id);
    }

    // Get a specific event by ID - Public access
    @Get(':id')
    getEvent(@Param('id') id: string) {
        return this.eventsService.getEvent(id);
    }

    // Update an existing event
    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.user, RoleType.admin)
    updateEvent(
        @Param('id') id: string,
        @Request() req: RequestWithUser,
        @Body() dto: Partial<CreateEventDto>,
    ) {
        return this.eventsService.updateEvent(id, req.user.id, dto);
    }

    // Delete an existing event
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.user, RoleType.admin)
    deleteEvent(@Param('id') id: string, @Request() req: RequestWithUser) {
        return this.eventsService.deleteEvent(id, req.user.id);
    }

    // Create a new time slot for an event
    @Post(':id/time-slots')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.user, RoleType.admin)
    createTimeSlot(
        @Param('id') eventId: string,
        @Request() req: RequestWithUser,
        @Body() dto: { startTime: Date; endTime: Date; maxCapacity: number },
    ) {
        return this.eventsService.createTimeSlot(eventId, req.user.id, dto);
    }

    // Register for an event
    @Post('register')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.user, RoleType.admin)
    registerForEvent(@Body() dto: CreateRegistrationDto) {
        return this.eventsService.registerForEvent(dto);
    }

    // Update the status of a registration
    @Put('registrations/:id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.admin)
    updateRegistrationStatus(
        @Param('id') registrationId: string,
        @Body('status') status: 'confirmed' | 'cancelled' | 'waitlisted',
    ) {
        return this.eventsService.updateRegistrationStatus(registrationId, status);
    }
}