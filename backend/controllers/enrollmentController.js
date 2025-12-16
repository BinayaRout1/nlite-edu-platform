import db from "../config/db.js"; // your MySQL connection

// ✅ Get all enrollments
export const getAllEnrollments = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM enrollments ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching enrollments:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Add new enrollment
export const addEnrollment = async (req, res) => {
  try {
    const { name, phone, email, status, course, datetime } = req.body;

    if (!name || !phone || !email || !course || !datetime) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // ✅ Convert datetime (MM/DD/YYYY → YYYY-MM-DD)
    const formattedDate = new Date(datetime);
    const mysqlDate = formattedDate.toISOString().split("T")[0];

    const sql = `
      INSERT INTO enrollments (name, phone, email, status, course, datetime)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [name, phone, email, status, course, mysqlDate]);

    res.status(201).json({ message: "Enrollment added successfully ✅" });
  } catch (err) {
    console.error("❌ Error adding enrollment:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
