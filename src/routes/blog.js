import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import { validateBlog } from "../helper/validator/blog.validator.js";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  getOwnerBlog,
  updateBlog,
  updateBlogState,
} from "../controllers/blog.js";
const router = Router();

router.route("/").get(getAllBlogs).post(validateBlog, verifyToken, createBlog);
router.route("/author").get(verifyToken, getOwnerBlog);

router
  .route("/:id")
  .get(getBlog)
  .patch(verifyToken, updateBlogState)
  .delete(verifyToken, deleteBlog);

router.route("/:id/post").patch(verifyToken, updateBlog);
export default router;
