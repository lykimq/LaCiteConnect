import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { LoggerModule } from 'nestjs-pino';
import { PrismaService } from './database/prisma.service';
import { DatabaseHealthService } from './database/database.health';

/**
 * Root application module
 * Configures and imports all necessary modules for the application
 */
@Module({
    imports: [
        // Configure environment variables
        ConfigModule.forRoot({
            isGlobal: true, // Make ConfigService available throughout the application
            envFilePath: ['.env', '.env_admin'], // Load both .env and .env_admin files
        }),

        // Configure structured logging
        LoggerModule.forRoot({
            pinoHttp: {
                transport: {
                    target: 'pino-pretty',
                    options: {
                        singleLine: true,
                        colorize: true,
                    },
                },
            },
        }),

        // Import feature modules
        AuthModule, // Authentication and authorization module
        PrismaModule, // Database access module
        EventsModule, // Events module
    ],
    providers: [PrismaService, DatabaseHealthService],
})
export class AppModule { }