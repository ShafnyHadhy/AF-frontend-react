import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-8 rounded-2xl shadow-lg mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Welcome, Admin {user?.firstName}!
        </h2>
        <p className="text-purple-100">Manage the system from here</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-800">1,234</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Providers</p>
              <h3 className="text-2xl font-bold text-gray-800">567</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-2xl">🔧</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-yellow-600">23</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Repairs</p>
              <h3 className="text-2xl font-bold text-gray-800">892</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">🔨</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/users" className="group">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition mx-auto">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              Manage Users
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              View and manage all users
            </p>
            <div className="text-center">
              <span className="text-purple-600 group-hover:underline">
                Go to Users →
              </span>
            </div>
          </div>
        </Link>

        <Link to="/admin/providers" className="group">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition mx-auto">
              <span className="text-3xl">🔧</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              Manage Providers
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Approve and manage providers
            </p>
            <div className="text-center">
              <span className="text-purple-600 group-hover:underline">
                Go to Providers →
              </span>
            </div>
          </div>
        </Link>

        <Link to="/admin/reports" className="group">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition mx-auto">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              Reports
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              View system reports
            </p>
            <div className="text-center">
              <span className="text-purple-600 group-hover:underline">
                View Reports →
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
