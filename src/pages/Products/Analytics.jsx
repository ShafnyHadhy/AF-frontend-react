import React from 'react';
import { Link } from 'react-router-dom';

const Analytics = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex">
            {/* Sidebar Navigation */}
            <aside className="fixed left-0 top-0 h-full w-20 bg-background-light dark:bg-background-dark border-r border-slate-200 dark:border-primary/10 flex flex-col items-center py-8 z-50">
                <div className="mb-10 text-primary">
                    <span className="material-icons text-4xl">analytics</span>
                </div>
                <nav className="flex flex-col gap-8">
                    <Link to="/dashboard" className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-icons">dashboard</span>
                    </Link>
                    <Link to="/analytics" className="text-primary bg-primary/10 p-2 rounded-lg">
                        <span className="material-icons">insights</span>
                    </Link>
                    <Link to="/my-products" className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-icons">inventory_2</span>
                    </Link>
                    <Link to="/marketplace" className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-icons">shopping_cart</span>
                    </Link>
                </nav>
                <div className="mt-auto">
                    <img
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-primary"
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${localStorage.getItem('email') || 'User'}`}
                    />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="ml-20 p-8 flex-1">
                {/* Header & Breadcrumbs */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <nav className="flex text-sm text-slate-500 mb-2 font-bold uppercase tracking-wider">
                            <span className="hover:text-primary cursor-pointer">Member 3</span>
                            <span className="mx-2">/</span>
                            <span className="text-slate-300">Analytics</span>
                        </nav>
                        <h1 className="text-3xl font-bold tracking-tight">Product Lifecycle Analytics</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                className="bg-white dark:bg-zinc-800 border-none rounded-lg text-sm pl-10 pr-4 py-2 w-64 focus:ring-1 focus:ring-primary shadow-sm"
                                placeholder="Search data points..."
                                type="text"
                            />
                            <span className="material-icons absolute left-3 top-2.5 text-slate-500 text-sm">search</span>
                        </div>
                        <button className="bg-primary text-zinc-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                            <span className="material-icons text-sm">download</span>
                            Export Report
                        </button>
                    </div>
                </header>

                {/* Filters Section */}
                <section className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-primary/5 rounded-2xl p-6 mb-8 flex flex-wrap gap-6 items-end shadow-sm">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Product Category</label>
                        <select className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-sm px-4 py-2 pr-10 focus:ring-primary font-bold">
                            <option>All Categories</option>
                            <option>Consumer Electronics</option>
                            <option>Apparel & Textiles</option>
                            <option>Automotive Parts</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Date Range</label>
                        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-3">
                            <span className="material-icons text-sm text-slate-400 mr-2">calendar_today</span>
                            <select className="bg-transparent border-none text-sm py-2 pr-8 focus:ring-0 font-bold">
                                <option>Last 30 Days</option>
                                <option>Last Quarter</option>
                                <option>Year to Date</option>
                                <option>Custom Range</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Stage Status</label>
                        <div className="flex gap-2">
                            <span className="px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-[10px] font-bold cursor-pointer">Active</span>
                            <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-slate-400 border border-transparent rounded-full text-[10px] font-bold cursor-pointer hover:border-primary/50 transition-colors">Archived</span>
                        </div>
                    </div>
                    <div className="ml-auto text-[10px] text-slate-500 italic font-bold uppercase tracking-wider">
                        Last refreshed: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </section>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-primary/5 p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Products</span>
                            <span className="text-primary"><span className="material-icons text-xl">inventory_2</span></span>
                        </div>
                        <div className="text-3xl font-bold">1,284</div>
                        <div className="text-[10px] text-primary mt-2 flex items-center font-bold font-mono">
                            <span className="material-icons text-xs">trending_up</span>
                            <span className="ml-1">+12% from last month</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-primary/5 p-6 rounded-2xl shadow-sm text-primary border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Lifecycle Health</span>
                            <span className="text-primary"><span className="material-icons text-xl">favorite</span></span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">94.2%</div>
                        <div className="text-[10px] text-primary mt-2 flex items-center font-bold">
                            <span className="material-icons text-xs">check_circle</span>
                            <span className="ml-1">Optimal Range</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-primary/5 p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Cycle Efficiency</span>
                            <span className="text-primary"><span className="material-icons text-xl">bolt</span></span>
                        </div>
                        <div className="text-3xl font-bold">86.7%</div>
                        <div className="text-[10px] text-slate-500 mt-2 flex items-center font-bold">
                            <span className="material-icons text-xs">trending_down</span>
                            <span className="ml-1 text-red-400">-2.4% vs Target</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900/10 border border-primary/30 p-6 rounded-2xl shadow-lg shadow-primary/5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Waste Reduction</span>
                            <span className="text-primary"><span className="material-icons text-xl">eco</span></span>
                        </div>
                        <div className="text-3xl font-bold text-primary">18.1%</div>
                        <div className="text-[10px] text-primary mt-2 flex items-center font-bold">
                            <span className="material-icons text-xs">keyboard_arrow_up</span>
                            <span className="ml-1 uppercase">Significant Improvement</span>
                        </div>
                    </div>
                </div>

                {/* Main Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Line Chart: Average Time in Stage */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-primary/10 rounded-2xl p-8 relative overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold">Average Time in Stage (Days)</h3>
                            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_#13ec5b]"></span> R&D</div>
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500"></span> Production</div>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between relative border-b border-l border-zinc-200 dark:border-slate-700/50 pt-4 px-2">
                            {/* Placeholder Visual for Line Chart */}
                            <svg className="absolute inset-x-4 bottom-0 h-full w-[90%] pointer-events-none overflow-visible" viewBox="0 0 100 40">
                                <path d="M0,35 Q10,32 20,25 T40,28 T60,15 T80,18 T100,5" fill="none" stroke="#13ec5b" strokeWidth="2"></path>
                                <path d="M0,38 Q10,36 20,30 T40,32 T60,28 T80,30 T100,22" fill="none" stroke="#64748b" strokeWidth="2"></path>
                            </svg>
                            <div className="flex flex-col h-full justify-between text-[10px] text-slate-500 absolute -left-6 font-bold font-mono">
                                <span>40d</span><span>30d</span><span>20d</span><span>10d</span><span>0</span>
                            </div>
                            <div className="flex justify-between w-full text-[10px] text-slate-500 absolute -bottom-6 font-bold uppercase tracking-tighter">
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                            </div>
                        </div>
                    </div>

                    {/* Bar Graph: Production Yield vs Waste */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-primary/10 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold">Production Yield vs. Waste</h3>
                            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-primary shadow-[0_0_5px_#13ec5b]"></span> Yield</div>
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-red-400 shadow-[0_0_5px_rgba(248,113,113,0.5)]"></span> Waste</div>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-around border-b border-zinc-200 dark:border-slate-700/50 relative px-4">
                            {/* Mock Bar Clusters */}
                            <div className="flex gap-1 items-end h-full w-full">
                                <div className="flex-1 flex flex-col items-center justify-end h-full">
                                    <div className="flex gap-1 items-end w-12">
                                        <div className="w-5 bg-primary/80 h-[85%] rounded-t-sm shadow-[0_0_10px_rgba(19,236,91,0.2)]"></div>
                                        <div className="w-5 bg-red-400/80 h-[12%] rounded-t-sm"></div>
                                    </div>
                                    <span className="text-[9px] text-zinc-500 mt-2 font-bold uppercase tracking-tighter">Core Electronics</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-end h-full">
                                    <div className="flex gap-1 items-end w-12">
                                        <div className="w-5 bg-primary/80 h-[70%] rounded-t-sm shadow-[0_0_10px_rgba(19,236,91,0.2)]"></div>
                                        <div className="w-5 bg-red-400/80 h-[28%] rounded-t-sm"></div>
                                    </div>
                                    <span className="text-[9px] text-zinc-500 mt-2 font-bold uppercase tracking-tighter">Display Units</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-end h-full">
                                    <div className="flex gap-1 items-end w-12">
                                        <div className="w-5 bg-primary/80 h-[92%] rounded-t-sm shadow-[0_0_10px_rgba(19,236,91,0.2)]"></div>
                                        <div className="w-5 bg-red-400/80 h-[5%] rounded-t-sm"></div>
                                    </div>
                                    <span className="text-[9px] text-zinc-500 mt-2 font-bold uppercase tracking-tighter">Audio Systems</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-end h-full">
                                    <div className="flex gap-1 items-end w-12">
                                        <div className="w-5 bg-primary/80 h-[78%] rounded-t-sm shadow-[0_0_10px_rgba(19,236,91,0.2)]"></div>
                                        <div className="w-5 bg-red-400/80 h-[18%] rounded-t-sm"></div>
                                    </div>
                                    <span className="text-[9px] text-zinc-500 mt-2 font-bold uppercase tracking-tighter">Smart Wearables</span>
                                </div>
                            </div>
                            <div className="flex flex-col h-full justify-between text-[10px] text-slate-500 absolute -left-6 font-bold font-mono">
                                <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Heat Map: Regional Distribution */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-primary/10 rounded-2xl p-8 mb-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold">Regional Lifecycle Density</h3>
                            <p className="text-sm text-zinc-500 font-bold uppercase tracking-tight">Distribution of active production stages by global region</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Low</span>
                            <div className="flex h-2 w-32 rounded-full bg-gradient-to-r from-slate-200 dark:from-slate-800 via-primary/40 to-primary shadow-inner"></div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">High</span>
                        </div>
                    </div>
                    <div className="relative w-full aspect-[21/9] bg-zinc-50 dark:bg-slate-800/20 rounded-2xl overflow-hidden group border border-zinc-100 dark:border-transparent">
                        <div
                            className="absolute inset-0 opacity-40 mix-blend-screen bg-cover bg-center grayscale dark:invert"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2666')" }}
                        ></div>
                        {/* Heat Circles */}
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
                        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-primary/30 blur-3xl rounded-full animate-pulse delay-700"></div>
                        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-primary/15 blur-3xl rounded-full animate-pulse delay-1000"></div>
                        {/* Data Pins */}
                        <div className="absolute top-[35%] left-[22%] group-hover:scale-110 transition-transform">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary animate-ping rounded-full opacity-20"></div>
                                <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#13ec5b]"></div>
                            </div>
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 border border-zinc-200 dark:border-primary/20 p-2 rounded-lg text-[10px] whitespace-nowrap shadow-xl font-bold font-mono">
                                North America: <span className="text-primary tracking-widest font-black">482 Units</span>
                            </div>
                        </div>
                        <div className="absolute top-[55%] left-[48%] group-hover:scale-110 transition-transform">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary animate-ping rounded-full opacity-20"></div>
                                <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#13ec5b]"></div>
                            </div>
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 border border-zinc-200 dark:border-primary/20 p-2 rounded-lg text-[10px] whitespace-nowrap shadow-xl font-bold font-mono">
                                EMEA: <span className="text-primary tracking-widest font-black">614 Units</span>
                            </div>
                        </div>
                        <div className="absolute top-[45%] right-[20%] group-hover:scale-110 transition-transform">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary animate-ping rounded-full opacity-20"></div>
                                <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#13ec5b]"></div>
                            </div>
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 border border-zinc-200 dark:border-primary/20 p-2 rounded-lg text-[10px] whitespace-nowrap shadow-xl font-bold font-mono">
                                APAC: <span className="text-primary tracking-widest font-black">892 Units</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lifecycle Drill-down Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-primary/5 rounded-2xl overflow-hidden shadow-sm mb-12">
                    <div className="p-6 border-b border-zinc-200 dark:border-primary/5 flex items-center justify-between">
                        <h3 className="font-bold">Recent Stage Completions</h3>
                        <button className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:underline">
                            View All Data <span className="material-icons text-sm">arrow_forward</span>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-slate-500 uppercase text-[10px] tracking-widest border-b border-zinc-100 dark:border-primary/5 font-black">
                                    <th className="px-6 py-4">Product ID</th>
                                    <th className="px-6 py-4">Completed Stage</th>
                                    <th className="px-6 py-4">Total Duration</th>
                                    <th className="px-6 py-4">Yield Variance</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-primary/5">
                                <tr className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-[11px] font-bold">PRD-X492-W</td>
                                    <td className="px-6 py-4 font-bold text-zinc-600 dark:text-zinc-400">Quality Assurance</td>
                                    <td className="px-6 py-4 font-bold">12.5 Days</td>
                                    <td className="px-6 py-4 text-primary font-black">+2.4%</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20 shadow-[0_0_10px_rgba(19,236,91,0.1)]">OPTIMAL</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-[11px] font-bold">PRD-A103-S</td>
                                    <td className="px-6 py-4 font-bold text-zinc-600 dark:text-zinc-400">Material Sourcing</td>
                                    <td className="px-6 py-4 font-bold">4.2 Days</td>
                                    <td className="px-6 py-4 text-red-400 font-black">-1.1%</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-yellow-400/20">WARNING</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-[11px] font-bold">PRD-M992-K</td>
                                    <td className="px-6 py-4 font-bold text-zinc-600 dark:text-zinc-400">Distribution Setup</td>
                                    <td className="px-6 py-4 font-bold">8.1 Days</td>
                                    <td className="px-6 py-4 text-primary font-black">+0.8%</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20 shadow-[0_0_10px_rgba(19,236,91,0.1)]">OPTIMAL</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
