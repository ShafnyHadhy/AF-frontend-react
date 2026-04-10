import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "customer",

    providerDetails: {
      companyName: "",
      companyPhone: "",
      companyRegistrationNo: "",
      specialization: "",
      experience: "",
      description: "",
      yearsInBusiness: "",
      employeeCount: "",
      serviceArea: "",
    },

    recyclerDetails: {
      companyName: "",
      companyPhone: "",
      companyRegistrationNo: "",
      recyclingTypes: "",
      collectionPoints: "",
      pickupServiceAvailable: false,
      pricePerKg: "",
      certifications: "",
      serviceArea: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("providerDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        providerDetails: {
          ...prev.providerDetails,
          [field]: type === "checkbox" ? checked : value,
        },
      }));
      return;
    }

    if (name.startsWith("recyclerDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        recyclerDetails: {
          ...prev.recyclerDetails,
          [field]: type === "checkbox" ? checked : value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function toArray(value) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleRegister() {
    try {
      setError("");

      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        confirmPassword,
        role,
        providerDetails,
        recyclerDetails,
      } = formData;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !phoneNumber ||
        !password ||
        !confirmPassword ||
        !role
      ) {
        setError("Please fill all required fields");
        toast.error("Please fill all required fields");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        toast.error("Passwords do not match");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        toast.error("Password must be at least 6 characters");
        return;
      }

      const payload = {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role,
      };

      if (role === "customer") {
        payload.customerDetails = {};
      }

      if (role === "provider") {
        if (
          !providerDetails.companyName ||
          !providerDetails.companyPhone ||
          !providerDetails.companyRegistrationNo
        ) {
          setError("Please fill provider company details");
          toast.error("Please fill provider company details");
          return;
        }

        payload.providerDetails = {
          firstName,
          lastName,
          companyName: providerDetails.companyName,
          companyPhone: providerDetails.companyPhone,
          companyRegistrationNo: providerDetails.companyRegistrationNo,
          specialization: toArray(providerDetails.specialization),
          experience: Number(providerDetails.experience) || 0,
          bankDetails: {},
          description: providerDetails.description || "",
          yearsInBusiness: Number(providerDetails.yearsInBusiness) || 0,
          employeeCount: Number(providerDetails.employeeCount) || 1,
          serviceArea: toArray(providerDetails.serviceArea),
          workingHours: {
            monday: { open: "09:00", close: "18:00", isOpen: true },
            tuesday: { open: "09:00", close: "18:00", isOpen: true },
            wednesday: { open: "09:00", close: "18:00", isOpen: true },
            thursday: { open: "09:00", close: "18:00", isOpen: true },
            friday: { open: "09:00", close: "18:00", isOpen: true },
            saturday: { open: "09:00", close: "13:00", isOpen: true },
            sunday: { open: "00:00", close: "00:00", isOpen: false },
          },
          documents: {},
          pricing: {},
        };
      }

      if (role === "recycler") {
        if (
          !recyclerDetails.companyName ||
          !recyclerDetails.companyPhone ||
          !recyclerDetails.companyRegistrationNo
        ) {
          setError("Please fill recycler company details");
          toast.error("Please fill recycler company details");
          return;
        }

        payload.recyclerDetails = {
          firstName,
          lastName,
          companyName: recyclerDetails.companyName,
          companyPhone: recyclerDetails.companyPhone,
          companyRegistrationNo: recyclerDetails.companyRegistrationNo,
          recyclingTypes: toArray(recyclerDetails.recyclingTypes),
          collectionPoints: toArray(recyclerDetails.collectionPoints),
          pickupService: {
            available: recyclerDetails.pickupServiceAvailable,
          },
          pricing: {
            pricePerKg: Number(recyclerDetails.pricePerKg) || 0,
          },
          certifications: toArray(recyclerDetails.certifications),
          totalRecycled: 0,
          serviceArea: toArray(recyclerDetails.serviceArea),
          bankDetails: {},
        };
      }

      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/register/step1`,
        payload,
      );

      if (response.data.success) {
        localStorage.setItem("verifyEmail", email);
        toast.success("OTP sent to your email");
        navigate("/verify-otp");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Registration failed";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleRegister();
    }
  }

  return (
    <div className="min-h-screen w-full bg-[url('/bbg.jpg')] bg-cover bg-center overflow-hidden bg-fixed">
      <nav className="w-full bg-black/40 backdrop-blur-md border-b border-white/10 fixed top-0 left-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-[#166534] flex items-center justify-center text-white shadow-lg shadow-green-900/20 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[20px]">eco</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                ReVolve
              </h1>
              <p className="text-xs text-white/60">
                Sustainable E-Waste Management
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              className="text-white/80 hover:text-white text-sm transition duration-200 hover:scale-105"
            >
              Home
            </a>
            <a
              href="#"
              className="text-white/80 hover:text-white text-sm transition duration-200 hover:scale-105"
            >
              How it Works
            </a>
            <a
              href="#"
              className="text-white/80 hover:text-white text-sm transition duration-200 hover:scale-105"
            >
              My Products
            </a>
            <a
              href="#"
              className="text-white/80 hover:text-white text-sm transition duration-200 hover:scale-105"
            >
              Services
            </a>
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-white/20 text-white text-sm font-semibold hover:from-cyan-500/30 hover:to-green-500/30 transition-all duration-200 hover:scale-105"
            >
              Login
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white p-2 rounded-lg bg-white/10 border border-white/20">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-screen w-full bg-black/40 flex items-center justify-center px-6 py-8 pt-28">
        <div className="w-full max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-white/10 backdrop-blur-xl">
            <div className="md:col-span-4 relative p-8 text-white flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 via-cyan-400/15 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div>
                    <p className="text-xs text-white/70">Join the movement</p>
                    <h2 className="text-2xl font-bold">Create Account</h2>
                  </div>
                </div>

                <div className="mt-2">
                  <h1 className="text-2xl md:text-2xl font-bold leading-tight">
                    Register & Start Your
                    <br />
                    Green Journey Today
                  </h1>
                  <p className="mt-4 text-sm text-white/80 leading-relaxed">
                    Choose your role and help us build a sustainable future.
                    Whether you're a customer, service provider, or recycler,
                    ReVolve brings everyone together.
                  </p>
                </div>

                <div className="mt-10 grid gap-4">
                  <InfoCard
                    title="Customer"
                    desc="Request repairs, track e-waste disposal, and earn rewards."
                  />
                  <InfoCard
                    title="Service Provider"
                    desc="Join as a repair center, offer services, and grow your business."
                  />
                  <InfoCard
                    title="Recycler"
                    desc="Register as an authorized e-waste recycler and make an impact."
                  />
                </div>

                <div className="mt-10 text-[11px] text-white/40 border-t border-white/10 pt-5">
                  After registration, verify your email using the OTP sent to
                  your inbox
                </div>
              </div>
            </div>

            <div className="md:col-span-8 p-8 bg-white/5 flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-xl p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white">Register</h3>
                    <p className="text-sm text-white/70 mt-1">
                      Fill your details and choose your role
                    </p>
                  </div>

                  {error && (
                    <div className="mb-5 rounded-lg border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">
                      ⚠️ {error}
                    </div>
                  )}

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
                        onKeyDown={handleKeyDown}
                        placeholder="John"
                        className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 focus:border-transparent transition-all duration-200"
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
                        onKeyDown={handleKeyDown}
                        placeholder="Doe"
                        className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-white/80 font-medium">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="you@example.com"
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
                        onKeyDown={handleKeyDown}
                        placeholder="+94 XX XXX XXXX"
                        className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-white/80 font-medium">
                        Select Role *
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/70 cursor-pointer transition-all duration-200"
                      >
                        <option
                          className="text-gray-900 bg-white"
                          value="customer"
                        >
                          Customer
                        </option>
                        <option
                          className="text-gray-900 bg-white"
                          value="provider"
                        >
                          Service Provider
                        </option>
                        <option
                          className="text-gray-900 bg-white"
                          value="recycler"
                        >
                          Recycler
                        </option>
                      </select>
                    </div>

                    {formData.role === "provider" && (
                      <>
                        <div className="md:col-span-2 mt-3">
                          <p className="text-base font-semibold text-cyan-200 border-l-3 border-cyan-300 pl-3">
                            Provider Company Details
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm text-white/80">
                            Company Name *
                          </label>
                          <input
                            type="text"
                            name="providerDetails.companyName"
                            value={formData.providerDetails.companyName}
                            onChange={handleChange}
                            placeholder="TechFix Solutions"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-white/80">
                            Company Phone *
                          </label>
                          <input
                            type="text"
                            name="providerDetails.companyPhone"
                            value={formData.providerDetails.companyPhone}
                            onChange={handleChange}
                            placeholder="011 234 5678"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-white/80">
                            Registration No *
                          </label>
                          <input
                            type="text"
                            name="providerDetails.companyRegistrationNo"
                            value={
                              formData.providerDetails.companyRegistrationNo
                            }
                            onChange={handleChange}
                            placeholder="PV/2024/12345"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm text-white/80">
                            Specialization (comma separated)
                          </label>
                          <input
                            type="text"
                            name="providerDetails.specialization"
                            value={formData.providerDetails.specialization}
                            onChange={handleChange}
                            placeholder="Laptop Repair, Mobile Repair, TV Service"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-white/80">
                            Experience (years)
                          </label>
                          <input
                            type="number"
                            name="providerDetails.experience"
                            value={formData.providerDetails.experience}
                            onChange={handleChange}
                            placeholder="5"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-white/80">
                            Years in Business
                          </label>
                          <input
                            type="number"
                            name="providerDetails.yearsInBusiness"
                            value={formData.providerDetails.yearsInBusiness}
                            onChange={handleChange}
                            placeholder="3"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-white/80">
                            Employee Count
                          </label>
                          <input
                            type="number"
                            name="providerDetails.employeeCount"
                            value={formData.providerDetails.employeeCount}
                            onChange={handleChange}
                            placeholder="10"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm text-white/80">
                            Service Area (comma separated)
                          </label>
                          <input
                            type="text"
                            name="providerDetails.serviceArea"
                            value={formData.providerDetails.serviceArea}
                            onChange={handleChange}
                            placeholder="Colombo, Gampaha, Kandy"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm text-white/80">
                            Description
                          </label>
                          <textarea
                            name="providerDetails.description"
                            value={formData.providerDetails.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Tell us about your company..."
                            className="mt-1.5 w-full rounded-lg px-3 py-2 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>
                      </>
                    )}

                    {/* Recycler Details */}
                    {formData.role === "recycler" && (
                      <>
                        <div className="md:col-span-2 mt-3">
                          <p className="text-base font-semibold text-cyan-200 border-l-3 border-cyan-300 pl-3">
                            Recycler Company Details
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm text-white/80">
                            Company Name *
                          </label>
                          <input
                            type="text"
                            name="recyclerDetails.companyName"
                            value={formData.recyclerDetails.companyName}
                            onChange={handleChange}
                            placeholder="EcoRecycle Lanka"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-white/80">
                            Company Phone *
                          </label>
                          <input
                            type="text"
                            name="recyclerDetails.companyPhone"
                            value={formData.recyclerDetails.companyPhone}
                            onChange={handleChange}
                            placeholder="011 987 6543"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-white/80">
                            Registration No *
                          </label>
                          <input
                            type="text"
                            name="recyclerDetails.companyRegistrationNo"
                            value={
                              formData.recyclerDetails.companyRegistrationNo
                            }
                            onChange={handleChange}
                            placeholder="REC/2024/001"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm text-white/80">
                            Recycling Types (comma separated)
                          </label>
                          <input
                            type="text"
                            name="recyclerDetails.recyclingTypes"
                            value={formData.recyclerDetails.recyclingTypes}
                            onChange={handleChange}
                            placeholder="Plastic, Metal, E-waste, Glass"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm text-white/80">
                            Collection Points (comma separated)
                          </label>
                          <input
                            type="text"
                            name="recyclerDetails.collectionPoints"
                            value={formData.recyclerDetails.collectionPoints}
                            onChange={handleChange}
                            placeholder="Colombo, Negombo, Kandy"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-white/80">
                            Price Per Kg (LKR)
                          </label>
                          <input
                            type="number"
                            name="recyclerDetails.pricePerKg"
                            value={formData.recyclerDetails.pricePerKg}
                            onChange={handleChange}
                            placeholder="50"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div className="flex items-center mt-2">
                          <label className="flex items-center gap-3 text-sm text-white cursor-pointer">
                            <input
                              type="checkbox"
                              name="recyclerDetails.pickupServiceAvailable"
                              checked={
                                formData.recyclerDetails.pickupServiceAvailable
                              }
                              onChange={handleChange}
                              className="w-4 h-4 rounded border-white/30 bg-white/10 text-cyan-400 focus:ring-cyan-400 transition-all duration-200"
                            />
                            Pickup Service Available
                          </label>
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm text-white/80">
                            Certifications (comma separated)
                          </label>
                          <input
                            type="text"
                            name="recyclerDetails.certifications"
                            value={formData.recyclerDetails.certifications}
                            onChange={handleChange}
                            placeholder="ISO 14001, CE Certificate"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm text-white/80">
                            Service Area (comma separated)
                          </label>
                          <input
                            type="text"
                            name="recyclerDetails.serviceArea"
                            value={formData.recyclerDetails.serviceArea}
                            onChange={handleChange}
                            placeholder="Western Province, Southern Province"
                            className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                          />
                        </div>
                      </>
                    )}

                    {/* Password Fields */}
                    <div>
                      <label className="text-sm text-white/80 font-medium">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="••••••"
                        className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-white/80 font-medium">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="••••••"
                        className="mt-1.5 w-full h-11 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="mt-6 w-full h-12 rounded-lg text-sm font-bold text-slate-900 bg-gradient-to-r from-cyan-300 to-green-300 hover:from-cyan-200 hover:to-green-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {loading ? (
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
                        Creating account...
                      </span>
                    ) : (
                      "Register Now"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="mt-3 w-full h-11 rounded-lg text-sm font-semibold text-white border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-200"
                  >
                    ← Back to Login
                  </button>
                </div>

                <p className="mt-5 text-center text-xs text-white/60">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="font-semibold text-cyan-200 hover:text-cyan-100 transition-all duration-200 underline decoration-cyan-300/30 hover:decoration-cyan-200"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, desc }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm px-4 py-3 transition-all duration-300 hover:scale-[1.02] hover:bg-white/15 cursor-default">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-white/80 leading-relaxed mt-0.5">{desc}</p>
    </div>
  );
}
