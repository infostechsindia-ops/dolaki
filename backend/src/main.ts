import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable Cross-Origin Resource Sharing (CORS) with secure defaults
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable global DTO validation & stripping of unknown properties
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Security environment validation
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'auramart-secret-key-development-2026';
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ FATAL: JWT_SECRET environment variable must be set in production!');
    }
  }
  
  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`🚀 AuraMart Backend is running on: http://localhost:${port}/api`);
}
bootstrap();
