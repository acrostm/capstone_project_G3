/*
 * @Descripttion : 授权守卫
 * @Author       : wuhaidong
 * @Date         : 2023-05-12 14:54:24
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2023-05-12 14:55:23
 */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      return false;
    }
    const hasRoles = roles.some((role) => role === user.role);
    if (!hasRoles) {
      throw new UnauthorizedException('您没有权限');
    }
    return hasRoles;
  }
}
