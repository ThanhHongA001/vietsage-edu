import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataStoreService, LeaveRequestEntity } from '../../common/data-store/data-store.service';

@Injectable()
export class LeaveRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataStore: DataStoreService,
  ) {}

  async findAll(query?: { className?: string; status?: string; studentId?: string }) {
    let list = [...this.dataStore.leaveRequests];
    if (query?.className && query.className !== 'ALL') {
      list = list.filter((l) => l.className === query.className);
    }
    if (query?.status && query.status !== 'ALL') {
      list = list.filter((l) => l.status === query.status);
    }
    if (query?.studentId) {
      list = list.filter((l) => l.studentId === query.studentId);
    }
    return { success: true, data: list, total: list.length };
  }

  async findById(id: string) {
    const found = this.dataStore.leaveRequests.find((l) => l.id === id);
    if (!found) throw new NotFoundException('Không tìm thấy đơn xin nghỉ phép');
    return { success: true, data: found };
  }

  async create(dto: {
    studentId?: string;
    studentName?: string;
    className?: string;
    startDate: string;
    endDate: string;
    reason: string;
    phone: string;
  }) {
    const now = new Date().toISOString();
    const newRequest: LeaveRequestEntity = {
      id: `lr_${Date.now()}`,
      studentId: dto.studentId || 'hs_001',
      studentName: dto.studentName || 'Nguyễn Minh Quân',
      className: dto.className || '10A1',
      startDate: dto.startDate,
      endDate: dto.endDate,
      reason: dto.reason,
      phone: dto.phone,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    this.dataStore.leaveRequests.unshift(newRequest);

    if (this.prisma.isConnected) {
      try {
        await this.prisma.leaveRequest.create({
          data: {
            studentId: newRequest.studentId,
            studentName: newRequest.studentName,
            className: newRequest.className,
            startDate: new Date(newRequest.startDate),
            endDate: new Date(newRequest.endDate),
            reason: newRequest.reason,
            phone: newRequest.phone,
            status: newRequest.status,
          },
        });
      } catch (err) {
        console.warn('Prisma leaveRequest create error:', err);
      }
    }

    return { success: true, message: 'Đơn xin nghỉ phép đã được gửi tới Giáo viên chủ nhiệm', data: newRequest };
  }

  async updateStatus(id: string, status: 'APPROVED' | 'REJECTED', reviewNote?: string) {
    const index = this.dataStore.leaveRequests.findIndex((l) => l.id === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy đơn xin nghỉ phép');

    this.dataStore.leaveRequests[index].status = status;
    this.dataStore.leaveRequests[index].reviewNote = reviewNote;
    this.dataStore.leaveRequests[index].updatedAt = new Date().toISOString();

    return {
      success: true,
      message: status === 'APPROVED' ? 'Đã phê duyệt đơn xin nghỉ phép' : 'Đã từ chối đơn xin nghỉ phép',
      data: this.dataStore.leaveRequests[index],
    };
  }
}
