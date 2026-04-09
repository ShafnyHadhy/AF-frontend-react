import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  const [activeRoleTab, setActiveRoleTab] = useState("all");

  const [customers, setCustomers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [recyclers, setRecyclers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 0,
    limit: 10,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "",
    isActive: true,
  });

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProviders: 0,
    totalRecyclers: 0,
    totalAdmins: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      loadUsersByCurrentTab();
    }
  }, [activeRoleTab, pagination.page, searchTerm, statusFilter]);

  function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  function getAdminUsersBaseUrl() {
    return `${import.meta.env.VITE_API_URL}/api/users/admin/users`;
  }

  async function checkAuth() {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        navigate("/login");
        return;
      }

      if (role !== "admin") {
        toast.error("Access denied. Admin only.");
        navigate("/user");
        return;
      }

      await fetchAdminProfile();
      await fetchDashboardStats();
      await fetchAllUsers();
    } catch (error) {
      console.error("Auth check failed:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }

  async function fetchAdminProfile() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          headers: getAuthHeaders(),
        },
      );
      setAdmin(response.data.user);
    } catch (error) {
      console.error("Failed to fetch admin profile:", error);
    }
  }

  async function fetchDashboardStats() {
    try {
      const response = await axios.get(`${getAdminUsersBaseUrl()}?limit=1000`, {
        headers: getAuthHeaders(),
      });

      const users = response.data.users || [];
      const customersList = users.filter((u) => u.role === "customer");
      const providersList = users.filter((u) => u.role === "provider");
      const recyclersList = users.filter((u) => u.role === "recycler");
      const adminsList = users.filter((u) => u.role === "admin");
      const active = users.filter((u) => u.isActive === true);
      const inactive = users.filter((u) => u.isActive === false);

      setStats({
        totalCustomers: customersList.length,
        totalProviders: providersList.length,
        totalRecyclers: recyclersList.length,
        totalAdmins: adminsList.length,
        activeUsers: active.length,
        inactiveUsers: inactive.length,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }

  function buildUserQuery(extra = {}) {
    const params = new URLSearchParams();
    params.append("page", pagination.page);
    params.append("limit", pagination.limit);

    if (searchTerm) params.append("search", searchTerm);
    if (statusFilter) params.append("status", statusFilter);

    Object.entries(extra).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    });

    return params.toString();
  }

  async function fetchAllUsers() {
    try {
      const response = await axios.get(
        `${getAdminUsersBaseUrl()}?${buildUserQuery()}`,
        {
          headers: getAuthHeaders(),
        },
      );

      setAllUsers(response.data.users || []);
      setPagination(response.data.pagination || pagination);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    }
  }

  async function fetchUsersByRole(role) {
    try {
      const response = await axios.get(
        `${getAdminUsersBaseUrl()}?${buildUserQuery({ role })}`,
        {
          headers: getAuthHeaders(),
        },
      );

      const users = response.data.users || [];

      if (role === "customer") setCustomers(users);
      if (role === "provider") setProviders(users);
      if (role === "recycler") setRecyclers(users);
      if (role === "admin") setAdmins(users);

      setPagination(response.data.pagination || pagination);
    } catch (error) {
      console.error(`Failed to fetch ${role}s:`, error);
      toast.error(`Failed to load ${role}s`);
    }
  }

  async function fetchUserById(userId) {
    const response = await axios.get(`${getAdminUsersBaseUrl()}/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data.user;
  }

  async function openUserDetails(user) {
    try {
      setModalLoading(true);
      setShowUserModal(true);

      const fullUser = await fetchUserById(user._id);
      setSelectedUser(fullUser);
      setEditFormData({
        firstName: fullUser.firstName || "",
        lastName: fullUser.lastName || "",
        phoneNumber: fullUser.phoneNumber || "",
        role: fullUser.role || "",
        isActive: fullUser.isActive || false,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to fetch full user details:", error);
      toast.error("Failed to load user details");
      setShowUserModal(false);
    } finally {
      setModalLoading(false);
    }
  }

  function openEditUser(user) {
    setEditFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phoneNumber: user.phoneNumber || "",
      role: user.role || "",
      isActive: user.isActive || false,
    });
    setIsEditing(true);
  }

  async function updateUser(userId, userData) {
    try {
      const response = await axios.put(
        `${getAdminUsersBaseUrl()}/${userId}`,
        userData,
        {
          headers: getAuthHeaders(),
        },
      );

      if (response.data.success) {
        toast.success("User updated successfully");
        await refreshCurrentView();
        await fetchDashboardStats();

        const refreshedUser = await fetchUserById(userId);
        setSelectedUser(refreshedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(error?.response?.data?.message || "Failed to update user");
    }
  }

  async function deleteUser(userId, userEmail) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userEmail}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      const response = await axios.delete(
        `${getAdminUsersBaseUrl()}/${userId}`,
        {
          headers: getAuthHeaders(),
        },
      );

      if (response.data.success) {
        toast.success(`User ${userEmail} deleted successfully`);
        await refreshCurrentView();
        await fetchDashboardStats();
        setShowUserModal(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(error?.response?.data?.message || "Failed to delete user");
    }
  }

  async function toggleUserStatus(userId, currentStatus, userName) {
    try {
      const response = await axios.put(
        `${getAdminUsersBaseUrl()}/${userId}`,
        { isActive: !currentStatus },
        {
          headers: getAuthHeaders(),
        },
      );

      if (response.data.success) {
        toast.success(
          `${userName} ${!currentStatus ? "activated" : "deactivated"} successfully`,
        );

        await refreshCurrentView();
        await fetchDashboardStats();

        if (selectedUser && selectedUser._id === userId) {
          const refreshedUser = await fetchUserById(userId);
          setSelectedUser(refreshedUser);
          setEditFormData({
            firstName: refreshedUser.firstName || "",
            lastName: refreshedUser.lastName || "",
            phoneNumber: refreshedUser.phoneNumber || "",
            role: refreshedUser.role || "",
            isActive: refreshedUser.isActive || false,
          });
        }
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error("Failed to update user status");
    }
  }

  async function refreshCurrentView() {
    if (activeRoleTab === "all") {
      await fetchAllUsers();
    } else {
      await fetchUsersByRole(activeRoleTab);
    }
  }

  async function loadUsersByCurrentTab() {
    if (activeRoleTab === "all") {
      await fetchAllUsers();
    } else {
      await fetchUsersByRole(activeRoleTab);
    }
  }

  function handleEditChange(e) {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function saveEdit() {
    if (!selectedUser) return;

    updateUser(selectedUser._id, {
      firstName: editFormData.firstName,
      lastName: editFormData.lastName,
      phoneNumber: editFormData.phoneNumber,
      role: editFormData.role,
      isActive: editFormData.isActive,
    });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    toast.success("Logged out successfully");
    navigate("/login");
  }

  function getCurrentUsers() {
    if (activeRoleTab === "all") return allUsers;
    if (activeRoleTab === "customer") return customers;
    if (activeRoleTab === "provider") return providers;
    if (activeRoleTab === "recycler") return recyclers;
    if (activeRoleTab === "admin") return admins;
    return [];
  }

  function getRoleIcon(role) {
    switch (role) {
      case "customer":
        return "👤";
      case "provider":
        return "🔧";
      case "recycler":
        return "♻️";
      case "admin":
        return "👑";
      default:
        return "👤";
    }
  }

  function getRoleBadge(role) {
    const colors = {
      customer: "bg-blue-500/20 text-blue-200",
      provider: "bg-purple-500/20 text-purple-200",
      recycler: "bg-green-500/20 text-green-200",
      admin: "bg-red-500/20 text-red-200",
    };
    return colors[role] || "bg-gray-500/20 text-gray-200";
  }

  const currentUsers = getCurrentUsers();

  function getCurrentTotalCount() {
    return pagination.total || 0;
  }

  const currentTotalCount = getCurrentTotalCount();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[url('/bbg.jpg')] bg-cover bg-center bg-fixed">
        <div className="min-h-screen bg-black/50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-300 border-t-transparent animate-spin"></div>
            <p className="text-white text-sm font-semibold">
              Loading admin panel...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[url('/bbg.jpg')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-black/45">
        <nav className="w-full bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                A
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Admin Panel
                </h1>
                <p className="text-xs text-white/60">
                  ReConnect Platform Management
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <span>
                  👑 {admin?.firstName} {admin?.lastName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <StatCard
              title="Total Users"
              value={currentTotalCount}
              icon="👥"
              color="from-blue-500 to-cyan-500"
            />
            <StatCard
              title="Customers"
              value={stats.totalCustomers}
              icon="👤"
              color="from-blue-500 to-indigo-500"
            />
            <StatCard
              title="Providers"
              value={stats.totalProviders}
              icon="🔧"
              color="from-purple-500 to-pink-500"
            />
            <StatCard
              title="Recyclers"
              value={stats.totalRecyclers}
              icon="♻️"
              color="from-green-500 to-emerald-500"
            />
            <StatCard
              title="Active"
              value={stats.activeUsers}
              icon="🟢"
              color="from-green-500 to-teal-500"
            />
            <StatCard
              title="Inactive"
              value={stats.inactiveUsers}
              icon="🔴"
              color="from-red-500 to-orange-500"
            />
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="flex flex-wrap border-b border-white/10">
              <TabButton
                active={activeRoleTab === "all"}
                onClick={() => {
                  setActiveRoleTab("all");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                icon="👥"
                label="All Users"
                count={currentTotalCount}
              />
              <TabButton
                active={activeRoleTab === "customer"}
                onClick={() => {
                  setActiveRoleTab("customer");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                icon="👤"
                label="Customers"
                count={stats.totalCustomers}
              />
              <TabButton
                active={activeRoleTab === "provider"}
                onClick={() => {
                  setActiveRoleTab("provider");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                icon="🔧"
                label="Providers"
                count={stats.totalProviders}
              />
              <TabButton
                active={activeRoleTab === "recycler"}
                onClick={() => {
                  setActiveRoleTab("recycler");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                icon="♻️"
                label="Recyclers"
                count={stats.totalRecyclers}
              />
              <TabButton
                active={activeRoleTab === "admin"}
                onClick={() => {
                  setActiveRoleTab("admin");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                icon="👑"
                label="Admins"
                count={stats.totalAdmins}
              />
            </div>

            <div className="p-6 border-b border-white/10">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="🔍 Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => {
                      setPagination((prev) => ({ ...prev, page: 1 }));
                      setSearchTerm(e.target.value);
                    }}
                    className="w-full px-4 py-2 rounded-xl text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setPagination((prev) => ({ ...prev, page: 1 }));
                    setStatusFilter(e.target.value);
                  }}
                  className="px-4 py-2 rounded-xl text-sm bg-white/15 border border-white/15 text-white focus:outline-none"
                >
                  <option value="">All Status</option>
                  <option value="active">🟢 Active</option>
                  <option value="inactive">🔴 Inactive</option>
                </select>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="px-4 py-2 rounded-xl text-sm bg-white/10 border border-white/20 text-white hover:bg-white/20"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr className="text-left text-white/60">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-12 text-white/60"
                      >
                        <div className="text-5xl mb-3">📭</div>
                        <p>No users found</p>
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-white/5 hover:bg-white/5 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-green-500/30 flex items-center justify-center text-sm font-bold">
                              {user.firstName?.charAt(0)}
                              {user.lastName?.charAt(0)}
                            </div>
                            <span className="font-medium text-white">
                              {user.firstName} {user.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white/70">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-white/70">
                          {user.phoneNumber || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}
                          >
                            {getRoleIcon(user.role)} {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                              user.isActive
                                ? "bg-green-500/20 text-green-200"
                                : "bg-red-500/20 text-red-200"
                            }`}
                          >
                            {user.isActive ? "🟢 Active" : "🔴 Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/60 text-xs">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => openUserDetails(user)}
                              className="px-2 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 text-xs"
                              title="View Details"
                            >
                              👁️ View
                            </button>
                            <button
                              onClick={() =>
                                toggleUserStatus(
                                  user._id,
                                  user.isActive,
                                  user.firstName,
                                )
                              }
                              className={`px-2 py-1 rounded text-xs ${
                                user.isActive
                                  ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200"
                                  : "bg-green-500/20 hover:bg-green-500/30 text-green-200"
                              }`}
                              title={user.isActive ? "Deactivate" : "Activate"}
                            >
                              {user.isActive ? "🔴 Deactivate" : "🟢 Activate"}
                            </button>
                            <button
                              onClick={() => deleteUser(user._id, user.email)}
                              className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs"
                              title="Delete"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 py-6 border-t border-white/10">
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-50 text-white text-sm hover:bg-white/20"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-white/70 text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-50 text-white text-sm hover:bg-white/20"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showUserModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowUserModal(false)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[85vh] overflow-y-auto rounded-3xl border border-white/15 bg-black/90 backdrop-blur-xl shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowUserModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl z-10"
            >
              &times;
            </button>

            <div className="p-6">
              {modalLoading ? (
                <div className="py-16 text-center text-white/70">
                  Loading user details...
                </div>
              ) : selectedUser ? (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-green-500/20 border-2 border-white/20 flex items-center justify-center text-4xl font-bold">
                      {selectedUser.firstName?.charAt(0)}
                      {selectedUser.lastName?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-2xl font-bold">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </h2>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadge(
                            selectedUser.role,
                          )}`}
                        >
                          {getRoleIcon(selectedUser.role)} {selectedUser.role}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            selectedUser.isActive
                              ? "bg-green-500/20 text-green-200"
                              : "bg-red-500/20 text-red-200"
                          }`}
                        >
                          {selectedUser.isActive ? "🟢 Active" : "🔴 Inactive"}
                        </span>
                      </div>
                      <p className="text-cyan-200 text-sm mt-1">
                        {selectedUser.email}
                      </p>
                      <p className="text-white/60 text-sm">
                        {selectedUser.phoneNumber || "No phone number"}
                      </p>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-white/80">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={editFormData.firstName}
                            onChange={handleEditChange}
                            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/15 border border-white/15 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-white/80">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={editFormData.lastName}
                            onChange={handleEditChange}
                            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/15 border border-white/15 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-white/80">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            name="phoneNumber"
                            value={editFormData.phoneNumber}
                            onChange={handleEditChange}
                            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/15 border border-white/15 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-white/80">Role</label>
                          <select
                            name="role"
                            value={editFormData.role}
                            onChange={handleEditChange}
                            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/15 border border-white/15 text-white"
                          >
                            <option value="customer">Customer</option>
                            <option value="provider">Provider</option>
                            <option value="recycler">Recycler</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center gap-2 text-sm text-white/80">
                            <input
                              type="checkbox"
                              name="isActive"
                              checked={editFormData.isActive}
                              onChange={handleEditChange}
                              className="w-4 h-4"
                            />
                            Account Active
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={saveEdit}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-300 to-green-300 text-slate-900 font-semibold"
                        >
                          💾 Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 rounded-lg bg-white/10 text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <DetailItem label="User ID" value={selectedUser._id} />
                        <DetailItem label="Email" value={selectedUser.email} />
                        <DetailItem
                          label="Phone"
                          value={selectedUser.phoneNumber || "-"}
                        />
                        <DetailItem
                          label="Verified"
                          value={selectedUser.isVerified ? "✅ Yes" : "❌ No"}
                        />
                        <DetailItem
                          label="Member Since"
                          value={new Date(
                            selectedUser.createdAt,
                          ).toLocaleDateString()}
                        />
                        <DetailItem
                          label="Last Login"
                          value={
                            selectedUser.lastLogin
                              ? new Date(
                                  selectedUser.lastLogin,
                                ).toLocaleString()
                              : "-"
                          }
                        />
                      </div>

                      {selectedUser.address &&
                        (selectedUser.address.street ||
                          selectedUser.address.city) && (
                          <>
                            <h3 className="text-lg font-semibold mt-4 mb-3">
                              📍 Address
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <DetailItem
                                label="Street"
                                value={selectedUser.address?.street || "-"}
                              />
                              <DetailItem
                                label="City"
                                value={selectedUser.address?.city || "-"}
                              />
                              <DetailItem
                                label="District"
                                value={selectedUser.address?.district || "-"}
                              />
                              <DetailItem
                                label="Postal Code"
                                value={selectedUser.address?.postalCode || "-"}
                              />
                            </div>
                          </>
                        )}

                      {selectedUser.role === "provider" &&
                        selectedUser.providerDetails && (
                          <>
                            <h3 className="text-lg font-semibold mt-4 mb-3">
                              🏢 Company Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <DetailItem
                                label="Company Name"
                                value={
                                  selectedUser.providerDetails?.companyName
                                }
                              />
                              <DetailItem
                                label="Company Phone"
                                value={
                                  selectedUser.providerDetails?.companyPhone
                                }
                              />
                              <DetailItem
                                label="Registration No"
                                value={
                                  selectedUser.providerDetails
                                    ?.companyRegistrationNo
                                }
                              />
                              <DetailItem
                                label="Specialization"
                                value={selectedUser.providerDetails?.specialization?.join(
                                  ", ",
                                )}
                              />
                              <DetailItem
                                label="Experience"
                                value={`${selectedUser.providerDetails?.experience ?? 0} years`}
                              />
                              <DetailItem
                                label="Service Area"
                                value={selectedUser.providerDetails?.serviceArea?.join(
                                  ", ",
                                )}
                              />
                              <DetailItem
                                label="Completed Jobs"
                                value={
                                  selectedUser.providerDetails?.completedJobs
                                }
                              />
                              <DetailItem
                                label="Rating"
                                value={`⭐ ${selectedUser.providerDetails?.rating?.average ?? 0} (${selectedUser.providerDetails?.rating?.count ?? 0} reviews)`}
                              />
                              <DetailItem
                                label="Available"
                                value={
                                  selectedUser.providerDetails?.isAvailable
                                    ? "Yes"
                                    : "No"
                                }
                              />
                              <DetailItem
                                label="Description"
                                value={
                                  selectedUser.providerDetails?.description
                                }
                                className="md:col-span-2"
                              />
                            </div>
                          </>
                        )}

                      {selectedUser.role === "recycler" &&
                        selectedUser.recyclerDetails && (
                          <>
                            <h3 className="text-lg font-semibold mt-4 mb-3">
                              ♻️ Recycler Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <DetailItem
                                label="Company Name"
                                value={
                                  selectedUser.recyclerDetails?.companyName
                                }
                              />
                              <DetailItem
                                label="Company Phone"
                                value={
                                  selectedUser.recyclerDetails?.companyPhone
                                }
                              />
                              <DetailItem
                                label="Registration No"
                                value={
                                  selectedUser.recyclerDetails
                                    ?.companyRegistrationNo
                                }
                              />
                              <DetailItem
                                label="Recycling Types"
                                value={selectedUser.recyclerDetails?.recyclingTypes?.join(
                                  ", ",
                                )}
                              />
                              <DetailItem
                                label="Collection Points"
                                value={selectedUser.recyclerDetails?.collectionPoints?.join(
                                  ", ",
                                )}
                              />
                              <DetailItem
                                label="Pickup Service"
                                value={
                                  selectedUser.recyclerDetails?.pickupService
                                    ?.available
                                    ? "Available"
                                    : "Not Available"
                                }
                              />
                              <DetailItem
                                label="Price Per Kg"
                                value={`LKR ${selectedUser.recyclerDetails?.pricing?.pricePerKg ?? 0}`}
                              />
                              <DetailItem
                                label="Total Recycled"
                                value={`${selectedUser.recyclerDetails?.totalRecycled ?? 0} kg`}
                              />
                              <DetailItem
                                label="Rating"
                                value={`⭐ ${selectedUser.recyclerDetails?.rating?.average ?? 0}`}
                              />
                            </div>
                          </>
                        )}

                      {selectedUser.role === "admin" &&
                        selectedUser.adminDetails && (
                          <>
                            <h3 className="text-lg font-semibold mt-4 mb-3">
                              👑 Admin Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <DetailItem
                                label="Department"
                                value={selectedUser.adminDetails?.department}
                              />
                              <DetailItem
                                label="Access Level"
                                value={selectedUser.adminDetails?.accessLevel}
                              />
                              <DetailItem
                                label="Permissions"
                                value={selectedUser.adminDetails?.permissions?.join(
                                  ", ",
                                )}
                              />
                            </div>
                          </>
                        )}

                      <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button
                          onClick={() => openEditUser(selectedUser)}
                          className="px-4 py-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 text-sm"
                        >
                          ✏️ Edit User
                        </button>
                        <button
                          onClick={() =>
                            toggleUserStatus(
                              selectedUser._id,
                              selectedUser.isActive,
                              selectedUser.firstName,
                            )
                          }
                          className={`px-4 py-2 rounded-lg text-sm ${
                            selectedUser.isActive
                              ? "bg-red-500/20 hover:bg-red-500/30 text-red-200"
                              : "bg-green-500/20 hover:bg-green-500/30 text-green-200"
                          }`}
                        >
                          {selectedUser.isActive
                            ? "🔴 Deactivate User"
                            : "🟢 Activate User"}
                        </button>
                        <button
                          onClick={() =>
                            deleteUser(selectedUser._id, selectedUser.email)
                          }
                          className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-sm"
                        >
                          🗑️ Delete User
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/50 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div
          className={`text-3xl bg-gradient-to-br ${color} bg-clip-text text-transparent`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
        active
          ? "text-cyan-200 border-b-2 border-cyan-200 bg-white/5"
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
      <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/10">
        {count}
      </span>
    </button>
  );
}

function DetailItem({ label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-xs text-white/40 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-white mt-1 break-words">
        {value || "-"}
      </p>
    </div>
  );
}
