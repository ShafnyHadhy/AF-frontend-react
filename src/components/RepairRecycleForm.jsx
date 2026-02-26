import React, { useState, useEffect } from 'react';
import ItemDropdown from './ItemDropdown';
import LocationMap from './LocationMap';
import { X, Send, Recycle, Hammer, Package } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function RepairRecycleForm({ onClose }) {
    const [type, setType] = useState('repair'); // 'repair' or 'recycle'
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        quantity: 1,
        image: '',
        location: null,
        category: ''
    });
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);

    useEffect(() => {
        if (type === 'repair') {
            axios.get('http://localhost:5001/api/users').then(res => {
                setProviders(res.data.filter(u => u.role === 'provider'));
            });
        }
    }, [type]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.location) {
            return toast.error("Please select a location on the map");
        }
        if (!formData.category) {
            return toast.error("Please select an item category");
        }

        try {
            const endpoint = type === 'repair' ? '/api/repairs' : '/api/recycling';
            const payload = { ...formData, provider: selectedProvider };

            await axios.post(`http://localhost:5001${endpoint}`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} request submitted!`);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        {type === 'repair' ? <Hammer className="text-primary" /> : <Recycle className="text-green-500" />}
                        Create {type.charAt(0).toUpperCase() + type.slice(1)} Request
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
                    {/* Toggle */}
                    <div className="flex p-1 bg-gray-100 rounded-2xl w-fit mx-auto">
                        <button
                            type="button"
                            onClick={() => setType('repair')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${type === 'repair' ? 'bg-white shadow-md text-primary' : 'text-gray-500'}`}
                        >
                            Repair
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('recycle')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${type === 'recycle' ? 'bg-white shadow-md text-green-600' : 'text-gray-500'}`}
                        >
                            Recycle
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <ItemDropdown onSelect={(item) => setFormData({ ...formData, category: item.name, image: item.image })} />

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Product Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. iPhone 13 Pro"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={formData.productName}
                                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Quantity</label>
                                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                                            className="px-4 py-3 hover:bg-gray-50 text-gray-500 font-bold"
                                        >-</button>
                                        <div className="flex-1 text-center font-bold">{formData.quantity}</div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                                            className="px-4 py-3 hover:bg-gray-50 text-gray-500 font-bold"
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Select Location</label>
                                <LocationMap onLocationSelect={(loc) => setFormData({ ...formData, location: loc })} />
                                <p className="text-xs text-gray-400">Click on the map to set your pickup/repair point</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Description / Issue</label>
                                <textarea
                                    required
                                    rows="4"
                                    placeholder="Explain the problem or recycling details..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {type === 'repair' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Service Provider</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        onChange={(e) => setSelectedProvider(e.target.value)}
                                    >
                                        <option value="">Any available provider</option>
                                        {providers.map(p => (
                                            <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group"
                    >
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Submit {type.toUpperCase()} Request
                    </button>
                </form>
            </div>
        </div>
    );
}
