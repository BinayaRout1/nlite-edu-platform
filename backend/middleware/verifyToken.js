import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.admin_token;

  if (!token) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    console.error("❌ Invalid or expired token:", err.message);
    res.clearCookie("admin_token", { httpOnly: true, sameSite: "lax" });
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
};
