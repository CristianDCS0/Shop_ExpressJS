var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { connect } from "../db.js";
import { v4 as uuidv4 } from 'uuid';
import { format } from "date-fns";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
let con;
const jwtSecret = String(process.env.JWT_SECRET);
const jwtExpiresIn = String(process.env.JWT_EXPIRES_IN);
const nodeEnv = process.env.NODE_ENV === 'production';
export const profileUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        con = yield connect.getConnection();
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ error: 'No autorizado' });
        }
        jwt.verify(token, jwtSecret, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(403).json({ error: 'Token inválido' });
            }
            const [rows] = yield con.query('SELECT email, birthdate, phone, gender, address_id FROM users WHERE id = ?', [user.id]);
            const u = rows[0];
            res.json({
                name: user.name, email: u.email, birthdate: u.birthdate,
                phone: u.phone, gender: u.gender, role: user.role, address_id: u.address_id
            });
        }));
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error fetching user' });
    }
    finally {
        if (con)
            con.release();
    }
});
export const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        con = yield connect.getConnection();
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const newUser = Object.assign(Object.assign({}, req.body), { id: uuidv4(), password: hashedPassword, birthdate: format(req.body.birthdate, "yyyy-MM-dd") });
        yield con.query('INSERT INTO users SET?', newUser);
        const token = jwt.sign({ id: newUser.id, name: newUser.name, role: newUser.role }, jwtSecret, { expiresIn: jwtExpiresIn || '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: nodeEnv,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });
        res.status(201).json({ message: "Registro exitoso" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error creating user' });
    }
    finally {
        if (con)
            con.release();
    }
});
export const loginUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        con = yield connect.getConnection();
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }
        const [rows] = yield con.query('SELECT id, name, email, password, role FROM users WHERE email = ?', [email]);
        if (!rows.length) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const user = rows[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn || '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: nodeEnv,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });
        res.status(200).json({ message: 'Login successfully' });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error logging in' });
    }
    finally {
        if (con)
            con.release();
    }
});
export const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error refreshing token' });
    }
});
export function logoutUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.clearCookie('token');
            res.json({ message: 'Logout exitoso' });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error logging out' });
        }
    });
}
