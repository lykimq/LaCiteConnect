import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Main application entry point
 * This file bootstraps the NestJS application and configures global settings
 */
async function bootstrap() {
    // Create the NestJS application instance
    const app = await NestFactory.create(AppModule);

    // Enable CORS for web and mobile clients
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:19006'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    // Enable global validation pipe for DTOs
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // Strip properties that don't have decorators
        transform: true, // Automatically transform payloads to DTO instances
    }));

    // Swagger API documentation setup
    const config = new DocumentBuilder()
        .setTitle('LaCiteConnect Auth Service')
        .setDescription('Authentication service API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Start the application on port 3000
    await app.listen(3000);
}
bootstrap();