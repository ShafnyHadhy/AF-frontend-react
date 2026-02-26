import React from "react";
import {
  FaBolt,
  FaSearch,
  FaBell,
  FaComments,
  FaPlus,
  FaArrowUp,
  FaStar,
} from "react-icons/fa";
import {
  MdDashboard,
  MdHomeRepairService,
  MdRecycling,
  MdPerson,
  MdPayments,
  MdSettings,
  MdHistory,
  MdBuild,
  MdAccountBalanceWallet,
  MdLocationOn,
} from "react-icons/md";

export default function ProviderPage() {
  const avatarUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBDXE4qqQgV78mkTyl0NGcydHEliekwYGg2vPFrNIN7KY3T0YBBLvotTwzwfgrH9U6_OlzYW_AhDFM-yetKFQmdSt7TQoHiYlUvzpI_Qk9aguciDHAwvu_puDz8ixq3NkuXGVFgecAKc1Ws-FAztGN6LdgIXS7s666D230QI6bWqdBY7UvkaPpPDNfwlg-8prP0inOrFZdAyrI64-dZv0RXVXw06r36zeLgJMRNoDhEmFW8wH2lAdcuibU2VdnBDNV8nWaEZv-m54E";

  return (
    <div className="bg-[#f6f7f8] text-slate-900 dark:bg-[#101722] dark:text-slate-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="size-8 bg-[#2672ed] rounded-lg flex items-center justify-center text-white">
              <FaBolt />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Provider Portal</h1>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#2672ed] text-white font-medium"
              href="#"
            >
              <MdDashboard className="text-lg" />
              <span>Dashboard Overview</span>
            </a>

            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              href="#"
            >
              <MdHomeRepairService className="text-lg" />
              <span>Repair Inbox</span>
            </a>

            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              href="#"
            >
              <MdRecycling className="text-lg" />
              <span>Recycling Inbox</span>
            </a>

            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              href="#"
            >
              <MdPerson className="text-lg" />
              <span>My Profile</span>
            </a>

            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              href="#"
            >
              <MdPayments className="text-lg" />
              <span>Earnings &amp; Reports</span>
            </a>

            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              href="#"
            >
              <MdSettings className="text-lg" />
              <span>Settings</span>
            </a>
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2672ed] text-white font-bold rounded-lg hover:bg-[#2672ed]/90 transition-all">
              <FaPlus className="text-sm" />
              <span>New Request</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Top Navbar */}
          <header className="sticky top-0 z-10 h-16 px-8 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-[#2672ed]/20 text-sm"
                  placeholder="Search requests, customers..."
                  type="text"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <FaBell />
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
              </button>

              <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <FaComments />
              </button>

              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">TechSolutions Ltd.</p>
                  <p className="text-xs text-slate-500">Service Provider</p>
                </div>

                <div
                  className="size-10 rounded-full bg-slate-200 bg-cover bg-center border-2 border-transparent group-hover:border-[#2672ed] transition-all"
                  style={{ backgroundImage: `url('${avatarUrl}')` }}
                  aria-label="User avatar"
                />
              </div>
            </div>
          </header>

          <div className="p-8 space-y-8">
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* KPI 1 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">
                      Total Repair Requests
                    </p>
                    <h3 className="text-3xl font-bold">124</h3>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                    <MdHistory className="text-xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium text-emerald-600">
                  <FaArrowUp className="mr-1 text-[14px]" />
                  <span>+12.5% from last month</span>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">
                      Active Repairs
                    </p>
                    <h3 className="text-3xl font-bold">42</h3>
                  </div>
                  <div className="p-2 bg-[#2672ed]/10 rounded-lg text-[#2672ed]">
                    <MdBuild className="text-xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium text-slate-400">
                  <span>Processing at normal capacity</span>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">
                      Recycling Requests
                    </p>
                    <h3 className="text-3xl font-bold">88</h3>
                  </div>
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                    <MdRecycling className="text-xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium text-emerald-600">
                  <FaArrowUp className="mr-1 text-[14px]" />
                  <span>+4 new today</span>
                </div>
              </div>

              {/* KPI 4 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">
                      Total Revenue
                    </p>
                    <h3 className="text-3xl font-bold">$12,450</h3>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600">
                    <MdAccountBalanceWallet className="text-xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium text-emerald-600">
                  <FaArrowUp className="mr-1 text-[14px]" />
                  <span>+8.2% vs target</span>
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Repair Requests */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Recent Repair Requests</h2>
                  <a className="text-sm font-semibold text-[#2672ed] hover:underline" href="#">
                    See All
                  </a>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3">Request ID</th>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Device</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            REP-2026-0001
                          </span>
                          <p className="text-[10px] text-slate-500">Oct 12, 2026</p>
                        </td>
                        <td className="px-6 py-4 text-sm">John Doe</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          iPhone 13
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                            Requested
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="px-3 py-1 bg-[#2672ed]/10 text-[#2672ed] text-xs font-bold rounded-lg hover:bg-[#2672ed] hover:text-white transition-all">
                            View
                          </button>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            REP-2026-0002
                          </span>
                          <p className="text-[10px] text-slate-500">Oct 11, 2026</p>
                        </td>
                        <td className="px-6 py-4 text-sm">Jane Smith</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          Sony Headphones
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            In Progress
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="px-3 py-1 bg-[#2672ed]/10 text-[#2672ed] text-xs font-bold rounded-lg hover:bg-[#2672ed] hover:text-white transition-all">
                            View
                          </button>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            REP-2026-0005
                          </span>
                          <p className="text-[10px] text-slate-500">Oct 10, 2026</p>
                        </td>
                        <td className="px-6 py-4 text-sm">Michael Ross</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          MacBook Pro 16&quot;
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="px-3 py-1 bg-[#2672ed]/10 text-[#2672ed] text-xs font-bold rounded-lg hover:bg-[#2672ed] hover:text-white transition-all">
                            View
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Recycling Requests */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Recent Recycling Requests</h2>
                  <a className="text-sm font-semibold text-[#2672ed] hover:underline" href="#">
                    See All
                  </a>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3">Recycle ID</th>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            REC-2026-0001
                          </span>
                          <p className="text-[10px] text-slate-500">Pickup Today</p>
                        </td>
                        <td className="px-6 py-4 text-sm">Bob Wilson</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                          Laptops
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#2672ed]/10 text-[#2672ed] border border-[#2672ed]/20">
                            Scheduled
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="px-3 py-1 bg-[#2672ed]/10 text-[#2672ed] text-xs font-bold rounded-lg hover:bg-[#2672ed] hover:text-white transition-all">
                            View
                          </button>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            REC-2026-0002
                          </span>
                          <p className="text-[10px] text-slate-500">Collected Yesterday</p>
                        </td>
                        <td className="px-6 py-4 text-sm">Alice Brown</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                          Batteries
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            Collected
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="px-3 py-1 bg-[#2672ed]/10 text-[#2672ed] text-xs font-bold rounded-lg hover:bg-[#2672ed] hover:text-white transition-all">
                            View
                          </button>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            REC-2026-0009
                          </span>
                          <p className="text-[10px] text-slate-500">Awaiting Drop-off</p>
                        </td>
                        <td className="px-6 py-4 text-sm">Sarah Jenkins</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                          Monitors
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="px-3 py-1 bg-[#2672ed]/10 text-[#2672ed] text-xs font-bold rounded-lg hover:bg-[#2672ed] hover:text-white transition-all">
                            View
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer Status Banner */}
            <div className="bg-[#2672ed]/5 dark:bg-[#2672ed]/10 border border-[#2672ed]/10 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-sm font-medium">
                  System Status: All services are operational. Last sync 2 mins ago.
                </p>
              </div>
              <button className="text-[#2672ed] text-sm font-bold hover:underline">
                Service Status
              </button>
            </div>
          </div>

          <footer className="mt-auto py-6 text-center text-slate-400 text-xs">
            © 2026 Provider Dashboard • v2.4.1
          </footer>
        </main>
      </div>
    </div>
  );
}