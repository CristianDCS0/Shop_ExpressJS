import {Router} from "express";
import {loginUsers, logoutUser, registerUser, getUser, refreshToken} from "../controllers/users.controller.js";
import {authenticateToken} from "../middlewares/authenticateToken.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUsers);
// @ts-ignore
router.route('/profile/:id').get(authenticateToken, getUser);
// @ts-ignore
router.route('/logout').post(authenticateToken, logoutUser);
// @ts-ignore
router.route('/refresh-token/:id').post(authenticateToken, refreshToken);

export default router;