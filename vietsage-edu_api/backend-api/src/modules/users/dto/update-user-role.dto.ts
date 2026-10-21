import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../../common/constants/role.enum';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsEnum(Role, { message: 'Vai trò phải là ADMIN, MANAGER hoặc STAFF' })
  role!: Role;
}
