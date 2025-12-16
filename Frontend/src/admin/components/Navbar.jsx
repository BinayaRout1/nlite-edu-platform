import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logout from "../pages/Logout";
import { FaUserCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setShowProfileMenu((prev) => !prev);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("authToken");
    setShowLogoutModal(false);
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{ background: "#232233", padding: "20px" }}
      >
        <div className="container-fluid">
          {/* === Left side (Brand + Menu icon on mobile) === */}
          <div className="d-flex align-items-center gap-3">
            {/* 🔹 Menu icon — visible only on small screens */}
            <button
              className="navbar-toggler d-lg-none"
              type="button"
              onClick={toggleMenu}
              style={{ border: "none", color: "white" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="white"
                viewBox="0 0 30 30"
              >
                <path
                  stroke="white"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M4 7h22M4 15h22M4 23h22"
                />
              </svg>
            </button>

            {/* 🔹 Brand Name — hidden on mobile */}
            <span
              className="navbar-brand d-none d-lg-block"
              style={{ fontWeight: "bold", color: "white", fontSize: "2rem" }}
            >
              NLITE Dashboard
            </span>
          </div>

          {/* === Right side (Profile icon always visible) === */}
          <div
            className="position-relative"
            ref={profileRef}
            style={{ cursor: "pointer" }}
          >
            <FaUserCircle size={35} color="white" onClick={toggleProfileMenu} />

            {showProfileMenu && (
              <div
                className="dropdown-menu show mt-2"
                style={{
                  position: "absolute",
                  right: 0,
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  minWidth: "160px",
                  zIndex: 1000,
                  overflow: "hidden",
                }}
              >
                <Link
                  to="/admin/edit-profile"
                  className="dropdown-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setIsOpen(false);
                  }}
                >
                  Change Password
                </Link>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowLogoutModal(true);
                    setIsOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* === Navbar collapse (Enroll, Course, etc.) === */}
          <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            style={{
              justifyContent: "flex-end",
            }}
          >
            <div className="navbar-nav d-flex flex-column flex-lg-row gap-3 mt-3 mt-lg-0 align-items-lg-center">
              <Link
                to="/admin/enroll-users"
                className="btn btn-primary"
                style={{ background: "#6666FC", border: "none" }}
                onClick={() => setIsOpen(false)}
              >
                Enrolled Users
              </Link>
              <Link
                to="/admin/curriculum"
                className="btn btn-primary"
                style={{ background: "#6666FC", border: "none" }}
                onClick={() => setIsOpen(false)}
              >
                Curriculum Viewd
              </Link>
              <Link
                to="/admin/course"
                className="btn btn-primary"
                style={{ background: "#6666FC", border: "none" }}
                onClick={() => setIsOpen(false)}
              >
                Courses
              </Link>
              <Link
                to="/admin/contact"
                className="btn btn-primary"
                style={{ background: "#6666FC", border: "none" }}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/admin/blog"
                className="btn btn-primary"
                style={{ background: "#6666FC", border: "none" }}
                onClick={() => setIsOpen(false)}
              >
                Blogs
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Modal */}
      <Logout
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Navbar;
