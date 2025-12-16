import db from "../config/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const blogSeoMiddleware = async (req, res, next) => {
  try {
    const blogId = req.params.id;

    // Fetch blog
    const [rows] = await db.query("SELECT * FROM blogs WHERE id=?", [blogId]);
    if (!rows.length) return next(); // let React handle 404

    const blog = rows[0];

    const title = blog.blogName || "Read Article";
    const desc =
      blog.description?.replace(/<[^>]*>/g, "")?.slice(0, 150) ||
      "Blog article";

    const imageUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/blogs/${blogId}/image`;
    const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />

        <title>${title}</title>
        <meta name="description" content="${desc}" />

        <!-- OG TAGS -->
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${desc}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="${url}" />
        <meta property="og:type" content="article" />

        <!-- TWITTER -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${desc}" />
        <meta name="twitter:image" content="${imageUrl}" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.jsx"></script>
      </body>
      </html>
    `;

    return res.status(200).send(html);
  } catch (err) {
    console.error("❌ SEO middleware error:", err);
    next(); // fallback to React frontend
  }
};
