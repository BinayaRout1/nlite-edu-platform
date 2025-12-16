import React, { useState } from "react";
import { Lock, Shield, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import API from "../../api";

const EditProfile = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const email = localStorage.getItem("adminEmail");

  const blockActions = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    try {
      // 1️⃣ CHECK CURRENT PASSWORD
      const check = await API.post("/admin/check-password", {
        email,
        currentPassword,
      });

      if (!check.data.valid) {
        return Swal.fire({
          title: "Incorrect Password ❌",
          text: "Your current password is incorrect.",
          icon: "error",
          confirmButtonColor: "#1565c0",
        });
      }

      // 2️⃣ CHECK PASSWORD MATCH
      if (newPassword !== confirmPassword) {
        return Swal.fire({
          title: "Password Mismatch ❌",
          text: "New password and confirm password do not match.",
          icon: "error",
          confirmButtonColor: "#1565c0",
        });
      }

      // 3️⃣ CHECK PASSWORD STRENGTH
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordRegex.test(newPassword)) {
        return Swal.fire({
          title: "Weak Password ⚠️",
          text: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
          icon: "warning",
          confirmButtonColor: "#1565c0",
        });
      }

      // 4️⃣ UPDATE PASSWORD
      const res = await API.post(
        "/admin/profile",
        {
          email,
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        title: "Password Updated 🎉",
        text: res.data.message,
        icon: "success",
        confirmButtonColor: "#1565c0",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      Swal.fire({
        title: "Error ❌",
        text: err.response?.data?.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#1565c0",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ width: "380px", borderRadius: "15px" }}
      >
        <div className="text-center mb-3">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center"
            style={{
              width: "70px",
              height: "70px",
              backgroundColor: "#1565c03a",
            }}
          >
            <Shield size={40} color="#1565c0" />
          </div>
          <h4 className="mt-3 fw-bold" style={{ color: "#1565c0" }}>
            Change Password
          </h4>
          <p className="text-muted small">
            Secure your admin account with a new password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* CURRENT PASSWORD */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <Lock size={16} className="me-1" /> Current Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showCurrent ? "text" : "password"}
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onCopy={blockActions}
                onPaste={blockActions}
                onCut={blockActions}
                required
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowCurrent(!showCurrent)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <Lock size={16} className="me-1" /> New Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showNew ? "text" : "password"}
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onCopy={blockActions}
                onPaste={blockActions}
                onCut={blockActions}
                required
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowNew(!showNew)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <Lock size={16} className="me-1" /> Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"}
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onCopy={blockActions}
                onPaste={blockActions}
                onCut={blockActions}
                required
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            <small className="text-muted">
              Must contain 8+ chars, uppercase, lowercase, number, and symbol.
            </small>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-semibold"
            style={{ backgroundColor: "#1565c0", color: "white" }}
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
