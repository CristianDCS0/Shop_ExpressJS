import {Router} from "express";
import { loginUsers, logoutUser, registerUser, refreshToken, profileUser } from "../controllers/users.controller.js";
import {authenticateToken} from "../middlewares/authenticateToken.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUsers);
// @ts-ignore
router.route('/profile').get(authenticateToken, profileUser);
// @ts-ignore
router.route('/logout').get(authenticateToken, logoutUser);
// @ts-ignore
router.route('/refresh-token/:id').post(authenticateToken, refreshToken);

export default router;