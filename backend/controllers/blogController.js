// // import db from "../config/db.js";
// // import multer from "multer";

// // // ========== MULTER (buffer upload) ==========
// // const storage = multer.memoryStorage();
// // export const upload = multer({ storage });

// // // ========== GET ALL BLOGS ==========
// // export const getBlogs = async (req, res) => {
// //   try {
// //     const [rows] = await db.query("SELECT * FROM blogs ORDER BY id DESC");

// //     // Convert BLOB → Base64 for frontend
// //     const blogs = rows.map((blog) => ({
// //       ...blog,
// //       image: blog.image
// //         ? `data:${blog.image_type};base64,${blog.image.toString("base64")}`
// //         : null,
// //     }));

// //     res.json(blogs);
// //   } catch (err) {
// //     console.error("❌ Error fetching blogs:", err);
// //     res.status(500).json({ message: "Error fetching blogs" });
// //   }
// // };

// // // ========== GET SINGLE BLOG ==========
// // export const getBlogById = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);

// //     if (rows.length === 0)
// //       return res.status(404).json({ message: "Blog not found" });

// //     const blog = {
// //       ...rows[0],
// //       image: rows[0].image
// //         ? `data:${rows[0].image_type};base64,${rows[0].image.toString(
// //             "base64"
// //           )}`
// //         : null,
// //     };

// //     res.json(blog);
// //   } catch (err) {
// //     console.error("❌ Error fetching blog:", err);
// //     res.status(500).json({ message: "Error fetching blog" });
// //   }
// // };

// // // ========== SERVE BLOG IMAGE (OG TAGS NEED THIS REAL URL) ==========
// // export const getBlogImage = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const [rows] = await db.query(
// //       "SELECT image, image_type FROM blogs WHERE id = ?",
// //       [id]
// //     );

// //     if (!rows.length || !rows[0].image) {
// //       return res.status(404).send("No image found");
// //     }

// //     res.set("Content-Type", rows[0].image_type);
// //     res.send(rows[0].image);
// //   } catch (err) {
// //     console.error("❌ Error fetching blog image:", err);
// //     res.status(500).send("Error fetching image");
// //   }
// // };

// // // ========== ADD BLOG ==========
// // export const addBlog = async (req, res) => {
// //   try {
// //     const { blogName, author, date, description } = req.body;
// //     const file = req.file;

// //     if (!blogName || !author || !date || !description)
// //       return res.status(400).json({ message: "All fields are required" });

// //     const imageBuffer = file ? file.buffer : null;
// //     const imageName = file ? file.originalname : null;
// //     const imageType = file ? file.mimetype : null;

// //     const sql = `
// //       INSERT INTO blogs
// //       (blogName, author, date, description, image, image_name, image_type, status)
// //       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
// //     `;

// //     await db.query(sql, [
// //       blogName,
// //       author,
// //       date,
// //       description,
// //       imageBuffer,
// //       imageName,
// //       imageType,
// //       "inactive",
// //     ]);

// //     res.status(201).json({ message: "✅ Blog added successfully!" });
// //   } catch (err) {
// //     console.error("❌ Error adding blog:", err);
// //     res.status(500).json({ message: "Error adding blog" });
// //   }
// // };

// // // ========== UPDATE BLOG ==========
// // export const updateBlog = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { blogName, author, date, description, status } = req.body;
// //     const file = req.file;

// //     if (!blogName || !author || !date || !description)
// //       return res.status(400).json({ message: "All fields are required" });

// //     let query, values;

// //     if (file) {
// //       query = `
// //         UPDATE blogs
// //         SET blogName=?, author=?, date=?, description=?, image=?, image_name=?, image_type=?, status=?
// //         WHERE id=?
// //       `;
// //       values = [
// //         blogName,
// //         author,
// //         date,
// //         description,
// //         file.buffer,
// //         file.originalname,
// //         file.mimetype,
// //         status || "inactive",
// //         id,
// //       ];
// //     } else {
// //       query = `
// //         UPDATE blogs
// //         SET blogName=?, author=?, date=?, description=?, status=?
// //         WHERE id=?
// //       `;
// //       values = [blogName, author, date, description, status || "inactive", id];
// //     }

