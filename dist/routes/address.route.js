import { Router } from "express";
import { getAddress, postAddress } from "../controllers/address.controller.js";
const router = Router();
router.route('/')
    .get(getAddress)
    .post(postAddress);
export default router;
