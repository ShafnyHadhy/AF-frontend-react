import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProviderDashboardLayout({
  activeTab,
  setActiveTab,
  providerName,
  children,
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for header shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "overview", label: "Dashboard" },
    { id: "inbox", label: "Requests" },
    { id: "profile", label: "My Profile" },
    { id: "earnings", label: "Earnings" },
    { id: "settings", label: "Settings" },
  ];

  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavigation = (itemId) => {
    // if (itemId === "profile") {
    //   navigate("/user");
    // } else {
      
    // }
    setActiveTab(itemId);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-['Inter']">
      {/* Header Navigation */}
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
              <div className="flex items-center gap-2.5 group cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-[#166534] flex items-center justify-center text-white shadow-sm shadow-green-900/20 group-hover:scale-105 transition-transform">
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
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2
                    ${
                      activeTab === item.id && item.id !== "profile"
                        ? "bg-green-50 text-green-700"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
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
                      Pro Provider
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white overflow-hidden shadow-sm">
                    <img
                      src={`https://ui-avatars.com/api/?name=${providerName}&background=0D9488&color=fff`}
                      alt="avatar"
                    />
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
                        setActiveTab("settings");
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        settings
                      </span>{" "}
                      Settings
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

          {/* Mobile Navigation - Styled like a pill bar */}
          <div className="lg:hidden py-3 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-50">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-xs transition-all
                ${
                  activeTab === item.id && item.id !== "profile"
                    ? "bg-[#166534] text-white shadow-md shadow-green-900/10"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content wrapper with a subtle background or border if needed */}
        <div className="min-h-[calc(100vh-160px)]">{children}</div>
      </main>

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
