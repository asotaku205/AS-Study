
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/entity/user.entity';

export type Role = UserRole;
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
