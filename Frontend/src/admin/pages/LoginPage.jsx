import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Toast States
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("bg-success");
  const [showToast, setShowToast] = useState(false);

  const showToastMsg = (message, color = "bg-success") => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // =====================================
  // 🔐 HANDLE LOGIN (FIXED)
  // =====================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      const data = res.data;

      // ✔ Success when status 200 (backend returns cookie)
      if (res.status === 200) {
        showToastMsg("✅ Login successful! Redirecting...", "bg-success");

        // Optional – save admin email for UI
        localStorage.setItem("adminEmail", data.admin?.email || "");

        // Redirect after short delay
        setTimeout(() => {
          navigate("/admin", { replace: true });
        }, 1000);
      } else {
        showToastMsg(data.message || "Invalid email or password", "bg-danger");
      }
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;

        if (status === 400 || status === 401) {
          showToastMsg("❌ Invalid email or password", "bg-danger");
        } else if (status === 404) {
          showToastMsg("⚠️ Login endpoint not found", "bg-warning");
        } else if (status === 500) {
          showToastMsg(
            "💥 Server error. Please try again later.",
            "bg-warning"
          );
        } else {
          showToastMsg(
            message || "⚠️ Unexpected error occurred.",
            "bg-warning"
          );
        }
      } else if (err.request) {
        showToastMsg(
          "🌐 Network error. Please check your connection.",
          "bg-warning"
        );
      } else {
        showToastMsg("⚠️ Unexpected error occurred.", "bg-warning");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔹 Login Card */}
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="card p-4 shadow"
          style={{ width: "350px", borderRadius: "12px" }}
        >
          <h3 className="text-center mb-3 fw-bold">Admin Login</h3>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your admin email"
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      {/* 🔹 Toast Notification */}
      <div
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 3000 }}
      >
        <div
          className={`toast text-white ${toastColor} border-0 ${
            showToast ? "show" : "hide"
          }`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body fw-semibold">{toastMessage}</div>
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

export default LoginPage;
