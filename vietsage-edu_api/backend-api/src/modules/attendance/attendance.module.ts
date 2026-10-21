import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, JwtAuthGuard, RolesGuard],
  exports: [AttendanceService],
})
export class AttendanceModule {}
