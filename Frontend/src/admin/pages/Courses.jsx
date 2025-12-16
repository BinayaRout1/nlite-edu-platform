// import React, { useEffect, useState } from "react";
// import { Pencil, Trash2 } from "lucide-react";
// import Swal from "sweetalert2";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Box,
//   Button,
//   Typography,
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

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [showModal, setShowModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);

//   //  Pagination + Sorting
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [order, setOrder] = useState(null);
//   const [orderBy, setOrderBy] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [formData, setFormData] = useState({
//     id: null,
//     name: "",
//     description: "",
//     status: "",
//     image: null,
//     document: null,
//     active: true,
//   });

//   //  Fetch all courses
//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const res = await API.get(`/courses`);
//       setCourses(res.data);
//       setFilteredCourses(res.data);
//     } catch (err) {
//       console.error("Error fetching courses:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   //  Search functionality
//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
//     const filtered = courses.filter(
//       (c) =>
//         c.name?.toLowerCase().includes(term) ||
//         c.description?.toLowerCase().includes(term) ||
//         c.status?.toLowerCase().includes(term)
//     );
//     setFilteredCourses(filtered);
//     setCurrentPage(1);
//   };

//   //  Sorting functionality (side-by-side arrows)
//   const handleSort = (property) => {
//     let newOrder = "asc";

//     if (orderBy === property && order === "asc") newOrder = "desc";
//     else if (orderBy === property && order === "desc") {
//       setOrder(null);
//       setOrderBy(null);
//       setFilteredCourses([...courses]);
//       return;
//     }

//     setOrder(newOrder);
//     setOrderBy(property);

//     const sorted = [...filteredCourses].sort((a, b) => {
//       if (a[property] < b[property]) return newOrder === "asc" ? -1 : 1;
//       if (a[property] > b[property]) return newOrder === "asc" ? 1 : -1;
//       return 0;
//     });
//     setFilteredCourses(sorted);
//   };

//   //  Pagination logic
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = filteredCourses.slice(indexOfFirstRow, indexOfLastRow);

//   const handlePageChange = (event, value) => setCurrentPage(value);
//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(event.target.value);
//     setCurrentPage(1);
//   };

//   //  Modal Logic (same as before)
//   const openModal = (course = null) => {
//     if (course) {
//       setEditMode(true);
//       setFormData({
//         id: course.id,
//         name: course.name,
//         description: course.description,
//         status: course.status,
//         image: null,
//         document: null,
//         active: course.active,
//       });
//     } else {
//       setEditMode(false);
//       setFormData({
//         id: null,
//         name: "",
//         description: "",
//         status: "",
//         image: null,
//         document: null,
//         active: true,
//       });
//     }
//     setShowModal(true);
//   };

//   const handleChange = (e) => {
//     const { name, type, files, value } = e.target;
//     if (type === "file") setFormData({ ...formData, [name]: files[0] });
//     else setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const form = new FormData();
//       form.append("name", formData.name);
//       form.append("description", formData.description);
//       form.append("status", formData.status);
//       form.append("active", formData.active);
//       if (formData.image) form.append("image", formData.image);
//       if (formData.document) form.append("document", formData.document);

//       if (editMode) {
//         await API.put(`/courses/${formData.id}`, form);
//         Swal.fire("✅ Success", "Course updated successfully!", "success");
//       } else {
//         await API.post(`/courses`, form);
//         Swal.fire("✅ Success", "Course added successfully!", "success");
//       }

//       setShowModal(false);
//       fetchCourses();
//     } catch (err) {
//       console.error("Error saving course:", err);
//       Swal.fire("❌ Error", "Failed to save course!", "error");
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: "This course will be permanently deleted.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//     });

//     if (confirm.isConfirmed) {
//       try {
//         await API.delete(`/courses/${id}`);
//         fetchCourses();
//         Swal.fire("Deleted!", "Course deleted successfully.", "success");
//       } catch (err) {
//         Swal.fire("❌ Error", "Failed to delete course!", "error");
//       }
//     }
//   };

//   const toggleActive = async (course) => {
//     try {
//       await API.put(`/courses/${course.id}`, {
//         ...course,
//         active: !course.active,
//       });
//       fetchCourses();
//       Swal.fire(
//         "Status Changed",
//         `Course ${course.active ? "Deactivated" : "Activated"} Successfully`,
//         "success"
//       );
//     } catch (err) {
//       Swal.fire("❌ Error", "Failed to update status!", "error");
//     }
//   };

