import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto, @Headers('x-client-platform') platformHeader?: string) {
    return this.authService.login(dto, platformHeader);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refreshToken);
  }

  // Quên mật khẩu & Gửi mã OTP (Phục vụ Flutter App)
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() body: { contact?: string; email?: string; phone?: string }) {
    const contact = body.contact || body.phone || body.email || '';
    return this.authService.forgotPassword(contact);
  }

  // Xác thực mã OTP 6 số
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() body: { otp: string; contact?: string }) {
    return this.authService.verifyOtp(body.otp, body.contact);
  }

  // Đặt lại mật khẩu mới
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() body: { newPassword: string; confirmPassword?: string; contact?: string }) {
    return this.authService.resetPassword(body.newPassword, body.contact);
  }
}
