import {Request, Response, Router} from 'express';
const router = Router();
import {getProducts, postProducts, updateProducts, deleteProducts, patchProduct} from "../controllers/product.controller.js";
import {authenticateToken} from "../middlewares/authenticateToken.js";

// @ts-ignore
router.route('/').get(authenticateToken, getProducts).post(authenticateToken, postProducts);

// @ts-ignore
router.route('/:id').put(authenticateToken, updateProducts).patch(authenticateToken, patchProduct).delete(authenticateToken, deleteProducts);

router.all('/', (req: Request, res: Response) => {
    res.status(405).json({ error: 'Method not allowed' });
});

export default router;