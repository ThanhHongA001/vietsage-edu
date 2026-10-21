import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  // Lịch sử chấm công của chính người dùng đăng nhập
  @Get('my')
  getMyAttendance(
    @Query('userId') userId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.listMyAttendance(userId || 'hs_001', { from, to });
  }

  // Thống kê chuyên cần
  @Get('stats')
  getStats(
    @Query('className') className?: string,
    @Query('month') month?: string,
  ) {
    return this.service.getStats(className, month);
  }

  // Danh sách chấm công toàn hệ thống (Hỗ trợ phân trang và bộ lọc lớp/học sinh/ngày)
  @Get()
  list(
    @Query('userId') userId?: string,
    @Query('studentId') studentId?: string,
    @Query('className') className?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: number,
  ) {
    return this.service.list({ userId, studentId, className, from, to, limit });
  }

  // Điểm danh cá nhân / chấm công
  @Post('check-in')
  checkIn(
    @Body()
    dto: {
      studentId?: string;
      studentCode?: string;
      studentName?: string;
      className?: string;
      status?: string;
      method?: string;
      deviceId?: string;
      deviceName?: string;
      note?: string;
    },
  ) {
    return this.service.recordCheckIn(dto);
  }

  // Điểm danh cả lớp theo ngày
  @Post('class')
  classAttendance(
    @Body()
    body: {
      className: string;
      date: string;
      records: Array<{
        studentId: string;
        studentCode: string;
        studentName: string;
        status: 'PRESENT' | 'LATE' | 'EXCUSED' | 'UNEXCUSED';
        checkInTime?: string;
        note?: string;
      }>;
    },
  ) {
    return this.service.recordClassAttendance(body);
  }
}