// //     await db.query(query, values);

// //     res.json({ message: "✅ Blog updated successfully!" });
// //   } catch (err) {
// //     console.error("❌ Error updating blog:", err);
// //     res.status(500).json({ message: "Error updating blog" });
// //   }
// // };

// // // ========== DELETE BLOG ==========
// // export const deleteBlog = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     await db.query("DELETE FROM blogs WHERE id=?", [id]);

// //     res.json({ message: "🗑️ Blog deleted successfully!" });
// //   } catch (err) {
// //     console.error("❌ Error deleting blog:", err);
// //     res.status(500).json({ message: "Error deleting blog" });
// //   }
// // };

// // // ========== TOGGLE STATUS ==========
// // export const toggleBlogStatus = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const [rows] = await db.query("SELECT status FROM blogs WHERE id=?", [id]);

// //     if (!rows.length)
// //       return res.status(404).json({ message: "Blog not found" });

// //     const currentStatus = rows[0].status;
// //     const newStatus = currentStatus === "active" ? "inactive" : "active";

// //     await db.query("UPDATE blogs SET status=? WHERE id=?", [newStatus, id]);

// //     res.json({
// //       message: `✅ Blog status changed to ${newStatus}`,
// //       status: newStatus,
// //     });
// //   } catch (err) {
// //     console.error("❌ Error toggling blog status:", err);
// //     res.status(500).json({ message: "Error toggling blog status" });
// //   }
// // };

// import db from "../config/db.js";
// import multer from "multer";

// // ========== MULTER (buffer upload) ==========
// const storage = multer.memoryStorage();
// export const upload = multer({ storage });

// // ========== GET ALL BLOGS ==========
// export const getBlogs = async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM blogs ORDER BY id DESC");

//     const blogs = rows.map((blog) => ({
//       ...blog,
//       image: blog.image
//         ? `data:${blog.image_type};base64,${blog.image.toString("base64")}`
//         : null,
//     }));

//     res.json(blogs);
//   } catch (err) {
//     console.error("❌ Error fetching blogs:", err);
//     res.status(500).json({ message: "Error fetching blogs" });
//   }
// };

// // ========== GET SINGLE BLOG ==========
// export const getBlogById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);

//     if (rows.length === 0)
//       return res.status(404).json({ message: "Blog not found" });

//     const blog = {
//       ...rows[0],
//       image: rows[0].image
//         ? `data:${rows[0].image_type};base64,${rows[0].image.toString(
//             "base64"
//           )}`
//         : null,
//     };

//     res.json(blog);
//   } catch (err) {
//     console.error("❌ Error fetching blog:", err);
//     res.status(500).json({ message: "Error fetching blog" });
//   }
// };

// // ========== GET BLOG IMAGE ==========
// export const getBlogImage = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const [rows] = await db.query(
//       "SELECT image, image_type FROM blogs WHERE id = ?",
//       [id]
//     );

//     if (!rows.length || !rows[0].image) {
//       return res.status(404).send("No image found");
//     }

//     res.set("Content-Type", rows[0].image_type);
//     res.send(rows[0].image);
//   } catch (err) {
//     console.error("❌ Error fetching blog image:", err);
//     res.status(500).send("Error fetching image");
//   }
// };

// // ========== ADD BLOG ==========
// export const addBlog = async (req, res) => {
//   try {
//     console.log("📥 Incoming Blog:", req.body);
//     console.log("📸 Incoming File:", req.file);

//     const { blogName, author, date, description } = req.body;
//     const file = req.file;

//     // 🔥 Convert DD-MM-YYYY → YYYY-MM-DD
//     const formattedDate = date.includes("-")
//       ? date.split("-").reverse().join("-")
//       : date;

//     if (!blogName || !author || !date || !description)
//       return res.status(400).json({ message: "All fields are required" });

//     const imageBuffer = file ? file.buffer : null;
//     const imageName = file ? file.originalname : null;
//     const imageType = file ? file.mimetype : null;

