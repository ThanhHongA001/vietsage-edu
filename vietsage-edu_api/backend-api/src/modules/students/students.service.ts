import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataStoreService, StudentEntity } from '../../common/data-store/data-store.service';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataStore: DataStoreService,
  ) {}

  async findAll(query?: { className?: string; status?: string; search?: string; schoolLevel?: string }) {
    if (this.prisma.isConnected) {
      try {
        const students = await this.prisma.student.findMany({
          where: {
            ...(query?.className && query.className !== 'ALL' ? { className: query.className } : {}),
            ...(query?.status && query.status !== 'ALL' ? { status: query.status } : {}),
            ...(query?.search
              ? {
                  OR: [
                    { fullName: { contains: query.search, mode: 'insensitive' } },
                    { code: { contains: query.search, mode: 'insensitive' } },
                    { parentPhone: { contains: query.search, mode: 'insensitive' } },
                  ],
                }
              : {}),
          },
          orderBy: { code: 'asc' },
        });
        if (students.length > 0) {
          return { success: true, data: students, total: students.length };
        }
      } catch (err) {
        console.warn('Prisma students findAll error, fallback to dataStore:', err);
      }
    }

    let list = [...this.dataStore.students];
    if (query?.schoolLevel && query.schoolLevel !== 'ALL') {
      list = list.filter((s) => s.schoolLevel === query.schoolLevel);
    }
    if (query?.className && query.className !== 'ALL') {
      list = list.filter((s) => s.className === query.className);
    }
    if (query?.status && query.status !== 'ALL') {
      list = list.filter((s) => s.status === query.status);
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.parentPhone.toLowerCase().includes(q),
      );
    }

    return { success: true, data: list, total: list.length };
  }

  async getClasses() {
    const classSet = new Set<string>();
    this.dataStore.students.forEach((s) => classSet.add(s.className));
    const classes = Array.from(classSet).sort();
    return { success: true, data: classes };
  }

  async findById(id: string) {
    if (this.prisma.isConnected) {
      try {
        const student = await this.prisma.student.findUnique({ where: { id } });
        if (student) return { success: true, data: student };
      } catch (err) {
        console.warn('Prisma student findById error:', err);
      }
    }

    const found = this.dataStore.students.find((s) => s.id === id || s.code === id);
    if (!found) throw new NotFoundException('Không tìm thấy học sinh với mã/ID: ' + id);
    return { success: true, data: found };
  }

  async create(dto: Partial<StudentEntity>) {
    const now = new Date().toISOString();
    const newStudent: StudentEntity = {
      id: dto.id || `hs_${Date.now()}`,
      code: dto.code || `VS-2026-${String(this.dataStore.students.length + 1).padStart(3, '0')}`,
      fullName: dto.fullName || 'Học sinh mới',
      dob: dto.dob || '2010-01-01',
      gender: dto.gender || 'Nam',
      className: dto.className || '10A1',
      homeroomTeacher: dto.homeroomTeacher || 'ThS. Nguyễn Văn Hùng',
      parentName: dto.parentName || 'Phụ huynh học sinh',
      parentPhone: dto.parentPhone || '0900 123 456',
      address: dto.address || 'Hà Nội',
      status: dto.status || 'STUDYING',
      avatar:
        dto.avatar ||
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      canteenRegistered: dto.canteenRegistered ?? true,
      createdAt: now,
      updatedAt: now,
    };

    this.dataStore.students.push(newStudent);

    if (this.prisma.isConnected) {
      try {
        await this.prisma.student.create({
          data: {
            code: newStudent.code,
            fullName: newStudent.fullName,
            dob: newStudent.dob,
            gender: newStudent.gender,
            className: newStudent.className,
            homeroomTeacher: newStudent.homeroomTeacher,
            parentName: newStudent.parentName,
            parentPhone: newStudent.parentPhone,
            address: newStudent.address,
            status: newStudent.status,
            avatar: newStudent.avatar,
            canteenRegistered: newStudent.canteenRegistered,
          },
        });
      } catch (err) {
        console.warn('Prisma student create error:', err);
      }
    }

    return { success: true, message: 'Thêm học sinh thành công', data: newStudent };
  }

  async update(id: string, dto: Partial<StudentEntity>) {
    const index = this.dataStore.students.findIndex((s) => s.id === id || s.code === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy học sinh');

    const updated = {
      ...this.dataStore.students[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    this.dataStore.students[index] = updated;

    if (this.prisma.isConnected) {
      try {
        await this.prisma.student.update({
          where: { id: this.dataStore.students[index].id },
          data: {
            fullName: dto.fullName,
            dob: dto.dob,
            gender: dto.gender,
            className: dto.className,
            homeroomTeacher: dto.homeroomTeacher,
            parentName: dto.parentName,
            parentPhone: dto.parentPhone,
            address: dto.address,
            status: dto.status,
            avatar: dto.avatar,
            canteenRegistered: dto.canteenRegistered,
          },
        });
      } catch (err) {
        console.warn('Prisma student update error:', err);
      }
    }

    return { success: true, message: 'Cập nhật thông tin học sinh thành công', data: updated };
  }

  async remove(id: string) {
    const index = this.dataStore.students.findIndex((s) => s.id === id || s.code === id);
    if (index === -1) throw new NotFoundException('Không tìm thấy học sinh');

    const realId = this.dataStore.students[index].id;
    this.dataStore.students.splice(index, 1);

    if (this.prisma.isConnected) {
      try {
        await this.prisma.student.delete({ where: { id: realId } });
      } catch (err) {
        console.warn('Prisma student delete error:', err);
      }
    }

    return { success: true, message: 'Đã xóa hồ sơ học sinh' };
  }
}
