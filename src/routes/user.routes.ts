import {Router} from "express";
import {login, logout, signup} from "../controllers/users.controller";

const router = Router();

router.route('/').post(signup);

// @ts-ignore
router.route('/login').post(login);

router.get('/logout', logout);

export default router;