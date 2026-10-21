import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './common/logger/logger.module';
import { DataStoreModule } from './common/data-store/data-store.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { Hn212Module } from './modules/hn212/hn212.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { HealthModule } from './modules/health/health.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { StudentsModule } from './modules/students/students.module';
import { DevicesModule } from './modules/devices/devices.module';
import { LeaveRequestsModule } from './modules/leave-requests/leave-requests.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { GradesModule } from './modules/grades/grades.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { CanteenModule } from './modules/canteen/canteen.module';
import { UniformsModule } from './modules/uniforms/uniforms.module';
import { EventsModule } from './modules/events/events.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    PrismaModule,
    DataStoreModule,
    AuthModule,
    UsersModule,
    Hn212Module,
    AttendanceModule,
    HealthModule,
    TeachersModule,
    StudentsModule,
    DevicesModule,
    LeaveRequestsModule,
    SchedulesModule,
    GradesModule,
    HomeworkModule,
    CanteenModule,
    UniformsModule,
    EventsModule,
    AnnouncementsModule,
    DashboardModule,
    SettingsModule,
  ],
})
export class AppModule {}
