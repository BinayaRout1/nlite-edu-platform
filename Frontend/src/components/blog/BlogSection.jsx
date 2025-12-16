import React, { useEffect, useState } from "react";
import "./blogSection.css";
import { Link } from "react-router-dom";
import API from "../../api";
const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await API.get("/blogs");
        const data = response.data;
        const activeBlogs = data.filter((b) => b.status === "active");
        setBlogs(activeBlogs);
      } catch (error) {
        console.error("❌ Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((b) =>
    b.blogName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="blog-resources-bg">
      <div className="blog-head-top">Our Blog</div>
      <h1 className="blog-head-main">Resources and Insights</h1>
      <div className="blog-desc">
        The latest industry news, interviews, technologies, and resources.
      </div>

      <div className="blog-search-bar-wrap">
        <input
          type="text"
          className="blog-search-input"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="blog-card-grid">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div className="blog-card" key={blog.id}>
              {blog.image ? (
                <img
                  src={blog.image}
                  alt={blog.blogName}
                  className="blog-img"
                />
              ) : blog.image_name ? (
                <img
                  src={`${import.meta.env.VITE_FILE_URL}/${blog.image_name}`}
                  alt={blog.blogName}
                  className="blog-img"
                />
              ) : (
                <div className="blog-img-placeholder">No Image</div>
              )}

              <div className="blog-title-row">
                <h3 className="blog-card-title">
                  {blog.blogName}{" "}
                  <Link to={`/blog/${blog.id}`} className="blog-ext-link">
                    <span className="blog-ext">&#8599;</span>
                  </Link>
                </h3>
              </div>

              <div className="blog-card-desc">
                {blog.description.length > 150
                  ? blog.description.slice(0, 150) + "..."
                  : blog.description}
              </div>

              <div className="blog-card-profile">
                <div className="blog-card-author-wrap">
                  <span className="blog-card-author">{blog.author}</span>
                  <span className="blog-card-date">
                    {new Date(blog.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No active blogs available</p>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
