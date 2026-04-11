import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    Search, Filter, Edit, Trash2, CheckCircle, Clock, 
    XCircle, AlertCircle, ChevronLeft, ChevronRight,
    Hammer, Recycle, Plus, Info, Calendar, MapPin, Package
} from 'lucide-react';

export default function RequestManagement() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('repair'); // 'repair' or 'recycle'
    const [requests, setRequests] = useState([]);
    const [providers, setProviders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    
    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        description: '',
        quantity: 1,
        status: 'Pending',
        pickupDate: '',
        provider: '', // Added provider field
    });

    useEffect(() => {
        fetchRequests();
        fetchProviders();
    }, [activeTab, searchTerm, statusFilter, categoryFilter]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` };
    };

    const fetchProviders = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/providers`, {
                headers: getAuthHeaders()
            });
            setProviders(res.data);
        } catch (error) {
            console.error('Failed to fetch providers', error);
        }
    };

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const endpoint = activeTab === 'repair' ? '/api/repairs' : '/api/recycling';
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (statusFilter) params.append('status', statusFilter);
            if (categoryFilter) params.append('category', categoryFilter);

            const res = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}?${params.toString()}`, {
                headers: getAuthHeaders()
            });
            setRequests(res.data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this request?')) return;

        try {
            const endpoint = activeTab === 'repair' ? `/api/repairs/${id}` : `/api/recycling/${id}`;
            await axios.delete(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                headers: getAuthHeaders()
            });
            toast.success('Request deleted successfully');
            fetchRequests();
        } catch (error) {
            toast.error('Failed to delete request');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setModalLoading(true);
            const endpoint = activeTab === 'repair' ? `/api/repairs/${selectedRequest._id}` : `/api/recycling/${selectedRequest._id}`;
            
            // Clean up empty provider if unassigned
            const payload = { ...formData };
            if (!payload.provider) delete payload.provider;

            await axios.patch(`${import.meta.env.VITE_API_URL}${endpoint}`, payload, {
                headers: getAuthHeaders()
            });
            toast.success('Request updated successfully');
            setShowEditModal(false);
            fetchRequests();
        } catch (error) {
            toast.error('Failed to update request');
        } finally {
            setModalLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setModalLoading(true);
            const endpoint = activeTab === 'repair' ? '/api/repairs' : '/api/recycling';
            const payload = {
                ...formData,
                location: formData.location || { lat: 0, lng: 0, address: 'Admin Office' }
            };
            if (!payload.provider) delete payload.provider;

            await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, payload, {
                headers: getAuthHeaders()
            });
            toast.success('Request created successfully');
            setShowCreateModal(false);
            fetchRequests();
        } catch (error) {
            toast.error('Failed to create request');
        } finally {
            setModalLoading(false);
        }
    };

    const openEdit = (request) => {
        setSelectedRequest(request);
        setFormData({
            productName: request.productName || '',
            category: request.category || '',
            description: request.description || '',
            quantity: request.quantity || 1,
            status: request.status || 'Pending',
            pickupDate: request.pickupDate ? new Date(request.pickupDate).toISOString().split('T')[0] : '',
            provider: request.provider?._id || request.provider || '',
        });
        setShowEditModal(true);
    };

    const openCreate = () => {
        setFormData({
            productName: '',
            category: '',
            description: '',
            quantity: 1,
            status: 'Pending',
            pickupDate: '',
            provider: '',
        });
        setShowCreateModal(true);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Scheduled': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'In Progress': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Recycled': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="w-3 h-3" />;
            case 'Completed': 
            case 'Recycled': return <CheckCircle className="w-3 h-3" />;
            case 'Cancelled': return <XCircle className="w-3 h-3" />;
            default: return <AlertCircle className="w-3 h-3" />;
        }
    };

    return (
        <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-gray-50/30">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Request Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and track all repair and recycling activities</p>
                </div>
                <button 
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all font-semibold"
                >
                    <Plus className="w-4 h-4" />
                    New Request
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Hammer className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Repair Jobs</p>
                            <p className="text-2xl font-bold text-gray-900">{activeTab === 'repair' ? requests.length : '-'}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <Recycle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recycle Jobs</p>
                            <p className="text-2xl font-bold text-gray-900">{activeTab === 'recycle' ? requests.length : '-'}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'Pending').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scheduled Today</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {requests.filter(r => {
                                    if (!r.pickupDate) return false;
                                    const today = new Date().toISOString().split('T')[0];
                                    return r.pickupDate.startsWith(today);
                                }).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                <div className="flex flex-col sm:flex-row border-b border-gray-100">
                    <button 
                        onClick={() => setActiveTab('repair')}
                        className={`flex items-center gap-2 px-6 py-4 font-bold border-b-2 transition-all ${activeTab === 'repair' ? 'border-accent text-accent bg-accent/5' : 'border-transparent text-gray-500 hover:text-accent hover:bg-gray-50'}`}
                    >
                        <Hammer className="w-4 h-4" />
                        Repair Requests
                    </button>
                    <button 
                        onClick={() => setActiveTab('recycle')}
                        className={`flex items-center gap-2 px-6 py-4 font-bold border-b-2 transition-all ${activeTab === 'recycle' ? 'border-accent text-accent bg-accent/5' : 'border-transparent text-gray-500 hover:text-accent hover:bg-gray-50'}`}
                    >
                        <Recycle className="w-4 h-4" />
                        Recycling Requests
                    </button>
                    
                    <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 px-6 py-3 bg-gray-50/50">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <select 
                                className="flex-1 sm:w-40 px-3 py-2 border border-gray-200 rounded-xl outline-none text-sm bg-white"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <button 
                                onClick={() => { setSearchTerm(''); setStatusFilter(''); setCategoryFilter(''); }}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Clear Filters"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Request ID / Product</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Provider</th>
                                <th className="px-6 py-4">Pickup Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-6"><div className="h-10 bg-gray-100 rounded-lg w-full"></div></td>
                                    </tr>
                                ))
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <AlertCircle className="w-8 h-8" />
                                            <p className="font-medium">No requests found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-xs font-mono font-bold text-gray-400 mb-1">REQ-{req._id.slice(-6).toUpperCase()}</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">{req.productName}</p>
                                                        <p className="text-[10px] text-gray-500 font-medium">{req.category} • Quantity: {req.quantity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border capitalize ${getStatusStyles(req.status)}`}>
                                                {getStatusIcon(req.status)}
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{req.user?.firstName} {req.user?.lastName}</p>
                                                <p className="text-[10px] text-gray-500">{req.user?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {req.provider ? (
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{req.provider.firstName} {req.provider.lastName}</p>
                                                    <p className="text-[10px] text-blue-600 font-medium">Verified Partner</p>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.pickupDate ? (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-xs font-medium">{new Date(req.pickupDate).toLocaleDateString()}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => openEdit(req)}
                                                    className="p-2 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
                                                    title="Edit / Manage"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(req._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit / Create Modal */}
            {(showEditModal || showCreateModal) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                                {showEditModal ? <Edit className="w-5 h-5 text-accent" /> : <Plus className="w-5 h-5 text-accent" />}
                                {showEditModal ? 'Edit Request' : 'Create New Request'}
                            </h2>
                            <button onClick={() => { setShowEditModal(false); setShowCreateModal(false); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <XCircle className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={showEditModal ? handleUpdate : handleCreate} className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Product Name</label>
                                    <input 
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium"
                                        value={formData.productName}
                                        onChange={(e) => setFormData({...formData, productName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Category</label>
                                    <input 
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Description</label>
                                <textarea 
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all resize-none font-medium"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Quantity</label>
                                    <input 
                                        type="number"
                                        required
                                        min="1"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Status</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-accent"
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Accepted">Accepted</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Service Provider</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium"
                                        value={formData.provider}
                                        onChange={(e) => setFormData({...formData, provider: e.target.value})}
                                    >
                                        <option value="">Unassigned</option>
                                        {providers.map(p => (
                                            <option key={p._id} value={p._id}>
                                                {p.businessName} ({p.firstName} {p.lastName})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Pickup Date</label>
                                    <input 
                                        type="date"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium"
                                        value={formData.pickupDate}
                                        onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Selection Status Helper */}
                            <div className="rounded-2xl border-2 border-dashed border-gray-100 p-6 bg-gray-50/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                        <Info className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Assignment</p>
                                        <p className="text-sm font-bold text-gray-800">
                                            {formData.provider ? (
                                                `Assigned to: ${providers.find(p => p._id === formData.provider)?.businessName || 'Selected Provider'}`
                                            ) : (
                                                'Request is currently unassigned (Community Pool)'
                                            )}
                                        </p>
                                        <p className="text-[10px] text-gray-500 mt-1 italic">
                                            Assigning a provider will move this request to their dedicated dashboard.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button 
                                    type="button" 
                                    onClick={() => { setShowEditModal(false); setShowCreateModal(false); }}
                                    className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-all border border-gray-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={modalLoading}
                                    className="flex-1 py-4 font-bold text-white bg-accent rounded-2xl shadow-xl shadow-accent/30 hover:bg-accent/90 transition-all flex items-center justify-center gap-2 group"
                                >
                                    {modalLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            {showEditModal ? 'Save Changes' : 'Create Request'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
