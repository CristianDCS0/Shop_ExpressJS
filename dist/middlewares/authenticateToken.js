"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Access denied, token missing!' });
        return;
    }
    try {
        // @ts-ignore
        req.user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET); // Ahora TypeScript debe reconocer esta propiedad
        next();
    }
    catch (err) {
        res.status(403).json({ error: 'Invalid token' });
        return;
    }
}
