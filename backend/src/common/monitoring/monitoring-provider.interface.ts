export interface ErrorReport {
  error: Error;
  context?: string;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  userId?: string;
}

export interface MetricReport {
  name: string;
  value: number;
  unit?: string;
  tags?: Record<string, string>;
}

export interface IMonitoringProvider {
  readonly name: string;
  captureError(report: ErrorReport): Promise<string>;
  recordMetric?(report: MetricReport): Promise<boolean>;
}
