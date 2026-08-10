import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AppService } from './app.service';
import { Public } from './auth/guards';
import { DataSource } from 'typeorm';

@Controller()
@SkipThrottle()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'auramart-backend',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('ready')
  async getReadiness() {
    try {
      if (!this.dataSource.isInitialized) {
        throw new Error('Database data source is not initialized');
      }
      await this.dataSource.query('SELECT 1');
      return {
        status: 'ok',
        service: 'auramart-backend',
        readiness: 'READY',
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      throw new ServiceUnavailableException({
        status: 'degraded',
        service: 'auramart-backend',
        readiness: 'NOT_READY',
        error: 'Database connectivity probe failed',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
