import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    let dbStatus = 'disconnected';
    if (this.prisma.isConnected) {
      try {
        await this.prisma.$queryRaw`SELECT 1`;
        dbStatus = 'ok';
      } catch {
        dbStatus = 'error';
      }
    } else {
      dbStatus = 'fallback_ready';
    }

    return {
      success: true,
      status: 'ok',
      database: dbStatus,
      version: '1.0.0',
      service: 'Vietsage Education Backend API',
      timestamp: new Date().toISOString(),
    };
  }
}
