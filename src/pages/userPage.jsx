import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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

  function handleEditProfile() {
    navigate("/edit-profile");
  }

  function handleSelectImage() {
    fileInputRef.current?.click();
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Image preview
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);

    // Upload to backend
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/upload-profile-image`,
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
        fetchProfile(); // Refresh user data
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image");
    }
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

  if (!user) {
    return (
      <div className="min-h-screen w-full bg-[url('/bbg.jpg')] bg-cover bg-center bg-fixed">
        <div className="min-h-screen bg-black/50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-white text-xl font-semibold">User not found</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-300 to-blue-300 text-slate-900 font-semibold"
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
      ? "🔧 Service Provider"
      : user.role === "recycler"
        ? "♻️ Recycler"
        : user.role === "admin"
          ? "👑 Admin"
          : "👤 Customer";

  return (
    <div className="min-h-screen w-full bg-[url('/bbg.jpg')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-black/45">
        {/* NAVBAR - Same as Register & Login Pages */}
        <nav className="w-full bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo Section */}
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

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <button className="text-white/80 hover:text-white text-sm transition duration-200 hover:scale-105">
                Dashboard
              </button>
              <button className="text-cyan-200 font-semibold text-sm border-b-2 border-cyan-200 pb-1">
                Profile
              </button>
              <button className="text-white/80 hover:text-white text-sm transition duration-200 hover:scale-105">
                Settings
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-900 bg-gradient-to-r from-cyan-300 to-green-300 hover:from-cyan-200 hover:to-green-200 transition-all duration-200 hover:scale-105"
              >
                ✏️ Edit Profile
              </button>

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
              <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-6 text-white">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="w-36 h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-green-500/20 border-2 border-white/20 shadow-lg">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl font-bold bg-gradient-to-r from-cyan-200 to-green-200 bg-clip-text text-transparent">
                          {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                          {user.lastName?.charAt(0)?.toUpperCase() || ""}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleSelectImage}
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-300 to-green-300 text-slate-900 text-xs font-semibold shadow-lg hover:from-cyan-200 hover:to-green-200 transition-all duration-200 whitespace-nowrap"
                    >
                      📸 Change Photo
                    </button>

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  <h2 className="mt-8 text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    {fullName || "User Name"}
                  </h2>
                  <p className="text-cyan-200 font-medium mt-1 text-sm">
                    {roleLabel}
                  </p>

                  <div className="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-200 border border-green-300/20">
                    {user.isActive
                      ? "🟢 Active Account"
                      : "🔴 Inactive Account"}
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <LeftMiniCard
                    icon="📧"
                    title="Email"
                    value={user.email || "-"}
                  />
                  <LeftMiniCard
                    icon="📞"
                    title="Phone"
                    value={user.phoneNumber || "-"}
                  />
                  <LeftMiniCard
                    icon="🏙️"
                    title="City"
                    value={user.address?.city || "-"}
                  />
                  <LeftMiniCard
                    icon="📍"
                    title="District"
                    value={user.address?.district || "-"}
                  />
                  <LeftMiniCard
                    icon="📅"
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

            {/* RIGHT PANEL - 8/12 (6/10) */}
            <div className="md:col-span-8">
              <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-6 md:p-8 text-white">
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-6 border-b border-white/10 pb-4 mb-6">
                  <button className="text-white/60 hover:text-white transition text-sm">
                    📊 Overview
                  </button>
                  <button className="text-cyan-200 font-semibold border-b-2 border-cyan-200 pb-2 text-sm">
                    👤 About
                  </button>
                  <button className="text-white/60 hover:text-white transition text-sm">
                    📜 Activity
                  </button>
                </div>

                {/* Basic Information */}
                <SectionTitle title="📋 Basic Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard label="First Name" value={user.firstName} />
                  <InfoCard label="Last Name" value={user.lastName} />
                  <InfoCard label="Email" value={user.email} />
                  <InfoCard label="Phone Number" value={user.phoneNumber} />
                  <InfoCard label="Role" value={roleLabel} />
                  <InfoCard
                    label="Status"
                    value={user.isActive ? "✅ Active" : "❌ Inactive"}
                  />
                </div>

                {/* Address Information */}
                <SectionTitle title="📍 Address Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    label="Street"
                    value={user.address?.street || "-"}
                  />
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
                    <SectionTitle title="🛍️ Customer Details" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoCard
                        label="Loyalty Points"
                        value={`⭐ ${user.customerDetails?.loyaltyPoints ?? 0} points`}
                      />
                      <InfoCard
                        label="Total Repairs"
                        value={`🔧 ${user.customerDetails?.totalRepairs ?? 0} repairs`}
                      />
                    </div>
                  </>
                )}

                {/* Provider Details */}
                {user.role === "provider" && user.providerDetails && (
                  <>
                    <SectionTitle title="🏢 Provider Details" />
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
                        value={
                          user.providerDetails?.companyRegistrationNo || "-"
                        }
                      />
                      <InfoCard
                        label="Specialization"
                        value={
                          user.providerDetails?.specialization?.join(", ") ||
                          "-"
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
                        value={`⭐ ${user.providerDetails?.rating?.average ?? 0} (${user.providerDetails?.rating?.count ?? 0} reviews)`}
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
                    <SectionTitle title="♻️ Recycler Details" />
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
                        value={
                          user.recyclerDetails?.companyRegistrationNo || "-"
                        }
                      />
                      <InfoCard
                        label="Recycling Types"
                        value={
                          user.recyclerDetails?.recyclingTypes?.join(", ") ||
                          "-"
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
                        value={`💰 LKR ${user.recyclerDetails?.pricing?.pricePerKg ?? 0}`}
                      />
                      <InfoCard
                        label="Certifications"
                        value={
                          user.recyclerDetails?.certifications?.join(", ") ||
                          "-"
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
                        value={`🌍 ${user.recyclerDetails?.totalRecycled ?? 0} kg`}
                      />
                      <InfoCard
                        label="Available"
                        value={
                          user.recyclerDetails?.isAvailable ? "✅ Yes" : "❌ No"
                        }
                      />
                      <InfoCard
                        label="Rating"
                        value={`⭐ ${user.recyclerDetails?.rating?.average ?? 0}`}
                      />
                    </div>
                  </>
                )}

                {/* Admin Details */}
                {user.role === "admin" && user.adminDetails && (
                  <>
                    <SectionTitle title="👑 Admin Details" />
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
                        value={
                          user.adminDetails?.permissions?.join(", ") || "-"
                        }
                      />
                    </div>
                  </>
                )}
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

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all duration-200 hover:bg-white/10 hover:scale-[1.02]">
      <p className="text-xs uppercase tracking-wide text-white/40">{label}</p>
      <p className="text-sm md:text-base font-semibold text-white mt-1 break-words">
        {value || "—"}
      </p>
    </div>
  );
}

function LeftMiniCard({ icon, title, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all duration-200 hover:bg-white/10">
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <p className="text-xs uppercase tracking-wide text-white/40">{title}</p>
      </div>
      <p className="text-sm font-semibold text-white mt-1 break-words pl-6">
        {value || "—"}
      </p>
    </div>
  );
}
