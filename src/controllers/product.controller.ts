import {Request, Response} from "express";
import {connect} from "../db.js";
import {Product} from "../models/Product.js";
import {v4 as uuidv4} from 'uuid';

let con: any;
export async function getProducts(req: Request, res: Response){
    try {
        con = await connect.getConnection();
        const [rows] = await con.query('SELECT * FROM products');
        res.json(rows);
    }catch (e) {
        console.error(e);
        res.status(500).json({error: 'Error fetching products'});
    }finally {
        if (con) con.release();
    }

}

export async function postProducts(req: Request, res: Response){
    try{
        con = await connect.getConnection();
        const newProduct: Product = {...req.body, id: uuidv4()};
        await con.query('INSERT INTO products SET?', newProduct);
        res.status(201).json(newProduct);
    }catch (e) {
        console.error(e);
        res.status(500).json({error: 'Error creating product'});
    }finally {
        if (con) con.release();
    }

}

export async function updateProducts(req: Request, res: Response){
    try{
        const {id} = req.params;
        const updatedProduct: Product = {...req.body, updated_at: new Date()};
        const db = await connect.getConnection();
        await db.query('UPDATE products SET? WHERE id =?', [updatedProduct, id]);
        res.json(updatedProduct);
        db.release();
    }catch (e) {
        console.error(e);
        res.status(500).json({error: 'Error updating product'});
    }

}

export async function patchProduct(req: Request, res: Response){
    const {id} = req.params;
    const updatedProduct: Product = {...req.body, updated_at: new Date()};
    const db = await connect.getConnection();
    await db.query('UPDATE products SET? WHERE id =?', [updatedProduct, id]);
    res.json(updatedProduct);
    db.release();
}

export async function deleteProducts(req: Request, res: Response){
    const {id} = req.params;
    const db = await connect.getConnection();
    await db.query('DELETE FROM products WHERE id =?', id);
    res.status(204).send();
    db.release();
}