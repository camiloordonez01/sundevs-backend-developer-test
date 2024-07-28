import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/models/user.entity';

export const HasRole = (roles: Role[]) => SetMetadata('roles', roles);
