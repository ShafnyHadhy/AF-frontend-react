import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProviderDashboardLayout({ activeTab, setActiveTab, providerName, children }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const navItems = [
        { id: 'overview', label: 'Dashboard'},
        { id: 'inbox', label: 'Requests'},
        { id: 'profile', label: 'My Profile'},
        { id: 'earnings', label: 'Earnings'},
        { id: 'settings', label: 'Settings'},
    ];

    const handleLogout = () => {
        // Add logout logic here
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header Navigation */}
            <header className="sticky top-0 z-50 bg-white border-b border-green-100 shadow-soft">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold">
                                U
                            </div>
                            <span className="text-lg font-bold text-slate-900">ReVolve</span>
                        </div>

                        {/* Center Navigation */}
                        <nav className="hidden lg:flex items-center gap-6">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                        activeTab === item.id
                                            ? 'text-green-600 border-b-2 border-green-600 pb-2'
                                            : 'text-slate-600 hover:text-green-600'
                                    }`}
                                >
                                    <span className="hidden md:inline">{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* Right Side - Profile & Settings */}
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="relative p-2 hover:bg-green-50 rounded-lg transition-colors">
                                <span className="text-xl">🔔</span>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-bold">
                                        {providerName.charAt(0)}
                                    </div>
                                    <div className="hidden md:flex flex-col items-start">
                                        <span className="text-xs font-medium text-slate-900">{providerName}</span>
                                        <span className="text-xs text-slate-500">Provider</span>
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-green-100 py-2 z-50">
                                        <button
                                            onClick={() => {
                                                setActiveTab('profile');
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-green-50 transition-colors"
                                        >
                                            View Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActiveTab('settings');
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-green-50 transition-colors"
                                        >
                                            Settings
                                        </button>
                                        <hr className="my-2 border-green-100" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="lg:hidden mt-3 flex gap-2 overflow-x-auto pb-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
                                    activeTab === item.id
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-6 py-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
