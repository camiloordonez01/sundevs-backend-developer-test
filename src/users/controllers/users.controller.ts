import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './../../auth/guards/jwt-auth.guard';
import { RolesGuard } from './../../auth/guards/roles.guard';
import { HasRole } from './../../auth/decorators/roles.decorator';
import { Role } from './../../users/models/user.entity';

import { AssignRoleDto } from './dto/assign-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post(':userId/role')
  @HasRole([Role.ADMIN])
  @ApiOperation({ summary: 'Assign roles to users' })
  @ApiBody({ type: AssignRoleDto })
  @ApiResponse({
    status: 201,
    description: 'Role successfully assigned',
    schema: {
      example: true,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Not Found',
      },
    },
  })
  async assignRole(
    @Param('userId') userId: string,
    @Body() assignRoleDto: AssignRoleDto,
  ): Promise<boolean> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException();
    }

    const updateUserDto = new UpdateUserDto();
    updateUserDto.role = assignRoleDto.role;

    await this.usersService.update(userId, updateUserDto);

    return true;
  }
}
