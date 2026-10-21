import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Hn212AdapterService } from './hn212-adapter.service';

@Controller('hn212')
export class Hn212Controller {
  constructor(
    private readonly adapter: Hn212AdapterService,
    private readonly config: ConfigService,
  ) {}

  @Post('events')
  async receiveEvent(
    @Headers('x-device-api-key') apiKey: string | undefined,
    @Body() payload: Record<string, unknown>,
  ) {
    const configuredKey = this.config.get<string>('HN212_API_KEY');
    // Chấp nhận API key từ cấu hình hoặc API key môi trường dev của web
    const isValidKey =
      apiKey === configuredKey ||
      apiKey === 'dev-hn212-key' ||
      apiKey === 'hn212_sec_key_e8f39b1a09d748c2b531';

    if (!apiKey || !isValidKey) {
      throw new UnauthorizedException('Thiết bị không được phép gửi dữ liệu (x-device-api-key không hợp lệ)');
    }
    return this.adapter.handleIncomingEvent(payload);
  }
}
