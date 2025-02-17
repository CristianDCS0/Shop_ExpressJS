import {Request, Response} from "express";
import {connect} from "../db";
import {Address} from "../models/Address";
import {User} from "../models/User";
import {v4 as uuidv4} from "uuid";

export async function getAddress(req: Request, res: Response){
    try{
        const db = await connect.getConnection();
        const [rows] = await db.query('SELECT * FROM address');
        res.json(rows);
        db.release();
    }catch (e) {
        console.error(e);
        res.status(500).json({error: 'Error fetching addresses'});
    }
}

export async function postAddress(req: Request, res: Response){
    try{
        const address_id = uuidv4();
        const {id} = req.params;
        const updateUser: User = {...req.body, address_id: address_id};
        const newAddress: Address = {...req.body, id: address_id};
        const db = await connect.getConnection();
        await db.query('INSERT INTO address SET?', newAddress);
        await db.query('UPDATE users SET? WHERE id =?', [updateUser, id]);
        res.status(201).json(newAddress);
        db.release();
    }catch(e){
        console.error(e);
        res.status(500).json({error: 'Error creating address'});
    }
}