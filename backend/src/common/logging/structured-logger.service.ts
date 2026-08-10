import { Injectable, LoggerService, LogLevel } from '@nestjs/common';

export interface StructuredLogMessage {
  timestamp: string;
  level: LogLevel;
  context?: string;
  message: string;
  trace?: string;
  service: string;
  environment: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class StructuredLoggerService implements LoggerService {
  private readonly serviceName = 'auramart-backend';
  private readonly environment = process.env.NODE_ENV || 'development';

  private emitJson(level: LogLevel, message: any, context?: string, trace?: string) {
    const logObj: StructuredLogMessage = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message: typeof message === 'object' ? JSON.stringify(message) : String(message),
      trace,
      service: this.serviceName,
      environment: this.environment,
    };

    if (this.environment === 'production' || process.env.STRUCTURED_LOGGING === 'true') {
      console.log(JSON.stringify(logObj));
    } else {
      const color = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[32m';
      const reset = '\x1b[0m';
      console.log(`${color}[${logObj.timestamp}] [${level.toUpperCase()}] [${context || 'App'}]: ${logObj.message}${reset}`);
      if (trace) {
        console.error(trace);
      }
    }
  }

  log(message: any, context?: string) {
    this.emitJson('log', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.emitJson('error', message, context, trace);
  }

  warn(message: any, context?: string) {
    this.emitJson('warn', message, context);
  }

  debug?(message: any, context?: string) {
    this.emitJson('debug', message, context);
  }

  verbose?(message: any, context?: string) {
    this.emitJson('verbose', message, context);
  }
}
