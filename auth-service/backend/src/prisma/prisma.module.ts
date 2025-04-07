import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Prisma Module
 * This module provides the PrismaService globally throughout the application
 * It's marked as @Global() so it doesn't need to be imported in other modules
 */
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }