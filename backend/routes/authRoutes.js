import express from "express";
import { loginAdmin, logoutAdmin, verifyToken } from "../controllers/authController.js";

const router = express.Router();

// 🟢 Login route
router.post("/login", loginAdmin);

// 🔴 Logout route
router.post("/logout", logoutAdmin);

// 🟡 Example protected route (you can test)
router.get("/check-session", verifyToken, (req, res) => {
  res.json({ message: "Session active", admin: req.admin });
});

export default router;
