import express from "express";
import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  upload
} from "../controllers/courseController.js";

const router = express.Router();

// ✅ Get all courses
router.get("/", getCourses);

// ✅ Add new course (with file upload)
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  addCourse
);

// ✅ Update course
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  updateCourse
);

// ✅ Delete course
router.delete("/:id", deleteCourse);

export default router;
