// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let db;

try {
  db = await mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "adminpanel",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log("✅ MySQL Database connected successfully!");
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
}

export default db;
