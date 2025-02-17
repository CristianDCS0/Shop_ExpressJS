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
export function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            con = yield connect.getConnection();
            const { id } = req.params;
            const [rows] = yield con.query(`SELECT u.id, u.name, u.email, u.birthdate, u.phone, u.gender, u.role, a.city FROM users u 
            LEFT JOIN address a ON u.address_id = a.id WHERE u.id = ?`, [id]);
            res.status(201).json(rows);
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
}
export function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            con = yield connect.getConnection();
            const hashedPassword = bcrypt.hashSync(req.body.password, 10);
            const newUser = Object.assign(Object.assign({}, req.body), { id: uuidv4(), password: hashedPassword, birthdate: format(req.body.birthdate, "yyyy-MM-dd") });
            yield con.query('INSERT INTO users SET?', newUser);
            const token = jwt.sign({ id: newUser.id, name: newUser.name, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
            res.status(201).json({ message: "Registro exitoso", name: newUser.name, role: newUser.role, token });
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
}
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
        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
        res.status(200).json({
            message: 'Login successfully',
            name: user.name,
            role: user.role,
            token
        });
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
        con = yield connect.getConnection();
        const { token } = req.body;
        const { id } = req.params;
        if (!token) {
            res.status(400).json({ error: 'Token is required' });
            return;
        }
        const [rows] = yield con.query('SELECT id, name, role FROM users WHERE id = ?', [id]);
        const user = rows[0];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const newToken = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
        res.status(200).json({
            message: 'Token refreshed successfully',
            token: newToken
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error refreshing token' });
    }
});
export function logoutUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.status(200).json({ message: 'Logout successfully' });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error logging out' });
        }
    });
}
