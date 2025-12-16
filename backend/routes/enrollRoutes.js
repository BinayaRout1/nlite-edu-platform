import express from "express";
import { getAllEnrollments, addEnrollment } from "../controllers/enrollmentController.js";

const router = express.Router();

// ✅ Correct endpoints
router.get("/", getAllEnrollments);
router.post("/", addEnrollment);

export default router;
