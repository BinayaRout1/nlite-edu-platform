// import React, { useEffect, useState } from "react";
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
//   Typography,
//   CircularProgress,
//   Box,
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

// const Contact = () => {
//   const [contacts, setContacts] = useState([]);
//   const [filteredContacts, setFilteredContacts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // Sorting
//   const [order, setOrder] = useState(null);
//   const [orderBy, setOrderBy] = useState(null);

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const res = await API.get(`/contacts`);
//         const formatted = res.data.map((item, index) => ({
//           serial: index + 1,
//           name: item.name,
//           phone: item.phone || "N/A",
//           email: item.email,
//           issue: item.issue || "N/A",
//           message: item.message || "N/A",
//           datetime: item.datetime,
//         }));

//         setContacts(formatted);
//         setFilteredContacts(formatted);
//       } catch (err) {
//         setError("Failed to fetch contact data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContacts();
//   }, []);

//   // 🔍 Search
//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);

//     const filtered = contacts.filter(
//       (row) =>
//         row.name?.toLowerCase().includes(term) ||
//         row.phone?.toLowerCase().includes(term) ||
//         row.email?.toLowerCase().includes(term) ||
//         row.issue?.toLowerCase().includes(term) ||
//         row.message?.toLowerCase().includes(term)
//     );

//     setFilteredContacts(filtered);
//     setCurrentPage(1);
//   };

//   // 🔽 Sorting
//   const handleSort = (property) => {
//     let newOrder = "asc";

//     if (orderBy === property && order === "asc") newOrder = "desc";
//     else if (orderBy === property && order === "desc") {
//       // Reset to neutral (both gray arrows)
//       setOrder(null);
//       setOrderBy(null);
//       setFilteredContacts([...contacts]);
//       return;
//     }

//     setOrder(newOrder);
//     setOrderBy(property);

//     const sortedData = [...filteredContacts].sort((a, b) => {
//       if (a[property] < b[property]) return newOrder === "asc" ? -1 : 1;
//       if (a[property] > b[property]) return newOrder === "asc" ? 1 : -1;
//       return 0;
//     });

//     setFilteredContacts(sortedData);
//   };

//   // 🔢 Pagination
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = filteredContacts.slice(indexOfFirstRow, indexOfLastRow);

//   const handlePageChange = (event, value) => setCurrentPage(value);

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(event.target.value);
//     setCurrentPage(1);
//   };

//   // Loading
//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//         <CircularProgress />
//         <Typography variant="h6" sx={{ ml: 2 }}>
//           Loading Contacts...
//         </Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Typography color="error" variant="h6" sx={{ p: 4 }}>
//         {error}
//       </Typography>
//     );
//   }

//   // Main return
//   return (
//     <Box
//       sx={{
//         px: { xs: 2, sm: 4, md: 8 },
//         pt: { xs: 2, sm: 3, md: 4 },
//         pb: 3,
//         width: "100%",
//         bgcolor: "#f7fafd",
//         minHeight: "100vh",
//       }}
//     >
//       <Card
//         sx={{
//           width: "100%",
//           borderRadius: 3,
//           boxShadow: "0 4px 24px 4px rgba(21, 41, 68, 0.08)",
//           background: "#fff",
//         }}
//       >
//         <CardHeader
//           title="Contact Submissions"
//           sx={{
//             background: "#1565c0",
//             color: "#fff",
//             borderTopLeftRadius: "12px",
//             borderTopRightRadius: "12px",
//             py: 2,
//             px: 3,
//             "& .MuiTypography-root": {
//               fontWeight: 700,
//               fontSize: "1.2rem",
//               letterSpacing: 0.5,
//             },
//           }}
//         />

//         <CardContent sx={{ p: 3 }}>
//           {/* 🔹 Controls */}
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

//           {/* 🧾 Table */}
//           <TableContainer
//             component={Paper}
//             sx={{
//               borderRadius: 2,
//               border: "1px solid #f0f0f0",
//               overflowX: "auto",
//             }}
//           >
//             <Table
//               sx={{
//                 minWidth: 1200,
//                 width: "100%",
//                 tableLayout: "auto",
//               }}
//             >
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#e3f1fd" }}>
//                   {[
//                     { id: "serial", label: "Serial No" },
//                     { id: "name", label: "Name" },
//                     { id: "phone", label: "Phone Number" },
//                     { id: "email", label: "Email" },
//                     { id: "issue", label: "Issue Related" },
//                     { id: "message", label: "Message" },
//                     { id: "datetime", label: "Date & Time" },
//                   ].map((col) => (
//                     <TableCell
//                       key={col.id}
//                       sx={{
//                         color: "#0d47a1",
//                         fontWeight: 600,
//                         fontSize: "1.03rem",
//                         borderBottom: "2px solid #bcdffb",
//                         padding: "12px 14px",
//                       }}
//                     >
//                       {col.id !== "serial" ? (
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
//                             {/* Ascending Arrow */}
//                             {orderBy === col.id && order === "asc" ? (
//                               <ArrowUpward
//                                 sx={{
//                                   fontSize: "1rem",
//                                   color: "#1565c0",
//                                   ml: 0.3,
//                                 }}
//                               />
//                             ) : orderBy === col.id &&
//                               order === "desc" ? null : (
//                               <ArrowUpward
//                                 sx={{
//                                   fontSize: "1rem",
//                                   color: "#b0b0b0",
//                                   ml: 0.3,
//                                 }}
//                               />
//                             )}

