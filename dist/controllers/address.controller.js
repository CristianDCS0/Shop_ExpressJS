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
let con;
export function getAddress(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            con = yield connect.getConnection();
            const { id } = req.params;
            const [rows] = yield con.query('SELECT * FROM address where id = ?', id);
            res.json(rows[0]);
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error fetching addresses' });
        }
        finally {
            if (con)
                con.release();
        }
    });
}
export function postAddress(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            con = yield connect.getConnection();
            const address_id = uuidv4();
            const { id } = req.params;
            const postAddress = Object.assign(Object.assign({}, req.body), { id: address_id });
            yield con.query('INSERT INTO address SET?', postAddress);
            yield con.query('UPDATE users SET address_id=? WHERE id =?', [address_id, id]);
            res.status(201).json(postAddress);
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error creating address' });
        }
        finally {
            if (con)
                con.release();
        }
    });
}
