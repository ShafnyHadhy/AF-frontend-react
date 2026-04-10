// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// import {
//     FiActivity,
//     FiArrowUpRight,
//     }
//                     `${import.meta.env.VITE_API_URL}/api/repairs`,
//                     {
//                         headers: { Authorization: `Bearer ${token}` },
//                     }
//                 );

//                 if (!cancelled) {
//                     setRepairRequests(Array.isArray(response.data) ? response.data : []);
//                 }
//             } catch (error) {
//                 if (!cancelled) {
//                     setOverviewError('Unable to load dashboard data.');
//                     setRepairRequests([]);
//                 }
//             } finally {
//                 if (!cancelled) {
//                     setOverviewLoading(false);
//                 }
//             }
//         };

//         fetchRequests();

//         return () => {
//             cancelled = true;
//         };
//     }, [activeTab]);

//     const providerName = 'John Smith';

//     return (
//         <ProviderDashboardLayout
//             activeTab={activeTab}
//             setActiveTab={setActiveTab}
//             providerName={providerName}
//         >
//             {activeTab === 'overview' && (
//                 <DashboardOverview
//                     providerName={providerName}
//                     requests={repairRequests}
//                     isLoading={overviewLoading}
//                     error={overviewError}
//                 />
//             )}
//             {activeTab === 'inbox' && <InboxRequests />}
//             {activeTab === 'profile' && <ProviderProfile />}
//             {activeTab === 'earnings' && <EarningsReports />}
//             {activeTab === 'settings' && <Settings />}
//         </ProviderDashboardLayout>
//     );
// }

// function DashboardOverview({ providerName, requests = [], isLoading, error }) {
//     const normalizedRequests = Array.isArray(requests) ? requests : [];
//     const now = new Date();

//     const totalRequests = normalizedRequests.length;
//     const pendingRequests = normalizedRequests.filter((request) => request.status === 'Pending').length;
//     const acceptedRequests = normalizedRequests.filter((request) => request.status === 'Accepted').length;
//     const scheduledRequests = normalizedRequests.filter((request) => request.status === 'Scheduled').length;
//     const inProgressRequests = normalizedRequests.filter((request) => request.status === 'In Progress').length;
//     const completedRequests = normalizedRequests.filter((request) => request.status === 'Completed').length;
//     const cancelledRequests = normalizedRequests.filter((request) => request.status === 'Cancelled').length;
//     const activeRequests = normalizedRequests.filter((request) => ACTIVE_REQUEST_STATUSES.includes(request.status)).length;
//     const todayRequests = normalizedRequests.filter((request) => request.createdAt && isSameDay(new Date(request.createdAt), now)).length;
//     const monthRequests = normalizedRequests.filter((request) => request.createdAt && isSameMonth(new Date(request.createdAt), now)).length;
//     const completionRate = totalRequests ? Math.round((completedRequests / totalRequests) * 100) : 0;

//     const categoryCounts = normalizedRequests.reduce((acc, request) => {
//         const category = request.category || 'Uncategorized';
//         acc[category] = (acc[category] || 0) + 1;
//         return acc;
//     }, {});

//     const topCategories = Object.entries(categoryCounts)
//         .sort(([, a], [, b]) => b - a)
//         .slice(0, 3)
//         .map(([label, count]) => ({
//             label,
//             count,
//             value: totalRequests ? Math.round((count / totalRequests) * 100) : 0,
//         }));

//     const recentRequests = [...normalizedRequests]
//         .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
//         .slice(0, 3);

//     const statCards = [
//         {
//             title: 'Total Requests',
//             value: totalRequests.toString().padStart(2, '0'),
//             trend: `${monthRequests} this month`,
//             icon: FiActivity,
//             accent: 'from-green-500 to-emerald-600',
//         },
//         {
//             title: 'Pending Requests',
//             value: pendingRequests.toString(),
//             trend: `${todayRequests} created today`,
//             icon: FiClock,
//             accent: 'from-amber-500 to-orange-500',
//         },
//         {
//             title: 'Active Queue',
//             value: activeRequests.toString(),
//             trend: `${acceptedRequests + scheduledRequests + inProgressRequests} progressing`,
//             icon: FiTrendingUp,
//             accent: 'from-green-600 to-lime-600',
//         },
//         {
//             title: 'Completion Rate',
//             value: `${completionRate}%`,
//             trend: `${completedRequests} completed`,
//             icon: FiCheckCircle,
//             accent: 'from-emerald-500 to-teal-500',
//         },
//     ];

