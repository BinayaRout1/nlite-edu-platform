import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.admin_token ||
    (req.headers["authorization"]?.startsWith("Bearer ")
      ? req.headers["authorization"].split(" ")[1]
      : null);

  if (!token) {
    return res.status(403).json({ message: "Access denied. Token missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.admin = decoded;
    next();
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
