import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * ===========================
 *  ADMIN LOGIN
 * ===========================
 */
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  console.log("🟢 Admin login attempt:", email);

  try {
    const [rows] = await db.execute("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      console.log("❌ Admin not found");
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("❌ Invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ===============================
    // ⚠ FIXED: COOKIE SETTINGS
    // ===============================
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // required for HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // FIXED
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Login successful. Token:", token.slice(0, 15) + "...");
    }

    return res.status(200).json({
      message: "Login successful",
      admin: { id: admin.id, email: admin.email },
    });
  } catch (err) {
    console.error("❌ Error in loginAdmin:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ===========================
 *  LOGOUT ADMIN
 * ===========================
 */
export const logoutAdmin = (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  return res.json({ message: "Logged out successfully" });
};

/**
 * ===========================
 *  VERIFY TOKEN (Middleware)
 * ===========================
 */
export const verifyToken = (req, res, next) => {
  const token = req.cookies?.admin_token;

  if (!token) {
    return res.status(401).json({
      message: "No token provided. Please log in.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    console.error("❌ Invalid or expired token:", err.message);

    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(401).json({
      message: "Session expired. Please log in again.",
    });
  }
};
