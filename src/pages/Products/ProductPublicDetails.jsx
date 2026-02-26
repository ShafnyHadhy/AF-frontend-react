import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

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
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 text-center">
                <span className="material-icons text-6xl text-zinc-300 mb-4">search_off</span>
                <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
                <p className="text-zinc-500 mb-8 font-bold">The product record you are looking for does not exist or has been removed.</p>
                <Link to="/" className="bg-primary text-zinc-900 px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20">Go Home</Link>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-800 dark:text-slate-100 font-display">
            <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                        <span className="material-icons text-zinc-900 text-sm">inventory_2</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight">EcoCycle Verified</span>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left: Images */}
                        <div className="bg-zinc-100 dark:bg-zinc-800 aspect-square md:aspect-auto">
                            {product.images?.[0] ? (
                                <img src={product.images[0]} alt={product.model} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-9xl text-zinc-300">inventory_2</span>
                                </div>
                            )}
                        </div>

                        {/* Right: Info */}
                        <div className="p-8 flex flex-col justify-between">
                            <div>
                                <div className="mb-6">
                                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Verified Record
                                    </span>
                                    <h1 className="text-3xl font-bold mt-4 mb-1">{product.productName}</h1>
                                    <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-4">{product.Brand} • {product.model}</p>
                                    <p className="text-zinc-400 font-mono text-[10px] leading-none mb-4">ID: {product.productID}</p>
                                    {product.description && (
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm italic border-l-2 border-primary/30 pl-4 py-1 mb-6">
                                            {product.description}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Status</p>
                                        <p className="font-bold text-lg capitalize">{product.status}</p>
                                    </div>
                                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Condition</p>
                                        <p className="font-bold text-lg capitalize">{product.condition}</p>
                                    </div>
                                    <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 col-span-2 text-center">
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Original Price</p>
                                        <p className="font-bold text-2xl text-primary">Rs. {product.price || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-zinc-900 text-white rounded-2xl shadow-lg">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                    <span className="material-icons text-primary">verified_user</span>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Original Owner</p>
                                    <p className="font-bold truncate text-sm">{product.ownerEmail}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div className="border-t border-zinc-100 dark:border-zinc-800 p-8 pt-10">
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <span className="material-icons text-primary">history</span>
                            Product Lifecycle History
                        </h2>

                        <div className="relative pl-8 border-l border-zinc-200 dark:border-zinc-800 space-y-10">
                            {product.lifecycle?.slice().reverse().map((event, index) => (
                                <div key={index} className="relative">
                                    <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border-4 border-primary shadow-sm z-10"></div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <div>
                                            <p className="font-bold text-lg capitalize leading-none mb-1">{event.eventType}</p>
                                            <p className="text-zinc-500 font-bold text-sm tracking-tight">{event.description}</p>
                                        </div>
                                        <div className="text-[10px] font-bold text-zinc-400 uppercase bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full w-fit">
                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-zinc-500">
                    <p className="text-sm font-bold">This is a verified digital certificate of authenticity powerd by EcoCycle Pro.</p>
                </div>
            </div>
        </div>
    );
};

export default ProductPublicDetails;
