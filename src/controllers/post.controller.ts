import {Request, Response} from "express";
import {connect} from "../db";
import { Post } from "../models/Post"
export async function getPosts(req: Request, res: Response){
    const db = await connect.getConnection();
    const [rows] = await db.query('SELECT * FROM posts');
    res.json(rows);
    //close connection
    db.release();
}

export async function createPost(req: Request, res: Response){
    const newPost: Post = req.body;
    const db = await connect.getConnection();
    await db.query('INSERT INTO posts(id, title, description, created_at) VALUES (?,?,?,?)', newPost);
    res.json({
        message: 'TypePost created successfully',
        post: newPost
    });
    db.release();
}

export async function getPost(req: Request, res: Response){
    const id = req.params.id;
    const db = await connect.getConnection();
    const [row] = await db.query('SELECT * FROM posts WHERE id =?', [id]);
    res.json(row);
    db.release();
}

export async function updatePost(req: Request, res: Response){
    const id = req.params.id;
    const updatedPost: Post = req.body;
    const db = await connect.getConnection();
    await db.query('UPDATE posts SET? WHERE id =?', [updatedPost, id]);
    res.json({
        message: 'TypePost updated successfully',
        post: updatedPost
    });
    db.release();
}

export async function deletePost(req: Request, res: Response){
    const id = req.params.id;
    const db = await connect.getConnection();
    await db.query('DELETE FROM posts WHERE id =?', [id]);
    res.json({
        message: 'TypePost deleted successfully'
    });
    db.release();
}