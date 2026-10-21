import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserStatus } from '@prisma/client';
import { Role } from '../../common/constants/role.enum';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Lấy thông tin cá nhân của người dùng hiện tại
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return { success: true, data: user };
  }

  // Danh sách người dùng (dành cho Admin / Manager)
  async list(query: { role?: string; status?: string; search?: string; limit?: number }) {
    const limit = query.limit ? Math.min(Number(query.limit), 100) : 50;
    const users = await this.prisma.user.findMany({
      where: {
        ...(query.role ? { role: query.role } : {}),
        ...(query.status ? { status: query.status as UserStatus } : {}),
        ...(query.search
          ? {
              OR: [
                { email: { contains: query.search, mode: 'insensitive' } },
                { fullName: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return { success: true, data: users, total: users.length };
  }

  // Cập nhật trạng thái tài khoản (ACTIVE / DISABLED) - Admin only
  async updateStatus(targetUserId: string, status: UserStatus, currentAdminId: string) {
    if (targetUserId === currentAdminId && status === UserStatus.DISABLED) {
      throw new BadRequestException('Quản trị viên không thể tự vô hiệu hóa tài khoản của chính mình');
    }
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản cần cập nhật');
    }
    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { status },
      select: { id: true, email: true, fullName: true, role: true, status: true },
    });

    // Nếu vô hiệu hóa, tự động thu hồi toàn bộ refresh token hiện có của user
    if (status === UserStatus.DISABLED) {
      await this.prisma.refreshToken.updateMany({
        where: { userId: targetUserId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    return {
      success: true,
      message: `Đã ${status === UserStatus.ACTIVE ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản thành công`,
      data: updated,
    };
  }

  // Cập nhật vai trò (Admin only)
  async updateRole(targetUserId: string, role: Role, currentAdminId: string) {
    if (targetUserId === currentAdminId && role !== Role.ADMIN) {
      throw new BadRequestException('Quản trị viên không thể tự hạ quyền của chính mình');
    }
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }
    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { role },
      select: { id: true, email: true, fullName: true, role: true, status: true },
    });
    return { success: true, message: `Đã cập nhật vai trò thành ${role}`, data: updated };
  }
}
