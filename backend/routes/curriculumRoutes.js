import express from "express";
import {
  getCurriculum,
  saveCurriculum,
} from "../controllers/curriculumController.js";

const router = express.Router();

router.get("/", getCurriculum);
router.post("/", saveCurriculum); // 🟢 Save download info

export default router;
