import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OTPPage from "./pages/OTPPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/adminPage";
import ProviderPage from "./pages/providerPage";
import "./App.css";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/register", "/verify-otp"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {shouldShowNavbar && <Navbar />}
      <div className={shouldShowNavbar ? "container mx-auto px-4 py-8" : ""}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<OTPPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/provider/dashboard"
              element={
                <ProtectedRoute role="provider">
                  <ProviderPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute role="customer">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
