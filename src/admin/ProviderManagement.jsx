import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ProviderManagement() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/providers', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProviders(res.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch providers');
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Provider Network</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map(provider => (
                    <div key={provider._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                        <img
                            src={provider.image}
                            alt={provider.firstName}
                            className="w-20 h-20 rounded-full object-cover mb-4 ring-4 ring-primary/10"
                        />
                        <h3 className="font-bold text-lg text-gray-900">{provider.firstName} {provider.lastName}</h3>
                        <p className="text-sm text-gray-500 mb-4">{provider.email}</p>

                        <div className="w-full bg-gray-50 rounded-xl p-4 flex justify-between items-center text-sm mb-4">
                            <span className="text-gray-600">Completed Jobs</span>
                            <span className="font-bold text-gray-900 text-lg">{provider.completedRepairs || 0}</span>
                        </div>

                        <div className="flex gap-2 w-full mt-auto">
                            <button
                                className={`flex-1 py-2 rounded-lg text-sm font-bold ${provider.isBlocked ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                    }`}
                                // In a full implementation, you'd reuse the block functionality
                                onClick={() => toast.success("Use User Management table to change block status")}
                            >
                                {provider.isBlocked ? 'Activate' : 'Deactivate'}
                            </button>
                        </div>
                    </div>
                ))}
                {providers.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-500">No providers active.</div>
                )}
            </div>
        </div>
    );
}
