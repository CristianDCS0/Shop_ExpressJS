import {Request, Response} from "express";
import {connect} from "../db";
import {Product} from "../models/Product";
import {v4 as uuidv4} from 'uuid';

export async function getProducts(req: Request, res: Response){
    let db;
    try {
        db = await connect.getConnection();
        const [rows] = await db.query('SELECT * FROM products ORDER BY count ASC');
        res.json(rows);
    }catch (e) {
        console.error(e);
        res.status(500).json({error: 'Error fetching products'});
    }finally {
        if (db) db.release();
    }

}

export async function postProducts(req: Request, res: Response){
    try{
        const db = await connect.getConnection();
        const [rows]: any = await db.query('SELECT MAX(count) as maxCount FROM products');
        const lastCount = rows[0]?.maxCount || 0;
        const newProduct: Product = {...req.body, id: uuidv4(), count:lastCount+1};
        await db.query('INSERT INTO products SET?', newProduct);
        res.status(201).json(newProduct);
        db.release();
    }catch (e) {
        console.error(e);
        res.status(500).json({error: 'Error creating product'});
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