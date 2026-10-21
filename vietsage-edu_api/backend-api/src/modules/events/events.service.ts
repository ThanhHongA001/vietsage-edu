import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataStoreService, EventEntity } from '../../common/data-store/data-store.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataStore: DataStoreService,
  ) {}

  async findAll() {
    return { success: true, data: this.dataStore.events, total: this.dataStore.events.length };
  }

  async findById(id: string) {
    const found = this.dataStore.events.find((e) => e.id === id);
    if (!found) throw new NotFoundException('Không tìm thấy sự kiện');
    return { success: true, data: found };
  }

  async create(dto: Partial<EventEntity>) {
    const now = new Date().toISOString();
    const newEvent: EventEntity = {
      id: dto.id || `evt_${Date.now()}`,
      title: dto.title || 'Sự kiện mới',
      date: dto.date || 'Sắp diễn ra',
      location: dto.location || 'Hội trường lớn',
      tag: dto.tag || 'Hoạt động',
      description: dto.description || '',
      icon: dto.icon || 'celebration',
      imageUrl:
        dto.imageUrl ||
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      createdAt: now,
      updatedAt: now,
    };

    this.dataStore.events.push(newEvent);
    return { success: true, message: 'Tạo sự kiện thành công', data: newEvent };
  }

  async update(id: string, dto: Partial<EventEntity>) {
    const index = this.dataStore.events.findIndex((e) => e.id === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy sự kiện');

    this.dataStore.events[index] = {
      ...this.dataStore.events[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    return { success: true, message: 'Cập nhật sự kiện thành công', data: this.dataStore.events[index] };
  }

  async remove(id: string) {
    const index = this.dataStore.events.findIndex((e) => e.id === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy sự kiện');

    this.dataStore.events.splice(index, 1);
    return { success: true, message: 'Đã xóa sự kiện' };
  }
}
