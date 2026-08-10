import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from '../../auth/guards';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getHealth() {
    const isDbConnected = this.dataSource.isInitialized;
    return {
      status: isDbConnected ? 'UP' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      service: 'AuraMart Commerce OS Backend',
      version: '1.0.0',
      checks: {
        database: isDbConnected ? 'UP' : 'DOWN',
        memory: process.memoryUsage(),
        uptimeSeconds: Math.floor(process.uptime()),
      },
    };
  }

  @Public()
  @Get('readiness')
  @HttpCode(HttpStatus.OK)
  async getReadiness() {
    const isDbReady = this.dataSource.isInitialized;
    if (!isDbReady) {
      return { status: 'NOT_READY', database: 'DISCONNECTED' };
    }
    return { status: 'READY', database: 'CONNECTED', queue: 'READY' };
  }

  @Public()
  @Get('liveness')
  @HttpCode(HttpStatus.OK)
  async getLiveness() {
    return { status: 'ALIVE', timestamp: new Date().toISOString() };
  }
}