//     const sql = `
//       INSERT INTO blogs
//       (blogName, author, date, description, image, image_name, image_type, status)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     await db.query(sql, [
//       blogName,
//       author,
//       formattedDate, // <-- FIXED DATE HERE
//       description,
//       imageBuffer,
//       imageName,
//       imageType,
//       "inactive",
//     ]);

//     res.status(201).json({ message: "✅ Blog added successfully!" });
//   } catch (err) {
//     console.error("❌ Error adding blog:", err.sqlMessage || err.message);
//     res.status(500).json({
//       message: "Error adding blog",
//       error: err.sqlMessage,
//     });
//   }
// };

// // ========== UPDATE BLOG ==========
// export const updateBlog = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { blogName, author, date, description, status } = req.body;
//     const file = req.file;

//     // 🔥 Convert date again for update
//     const formattedDate = date.includes("-")
//       ? date.split("-").reverse().join("-")
//       : date;

//     if (!blogName || !author || !date || !description)
//       return res.status(400).json({ message: "All fields are required" });

//     let query, values;

//     if (file) {
//       query = `
//         UPDATE blogs
//         SET blogName=?, author=?, date=?, description=?, image=?, image_name=?, image_type=?, status=?
//         WHERE id=?
//       `;
//       values = [
//         blogName,
//         author,
//         formattedDate,
//         description,
//         file.buffer,
//         file.originalname,
//         file.mimetype,
//         status || "inactive",
//         id,
//       ];
//     } else {
//       query = `
//         UPDATE blogs
//         SET blogName=?, author=?, date=?, description=?, status=?
//         WHERE id=?
//       `;
//       values = [
//         blogName,
//         author,
//         formattedDate,
//         description,
//         status || "inactive",
//         id,
//       ];
//     }

//     await db.query(query, values);

//     res.json({ message: "✅ Blog updated successfully!" });
//   } catch (err) {
//     console.error("❌ Error updating blog:", err);
//     res.status(500).json({ message: "Error updating blog" });
//   }
// };

// // ========== DELETE BLOG ==========
// export const deleteBlog = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await db.query("DELETE FROM blogs WHERE id=?", [id]);

//     res.json({ message: "🗑️ Blog deleted successfully!" });
//   } catch (err) {
//     console.error("❌ Error deleting blog:", err);
//     res.status(500).json({ message: "Error deleting blog" });
//   }
// };

// // ========== TOGGLE BLOG STATUS ==========
// export const toggleBlogStatus = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const [rows] = await db.query("SELECT status FROM blogs WHERE id=?", [id]);

//     if (!rows.length)
//       return res.status(404).json({ message: "Blog not found" });

//     const currentStatus = rows[0].status;
//     const newStatus = currentStatus === "active" ? "inactive" : "active";

//     await db.query("UPDATE blogs SET status=? WHERE id=?", [newStatus, id]);

//     res.json({
//       message: `✅ Status changed to ${newStatus}`,
//       status: newStatus,
//     });
//   } catch (err) {
//     console.error("❌ Error toggling status:", err);
//     res.status(500).json({ message: "Error toggling blog status" });
//   }
// };

import db from "../config/db.js";
import multer from "multer";

// ========== MULTER (buffer upload) ==========
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// ========== FIX DATE (SAFE) ==========
const fixDate = (dateVal) => {
  if (!dateVal) return new Date().toISOString().slice(0, 10);

  const d = String(dateVal).trim(); // IMPORTANT FIX

  // DD-MM-YYYY → YYYY-MM-DD
  if (/^\d{2}-\d{2}-\d{4}$/.test(d)) {
    const [dd, mm, yyyy] = d.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;

  // Fallback
  return new Date(d).toISOString().slice(0, 10);
};

// ========== GET ALL BLOGS ==========
export const getBlogs = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM blogs ORDER BY id DESC");

    const blogs = rows.map((blog) => ({
      ...blog,
      image: blog.image
        ? `data:${blog.image_type};base64,${blog.image.toString("base64")}`
        : null,
    }));

    res.json(blogs);
  } catch (err) {
    console.error("❌ Error fetching blogs:", err);
    res.status(500).json({ message: "Error fetching blogs" });
  }
};

