import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../../users/models/user.entity';

export class AssignRoleDto {
  @ApiPropertyOptional({
    example: 'ghost',
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
