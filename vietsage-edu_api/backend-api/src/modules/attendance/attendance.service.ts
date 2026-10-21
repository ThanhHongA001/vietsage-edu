import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataStoreService, AttendanceEntity } from '../../common/data-store/data-store.service';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataStore: DataStoreService,
  ) {}

  // Lấy danh sách chấm công toàn hệ thống (dành cho Admin / Teacher)
  async list(query: {
    userId?: string;
    studentId?: string;
    className?: string;
    from?: string;
    to?: string;
    limit?: number;
  }) {
    const limit = query.limit ? Math.min(Number(query.limit), 200) : 100;

    if (this.prisma.isConnected) {
      try {
        const records = await this.prisma.attendance.findMany({
          where: {
            ...(query.userId ? { userId: query.userId } : {}),
            ...(query.studentId ? { studentId: query.studentId } : {}),
            ...(query.className ? { className: query.className } : {}),
            ...(query.from || query.to
              ? {
                  occurredAt: {
                    ...(query.from ? { gte: new Date(query.from) } : {}),
                    ...(query.to ? { lte: new Date(query.to) } : {}),
                  },
                }
              : {}),
          },
          include: {
            user: { select: { id: true, email: true, fullName: true, role: true } },
            student: { select: { id: true, code: true, fullName: true, className: true } },
            device: { select: { id: true, deviceCode: true, name: true, location: true } },
          },
          orderBy: { occurredAt: 'desc' },
          take: limit,
        });

        // Chuẩn hóa dữ liệu trả về tương thích với cả Web và App
        const normalized = records.map((r) => ({
          id: r.id,
          eventId: r.eventId,
          studentId: r.studentId || r.userId || '',
          studentCode: r.studentCode || r.student?.code || '',
          studentName: r.studentName || r.student?.fullName || r.user?.fullName || '',
          className: r.className || r.student?.className || '10A1',
          date: r.occurredAt.toISOString().split('T')[0],
          status: r.status || 'PRESENT',
          checkInTime: r.checkInTime || r.occurredAt.toTimeString().split(' ')[0],
          checkOutTime: r.checkOutTime,
          method: r.method,
          direction: r.direction,
          deviceId: r.deviceId,
          deviceName: r.device?.name || 'Máy Chấm Công HN212',
          note: r.note,
          occurredAt: r.occurredAt.toISOString(),
        }));

        return { success: true, data: normalized, limit };
      } catch (err) {
        console.warn('Prisma attendance error, fallback to dataStore:', err);
      }
    }

    // Fallback: DataStore Service
    let result = [...this.dataStore.attendance];

    if (query.studentId) {
      result = result.filter((a) => a.studentId === query.studentId);
    }
    if (query.className && query.className !== 'ALL') {
      result = result.filter((a) => a.className === query.className);
    }
    if (query.from) {
      result = result.filter((a) => a.date >= query.from!);
    }
    if (query.to) {
      result = result.filter((a) => a.date <= query.to!);
    }

    return {
      success: true,
      data: result.slice(0, limit),
      limit,
    };
  }

  // Lịch sử chuyên cần của học sinh / nhân viên
  async listMyAttendance(userId: string, query: { from?: string; to?: string }) {
    return this.list({ userId, ...query });
  }

  // Ghi nhận điểm danh từng cá nhân
  async recordCheckIn(dto: {
    studentId?: string;
    studentCode?: string;
    studentName?: string;
    className?: string;
    status?: string;
    method?: string;
    deviceId?: string;
    deviceName?: string;
    note?: string;
  }) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];

    const newRecord: AttendanceEntity = {
      id: `att_${Date.now()}`,
      eventId: `REC_${Date.now()}`,
      studentId: dto.studentId || 'hs_001',
      studentCode: dto.studentCode || 'VS-2026-001',
      studentName: dto.studentName || 'Nguyễn Minh Quân',
      className: dto.className || '10A1',
      date: dateStr,
      occurredAt: now.toISOString(),
      checkInTime: timeStr,
      status: dto.status || 'PRESENT',
      method: dto.method || 'MANUAL',
      direction: 'CHECK_IN',
      deviceId: dto.deviceId,
      deviceName: dto.deviceName || 'Điểm danh thủ công',
      note: dto.note,
      createdAt: now.toISOString(),
    };

    this.dataStore.attendance.unshift(newRecord);

    if (this.prisma.isConnected) {
      try {
        await this.prisma.attendance.create({
          data: {
            eventId: newRecord.eventId,
            studentId: dto.studentId,
            studentCode: newRecord.studentCode,
            studentName: newRecord.studentName,
            className: newRecord.className,
            occurredAt: now,
            checkInTime: timeStr,
            status: newRecord.status,
            method: (dto.method as any) || 'MANUAL',
            direction: 'CHECK_IN',
            note: dto.note,
          },
        });
      } catch (err) {
        console.warn('Could not save attendance to Postgres:', err);
      }
    }

    return { success: true, message: 'Ghi nhận điểm danh thành công', data: newRecord };
  }

  // Điểm danh cả lớp theo ngày (Class Attendance)
  async recordClassAttendance(body: {
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
  }) {
    const savedRecords: AttendanceEntity[] = [];

    for (const r of body.records) {
      const record: AttendanceEntity = {
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        eventId: `CLASS_${body.className}_${body.date}_${r.studentId}`,
        studentId: r.studentId,
        studentCode: r.studentCode,
        studentName: r.studentName,
        className: body.className,
        date: body.date,
        occurredAt: new Date(`${body.date}T${r.checkInTime || '07:15:00'}.000Z`).toISOString(),
        checkInTime: r.checkInTime || '07:15:00',
        status: r.status,
        method: 'MANUAL',
        direction: 'CHECK_IN',
        note: r.note,
        createdAt: new Date().toISOString(),
      };

      // Xóa bản ghi cũ cùng ngày nếu có
      this.dataStore.attendance = this.dataStore.attendance.filter(
        (a) => !(a.studentId === r.studentId && a.date === body.date),
      );
      this.dataStore.attendance.unshift(record);
      savedRecords.push(record);
    }

    return {
      success: true,
      message: `Đã lưu điểm danh cho lớp ${body.className} ngày ${body.date} (${body.records.length} học sinh)`,
      data: savedRecords,
    };
  }

  // Thống kê chuyên cần
  async getStats(className?: string, month?: string) {
    let list = this.dataStore.attendance;
    if (className && className !== 'ALL') {
      list = list.filter((a) => a.className === className);
    }
    if (month) {
      list = list.filter((a) => a.date.startsWith(month));
    }

    const total = list.length;
    const present = list.filter((a) => a.status === 'PRESENT').length;
    const late = list.filter((a) => a.status === 'LATE').length;
    const excused = list.filter((a) => a.status === 'EXCUSED').length;
    const unexcused = list.filter((a) => a.status === 'UNEXCUSED').length;

    return {
      success: true,
      data: {
        total,
        present,
        late,
        excused,
        unexcused,
        attendanceRate: total > 0 ? Number(((present / total) * 100).toFixed(1)) : 100,
      },
    };
  }
}
