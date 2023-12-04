import type { NextFunction, Request, Response } from 'express';
import { decryptId } from '../utils/jwt';
import { User } from '../models/user.model';

export const authenticateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response<any, Record<string, any>> | undefined> => {
  const token = req.cookies.userId;

  if (token === null) {
    return res.status(401).json('Unauthorized');
  }

  const userId = decryptId(token);

  if (userId === null) {
    return res.status(401).json('Invalid token');
  }

  try {
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ message: 'User not found' });
    }

    (req as any).user = user;

    next();
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};
