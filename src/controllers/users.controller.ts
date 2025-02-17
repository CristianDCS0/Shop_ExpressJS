import {Request, Response} from "express";
import {connect} from "../db";
import {User} from "../models/User";
import {v4 as uuidv4} from 'uuid';
import {format} from "date-fns";
let bcrypt = require("bcrypt");

export async function getUsers(req: Request, res: Response){
    let db;
    try{
        db = await connect.getConnection();
        const [rows] = await db.query('SELECT id, name, email, birthdate, phone, gender, role FROM users');
        res.status(201).json(rows);
        console.log(rows)
    }catch (e) {
        console.error(e);
        res.status(500).json({error: 'Error fetching users'});
    }finally {
        if (db) db.release();
    }
}

export async function signup(req: Request, res: Response){
    let db;
    try{
        db = await connect.getConnection();
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const newUser: User = {...req.body, id: uuidv4(), password:hashedPassword, birthdate: format(req.body.birthdate, "yyyy-MM-dd")};
        await db.query('INSERT INTO users SET?', newUser);

        // @ts-ignore
        req.session.name = newUser.name;
        // @ts-ignore
        req.session.role = newUser.role;

        // @ts-ignore
        res.status(201).json({message: "Registro exitoso", name: req.session.name, role: req.session.role});
    }catch (e){
        console.error(e);
        res.status(500).json({error: 'Error creating user'});
    }finally {
        if (db) db.release();
    }
}

export async function login(req: Request, res: Response){
    let db;
    try{
        db = await connect.getConnection();
        const {email, password} = req.body;

        if (!email || !password) {
            res.status(400).json({error: 'Email and password are required'});
            console.log(res.json({error: 'Email and password are required'}));
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            console.log({error: 'Invalid email format'});
            return;
        }

        const [rows]: any = await db.query('SELECT id, name, email, password, role FROM users WHERE email = ?', email);
        const user = rows[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!user || !isPasswordValid) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        // @ts-ignore
        req.session.name = user.name;
        // @ts-ignore
        req.session.role = user.role;
        // @ts-ignore
        req.session.session_id = req.sessionID;

        if (!req.session) {
            return res.status(500).json({ error: 'Session not initialized' });
        }

        // @ts-ignore
        res.status(200).json({message: 'Login successfully', name: req.session.name, role: req.session.role});
    }catch (e) {
        console.error(e);
        res.status(500).json({error: 'Error logging in'});
    }finally {
        if (db) db.release();
    }
}

export async function logout(req: Request, res: Response) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
}
