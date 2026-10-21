import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  public isConnected = false;

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.isConnected = true;
      console.log('✅ Kết nối PostgreSQL qua Prisma thành công.');
    } catch (err: any) {
      this.isConnected = false;
      console.warn('⚠️ Chưa kết nối được PostgreSQL (' + (err?.message || 'Database offline') + '). Hệ thống kích hoạt DataStore Resilience để API chạy liên tục và sẵn sàng phục vụ Web/App.');
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.isConnected) {
      await this.$disconnect();
    }
  }
}
