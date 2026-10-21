import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UpdateUserStatusDto {
  @IsNotEmpty()
  @IsEnum(UserStatus, { message: 'Trạng thái phải là ACTIVE hoặc DISABLED' })
  status!: UserStatus;
}
