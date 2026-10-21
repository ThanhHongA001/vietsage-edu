import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppLogger } from '../../common/logger/app-logger.service';
import { DataStoreService } from '../../common/data-store/data-store.service';

@Injectable()
export class Hn212AdapterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
    private readonly dataStore: DataStoreService,
  ) {}

  async handleIncomingEvent(payload: Record<string, unknown>) {
    const eventId = this.readString(payload, ['eventId', 'event_id', 'recordId', 'id']);
    const deviceCode = this.readString(payload, ['deviceCode', 'device_code', 'serialNumber']);
    const occurredAtValue = this.readString(payload, ['occurredAt', 'timestamp', 'time', 'datetime']);
    const studentCode = this.readString(payload, ['userCode', 'studentCode', 'userId']);

    if (!eventId || !occurredAtValue) {
      throw new BadRequestException('Thiếu eventId hoặc thời gian sự kiện');
    }

    const occurredAt = new Date(occurredAtValue);
    if (Number.isNaN(occurredAt.getTime())) {
      throw new BadRequestException('Thời gian sự kiện không hợp lệ');
    }

    const method = this.mapMethod(payload);
    const direction = this.mapDirection(payload);

    // Cập nhật thông tin thiết bị trong DataStore
    if (deviceCode) {
      const dev = this.dataStore.devices.find((d) => d.deviceCode === deviceCode);
      if (dev) {
        dev.lastSeenAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
        dev.totalScansToday += 1;
      }
    }

    // Nếu kết nối DB PostgreSQL khả dụng
    if (this.prisma.isConnected) {
      try {
        let deviceId: string | undefined;
        if (deviceCode) {
          const device = await this.prisma.device.findUnique({ where: { deviceCode } });
          if (device && device.isActive) {
            deviceId = device.id;
            await this.prisma.device.update({
              where: { id: device.id },
              data: {
                lastSeenAt: new Date(),
                totalScansToday: { increment: 1 },
              },
            });
          }
        }

        const existing = await this.prisma.attendance.findUnique({ where: { eventId } });
        if (existing) {
          this.logger.logHn212Event({
            eventId: existing.eventId,
            deviceCode,
            method,
            direction,
            duplicate: true,
            raw: payload,
          });
          return { success: true, duplicate: true, eventId: existing.eventId };
        }

        const student = studentCode
          ? await this.prisma.student.findFirst({
              where: { OR: [{ code: studentCode }, { id: studentCode }] },
            })
          : null;

        const record = await this.prisma.attendance.create({
          data: {
            eventId,
            occurredAt,
            deviceId,
            studentId: student?.id,
            studentCode: student?.code || studentCode,
            studentName: student?.fullName,
            className: student?.className,
            method,
            direction,
            rawPayload: JSON.parse(JSON.stringify(payload)),
          },
        });

        this.logger.logHn212Event({
          eventId: record.eventId,
          deviceCode,
          method,
          direction,
          duplicate: false,
          raw: payload,
        });

        return { success: true, duplicate: false, data: { id: record.id, eventId: record.eventId } };
      } catch (err: any) {
        this.logger.error(`Lỗi ghi database HN212 event: ${err?.message}`, err?.stack, 'Hn212Adapter');
      }
    }

    // Fallback: Xử lý qua DataStore in-memory
    const existingMemory = this.dataStore.attendance.find((a) => a.eventId === eventId);
    if (existingMemory) {
      return { success: true, duplicate: true, eventId: existingMemory.eventId };
    }

    const matchedStudent = studentCode
      ? this.dataStore.students.find((s) => s.code === studentCode || s.id === studentCode)
      : null;

    const matchedDevice = deviceCode
      ? this.dataStore.devices.find((d) => d.deviceCode === deviceCode)
      : null;

    const newAttendance = {
      id: `att_${Date.now()}`,
      eventId,
      studentId: matchedStudent?.id || studentCode,
      studentCode: matchedStudent?.code || studentCode,
      studentName: matchedStudent?.fullName || 'Học sinh',
      className: matchedStudent?.className || '10A1',
      deviceId: matchedDevice?.id,
      deviceName: matchedDevice?.name || 'Máy Chấm Công HN212',
      date: occurredAt.toISOString().split('T')[0],
      occurredAt: occurredAt.toISOString(),
      checkInTime: occurredAt.toTimeString().split(' ')[0],
      status: 'PRESENT',
      method,
      direction,
      rawPayload: payload,
      createdAt: new Date().toISOString(),
    };

    this.dataStore.attendance.unshift(newAttendance);

    return {
      success: true,
      duplicate: false,
      data: { id: newAttendance.id, eventId: newAttendance.eventId },
    };
  }

  private readString(payload: Record<string, unknown>, keys: string[]): string | undefined {
    for (const key of keys) {
      if (typeof payload[key] === 'string' && (payload[key] as string).trim()) {
        return (payload[key] as string).trim();
      }
    }
    return undefined;
  }

  private mapMethod(payload: Record<string, unknown>): 'FACE' | 'FINGERPRINT' | 'CARD' | 'MANUAL' | 'UNKNOWN' {
    const value = String(payload.method ?? payload.verifyType ?? '').toLowerCase();
    if (value.includes('face')) return 'FACE';
    if (value.includes('finger') || value.includes('fp')) return 'FINGERPRINT';
    if (value.includes('card')) return 'CARD';
    if (value.includes('manual')) return 'MANUAL';
    return 'UNKNOWN';
  }

  private mapDirection(payload: Record<string, unknown>): 'CHECK_IN' | 'CHECK_OUT' | 'UNKNOWN' {
    const value = String(payload.direction ?? payload.type ?? '').toLowerCase();
    if (['in', 'check_in', 'checkin', 'entry'].includes(value)) return 'CHECK_IN';
    if (['out', 'check_out', 'checkout', 'exit'].includes(value)) return 'CHECK_OUT';
    return 'UNKNOWN';
  }
}
