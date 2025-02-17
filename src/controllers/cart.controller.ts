import { Request, Response } from 'express';
import {connect} from '../db.js';
let con: any;

export const getCart = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        con = await connect.getConnection();
        const [cart]: any = await con.query('SELECT * FROM cart WHERE id_user = ?', [userId]);

        if (cart.length === 0) {
            // Si el usuario no tiene un carrito, creamos uno
            const [newCart]: any = await con.query('INSERT INTO cart (id, id_user) VALUES (UUID(), ?)', [userId]);
            return res.json({ message: 'New cart created', cartId: newCart.insertId });
        }
        res.json(cart[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving cart' });
    }finally {
        if(con) con.release();
    }
};

export const addToCart = async (req: Request, res: Response) => {
    const { cartId, productId, quantity } = req.body;
    try {
        con = await connect.getConnection();
        // Verificamos si el producto existe
        const [product]: any = await con.query('SELECT * FROM products WHERE id = ?', [productId]);

        if (product.length === 0) {
            con.release();
            return res.status(404).json({ error: 'Product not found' });
        }

        // Verificar si ya está en el carrito
        const [existingItem]: any = await con.query(
            'SELECT * FROM cart_items WHERE id_cart = ? AND id_product = ?', [cartId, productId]
        );

        if (existingItem.length > 0) {
            // Si ya existe, actualizamos la cantidad
            await con.query(
                'UPDATE cart_items SET quantity = quantity + ? WHERE id_cart = ? AND id_product = ?',
                [quantity, cartId, productId]
            );
        } else {
            // Si no existe, lo insertamos
            await con.query(
                'INSERT INTO cart_items (id, id_cart, id_product, quantity) VALUES (UUID(), ?, ?, ?)',
                [cartId, productId, quantity]
            );
        }
        res.json({ message: 'Product added to cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding product to cart' });
    } finally {
        if(con) con.release();
    }
};

export const removeFromCart = async (req: Request, res: Response) => {
    const { cartId, productId } = req.body;
    try {
        con = await connect.getConnection();
        await con.query(
            'DELETE FROM cart_items WHERE id_cart = ? AND id_product = ?', [cartId, productId]
        );
        res.json({ message: 'Product removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing product from cart' });
    } finally {
        if(con) con.release();
    }
};

export const clearCart = async (req: Request, res: Response) => {
    const { cartId } = req.body;
    try {
        con = await connect.getConnection();
        await con.query('DELETE FROM cart_items WHERE id_cart = ?', [cartId]);
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error clearing cart' });
    }
    finally {
        if(con) con.release();
    }
};

export const getCartItems = async (req: Request, res: Response) => {
    const { cartId } = req.params;
    try {
        con = await connect.getConnection();
        const [items]: any = await con.query(
            `SELECT ci.id, p.name, p.price, ci.quantity, (p.price * ci.quantity) AS total_price
             FROM cart_items ci
             JOIN products p ON ci.id_product = p.id
             WHERE ci.id_cart = ?`,
            [cartId]
        );
        res.json({ cartItems: items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving cart items' });
    } finally {
        if(con) con.release();
    }
};