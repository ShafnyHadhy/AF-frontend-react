import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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

      setUser(response.data.user);
      setPreviewImage(response.data.user.profileImage || "");
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
      handleLogout();
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

  function handleGoBack() {
    navigate(-1);
  }

  function handleEditProfile() {
    navigate("/edit-profile");
  }

  function handleSelectImage() {
    fileInputRef.current?.click();
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    // File size check (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // File type check
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, GIF, WEBP images are allowed");
      return;
    }

    // Preview
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/profile/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        toast.success("Profile image updated successfully");
        // Refresh user data to get the latest profile image URL
        await fetchProfile();
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
      // Reset preview on error
      setPreviewImage(user?.profileImage || "");
    } finally {
      setUploading(false);
    }
  }

  const email = localStorage.getItem("email");
  const providerName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "User";

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-green-400 border-t-transparent animate-spin"></div>
            <p className="text-gray-600 text-sm font-semibold">
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-800 text-xl font-semibold">
              User not found
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  const roleLabel =
    user.role === "provider"
      ? "Service Provider"
      : user.role === "recycler"
        ? "Recycler"
        : user.role === "admin"
          ? "Admin"
          : "Customer";

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-['Inter']">
      {/* Header Navigation - Same as ProviderDashboardLayout */}
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
                  onClick={() => navigate("/user")}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2
                  ${
                    window.location.pathname === "/user"
                      ? "bg-green-50 text-green-700"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  My Profile
                </button>
              </nav>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoBack}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-1 group"
                title="Go back"
              >
                <span className="material-symbols-outlined text-[22px] group-hover:-translate-x-0.5 transition-transform">
                  arrow_back
                </span>
                <span className="text-sm font-medium hidden sm:inline">
                  Back
                </span>
              </button>
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
              onClick={() => navigate("/user")}
              className="whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-xs transition-all bg-[#166534] text-white shadow-md shadow-green-900/10"
            >
              My Profile
            </button>
            <button
              onClick={handleGoBack}
              className="whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-xs transition-all bg-green-100 text-green-600 hover:bg-green-200 shadow-sm flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">
                arrow_back
              </span>
              Back
            </button>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="md:col-span-4">
            <div className="rounded-3xl bg-white shadow-xl p-6 text-gray-800 border-2 border-green-200">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-36 h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border-1 border-green-200 shadow-lg">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                        {user.lastName?.charAt(0)?.toUpperCase() || ""}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSelectImage}
                    disabled={uploading}
                    className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-lg transition-all duration-200 whitespace-nowrap flex items-center gap-1
                      ${
                        uploading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      }`}
                  >
                    {uploading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>📸 Change Photo</>
                    )}
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>

                <h2 className="mt-8 text-2xl font-bold text-gray-800">
                  {fullName || "User Name"}
                </h2>
                <p className="text-green-600 font-medium mt-1 text-sm">
                  {roleLabel}
                </p>

                <div className="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                  {user.isActive ? "🟢 Active Account" : "🔴 Inactive Account"}
                </div>
              </div>

              <div className="border-t border-green-200 my-6"></div>

              <div className="space-y-3">
                <LeftMiniCard title="Email" value={user.email || "-"} />
                <LeftMiniCard title="Phone" value={user.phoneNumber || "-"} />
                <LeftMiniCard title="City" value={user.address?.city || "-"} />
                <LeftMiniCard
                  title="District"
                  value={user.address?.district || "-"}
                />
                <LeftMiniCard
                  title="Member Since"
                  value={
                    user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"
                  }
                />
              </div>
            </div>
          </div>

          {/* Right Content - About Section */}
          <div className="md:col-span-8">
            <div className="rounded-3xl bg-white shadow-xl p-6 md:p-8 text-gray-800 border-2 border-green-200">
              <div className="flex flex-wrap justify-between items-center gap-6 border-b border-green-200 pb-4 mb-6">
                <button className="flex items-center gap-2 font-semibold border-b-2 border-green-500 pb-2 text-sm text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  About
                </button>

                <button
                  onClick={handleEditProfile}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:scale-105"
                >
                  ✏️ Edit Profile
                </button>
              </div>

              <SectionTitle title="Basic Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard label="First Name" value={user.firstName} />
                <InfoCard label="Last Name" value={user.lastName} />
                <InfoCard label="Email" value={user.email} />
                <InfoCard label="Phone Number" value={user.phoneNumber} />
                <InfoCard label="Role" value={roleLabel} />
                <InfoCard
                  label="Status"
                  value={user.isActive ? "🟢 Active" : "🔴 Inactive"}
                />
              </div>

              <div className="border-t border-green-200 my-6"></div>

              <SectionTitle title="Address Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard label="Street" value={user.address?.street || "-"} />
                <InfoCard label="City" value={user.address?.city || "-"} />
                <InfoCard
                  label="District"
                  value={user.address?.district || "-"}
                />
                <InfoCard
                  label="Postal Code"
                  value={user.address?.postalCode || "-"}
                />
              </div>

              {/* Customer Details */}
              {user.role === "customer" && user.customerDetails && (
                <>
                  <div className="border-t border-green-200 my-6"></div>
                  <SectionTitle title="Customer Details" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                      label="Loyalty Points"
                      value={` ${user.customerDetails?.loyaltyPoints ?? 0} points`}
                    />
                    <InfoCard
                      label="Total Repairs"
                      value={` ${user.customerDetails?.totalRepairs ?? 0} repairs`}
                    />
                  </div>
                </>
              )}

              {/* Provider Details */}
              {user.role === "provider" && user.providerDetails && (
                <>
                  <div className="border-t border-green-200 my-6"></div>
                  <SectionTitle title="Provider Details" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                      label="Company Name"
                      value={user.providerDetails?.companyName || "-"}
                    />
                    <InfoCard
                      label="Company Phone"
                      value={user.providerDetails?.companyPhone || "-"}
                    />
                    <InfoCard
                      label="Registration No"
                      value={user.providerDetails?.companyRegistrationNo || "-"}
                    />
                    <InfoCard
                      label="Specialization"
                      value={
                        user.providerDetails?.specialization?.join(", ") || "-"
                      }
                    />
                    <InfoCard
                      label="Experience"
                      value={`${user.providerDetails?.experience ?? 0} years`}
                    />
                    <InfoCard
                      label="Years In Business"
                      value={`${user.providerDetails?.yearsInBusiness ?? 0} years`}
                    />
                    <InfoCard
                      label="Employee Count"
                      value={user.providerDetails?.employeeCount ?? 0}
                    />
                    <InfoCard
                      label="Service Area"
                      value={
                        user.providerDetails?.serviceArea?.join(", ") || "-"
                      }
                    />
                    <InfoCard
                      label="Available"
                      value={
                        user.providerDetails?.isAvailable ? "✅ Yes" : "❌ No"
                      }
                    />
                    <InfoCard
                      label="Completed Jobs"
                      value={user.providerDetails?.completedJobs ?? 0}
                    />
                    <InfoCard
                      label="Rating"
                      value={` ${user.providerDetails?.rating?.average ?? 0} (${user.providerDetails?.rating?.count ?? 0} reviews)`}
                    />
                  </div>
                  <div className="mt-4">
                    <InfoCard
                      label="Description"
                      value={user.providerDetails?.description || "-"}
                    />
                  </div>
                </>
              )}

              {/* Recycler Details */}
              {user.role === "recycler" && user.recyclerDetails && (
                <>
                  <div className="border-t border-green-200 my-6"></div>
                  <SectionTitle title="Recycler Details" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                      label="Company Name"
                      value={user.recyclerDetails?.companyName || "-"}
                    />
                    <InfoCard
                      label="Company Phone"
                      value={user.recyclerDetails?.companyPhone || "-"}
                    />
                    <InfoCard
                      label="Registration No"
                      value={user.recyclerDetails?.companyRegistrationNo || "-"}
                    />
                    <InfoCard
                      label="Recycling Types"
                      value={
                        user.recyclerDetails?.recyclingTypes?.join(", ") || "-"
                      }
                    />
                    <InfoCard
                      label="Collection Points"
                      value={
                        user.recyclerDetails?.collectionPoints?.join(", ") ||
                        "-"
                      }
                    />
                    <InfoCard
                      label="Pickup Service"
                      value={
                        user.recyclerDetails?.pickupService?.available
                          ? "✅ Available"
                          : "❌ Not Available"
                      }
                    />
                    <InfoCard
                      label="Price Per Kg"
                      value={`LKR ${user.recyclerDetails?.pricing?.pricePerKg ?? 0}`}
                    />
                    <InfoCard
                      label="Certifications"
                      value={
                        user.recyclerDetails?.certifications?.join(", ") || "-"
                      }
                    />
                    <InfoCard
                      label="Service Area"
                      value={
                        user.recyclerDetails?.serviceArea?.join(", ") || "-"
                      }
                    />
                    <InfoCard
                      label="Total Recycled"
                      value={`${user.recyclerDetails?.totalRecycled ?? 0} kg`}
                    />
                    <InfoCard
                      label="Available"
                      value={
                        user.recyclerDetails?.isAvailable ? "✅ Yes" : "❌ No"
                      }
                    />
                    <InfoCard
                      label="Rating"
                      value={`${user.recyclerDetails?.rating?.average ?? 0}`}
                    />
                  </div>
                </>
              )}

              {/* Admin Details */}
              {user.role === "admin" && user.adminDetails && (
                <>
                  <div className="border-t border-green-200 my-6"></div>
                  <SectionTitle title="Admin Details" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                      label="Department"
                      value={user.adminDetails?.department || "-"}
                    />
                    <InfoCard
                      label="Access Level"
                      value={user.adminDetails?.accessLevel || "-"}
                    />
                    <InfoCard
                      label="Permissions"
                      value={user.adminDetails?.permissions?.join(", ") || "-"}
                    />
                  </div>
                </>
              )}
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

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl border border-green-100 bg-green-50/30 px-4 py-3 transition-all duration-200 hover:bg-green-50 hover:border-green-200 hover:scale-[1.02]">
      <p className="text-xs uppercase tracking-wide text-green-600">{label}</p>
      <p className="text-sm md:text-base font-semibold text-gray-800 mt-1 break-words">
        {value || "—"}
      </p>
    </div>
  );
}

function LeftMiniCard({ title, value }) {
  return (
    <div className="rounded-xl border border-green-100 bg-green-50/30 px-4 py-3 transition-all duration-200 hover:bg-green-50 hover:border-green-200">
      <p className="text-xs uppercase tracking-wide text-green-600">{title}</p>
      <p className="text-sm font-semibold text-gray-800 mt-1 break-words">
        {value || "—"}
      </p>
    </div>
  );
}
