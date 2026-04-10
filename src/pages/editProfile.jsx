import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const fileInputRef = useRef(null);

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

  // Handle scroll effect for header shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      setPreviewImage(userData.profileImage || "");

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

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    toast.success("Logged out successfully");
    navigate("/login");
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

  const email = localStorage.getItem("email");
  const providerName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "User";

  const roleLabel =
    user?.role === "provider"
      ? "Service Provider"
      : user?.role === "recycler"
        ? "Recycler"
        : user?.role === "admin"
          ? "Admin"
          : "Customer";

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#F9FAFB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
          <p className="text-gray-600 text-sm font-semibold">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-['Inter']">
      {/* Header Navigation - Same as UserPage */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 border-b 
                ${
                  scrolled
                    ? "bg-white/80 backdrop-blur-md border-slate-200 shadow-sm"
                    : "bg-white border-transparent"
                }`}
      >
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Section: Logo + Nav */}
            <div className="flex items-center gap-10">
              {/* Logo */}
              <div
                className="flex items-center gap-2.5 group cursor-pointer"
                onClick={() => navigate("/user")}
              >
                <div className="w-9 h-9 rounded-xl bg-[#166534] flex items-center justify-center text-white shadow-lg shadow-green-900/20 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">
                    eco
                  </span>
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 font-['Manrope']">
                  ReVolve
                </span>
              </div>

              {/* Desktop Navigation - Left Aligned */}
              <nav className="hidden lg:flex items-center gap-1">
                <button
                  onClick={() => navigate("/provider")}
                  className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/provider/inbox")}
                  className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                >
                  Requests
                </button>
                <button
                  onClick={() => navigate("/user")}
                  className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                >
                  My Profile
                </button>
                <button
                  onClick={() => navigate("/provider/earnings")}
                  className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                >
                  Earnings
                </button>
                <button
                  onClick={() => navigate("/provider/settings")}
                  className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                >
                  Settings
                </button>
              </nav>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
              </button>

              <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-100 rounded-full border border-transparent hover:border-slate-200 transition-all"
                >
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {providerName}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {roleLabel}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white overflow-hidden shadow-sm">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={`https://ui-avatars.com/api/?name=${providerName}&background=0D9488&color=fff`}
                        alt="avatar"
                      />
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Signed in as
                      </p>
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/user");
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        account_circle
                      </span>{" "}
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/edit-profile");
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        settings
                      </span>{" "}
                      Edit Profile
                    </button>
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        logout
                      </span>{" "}
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden py-3 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-50">
            <button
              onClick={() => navigate("/provider")}
              className="whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-xs transition-all bg-slate-100 text-slate-500"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/provider/inbox")}
              className="whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-xs transition-all bg-slate-100 text-slate-500"
            >
              Requests
            </button>
            <button
              onClick={() => navigate("/user")}
              className="whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-xs transition-all bg-slate-100 text-slate-500"
            >
              My Profile
            </button>
            <button
              onClick={() => navigate("/provider/earnings")}
              className="whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-xs transition-all bg-slate-100 text-slate-500"
            >
              Earnings
            </button>
            <button
              onClick={() => navigate("/provider/settings")}
              className="whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-xs transition-all bg-slate-100 text-slate-500"
            >
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT PANEL */}
          <div className="md:col-span-4">
            <div className="rounded-3xl bg-white shadow-xl p-6 text-gray-800 border-2 border-green-200 sticky top-24">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-36 h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-lg flex items-center justify-center">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                        {user?.lastName?.charAt(0)?.toUpperCase() || ""}
                      </div>
                    )}
                  </div>
                </div>

                <h2 className="mt-6 text-2xl font-bold text-gray-800">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-green-600 font-medium mt-1 text-sm">
                  {roleLabel}
                </p>
                <p className="text-gray-400 text-xs mt-2">{user?.email}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-green-200">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <p>
                    Update your personal information and address details below.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-3">
                  <p>All changes will be reflected on your profile.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="md:col-span-8">
            <div className="rounded-3xl bg-white shadow-xl p-6 md:p-8 text-gray-800 border-2 border-green-200">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Profile
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update your personal information and address
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <SectionTitle title="Basic Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-gray-50 border border-green-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-300 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-gray-50 border border-green-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-300 transition-all duration-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600 font-medium">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      placeholder="+94 XX XXX XXXX"
                      className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-gray-50 border border-green-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-300 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <SectionTitle title="Address Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600 font-medium">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-gray-50 border border-green-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-300 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder="Colombo"
                      className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-gray-50 border border-green-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-300 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      District
                    </label>
                    <input
                      type="text"
                      name="address.district"
                      value={formData.address.district}
                      onChange={handleChange}
                      placeholder="Western"
                      className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-gray-50 border border-green-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-300 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      placeholder="00100"
                      className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-gray-50 border border-green-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-300 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Email (read-only) */}
                <SectionTitle title="Email Information" />
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-gray-100 border border-green-200 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 pt-4 border-t border-green-200">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-12 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
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
                      "Save Changes"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 h-12 rounded-lg text-sm font-semibold text-gray-600 border border-green-200 bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                  >
                    ← Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-slate-200 bg-slate-50">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-3 md:mb-0">
            {["Privacy", "Terms", "Report", "Support"].map((item) => (
              <a
                key={item}
                className="text-xs text-slate-500 hover:text-green-600 transition-all"
                href="#"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            © 2026 ReVolve. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-wider text-green-600 mt-6 mb-3 first:mt-0">
      {title}
    </h2>
  );
}
