import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      district: "",
      postalCode: "",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const userData = response.data.user;
      setUser(userData);

      // Populate form with existing data
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "",
        address: {
          street: userData.address?.street || "",
          city: userData.address?.city || "",
          district: userData.address?.district || "",
          postalCode: userData.address?.postalCode || "",
        },
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
      navigate("/user");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");

        // Update local storage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        navigate("/user");
      }
    } catch (error) {
      console.error("Update failed:", error);
      const message =
        error?.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    navigate("/user");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    toast.success("Logged out successfully");
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[url('/bbg.jpg')] bg-cover bg-center bg-fixed">
        <div className="min-h-screen bg-black/50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-300 border-t-transparent animate-spin"></div>
            <p className="text-white text-sm font-semibold">
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const roleLabel =
    user?.role === "provider"
      ? "🔧 Service Provider"
      : user?.role === "recycler"
        ? "♻️ Recycler"
        : user?.role === "admin"
          ? "👑 Admin"
          : "👤 Customer";

  return (
    <div className="min-h-screen w-full bg-[url('/bbg.jpg')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-black/45">
        {/* NAVBAR - Same as other pages */}
        <nav className="w-full bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/user")}
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                R
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  ReConnect
                </h1>
                <p className="text-xs text-white/60">
                  Sustainable E-Waste Management
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate("/user")}
                className="text-white/80 hover:text-white text-sm transition duration-200 hover:scale-105"
              >
                Dashboard
              </button>
              <button className="text-cyan-200 font-semibold text-sm border-b-2 border-cyan-200 pb-1">
                Edit Profile
              </button>
              <button className="text-white/80 hover:text-white text-sm transition duration-200 hover:scale-105">
                Settings
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* LEFT PANEL - 4/12 (4/10) */}
            <div className="md:col-span-4">
              <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-6 text-white sticky top-24">
                <div className="flex flex-col items-center text-center">
                  <div className="w-36 h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-green-500/20 border-2 border-white/20 shadow-lg flex items-center justify-center">
                    <div className="text-6xl font-bold bg-gradient-to-r from-cyan-200 to-green-200 bg-clip-text text-transparent">
                      {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                      {user?.lastName?.charAt(0)?.toUpperCase() || ""}
                    </div>
                  </div>

                  <h2 className="mt-6 text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-cyan-200 font-medium mt-1 text-sm">
                    {roleLabel}
                  </p>
                  <p className="text-white/60 text-xs mt-2">{user?.email}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <span>ℹ️</span>
                    <p>
                      Update your personal information and address details
                      below.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/70 mt-3">
                    <span>💡</span>
                    <p>All changes will be reflected on your profile.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL - 8/12 (6/10) */}
            <div className="md:col-span-8">
              <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-6 md:p-8 text-white">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Edit Profile
                  </h2>
                  <p className="text-sm text-white/60 mt-1">
                    Update your personal information and address
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Basic Information */}
                  <SectionTitle title="📋 Basic Information" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-white/80 font-medium">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/80 font-medium">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-white/80 font-medium">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        placeholder="+94 XX XXX XXXX"
                        className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <SectionTitle title="📍 Address Information" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm text-white/80 font-medium">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        placeholder="123 Main Street"
                        className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/80 font-medium">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        placeholder="Colombo"
                        className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/80 font-medium">
                        District
                      </label>
                      <input
                        type="text"
                        name="address.district"
                        value={formData.address.district}
                        onChange={handleChange}
                        placeholder="Western"
                        className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/80 font-medium">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="address.postalCode"
                        value={formData.address.postalCode}
                        onChange={handleChange}
                        placeholder="00100"
                        className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Email (read-only) */}
                  <SectionTitle title="📧 Email Information" />
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm text-white/80 font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/5 border border-white/10 text-white/50 cursor-not-allowed"
                      />
                      <p className="text-xs text-white/40 mt-1">
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8 pt-4 border-t border-white/10">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 h-12 rounded-lg text-sm font-bold text-slate-900 bg-gradient-to-r from-cyan-300 to-green-300 hover:from-cyan-200 hover:to-green-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4 text-slate-800"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving Changes...
                        </span>
                      ) : (
                        "💾 Save Changes"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 h-12 rounded-lg text-sm font-semibold text-white border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-200"
                    >
                      ← Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-wider text-white/50 mt-6 mb-3 first:mt-0">
      {title}
    </h2>
  );
}
