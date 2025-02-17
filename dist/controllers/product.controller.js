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
let con;
export function getProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            con = yield connect.getConnection();
            const [rows] = yield con.query('SELECT * FROM products');
            res.json(rows);
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error fetching products' });
        }
        finally {
            if (con)
                con.release();
        }
    });
}
export function postProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            con = yield connect.getConnection();
            const newProduct = Object.assign(Object.assign({}, req.body), { id: uuidv4() });
            yield con.query('INSERT INTO products SET?', newProduct);
            res.status(201).json(newProduct);
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error creating product' });
        }
        finally {
            if (con)
                con.release();
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
