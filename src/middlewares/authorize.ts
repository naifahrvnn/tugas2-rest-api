import type { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/ForbiddenError.ts';
import { getUser } from './auth.ts';

export type UserRole = 'admin' | 'owner' | 'customer';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (allowedRoles.length === 0) {
      return next(new Error('authorize() harus menerima minimal satu role'));
    }
    const user = getUser(req);
    if (!user) {
      return next(new ForbiddenError('Akses ditolak. Anda belum login.'));
    }
    if (!allowedRoles.includes(user.role)) {
      return next(new ForbiddenError('Akses ditolak. Role Anda tidak diizinkan.'));
    }
    req.user = user;
    return next();
  };
}