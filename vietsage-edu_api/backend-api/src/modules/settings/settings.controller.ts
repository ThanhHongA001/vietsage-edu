import { Body, Controller, Get, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  getSettings() {
    return this.service.getSettings();
  }

  @Patch()
  updateSettings(@Body() dto: Record<string, any>) {
    return this.service.updateSettings(dto);
  }
}
