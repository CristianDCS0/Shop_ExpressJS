import {Router} from 'express';
const router = Router();
import {getProducts, postProducts, updateProducts, deleteProducts, patchProduct} from "../controllers/product.controller";
import {authenticateSession} from "../middlewares/authenticateSession";

// @ts-ignore
router.route('/').get(authenticateSession, getProducts).post(authenticateSession, postProducts);

router.route('/:id')
    .put(updateProducts)
    .patch(patchProduct)
    .delete(deleteProducts);

router.all('/', (req, res) => {
    res.status(405).json({ error: 'Method not allowed' });
});

export default router;