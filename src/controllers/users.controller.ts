import {Request, Response} from "express";
import {connect} from "../db.js";
import {User} from "../models/User.js";
import {v4 as uuidv4} from 'uuid';
import {format} from "date-fns";
import bcrypt, {compare} from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
let con: any;

export async function getUser(req: Request, res: Response){
    try{
        con = await connect.getConnection();
        const {id} = req.params;
        const [rows] = await con.query(
            'SELECT name, email, birthdate, phone, gender, role, address_id FROM users WHERE id = ?', [id]);
        const user = rows[0];
        res.status(201).json({ name: user.name, email: user.email, birthdate: user.birthdate,
            phone: user.phone, gender: user.gender, role: user.role, address_id: user.address_id});
    }catch (e) {
        console.error(e);
        res.status(500).json({error: 'Error fetching user'});
    }finally {
        if (con) con.release();
    }
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try{
        con = await connect.getConnection();
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const newUser: User = {...req.body, id: uuidv4(), password:hashedPassword, birthdate: format(req.body.birthdate, "yyyy-MM-dd")};
        await con.query('INSERT INTO users SET?', newUser);
        const token = jwt.sign(
            { id: newUser.id, name: newUser.name, role: newUser.role },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );
        res.status(201).json({message: "Registro exitoso", id: newUser.id, name: newUser.name, role: newUser.role, token});
    }catch (e){
        console.error(e);
        res.status(500).json({error: 'Error creating user'});
    }finally {
        if (con) con.release();
    }
}

export const loginUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        con = await connect.getConnection();
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }

        const [rows]: any = await con.query('SELECT id, name, email, password, role FROM users WHERE email = ?', [email]);

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

        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.status(200).json({
            message: 'Login successfully', id: user.id, name: user.name, role: user.role, token
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error logging in' });
    } finally {
        if (con) con.release();
    }
}

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        con = await connect.getConnection();
        const { token } = req.body;
        const { id } = req.params;
        if (!token) {
            res.status(400).json({ error: 'Token is required' });
            return;
        }
        const [rows]: any = await con.query('SELECT id, name, role FROM users WHERE id = ?', [id]);
        const user = rows[0];

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const newToken = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.status(200).json({
            message: 'Token refreshed successfully',
            token: newToken
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error refreshing token' });
    }
}

export async function logoutUser(req: Request, res: Response) {
    try {
        res.status(200).json({ message: 'Logout successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error logging out' });
    }
}
