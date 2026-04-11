import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, Settings, Activity, FileText, Package } from 'lucide-react';
import AdminDashboard from '../admin/AdminDashboard';
import UserManagement from '../admin/UserManagement';
import ProviderManagement from '../admin/ProviderManagement';
import ReportGeneration from '../admin/ReportGeneration';
import ActivityLogPage from '../admin/ActivityLogPage';
import SettingsPage from '../admin/SettingsPage';
import RequestManagement from '../admin/RequestManagement';

export default function AdminLayout() {
    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Providers', path: '/admin/providers', icon: UserCog },
        { name: 'Reports', path: '/admin/reports', icon: FileText },
        { name: 'Requests', path: '/admin/requests', icon: Package },
        { name: 'Activity Log', path: '/admin/logs', icon: Activity },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md z-10 flex flex-col pt-20">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-primary">Admin Control</h2>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            end={item.path === '/admin'}
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-accent'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto h-full relative">
                <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/providers" element={<ProviderManagement />} />
                    <Route path="/reports" element={<ReportGeneration />} />
                    <Route path="/requests" element={<RequestManagement />} />
                    <Route path="/logs" element={<ActivityLogPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </main>
        </div>
    );
}
