"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_controller_1 = require("../controllers/address.controller");
const router = (0, express_1.Router)();
router.route('/')
    .get(address_controller_1.getAddress)
    .post(address_controller_1.postAddress);
exports.default = router;
