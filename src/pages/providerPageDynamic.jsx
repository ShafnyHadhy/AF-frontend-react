import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
    FiActivity,
    FiArrowUpRight,
    FiCheckCircle,
    FiClock,
    FiShield,
    FiTrendingUp,
} from 'react-icons/fi';
import ProviderDashboardLayout from '../components/ProviderDashboardLayout';
import ProviderProfile from './provider/providerProfile';
import InboxRequests from './provider/inboxRequest';
import Settings from './provider/providerSettings';
import EarningsReports from './provider/earningView';
import { useProvider } from '../context/ProviderContext';

const ACTIVE_STATUSES = ['Pending', 'Accepted', 'Scheduled', 'In Progress'];

const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const sameMonth = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth();

const formatRelativeTime = (value) => {
    if (!value) return 'Recently updated';
    const time = new Date(value).getTime();
    if (Number.isNaN(time)) return 'Recently updated';

    const diffMinutes = Math.max(0, Math.floor((Date.now() - time) / 60000));
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

export default function ProviderDashboardPage() {

    const { providerType, profile, loading, error } = useProvider();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
    const [requests, setRequests] = useState([]);
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [dashboardError, setDashboardError] = useState('');
    const [providerName, setProviderName] = useState('Provider');

    useEffect(() => {
        if (location.state?.activeTab) setActiveTab(location.state.activeTab);
    }, [location.state?.activeTab]);

    useEffect(() => {
        setProviderName(profile?.businessName || profile?.contactPerson || 'Provider');
    }, [profile]);

    // useEffect(() => {
    //     const loadProfile = async () => {
    //         const token = localStorage.getItem('token');
    //         if (!token) return;

    //         try {
    //             const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/providers/me`, {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             });

    //             const profile = Array.isArray(res.data) ? res.data[0] : res.data;

    //             setProviderType(profile?.providerType || '');
    //             setProviderName(profile?.businessName || profile?.contactPerson || 'Provider');
    //         } catch (err) {
    //             console.error('Failed to load provider profile', err);
    //             setProviderType('');
    //             setProviderName('Provider');
    //         }
    //     };

    //     loadProfile();
    // }, []);

    useEffect(() => {
        if (activeTab !== 'overview' || !providerType) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        let cancelled = false;

        const endpoint = providerType === 'repair_center' ? '/api/repairs' : '/api/recycling';

        const fetchRequests = async () => {
            try {
                setDashboardLoading(true);
                setDashboardError('');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const payload = Array.isArray(response.data) ? response.data : response.data?.requests || [];
                if (!cancelled) setRequests(payload);
            } catch (err) {
                console.error('Failed to load dashboard requests', err);
                if (!cancelled) {
                    setDashboardError(`Unable to load ${providerType === 'repair_center' ? 'repair' : 'recycling'} dashboard data.`);
                    setRequests([]);
                }
            } finally {
                if (!cancelled) setDashboardLoading(false);
            }
        };

        fetchRequests();
        return () => {
            cancelled = true; 
        };
    }, [activeTab, providerType]); 

    if (loading) return <div>Loading provider data...</div>;
    if (error) return <div>{error}</div>;

    return (
        <ProviderDashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} providerName={providerName}>
            {activeTab === 'overview' && (
                <DashboardOverview providerName={providerName} providerType={providerType} requests={requests} isLoading={dashboardLoading} error={dashboardError} />
            )}
            {activeTab === 'inbox' && <InboxRequests />}
            {activeTab === 'profile' && <ProviderProfile />}
            {activeTab === 'earnings' && <EarningsReports />}
            {activeTab === 'settings' && <Settings />}
        </ProviderDashboardLayout>
    );
}

