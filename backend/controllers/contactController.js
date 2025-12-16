import db from "../config/db.js";

// ✅ Get all contacts
export const getContacts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM contact ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching contacts:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching contacts", error: err.message });
  }
};

// ✅ Add a new contact
export const addContact = async (req, res) => {
  try {
    const { name, phone, email, issue, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email and message are required!" });
    }

    const [result] = await db.query(
      `INSERT INTO contact (name, phone, email, issue, message, datetime)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, phone, email, issue, message]
    );

    res.status(200).json({
      message: "✅ Message submitted successfully!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error adding contact:", err.message);
    res
      .status(500)
      .json({ message: "Error adding contact", error: err.message });
  }
};
