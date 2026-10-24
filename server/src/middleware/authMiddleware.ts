import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'kaadugal_forest_secret_2026_roots';

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await UserService.findById(decoded.id);

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found for this token' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
    return;
  }
};

export const adminOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const email = (req.user?.email || '').toLowerCase().trim();
  const isAdminRole = req.user?.role === 'admin';
  const hasAdminEmail = email.endsWith('@admin.com');

  if (isAdminRole && hasAdminEmail) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges require an email address ending with @admin.com',
    });
  }
};

export const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '30d',
  });
};