//   const FILE_BASE_URL =
//     import.meta.env.VITE_FILE_URL || "http://localhost:5000/uploads";

//   const getFullUrl = (path) => {
//     if (!path) return null;

//     // Remove any accidental leading slash
//     if (path.startsWith("/")) path = path.slice(1);

//     // For course files (like PDFs)
//     if (!path.includes("courses/")) {
//       return `${FILE_BASE_URL}/courses/${path}`;
//     }

//     // For regular uploaded assets (images, etc.)
//     return `${FILE_BASE_URL}/${path}`;
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
//           Add New
//         </Button>
//       </Box>

//       <Card
//         sx={{ borderRadius: 3, boxShadow: "0 4px 24px rgba(21,41,68,0.08)" }}
//       >
//         <CardHeader
//           title="Courses List"
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
//           {/* Controls */}
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
//               placeholder="Search "
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

//           {/* Table */}
//           <TableContainer
//             component={Paper}
//             sx={{ borderRadius: 2, border: "1px solid #f0f0f0" }}
//           >
//             <Table sx={{ minWidth: 1200, tableLayout: "auto" }}>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#e3f1fd" }}>
//                   {[
//                     { id: "serial", label: "Serial No" },
//                     { id: "name", label: "Course Name" },
//                     { id: "description", label: "Description" },
//                     { id: "status", label: "Course Status" },
//                     { id: "image", label: "Image" },
//                     { id: "document", label: "Document" },
//                     { id: "active", label: "Active Status" },
//                     { id: "actions", label: "Actions" },
//                   ].map((col) => (
//                     <TableCell
//                       key={col.id}
//                       sx={{
//                         color: "#0d47a1",
//                         fontWeight: 600,
//                         fontSize: "1rem",
//                         borderBottom: "2px solid #bcdffb",
//                       }}
//                     >
//                       {["name", "description", "status"].includes(col.id) ? (
//                         <Box
//                           onClick={() => handleSort(col.id)}
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 0.5,
//                             cursor: "pointer",
//                             "&:hover": { color: "#1565c0" },
//                           }}
//                         >
//                           {col.label}
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             {orderBy === col.id && order === "asc" ? (
//                               <ArrowUpward
//                                 sx={{ fontSize: "1rem", color: "#1565c0" }}
//                               />
//                             ) : orderBy === col.id &&
//                               order === "desc" ? null : (
//                               <ArrowUpward
//                                 sx={{ fontSize: "1rem", color: "#b0b0b0" }}
//                               />
//                             )}

//                             {orderBy === col.id && order === "desc" ? (
//                               <ArrowDownward
//                                 sx={{
//                                   fontSize: "1rem",
//                                   color: "#1565c0",
//                                   ml: 0.2,
//                                 }}
//                               />
//                             ) : orderBy === col.id && order === "asc" ? null : (
//                               <ArrowDownward
//                                 sx={{
//                                   fontSize: "1rem",
//                                   color: "#b0b0b0",
//                                   ml: 0.2,
//                                 }}
//                               />
//                             )}
//                           </Box>
//                         </Box>
//                       ) : (
//                         col.label
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {currentRows.length > 0 ? (
//                   currentRows.map((course, index) => (
//                     <TableRow key={course.id} hover>
//                       <TableCell>
//                         {(currentPage - 1) * rowsPerPage + index + 1}
//                       </TableCell>
//                       <TableCell>{course.name}</TableCell>
//                       <TableCell sx={{ maxWidth: 250 }}>
//                         {course.description}
//                       </TableCell>
//                       <TableCell>{course.status}</TableCell>
//                       <TableCell>
//                         {course.image && (
//                           <img
//                             src={getFullUrl(course.image)}
//                             alt={course.name}
//                             width="80"
//                             height="50"
//                             style={{ objectFit: "cover", borderRadius: "6px" }}
//                           />
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         {course.document && (
//                           <a
//                             href={getFullUrl(course.document)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             View
//                           </a>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           size="small"
//                           variant={course.active ? "contained" : "outlined"}
//                           color={course.active ? "success" : "secondary"}
//                           onClick={() => toggleActive(course)}
//                         >
//                           {course.active ? "Active" : "Deactive"}
//                         </Button>
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           size="small"
//                           color="warning"
//                           sx={{ mr: 1 }}
//                           onClick={() => openModal(course)}
//                         >
//                           <Pencil size={16} />
//                         </Button>
//                         <Button
//                           size="small"
//                           color="error"
//                           onClick={() => handleDelete(course.id)}
//                         >
//                           <Trash2 size={16} />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       No courses found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Pagination */}
//           <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
//             <Pagination
//               count={Math.ceil(filteredCourses.length / rowsPerPage)}
//               page={currentPage}
//               onChange={handlePageChange}
//               color="primary"
//               shape="rounded"
//             />
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Modal (same as before) */}
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
//               {editMode ? "Edit Course" : "Add New Course"}
//             </Typography>
//             <form onSubmit={handleSubmit}>
//               <Box sx={{ mb: 2 }}>
//                 <label>Course Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="form-control"
//                   required
//                 />
//               </Box>
//               <Box sx={{ mb: 2 }}>
//                 <label>Description</label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   className="form-control"
//                   rows={3}
//                   required
//                 />
//               </Box>
//               <Box sx={{ mb: 2 }}>
//                 <label>Status</label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="form-control"
//                   required
//                 >
//                   <option value="">Select Status</option>
//                   <option value="Open">Open</option>
//                   <option value="Coming Soon">Coming Soon</option>
//                   <option value="Closed">Closed</option>
//                 </select>
//               </Box>
//               <Box sx={{ mb: 2 }}>
//                 <label>Course Image</label>
//                 <input
//                   type="file"
//                   name="image"
//                   accept="image/*"
//                   onChange={handleChange}
//                   className="form-control"
//                 />
//               </Box>
//               <Box sx={{ mb: 2 }}>
//                 <label>Course Document</label>
//                 <input
//                   type="file"
//                   name="document"
//                   accept="application/pdf"
//                   onChange={handleChange}
//                   className="form-control"
//                 />
//               </Box>
//               <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                 <Button
//                   variant="outlined"
//                   sx={{ mr: 2 }}
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" variant="contained">
//                   {editMode ? "Update" : "Add"}
//                 </Button>
//               </Box>
//             </form>
//           </Box>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default Courses;

import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Typography,
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

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Pagination + Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    status: "",
    image: null,
    document: null,
    active: true,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get(`/courses`);
      setCourses(res.data);
      setFilteredCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = courses.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        c.status?.toLowerCase().includes(term)
    );
    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

  // Sorting
  const handleSort = (property) => {
    let newOrder = "asc";

    if (orderBy === property && order === "asc") newOrder = "desc";
    else if (orderBy === property && order === "desc") {
      setOrder(null);
      setOrderBy(null);
      setFilteredCourses([...courses]);
      return;
    }

    setOrder(newOrder);
    setOrderBy(property);

    const sorted = [...filteredCourses].sort((a, b) => {
      if (a[property] < b[property]) return newOrder === "asc" ? -1 : 1;
      if (a[property] > b[property]) return newOrder === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredCourses(sorted);
  };

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredCourses.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (event, value) => setCurrentPage(value);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(1);
  };

  // Modal
  const openModal = (course = null) => {
    if (course) {
      setEditMode(true);
      setFormData({
        id: course.id,
        name: course.name,
        description: course.description,
        status: course.status,
        image: null,
        document: null,
        active: course.active,
      });
    } else {
      setEditMode(false);
      setFormData({
        id: null,
        name: "",
        description: "",
        status: "",
        image: null,
        document: null,
        active: true,
      });
    }
    setShowModal(true);
  };

  // Validation + File Handling
  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required validations
    if (!formData.name || !formData.description || !formData.status) {
      Swal.fire("Missing Fields", "Please fill all required fields!", "error");
      return;
    }

    if (!editMode && !formData.image) {
      Swal.fire("Required", "Course image is required!", "error");
      return;
    }

    if (!editMode && !formData.document) {
      Swal.fire("Required", "Course document is required!", "error");
      return;
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("status", formData.status);
      form.append("active", formData.active);
      if (formData.image) form.append("image", formData.image);
      if (formData.document) form.append("document", formData.document);

      if (editMode) {
        await API.put(`/courses/${formData.id}`, form);
        Swal.fire("Success", "Course updated successfully!", "success");
      } else {
        await API.post(`/courses`, form);
        Swal.fire("Success", "Course added successfully!", "success");
      }

      setShowModal(false);
      fetchCourses();
    } catch (err) {
      console.error("Error saving course:", err);
      Swal.fire("Error", "Failed to save course!", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This course will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      try {
        await API.delete(`/courses/${id}`);
        fetchCourses();
        Swal.fire("Deleted!", "Course deleted successfully.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete course!", "error");
      }
    }
  };

  const toggleActive = async (course) => {
    try {
      await API.put(`/courses/${course.id}`, {
        ...course,
        active: !course.active,
      });
      fetchCourses();
      Swal.fire(
        "Status Changed",
        `Course ${course.active ? "Deactivated" : "Activated"} Successfully`,
        "success"
      );
    } catch (err) {
      Swal.fire("Error", "Failed to update status!", "error");
    }
  };

  const FILE_BASE_URL =
    import.meta.env.VITE_FILE_URL || "http://localhost:5000/uploads";

  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("/")) path = path.slice(1);
    if (!path.includes("courses/")) {
      return `${FILE_BASE_URL}/courses/${path}`;
    }
    return `${FILE_BASE_URL}/${path}`;
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
      {/* Add Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button variant="contained" color="primary" onClick={() => openModal()}>
          Add New
        </Button>
      </Box>

      {/* Table */}
      <Card
        sx={{ borderRadius: 3, boxShadow: "0 4px 24px rgba(21,41,68,0.08)" }}
      >
        <CardHeader
          title="Courses List"
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
          {/* Filters */}
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

          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, border: "1px solid #f0f0f0" }}
          >
            <Table sx={{ minWidth: 1200, tableLayout: "fixed" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f1fd" }}>
                  {[
                    "Serial No",
                    "Course Name",
                    "Description",
                    "Status",
                    "Image",
                    "Document",
                    "Active",
                    "Actions",
                  ].map((head) => (
                    <TableCell
                      key={head}
                      sx={{
                        color: "#0d47a1",
                        fontWeight: 600,
                        fontSize: "1rem",
                        borderBottom: "2px solid #bcdffb",
                        whiteSpace: "normal",
                        wordBreak: "break-all",
                        overflowWrap: "break-word",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {currentRows.length > 0 ? (
                  currentRows.map((course, index) => (
                    <TableRow key={course.id} hover>
                      <TableCell sx={{ wordBreak: "break-all" }}>
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </TableCell>

                      <TableCell sx={{ wordBreak: "break-all" }}>
                        {course.name}
                      </TableCell>

                      <TableCell
                        sx={{
                          maxWidth: 250,
                          wordBreak: "break-all",
                          whiteSpace: "normal",
                        }}
                      >
                        {course.description}
                      </TableCell>

                      <TableCell sx={{ wordBreak: "break-all" }}>
                        {course.status}
                      </TableCell>

                      <TableCell>
                        {course.image && (
                          <img
                            src={getFullUrl(course.image)}
                            alt={course.name}
                            width="80"
                            height="50"
                            style={{ objectFit: "cover", borderRadius: "6px" }}
                          />
                        )}
                      </TableCell>

                      <TableCell>
                        {course.document && (
                          <a
                            href={getFullUrl(course.document)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ wordBreak: "break-all" }}
                          >
                            View
                          </a>
                        )}
                      </TableCell>

                      <TableCell>
                        <Button
                          size="small"
                          variant={course.active ? "contained" : "outlined"}
                          color={course.active ? "success" : "secondary"}
                          onClick={() => toggleActive(course)}
                        >
                          {course.active ? "Active" : "Deactive"}
                        </Button>
                      </TableCell>

                      <TableCell>
                        <Button
                          size="small"
                          color="warning"
                          sx={{ mr: 1 }}
                          onClick={() => openModal(course)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No courses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredCourses.length / rowsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Modal */}
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
              {editMode ? "Edit Course" : "Add New Course"}
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 2 }}>
                <label>Course Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  rows={3}
                  required
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Open">Open</option>
                  <option value="Coming Soon">Coming Soon</option>
                  <option value="Closed">Closed</option>
                </select>
              </Box>

              <Box sx={{ mb: 2 }}>
                <label>Course Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="form-control"
                  required={!editMode}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <label>Course Document (PDF)</label>
                <input
                  type="file"
                  name="document"
                  accept="application/pdf"
                  onChange={handleChange}
                  className="form-control"
                  required={!editMode}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  sx={{ mr: 2 }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  {editMode ? "Update" : "Add"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Courses;