//     if (isLoading) {
//         return (
//             <div className="space-y-8 px-8">
//                 <div className="animate-pulse rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
//                     <div className="h-4 w-40 rounded-full bg-slate-200" />
//                     <div className="mt-4 h-8 w-72 rounded-full bg-slate-200" />
//                     <div className="mt-3 h-4 w-96 max-w-full rounded-full bg-slate-100" />
//                     <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:w-2/5">
//                         <div className="h-24 rounded-2xl bg-slate-100" />
//                         <div className="h-24 rounded-2xl bg-slate-100" />
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-8 px-8">
//             <div className="rounded-3xl border border-green-100 bg-linear-to-br from-white via-green-50/40 to-emerald-50 p-6 shadow-sm">
//                 <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
//                     <div className="max-w-2xl space-y-3">
//                         <div className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-700 shadow-sm">
//                             <FiShield className="text-sm" />
//                             Provider dashboard
//                         </div>
//                         <div>
//                             <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, {providerName}</h2>
//                             <p className="mt-2 text-sm leading-6 text-slate-500">
//                                 Track request flow and performance using live repair request data.
//                             </p>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-90">
//                         <div className="rounded-2xl bg-white/90 border border-green-100 p-4 shadow-sm">
//                             <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Today&apos;s requests</p>
//                             <p className="mt-2 text-2xl font-bold text-slate-900">{todayRequests}</p>
//                             <p className="text-sm text-green-600">{pendingRequests} need attention</p>
//                         </div>
//                         <div className="rounded-2xl bg-white/90 border border-green-100 p-4 shadow-sm">
//                             <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active queue</p>
//                             <p className="mt-2 text-2xl font-bold text-slate-900">{activeRequests}</p>
//                             <p className="text-sm text-green-600">{completedRequests} completed</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {statCards.map((card) => (
//                     <StatCard
//                         key={card.title}
//                         title={card.title}
//                         value={card.value}
//                         trend={card.trend}
//                         icon={card.icon}
//                         accent={card.accent}
//                     />
//                 ))}
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 <div className="lg:col-span-2 rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
//                     <div className="flex items-center justify-between mb-5">
//                         <div>
//                             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-600">Workflow</p>
//                             <h3 className="text-lg font-semibold text-slate-900">Recent activity</h3>
//                             <p className="text-sm text-slate-500">Latest repair progress and request updates.</p>
//                         </div>
//                         <button className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors">
//                             View all
//                             <FiArrowUpRight />
//                         </button>
//                     </div>

//                     {error ? (
//                         <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
//                             {error}
//                         </div>
//                     ) : recentRequests.length === 0 ? (
//                         <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
//                             No repair requests available yet.
//                         </div>
//                     ) : (
//                         <div className="space-y-3">
//                             {recentRequests.map((item) => (
//                                 <div key={item._id || item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4 transition-colors hover:border-green-200 hover:bg-green-50/60">
//                                     <div className="flex items-center gap-3 min-w-0">
//                                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-green-500 to-emerald-600 text-white shadow-sm">
//                                             <FiActivity className="text-lg" />
//                                         </div>
//                                         <div className="min-w-0">
//                                             <p className="text-sm font-semibold text-slate-900 truncate">{item.productName}</p>
//                                             <p className="mt-0.5 text-xs text-slate-500 truncate">
//                                                 {item.user?.firstName} {item.user?.lastName} • {formatRelativeTime(item.updatedAt || item.createdAt)}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <div className="flex flex-col items-end gap-1">
//                                         <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold border ${
//                                             item.status === 'Completed'
//                                                 ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
//                                                 : item.status === 'Accepted'
//                                                     ? 'border-green-200 bg-green-100 text-green-700'
//                                                     : item.status === 'In Progress'
//                                                         ? 'border-blue-200 bg-blue-100 text-blue-700'
//                                                         : item.status === 'Scheduled'
//                                                             ? 'border-sky-200 bg-sky-100 text-sky-700'
//                                                             : item.status === 'Cancelled'
//                                                                 ? 'border-red-200 bg-red-100 text-red-700'
//                                                                 : 'border-amber-200 bg-amber-100 text-amber-700'
//                                         }`}>
//                                             {item.status}
//                                         </span>
//                                         <span className="text-xs text-slate-500">{item.category}</span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
//                     <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-600">Performance</p>
//                     <h3 className="text-lg font-semibold text-slate-900 mb-2">Operational summary</h3>
//                     <p className="text-sm text-slate-500 mb-5">Live metrics built from the request data you already have.</p>

//                     <div className="space-y-4">
//                         <div className="rounded-2xl border border-green-100 bg-slate-50 p-4">
//                             <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Completion rate</p>
//                             <div className="mt-2 flex items-end justify-between gap-3">
//                                 <p className="text-3xl font-bold text-slate-900">{completionRate}%</p>
//                                 <FiClock className="text-2xl text-green-600" />
//                             </div>
//                         </div>

//                         <div className="rounded-2xl border border-green-100 bg-slate-50 p-4">
//                             <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Requests this month</p>
//                             <div className="mt-2 flex items-end justify-between gap-3">
//                                 <p className="text-3xl font-bold text-slate-900">{monthRequests}</p>
//                                 <FiTrendingUp className="text-2xl text-green-600" />
//                             </div>
//                         </div>

