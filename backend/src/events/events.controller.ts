import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request as ExpressRequest } from 'express';

export enum RoleType {
    guest = 'guest',
    user = 'user',
    admin = 'admin'
}

interface RequestWithUser extends ExpressRequest {
    user: {
        id: string;
        email: string;
        role: RoleType;
    };
}

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @Roles(RoleType.user, RoleType.admin)
    createEvent(@Request() req: RequestWithUser, @Body() dto: CreateEventDto) {
        return this.eventsService.createEvent(req.user.id, dto);
    }

    @Get()
    getUpcomingEvents() {
        return this.eventsService.getUpcomingEvents();
    }

    @Get('my-events')
    @Roles(RoleType.user, RoleType.admin)
    getUserEvents(@Request() req: RequestWithUser) {
        return this.eventsService.getUserEvents(req.user.id);
    }

    @Get('my-registrations')
    @Roles(RoleType.user, RoleType.admin)
    getUserRegistrations(@Request() req: RequestWithUser) {
        return this.eventsService.getUserRegistrations(req.user.id);
    }

    @Get(':id')
    getEvent(@Param('id') id: string) {
        return this.eventsService.getEvent(id);
    }

    @Put(':id')
    @Roles(RoleType.user, RoleType.admin)
    updateEvent(
        @Param('id') id: string,
        @Request() req: RequestWithUser,
        @Body() dto: Partial<CreateEventDto>,
    ) {
        return this.eventsService.updateEvent(id, req.user.id, dto);
    }

    @Delete(':id')
    @Roles(RoleType.user, RoleType.admin)
    deleteEvent(@Param('id') id: string, @Request() req: RequestWithUser) {
        return this.eventsService.deleteEvent(id, req.user.id);
    }

    @Post(':id/time-slots')
    @Roles(RoleType.user, RoleType.admin)
    createTimeSlot(
        @Param('id') eventId: string,
        @Request() req: RequestWithUser,
        @Body() dto: { startTime: Date; endTime: Date; maxCapacity: number },
    ) {
        return this.eventsService.createTimeSlot(eventId, req.user.id, dto);
    }

    @Post('register')
    @Roles(RoleType.user, RoleType.admin)
    registerForEvent(@Body() dto: CreateRegistrationDto) {
        return this.eventsService.registerForEvent(dto);
    }

    @Put('registrations/:id/status')
    @Roles(RoleType.admin)
    updateRegistrationStatus(
        @Param('id') registrationId: string,
        @Body('status') status: 'confirmed' | 'cancelled' | 'waitlisted',
    ) {
        return this.eventsService.updateRegistrationStatus(registrationId, status);
    }
}