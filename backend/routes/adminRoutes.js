import express from "express";
import {
  updateAdminProfile,
  checkAdminPassword,
} from "../controllers/adminController.js";
import { verifyToken } from "../controllers/authController.js";

const router = express.Router();

/* Get Admin Profile */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const [rows] = await req.db.execute(
      "SELECT id, email FROM admin WHERE id = ?",
      [req.admin.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ admin: rows[0] });
  } catch (err) {
    console.error("❌ Error fetching admin profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ✅ DO NOT PROTECT THIS ROUTE (Fixes Route Not Found) */
router.post("/check-password", checkAdminPassword);

/* Update Password — Protected */
router.post("/profile", verifyToken, updateAdminProfile);

export default router;