function DashboardOverview({ providerName, providerType, requests = [], isLoading, error }) {
    const normalized = Array.isArray(requests) ? requests : [];
    const now = new Date();

    const isRepairCenter = providerType === 'repair_center';
    const dashboardLabel = isRepairCenter ? 'Repair' : 'Recycle';
    const activeStatuses = isRepairCenter
        ? ['Pending', 'Accepted', 'Scheduled', 'In Progress']
        : ['Pending', 'Scheduled', 'Collected'];
    const completedStatuses = isRepairCenter ? ['Completed'] : ['Recycled'];

    const total = normalized.length;
    const pending = normalized.filter((r) => r.status === 'Pending').length;
    const accepted = normalized.filter((r) => r.status === 'Accepted').length;
    const scheduled = normalized.filter((r) => r.status === 'Scheduled').length;
    const inProgress = normalized.filter((r) => r.status === 'In Progress').length;
    const collected = normalized.filter((r) => r.status === 'Collected').length;
    const completed = normalized.filter((r) => completedStatuses.includes(r.status)).length;
    const cancelled = normalized.filter((r) => r.status === 'Cancelled').length;
    const active = normalized.filter((r) => activeStatuses.includes(r.status)).length;
    const today = normalized.filter((r) => r.createdAt && sameDay(new Date(r.createdAt), now)).length;
    const thisMonth = normalized.filter((r) => r.createdAt && sameMonth(new Date(r.createdAt), now)).length;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;

    const topCategories = useMemo(() => {
        const counts = normalized.reduce((acc, request) => {
            const key = request.category || 'Uncategorized';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([label, count]) => ({
                label,
                count,
                value: total ? Math.round((count / total) * 100) : 0,
            }));
    }, [normalized, total]);

    const recent = [...normalized]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
        .slice(0, 3);

    const statCards = [
        { title: `Total ${dashboardLabel} Requests`, value: String(total).padStart(2, '0'), trend: `${thisMonth} this month`, icon: FiActivity, accent: 'from-green-500 to-emerald-600' },
        { title: 'Pending Requests', value: String(pending), trend: `${today} created today`, icon: FiClock, accent: 'from-amber-500 to-orange-500' },
        { title: 'Active Queue', value: String(active), trend: isRepairCenter ? `${accepted + scheduled + inProgress} progressing` : `${scheduled + collected} progressing`, icon: FiTrendingUp, accent: 'from-green-600 to-lime-600' },
        { title: 'Completion Rate', value: `${completionRate}%`, trend: `${completed} completed`, icon: FiCheckCircle, accent: 'from-emerald-500 to-teal-500' },
    ];

    if (isLoading) {
        return (
            <div className="space-y-8 px-8">
                <div className="animate-pulse rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
                    <div className="h-4 w-40 rounded-full bg-slate-200" />
                    <div className="mt-4 h-8 w-72 rounded-full bg-slate-200" />
                    <div className="mt-3 h-4 w-96 max-w-full rounded-full bg-slate-100" />
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:w-2/5">
                        <div className="h-24 rounded-2xl bg-slate-100" />
                        <div className="h-24 rounded-2xl bg-slate-100" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 px-8">
            <div className="rounded-3xl border border-green-100 bg-linear-to-br from-white via-green-50/40 to-emerald-50 p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-700 shadow-sm">
                            <FiShield className="text-sm" />
                            Provider dashboard
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, {providerName}</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">Track request flow and performance using live repair request data.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-90">
                        <div className="rounded-2xl bg-white/90 border border-green-100 p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Today&apos;s requests</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">{today}</p>
                            <p className="text-sm text-green-600">{pending} need attention</p>
                        </div>
                        <div className="rounded-2xl bg-white/90 border border-green-100 p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active queue</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">{active}</p>
                            <p className="text-sm text-green-600">{completed} completed</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <StatCard key={card.title} title={card.title} value={card.value} trend={card.trend} icon={card.icon} accent={card.accent} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-600">Workflow</p>
                            <h3 className="text-lg font-semibold text-slate-900">Recent activity</h3>
                            <p className="text-sm text-slate-500">
                                Latest {dashboardLabel.toLowerCase()} progress and request updates.
                            </p>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors">
                            View all <FiArrowUpRight />
                        </button>
                    </div>

                    {error ? (
                        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                    ) : recent.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">No repair requests available yet.</div>
                    ) : (
                        <div className="space-y-3">
                            {recent.map((item) => (
                                <div key={item._id || item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4 transition-colors hover:border-green-200 hover:bg-green-50/60">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-green-500 to-emerald-600 text-white shadow-sm">
                                            <FiActivity className="text-lg" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{item.productName}</p>
                                            <p className="mt-0.5 text-xs text-slate-500 truncate">{item.user?.firstName} {item.user?.lastName} • {formatRelativeTime(item.updatedAt || item.createdAt)}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold border ${item.status === 'Completed' ? 'border-emerald-200 bg-emerald-100 text-emerald-700' : item.status === 'Accepted' ? 'border-green-200 bg-green-100 text-green-700' : item.status === 'In Progress' ? 'border-blue-200 bg-blue-100 text-blue-700' : item.status === 'Scheduled' ? 'border-sky-200 bg-sky-100 text-sky-700' : item.status === 'Cancelled' ? 'border-red-200 bg-red-100 text-red-700' : 'border-amber-200 bg-amber-100 text-amber-700'}`}>
                                            {item.status}
                                        </span>
                                        <span className="text-xs text-slate-500">{item.category}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                        <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-600">Performance</p>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Operational summary</h3>
                    <p className="text-sm text-slate-500 mb-5">Live metrics built from the {dashboardLabel.toLowerCase()} request data you already have.</p>

                    <div className="space-y-4">
                        <div className="rounded-2xl border border-green-100 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Completion rate</p>
                            <div className="mt-2 flex items-end justify-between gap-3">
                                <p className="text-3xl font-bold text-slate-900">{completionRate}%</p>
                                <FiClock className="text-2xl text-green-600" />
                            </div>
                        </div>
                        <div className="rounded-2xl border border-green-100 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Requests this month</p>
                            <div className="mt-2 flex items-end justify-between gap-3">
                                <p className="text-3xl font-bold text-slate-900">{thisMonth}</p>
                                <FiTrendingUp className="text-2xl text-green-600" />
                            </div>
                        </div>
                        <div className="rounded-2xl border border-green-100 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cancelled requests</p>
                            <div className="mt-2 flex items-end justify-between gap-3">
                                <p className="text-3xl font-bold text-slate-900">{cancelled}</p>
                                <FiCheckCircle className="text-2xl text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4 mb-5">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-600">Insights</p>
                            <h3 className="text-lg font-semibold text-slate-900">Request snapshot</h3>
                            <p className="text-sm text-slate-500">A simple breakdown of what needs attention right now.</p>
                        </div>
                        <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Updated just now</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Pending</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{pending}</p>
                            <p className="mt-2 text-sm text-amber-700">Needs response today</p>
                        </div>
                        <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">In progress</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{isRepairCenter ? accepted + scheduled + inProgress : scheduled + collected}</p>
                            <p className="mt-2 text-sm text-green-700">In your active queue</p>
                        </div>
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Completed</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{completed}</p>
                            <p className="mt-2 text-sm text-emerald-700">Closed this month</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-600">Highlights</p>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Top services</h3>
                    <p className="text-sm text-slate-500 mb-5">Your most requested repair categories.</p>

                    <div className="space-y-4">
                        {topCategories.length > 0 ? (
                            topCategories.map((item) => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="font-medium text-slate-700">{item.label}</span>
                                        <span className="text-slate-500">{item.value}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                        <div className="h-full rounded-full bg-linear-to-r from-green-500 to-emerald-600" style={{ width: `${Math.max(item.value, 8)}%` }} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No category data available yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, icon: Icon, accent }) {
    return (
        <div className="group rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
                    <p className="mt-1 text-sm text-slate-500">{trend}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${accent} text-white shadow-sm transition-transform group-hover:scale-105`}>
                    <Icon className="text-lg" />
                </div>
            </div>
        </div>
    );
}
