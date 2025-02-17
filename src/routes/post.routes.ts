import {Router} from "express";
const router = Router();

// Importing routes
import {getPosts, createPost, getPost, updatePost, deletePost} from "../controllers/post.controller";

router.route('/')
   .get(getPosts)
    .post(createPost);

router.route('/:id')
   .get(getPost)
   .put(updatePost)
   .delete(deletePost);
export default router;