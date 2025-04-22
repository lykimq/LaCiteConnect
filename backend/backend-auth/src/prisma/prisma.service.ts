import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Service
 * This service provides database access through the Prisma Client
 * It handles database connections and ensures proper cleanup
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    /**
     * Initialize the Prisma Client when the module starts
     */
    async onModuleInit() {
        await this.$connect();
    }

    /**
     * Clean up the Prisma Client when the module is destroyed
     */
    async onModuleDestroy() {
        await this.$disconnect();
    }
}