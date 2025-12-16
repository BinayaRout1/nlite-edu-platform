// import express from "express";
// import {
//   upload,
//   getBlogs,
//   getBlogById,
//   getBlogImage,
//   addBlog,
//   updateBlog,
//   deleteBlog,
//   toggleBlogStatus,
// } from "../controllers/blogController.js";

// const router = express.Router();

// // LIST BLOGS
// router.get("/", getBlogs);

// // BLOG STATUS
// router.patch("/:id/status", toggleBlogStatus);

// // BLOG IMAGE (IMPORTANT FOR OG TAGS)
// router.get("/:id/image", getBlogImage);

// // GET SINGLE BLOG
// router.get("/:id", getBlogById);

// // ADD BLOG
// router.post("/", upload.single("image"), addBlog);

// // UPDATE BLOG
// router.put("/:id", upload.single("image"), updateBlog);

// // DELETE BLOG
// router.delete("/:id", deleteBlog);

// export default router;

import express from "express";
import {
  upload,
  getBlogs,
  getBlogById,
  getBlogImage,
  addBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
} from "../controllers/blogController.js";

const router = express.Router();

// ADD BLOG (Keep this at top — important!)
router.post("/", upload.single("image"), addBlog);

// LIST ALL BLOGS
router.get("/", getBlogs);

// TOGGLE STATUS
router.patch("/:id/status", toggleBlogStatus);

// BLOG IMAGE
router.get("/:id/image", getBlogImage);

// GET SINGLE BLOG
router.get("/:id", getBlogById);

// UPDATE BLOG
router.put("/:id", upload.single("image"), updateBlog);

// DELETE BLOG
router.delete("/:id", deleteBlog);

export default router;
