import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataStoreService, UniformItemEntity, UniformOrderEntity } from '../../common/data-store/data-store.service';

@Injectable()
export class UniformsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataStore: DataStoreService,
  ) {}

  async findAll(query?: { category?: string; gradeGroup?: string }) {
    let list = [...this.dataStore.uniformItems];
    if (query?.category && query.category !== 'ALL') {
      list = list.filter((u) => u.category === query.category);
    }
    if (query?.gradeGroup && query.gradeGroup !== 'ALL') {
      list = list.filter((u) => u.gradeGroup === query.gradeGroup);
    }
    return { success: true, data: list, total: list.length };
  }

  async findById(id: string) {
    const found = this.dataStore.uniformItems.find((u) => u.id === id || u.code === id);
    if (!found) throw new NotFoundException('Không tìm thấy mặt hàng đồng phục');
    return { success: true, data: found };
  }

  async createItem(dto: Partial<UniformItemEntity>) {
    const now = new Date().toISOString();
    const newItem: UniformItemEntity = {
      id: dto.id || `uni_${Date.now()}`,
      code: dto.code || `UF-${Date.now()}`,
      name: dto.name || 'Đồng phục mới',
      category: dto.category || 'Áo sơ mi',
      gradeGroup: dto.gradeGroup || 'THPT',
      price: dto.price || 150000,
      inStock: dto.inStock || 100,
      sizes: dto.sizes || ['S', 'M', 'L', 'XL'],
      imageUrl:
        dto.imageUrl ||
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=300&auto=format&fit=crop&q=80',
      description: dto.description || '',
      createdAt: now,
      updatedAt: now,
    };

    this.dataStore.uniformItems.push(newItem);
    return { success: true, message: 'Thêm sản phẩm đồng phục thành công', data: newItem };
  }

  async updateItem(id: string, dto: Partial<UniformItemEntity>) {
    const index = this.dataStore.uniformItems.findIndex((u) => u.id === id || u.code === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy sản phẩm');

    this.dataStore.uniformItems[index] = {
      ...this.dataStore.uniformItems[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    return { success: true, message: 'Cập nhật sản phẩm thành công', data: this.dataStore.uniformItems[index] };
  }

  async removeItem(id: string) {
    const index = this.dataStore.uniformItems.findIndex((u) => u.id === id || u.code === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy sản phẩm');

    this.dataStore.uniformItems.splice(index, 1);
    return { success: true, message: 'Đã xóa sản phẩm đồng phục' };
  }

  // Đặt hàng đồng phục
  async createOrder(dto: {
    items: any[];
    totalAmount: number;
    studentName?: string;
    studentClass?: string;
  }) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    const orderCode = `ORD-${dateStr}-${rand}`;

    const newOrder: UniformOrderEntity = {
      id: `ord_${Date.now()}`,
      orderCode,
      orderDate: now.toISOString(),
      status: 'Chờ nhận tại trường',
      items: dto.items,
      totalAmount: dto.totalAmount,
      studentName: dto.studentName || 'Nguyễn Minh Quân',
      studentClass: dto.studentClass || '10A1',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    // Giảm số lượng tồn kho tương ứng
    for (const it of dto.items) {
      const match = this.dataStore.uniformItems.find((u) => u.id === it.uniformId || u.name === it.name);
      if (match && match.inStock >= it.quantity) {
        match.inStock -= it.quantity;
      }
    }

    this.dataStore.uniformOrders.unshift(newOrder);
    return { success: true, message: 'Đặt đồng phục thành công!', data: newOrder };
  }

  async findAllOrders(query?: { studentName?: string; status?: string }) {
    let list = [...this.dataStore.uniformOrders];
    if (query?.studentName) {
      list = list.filter((o) => o.studentName.toLowerCase().includes(query.studentName!.toLowerCase()));
    }
    if (query?.status) {
      list = list.filter((o) => o.status === query.status);
    }
    return { success: true, data: list, total: list.length };
  }

  async updateOrderStatus(orderCode: string, status: string) {
    const order = this.dataStore.uniformOrders.find((o) => o.orderCode === orderCode || o.id === orderCode);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    order.status = status;
    order.updatedAt = new Date().toISOString();
    return { success: true, message: `Đã cập nhật trạng thái đơn sang: ${status}`, data: order };
  }
}
