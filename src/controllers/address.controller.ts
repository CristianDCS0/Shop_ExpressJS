import {Request, Response} from "express";
import {connect} from "../db.js";
import {Address} from "../models/Address.js";
import {User} from "../models/User.js";
import {v4 as uuidv4} from "uuid";

let con: any;
export async function getAddress(req: Request, res: Response){
    try{
        con = await connect.getConnection();
        const {id} = req.params;
        const [rows] = await con.query('SELECT * FROM address where id = ?', id);
        res.json(rows[0]);
    }catch (e) {
        console.error(e);
        res.status(500).json({error: 'Error fetching addresses'});
    }finally {
        if (con) con.release();
    }
}

export async function postAddress(req: Request, res: Response){
    try{
        con = await connect.getConnection();
        const address_id = uuidv4();
        const {id} = req.params;
        const postAddress: Address = {...req.body, id: address_id};
        await con.query('INSERT INTO address SET?', postAddress);
        await con.query('UPDATE users SET address_id=? WHERE id =?', [address_id, id]);
        res.status(201).json(postAddress);
    }catch(e){
        console.error(e);
        res.status(500).json({error: 'Error creating address'});
    }finally {
        if (con) con.release();
    }
}