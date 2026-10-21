import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataStoreService, ScheduleEntity } from '../../common/data-store/data-store.service';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataStore: DataStoreService,
  ) {}

  async findAll(query?: { className?: string; teacherName?: string; dayOfWeek?: number }) {
    let list = [...this.dataStore.schedules];
    if (query?.className && query.className !== 'ALL') {
      list = list.filter((s) => s.className === query.className || s.className === 'Toàn trường');
    }
    if (query?.teacherName && query.teacherName !== 'ALL') {
      list = list.filter((s) => s.teacherName.includes(query.teacherName!));
    }
    if (query?.dayOfWeek) {
      list = list.filter((s) => s.dayOfWeek === Number(query.dayOfWeek));
    }

    list.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.period - b.period);
    return { success: true, data: list, total: list.length };
  }

  async create(dto: Partial<ScheduleEntity>) {
    const newSchedule: ScheduleEntity = {
      id: dto.id || `sch_${Date.now()}`,
      dayOfWeek: dto.dayOfWeek || 2,
      period: dto.period || 1,
      timeRange: dto.timeRange || '07:15 - 08:00',
      subject: dto.subject || 'Môn học mới',
      className: dto.className || '10A1',
      room: dto.room || 'Phòng 301',
      teacherName: dto.teacherName || 'ThS. Nguyễn Văn Hùng',
      createdAt: new Date().toISOString(),
    };

    this.dataStore.schedules.push(newSchedule);
    return { success: true, message: 'Thêm tiết học thành công', data: newSchedule };
  }

  async update(id: string, dto: Partial<ScheduleEntity>) {
    const index = this.dataStore.schedules.findIndex((s) => s.id === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy tiết học');

    this.dataStore.schedules[index] = { ...this.dataStore.schedules[index], ...dto };
    return { success: true, message: 'Cập nhật thời khóa biểu thành công', data: this.dataStore.schedules[index] };
  }

  async remove(id: string) {
    const index = this.dataStore.schedules.findIndex((s) => s.id === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy tiết học');

    this.dataStore.schedules.splice(index, 1);
    return { success: true, message: 'Đã xóa tiết học' };
  }
}
