import {NextFunction} from "express";
export function authenticateSession(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    if (!req.session.session_id) {
        // @ts-ignore
        return res.status(403).json({ error: 'Access denied, please log in' });
    }
    next();
}
