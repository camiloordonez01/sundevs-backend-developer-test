import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, MaxLength } from 'class-validator';
import { Role } from '../../../users/models/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John',
  })
  @IsOptional()
  @MaxLength(40)
  firstName: string;

  @ApiPropertyOptional({
    example: 'Smith',
  })
  @IsOptional()
  @MaxLength(40)
  lastName: string;

  @ApiPropertyOptional({
    example: 'user@mail.com',
  })
  @IsOptional()
  @MaxLength(40)
  email: string;

  @ApiPropertyOptional({
    example: 'ghost',
  })
  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
