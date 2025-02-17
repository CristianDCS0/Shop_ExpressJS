import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export function authenticateToken(req, res, next) {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(403).json({ error: 'Access denied, no authorization' });
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
