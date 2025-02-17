export function authenticateSession(req, res, next) {
    // @ts-ignore
    if (!req.session.session_id) {
        // @ts-ignore
        return res.status(403).json({ error: 'Access denied, please log in' });
    }
    next();
}
