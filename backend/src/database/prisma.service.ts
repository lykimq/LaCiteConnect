import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Service for managing the Prisma client
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: ['query', 'info', 'warn', 'error'],
        });
    }

    /**
     * Initialize the Prisma client
     */
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Successfully connected to the database');
        } catch (error) {
            this.logger.error('Failed to connect to the database', error);
            throw error;
        }
    }

    /**
     * Disconnect from the database
     */
    async onModuleDestroy() {
        try {
            await this.$disconnect();
            this.logger.log('Successfully disconnected from the database');
        } catch (error) {
            this.logger.error('Failed to disconnect from the database', error);
            throw error;
        }
    }
}
