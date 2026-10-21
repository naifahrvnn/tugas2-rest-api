import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { verifyToken, type AuthUser } from '../services/tokenService.ts';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';

const BEARER_PREFIX = 'Bearer ';

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith(BEARER_PREFIX)) return null;
  const token = header.slice(BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
}

export const authenticate: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = extractToken(req);
  if (!token) {
    return next(new UnauthorizedError('Header Authorization dengan token Bearer wajib dikirim'));
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new UnauthorizedError());
  }
};

export function getUser(req: Request): AuthUser {
  if (!req.user) {
    throw new UnauthorizedError('Endpoint ini harus dipakai setelah middleware authenticate');
  }
  return req.user;
}

// TAMBAHKAN INI untuk skenario nomor 6 (Cek Role Admin)
export function requireRole(allowedRoles: string[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      // Mengembalikan error 403 Forbidden jika role tidak sesuai
      return next(new (class extends Error {
        status = 403;
        constructor(message: string) {
          super(message);
          this.name = 'ForbiddenError';
        }
      })('Akses ditolak: Role Anda tidak memiliki izin'));
    }
    return next();
  };
}