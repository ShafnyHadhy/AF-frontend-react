import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ItemDropdown from './ItemDropdown';
import LocationMap from './LocationMap';
import { X, Send, Recycle, Hammer, Package, Info } from 'lucide-react';
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
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState('');
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
  
    // load user products once
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/products`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            .then((res) => {
                setUserProducts(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error('Failed to load products', err);
                setUserProducts([]);
            });
    }, []);

    useEffect(() => {
        if (type === 'repair' && formData.location) {
            const { lat, lng } = formData.location;
            axios
                .get(`${import.meta.env.VITE_API_URL}/api/providers/nearby`, {
                    params: {
                        lat,
                        lng,
                        radius: 100,
                    },
                })
                .then((res) => {
                    const list = Array.isArray(res.data) ? res.data : res.data?.providers || [];
                    setProviders(list);
                    console.log("Nearby providers:", list);
                    setSelectedProvider((current) => {
                        const stillValid = list.some((p) => (p._id || p.id || p.email || '') === current);
                        return stillValid ? current : null;
                    });
                })
                .catch((error) => {
                    console.error("Failed to load providers", error);
                    setProviders([]);
                });
        } else if (type === 'repair') {
            setProviders([]);
            setSelectedProvider(null);
        }
    }, [type, formData.location]);

    const useMyLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser.');
            return;
        }

        setIsLocating(true);
        setLocationError('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const nextLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                setFormData((prev) => ({
                    ...prev,
                    location: nextLocation,
                }));
                setIsLocating(false);
            },
            (error) => {
                setIsLocating(false);
                setLocationError(error.message || 'Unable to get your location.');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    useEffect(() => {
        setFormData(prev => ({ ...prev, productName: '' }));
    }, [formData.category]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.location) {
            return toast.error("Please select a location on the map");
        }
        if (type === 'repair' && !selectedProvider) {
            return toast.error("Please select a nearby provider");
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

            console.log("Submitting request with payload:", payload);

            const token = localStorage.getItem('token');

            await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} request submitted!`);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
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

                <form onSubmit={handleSubmit} className="p-6 max-h-[85vh] overflow-y-auto space-y-6">
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

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="space-y-4 lg:col-span-5">
                            <ItemDropdown 
                                onSelect={(item) => setFormData({ ...formData, category: item.name, image: item.image })} 
                                hidePreview={!!formData.productName}
                            />

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Select Available Product</label>
                                    <select
                                        required
                                        disabled={!formData.category}
                                        value={formData.productName}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            const product = userProducts.find(p => p.productName === name);
                                            setFormData({ 
                                                ...formData, 
                                                productName: name, 
                                                image: product?.images?.[0] || formData.image 
                                            });
                                        }}
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

                                {formData.productName && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Selected Product Photo</p>
                                        <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-sm border-2 border-green-100 bg-gray-50 flex items-center justify-center">
                                            {formData.image && (formData.image.startsWith('http') || formData.image.startsWith('data:image')) ? (
                                                <img
                                                    src={formData.image}
                                                    alt={formData.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <Package className="w-6 h-6 opacity-30" />
                                                    </div>
                                                    <div className="text-center">
                                                        <span className="block text-[10px] font-bold uppercase tracking-tight">No Registration Photo</span>
                                                        <span className="block text-[9px] opacity-60">Using category default</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
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

                        <div className="space-y-4 lg:col-span-7">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Select Location</label>
                                <button
                                    type="button"
                                    onClick={useMyLocation}
                                    disabled={isLocating}
                                    className="w-full mb-2 px-4 py-3 rounded-xl border border-green-300 bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isLocating ? 'Locating...' : 'Use my location'}
                                </button>
                                <LocationMap
                                    onLocationSelect={(loc) => setFormData({ ...formData, location: loc })}
                                    selectedLocation={formData.location}
                                    providers={providers}
                                    onProviderSelect={setSelectedProvider}
                                    selectedProvider={selectedProvider}
                                />
                                {formData.location && (
                                    <p className="text-xs text-green-600 mt-2">
                                        Location selected: {formData.location.lat.toFixed(5)}, {formData.location.lng.toFixed(5)}
                                    </p>
                                )}
                                {locationError && (
                                    <p className="text-xs text-red-500 mt-2">{locationError}</p>
                                )}
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
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-700">Service Provider</label>
                                    <p className="text-xs text-gray-500">Select one nearby provider from the map or the larger list below.</p>

                                    <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-4 flex items-center justify-between gap-3 shadow-sm ring-1 ring-blue-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                                <Info className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Active Selection</p>
                                                <p className="text-sm font-black text-slate-900 leading-tight">
                                                    {selectedProvider ? (() => {
                                                        const p = providers.find((p, index) => (p._id || p.id || p.email || `provider-${index}`) === selectedProvider);
                                                        if (!p) return 'Provider selected';
                                                        return `${p.businessName || 'Unnamed Business'} (${p.firstName} ${p.lastName})`;
                                                    })() : 'No provider selected'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${selectedProvider ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-200'}`}>
                                            {selectedProvider ? 'SELECTED' : 'REQUIRED'}
                                        </span>
                                    </div>

                                    <div className="space-y-2 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 shadow-inner">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedProvider(null)}
                                            className={`w-full rounded-xl px-4 py-3 text-left transition-all border-2 ${!selectedProvider ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            <div className="font-bold text-sm">Clear Selection / Auto-assign</div>
                                        </button>

                                        {providers.map((p, index) => {
                                            const providerId = p._id || p.id || p.email || `provider-${index}`;
                                            const isSelected = selectedProvider === providerId;

                                            return (
                                                <button
                                                    key={providerId}
                                                    type="button"
                                                    onClick={() => setSelectedProvider(providerId)}
                                                    className={`w-full rounded-xl px-4 py-4 text-left transition-all border-2 ${isSelected ? 'border-blue-500 bg-blue-50/50 text-gray-900 shadow-md ring-2 ring-blue-500/10' : 'border-gray-100 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'}`}
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                                {p.firstName?.charAt(0)}{p.lastName?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className={`font-bold text-sm transition-colors ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                                                                    {p.businessName || 'Nearby Service'}
                                                                </div>
                                                                <div className="text-[10px] text-gray-500 font-medium">
                                                                    {p.firstName} {p.lastName} • {p.district || p.city || 'Local Area'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {typeof p.distanceKm === 'number' && (
                                                            <div className="text-right">
                                                                <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-100">
                                                                    {p.distanceKm} km
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={type === 'repair' && !selectedProvider}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Submit {type.toUpperCase()} Request
                    </button>
                </form>
            </div>
        </div>
        , document.body
    );
}
