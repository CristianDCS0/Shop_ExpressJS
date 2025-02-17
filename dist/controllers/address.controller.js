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
import { v4 as uuidv4 } from "uuid";
export function getAddress(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield connect.getConnection();
            const [rows] = yield db.query('SELECT * FROM address');
            res.json(rows);
            db.release();
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error fetching addresses' });
        }
    });
}
export function postAddress(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const address_id = uuidv4();
            const { id } = req.params;
            const updateUser = Object.assign(Object.assign({}, req.body), { address_id: address_id });
            const newAddress = Object.assign(Object.assign({}, req.body), { id: address_id });
            const db = yield connect.getConnection();
            yield db.query('INSERT INTO address SET?', newAddress);
            yield db.query('UPDATE users SET? WHERE id =?', [updateUser, id]);
            res.status(201).json(newAddress);
            db.release();
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error creating address' });
        }
    });
}
