import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../database/entities';

// Storage
import { LocalStorageProvider } from './storage/local-storage.provider';
import { S3StorageProvider } from './storage/s3-storage.provider';
import { R2StorageProvider } from './storage/r2-storage.provider';
import { StorageService } from './storage/storage.service';

// Search
import { SqlSearchProvider } from '../products/search/sql-search.provider';
import { TypesenseSearchProvider } from '../products/search/typesense-search.provider';
import { MeilisearchSearchProvider } from '../products/search/meilisearch-search.provider';
import { SearchService } from '../products/search/search.service';

// Analytics
import { ConsoleAnalyticsProvider } from './analytics/console-analytics.provider';
import { Ga4AnalyticsProvider } from './analytics/ga4-analytics.provider';
import { FirebaseAnalyticsProvider } from './analytics/firebase-analytics.provider';
import { PostHogAnalyticsProvider } from './analytics/posthog-analytics.provider';
import { AnalyticsService } from './analytics/analytics.service';

// Monitoring & Logging
import { SentryMonitoringProvider } from './monitoring/sentry-monitoring.provider';
import { OpenTelemetryMonitoringProvider } from './monitoring/opentelemetry-monitoring.provider';
import { StructuredLoggerService } from './logging/structured-logger.service';

// Health
import { HealthController } from './health/health.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [HealthController],
  providers: [
    // Storage
    LocalStorageProvider,
    S3StorageProvider,
    R2StorageProvider,
    StorageService,
    // Search
    SqlSearchProvider,
    TypesenseSearchProvider,
    MeilisearchSearchProvider,
    SearchService,
    // Analytics
    ConsoleAnalyticsProvider,
    Ga4AnalyticsProvider,
    FirebaseAnalyticsProvider,
    PostHogAnalyticsProvider,
    AnalyticsService,
    // Monitoring & Logging
    SentryMonitoringProvider,
    OpenTelemetryMonitoringProvider,
    StructuredLoggerService,
  ],
  exports: [
    StorageService,
    SearchService,
    AnalyticsService,
    SentryMonitoringProvider,
    OpenTelemetryMonitoringProvider,
    StructuredLoggerService,
  ],
})
export class CommonModule {}
