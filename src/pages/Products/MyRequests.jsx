import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import RepairRecycleForm from "../../components/RepairRecycleForm";

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const [repairsRes, recyclingRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/repairs`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${import.meta.env.VITE_API_URL}/api/recycling`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const repairs = Array.isArray(repairsRes.data) ? repairsRes.data.map(r => ({ ...r, type: 'repair' })) : [];
            const recycling = Array.isArray(recyclingRes.data) ? recyclingRes.data.map(r => ({ ...r, type: 'recycle' })) : [];

            setRequests([...repairs, ...recycling]);
        } catch (error) {
            console.error("Error fetching requests", error);
            toast.error("Failed to load requests");
            if (error.response?.status === 401) navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchRequests();
    }, [token, navigate]);

    const handleCancelRequest = async (id, type) => {
        if (!window.confirm("Are you sure you want to cancel this request?")) return;

        try {
            const endpoint = type === 'repair' ? `/api/repairs` : `/api/recycling`;
            await axios.delete(`${import.meta.env.VITE_API_URL}${endpoint}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Request cancelled successfully");
            setRequests(requests.filter(r => r._id !== id));
        } catch (error) {
            console.error(error);
            toast.error("Failed to cancel request");
        }
    };

    const handleEditRequest = (request) => {
        setSelectedRequest(request);
        setIsEditModalOpen(true);
    };

    const stats = useMemo(() => {
        const pending = requests.filter(r => (r.status || 'Pending') === 'Pending').length;
        const accepted = requests.filter(r => r.status === 'Accepted').length;
        const completed = requests.filter(r => r.status === 'Completed').length;
        return { pending, accepted, completed, total: requests.length };
    }, [requests]);

    const filteredRequests = useMemo(() => {
        let result = requests.filter(req => {
            if (!req) return false;
            const matchesCategory = activeFilter === "All" || 
                (activeFilter === "Repair" ? req.type === 'repair' : 
                 activeFilter === "Recycle" ? req.type === 'recycle' : 
                 req.status === activeFilter);
            
            const searchLower = (searchQuery || "").toLowerCase();
            const productName = (req.productName || "").toLowerCase();
            const category = (req.category || "").toLowerCase();
            const description = (req.description || "").toLowerCase();

            const matchesSearch = productName.includes(searchLower) || 
                                category.includes(searchLower) ||
                                description.includes(searchLower);

            return matchesCategory && matchesSearch;
        });

        return result.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : 0;
            const dateB = b.createdAt ? new Date(b.createdAt) : 0;
            return sortBy === "newest" ? dateB - dateA : dateA - dateB;
        });
    }, [requests, activeFilter, searchQuery, sortBy]);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Pending': return { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'schedule', border: 'border-amber-200', dot: 'bg-amber-400' };
            case 'Accepted': return { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'check_circle', border: 'border-blue-200', dot: 'bg-blue-400' };
            case 'Completed': return { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'verified', border: 'border-emerald-200', dot: 'bg-emerald-400' };
            case 'Cancelled': return { bg: 'bg-red-50', text: 'text-red-700', icon: 'cancel', border: 'border-red-200', dot: 'bg-red-400' };
            default: return { bg: 'bg-slate-50', text: 'text-slate-600', icon: 'info', border: 'border-slate-200', dot: 'bg-slate-400' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-bold animate-pulse">Synchronizing Data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Premium Header Section */}
            <div className="bg-emerald-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-[100px] -ml-32 -mb-32"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 animate-in fade-in slide-in-from-top duration-700">
                        <div className="space-y-4">
                            <button 
                                onClick={() => navigate("/my-products")}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10 text-xs font-black uppercase tracking-widest"
                            >
                                <span className="material-icons text-sm">arrow_back</span>
                                Dashboard
                            </button>
                            <h1 className="text-4xl font-bold tracking-tight leading-none">
                                Request <span className="text-emerald-400">Library</span>
                            </h1>
                            <p className="text-emerald-100/50 max-w-sm text-xs font-medium leading-relaxed">
                                Seamlessly track your repair and recycling lifecycle. We ensure your items are handled with care.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                            {[
                                { label: 'Total', value: stats.total, color: 'text-white' },
                                { label: 'Pending', value: stats.pending, color: 'text-amber-400' },
                                { label: 'Active', value: stats.accepted, color: 'text-blue-400' },
                                { label: 'Settled', value: stats.completed, color: 'text-emerald-400' }
                            ].map((stat) => (
                                <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                                    <span className={`block text-xl font-bold ${stat.color} mb-0.5`}>{stat.value}</span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Discovery Bar */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-950/10 border border-slate-100 p-4 flex flex-col lg:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full lg:w-auto">
                        <span className="material-icons absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600/50">search</span>
                        <input 
                            type="text"
                            placeholder="Find specific requests..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-semibold placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 hide-scrollbar">
                        {["All", "Repair", "Recycle", "Pending", "Completed"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-3 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                    activeFilter === filter 
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="h-10 w-px bg-slate-100 hidden lg:block mx-2"></div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden xl:block">Sort:</span>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full lg:w-auto bg-slate-50 border-none rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/10 transition-all"
                        >
                            <option value="newest">Latest Entries</option>
                            <option value="oldest">Chronological</option>
                        </select>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-16">
                {filteredRequests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredRequests.map((req, idx) => {
                            if (!req) return null;
                            const statusConfig = getStatusConfig(req.status || 'Pending');
                            return (
                                <div 
                                    key={req._id} 
                                    className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom duration-500"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    {/* Visual Content Section */}
                                    <div className="relative h-36 overflow-hidden bg-slate-100">

                                        {req.image ? (
                                            <img src={req.image} alt={req.productName} className="w-full h-full object-cover transition-all duration-500 ease-out" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                                <span className="material-icons text-4xl mb-1">auto_awesome</span>
                                                <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Visual Pending</span>
                                            </div>
                                        )}

                                        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-20">
                                            <div className={`px-3 py-1.5 rounded-xl border backdrop-blur-xl flex items-center gap-2 shadow-sm ${statusConfig.bg}/90 ${statusConfig.text} ${statusConfig.border}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} animate-pulse`}></div>
                                                <span className="text-[9px] font-black uppercase tracking-wider">{req.status || 'Pending'}</span>
                                            </div>
                                            <div className={`px-3 py-1.5 rounded-xl border backdrop-blur-xl flex items-center gap-2 shadow-sm ${req.type === 'repair' ? 'bg-blue-50/90 text-blue-700 border-blue-200' : 'bg-emerald-50/90 text-emerald-700 border-emerald-200'}`}>
                                                <span className="material-icons text-sm">{req.type === 'repair' ? 'energy_savings_leaf' : 'recycling'}</span>
                                                <span className="text-[9px] font-black uppercase tracking-wider">{req.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Information Architecture */}
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="mb-4">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div>
                                                    <span className="block text-[8px] font-bold text-emerald-500 uppercase tracking-widest mb-0.5">{req.category || 'Category'}</span>
                                                    <h3 className="text-lg font-black text-slate-900 leading-tight tracking-tight">{req.productName}</h3>
                                                </div>
                                                <span className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[8px] font-bold">#{req._id.slice(-4).toUpperCase()}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-2 italic">
                                                "{req.description || 'Reviewing submission details...'}"
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 mb-3">
                                            <button 
                                                onClick={() => handleEditRequest(req)}
                                                disabled={(req.status || 'Pending').toLowerCase() !== 'pending'}
                                                className="flex-1 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-semibold uppercase tracking-wider hover:bg-emerald-600 hover:text-white disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-1.5 border border-emerald-100/50"
                                            >
                                                <span className="material-icons text-xs">edit</span>
                                                Update
                                            </button>
                                            <button 
                                                onClick={() => handleCancelRequest(req._id, req.type)}
                                                disabled={(req.status || 'Pending').toLowerCase() !== 'pending'}
                                                className="flex-1 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-[10px] font-semibold uppercase tracking-wider hover:bg-rose-600 hover:text-white disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-1.5 border border-rose-100/50"
                                            >
                                                <span className="material-icons text-xs">delete</span>
                                                Delete
                                            </button>
                                        </div>

                                        <div className="mt-auto pt-3 border-t border-slate-50">
                                            <div className="flex items-center justify-between text-[9px]">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[7px] font-bold text-slate-300 uppercase">Region:</span>
                                                    <span className="font-bold text-slate-500 uppercase truncate max-w-[60px]">{req.location?.address?.split(',')[0] || 'Local'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[7px] font-bold text-slate-300 uppercase">On:</span>
                                                    <span className="font-bold text-slate-500 uppercase">{req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '---'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="max-w-xl mx-auto py-32 text-center animate-in fade-in zoom-in duration-700">
                        <div className="w-40 h-40 bg-white shadow-2xl rounded-[4rem] flex items-center justify-center mx-auto mb-12 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-50 transform rotate-12 scale-150 group-hover:rotate-45 transition-transform duration-700"></div>
                            <span className="material-icons text-7xl text-emerald-200 relative z-10">layers_clear</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter uppercase">No Records <span className="text-emerald-500 italic font-medium">Found</span></h2>
                        <p className="text-slate-500 font-medium text-lg mb-12 leading-relaxed">
                            {searchQuery ? "We couldn't locate any requests matching your current search parameters. Try broad categories or different keywords." : "Your request portfolio is currently empty. Start extending the life of your electronics today."}
                        </p>
                        {!searchQuery && (
                            <button 
                                onClick={() => navigate("/my-products")}
                                className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-[0.25em] text-[10px] shadow-2xl shadow-emerald-600/40 hover:scale-105 transition-all active:scale-95"
                            >
                                Get Started Now
                            </button>
                        )}
                    </div>
                )}
            </main>

            {/* Edit Portal */}
            {isEditModalOpen && selectedRequest && (
                <RepairRecycleForm 
                    editData={{...selectedRequest}}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedRequest(null);
                    }}
                    onSuccess={fetchRequests}
                />
            )}
        </div>
    );
};

export default MyRequests;
