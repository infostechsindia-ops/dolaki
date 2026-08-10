import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { Request, Response, NextFunction } from 'express';

import { validateEnvironment } from './common/config/env-validator';

async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production';

  // Environment Validation & Fail-Fast Check
  validateEnvironment(isProd);
  if (!isProd && !process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'auramart-secret-key-development-2026';
  }

  const app = await NestFactory.create(AppModule);

  // Configure reverse proxy trust for accurate client IP rate limiting
  const expressInstance = app.getHttpAdapter().getInstance();
  if (expressInstance && typeof expressInstance.set === 'function') {
    expressInstance.set('trust proxy', 1);
  }

  // Enable graceful shutdown hooks for SIGTERM / SIGINT
  app.enableShutdownHooks();

  app.use(cookieParser());

  // Security Headers Middleware (SECURITY-001)
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self';",
    );
    if (isProd) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // Legacy compatibility rewrite: map legacy /api/* (without v1) to /api/v1/*
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (
      req.url.startsWith('/api/') &&
      !req.url.startsWith('/api/v1/') &&
      !req.url.startsWith('/api/docs')
    ) {
      req.url = req.url.replace(/^\/api\//, '/api/v1/');
    }
    next();
  });

  // Configure CORS with production-safe origin whitelist
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        process.env.VENDOR_URL || 'http://localhost:3002',
        process.env.ADMIN_URL || 'http://localhost:3003',
        'http://localhost:3001',
      ];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow non-browser requests (e.g. mobile apps, curl, server-to-server) or matched origins
      if (!origin || !isProd || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Error: Origin ${origin} not permitted.`));
      }
    },
    credentials: true,
  });

  // Set canonical global API prefix to /api/v1
  app.setGlobalPrefix('api/v1');

  // Enable global DTO validation with production-safe stripping
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable global exception filter and response envelope interceptor
  app.useGlobalFilters(new HttpExceptionFilter());
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // Swagger / OpenAPI Specification (enabled ONLY in non-production)
  if (!isProd) {
    const config = new DocumentBuilder()
      .setTitle('AuraMart API')
      .setDescription('Authoritative Commerce OS API Specification')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(
    `🚀 AuraMart Backend is running on: http://localhost:${port}/api/v1`,
  );
}
bootstrap();
