import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

// ── Lifecycle event config ──────────────────────────────────────────────────
const LIFECYCLE_EVENTS = [
    { value: "under repair",        color: "bg-amber-50 border-amber-300 text-amber-700",   icon: "build",          label: "Under Repair" },
    { value: "repair request",      color: "bg-amber-50 border-amber-300 text-amber-700",   icon: "build",          label: "Repair Request" },
    { value: "repair finished",     color: "bg-green-50 border-green-300 text-green-700",   icon: "check_circle",   label: "Repair Finished" },
    { value: "active",              color: "bg-sky-50 border-sky-300 text-sky-700",         icon: "play_circle",    label: "Active Use" },
    { value: "registered",          color: "bg-gray-50 border-gray-300 text-gray-700",      icon: "inventory_2",    label: "Registered" },
    { value: "send to recycle",     color: "bg-teal-50 border-teal-300 text-teal-700",      icon: "recycling",      label: "Send to Recycle" },
    { value: "recycling request",   color: "bg-teal-50 border-teal-300 text-teal-700",      icon: "recycling",      label: "Recycling Request" },
    { value: "recycling finished",  color: "bg-emerald-50 border-emerald-300 text-emerald-700", icon: "eco",        label: "Recycling Finished" },
    { value: "recycled",            color: "bg-emerald-50 border-emerald-300 text-emerald-700", icon: "eco",        label: "Recycled" },
    { value: "marketplace listing", color: "bg-blue-50 border-blue-300 text-blue-700",      icon: "storefront",     label: "Sent to Marketplace" },
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

// ── QRScreen ────────────────────────────────────────────────────────────────
const QRScreen = () => {
    const { productID } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Public endpoint — no auth needed so QR scanning works on mobile too
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/products/public/${productID}`
                );
                setProduct(res.data);
            } catch (error) {
                console.error("Error fetching product", error);
                toast.error("Failed to load product for QR display");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
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
                <p className="text-gray-500 mb-6">This product record does not exist or has been removed.</p>
                <Link to="/my-products" className="bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg">
                    Back to Products
                </Link>
            </div>
        );
    }

    const statusCfg = getEventConfig(product.status);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Nav */}
            <nav className="bg-white border-b border-green-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#166534] rounded flex items-center justify-center">
                        <span className="material-icons text-white text-sm">eco</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight text-gray-900">ReVolve</span>
                    <span className="text-gray-400 text-xs ml-2">/ QR Identity</span>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-500 hover:text-gray-900 transition-all flex items-center gap-1 font-bold text-sm"
                >
                    <span className="material-icons text-sm">arrow_back</span>
                    Back
                </button>
            </nav>

            <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">

                {/* ── QR Card ───────────────────────────────────────────── */}
                <div className="bg-white rounded-3xl shadow-lg border border-green-100 overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                    <div className="p-6 text-center">
                        {/* Product info */}
                        <h1 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-0.5">
                            {product.productName}
                        </h1>
                        <p className="text-sm text-gray-500 font-semibold mb-3">
                            {product.Brand} · {product.model}
                        </p>

                        {/* Status badge */}
                        <div className="flex justify-center mb-5">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full border capitalize ${statusCfg.color}`}>
                                <span className="material-icons text-[12px]">{statusCfg.icon}</span>
                                {product.status || "registered"}
                            </span>
                        </div>

                        {/* QR Code */}
                        <div className="relative inline-block group my-2">
                            <div className="absolute inset-0 bg-green-400 rounded-3xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                            <div className="relative bg-white p-4 rounded-[2rem] border-4 border-gray-50 shadow-inner inline-block">
                                {product.qrCode ? (
                                    <img
                                        src={product.qrCode}
                                        alt="Product QR Code"
                                        className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto"
                                    />
                                ) : (
                                    <div className="w-48 h-48 flex items-center justify-center">
                                        <span className="material-icons text-6xl text-gray-200">qr_code_2</span>
                                    </div>
                                )}
                            </div>
                            {/* Corner guides */}
                            <div className="absolute top-3 left-3 w-6 h-6 border-t-[3px] border-l-[3px] border-green-500 rounded-tl-lg"></div>
                            <div className="absolute top-3 right-3 w-6 h-6 border-t-[3px] border-r-[3px] border-green-500 rounded-tr-lg"></div>
                            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-[3px] border-l-[3px] border-green-500 rounded-bl-lg"></div>
                            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-[3px] border-r-[3px] border-green-500 rounded-br-lg"></div>
                        </div>

                        <p className="text-[10px] font-mono text-gray-400 mt-4 tracking-widest">{product.productID}</p>
                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-1">
                            ✓ Verified Digital Passport
                        </p>

                        {/* Action buttons */}
                        <div className="mt-5 flex gap-3 justify-center flex-wrap">
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-md text-sm"
                            >
                                <span className="material-icons text-sm">print</span>
                                Print Tag
                            </button>
                            <Link
                                to={`/product-public/${product.productID}`}
                                className="flex items-center gap-2 bg-[#166534] text-white px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-md text-sm"
                            >
                                <span className="material-icons text-sm">open_in_new</span>
                                Full Details
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Lifecycle Timeline ────────────────────────────────── */}
                <div className="bg-white rounded-3xl shadow-lg border border-green-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-green-50 flex items-center justify-between">
                        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <span className="material-icons text-green-600 text-lg">timeline</span>
                            Lifecycle History
                        </h2>
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {product.lifecycle?.length || 0} events
                        </span>
                    </div>

                    <div className="p-6">
                        {(!product.lifecycle || product.lifecycle.length === 0) ? (
                            <div className="text-center py-10 text-gray-400">
                                <span className="material-icons text-4xl mb-2 block">timeline</span>
                                <p className="text-sm font-medium">No lifecycle events recorded yet.</p>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Connecting line */}
                                <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-green-300 via-green-100 to-transparent"></div>

                                <div className="space-y-5">
                                    {product.lifecycle.slice().reverse().map((event, idx) => {
                                        const cfg = getEventConfig(event.eventType);
                                        return (
                                            <div key={idx} className="relative flex gap-4 pl-1">
                                                {/* Icon bubble */}
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm z-10 bg-white ${cfg.color}`}>
                                                    <span className="material-icons text-[16px]">{cfg.icon}</span>
                                                </div>

                                                {/* Event card */}
                                                <div className="flex-1 bg-gray-50 border border-green-100 rounded-xl p-3">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <span className="text-xs font-bold text-gray-900 capitalize">
                                                            {event.eventType}
                                                        </span>
                                                        {idx === 0 && (
                                                            <span className="text-[9px] bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap">
                                                                Latest
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-[11px] text-gray-500 italic mb-2">
                                                        "{event.description}"
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400">
                                                        <span className="flex items-center gap-0.5">
                                                            <span className="material-icons text-[11px]">calendar_today</span>
                                                            {new Date(event.date).toLocaleDateString("en-US", {
                                                                day: "numeric", month: "short", year: "numeric"
                                                            })}
                                                        </span>
                                                        {event.location && (
                                                            <span className="flex items-center gap-0.5">
                                                                <span className="material-icons text-[11px]">location_on</span>
                                                                {event.location}
                                                            </span>
                                                        )}
                                                        {event.performedBy && (
                                                            <span className="flex items-center gap-0.5">
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
                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest pb-4">
                    Powered by ReVolve · EcoCycle Secured Tagging v2.4
                </p>
            </main>
        </div>
    );
};

export default QRScreen;
