import { Router } from "express";
import { getAddress, postAddress } from "../controllers/address.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
const router = Router();
// @ts-ignore
router.route('/:id').get(authenticateToken, getAddress).post(authenticateToken, postAddress);
router.all('/', (req, res) => {
    res.status(405).json({ error: 'Method not allowed' });
});
export default router;
