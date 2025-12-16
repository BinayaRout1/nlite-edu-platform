import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
};

const modalStyle = {
  width: 480,
  maxWidth: "92vw",
  background: "#fff",
  borderRadius: 18,
  boxShadow: "0 8px 32px rgba(28,38,64,.14)",
  padding: "36px 36px 32px 36px",
  textAlign: "center",
  position: "relative",
};

const iconCircleStyle = {
  width: 96,
  height: 96,
  border: "4px solid #ffe0b0",
  borderRadius: "50%",
  margin: "0 auto 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const exclamationStyle = {
  color: "#f5a623",
  fontSize: 54,
  fontWeight: "bold",
};

const btnStyle = {
  fontWeight: 600,
  minWidth: 120,
  fontSize: 18,
  borderRadius: 8,
  padding: "8px 18px",
};

const Logout = ({ show, onClose }) => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  if (!show) return null;

  const handleLogout = async () => {
    try {
      // ✅ Correct logout request
      await API.post("/auth/logout");

      localStorage.removeItem("authToken");
      localStorage.removeItem("adminEmail");
      localStorage.setItem("logoutEvent", Date.now());

      setShowToast(true);

      setTimeout(() => {
        navigate("/admin/login", { replace: true });
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <>
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <div style={iconCircleStyle}>
            <span style={exclamationStyle}>!</span>
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              margin: "8px 0 10px 0",
              color: "#333",
            }}
          >
            Are you sure?
          </div>
          <div style={{ color: "#666", fontSize: 19, marginBottom: 34 }}>
            Do you really want to log out?
          </div>
          <div className="d-flex justify-content-center" style={{ gap: 20 }}>
            <button
              className="btn btn-primary"
              style={btnStyle}
              onClick={handleLogout}
            >
              Yes, log out
            </button>
            <button
              className="btn btn-danger"
              style={btnStyle}
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      </div>

      <div
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 3000 }}
      >
        <div
          className={`toast align-items-center text-white bg-success border-0 ${
            showToast ? "show" : "hide"
          }`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body fw-semibold">
              ✅ Logged out successfully!
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logout;
