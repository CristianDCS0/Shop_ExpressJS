"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const router = (0, express_1.Router)();
router.route('/').post(users_controller_1.signup);
// @ts-ignore
router.route('/login').post(users_controller_1.login);
router.get('/logout', users_controller_1.logout);
exports.default = router;
