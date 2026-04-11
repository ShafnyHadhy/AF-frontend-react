import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

// ── Lifecycle event config ──────────────────────────────────────────────────
const LIFECYCLE_EVENTS = [
    { value: "registered",          color: "bg-gray-50 border-gray-300 text-gray-600",      icon: "inventory_2",    label: "Registered" },
    { value: "repair request",      color: "bg-amber-50 border-amber-300 text-amber-700",   icon: "build",          label: "Repair Request" },
    { value: "repaired",            color: "bg-green-50 border-green-300 text-green-700",   icon: "check_circle",   label: "Repaired" },
    { value: "recycling request",   color: "bg-teal-50 border-teal-300 text-teal-700",      icon: "recycling",      label: "Recycling Request" },
    { value: "recycled",            color: "bg-emerald-50 border-emerald-300 text-emerald-700", icon: "eco",        label: "Recycled" },
    { value: "listed on marketplace", color: "bg-blue-50 border-blue-300 text-blue-700",      icon: "storefront",     label: "Listed on Marketplace" },
    { value: "marketplace listing", color: "bg-blue-50 border-blue-300 text-blue-700",      icon: "storefront",     label: "Listed on Marketplace" },
    { value: "active",              color: "bg-sky-50 border-sky-300 text-sky-700",         icon: "play_circle",    label: "Active Use" },
    { value: "sold",                color: "bg-violet-50 border-violet-300 text-violet-700", icon: "sell",          label: "Sold" },
    { value: "damaged",             color: "bg-red-50 border-red-300 text-red-700",         icon: "warning",        label: "Damaged" },
    { value: "in transit",          color: "bg-purple-50 border-purple-300 text-purple-700", icon: "local_shipping", label: "In Transit" },
    { value: "distributed",         color: "bg-indigo-50 border-indigo-300 text-indigo-700", icon: "hub",           label: "Distributed" },
];

const getEventConfig = (eventType) => {
    const et = (eventType || "").toLowerCase();
    return LIFECYCLE_EVENTS.find(e => e.value === et) || {
        color: "bg-gray-50 border-gray-200 text-gray-600",
        icon: "history",
        label: eventType || "Unknown",
    };
};

