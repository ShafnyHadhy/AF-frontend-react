import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot Password Popup States
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOTP, setResetOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetStep, setResetStep] = useState(1);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const navigate = useNavigate();

  async function login() {
    try {
      setError("");

      if (!email || !password) {
        setError("Please enter email and password");
        toast.error("Please enter email and password");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          email,
          password,
        },
      );

      const data = response.data;
      const user = data.user;

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", user.email);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      toast.success("Login successful!");

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "provider") {
        navigate("/provider");
      } else if (user.role === "customer") {
        navigate("/");
      } else if (user.role === "recycler") {
        navigate("/provider");
      } else {
        navigate("/");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";

      setError(message);

      if (err?.response?.data?.needsVerification) {
        localStorage.setItem(
          "verifyEmail",
          err?.response?.data?.email || email,
        );
        toast.error("Please verify your email first");
        navigate("/verify-otp");
        return;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  // ==================== FORGOT PASSWORD FUNCTIONS ====================

  // Step 1: Request OTP
  async function requestResetOTP() {
    if (!resetEmail) {
      setResetMessage("Please enter your email address");
      toast.error("Please enter your email address");
      return;
    }

    setResetLoading(true);
    setResetMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/forgot-password`,
        { email: resetEmail },
      );

      if (response.data.success) {
        setResetMessage("✅ OTP sent to your email! Check your inbox.");
        toast.success("OTP sent to your email!");
        setResetStep(2);
      } else {
        setResetMessage(response.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to send OTP";
      setResetMessage(`❌ ${message}`);
      toast.error(message);
    } finally {
      setResetLoading(false);
    }
  }

  // Verify OTP and Reset Password
  async function resetPasswordWithOTP() {
    // Validation
    if (!resetOTP) {
      setResetMessage("Please enter the OTP");
      toast.error("Please enter the OTP");
      return;
    }

    if (resetOTP.length !== 6) {
      setResetMessage("OTP must be 6 digits");
      toast.error("OTP must be 6 digits");
      return;
    }

    if (!newPassword) {
      setResetMessage("Please enter new password");
      toast.error("Please enter new password");
      return;
    }

    if (newPassword.length < 8) {
      setResetMessage("Password must be at least 8 characters");
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setResetMessage("Password must contain at least one uppercase letter");
      toast.error("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setResetMessage("Password must contain at least one lowercase letter");
      toast.error("Password must contain at least one lowercase letter");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setResetMessage("Password must contain at least one number");
      toast.error("Password must contain at least one number");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetMessage("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    setResetLoading(true);
    setResetMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/reset-password-with-otp`,
        {
          email: resetEmail,
          otp: resetOTP,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
      );

      if (response.data.success) {
        setResetMessage("✅ Password reset successfully! You can now login.");
        toast.success("Password reset successful!");

        // Close popup after 2 seconds
        setTimeout(() => {
          setShowForgotPopup(false);
          // Reset form
          setResetEmail("");
          setResetOTP("");
          setNewPassword("");
          setConfirmPassword("");
          setResetStep(1);
          setResetMessage("");
        }, 2000);
      } else {
        setResetMessage(`❌ ${response.data.message}`);
        toast.error(response.data.message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to reset password";
      setResetMessage(`❌ ${message}`);
      toast.error(message);
    } finally {
      setResetLoading(false);
    }
  }

  // Resend OTP
  async function resendOTP() {
    setResetLoading(true);
    setResetMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/resend-reset-otp`,
        { email: resetEmail },
      );

      if (response.data.success) {
        setResetMessage("✅ New OTP sent to your email!");
        toast.success("New OTP sent!");
      } else {
        setResetMessage(response.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to resend OTP";
      setResetMessage(`❌ ${message}`);
      toast.error(message);
    } finally {
      setResetLoading(false);
    }
  }

  // Close popup and reset state
  function closeForgotPopup() {
    setShowForgotPopup(false);
    setResetEmail("");
    setResetOTP("");
    setNewPassword("");
    setConfirmPassword("");
    setResetStep(1);
    setResetMessage("");
    setResetLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      login();
    }
  }

  return (
    <div className="min-h-screen w-full bg-[url('/bbg.jpg')] bg-cover bg-center overflow-hidden bg-fixed">
      <nav className="w-full bg-black/40 backdrop-blur-md border-b border-white/10 fixed top-0 left-0 z-50">
        <div className="max-w-300 mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#166534] flex items-center justify-center text-white shadow-lg shadow-green-900/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">eco</span>
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
              onClick={() => navigate("/register/step1")}
              className="px-5 py-2 rounded-lg bg-linear-to-r from-cyan-500/20 to-green-500/20 border border-white/20 text-white text-sm font-semibold hover:from-cyan-500/30 hover:to-green-500/30 transition-all duration-200 hover:scale-105"
            >
              Register
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
        <div className="w-full max-w-300">
          <div className="grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-white/10 backdrop-blur-xl">
            <div className="md:col-span-4 relative p-6 text-white flex flex-col justify-between">
              {" "}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/30 via-cyan-400/15 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-5">
                  {" "}
                  <div>
                    <p className="text-xs text-white/70">Welcome back to</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#166534] flex items-center justify-center text-white shadow-lg shadow-green-900/20 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[20px]">
                          eco
                        </span>
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                          ReVolve
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-1">
                  {" "}
                  <h1 className="text-3xl md:text-2xl font-bold leading-tight">
                    Sign in to Your Account
                  </h1>
                  <p className="mt-3 text-sm text-white/80 leading-relaxed">
                    {" "}
                    Customers, service providers and recyclers — all in one
                    place. Access your dashboard and manage your activities
                    seamlessly.
                  </p>
                </div>

                <div className="mt-6 grid gap-3">
                  {" "}
                  <InfoCard
                    title="Customers"
                    desc="Request repairs, track e-waste disposal, and earn rewards."
                  />
                  <InfoCard
                    title="Service Providers"
                    desc="Manage service requests, update availability, and grow business."
                  />
                  <InfoCard
                    title="Recyclers"
                    desc="Handle recycling requests, manage collections, and track impact."
                  />
                </div>

                <div className="mt-6 text-[11px] text-white/40 border-t border-white/10 pt-4">
                  {" "}
                  Secure login. Your data is protected with industry-standard
                  encryption.
                </div>
              </div>
            </div>

            <div className="md:col-span-8 p-6 bg-white/5 flex items-center justify-center">
              {" "}
              <div className="w-full max-w-xl">
                <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-xl p-6">
                  {" "}
                  <div className="mb-4 text-center">
                    {" "}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-white/20 mb-2">
                      {" "}
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {" "}
                      Welcome Back
                    </h3>
                    <p className="text-xs text-white/70 mt-0.5">
                      {" "}
                      Enter your credentials to access your account
                    </p>
                  </div>
                  {error && (
                    <div className="mb-4 rounded-lg border border-red-300/30 bg-red-500/15 px-3 py-2 text-xs text-red-100">
                      {" "}
                      {}
                      ⚠️ {error}
                    </div>
                  )}
                  <div className="space-y-3">
                    {" "}
                    {}
                    <div>
                      <label className="text-xs text-white/80 font-medium">
                        {" "}
                        {}
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="you@example.com"
                        className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200" // Reduced h-11 to h-10
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/80 font-medium">
                        {" "}
                        {}
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="••••••"
                        className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200" // Reduced h-11 to h-10
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-white/30 bg-white/10"
                        />
                        Remember me
                      </label>
                      <button
                        onClick={() => {
                          setResetEmail(email);
                          setShowForgotPopup(true);
                        }}
                        className="text-xs text-cyan-200 hover:text-cyan-100 transition"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <button
                      onClick={login}
                      disabled={loading}
                      className="mt-1 w-full h-10 rounded-lg text-sm font-bold text-slate-900 bg-linear-to-r from-cyan-300 to-blue-300 hover:from-cyan-200 hover:to-blue-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]" // Reduced mt-2 to mt-1, h-12 to h-10
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
                          Signing in...
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                    <div className="relative my-3">
                      {" "}
                      {}
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-transparent text-white/50">
                          New to ReVolve?
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/register/step1")}
                      className="w-full h-10 rounded-lg text-sm font-semibold text-white border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-200" // Reduced h-11 to h-10
                    >
                      Create New Account
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-center text-xs text-white/60">
                  {" "}
                  {}
                  Don't have an account?{" "}
                  <button
                    onClick={() => navigate("/register/step1")}
                    className="font-semibold text-cyan-200 hover:text-cyan-100 transition-all duration-200 underline decoration-cyan-300/30 hover:decoration-cyan-200"
                  >
                    Register here
                  </button>
                </p>

                <p className="mt-1 text-center text-[11px] text-white/40">
                  {" "}
                  {}
                  Same login works for all user roles (Customer, Provider,
                  Recycler)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== FORGOT PASSWORD POPUP MODAL ==================== */}
      {showForgotPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full shadow-2xl border border-white/20 animate-fade-in">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">
                    {resetStep === 1
                      ? "Reset Password"
                      : "Enter OTP & New Password"}
                  </h2>
                </div>
                <button
                  onClick={closeForgotPopup}
                  className="text-white/60 hover:text-white transition text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Message */}
              {resetMessage && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm ${
                    resetMessage.includes("✅")
                      ? "bg-green-500/20 text-green-200 border border-green-500/30"
                      : "bg-red-500/20 text-red-200 border border-red-500/30"
                  }`}
                >
                  {resetMessage}
                </div>
              )}

              {/* Step 1: Email Input */}
              {resetStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/80 font-medium block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full h-11 rounded-lg px-3 text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={requestResetOTP}
                    disabled={resetLoading}
                    className="w-full h-11 rounded-lg text-sm font-bold text-white bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50"
                  >
                    {resetLoading ? "Sending..." : "Send Reset OTP"}
                  </button>
                </div>
              )}

              {/* OTP + New Password */}
              {resetStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/80 font-medium block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      disabled
                      className="w-full h-11 rounded-lg px-3 text-sm bg-white/5 border border-white/10 text-white/60 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-white/80 font-medium block mb-1">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      value={resetOTP}
                      onChange={(e) => setResetOTP(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className="w-full h-11 rounded-lg px-3 text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200 text-center tracking-widest"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-white/80 font-medium block mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 rounded-lg px-3 text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                    />
                    <p className="text-xs text-white/40 mt-1">
                      Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-white/80 font-medium block mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 rounded-lg px-3 text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 transition-all duration-200"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={resendOTP}
                      disabled={resetLoading}
                      className="flex-1 h-11 rounded-lg text-sm font-semibold text-white border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                    <button
                      onClick={resetPasswordWithOTP}
                      disabled={resetLoading}
                      className="flex-1 h-11 rounded-lg text-sm font-bold text-white bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50"
                    >
                      {resetLoading ? "Resetting..." : "Reset Password"}
                    </button>
                  </div>
                </div>
              )}

              {/* Footer Note */}
              <p className="text-center text-xs text-white/40 mt-4">
                {resetStep === 1
                  ? "We'll send a 6-digit OTP to your email address"
                  : "OTP expires in 10 minutes"}
              </p>
            </div>
          </div>
        </div>
      )}
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
