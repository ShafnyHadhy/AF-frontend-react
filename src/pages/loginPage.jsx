import React, { useEffect } from "react";
import Login from "../components/auth/Login";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <Login />
    </div>
  );
};

export default LoginPage;
