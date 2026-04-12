import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { label: "Home", path: "/" },
        { label: "My Products", path: "/my-products" },
        { label: "Services", path: "/services" },
        { label: "How It Works", path: "/how-it-works" },
        { label: "Impact", path: "/impact" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Desktop & Tablet Layout */}
                <div className="flex h-16 items-center gap-12">
                    {/* Logo + Brand */}
                    <Link to="/" className="flex items-center gap-2.5 group cursor-pointer shrink-0 hover:opacity-80 transition-opacity">
                        <div className="w-9 h-9 rounded-xl bg-[#166534] flex items-center justify-center text-white shadow-md shadow-green-900/20 group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-[20px]">
                                eco
                            </span>
                        </div>
                        <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-['Manrope']">
                            ReVolve
                        </span>
                    </Link>

                    {/* Navigation - Hidden on Mobile */}
                    <nav className="hidden items-center gap-6 lg:gap-8 md:flex flex-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                className="text-sm font-medium text-slate-600 transition-colors hover:text-[#166534] hover:underline underline-offset-4"
                                to={item.path}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Buttons - Right Aligned */}
                    <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                        <Link to="/login" className="rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900">
                            Login
                        </Link>
                        <Link to="/signup" className="rounded-lg bg-[#166534] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-green-900/20 transition-all hover:bg-[#0d4428] hover:shadow-md hover:shadow-green-900/30 active:scale-95">
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden ml-auto p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined">
                            {isMobileMenuOpen ? "close" : "menu"}
                        </span>
                    </button>
                </div>

                {/* Mobile Menu - Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pb-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                        <nav className="flex flex-col gap-2 pt-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#166534] hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="flex items-center gap-2 pt-3 px-2 border-t border-slate-100 mt-3">
                            <Link 
                                to="/login" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 text-center transition-all hover:bg-slate-100"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/signup" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex-1 rounded-lg bg-[#166534] px-3 py-2 text-sm font-semibold text-white text-center shadow-md transition-all hover:bg-[#0d4428]"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}