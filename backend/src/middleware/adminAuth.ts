import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

export default async function adminAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.userId).lean();

    if (!user || (user as any).role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Forbidden: Admin access required' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
