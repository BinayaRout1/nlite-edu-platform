import db from "../config/db.js";

// ========== Get all curriculum enrollments ==========
export const getCurriculum = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM curriculum ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching curriculum:", err);
    res
      .status(500)
      .json({ message: "Error fetching curriculum", error: err.message });
  }
};

// ========== Save curriculum download ==========
export const saveCurriculum = async (req, res) => {
  try {
    const { name, phone, email, course } = req.body;

    if (!name || !email || !course) {
      return res
        .status(400)
        .json({ message: "Name, email, and course are required." });
    }

    // 🕓 Store the current date/time
    const currentDateTime = new Date();

    const sql = `
      INSERT INTO curriculum (name, phone, email, course, datetime)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(sql, [name, phone, email, course, currentDateTime]);

    res
      .status(201)
      .json({ message: "✅ Curriculum download saved successfully." });
  } catch (err) {
    console.error("❌ Error saving curriculum:", err);
    res
      .status(500)
      .json({ message: "Error saving curriculum", error: err.message });
  }
};
