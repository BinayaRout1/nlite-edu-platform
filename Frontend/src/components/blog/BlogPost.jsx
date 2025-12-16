import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./blogPost.css";
import { FaLinkedin, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import API from "../../api";
import { Box, CircularProgress, Typography } from "@mui/material";

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState(null);

  // -------- Fetch Single Blog ----------
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);
  // -------- Fetch Related Articles ----------
  useEffect(() => {
    const fetchRelated = async () => {
      setRelatedLoading(true);
      try {
        const res = await API.get(`/blogs`);
        const others = res.data.filter((b) => String(b.id) !== String(id));
        setRelated(others);
      } catch (err) {
        console.error("Error fetching related blogs:", err);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelated();
  }, [id]);

  const formatDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  const createMarkup = (html) => ({ __html: html });

  // Share URLs
  const pageUrl = window.location.href;
  const shareText = blog?.blogName || "Check out this article!";

  const linkedinShare = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    pageUrl
  )}&title=${encodeURIComponent(shareText)}`;

  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    pageUrl
  )}`;

  const twitterShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    pageUrl
  )}&text=${encodeURIComponent(shareText)}`;

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading article...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 6, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );

  if (!blog)
    return (
      <Box sx={{ p: 6, textAlign: "center" }}>
        <Typography variant="h6">Article not found.</Typography>
      </Box>
    );

  const heroImage = blog.image || "";
  const blogDate = blog.date ? formatDate(blog.date) : "";

  return (
    <div className="blogpost-main-bg">
      <div className="container-blogpost">
        <div className="blogpost-row">
          {/* LEFT CONTENT */}
          <div className="blogpost-col blogpost-col-8">
            {/* Top Banner Image */}
            <div className="blogpost-img-top-wrap">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={blog.blogName}
                  className="blogpost-img-top"
                />
              ) : (
                <div className="no-image">No image available</div>
              )}

              <div className="blogpost-blur-box">
                <div className="blogpost-ai-pill">
                  <span className="blogpost-ai-pill-dot"></span>
                  {blog.category || "Article"}
                </div>
                <div className="blogpost-banner-title">{blog.blogName}</div>

                {/* Removed 'min read' */}
                <div className="blogpost-banner-meta">{blogDate}</div>
              </div>
            </div>

            {/* Article Content */}
            <div className="blogpost-content">
              <div
                className="blogpost-article-body"
                dangerouslySetInnerHTML={createMarkup(blog.description || "")}
              />

              {/* Share Box */}
              <div className="blogpost-share-wide">
                <div className="blogpost-share-title">
                  Like what you see? Share with a friend.
                </div>
                <div className="blogpost-share-icons">
                  <a href={facebookShare} target="_blank">
                    <FaFacebookF />
                  </a>
                  <a href={twitterShare} target="_blank">
                    <FaXTwitter />
                  </a>
                  <a href={linkedinShare} target="_blank">
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="blogpost-col blogpost-col-4 blogpost-sticky-sidebar">
            {/* Share Box */}
            <div className="blogpost-share-box">
              <div className="blogpost-share-title">
                Share with your community!
              </div>
              <div className="blogpost-share-icons">
                <a href={facebookShare} target="_blank">
                  <FaFacebookF />
                </a>
                <a href={twitterShare} target="_blank">
                  <FaXTwitter />
                </a>
                <a href={linkedinShare} target="_blank">
                  <FaLinkedin />
                </a>
              </div>
            </div>

            {/* RELATED ARTICLES BOX WITH SCROLL */}
            <div className="related-sidebar-box">
              <h2 className="related-title">Related Articles</h2>

              <div className="related-scroll">
                {relatedLoading ? (
                  <div>Loading related...</div>
                ) : related.length > 0 ? (
                  related.map((r, i) => (
                    <div className="related-article-card" key={r.id || i}>
                      {r.image ? (
                        <img
                          src={r.image}
                          alt={r.blogName}
                          className="related-article-img"
                        />
                      ) : (
                        <div className="related-no-img"></div>
                      )}

                      <div className="related-info">
                        <Link to={`/blog/${r.id}`} className="related-link">
                          {r.blogName}
                        </Link>
                      </div>

                      <div
                        className="blogpost-ai-pill"
                        style={{ marginLeft: 6 }}
                      >
                        <span className="blogpost-ai-pill-dot"></span>
                        {r.category || "Article"}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No related articles found.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
