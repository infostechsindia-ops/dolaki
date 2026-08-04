import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN' | 'DELIVERY';
}

// Extend Express Request to include user payload
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  private readonly jwtSecret = process.env.JWT_SECRET || 'super-secret-enterprise-key';

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }
}

/**
 * Role Guard Decorator & Implementation for protecting routes
 * Usage: @UseGuards(RolesGuard) @Roles('ADMIN', 'VENDOR')
 */
import { CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // No roles required
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions to access this resource');
    }

    return true;
  }
}
