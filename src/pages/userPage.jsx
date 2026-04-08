import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    navigate("/login");
  }

  function handleEditProfile() {
    navigate("/edit-profile");
  }

  function handleSelectImage() {
    fileInputRef.current?.click();
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);

    // later backend upload එකත් add කරන්න පුළුවන්
    console.log("Selected image:", file);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[url('/bbg.jpg')] bg-cover bg-center">
        <div className="min-h-screen bg-black/50 flex items-center justify-center">
          <div className="text-white text-xl font-semibold">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[url('/bbg.jpg')] bg-cover bg-center">
        <div className="min-h-screen bg-black/50 flex items-center justify-center">
          <div className="text-white text-xl font-semibold">User not found</div>
        </div>
      </div>
    );
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  const roleLabel =
    user.role === "provider"
      ? "Provider"
      : user.role === "recycler"
        ? "Recycler"
        : user.role === "admin"
          ? "Admin"
          : "Customer";

  return (
    <div className="min-h-screen bg-[url('/bbg.jpg')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-black/55">
        {/* NAVBAR */}
        <nav className="w-full border-b border-white/10 bg-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-300/20 border border-white/20 flex items-center justify-center text-white font-bold">
                R
              </div>
              <div>
                <p className="text-xs text-white/70">Welcome to</p>
                <h1 className="text-lg md:text-xl font-bold text-white">
                  ReConnect Platform
                </h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
              <button className="hover:text-white transition">Dashboard</button>
              <button className="hover:text-white transition">Profile</button>
              <button className="hover:text-white transition">Settings</button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 rounded-xl bg-cyan-300 text-slate-900 font-semibold hover:bg-cyan-200 transition"
              >
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/15 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT PANEL */}
            <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-6 text-white">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-40 h-40 rounded-3xl overflow-hidden bg-white/10 border border-white/20 shadow-lg">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white/70">
                        {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSelectImage}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-cyan-300 text-slate-900 text-sm font-semibold shadow-lg hover:bg-cyan-200 transition"
                  >
                    Upload Photo
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <h2 className="mt-8 text-2xl font-bold">
                  {fullName || "User Name"}
                </h2>
                <p className="text-cyan-200 font-medium mt-1">{roleLabel}</p>

                <div className="mt-4 inline-flex rounded-full px-4 py-1 text-xs font-semibold bg-green-500/20 text-green-200 border border-green-300/20">
                  {user.isActive ? "Active Account" : "Inactive Account"}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <LeftMiniCard title="Email" value={user.email || "-"} />
                <LeftMiniCard title="Phone" value={user.phoneNumber || "-"} />
                <LeftMiniCard title="City" value={user.address?.city || "-"} />
                <LeftMiniCard
                  title="District"
                  value={user.address?.district || "-"}
                />
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="lg:col-span-2 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-6 md:p-8 text-white">
              <div className="flex flex-wrap gap-6 border-b border-white/10 pb-4 mb-6">
                <button className="text-white/70 hover:text-white transition">
                  Overview
                </button>
                <button className="text-cyan-200 font-semibold border-b-2 border-cyan-200 pb-2">
                  About
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
                  value={user.isActive ? "Active" : "Inactive"}
                />
              </div>

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

              {user.role === "customer" && user.customerDetails && (
                <>
                  <SectionTitle title="Customer Details" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                      label="Loyalty Points"
                      value={user.customerDetails?.loyaltyPoints ?? 0}
                    />
                    <InfoCard
                      label="Total Repairs"
                      value={user.customerDetails?.totalRepairs ?? 0}
                    />
                  </div>
                </>
              )}

              {user.role === "provider" && user.providerDetails && (
                <>
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
                      value={user.providerDetails?.experience ?? 0}
                    />
                    <InfoCard
                      label="Years In Business"
                      value={user.providerDetails?.yearsInBusiness ?? 0}
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
                      value={user.providerDetails?.isAvailable ? "Yes" : "No"}
                    />
                    <InfoCard
                      label="Completed Jobs"
                      value={user.providerDetails?.completedJobs ?? 0}
                    />
                    <InfoCard
                      label="Rating Average"
                      value={user.providerDetails?.rating?.average ?? 0}
                    />
                    <InfoCard
                      label="Rating Count"
                      value={user.providerDetails?.rating?.count ?? 0}
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

              {user.role === "recycler" && user.recyclerDetails && (
                <>
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
                          ? "Available"
                          : "Not Available"
                      }
                    />
                    <InfoCard
                      label="Price Per Kg"
                      value={user.recyclerDetails?.pricing?.pricePerKg ?? 0}
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
                      value={user.recyclerDetails?.totalRecycled ?? 0}
                    />
                    <InfoCard
                      label="Available"
                      value={user.recyclerDetails?.isAvailable ? "Yes" : "No"}
                    />
                    <InfoCard
                      label="Rating Average"
                      value={user.recyclerDetails?.rating?.average ?? 0}
                    />
                  </div>
                </>
              )}

              {user.role === "admin" && user.adminDetails && (
                <>
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
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h2 className="text-sm font-bold uppercase tracking-wider text-white/60 mt-8 mb-4">
      {title}
    </h2>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4">
      <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
      <p className="text-sm md:text-base font-semibold text-white mt-1 break-words">
        {value || "-"}
      </p>
    </div>
  );
}

function LeftMiniCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4">
      <p className="text-xs uppercase tracking-wide text-white/50">{title}</p>
      <p className="text-sm font-semibold text-white mt-1 break-words">
        {value || "-"}
      </p>
    </div>
  );
}
