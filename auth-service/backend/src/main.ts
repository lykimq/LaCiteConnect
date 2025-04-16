import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

/**
 * Main application bootstrap function
 * Sets up the NestJS application with necessary middleware and configurations
 */
async function bootstrap() {
    // Create the NestJS application instance
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true, // Enable buffered logging
    });

    // Get configuration service instance
    const configService = app.get(ConfigService);

    // Parse CORS origins from environment variable
    const corsOrigins = configService.get('CORS_ORIGINS')?.split(',') || ['http://localhost:3000'];
    const corsMethods = configService.get('CORS_METHODS')?.split(',') || ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
    const corsHeaders = configService.get('CORS_ALLOWED_HEADERS')?.split(',') || ['Content-Type', 'Authorization'];

    // Configure CORS with environment-specific settings
    app.enableCors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) {
                return callback(null, true);
            }

            // Check if the origin is in the allowed list
            if (corsOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Log unauthorized origins in development
            if (configService.get('NODE_ENV') === 'development') {
                console.warn(`Blocked CORS request from origin: ${origin}`);
            }

            return callback(new Error('Not allowed by CORS'), false);
        },
        credentials: configService.get('CORS_CREDENTIALS') === 'true',
        methods: corsMethods,
        allowedHeaders: corsHeaders,
        exposedHeaders: ['Authorization'],
        maxAge: 86400, // 24 hours
    });

    // Set global API prefix
    app.setGlobalPrefix('api');

    // Configure global validation pipe for request validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strip properties that don't have decorators
            transform: true, // Automatically transform payloads to DTO instances
            forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
        }),
    );

    // Configure security headers using helmet
    app.use(helmet());

    // Enable cookie parsing
    app.use(cookieParser());

    // Configure structured logging using pino
    app.useLogger(app.get(Logger));

    // Configure Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('Auth Service API')
        .setDescription('Authentication and authorization service API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Start the application on the configured port
    const port = configService.get('PORT') || 3000;
    await app.listen(port);

    // Log application startup information
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
    console.log(`Allowed CORS origins: ${corsOrigins.join(', ')}`);
}

// Start the application
bootstrap();