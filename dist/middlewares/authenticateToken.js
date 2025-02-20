import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export function authenticateToken(req, res, next) {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        return res.status(403).json({ error: 'Access denied' });
    }
    try {
        req.user = jwt.verify(token, String(process.env.JWT_SECRET));
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
