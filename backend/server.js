import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import crypto from "crypto";
import fs from "fs";
import morgan from "morgan";

import { blogSeoMiddleware } from "./middleware/seoMiddleware.js";
import db from "./config/db.js"; // ✅ REQUIRED FOR req.db

dotenv.config();

// ======================
// JWT Secret Setup
// ======================
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = crypto.randomBytes(64).toString("hex");
  console.log("⚠ No JWT_SECRET found — temporary key generated");
}

// ======================
// ES Module dirname
// ======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// Create Express App
// ======================
const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// LOGGING SETUP
// ======================
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const accessLogStream = fs.createWriteStream(path.join(logDir, "access.log"), {
  flags: "a",
});
const backendLogStream = fs.createWriteStream(
  path.join(logDir, "backend.log"),
  { flags: "a" }
);
const errorLogStream = fs.createWriteStream(path.join(logDir, "error.log"), {
  flags: "a",
});

// Morgan HTTP Access logging
app.use(morgan("combined", { stream: accessLogStream }));

// Console Log → backend.log
const originalLog = console.log;
console.log = (...args) => {
  const message = `[${new Date().toISOString()}] ${args.join(" ")}\n`;
  backendLogStream.write(message);
  originalLog(...args);
};

// Console Error → error.log
const originalError = console.error;
console.error = (...args) => {
  const message = `[${new Date().toISOString()}] ${args.join(" ")}\n`;
  errorLogStream.write(message);
  originalError(...args);
};

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(cookieParser());

// ✅ Make DB available to all routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://dev.nlite.in",
  "https://www.dev.nlite.in",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman, curl
      if (allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("❌ CORS Blocked: " + origin), false);
    },
    credentials: true,
  })
);

// ======================
// STATIC FILES
// ======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// ROUTES
// ======================
import enrollmentRoutes from "./routes/enrollRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import curriculumRoutes from "./routes/curriculumRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import logsRouter from "./routes/logs.js";
import { verifyToken } from "./controllers/authController.js";

app.use("/api/courses", courseRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/curriculum", curriculumRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); // ✅ your admin routes load correctly
app.use("/logs", logsRouter);

// ======================
// TEST PROTECTED ROUTE
// ======================
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "Protected route works", admin: req.admin });
});

// ======================
// SEO MIDDLEWARE
// ======================
app.get("/blog/:id", blogSeoMiddleware);

// ======================
// 404 Handler (MUST BE LAST)
// ======================
app.get("/", (req, res) => res.send("Server is running 🚀"));

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ======================
// ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📂 Uploads dir: ${path.join(__dirname, "uploads")}`);
});
