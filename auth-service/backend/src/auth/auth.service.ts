import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Auth service for handling authentication

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }
}