const ProductPublicDetails = () => {
    const { productID } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicDetails = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/public/${productID}`);
                setProduct(res.data);
            } catch (error) {
                console.error("Public fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicDetails();
    }, [productID]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <span className="material-icons text-6xl text-zinc-300 mb-4">search_off</span>
                <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
                <p className="text-zinc-500 mb-8 font-bold">The product record you are looking for does not exist or has been removed.</p>
                <Link to="/" className="bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg">Go Home</Link>
            </div>
        );
    }

    const statusCfg = getEventConfig(product.status);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Nav */}
            <nav className="bg-white border-b border-green-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#166534] rounded flex items-center justify-center">
                        <span className="material-icons text-white text-sm">eco</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900">ReVolve</span>
                    <span className="text-xs text-gray-400 ml-1">/ Verified Product</span>
                </div>
                <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full uppercase tracking-wider">
                    ✓ Verified Record
                </span>
            </nav>

            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">

                {/* ── Product Card ──────────────────────────────────────── */}
                <div className="bg-white rounded-3xl overflow-hidden border border-green-100 shadow-xl">
                    <div className="h-1.5 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Image */}
                        <div className="bg-zinc-100 aspect-square md:aspect-auto min-h-[240px] flex items-center justify-center">
                            {product.images?.[0] ? (
                                <img src={product.images[0]} alt={product.model} className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-icons text-9xl text-zinc-200">inventory_2</span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-8 flex flex-col justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mt-2 mb-1 text-gray-900">{product.productName}</h1>
                                <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-2">
                                    {product.Brand} • {product.model}
                                </p>
                                <p className="text-zinc-400 font-mono text-[10px] mb-4">ID: {product.productID}</p>

                                {/* Status badge */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full border capitalize ${statusCfg.color}`}>
                                        <span className="material-icons text-[13px]">{statusCfg.icon}</span>
                                        {product.status || "registered"}
                                    </span>
                                </div>

                                {product.description && (
                                    <p className="text-zinc-600 text-sm italic border-l-2 border-green-300 pl-4 py-1 mb-6">
                                        {product.description}
                                    </p>
                                )}

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Condition</p>
                                        <p className="font-bold text-lg capitalize">{product.condition}</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 col-span-2 text-center">
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Price</p>
                                        <p className="font-bold text-2xl text-green-700">Rs. {product.price || 0}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Owner */}
                            <div className="flex items-center gap-4 p-4 bg-zinc-900 text-white rounded-2xl shadow-lg">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                    <span className="material-icons text-green-400">verified_user</span>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Registered Owner</p>
                                    <p className="font-bold text-sm truncate">{product.ownerEmail}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Lifecycle Timeline ────────────────────────────────── */}
                <div className="bg-white rounded-3xl border border-green-100 shadow-xl overflow-hidden">
                    <div className="px-8 py-5 border-b border-green-50 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <span className="material-icons text-green-600">timeline</span>
                            Product Lifecycle History
                        </h2>
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            {product.lifecycle?.length || 0} recorded events
                        </span>
                    </div>

                    <div className="p-8">
                        {(!product.lifecycle || product.lifecycle.length === 0) ? (
                            <div className="text-center py-12 text-gray-400">
                                <span className="material-icons text-5xl mb-3 block">timeline</span>
                                <p className="font-medium">No lifecycle events have been recorded for this product.</p>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Timeline vertical line */}
                                <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-green-300 via-green-100 to-transparent"></div>

                                <div className="space-y-6">
                                    {product.lifecycle.slice().reverse().map((event, idx) => {
                                        const cfg = getEventConfig(event.eventType);
                                        return (
                                            <div key={idx} className="relative flex gap-5 pl-1">
                                                {/* Icon bubble */}
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm z-10 bg-white ${cfg.color}`}>
                                                    <span className="material-icons text-[17px]">{cfg.icon}</span>
                                                </div>

                                                {/* Event card */}
                                                <div className="flex-1 bg-gray-50 border border-green-100 rounded-2xl p-4 shadow-sm">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-base capitalize text-gray-900 leading-none">
                                                                {event.eventType}
                                                            </p>
                                                            {idx === 0 && (
                                                                <span className="text-[9px] bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-bold uppercase">
                                                                    Latest
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border w-fit ${cfg.color}`}>
                                                            {new Date(event.date).toLocaleDateString("en-US", {
                                                                month: "short", day: "numeric", year: "numeric"
                                                            })}
                                                        </div>
                                                    </div>

                                                    <p className="text-sm text-zinc-500 italic mb-3">"{event.description}"</p>

                                                    {/* Meta: location + performedBy */}
                                                    <div className="flex flex-wrap gap-2 text-[10px] text-gray-400">
                                                        {event.location && (
                                                            <span className="flex items-center gap-1 bg-white border border-gray-100 rounded-full px-2 py-0.5">
                                                                <span className="material-icons text-[11px]">location_on</span>
                                                                {event.location}
                                                            </span>
                                                        )}
                                                        {event.performedBy && (
                                                            <span className="flex items-center gap-1 bg-white border border-gray-100 rounded-full px-2 py-0.5">
                                                                <span className="material-icons text-[11px]">person</span>
                                                                {event.performedBy}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-zinc-400 pb-6">
                    <p className="text-sm font-bold">This is a verified digital certificate of authenticity powered by ReVolve.</p>
                    <p className="text-xs mt-1">EcoCycle Pro v2.4 · Secured Lifecycle Tracking</p>
                </div>
            </div>
        </div>
    );
};

export default ProductPublicDetails;
