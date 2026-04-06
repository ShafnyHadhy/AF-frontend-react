export default function Settings() {
    return (
        <div className="max-w-2xl space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Settings</h2>
            
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-green-100 space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-green-600" />
                        <span className="text-slate-700">Email notifications for new requests</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-green-600" />
                        <span className="text-slate-700">SMS alerts for urgent messages</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-green-600" />
                        <span className="text-slate-700">Weekly earnings report</span>
                    </label>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft border border-green-100 space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Privacy & Security</h3>
                <button className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-left">Change Password</button>
                <button className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-left">Two-Factor Authentication</button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft border border-red-200 space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Danger Zone</h3>
                <button className="w-full px-6 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-200">Delete Account</button>
            </div>
        </div>
    );
}