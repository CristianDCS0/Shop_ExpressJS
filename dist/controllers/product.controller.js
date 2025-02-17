"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.postProducts = postProducts;
exports.updateProducts = updateProducts;
exports.patchProduct = patchProduct;
exports.deleteProducts = deleteProducts;
const db_1 = require("../db");
const uuid_1 = require("uuid");
function getProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let db;
        try {
            db = yield db_1.connect.getConnection();
            const [rows] = yield db.query('SELECT * FROM products ORDER BY count ASC');
            res.json(rows);
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error fetching products' });
        }
        finally {
            if (db)
                db.release();
        }
    });
}
function postProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const db = yield db_1.connect.getConnection();
            const [rows] = yield db.query('SELECT MAX(count) as maxCount FROM products');
            const lastCount = ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.maxCount) || 0;
            const newProduct = Object.assign(Object.assign({}, req.body), { id: (0, uuid_1.v4)(), count: lastCount + 1 });
            yield db.query('INSERT INTO products SET?', newProduct);
            res.status(201).json(newProduct);
            db.release();
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error creating product' });
        }
    });
}
function updateProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const updatedProduct = Object.assign(Object.assign({}, req.body), { updated_at: new Date() });
            const db = yield db_1.connect.getConnection();
            yield db.query('UPDATE products SET? WHERE id =?', [updatedProduct, id]);
            res.json(updatedProduct);
            db.release();
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error updating product' });
        }
    });
}
function patchProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const updatedProduct = Object.assign(Object.assign({}, req.body), { updated_at: new Date() });
        const db = yield db_1.connect.getConnection();
        yield db.query('UPDATE products SET? WHERE id =?', [updatedProduct, id]);
        res.json(updatedProduct);
        db.release();
    });
}
function deleteProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const db = yield db_1.connect.getConnection();
        yield db.query('DELETE FROM products WHERE id =?', id);
        res.status(204).send();
        db.release();
    });
}
