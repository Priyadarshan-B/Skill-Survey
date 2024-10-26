import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/login/login";
import Details from "../pages/details/details";
import Dashboard from "../pages/dashboard/dashboard";
import Approvals from "../pages/approvals/approvals";
import AppLayout from "../components/applayout/AppLayout";
import ProtectedRoute from "../components/utils/protectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/*"
        element={
          // <ProtectedRoute>
          <AppLayout
            body={
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="details" element={<Details />} />
                <Route path="approvals" element={<Approvals />} />

              </Routes>
            }
          />
          // </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