// ========== GET SINGLE BLOG ==========
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);

    if (!rows.length)
      return res.status(404).json({ message: "Blog not found" });

    const blog = {
      ...rows[0],
      image: rows[0].image
        ? `data:${rows[0].image_type};base64,${rows[0].image.toString(
            "base64"
          )}`
        : null,
    };

    res.json(blog);
  } catch (err) {
    console.error("❌ Error fetching blog:", err);
    res.status(500).json({ message: "Error fetching blog" });
  }
};

// ========== GET BLOG IMAGE ==========
export const getBlogImage = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT image, image_type FROM blogs WHERE id = ?",
      [id]
    );

    if (!rows.length || !rows[0].image) {
      return res.status(404).send("No image found");
    }

    res.set("Content-Type", rows[0].image_type);
    res.send(rows[0].image);
  } catch (err) {
    console.error("❌ Error fetching blog image:", err);
    res.status(500).send("Error fetching image");
  }
};

// ========== ADD BLOG ==========
export const addBlog = async (req, res) => {
  try {
    console.log("📥 BODY:", req.body);
    console.log("📸 FILE:", req.file);

    let { blogName, author, date, description } = req.body;
    const file = req.file;

    if (!blogName || !author || !description)
      return res.status(400).json({ message: "All fields are required" });

    // IMPORTANT FIX (no error)
    const finalDate = fixDate(date);

    const sql = `
      INSERT INTO blogs
      (blogName, author, date, description, image, image_name, image_type, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'inactive')
    `;

    await db.query(sql, [
      blogName,
      author,
      finalDate,
      description,
      file ? file.buffer : null,
      file ? file.originalname : null,
      file ? file.mimetype : null,
    ]);

    res.status(201).json({ message: "✅ Blog added successfully!" });
  } catch (err) {
    console.error("❌ Error adding blog:", err.sqlMessage || err.message);
    res.status(500).json({
      message: "Error adding blog",
      error: err.sqlMessage,
    });
  }
};

// ========== UPDATE BLOG ==========
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    let { blogName, author, date, description, status } = req.body;
    const file = req.file;

    if (!blogName || !author || !description)
      return res.status(400).json({ message: "All fields are required" });

    const finalDate = fixDate(date);

    let query, values;

    if (file) {
      query = `
        UPDATE blogs
        SET blogName=?, author=?, date=?, description=?, image=?, image_name=?, image_type=?, status=?
        WHERE id=?
      `;
      values = [
        blogName,
        author,
        finalDate,
        description,
        file.buffer,
        file.originalname,
        file.mimetype,
        status || "inactive",
        id,
      ];
    } else {
      query = `
        UPDATE blogs
        SET blogName=?, author=?, date=?, description=?, status=?
        WHERE id=?
      `;
      values = [
        blogName,
        author,
        finalDate,
        description,
        status || "inactive",
        id,
      ];
    }

    await db.query(query, values);

    res.json({ message: "✅ Blog updated successfully!" });
  } catch (err) {
    console.error("❌ Error updating blog:", err);
    res.status(500).json({ message: "Error updating blog" });
  }
};

// ========== DELETE BLOG ==========
export const deleteBlog = async (req, res) => {
  try {
    await db.query("DELETE FROM blogs WHERE id=?", [req.params.id]);

    res.json({ message: "🗑️ Blog deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting blog:", err);
    res.status(500).json({ message: "Error deleting blog" });
  }
};

// ========== TOGGLE STATUS ==========
export const toggleBlogStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT status FROM blogs WHERE id=?", [id]);

    if (!rows.length)
      return res.status(404).json({ message: "Blog not found" });

    const currentStatus = rows[0].status;
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    await db.query("UPDATE blogs SET status=? WHERE id=?", [newStatus, id]);

    res.json({
      message: `✅ Status changed to ${newStatus}`,
      status: newStatus,
    });
  } catch (err) {
    console.error("❌ Error toggling status:", err);
    res.status(500).json({ message: "Error toggling blog status" });
  }
};
