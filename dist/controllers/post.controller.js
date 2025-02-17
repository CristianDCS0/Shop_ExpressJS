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
export function getPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield connect.getConnection();
        const [rows] = yield db.query('SELECT * FROM posts');
        res.json(rows);
        //close connection
        db.release();
    });
}
export function createPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newPost = req.body;
        const db = yield connect.getConnection();
        yield db.query('INSERT INTO posts(id, title, description, created_at) VALUES (?,?,?,?)', newPost);
        res.json({
            message: 'TypePost created successfully',
            post: newPost
        });
        db.release();
    });
}
export function getPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const db = yield connect.getConnection();
        const [row] = yield db.query('SELECT * FROM posts WHERE id =?', [id]);
        res.json(row);
        db.release();
    });
}
export function updatePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const updatedPost = req.body;
        const db = yield connect.getConnection();
        yield db.query('UPDATE posts SET? WHERE id =?', [updatedPost, id]);
        res.json({
            message: 'TypePost updated successfully',
            post: updatedPost
        });
        db.release();
    });
}
export function deletePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const db = yield connect.getConnection();
        yield db.query('DELETE FROM posts WHERE id =?', [id]);
        res.json({
            message: 'TypePost deleted successfully'
        });
        db.release();
    });
}
