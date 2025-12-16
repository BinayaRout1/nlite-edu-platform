import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// ===== User imports =====
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import About from "./pages/about";
import Blog from "./pages/blog";
import BlogPost from "./components/blog/BlogPost";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import EnrollForm from "./components/Enroll/EnrollForm";

// ===== Admin imports =====
import AdminLayout from "./admin/layout/AdminLayout";
import AdminCourses from "./admin/pages/Courses";
import AdminContact from "./admin/pages/Contact";
import AdminBlog from "./admin/pages/Blog";
import AdminLoginPage from "./admin/pages/LoginPage";
import EnrollmentList from "./admin/pages/EnrollmentList";
import Curriculum from "./admin/pages/Curriculum";
import Logout from "./admin/pages/Logout";
import EditProfile from "./admin/pages/EditProfile";
import ProtectedRoute from "./admin/ProtectedRoute";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function UserLayout() {
  const [showForm, setShowForm] = useState(false);
  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  return (
    <>
      <Navbar onEnrollClick={handleOpenForm} />
      <Routes>
        <Route path="/" element={<Home onEnrollClick={handleOpenForm} />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses onEnrollClick={handleOpenForm} />} />
        <Route path="/blog" element={<Blog />} />
        {/* ✅ Dynamic blog route */}
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/contact" element={<Contact onEnrollClick={handleOpenForm} />} />
      </Routes>
      <Footer />
      <EnrollForm show={showForm} handleClose={handleCloseForm} />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* ===== USER SITE ===== */}
      <Route path="/*" element={<UserLayout />} />

      {/* ===== ADMIN LOGIN (public) ===== */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* ===== ADMIN DASHBOARD (protected) ===== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EnrollmentList />} />
        <Route path="enroll-users" element={<EnrollmentList />} />
        <Route path="curriculum" element={<Curriculum />} />
        <Route path="course" element={<AdminCourses />} />
        <Route path="contact" element={<AdminContact />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="logout" element={<Logout show={true} />} />
        <Route path="edit-profile" element={<EditProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
