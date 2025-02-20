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
const jwtSecret = String(process.env.JWT_SECRET);
const jwtExpiresIn = String(process.env.JWT_EXPIRES_IN);
const nodeEnv = Boolean(process.env.NODE_ENV);

export const profileUser = async(req: Request, res: Response): Promise<void> => {
    try{
        con = await connect.getConnection();
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ error: 'No autorizado' });
        }

        jwt.verify(token, jwtSecret, async (err: any, user: any) => {
            if (err) {
                return res.status(403).json({error: 'Token inválido'});
            }
            const [rows] = await con.query('SELECT email, birthdate, phone, gender, address_id FROM users WHERE id = ?', [user.id]);
            const u = rows[0];
            res.json({
                name: user.name, email: u.email, birthdate: u.birthdate,
                phone: u.phone, gender: u.gender, role: user.role, address_id: u.address_id
            });
        });

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
            jwtSecret,
            { expiresIn: jwtExpiresIn || '1h' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: nodeEnv,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });
        res.status(201).json({message: "Registro exitoso"});
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
            jwtSecret,
            { expiresIn: jwtExpiresIn || '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: nodeEnv,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });

        res.status(200).json({message: 'Login successfully'});
        
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error logging in' });
    }finally {
        if (con) con.release();
    }
}

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error refreshing token' });
    }
}

export async function logoutUser(req: Request, res: Response) {
    try {
        res.clearCookie('token');
        res.json({ message: 'Logout exitoso' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error logging out' });
    }
}
