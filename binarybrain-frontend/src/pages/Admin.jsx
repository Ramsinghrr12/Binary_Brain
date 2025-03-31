import React from "react";
import AdminPanel from "../components/AdminPanel";
import "../styles/admin.css";

const Admin = () => {
  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <AdminPanel />
    </div>
  );
};

export default Admin;