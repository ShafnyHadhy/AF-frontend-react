import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function VerifyOTPPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const savedEmail = localStorage.getItem("verifyEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  async function handleVerifyOTP() {
    try {
      setError("");

      if (!email || !otp) {
        setError("Please enter email and OTP");
        toast.error("Please enter email and OTP");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/verify-otp`,
        {
          email,
          otp,
        },
      );

      if (response.data.success) {
        toast.success("Email verified successfully");
        localStorage.removeItem("verifyEmail");
        navigate("/login");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "OTP verification failed";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOTP() {
    try {
      setError("");

      if (!email) {
        setError("Email is required");
        toast.error("Email is required");
        return;
      }

      setResending(true);

      console.log("Sending resend OTP request for:", email);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/resend-otp`,
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Resend response:", response.data);

      if (response.data.success) {
        toast.success("OTP resent successfully! Check your email.");
        setCountdown(60); // Disable resend button for 60 seconds

        // If dev OTP is provided, show it in console
        if (response.data.devOTP) {
          console.log("📱 Development OTP:", response.data.devOTP);
        }
      } else {
        toast.error(response.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      console.error("Error response:", err.response?.data);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to resend OTP. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setResending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleVerifyOTP();
    }
  }

  return (
    <div className="min-h-screen w-full bg-[url('/bbg.jpg')] bg-cover bg-center overflow-hidden">
      <div className="min-h-screen w-full bg-black/50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-white/10 backdrop-blur-xl">
            <div className="relative p-6 md:p-8 text-white flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/25 via-cyan-400/10 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/15 border border-white/15 flex items-center justify-center text-sm font-bold">
                    OTP
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Email verification</p>
                    <h2 className="text-xl font-bold">ReConnect Platform</h2>
                  </div>
                </div>

                <div className="mt-6">
                  <h1 className="text-2xl md:text-3xl font-bold leading-snug">
                    Verify your email address.
                  </h1>
                  <p className="mt-3 text-sm text-white/80">
                    Enter the OTP sent to your email to activate your account.
                  </p>
                </div>

                <div className="mt-6 grid gap-2">
                  <StepCard text="Check your email inbox" />
                  <StepCard text="Enter the OTP code" />
                  <StepCard text="Complete verification and login" />
                </div>

                <div className="mt-6 text-[10px] text-white/60">
                  OTP expires in 3 minutes, so verify as soon as possible.
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-white/5 flex items-center justify-center">
              <div className="w-full max-w-sm">
                <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-xl p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white">Verify OTP</h3>
                    <p className="text-xs text-white/70 mt-1">
                      Enter your email and OTP code
                    </p>
                  </div>

                  {error && (
                    <div className="mb-3 rounded-lg border border-red-300/30 bg-red-500/15 px-3 py-2 text-xs text-red-100">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-white/80">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/80">OTP Code</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter OTP"
                        className="mt-1 w-full h-10 rounded-lg px-3 text-sm bg-white/15 border border-white/15 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                      />
                    </div>

                    <button
                      onClick={handleVerifyOTP}
                      disabled={loading}
                      className="w-full h-10 rounded-lg text-sm font-semibold text-slate-900 bg-gradient-to-r from-cyan-200 to-purple-200 hover:from-cyan-100 hover:to-purple-100 transition disabled:opacity-60"
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resending || countdown > 0}
                      className="w-full h-10 rounded-lg text-sm font-semibold text-white border border-white/20 bg-white/10 hover:bg-white/15 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resending
                        ? "Sending..."
                        : countdown > 0
                          ? `Resend OTP (${countdown}s)`
                          : "Resend OTP"}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="w-full h-10 rounded-lg text-sm font-semibold text-white border border-white/20 bg-white/10 hover:bg-white/15 transition"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-center text-xs text-white/70">
                  Wrong email?{" "}
                  <button
                    onClick={() => navigate("/register/step1")}
                    className="font-semibold text-cyan-200 hover:text-cyan-100"
                  >
                    Register again
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

function StepCard({ text }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white">
      {text}
    </div>
  );
}
