export default function ProviderProfile() {
    return (
        <div className="max-w-2xl space-y-6">
            <h2 className="text-lg font-bold text-slate-900">My Profile</h2>
            
            <div className="bg-white rounded-2xl p-8 shadow-soft border border-green-100">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-green-400 to-green-600"></div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">John Smith</h3>
                        <p className="text-sm text-slate-600">Premium Provider | Verified</p>
                        <div className="flex gap-2 mt-2">
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">Repair Specialist</span>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">Recycling Expert</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 border-t border-slate-200 pt-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <input type="email" defaultValue="john@example.com" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                        <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Service Location</label>
                        <input type="text" defaultValue="San Francisco, CA" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                </div>

                <button className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">Save Changes</button>
            </div>
        </div>
    );
}