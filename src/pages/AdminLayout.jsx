import React from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  Activity,
  FileText,
  Package,
  LogOut,
} from "lucide-react";
import AdminDashboard from "../admin/AdminDashboard";
import UserManagement from "../admin/UserManagement";
import ProviderManagement from "../admin/ProviderManagement";
import ReportGeneration from "../admin/ReportGeneration";
import ActivityLogPage from "../admin/ActivityLogPage";
import SettingsPage from "../admin/SettingsPage";
import RequestManagement from "../admin/RequestManagement";

export default function AdminLayout() {
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    // { name: "Providers", path: "/admin/providers", icon: UserCog },
    { name: "Reports", path: "/admin/reports", icon: FileText },
    { name: "Requests", path: "/admin/requests", icon: Package },
    { name: "Activity Log", path: "/admin/logs", icon: Activity },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const handleSignOut = () => {
    // Clear authentication data (adjust based on your auth system)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // Redirect to login page
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl z-20 flex flex-col border-r border-gray-100">
        <div className="p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20 transition-transform hover:scale-110">
              <span className="material-icons text-xl">eco</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-slate-900 font-['Manrope'] leading-tight">
                ReVolve
              </span>
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                Command Hub
              </span>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              end={item.path === "/admin"}
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "text-gray-600 hover:bg-gray-50 hover:text-accent"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}

          {/* Sign Out Button */}
          <div className="pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all text-red-600 hover:bg-red-50 hover:text-red-700 group"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto h-full relative">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/providers" element={<ProviderManagement />} />
          <Route path="/reports" element={<ReportGeneration />} />
          <Route path="/requests" element={<RequestManagement />} />
          <Route path="/logs" element={<ActivityLogPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}
