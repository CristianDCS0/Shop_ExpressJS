import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'Access denied, no authorization' });
    }

    try {
        (req as any).user = jwt.verify(token, process.env.JWT_SECRET as string);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
