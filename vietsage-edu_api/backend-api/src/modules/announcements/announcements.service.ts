import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataStoreService, AnnouncementEntity } from '../../common/data-store/data-store.service';

@Injectable()
export class AnnouncementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataStore: DataStoreService,
  ) {}

  async findAll(query?: { category?: string; priority?: string }) {
    let list = [...this.dataStore.announcements];
    if (query?.category && query.category !== 'ALL') {
      list = list.filter((a) => a.category === query.category);
    }
    if (query?.priority && query.priority !== 'ALL') {
      list = list.filter((a) => a.priority === query.priority);
    }
    return { success: true, data: list, total: list.length };
  }

  async findById(id: string) {
    const found = this.dataStore.announcements.find((a) => a.id === id);
    if (!found) throw new NotFoundException('Không tìm thấy thông báo');
    return { success: true, data: found };
  }

  async create(dto: Partial<AnnouncementEntity>) {
    const now = new Date().toISOString();
    const newAnnouncement: AnnouncementEntity = {
      id: dto.id || `ann_${Date.now()}`,
      title: dto.title || 'Thông báo mới',
      content: dto.content || '',
      author: dto.author || 'Ban Giám Hiệu',
      category: dto.category || 'TOÀN TRƯỜNG',
      targetAudience: dto.targetAudience || 'Toàn trường',
      priority: dto.priority || 'NORMAL',
      imageUrl: dto.imageUrl,
      isNew: true,
      createdAt: now.replace('T', ' ').substring(0, 16),
      updatedAt: now,
    };

    this.dataStore.announcements.unshift(newAnnouncement);
    return { success: true, message: 'Đăng thông báo thành công', data: newAnnouncement };
  }

  async update(id: string, dto: Partial<AnnouncementEntity>) {
    const index = this.dataStore.announcements.findIndex((a) => a.id === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy thông báo');

    this.dataStore.announcements[index] = {
      ...this.dataStore.announcements[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    return { success: true, message: 'Cập nhật thông báo thành công', data: this.dataStore.announcements[index] };
  }

  async remove(id: string) {
    const index = this.dataStore.announcements.findIndex((a) => a.id === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy thông báo');

    this.dataStore.announcements.splice(index, 1);
    return { success: true, message: 'Đã xóa thông báo' };
  }

  async markAsRead(id: string) {
    const item = this.dataStore.announcements.find((a) => a.id === id);
    if (item) {
      item.isNew = false;
    }
    return { success: true, message: 'Đã đánh dấu đã đọc' };
  }
}
