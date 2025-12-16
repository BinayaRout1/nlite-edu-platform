import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardHeader,
  CardContent,
  TextField,
  MenuItem,
  Pagination,
  InputAdornment,
  Select,
  FormControl,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import API from "../../api";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    blogName: "",
    author: "",
    date: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Fetch Blogs
  const fetchBlogs = async () => {
    try {
      const res = await API.get("/blogs");
      setBlogs(res.data);
      setFilteredBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      Swal.fire("❌ Error", "Failed to fetch blogs!", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = blogs.filter(
      (b) =>
        b.blogName?.toLowerCase().includes(term) ||
        b.author?.toLowerCase().includes(term) ||
        b.description?.toLowerCase().includes(term) ||
        b.status?.toLowerCase().includes(term)
    );
    setFilteredBlogs(filtered);
    setCurrentPage(1);
  };

  // ✅ Sorting (with custom arrow UI)
  const handleSort = (property) => {
    let newOrder = "asc";

    if (orderBy === property && order === "asc") newOrder = "desc";
    else if (orderBy === property && order === "desc") {
      setOrder(null);
      setOrderBy(null);
      setFilteredBlogs([...blogs]);
      return;
    }

    setOrder(newOrder);
    setOrderBy(property);

    const sorted = [...filteredBlogs].sort((a, b) => {
      if (a[property] < b[property]) return newOrder === "asc" ? -1 : 1;
      if (a[property] > b[property]) return newOrder === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredBlogs(sorted);
  };

  // ✅ Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredBlogs.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (e, value) => setCurrentPage(value);
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(e.target.value);
    setCurrentPage(1);
  };

  // ✅ Open Modal (Add/Edit)
  const openModal = (blog = null) => {
    if (blog) {
      setEditMode(true);
      setSelectedBlog(blog);
      setFormData({
        blogName: blog.blogName,
        author: blog.author || "",
        date: blog.date ? blog.date.split("T")[0] : "",
        description: blog.description || "",
        image: null,
      });
    } else {
      setEditMode(false);
      setFormData({
        blogName: "",
        author: "",
        date: "",
        description: "",
        image: null,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    setFormData({ ...formData, [name]: type === "file" ? files[0] : value });
  };

  // ✅ Create or Edit
  const handleCreateOrEdit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });

      if (editMode) {
        await API.put(`/blogs/${selectedBlog.id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("✅ Success", "Blog updated successfully!", "success");
      } else {
        await API.post(`/blogs`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("✅ Success", "Blog created successfully!", "success");
      }

      fetchBlogs();
      closeModal();
    } catch (error) {
      console.error("Error saving blog:", error);
      Swal.fire("❌ Error", "Failed to save blog!", "error");
    }
  };

  // ✅ Delete Blog
  const handleDelete = async (blog) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Delete blog "${blog.blogName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      try {
        await API.delete(`/blogs/${blog.id}`);
        fetchBlogs();
        Swal.fire("Deleted!", "Blog deleted successfully!", "success");
      } catch (err) {
        Swal.fire("❌ Error", "Failed to delete blog!", "error");
      }
    }
  };

  // ✅ Toggle Active/Deactivate
  const toggleStatus = async (blog) => {
    try {
      await API.patch(`/blogs/${blog.id}/status`);
      fetchBlogs();
      Swal.fire(
        "Status Changed",
        `Blog ${
          blog.status === "active" ? "Deactivated" : "Activated"
        } Successfully`,
        "success"
      );
    } catch (err) {
      Swal.fire("❌ Error", "Failed to update status!", "error");
    }
  };

  // ✅ View Image
  const handleViewImage = (blog) => {
    if (blog.image) setImagePreview(blog.image);
    else Swal.fire("Info", "No image available for this blog.", "info");
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        pt: 4,
        pb: 6,
        bgcolor: "#f7fafd",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button variant="contained" color="primary" onClick={() => openModal()}>
          CREATE BLOG
        </Button>
      </Box>

      <Card
        sx={{ borderRadius: 3, boxShadow: "0 4px 24px rgba(21,41,68,0.08)" }}
      >
        <CardHeader
          title="Blog List"
          sx={{
            background: "#1565c0",
            color: "#fff",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            py: 2,
            px: 3,
          }}
        />

        <CardContent sx={{ p: 3 }}>
          {/* 🔹 Controls */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <FormControl sx={{ minWidth: 160 }}>
              <Select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                size="small"
              >
                <MenuItem value={10}>Rows: 10</MenuItem>
                <MenuItem value={20}>Rows: 20</MenuItem>
                <MenuItem value={50}>Rows: 50</MenuItem>
              </Select>
            </FormControl>

            <TextField
              variant="outlined"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              size="small"
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* 🧾 Blog Table */}
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, border: "1px solid #f0f0f0" }}
          >
            <Table sx={{ minWidth: 1200, tableLayout: "auto" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f1fd" }}>
                  {[
                    { id: "sno", label: "S.No" },
                    { id: "blogName", label: "Blog Name" },
                    { id: "author", label: "Author" },
                    { id: "date", label: "Date" },
                    { id: "description", label: "Description" },
                    { id: "image", label: "Image" },
                    { id: "status", label: "Status" },
                    { id: "actions", label: "Actions" },
                  ].map((col) => (
                    <TableCell
                      key={col.id}
                      sx={{
                        color: "#0d47a1",
                        fontWeight: 600,
                        fontSize: "1rem",
                        borderBottom: "2px solid #bcdffb",
                      }}
                    >
                      {["blogName", "author", "date", "description"].includes(
                        col.id
                      ) ? (
                        <Box
                          onClick={() => handleSort(col.id)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            cursor: "pointer",
                            "&:hover": { color: "#1565c0" },
                          }}
                        >
                          {col.label}
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {orderBy === col.id && order === "asc" ? (
                              <ArrowUpward
                                sx={{ fontSize: "1rem", color: "#1565c0" }}
                              />
                            ) : orderBy === col.id &&
                              order === "desc" ? null : (
                              <ArrowUpward
                                sx={{ fontSize: "1rem", color: "#b0b0b0" }}
                              />
                            )}

                            {orderBy === col.id && order === "desc" ? (
                              <ArrowDownward
                                sx={{
                                  fontSize: "1rem",
                                  color: "#1565c0",
                                  ml: 0.2,
                                }}
                              />
                            ) : orderBy === col.id && order === "asc" ? null : (
                              <ArrowDownward
                                sx={{
                                  fontSize: "1rem",
                                  color: "#b0b0b0",
                                  ml: 0.2,
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      ) : (
                        col.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.length > 0 ? (
                  currentRows.map((blog, index) => (
                    <TableRow key={blog.id} hover>
                      <TableCell>
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{blog.blogName}</TableCell>
                      <TableCell>{blog.author}</TableCell>
                      <TableCell>
                        {blog.date ? blog.date.split("T")[0] : ""}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 250 }}>
                        {blog.description}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleViewImage(blog)}
                          color="info"
                          size="small"
                        >
                          <Eye size={18} />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant={
                            blog.status === "active" ? "contained" : "outlined"
                          }
                          color={
                            blog.status === "active" ? "success" : "secondary"
                          }
                          onClick={() => toggleStatus(blog)}
                        >
                          {blog.status === "active" ? "Active" : "Deactivated"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          color="warning"
                          sx={{ mr: 1 }}
                          onClick={() => openModal(blog)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDelete(blog)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No blogs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredBlogs.length / rowsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        </CardContent>
      </Card>

      {/* 📷 Image Viewer */}
      {imagePreview && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
          onClick={() => setImagePreview(null)}
        >
          <img
            src={imagePreview}
            alt="Blog Preview"
            style={{
              maxWidth: "80%",
              maxHeight: "80%",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(255,255,255,0.3)",
            }}
          />
        </Box>
      )}

      {/* 📝 Add/Edit Modal (same logic preserved) */}
      {showModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1200,
            p: 2,
          }}
        >
          <Box
            sx={{
              background: "#fff",
              p: 4,
              borderRadius: 3,
              width: "100%",
              maxWidth: 500,
              boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 3, fontWeight: 600, textAlign: "center" }}
            >
              {editMode ? "Edit Blog" : "Create Blog"}
            </Typography>

            <form onSubmit={handleCreateOrEdit}>
              <Box sx={{ mb: 2 }}>
                <label>Blog Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="blogName"
                  value={formData.blogName}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <label>Author</label>
                <input
                  type="text"
                  className="form-control"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <label>Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  name="image"
                  onChange={handleChange}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="outlined" sx={{ mr: 2 }} onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  {editMode ? "Save Changes" : "Create"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Blog;

// import React, { useState, useEffect } from "react";
// import { Pencil, Trash2, Eye } from "lucide-react";
// import Swal from "sweetalert2";
// import {
//   Box,
//   Button,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Card,
//   CardHeader,
//   CardContent,
//   TextField,
//   MenuItem,
//   Pagination,
//   InputAdornment,
//   Select,
//   FormControl,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
// import API from "../../api";

// const Blog = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [filteredBlogs, setFilteredBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [order, setOrder] = useState(null);
//   const [orderBy, setOrderBy] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [selectedBlog, setSelectedBlog] = useState(null);

//   const [formData, setFormData] = useState({
//     blogName: "",
//     author: "",
//     description: "",
//     image: null,
//   });

//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//   const fetchBlogs = async () => {
//     try {
//       const res = await API.get("/blogs");
//       setBlogs(res.data);
//       setFilteredBlogs(res.data);
//     } catch (err) {
//       console.error("Error fetching blogs:", err);
//       Swal.fire("❌ Error", "Failed to fetch blogs!", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ⭐ FORMAT DATE FROM BACKEND (UTC → DD-MM-YYYY)
//   const formatDate = (dateString) => {
//     if (!dateString) return "";

//     const date = new Date(dateString); // auto fixes UTC offset
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();

//     return `${day}-${month}-${year}`;
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
//     const filtered = blogs.filter(
//       (b) =>
//         b.blogName?.toLowerCase().includes(term) ||
//         b.author?.toLowerCase().includes(term) ||
//         b.description?.toLowerCase().includes(term) ||
//         b.status?.toLowerCase().includes(term)
//     );
//     setFilteredBlogs(filtered);
//     setCurrentPage(1);
//   };

//   const handleSort = (property) => {
//     let newOrder = "asc";

//     if (orderBy === property && order === "asc") newOrder = "desc";
//     else if (orderBy === property && order === "desc") {
//       setOrder(null);
//       setOrderBy(null);
//       setFilteredBlogs([...blogs]);
//       return;
//     }

//     setOrder(newOrder);
//     setOrderBy(property);

//     const sorted = [...filteredBlogs].sort((a, b) => {
//       if (a[property] < b[property]) return newOrder === "asc" ? -1 : 1;
//       if (a[property] > b[property]) return newOrder === "asc" ? 1 : -1;
//       return 0;
//     });
//     setFilteredBlogs(sorted);
//   };

//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = filteredBlogs.slice(indexOfFirstRow, indexOfLastRow);

//   const handlePageChange = (e, value) => setCurrentPage(value);
//   const handleRowsPerPageChange = (e) => {
//     setRowsPerPage(e.target.value);
//     setCurrentPage(1);
//   };

//   const openModal = (blog = null) => {
//     if (blog) {
//       setEditMode(true);
//       setSelectedBlog(blog);
//       setFormData({
//         blogName: blog.blogName,
//         author: blog.author || "",
//         description: blog.description || "",
//         image: null,
//       });
//     } else {
//       setEditMode(false);
//       setFormData({
//         blogName: "",
//         author: "",
//         description: "",
//         image: null,
//       });
//     }
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedBlog(null);
//   };

//   // ⭐ Author only letters | Image validation
//   const handleChange = (e) => {
//     const { name, type, files, value } = e.target;

//     // AUTHOR VALIDATION
//     if (name === "author") {
//       const onlyLetters = /^[A-Za-z\s]+$/;
//       if (value === "" || onlyLetters.test(value)) {
//         setFormData({ ...formData, author: value });
//       }
//       return;
//     }

//     // IMAGE VALIDATION
//     if (name === "image") {
//       const file = files[0];
//       const allowed = [
//         "image/jpeg",
//         "image/jpg",
//         "image/png",
//         "image/svg+xml",
//         "image/webp",
//       ];

//       if (!file) return;

//       if (!allowed.includes(file.type)) {
//         Swal.fire(
//           "Invalid Image",
//           "Only JPG, JPEG, PNG, SVG, WEBP files are allowed!",
//           "error"
//         );
//         return;
//       }

//       setFormData({ ...formData, image: file });
//       return;
//     }

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleCreateOrEdit = async (e) => {
//     e.preventDefault();

//     // REQUIRED VALIDATION
//     if (!formData.blogName || !formData.author || !formData.description) {
//       Swal.fire("Missing Fields", "Please fill all required fields!", "error");
//       return;
//     }

//     // Image required only on CREATE
//     if (!editMode && !formData.image) {
//       Swal.fire("Image Required", "Please upload an image!", "error");
//       return;
//     }

//     try {
//       const form = new FormData();

//       Object.entries(formData).forEach(([key, value]) => {
//         if (value) form.append(key, value);
//       });

//       // ⭐AUTO DATE (DD-MM-YYYY)
//       if (!editMode) {
//         const d = new Date();
//         const today =
//           String(d.getDate()).padStart(2, "0") +
//           "-" +
//           String(d.getMonth() + 1).padStart(2, "0") +
//           "-" +
//           d.getFullYear();

//         form.append("date", today);
//       }

//       if (editMode) {
//         await API.put(`/blogs/${selectedBlog.id}`, form, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         Swal.fire("✅ Success", "Blog updated successfully!", "success");
//       } else {
//         await API.post(`/blogs`, form, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         Swal.fire("✅ Success", "Blog created successfully!", "success");
//       }

//       fetchBlogs();
//       closeModal();
//     } catch (err) {
//       console.error("Error saving blog:", err);
//       Swal.fire("❌ Error", "Failed to save blog!", "error");
//     }
//   };

//   const handleDelete = async (blog) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: `Delete blog "${blog.blogName}"?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonColor: "#d33",
//       confirmButtonColor: "#3085d6",
//     });

//     if (confirm.isConfirmed) {
//       try {
//         await API.delete(`/blogs/${blog.id}`);
//         fetchBlogs();
//         Swal.fire("Deleted!", "Blog deleted successfully!", "success");
//       } catch (err) {
//         Swal.fire("❌ Error", "Failed to delete blog!", "error");
//       }
//     }
//   };

//   const toggleStatus = async (blog) => {
//     try {
//       await API.patch(`/blogs/${blog.id}/status`);
//       fetchBlogs();
//       Swal.fire(
//         "Status Changed",
//         `Blog ${
//           blog.status === "active" ? "Deactivated" : "Activated"
//         } Successfully`,
//         "success"
//       );
//     } catch (err) {
//       Swal.fire("❌ Error", "Failed to update status!", "error");
//     }
//   };

//   const handleViewImage = (blog) => {
//     if (blog.image) setImagePreview(blog.image);
//     else Swal.fire("Info", "No image available for this blog.", "info");
//   };

//   return (
//     <Box
//       sx={{
//         px: { xs: 2, sm: 4, md: 6 },
//         pt: 4,
//         pb: 6,
//         bgcolor: "#f7fafd",
//         minHeight: "100vh",
//       }}
//     >
//       <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
//         <Button variant="contained" color="primary" onClick={() => openModal()}>
//           CREATE BLOG
//         </Button>
//       </Box>

//       <Card
//         sx={{ borderRadius: 3, boxShadow: "0 4px 24px rgba(21,41,68,0.08)" }}
//       >
//         <CardHeader
//           title="Blog List"
//           sx={{
//             background: "#1565c0",
//             color: "#fff",
//             borderTopLeftRadius: "12px",
//             borderTopRightRadius: "12px",
//             py: 2,
//             px: 3,
//           }}
//         />

//         <CardContent sx={{ p: 3 }}>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mb: 3,
//               flexWrap: "wrap",
//             }}
//           >
//             <FormControl sx={{ minWidth: 160 }}>
//               <Select
//                 value={rowsPerPage}
//                 onChange={handleRowsPerPageChange}
//                 size="small"
//               >
//                 <MenuItem value={10}>Rows: 10</MenuItem>
//                 <MenuItem value={20}>Rows: 20</MenuItem>
//                 <MenuItem value={50}>Rows: 50</MenuItem>
//               </Select>
//             </FormControl>

//             <TextField
//               variant="outlined"
//               placeholder="Search"
//               value={searchTerm}
//               onChange={handleSearch}
//               size="small"
//               sx={{ width: 300 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon color="action" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Box>

//           <TableContainer
//             component={Paper}
//             sx={{ borderRadius: 2, border: "1px solid #f0f0f0" }}
//           >
//             <Table
//               sx={{
//                 minWidth: 1200,
//                 tableLayout: "fixed",
//               }}
//             >
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#e3f1fd" }}>
//                   {[
//                     { id: "sno", label: "S.No" },
//                     { id: "blogName", label: "Blog Name" },
//                     { id: "author", label: "Author" },
//                     { id: "date", label: "Date" },
//                     { id: "description", label: "Description" },
//                     { id: "image", label: "Image" },
//                     { id: "status", label: "Status" },
//                     { id: "actions", label: "Actions" },
//                   ].map((col) => (
//                     <TableCell
//                       key={col.id}
//                       sx={{
//                         color: "#0d47a1",
//                         fontWeight: 600,
//                         fontSize: "1rem",
//                         borderBottom: "2px solid #bcdffb",
//                         whiteSpace: "normal",
//                         wordBreak: "break-all",
//                       }}
//                     >
//                       {col.label}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {currentRows.length > 0 ? (
//                   currentRows.map((blog, index) => (
//                     <TableRow key={blog.id} hover>
//                       <TableCell sx={{ wordBreak: "break-all" }}>
//                         {(currentPage - 1) * rowsPerPage + index + 1}
//                       </TableCell>

//                       <TableCell sx={{ wordBreak: "break-all" }}>
//                         {blog.blogName}
//                       </TableCell>

//                       <TableCell sx={{ wordBreak: "break-all" }}>
//                         {blog.author}
//                       </TableCell>

//                       <TableCell sx={{ wordBreak: "break-all" }}>
//                         {formatDate(blog.date)}
//                       </TableCell>

//                       <TableCell
//                         sx={{
//                           maxWidth: 250,
//                           whiteSpace: "normal",
//                           wordBreak: "break-all",
//                         }}
//                       >
//                         {blog.description}
//                       </TableCell>

//                       <TableCell>
//                         <Button
//                           onClick={() => handleViewImage(blog)}
//                           color="info"
//                           size="small"
//                         >
//                           <Eye size={18} />
//                         </Button>
//                       </TableCell>

//                       <TableCell>
//                         <Button
//                           size="small"
//                           variant={
//                             blog.status === "active" ? "contained" : "outlined"
//                           }
//                           color={
//                             blog.status === "active" ? "success" : "secondary"
//                           }
//                           onClick={() => toggleStatus(blog)}
//                         >
//                           {blog.status === "active" ? "Active" : "Deactivated"}
//                         </Button>
//                       </TableCell>

//                       <TableCell>
//                         <Button
//                           size="small"
//                           color="warning"
//                           sx={{ mr: 1 }}
//                           onClick={() => openModal(blog)}
//                         >
//                           <Pencil size={16} />
//                         </Button>

//                         <Button
//                           size="small"
//                           color="error"
//                           onClick={() => handleDelete(blog)}
//                         >
//                           <Trash2 size={16} />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       No blogs found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
//             <Pagination
//               count={Math.ceil(filteredBlogs.length / rowsPerPage)}
//               page={currentPage}
//               onChange={handlePageChange}
//               color="primary"
//               shape="rounded"
//             />
//           </Box>
//         </CardContent>
//       </Card>

//       {imagePreview && (
//         <Box
//           sx={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background: "rgba(0,0,0,0.7)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 2000,
//           }}
//           onClick={() => setImagePreview(null)}
//         >
//           <img
//             src={imagePreview}
//             alt="Blog Preview"
//             style={{
//               maxWidth: "80%",
//               maxHeight: "80%",
//               borderRadius: "10px",
//               boxShadow: "0 0 20px rgba(255,255,255,0.3)",
//             }}
//           />
//         </Box>
//       )}

//       {showModal && (
//         <Box
//           sx={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background: "rgba(0,0,0,0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1200,
//             p: 2,
//           }}
//         >
//           <Box
//             sx={{
//               background: "#fff",
//               p: 4,
//               borderRadius: 3,
//               width: "100%",
//               maxWidth: 500,
//               boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
//             }}
//           >
//             <Typography
//               variant="h6"
//               sx={{ mb: 3, fontWeight: 600, textAlign: "center" }}
//             >
//               {editMode ? "Edit Blog" : "Create Blog"}
//             </Typography>

//             <form onSubmit={handleCreateOrEdit}>
//               <Box sx={{ mb: 2 }}>
//                 <label>Blog Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="blogName"
//                   value={formData.blogName}
//                   onChange={handleChange}
//                   required
//                 />
//               </Box>

//               <Box sx={{ mb: 2 }}>
//                 <label>Author</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="author"
//                   value={formData.author}
//                   onChange={handleChange}
//                   required
//                 />
//               </Box>

//               <Box sx={{ mb: 2 }}>
//                 <label>Description</label>
//                 <textarea
//                   className="form-control"
//                   name="description"
//                   rows={3}
//                   value={formData.description}
//                   onChange={handleChange}
//                   required
//                 />
//               </Box>

//               <Box sx={{ mb: 2 }}>
//                 <label>Upload Image</label>
//                 <input
//                   type="file"
//                   className="form-control"
//                   accept="image/*"
//                   name="image"
//                   onChange={handleChange}
//                   required={!editMode}
//                 />
//               </Box>

//               <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                 <Button variant="outlined" sx={{ mr: 2 }} onClick={closeModal}>
//                   Cancel
//                 </Button>

//                 <Button type="submit" variant="contained">
//                   {editMode ? "Save Changes" : "Create"}
//                 </Button>
//               </Box>
//             </form>
//           </Box>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default Blog;
