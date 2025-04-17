import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Logger } from 'nestjs-pino';

@Injectable()
export class DatabaseHealthService implements OnModuleInit {
    private readonly maxRetries = 3;
    private readonly retryDelay = 5000; // 5 seconds

    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: Logger,
    ) { }

    async onModuleInit() {
        await this.checkDatabaseConnection();
    }

    private async checkDatabaseConnection(retryCount = 0): Promise<void> {
        try {
            // Test the database connection
            await this.prisma.$queryRaw`SELECT 1`;
            this.logger.log('Database connection established successfully');
        } catch (error) {
            this.logger.error(`Database connection error: ${error.message}`);

            if (retryCount < this.maxRetries) {
                this.logger.warn(`Retrying database connection (attempt ${retryCount + 1}/${this.maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                await this.checkDatabaseConnection(retryCount + 1);
            } else {
                this.logger.error('Max retries reached. Could not establish database connection.');
                throw new Error('Database connection failed after multiple retries');
            }
        }
    }

    async isHealthy(): Promise<boolean> {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            this.logger.error(`Health check failed: ${error.message}`);
            return false;
        }
    }
}