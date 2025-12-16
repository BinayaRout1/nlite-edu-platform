// /src/api.js
import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api" // ✅ use 127.0.0.1 to match CSP in dev
      : import.meta.env.VITE_API_URL || "/api", // ✅ production safe
  withCredentials: true,
});

// console.log("🌍 API Base URL:", API.defaults.baseURL);

export default API;
