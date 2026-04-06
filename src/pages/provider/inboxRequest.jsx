export default function InboxRequests() {
    return (
        <div className="space-y-4 px-8">
            <h2 className="text-lg font-bold text-slate-900">Inbox Requests</h2>
            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-soft border border-green-100 hover:border-green-300 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-slate-900">Laptop Repair Request</h3>
                                <p className="text-xs text-slate-600 mt-1">Customer: Sarah Johnson</p>
                                <p className="text-xs text-slate-500 mt-2">Device: Dell XPS 13 | Issue: Screen flickering</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Pending</span>
                                <span className="text-xs text-slate-500">2 hours ago</span>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">Accept</button>
                            <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">Decline</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
