import { Injectable, Logger } from '@nestjs/common';
import { IMonitoringProvider, ErrorReport, MetricReport } from './monitoring-provider.interface';

@Injectable()
export class SentryMonitoringProvider implements IMonitoringProvider {
  readonly name = 'SENTRY';
  private readonly logger = new Logger(SentryMonitoringProvider.name);
  private readonly dsn = process.env.SENTRY_DSN || 'https://sandbox_key@sentry.io/123456';

  async captureError(report: ErrorReport): Promise<string> {
    const eventId = `sentry_evt_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.logger.error(
      `[SENTRY CAPTURE (${eventId})] Error: ${report.error?.message || report.error} | Context: ${report.context || 'global'}`,
      report.error?.stack,
    );
    return eventId;
  }

  async recordMetric(report: MetricReport): Promise<boolean> {
    this.logger.log(`[SENTRY METRIC] ${report.name}: ${report.value} ${report.unit || ''}`);
    return true;
  }
}
