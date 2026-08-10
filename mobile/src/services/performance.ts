export interface PerformanceMetric {
  name: string;
  durationMs: number;
  timestamp: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];

  logScreenRenderTime(screenName: string, durationMs: number): void {
    this.metrics.push({
      name: `render:${screenName}`,
      durationMs,
      timestamp: Date.now(),
    });
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[PERF METRIC] Screen ${screenName} rendered in ${durationMs}ms`);
    }
  }

  logApiLatency(endpoint: string, durationMs: number): void {
    this.metrics.push({
      name: `api:${endpoint}`,
      durationMs,
      timestamp: Date.now(),
    });
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
}

export const performanceMonitor = new PerformanceMonitor();
