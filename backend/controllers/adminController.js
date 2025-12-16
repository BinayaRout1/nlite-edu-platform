import db from "../config/db.js";
import bcrypt from "bcryptjs";

/* ============================
   CHECK CURRENT PASSWORD ONLY
   ============================ */
export const checkAdminPassword = async (req, res) => {
  try {
    const { email, currentPassword } = req.body;

    const [rows] = await db.query("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.json({ valid: false });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    return res.json({ valid: isMatch });
  } catch (err) {
    console.error("Error checking password:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   UPDATE PASSWORD SECURELY
   ============================ */
export const updateAdminProfile = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    const [rows] = await db.query("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ message: "Invalid Credentials" });

    const admin = rows[0];

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE admin SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
};
