import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataStoreService, CanteenMealEntity } from '../../common/data-store/data-store.service';

@Injectable()
export class CanteenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataStore: DataStoreService,
  ) {}

  async getWeeklyMenu() {
    return {
      success: true,
      data: this.dataStore.canteenMeals,
      total: this.dataStore.canteenMeals.length,
    };
  }

  async getTodayMeal() {
    // Trả về meal hôm nay hoặc Thứ Tư làm mặc định
    const meal =
      this.dataStore.canteenMeals.find((m) => m.dayId === 't4') ||
      this.dataStore.canteenMeals[0];
    return { success: true, data: meal };
  }

  async updateMeal(id: string, dto: Partial<CanteenMealEntity>) {
    const index = this.dataStore.canteenMeals.findIndex((m) => m.id === id || m.dayId === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy thực đơn');

    this.dataStore.canteenMeals[index] = {
      ...this.dataStore.canteenMeals[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Cập nhật thực đơn thành công',
      data: this.dataStore.canteenMeals[index],
    };
  }

  async registerMeal(dto: {
    studentId?: string;
    studentName?: string;
    dayId: string;
    date?: string;
    selectedItems: any[];
  }) {
    const record = {
      id: `reg_${Date.now()}`,
      studentId: dto.studentId || 'hs_001',
      studentName: dto.studentName || 'Nguyễn Minh Quân',
      dayId: dto.dayId,
      date: dto.date || new Date().toISOString().split('T')[0],
      selectedItems: dto.selectedItems,
      isSaved: true,
      createdAt: new Date().toISOString(),
    };

    this.dataStore.canteenRegistrations.push(record);
    return { success: true, message: 'Đăng ký khẩu phần ăn thành công', data: record };
  }

  async getRegistrations(studentId?: string) {
    let list = this.dataStore.canteenRegistrations;
    if (studentId) {
      list = list.filter((r) => r.studentId === studentId);
    }
    return { success: true, data: list };
  }
}
