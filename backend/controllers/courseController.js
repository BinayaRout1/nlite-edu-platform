import db from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Ensure upload folder exists
const uploadDir = "uploads/courses";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
export const upload = multer({ storage });

// ===================== GET ALL COURSES =====================
export const getCourses = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM courses ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching courses:", err);
    res
      .status(500)
      .json({ message: "Error fetching courses", error: err.message });
  }
};

// ===================== ADD NEW COURSE =====================
export const addCourse = async (req, res) => {
  try {
    const { name, description, status, active } = req.body;
    const image = req.files?.image ? req.files.image[0].filename : null;
    const document = req.files?.document
      ? req.files.document[0].filename
      : null;

    const [result] = await db.query(
      "INSERT INTO courses (name, description, status, image, document, active) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, status, image, document, active === "true" ? 1 : 0]
    );

    res.json({ message: "✅ Course added successfully", id: result.insertId });
  } catch (err) {
    console.error("❌ Error adding course:", err);
    res
      .status(500)
      .json({ message: "Error adding course", error: err.message });
  }
};

// ===================== UPDATE COURSE =====================
export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { name, description, status, active } = req.body;

    // ✅ Fetch existing course first
    const [existingCourse] = await db.query(
      "SELECT * FROM courses WHERE id = ?",
      [courseId]
    );

    if (!existingCourse.length) {
      return res.status(404).json({ error: "Course not found" });
    }

    const course = existingCourse[0];

    // ✅ Keep old values if new ones are not sent
    const updatedName = name || course.name;
    const updatedDescription = description || course.description;
    const updatedStatus = status || course.status;
    const updatedActive = active !== undefined ? active : course.active;

    const image = req.files?.image?.[0]?.filename || course.image;
    const document = req.files?.document?.[0]?.filename || course.document;

    await db.query(
      `UPDATE courses
       SET name=?, description=?, status=?, image=?, document=?, active=?
       WHERE id=?`,
      [
        updatedName,
        updatedDescription,
        updatedStatus,
        image,
        document,
        updatedActive,
        courseId,
      ]
    );

    res.json({ message: "✅ Course updated successfully" });
  } catch (error) {
    console.error("❌ Error updating course:", error);
    res.status(500).json({ error: "Error updating course" });
  }
};

// ===================== DELETE COURSE =====================
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM courses WHERE id=?", [id]);
    res.json({ message: "✅ Course deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting course:", err);
    res
      .status(500)
      .json({ message: "Error deleting course", error: err.message });
  }
};
