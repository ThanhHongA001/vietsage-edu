import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataStoreService, DeviceEntity } from '../../common/data-store/data-store.service';

@Injectable()
export class DevicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataStore: DataStoreService,
  ) {}

  async findAll(query?: { status?: string; search?: string }) {
    if (this.prisma.isConnected) {
      try {
        const devices = await this.prisma.device.findMany({
          where: {
            ...(query?.status && query.status !== 'ALL' ? { status: query.status } : {}),
            ...(query?.search
              ? {
                  OR: [
                    { name: { contains: query.search, mode: 'insensitive' } },
                    { deviceCode: { contains: query.search, mode: 'insensitive' } },
                    { location: { contains: query.search, mode: 'insensitive' } },
                  ],
                }
              : {}),
          },
          orderBy: { deviceCode: 'asc' },
        });
        if (devices.length > 0) {
          return { success: true, data: devices, total: devices.length };
        }
      } catch (err) {
        console.warn('Prisma devices findAll error:', err);
      }
    }

    let list = [...this.dataStore.devices];
    if (query?.status && query.status !== 'ALL') {
      list = list.filter((d) => d.status === query.status);
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.deviceCode.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q),
      );
    }

    return { success: true, data: list, total: list.length };
  }

  async findById(id: string) {
    const found = this.dataStore.devices.find((d) => d.id === id || d.deviceCode === id);
    if (!found) throw new NotFoundException('Không tìm thấy thiết bị');
    return { success: true, data: found };
  }

  async create(dto: Partial<DeviceEntity>) {
    const now = new Date().toISOString();
    const newDevice: DeviceEntity = {
      id: dto.id || `dev_${Date.now()}`,
      deviceCode: dto.deviceCode || `HN212-LOC${String(this.dataStore.devices.length + 1).padStart(2, '0')}`,
      name: dto.name || 'Máy Chấm Công HN212 Mới',
      location: dto.location || 'Khu vực trường học',
      ipAddress: dto.ipAddress || '192.168.1.120',
      status: dto.status || 'ONLINE',
      isActive: dto.isActive ?? true,
      lastSeenAt: now.replace('T', ' ').substring(0, 19),
      totalScansToday: 0,
      createdAt: now,
    };

    this.dataStore.devices.push(newDevice);

    if (this.prisma.isConnected) {
      try {
        await this.prisma.device.create({
          data: {
            deviceCode: newDevice.deviceCode,
            name: newDevice.name,
            location: newDevice.location,
            ipAddress: newDevice.ipAddress,
            status: newDevice.status,
            isActive: newDevice.isActive,
            totalScansToday: 0,
          },
        });
      } catch (err) {
        console.warn('Prisma device create error:', err);
      }
    }

    return { success: true, message: 'Đăng ký thiết bị HN212 thành công', data: newDevice };
  }

  async update(id: string, dto: Partial<DeviceEntity>) {
    const index = this.dataStore.devices.findIndex((d) => d.id === id || d.deviceCode === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy thiết bị');

    const updated = {
      ...this.dataStore.devices[index],
      ...dto,
    };
    this.dataStore.devices[index] = updated;

    if (this.prisma.isConnected) {
      try {
        await this.prisma.device.update({
          where: { deviceCode: this.dataStore.devices[index].deviceCode },
          data: {
            name: dto.name,
            location: dto.location,
            ipAddress: dto.ipAddress,
            status: dto.status,
            isActive: dto.isActive,
          },
        });
      } catch (err) {
        console.warn('Prisma device update error:', err);
      }
    }

    return { success: true, message: 'Cập nhật thiết bị thành công', data: updated };
  }

  async remove(id: string) {
    const index = this.dataStore.devices.findIndex((d) => d.id === id || d.deviceCode === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy thiết bị');

    const code = this.dataStore.devices[index].deviceCode;
    this.dataStore.devices.splice(index, 1);

    if (this.prisma.isConnected) {
      try {
        await this.prisma.device.delete({ where: { deviceCode: code } });
      } catch (err) {
        console.warn('Prisma device delete error:', err);
      }
    }

    return { success: true, message: 'Đã xóa thiết bị' };
  }

  async ping(deviceCode: string) {
    const dev = this.dataStore.devices.find((d) => d.deviceCode === deviceCode);
    if (!dev) throw new NotFoundException('Không tìm thấy thiết bị với mã: ' + deviceCode);

    dev.lastSeenAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    dev.status = 'ONLINE';
    return { success: true, message: 'Heartbeat đã ghi nhận', device: dev };
  }
}