//                         <div className="rounded-2xl border border-green-100 bg-slate-50 p-4">
//                             <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cancelled requests</p>
//                             <div className="mt-2 flex items-end justify-between gap-3">
//                                 <p className="text-3xl font-bold text-slate-900">{cancelledRequests}</p>
//                                 <FiCheckCircle className="text-2xl text-green-600" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//                 <div className="xl:col-span-2 rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
//                     <div className="flex items-center justify-between gap-4 mb-5">
//                         <div>
//                             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-600">Insights</p>
//                             <h3 className="text-lg font-semibold text-slate-900">Request snapshot</h3>
//                             <p className="text-sm text-slate-500">A simple breakdown of what needs attention right now.</p>
//                         </div>
//                         <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
//                             Updated just now
//                         </span>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
//                             <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Pending</p>
//                             <p className="mt-2 text-3xl font-bold text-slate-900">{pendingRequests}</p>
//                             <p className="mt-2 text-sm text-amber-700">Needs response today</p>
//                         </div>
//                         <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
//                             <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Accepted</p>
//                             <p className="mt-2 text-3xl font-bold text-slate-900">{acceptedRequests + scheduledRequests + inProgressRequests}</p>
//                             <p className="mt-2 text-sm text-green-700">In your active queue</p>
//                         </div>
//                         <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
//                             <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Completed</p>
//                             <p className="mt-2 text-3xl font-bold text-slate-900">{completedRequests}</p>
//                             <p className="mt-2 text-sm text-emerald-700">Closed this month</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
//                     <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-600">Highlights</p>
//                     <h3 className="text-lg font-semibold text-slate-900 mb-2">Top services</h3>
//                     <p className="text-sm text-slate-500 mb-5">Your most requested repair categories.</p>

//                     <div className="space-y-4">
//                         {topCategories.length > 0 ? topCategories.map((item) => (
//                             <div key={item.label} className="space-y-2">
//                                 <div className="flex items-center justify-between gap-3 text-sm">
//                                     <span className="font-medium text-slate-700">{item.label}</span>
//                                     <span className="text-slate-500">{item.value}%</span>
//                                 </div>
//                                 <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
//                                     <div
//                                         className="h-full rounded-full bg-linear-to-r from-green-500 to-emerald-600"
//                                         style={{ width: `${Math.max(item.value, 8)}%` }}
//                                     />
//                                 </div>
//                             </div>
//                         )) : (
//                             <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
//                                 No category data available yet.
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//             </div>

//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//                 <div className="xl:col-span-2 rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
//                     <div className="flex items-center justify-between gap-4 mb-5">
//                         <div>
//                             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-600">Insights</p>
//                             <h3 className="text-lg font-semibold text-slate-900">Request snapshot</h3>
//                             <p className="text-sm text-slate-500">A simple breakdown of what needs attention right now.</p>
//                         </div>
//                         <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
//                             Updated just now
//                         </span>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
//                             <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Pending</p>
//                             <p className="mt-2 text-3xl font-bold text-slate-900">8</p>
//                             <p className="mt-2 text-sm text-amber-700">Needs response today</p>
//                         </div>
//                         <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
//                             <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Accepted</p>
//                             <p className="mt-2 text-3xl font-bold text-slate-900">14</p>
//                             <p className="mt-2 text-sm text-green-700">In your active queue</p>
//                         </div>
//                         <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
//                             <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Completed</p>
//                             <p className="mt-2 text-3xl font-bold text-slate-900">32</p>
//                             <p className="mt-2 text-sm text-emerald-700">Closed this month</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
//                     <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-600">Highlights</p>
//                     <h3 className="text-lg font-semibold text-slate-900 mb-2">Top services</h3>
//                     <p className="text-sm text-slate-500 mb-5">Your most requested repair categories.</p>

//                     <div className="space-y-4">
//                         {[
//                             { label: 'Screen replacement', value: 72 },
//                             { label: 'Battery service', value: 58 },
//                             { label: 'Diagnostics', value: 44 },
//                         ].map((item) => (
//                             <div key={item.label} className="space-y-2">
//                                 <div className="flex items-center justify-between gap-3 text-sm">
//                                     <span className="font-medium text-slate-700">{item.label}</span>
//                                     <span className="text-slate-500">{item.value}%</span>
//                                 </div>
//                                 <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
//                                     <div
//                                         className="h-full rounded-full bg-linear-to-r from-green-500 to-emerald-600"
//                                         style={{ width: `${item.value}%` }}
//                                     />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// function StatCard({ title, value, trend, icon: Icon, accent }) {
//     return (
//         <div className="group rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
//             <div className="flex items-start justify-between gap-4">
//                 <div>
//                     <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
//                     <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
//                     <p className="mt-1 text-sm text-slate-500">{trend}</p>
//                 </div>
//                 <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${accent} text-white shadow-sm transition-transform group-hover:scale-105`}>
//                     <Icon className="text-lg" />
//                 </div>
//             </div>
//         </div>
//     );
// }
