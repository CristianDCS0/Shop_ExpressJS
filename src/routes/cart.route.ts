import {Router} from 'express';
import { getCart, addToCart, removeFromCart, clearCart, getCartItems } from '../controllers/cart.controller.js';
import {authenticateToken} from "../middlewares/authenticateToken.js";

const router = Router();

// @ts-ignore
router.route('/:userId').get(authenticateToken, getCart) // Obtener carrito del usuario
// @ts-ignore
// @ts-ignore
router.route('/:cartId/items').get(authenticateToken, getCartItems); // Obtener productos del carrito
// @ts-ignore
router.post('/add', authenticateToken, addToCart).post('/remove', authenticateToken, removeFromCart).post('/clear', authenticateToken, clearCart);

export default router;