import React from "react";
import { useAuth } from "../context/AuthContext";
import CustomerDashboard from "../components/customer/CustomerDashboard";
import ProviderDashboard from "../components/provider/ProviderDashboard";
import AdminDashboard from "../components/admin/AdminDashboard";

const DashboardPage = () => {
  const { isCustomer, isProvider, isAdmin } = useAuth();

  return (
    <div className="container">
      {isCustomer && <CustomerDashboard />}
      {isProvider && <ProviderDashboard />}
      {isAdmin && <AdminDashboard />}
    </div>
  );
};

export default DashboardPage;
