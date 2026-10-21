import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/role.enum';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Lấy hồ sơ cá nhân của người dùng đang đăng nhập
  @Get('me')
  getProfile(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.getProfile(user.sub);
  }

  // Danh sách người dùng (Chỉ Admin và Manager)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get()
  list(
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.list({ role, status, search, limit });
  }

  // Khóa / Kích hoạt tài khoản (Chỉ Admin)
  @Roles(Role.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() admin: CurrentUserPayload,
  ) {
    return this.usersService.updateStatus(id, dto.status, admin.sub);
  }

  // Phân quyền vai trò mới (Chỉ Admin)
  @Roles(Role.ADMIN)
  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser() admin: CurrentUserPayload,
  ) {
    return this.usersService.updateRole(id, dto.role, admin.sub);
  }
}
