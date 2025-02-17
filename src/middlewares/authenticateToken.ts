import {NextFunction, Request, Response} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Access denied, token missing!' });
        return;
    }
    try {
        // @ts-ignore
        req.user = jwt.verify(token, process.env.JWT_SECRET!) as string | JwtPayload; // Ahora TypeScript debe reconocer esta propiedad
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token' });
        return;
    }
}
