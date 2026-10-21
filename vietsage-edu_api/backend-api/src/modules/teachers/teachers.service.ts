import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataStoreService, TeacherEntity } from '../../common/data-store/data-store.service';

@Injectable()
export class TeachersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataStore: DataStoreService,
  ) {}

  async findAll(query?: { department?: string; status?: string; search?: string; schoolLevel?: string }) {
    if (this.prisma.isConnected) {
      try {
        const teachers = await this.prisma.teacher.findMany({
          where: {
            ...(query?.department && query.department !== 'ALL' ? { department: query.department } : {}),
            ...(query?.status && query.status !== 'ALL' ? { status: query.status } : {}),
            ...(query?.search
              ? {
                  OR: [
                    { fullName: { contains: query.search, mode: 'insensitive' } },
                    { code: { contains: query.search, mode: 'insensitive' } },
                    { email: { contains: query.search, mode: 'insensitive' } },
                  ],
                }
              : {}),
          },
          orderBy: { code: 'asc' },
        });
        if (teachers.length > 0) {
          return { success: true, data: teachers, total: teachers.length };
        }
      } catch (err) {
        console.warn('Prisma teachers findAll error, fallback to dataStore:', err);
      }
    }

    let list = [...this.dataStore.teachers];
    if (query?.schoolLevel && query.schoolLevel !== 'ALL') {
      list = list.filter((t) => t.schoolLevel === query.schoolLevel);
    }
    if (query?.department && query.department !== 'ALL') {
      list = list.filter((t) => t.department === query.department);
    }
    if (query?.status && query.status !== 'ALL') {
      list = list.filter((t) => t.status === query.status);
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.fullName.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q),
      );
    }

    return { success: true, data: list, total: list.length };
  }

  async findById(id: string) {
    if (this.prisma.isConnected) {
      try {
        const teacher = await this.prisma.teacher.findUnique({ where: { id } });
        if (teacher) return { success: true, data: teacher };
      } catch (err) {
        console.warn('Prisma teacher findById error:', err);
      }
    }

    const found = this.dataStore.teachers.find((t) => t.id === id);
    if (!found) throw new NotFoundException('Không tìm thấy giáo viên với ID: ' + id);
    return { success: true, data: found };
  }

  async create(dto: Partial<TeacherEntity>) {
    const now = new Date().toISOString();
    const newTeacher: TeacherEntity = {
      id: dto.id || `tc_${Date.now()}`,
      code: dto.code || `GV-${Math.floor(100 + Math.random() * 900)}`,
      fullName: dto.fullName || 'Giáo viên mới',
      email: dto.email || `gv${Date.now()}@vietsage.edu.vn`,
      phone: dto.phone || '0900 000 000',
      department: dto.department || 'Toán - Tin học',
      homeroomClass: dto.homeroomClass,
      subjects: dto.subjects || ['Toán'],
      status: dto.status || 'ACTIVE',
      avatar:
        dto.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joinDate: dto.joinDate || now.split('T')[0],
      createdAt: now,
      updatedAt: now,
    };

    this.dataStore.teachers.push(newTeacher);

    if (this.prisma.isConnected) {
      try {
        await this.prisma.teacher.create({
          data: {
            code: newTeacher.code,
            fullName: newTeacher.fullName,
            email: newTeacher.email,
            phone: newTeacher.phone,
            department: newTeacher.department,
            homeroomClass: newTeacher.homeroomClass,
            subjects: newTeacher.subjects,
            status: newTeacher.status,
            avatar: newTeacher.avatar,
            joinDate: newTeacher.joinDate,
          },
        });
      } catch (err) {
        console.warn('Prisma teacher create error:', err);
      }
    }

    return { success: true, message: 'Thêm giáo viên thành công', data: newTeacher };
  }

  async update(id: string, dto: Partial<TeacherEntity>) {
    const index = this.dataStore.teachers.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy giáo viên');

    const updated = {
      ...this.dataStore.teachers[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    this.dataStore.teachers[index] = updated;

    if (this.prisma.isConnected) {
      try {
        await this.prisma.teacher.update({
          where: { id },
          data: {
            fullName: dto.fullName,
            phone: dto.phone,
            department: dto.department,
            homeroomClass: dto.homeroomClass,
            subjects: dto.subjects,
            status: dto.status,
            avatar: dto.avatar,
          },
        });
      } catch (err) {
        console.warn('Prisma teacher update error:', err);
      }
    }

    return { success: true, message: 'Cập nhật thông tin giáo viên thành công', data: updated };
  }

  async remove(id: string) {
    const index = this.dataStore.teachers.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy giáo viên');

    this.dataStore.teachers.splice(index, 1);

    if (this.prisma.isConnected) {
      try {
        await this.prisma.teacher.delete({ where: { id } });
      } catch (err) {
        console.warn('Prisma teacher delete error:', err);
      }
    }

    return { success: true, message: 'Đã xóa hồ sơ giáo viên' };
  }
}
