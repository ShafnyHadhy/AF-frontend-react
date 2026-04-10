import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiUser, FiMapPin, FiInfo, FiTag, FiClock, FiArrowLeft, FiImage } from "react-icons/fi";
import ProviderDashboardLayout from "../../components/ProviderDashboardLayout";

export default function ManageRequestPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const availableStatuses = ['Pending', 'Accepted', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        axios.get(import.meta.env.VITE_API_URL + `/api/repairs/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log(response.data);
            setRequest(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error fetching request details:', error);
            setIsLoading(false);
        });

    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse text-green-600 font-semibold">Loading request details...</div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
                <p className="text-slate-500">Request not found or you don't have access.</p>
                <Link to="/provider" className="text-green-600 hover:underline">Return to Dashboard</Link>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Accepted': return 'bg-green-100 text-green-800 border-green-200';
            case 'Scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        if (newStatus === request.status) {
            setIsDropdownOpen(false);
            return;
        }

        try {
            setIsUpdating(true);
            setIsDropdownOpen(false);
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                import.meta.env.VITE_API_URL + `/api/repairs/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state and lifecycle array implicitly or fetch from response if full object returned
            if (response.data) {
                setRequest(prev => ({
                    ...prev,
                    status: newStatus,
                    lifecycle: [...(prev.lifecycle || []), { status: newStatus, timestamp: new Date().toISOString(), note: `Status updated to ${newStatus}` }]
                }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <ProviderDashboardLayout 
            activeTab="inbox" 
            setActiveTab={(tab) => navigate('/provider', { state: { activeTab: tab } })}
            providerName={request?.provider?.name || "Provider"}
        >
        <div className="font-['Inter'] min-h-[calc(100vh-80px)]">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Page Action */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
                    >
                        <FiArrowLeft className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Request Details</h1>
                        <p className="text-sm text-slate-500">Manage the repair process and updates</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-xl font-bold text-slate-900">{request.productName}</h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5"><FiTag className="text-slate-400" /> {request.category}</span>
                                        <span className="flex items-center gap-1.5"><FiInfo className="text-slate-400" /> Qty: {request.quantity}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Created On</p>
                                    <p className="text-sm text-slate-700">{new Date(request.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-sm font-semibold text-slate-900 mb-3">Issue Description</h3>
                                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {request.description}
                                </p>
                                
                                {request.image && (
                                    <div className="mt-6">
                                        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                            <FiImage className="text-slate-400" /> Attached Image
                                        </h3>
                                        <div className="w-full max-w-sm rounded-xl overflow-hidden border border-slate-200">
                                            <img src={request.image} alt={request.productName} className="w-full h-auto object-cover" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer & Location Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <FiUser className="text-green-600" /> Customer Details
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-400">Name</p>
                                        <p className="text-sm font-medium text-slate-800">{request.user?.firstName} {request.user?.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Email</p>
                                        <p className="text-sm font-medium text-slate-800">{request.user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <FiMapPin className="text-green-600" /> Location Info
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-400">Address</p>
                                        <p className="text-sm font-medium text-slate-800">{request.location?.address || 'Not provided'}</p>
                                    </div>
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-xs text-slate-400">Lat</p>
                                            <p className="text-sm font-mono text-slate-600">{request.location?.lat?.toFixed(4)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Lng</p>
                                            <p className="text-sm font-mono text-slate-600">{request.location?.lng?.toFixed(4)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions & Lifecycle */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl border border-green-200 p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3 relative">
                                <button 
                                    disabled={isUpdating}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isUpdating ? 'Updating...' : 'Update Status'}
                                    <span className="material-symbols-outlined text-sm">{isDropdownOpen ? 'expand_less' : 'expand_more'}</span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute top-12 left-0 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                                        {availableStatuses.map(status => (
                                            <button
                                                key={status}
                                                onClick={() => handleUpdateStatus(status)}
                                                disabled={status === request.status}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                                    status === request.status 
                                                    ? 'bg-slate-50 text-slate-400 cursor-not-allowed' 
                                                    : 'text-slate-700 hover:bg-green-50 hover:text-green-700 font-medium'
                                                }`}
                                            >
                                                {status} {status === request.status && '(Current)'}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <button className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-medium rounded-xl transition-colors">
                                    Message Customer
                                </button>
                            </div>
                        </div>

                        {/* Lifecycle Timeline */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
                                <FiClock className="text-green-600" /> Request Timeline
                            </h3>
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                                {request.lifecycle?.map((stage, idx) => (
                                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-green-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-sm">
                                            <div className="flex flex-col items-start justify-center space-y-1 mb-1">
                                                <div className="font-bold text-slate-900 text-sm">{stage.status}</div>
                                                <div className="text-[10px] text-slate-500">{new Date(stage.timestamp).toLocaleDateString()}</div>
                                            </div>
                                            <div className="text-xs text-slate-600 leading-tight">
                                                {stage.note}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </ProviderDashboardLayout>
    );
}