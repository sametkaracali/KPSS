import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  try {
    // Create NestJS application
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Enable CORS
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        process.env.FRONTEND_URL || 'http://localhost:3000',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // Enable validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Set global prefix
    app.setGlobalPrefix('api');

    // Enable shutdown hooks
    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);

    // Start the server
    const port = process.env.PORT || 3001;
    await app.listen(port);
    
    // Log server start information
    logger.log(`🚀 Server running on http://localhost:${port}`);
    logger.log(`📚 API documentation available at http://localhost:${port}/api`);
    
    // Log environment information
    logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`Database URL: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
bootstrap().catch((error) => {
  logger.error('Fatal error during bootstrap:', error);
  process.exit(1);
});
