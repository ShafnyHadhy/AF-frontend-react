export default function Settings() {
    return (
        <div className="max-w-2xl space-y-4 px-8">
            <h2 className="text-lg font-bold text-slate-900">Settings</h2>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-green-600" />
                        <span className="text-sm text-slate-700">Email for new requests</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-green-600" />
                        <span className="text-sm text-slate-700">SMS alerts for urgent messages</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-green-600" />
                        <span className="text-sm text-slate-700">Weekly earnings report</span>
                    </label>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Privacy & Security</h3>
                <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-left text-sm">Change Password</button>
                <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-left text-sm">Two-Factor Auth</button>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-200 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Danger Zone</h3>
                <button className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-200 text-sm">Delete Account</button>
            </div>
        </div>
    );
}