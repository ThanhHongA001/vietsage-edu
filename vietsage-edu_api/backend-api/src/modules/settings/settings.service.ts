import { Injectable } from '@nestjs/common';
import { DataStoreService } from '../../common/data-store/data-store.service';

@Injectable()
export class SettingsService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getSettings() {
    return { success: true, data: this.dataStore.settings };
  }

  async updateSettings(dto: Record<string, any>) {
    this.dataStore.settings = { ...this.dataStore.settings, ...dto };
    return { success: true, message: 'Cập nhật cấu hình thành công', data: this.dataStore.settings };
  }
}
