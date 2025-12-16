import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", (req, res) => {
  const type = req.query.type || "backend"; // backend, access, error

  const logPath = path.resolve(__dirname, `../logs/${type}.log`);

  fs.readFile(logPath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error reading log file", error: err.message });
    }
    res.json({ log: data });
  });
});

export default router;
