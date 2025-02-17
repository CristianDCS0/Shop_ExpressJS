var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { connect } from '../db.js';
let con;
export const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        con = yield connect.getConnection();
        const [cart] = yield con.query('SELECT * FROM cart WHERE id_user = ?', [userId]);
        if (cart.length === 0) {
            // Si el usuario no tiene un carrito, creamos uno
            const [newCart] = yield con.query('INSERT INTO cart (id, id_user) VALUES (UUID(), ?)', [userId]);
            return res.json({ message: 'New cart created', cartId: newCart.insertId });
        }
        res.json(cart[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving cart' });
    }
    finally {
        if (con)
            con.release();
    }
});
export const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId, productId, quantity } = req.body;
    try {
        con = yield connect.getConnection();
        // Verificamos si el producto existe
        const [product] = yield con.query('SELECT * FROM products WHERE id = ?', [productId]);
        if (product.length === 0) {
            con.release();
            return res.status(404).json({ error: 'Product not found' });
        }
        // Verificar si ya está en el carrito
        const [existingItem] = yield con.query('SELECT * FROM cart_items WHERE id_cart = ? AND id_product = ?', [cartId, productId]);
        if (existingItem.length > 0) {
            // Si ya existe, actualizamos la cantidad
            yield con.query('UPDATE cart_items SET quantity = quantity + ? WHERE id_cart = ? AND id_product = ?', [quantity, cartId, productId]);
        }
        else {
            // Si no existe, lo insertamos
            yield con.query('INSERT INTO cart_items (id, id_cart, id_product, quantity) VALUES (UUID(), ?, ?, ?)', [cartId, productId, quantity]);
        }
        res.json({ message: 'Product added to cart' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding product to cart' });
    }
    finally {
        if (con)
            con.release();
    }
});
export const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId, productId } = req.body;
    try {
        con = yield connect.getConnection();
        yield con.query('DELETE FROM cart_items WHERE id_cart = ? AND id_product = ?', [cartId, productId]);
        res.json({ message: 'Product removed from cart' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing product from cart' });
    }
    finally {
        if (con)
            con.release();
    }
});
export const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId } = req.body;
    try {
        con = yield connect.getConnection();
        yield con.query('DELETE FROM cart_items WHERE id_cart = ?', [cartId]);
        res.json({ message: 'Cart cleared' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error clearing cart' });
    }
    finally {
        if (con)
            con.release();
    }
});
export const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId } = req.params;
    try {
        con = yield connect.getConnection();
        const [items] = yield con.query(`SELECT ci.id, p.name, p.price, ci.quantity, (p.price * ci.quantity) AS total_price
             FROM cart_items ci
             JOIN products p ON ci.id_product = p.id
             WHERE ci.id_cart = ?`, [cartId]);
        res.json({ cartItems: items });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving cart items' });
    }
    finally {
        if (con)
            con.release();
    }
});
