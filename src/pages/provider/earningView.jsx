export default function EarningsReports() {
    return (
        <div className="space-y-4 px-8">
            <h2 className="text-lg font-bold text-slate-900">Earnings & Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
                    <p className="text-xs text-slate-600 uppercase tracking-wide mb-2">This Month</p>
                    <p className="text-2xl font-bold text-green-600">$1,240</p>
                    <p className="text-xs text-slate-500 mt-1">↑ 12% from last</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
                    <p className="text-xs text-slate-600 uppercase tracking-wide mb-2">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-600">$12,540</p>
                    <p className="text-xs text-slate-500 mt-1">Since you joined</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
                    <p className="text-xs text-slate-600 uppercase tracking-wide mb-2">Transactions</p>
                    <p className="text-2xl font-bold text-green-600">48</p>
                    <p className="text-xs text-slate-500 mt-1">Completed orders</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Recent Transactions</h3>
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between py-2 px-2 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 rounded text-sm">
                            <div>
                                <p className="font-medium text-slate-900">Service Completed</p>
                                <p className="text-xs text-slate-600">INV-{1000 + i}</p>
                            </div>
                            <span className="font-semibold text-green-600">+${100 + i * 10}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
