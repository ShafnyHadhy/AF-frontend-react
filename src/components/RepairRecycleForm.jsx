import React, { useState, useEffect } from 'react';
import ItemDropdown from './ItemDropdown';
import LocationMap from './LocationMap';
import { X, Send, Recycle, Hammer, Package } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CATALOG_DATA = {
    Phone: {
        Apple: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro", "iPhone 14", "iPhone 13", "iPhone 12", "iPhone 11", "Older iPhone"],
        Samsung: ["Galaxy S24 Ultra", "Galaxy S24", "Galaxy S23 Ultra", "Galaxy S23", "Galaxy Z Fold 5", "Galaxy Z Flip 5", "Galaxy A54", "Older Galaxy"],
        Google: ["Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro", "Pixel 7a", "Pixel 6", "Older Pixel"],
        OnePlus: ["OnePlus 12", "OnePlus 11", "OnePlus 10 Pro", "Older OnePlus"],
        Other: ["Other Model"]
    },
    Laptop: {
        Apple: ["MacBook Pro 16\"", "MacBook Pro 14\"", "MacBook Air M2", "MacBook Air M1", "Older MacBook"],
        Dell: ["XPS 15", "XPS 13", "Inspiron", "Latitude", "Alienware", "Other Dell"],
        Lenovo: ["ThinkPad X1 Carbon", "ThinkPad T-Series", "IdeaPad", "Legion", "Other Lenovo"],
        HP: ["Spectre x360", "Envy", "Pavilion", "Omen", "Other HP"],
        Asus: ["ZenBook", "ROG Zephyrus", "VivoBook", "Other Asus"],
        Other: ["Other Model"]
    },
    Watch: {
        Apple: ["Apple Watch Ultra 2", "Apple Watch Series 9", "Apple Watch SE", "Older Apple Watch"],
        Samsung: ["Galaxy Watch 6 Classic", "Galaxy Watch 6", "Galaxy Watch 5", "Older Galaxy Watch"],
        Garmin: ["Fenix 7", "Epix Pro", "Forerunner", "Other Garmin"],
        Other: ["Other Model"]
    },
    Tablet: {
        Apple: ["iPad Pro 12.9\"", "iPad Pro 11\"", "iPad Air", "iPad mini", "Older iPad"],
        Samsung: ["Galaxy Tab S9 Ultra", "Galaxy Tab S9", "Galaxy Tab A8", "Older Galaxy Tab"],
        Microsoft: ["Surface Pro 9", "Surface Pro 8", "Surface Go", "Other Surface"],
        Lenovo: ["Tab P12 Pro", "Tab P11", "Other Lenovo Tab"],
        Other: ["Other Model"]
    },
    Camera: {
        Canon: ["EOS R5", "EOS R6", "EOS Rebel", "Other Canon"],
        Sony: ["Alpha a7 IV", "Alpha a7R V", "Alpha a6700", "Other Sony"],
        Nikon: ["Z8", "Z7 II", "Z6 II", "Other Nikon"],
        Fujifilm: ["X-T5", "X-H2", "Other Fujifilm"],
        Other: ["Other Model"]
    },
    Accessories: {
        Audio: ["AirPods Pro", "AirPods Max", "Galaxy Buds", "Sony WH-1000XM5", "Other Headphones"],
        Peripherals: ["Magic Keyboard", "Magic Mouse", "Logitech MX Master", "Logitech Keyboards", "Other Peripheral"],
        Power: ["Chargers & Adapters", "Power Banks", "Cables", "Other Power Accessory"],
        Other: ["Other Accessory"]
    }
};

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
    const [userProducts, setUserProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);

    useEffect(() => {
        if (type === 'repair') {
            axios.get(import.meta.env.VITE_API_URL + '/api/users').then(res => {
                setProviders(res.data.filter(u => u.role === 'provider'));
            });
        }
        axios.get(import.meta.env.VITE_API_URL + '/api/products', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => {
            setUserProducts(res.data);
        }).catch(err => console.error(err));
    }, [type]);

    useEffect(() => {
        setFormData(prev => ({ ...prev, productName: '' }));
    }, [formData.category]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.location) {
            return toast.error("Please select a location on the map");
        }
        if (!formData.category) {
            return toast.error("Please select an item category");
        }
        if (!formData.productName) {
            return toast.error("Please select a Product");
        }

        try {
            const endpoint = type === 'repair' ? '/api/repairs' : '/api/recycling';
            const payload = { ...formData, provider: selectedProvider };

            await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} request submitted!`);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    // using userProducts filtering instead of catalog

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        {type === 'repair' ? <Hammer className="text-blue-600" /> : <Recycle className="text-green-500" />}
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
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${type === 'repair' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500'}`}
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

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Select Available Product</label>
                                    <select
                                        required
                                        disabled={!formData.category}
                                        value={formData.productName}
                                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                    >
                                        <option value="" disabled>Select from your existing {formData.category || 'products'}</option>
                                        {userProducts
                                            .filter(p => !formData.category || (p.category && p.category.toLowerCase() === formData.category.toLowerCase()))
                                            .map(p => (
                                                <option key={p.productID} value={p.productName}>{p.productName} ({p.Brand} {p.model})</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 text-left">
                                    <label className="text-sm font-semibold text-gray-700">Quantity</label>
                                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                                            className="px-3 py-3 hover:bg-gray-50 text-gray-500 font-bold w-12 flex items-center justify-center"
                                        >-</button>
                                        <div className="flex-1 text-center font-bold text-gray-900">{formData.quantity}</div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                                            className="px-3 py-3 hover:bg-gray-50 text-gray-500 font-bold w-12 flex items-center justify-center"
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-gray-700">Select Location</label>
                                <LocationMap onLocationSelect={(loc) => setFormData({ ...formData, location: loc })} />
                                <p className="text-xs text-gray-400">Click on the map to set your pickup/repair point</p>
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-gray-700">Description / Issue</label>
                                <textarea
                                    required
                                    rows="4"
                                    placeholder="Explain the problem or recycling details..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-gray-900 bg-white"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {type === 'repair' && (
                                <div className="space-y-2 text-left">
                                    <label className="text-sm font-semibold text-gray-700">Service Provider</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 bg-white"
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
                        className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group ${type === 'repair' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30' : 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/30'}`}
                    >
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Submit {type.toUpperCase()} Request
                    </button>
                </form>
            </div>
        </div>
    );
}
