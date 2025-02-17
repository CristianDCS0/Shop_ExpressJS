var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { connect } from "../db.js";
import { v4 as uuidv4 } from 'uuid';
export function getProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let db;
        try {
            db = yield connect.getConnection();
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
export function postProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const db = yield connect.getConnection();
            const [rows] = yield db.query('SELECT MAX(count) as maxCount FROM products');
            const lastCount = ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.maxCount) || 0;
            const newProduct = Object.assign(Object.assign({}, req.body), { id: uuidv4(), count: lastCount + 1 });
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
export function updateProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const updatedProduct = Object.assign(Object.assign({}, req.body), { updated_at: new Date() });
            const db = yield connect.getConnection();
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
export function patchProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const updatedProduct = Object.assign(Object.assign({}, req.body), { updated_at: new Date() });
        const db = yield connect.getConnection();
        yield db.query('UPDATE products SET? WHERE id =?', [updatedProduct, id]);
        res.json(updatedProduct);
        db.release();
    });
}
export function deleteProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const db = yield connect.getConnection();
        yield db.query('DELETE FROM products WHERE id =?', id);
        res.status(204).send();
        db.release();
    });
}
