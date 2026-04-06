import { useState } from "react";
import ProviderDashboardLayout from "../components/ProviderDashboardLayout";
import ProviderProfile from "./provider/providerProfile";
import InboxRequests from "./provider/inboxRequest";
import Settings from "./provider/providerSettings";
import EarningsReports from "./provider/earningView";

export default function ProviderDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const providerName = "John Smith"; // This should come from user context

  return (
    <ProviderDashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      providerName={providerName}
    >
      {activeTab === "overview" && <DashboardOverview />}
      {activeTab === "inbox" && <InboxRequests />}
      {activeTab === "profile" && <ProviderProfile />}
      {activeTab === "earnings" && <EarningsReports />}
      {activeTab === "settings" && <Settings />}
    </ProviderDashboardLayout>
  );
}

function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Products" value="24" trend="+2 this month" />
        <StatCard title="Pending Requests" value="8" trend="3 urgent" />
        <StatCard title="Total Earnings" value="$2,450" trend="+15% increase" />
        <StatCard title="Completion Rate" value="96%" trend="Excellent" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-soft border border-green-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-green-600"></div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Repair Request #{1000 + i}
                    </p>
                    <p className="text-sm text-slate-600">
                      Completed 2 hours ago
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  +$50
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-green-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-slate-600 uppercase tracking-wide">
                Response Time
              </p>
              <p className="text-2xl font-bold text-green-600">12 min</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-slate-600 uppercase tracking-wide">
                This Week
              </p>
              <p className="text-2xl font-bold text-green-600">18 tasks</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-slate-600 uppercase tracking-wide">
                Rating
              </p>
              <p className="text-2xl font-bold text-green-600">4.8/5.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft border border-green-100 hover:border-green-300 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{trend}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
