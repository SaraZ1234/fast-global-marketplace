import { CanActivate, ExecutionContext, Injectable,ForbiddenException} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
  const requiredRoles = this.reflector.get<string[]>(
    'roles',
    context.getHandler(),
  );

  console.log('REQUIRED ROLES:', requiredRoles);

  if (!requiredRoles) {
    return true;
  }

  const request = context.switchToHttp().getRequest();

  const user = request.user;

  console.log('REQUEST USER:', user);

  if (!user || !requiredRoles.includes(user.role)) {
    console.log('ROLE CHECK FAILED');
    throw new ForbiddenException('Access denied');
  }

  console.log('ROLE CHECK PASSED');

  return true;
}
}
