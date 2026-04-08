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
    <div className="min-h-screen w-full bg-[url('/bbg.jpg')] bg-cover bg-center overflow-hidden">
      <div className="min-h-screen w-full bg-black/50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-white/10 backdrop-blur-xl">
            <div className="relative p-6 md:p-8 text-white flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/25 via-cyan-400/10 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/15 border border-white/15 flex items-center justify-center text-sm font-bold">
                    R
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Create account on</p>
                    <h2 className="text-xl font-bold">ReConnect Platform</h2>
                  </div>
                </div>

                <div className="mt-6">
                  <h1 className="text-2xl md:text-3xl font-bold leading-snug">
                    Register by selecting your role.
                  </h1>
                  <p className="mt-3 text-sm text-white/80">
                    Customer, provider and recycler can register here. Admin
                    registration is not available.
                  </p>
                </div>

                <div className="mt-6 grid gap-2">
                  <InfoCard
                    title="Customer"
                    desc="Register and manage your requests."
                  />
                  <InfoCard
                    title="Provider"
                    desc="Join as a repair center or service provider."
                  />
                  <InfoCard
                    title="Recycler"
                    desc="Register as an e-waste recycler."
                  />
                </div>

                <div className="mt-6 text-[10px] text-white/60">
                  After registration, verify your email using the OTP sent to
                  your inbox.
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-white/5 flex items-center justify-center">
              <div className="w-full max-w-lg">
                <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-xl p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white">Register</h3>
                    <p className="text-xs text-white/70 mt-1">
                      Fill your details and choose your role
                    </p>
                  </div>

                  {error && (
                    <div className="mb-3 rounded-lg border border-red-300/30 bg-red-500/15 px-3 py-2 text-xs text-red-100">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/80">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/80">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs text-white/80">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs text-white/80">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs text-white/80">Role</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                      >
                        <option className="text-black" value="customer">
                          Customer
                        </option>
                        <option className="text-black" value="provider">
                          Provider
                        </option>
                        <option className="text-black" value="recycler">
                          Recycler
                        </option>
                      </select>
                    </div>

                    {formData.role === "provider" && (
                      <>
                        <div className="md:col-span-2">
                          <p className="text-sm font-semibold text-cyan-200 mt-2">
                            Provider Details
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs text-white/80">
                            Company Name
                          </label>
                          <input
                            type="text"
                            name="providerDetails.companyName"
                            value={formData.providerDetails.companyName}
                            onChange={handleChange}
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-white/80">
                            Company Phone
                          </label>
                          <input
                            type="text"
                            name="providerDetails.companyPhone"
                            value={formData.providerDetails.companyPhone}
                            onChange={handleChange}
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-white/80">
                            Registration No
                          </label>
                          <input
                            type="text"
                            name="providerDetails.companyRegistrationNo"
                            value={
                              formData.providerDetails.companyRegistrationNo
                            }
                            onChange={handleChange}
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs text-white/80">
                            Specialization (comma separated)
                          </label>
                          <input
                            type="text"
                            name="providerDetails.specialization"
                            value={formData.providerDetails.specialization}
                            onChange={handleChange}
                            placeholder="Laptop, Mobile, TV"
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/50"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-white/80">
                            Experience
                          </label>
                          <input
                            type="number"
                            name="providerDetails.experience"
                            value={formData.providerDetails.experience}
                            onChange={handleChange}
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-white/80">
                            Years in Business
                          </label>
                          <input
                            type="number"
                            name="providerDetails.yearsInBusiness"
                            value={formData.providerDetails.yearsInBusiness}
                            onChange={handleChange}
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-white/80">
                            Employee Count
                          </label>
                          <input
                            type="number"
                            name="providerDetails.employeeCount"
                            value={formData.providerDetails.employeeCount}
                            onChange={handleChange}
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs text-white/80">
                            Service Area (comma separated)
                          </label>
                          <input
                            type="text"
                            name="providerDetails.serviceArea"
                            value={formData.providerDetails.serviceArea}
                            onChange={handleChange}
                            placeholder="Colombo, Gampaha, Kandy"
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/50"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs text-white/80">
                            Description
                          </label>
                          <textarea
                            name="providerDetails.description"
                            value={formData.providerDetails.description}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 w-full rounded-lg px-3 py-2 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/50"
                          />
                        </div>
                      </>
                    )}

                    {formData.role === "recycler" && (
                      <>
                        <div className="md:col-span-2">
                          <p className="text-sm font-semibold text-cyan-200 mt-2">
                            Recycler Details
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs text-white/80">
                            Company Name
                          </label>
                          <input
                            type="text"
                            name="recyclerDetails.companyName"
                            value={formData.recyclerDetails.companyName}
                            onChange={handleChange}
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-white/80">
                            Company Phone
                          </label>
                          <input
                            type="text"
                            name="recyclerDetails.companyPhone"
                            value={formData.recyclerDetails.companyPhone}
                            onChange={handleChange}
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-white/80">
                            Registration No
                          </label>
                          <input
                            type="text"
                            name="recyclerDetails.companyRegistrationNo"
                            value={
                              formData.recyclerDetails.companyRegistrationNo
                            }
                            onChange={handleChange}
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs text-white/80">
                            Recycling Types (comma separated)
                          </label>
                          <input
                            type="text"
                            name="recyclerDetails.recyclingTypes"
                            value={formData.recyclerDetails.recyclingTypes}
                            onChange={handleChange}
                            placeholder="Plastic, Metal, E-waste"
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/50"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs text-white/80">
                            Collection Points (comma separated)
                          </label>
                          <input
                            type="text"
                            name="recyclerDetails.collectionPoints"
                            value={formData.recyclerDetails.collectionPoints}
                            onChange={handleChange}
                            placeholder="Colombo, Negombo"
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/50"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-white/80">
                            Price Per Kg
                          </label>
                          <input
                            type="number"
                            name="recyclerDetails.pricePerKg"
                            value={formData.recyclerDetails.pricePerKg}
                            onChange={handleChange}
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white"
                          />
                        </div>

                        <div className="flex items-end">
                          <label className="flex items-center gap-2 text-sm text-white">
                            <input
                              type="checkbox"
                              name="recyclerDetails.pickupServiceAvailable"
                              checked={
                                formData.recyclerDetails.pickupServiceAvailable
                              }
                              onChange={handleChange}
                            />
                            Pickup Service Available
                          </label>
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs text-white/80">
                            Certifications (comma separated)
                          </label>
                          <input
                            type="text"
                            name="recyclerDetails.certifications"
                            value={formData.recyclerDetails.certifications}
                            onChange={handleChange}
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs text-white/80">
                            Service Area (comma separated)
                          </label>
                          <input
                            type="text"
                            name="recyclerDetails.serviceArea"
                            value={formData.recyclerDetails.serviceArea}
                            onChange={handleChange}
                            placeholder="Galle, Matara, Colombo"
                            className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/50"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="text-xs text-white/80">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/80">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="mt-4 w-full h-10 rounded-lg text-sm font-semibold text-slate-900 bg-gradient-to-r from-cyan-200 to-green-200 hover:from-cyan-100 hover:to-green-100 transition disabled:opacity-60"
                  >
                    {loading ? "Creating account..." : "Register"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="mt-3 w-full h-10 rounded-lg text-sm font-semibold text-white border border-white/20 bg-white/10 hover:bg-white/15 transition"
                  >
                    Back to Login
                  </button>
                </div>

                <p className="mt-3 text-center text-xs text-white/70">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="font-semibold text-cyan-200 hover:text-cyan-100"
                  >
                    Login here
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
    <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-white/80">{desc}</p>
    </div>
  );
}
