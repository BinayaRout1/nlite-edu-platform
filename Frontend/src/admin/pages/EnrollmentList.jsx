import React, { useState, useEffect } from "react";
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
  Typography,
  CircularProgress,
  Box,
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

const EnrollmentList = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting states
  const [order, setOrder] = useState(null);
  const [orderBy, setOrderBy] = useState(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await API.get(`/enrollments`);
      setEnrollments(response.data);
      setFilteredEnrollments(response.data);
    } catch (err) {
      setError("Failed to fetch enrollments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Search functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = enrollments.filter((row) => {
      return (
        row.name?.toLowerCase().includes(term) ||
        row.phone?.toLowerCase().includes(term) ||
        row.email?.toLowerCase().includes(term) ||
        row.course?.toLowerCase().includes(term) ||
        row.status?.toLowerCase().includes(term)
      );
    });

    setFilteredEnrollments(filtered);
    setCurrentPage(1);
  };

  // 🔽 Sorting logic
  const handleSort = (property) => {
    let newOrder = "asc";

    if (orderBy === property && order === "asc") newOrder = "desc";
    else if (orderBy === property && order === "desc") {
      // reset to neutral (show both arrows)
      setOrder(null);
      setOrderBy(null);
      setFilteredEnrollments([...enrollments]);
      return;
    }

    setOrder(newOrder);
    setOrderBy(property);

    const sortedData = [...filteredEnrollments].sort((a, b) => {
      if (a[property] < b[property]) return newOrder === "asc" ? -1 : 1;
      if (a[property] > b[property]) return newOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredEnrollments(sortedData);
  };

  // 🔢 Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredEnrollments.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const handlePageChange = (event, value) => setCurrentPage(value);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(1);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Enrollments...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Typography color="error" variant="h6" sx={{ p: 4 }}>
        {error}
      </Typography>
    );

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 4 },
        pt: { xs: 2, sm: 3, md: 4 },
        pb: 3,
        width: "100%",
        bgcolor: "#f7fafd",
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          width: "100%",
          borderRadius: 3,
          boxShadow: "0 4px 24px 4px rgba(21, 41, 68, 0.08)",
          background: "#fff",
        }}
      >
        <CardHeader
          title="Enrolled Users"
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
          {/* 🔹 Rows per page + Search bar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            {/* Rows per page */}
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

            {/* Search bar */}
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

          {/* 🧾 Table */}
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              border: "1px solid #f0f0f0",
            }}
          >
            <Table sx={{ minWidth: 1200 }} aria-label="enrollment table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f1fd" }}>
                  {[
                    { id: "id", label: "Serial No" },
                    { id: "name", label: "Name" },
                    { id: "phone", label: "Phone Number" },
                    { id: "email", label: "Email" },
                    { id: "course", label: "Course" },
                    { id: "status", label: "Status" },
                    { id: "datetime", label: "Date" },
                  ].map((col) => (
                    <TableCell
                      key={col.id}
                      sx={{
                        color: "#0d47a1",
                        fontWeight: 600,
                        fontSize: "1.03rem",
                        borderBottom: "2px solid #bcdffb",
                      }}
                    >
                      {col.id !== "id" ? (
                        <Box
                          onClick={() => handleSort(col.id)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: 0.5,
                            cursor: "pointer",
                            userSelect: "none",
                            "&:hover": { color: "#1565c0" },
                          }}
                        >
                          {col.label}
                          {/* Sort Arrows Side by Side */}
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {/* Ascending */}
                            {orderBy === col.id && order === "asc" ? (
                              <ArrowUpward
                                sx={{
                                  fontSize: "1rem",
                                  color: "#1565c0",
                                  ml: 0.3,
                                }}
                              />
                            ) : orderBy === col.id &&
                              order === "desc" ? null : (
                              <ArrowUpward
                                sx={{
                                  fontSize: "1rem",
                                  color: "#b0b0b0",
                                  ml: 0.3,
                                }}
                              />
                            )}

                            {/* Descending */}
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
                  currentRows.map((row, index) => (
                    <TableRow key={row.id || index} hover>
                      <TableCell>
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.course}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-block",
                            px: 2,
                            py: 0.3,
                            background:
                              row.status === "Looking for Job"
                                ? "#f8bbd0"
                                : row.status === "Working Professional"
                                ? "#c5e1a5"
                                : "#b3e5fc",
                            borderRadius: "10px",
                            fontWeight: 500,
                            fontSize: "0.98rem",
                          }}
                        >
                          {row.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(row.datetime).toLocaleDateString("en-GB")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No matching records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 📄 Pagination */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredEnrollments.length / rowsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EnrollmentList;