//                             {/* Descending Arrow */}
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
//                   currentRows.map((row) => (
//                     <TableRow key={row.serial} hover>
//                       <TableCell>{row.serial}</TableCell>
//                       <TableCell>{row.name}</TableCell>
//                       <TableCell>{row.phone}</TableCell>
//                       <TableCell>{row.email}</TableCell>
//                       <TableCell sx={{ maxWidth: 200 }}>{row.issue}</TableCell>
//                       <TableCell sx={{ maxWidth: 250 }}>
//                         {row.message}
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 180 }}>
//                         {new Date(row.datetime).toLocaleString("en-IN", {
//                           day: "2-digit",
//                           month: "2-digit",
//                           year: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           hour12: true,
//                         })}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={7} align="center">
//                       <Typography variant="h6" color="textSecondary">
//                         No contact data found.
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* 📄 Pagination */}
//           <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
//             <Pagination
//               count={Math.ceil(filteredContacts.length / rowsPerPage)}
//               page={currentPage}
//               onChange={handlePageChange}
//               color="primary"
//               shape="rounded"
//             />
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default Contact;

import React, { useEffect, useState } from "react";
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

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [order, setOrder] = useState(null);
  const [orderBy, setOrderBy] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await API.get(`/contacts`);
        const formatted = res.data.map((item, index) => ({
          serial: index + 1,
          name: item.name,
          phone: item.phone || "N/A",
          email: item.email,
          issue: item.issue || "N/A",
          message: item.message || "N/A",
          datetime: item.datetime,
        }));

        setContacts(formatted);
        setFilteredContacts(formatted);
      } catch (err) {
        setError("Failed to fetch contact data.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = contacts.filter(
      (row) =>
        row.name?.toLowerCase().includes(term) ||
        row.phone?.toLowerCase().includes(term) ||
        row.email?.toLowerCase().includes(term) ||
        row.issue?.toLowerCase().includes(term) ||
        row.message?.toLowerCase().includes(term)
    );

    setFilteredContacts(filtered);
    setCurrentPage(1);
  };

  const handleSort = (property) => {
    let newOrder = "asc";

    if (orderBy === property && order === "asc") newOrder = "desc";
    else if (orderBy === property && order === "desc") {
      setOrder(null);
      setOrderBy(null);
      setFilteredContacts([...contacts]);
      return;
    }

    setOrder(newOrder);
    setOrderBy(property);

    const sortedData = [...filteredContacts].sort((a, b) => {
      if (a[property] < b[property]) return newOrder === "asc" ? -1 : 1;
      if (a[property] > b[property]) return newOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredContacts(sortedData);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredContacts.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (event, value) => setCurrentPage(value);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Contacts...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6" sx={{ p: 4 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 8 },
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
          title="Contact Submissions"
          sx={{
            background: "#1565c0",
            color: "#fff",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            py: 2,
            px: 3,
            "& .MuiTypography-root": {
              fontWeight: 700,
              fontSize: "1.2rem",
              letterSpacing: 0.5,
            },
          }}
        />

        <CardContent sx={{ p: 3 }}>
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

          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              border: "1px solid #f0f0f0",
              overflowX: "auto",
            }}
          >
            <Table
              sx={{
                minWidth: 1200,
                width: "100%",
                tableLayout: "fixed",
              }}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f1fd" }}>
                  {[
                    { id: "serial", label: "Serial No" },
                    { id: "name", label: "Name" },
                    { id: "phone", label: "Phone Number" },
                    { id: "email", label: "Email" },
                    { id: "issue", label: "Issue Related" },
                    { id: "message", label: "Message" },
                    { id: "datetime", label: "Date & Time" },
                  ].map((col) => (
                    <TableCell
                      key={col.id}
                      sx={{
                        color: "#0d47a1",
                        fontWeight: 600,
                        fontSize: "1.03rem",
                        borderBottom: "2px solid #bcdffb",
                        padding: "12px 14px",
                        whiteSpace: "normal",
                        wordBreak: "break-all",
                        overflowWrap: "break-word",
                      }}
                    >
                      {col.id !== "serial" ? (
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
                  currentRows.map((row) => (
                    <TableRow key={row.serial} hover>
                      <TableCell
                        sx={{
                          whiteSpace: "normal",
                          wordBreak: "break-all",
                          overflowWrap: "break-word",
                        }}
                      >
                        {row.serial}
                      </TableCell>

                      <TableCell
                        sx={{ whiteSpace: "normal", wordBreak: "break-all" }}
                      >
                        {row.name}
                      </TableCell>

                      <TableCell
                        sx={{ whiteSpace: "normal", wordBreak: "break-all" }}
                      >
                        {row.phone}
                      </TableCell>

                      <TableCell
                        sx={{ whiteSpace: "normal", wordBreak: "break-all" }}
                      >
                        {row.email}
                      </TableCell>

                      <TableCell
                        sx={{
                          whiteSpace: "normal",
                          wordBreak: "break-all",
                          maxWidth: 200,
                        }}
                      >
                        {row.issue}
                      </TableCell>

                      <TableCell
                        sx={{
                          whiteSpace: "normal",
                          wordBreak: "break-all",
                          maxWidth: 250,
                        }}
                      >
                        {row.message}
                      </TableCell>

                      <TableCell
                        sx={{
                          minWidth: 180,
                          whiteSpace: "normal",
                          wordBreak: "break-all",
                        }}
                      >
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
                    <TableCell colSpan={7} align="center">
                      <Typography variant="h6" color="textSecondary">
                        No contact data found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredContacts.length / rowsPerPage)}
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

export default Contact;
