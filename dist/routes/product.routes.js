"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const product_controller_1 = require("../controllers/product.controller");
const authenticateSession_1 = require("../middlewares/authenticateSession");
// @ts-ignore
router.route('/').get(authenticateSession_1.authenticateSession, product_controller_1.getProducts).post(authenticateSession_1.authenticateSession, product_controller_1.postProducts);
router.route('/:id')
    .put(product_controller_1.updateProducts)
    .patch(product_controller_1.patchProduct)
    .delete(product_controller_1.deleteProducts);
router.all('/', (req, res) => {
    res.status(405).json({ error: 'Method not allowed' });
});
exports.default = router;
