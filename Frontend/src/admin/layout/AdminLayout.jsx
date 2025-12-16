import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // Adjust path according to your structure

const AdminLayout = () => (
  <>
    <Navbar />
    <div className="container-fluid pt-4">
      <Outlet />
    </div>
  </>
);

export default AdminLayout;
