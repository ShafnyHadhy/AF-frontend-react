import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Hammer, CheckCircle, Clock, MapPin, User, ArrowRight, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProviderPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/repairs', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRequests(res.data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch requests");
            setLoading(false);
        }
    };

    const handleAction = async (id, status, note) => {
        try {
            await axios.patch(`http://localhost:5001/api/repairs/${id}/status`, { status, note }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success(`Request ${status}!`);
            fetchRequests();
        } catch (error) {
            toast.error("Action failed");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8 pt-24">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30">
                        <Hammer className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Repair Jobs</h1>
                        <p className="text-gray-500">Manage and update your repair assignments</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No repair requests found yet.</p>
                        </div>
                    )}

                    {requests.map((request) => (
                        <div key={request._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
                            {/* Card Content */}
                            <div className="p-6 flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${request.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            request.status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                                                request.status === 'In Progress' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-green-100 text-green-700'
                                        }`}>
                                        {request.status}
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium font-mono">#{request._id.slice(-6).toUpperCase()}</span>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-bold text-xl text-gray-800 group-hover:text-primary transition-colors">{request.productName}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2">{request.description}</p>
                                </div>

                                <div className="pt-4 border-t border-gray-50 space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span>{request.user?.firstName} {request.user?.lastName}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <span className="truncate">View on Map ({request.location?.lat.toFixed(4)}, {request.location?.lng.toFixed(4)})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                                {request.status === 'Pending' ? (
                                    <button
                                        onClick={() => handleAction(request._id, 'Accepted', 'Provider accepted the job')}
                                        className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        Accept Request
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : request.status !== 'Completed' ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAction(request._id, 'In Progress', 'Started working on it')}
                                            className="flex-1 bg-white text-gray-700 border border-gray-200 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Clock className="w-4 h-4" />
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleAction(request._id, 'Completed', 'Repair job finished')}
                                            className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Done
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full text-center py-3 text-green-600 font-bold flex items-center justify-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Completed
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}