import { Injectable, Logger } from '@nestjs/common';
import { IMonitoringProvider, ErrorReport, MetricReport } from './monitoring-provider.interface';

@Injectable()
export class OpenTelemetryMonitoringProvider implements IMonitoringProvider {
  readonly name = 'OPENTELEMETRY';
  private readonly logger = new Logger(OpenTelemetryMonitoringProvider.name);
  private readonly collectorUrl = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces';

  async captureError(report: ErrorReport): Promise<string> {
    const traceId = `otel_trace_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.logger.error(
      `[OTEL TRACE (${traceId}) -> ${this.collectorUrl}] Error: ${report.error?.message || report.error}`,
    );
    return traceId;
  }

  async recordMetric(report: MetricReport): Promise<boolean> {
    this.logger.log(`[OTEL METRIC] ${report.name} = ${report.value}`);
    return true;
  }
}
