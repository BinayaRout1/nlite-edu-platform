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

const Curriculum = () => {
  const [curriculumData, setCurriculumData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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
    fetchCurriculum();
  }, []);

  const fetchCurriculum = async () => {
    try {
      const res = await API.get(`/curriculum`);
      setCurriculumData(res.data);
      setFilteredData(res.data);
    } catch (error) {
      setError("Error fetching curriculum data.");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Search Functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = curriculumData.filter((row) => {
      return (
        row.name?.toLowerCase().includes(term) ||
        row.phone?.toLowerCase().includes(term) ||
        row.email?.toLowerCase().includes(term) ||
        row.course?.toLowerCase().includes(term)
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // 🔽 Sorting Functionality (with side-by-side arrows)
  const handleSort = (property) => {
    let newOrder = "asc";

    if (orderBy === property && order === "asc") newOrder = "desc";
    else if (orderBy === property && order === "desc") {
      setOrder(null);
      setOrderBy(null);
      setFilteredData([...curriculumData]);
      return;
    }

    setOrder(newOrder);
    setOrderBy(property);

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[property] < b[property]) return newOrder === "asc" ? -1 : 1;
      if (a[property] > b[property]) return newOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(sortedData);
  };

  // 🔢 Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(1);
  };

  // ⏳ Loading
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Curriculum...
        </Typography>
      </Box>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <Typography color="error" variant="h6" sx={{ p: 4 }}>
        {error}
      </Typography>
    );
  }

  // 🧾 Main Table
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
          title="Curriculum Enrollments"
          sx={{
            background: "#1565c0",
            color: "#fff",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            py: 2,
            px: 3,
            "& .MuiTypography-root": {
              fontWeight: 700,
              fontSize: "1.15rem",
              letterSpacing: 0.5,
            },
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

          {/* 📋 Table */}
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              border: "1px solid #f0f0f0",
            }}
          >
            <Table sx={{ minWidth: 1000 }} aria-label="curriculum table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f1fd" }}>
                  {[
                    { id: "id", label: "Serial No" },
                    { id: "name", label: "Name" },
                    { id: "phone", label: "Phone Number" },
                    { id: "email", label: "Email" },
                    { id: "course", label: "Course" },
                    { id: "datetime", label: "Date & Time" },
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
                            gap: 0.5,
                            cursor: "pointer",
                            "&:hover": { color: "#1565c0" },
                          }}
                        >
                          {col.label}
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {/* Ascending arrow */}
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

                            {/* Descending arrow */}
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
                        {new Date(row.datetime).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No curriculum records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 📄 Pagination */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredData.length / rowsPerPage)}
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

export default Curriculum;
