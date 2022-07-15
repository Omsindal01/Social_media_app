import express from "express";
const router = express.Router();
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  getPostsBySearch,
  getPost,
} from "./../controllers/posts.js";
import auth from "./../middleware/auth.js";

router.route("/search").get(getPostsBySearch);
router.route("/").get(getPosts).post(auth, createPost);
router
  .route("/:id")
  .patch(auth, updatePost)
  .delete(auth, deletePost)
  .get(getPost);
router.route("/:id/likePost").patch(auth, likePost);
router.route("/:id/commentPost").post(auth, commentPost);
export default router;
