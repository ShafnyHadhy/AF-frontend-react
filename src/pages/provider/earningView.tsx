export default function EarningsReports() {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Earnings & Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-green-100">
                    <p className="text-sm text-slate-600 uppercase tracking-wide mb-2">This Month</p>
                    <p className="text-3xl font-bold text-green-600">$1,240</p>
                    <p className="text-xs text-slate-500 mt-2">↑ 12% from last month</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-green-100">
                    <p className="text-sm text-slate-600 uppercase tracking-wide mb-2">Total Earnings</p>
                    <p className="text-3xl font-bold text-green-600">$12,540</p>
                    <p className="text-xs text-slate-500 mt-2">Since you joined</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-green-100">
                    <p className="text-sm text-slate-600 uppercase tracking-wide mb-2">Transactions</p>
                    <p className="text-3xl font-bold text-green-600">48</p>
                    <p className="text-xs text-slate-500 mt-2">Completed orders</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft border border-green-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-200 last:border-b-0">
                            <div>
                                <p className="font-medium text-slate-900">Service Completed</p>
                                <p className="text-sm text-slate-600">Invoice #INV-{1000 + i}</p>
                            </div>
                            <span className="font-semibold text-green-600">+${100 + i * 10}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
