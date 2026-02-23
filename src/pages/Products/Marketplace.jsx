import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qrModal, setQrModal] = useState({ show: false, qrCode: "", productID: "" });
    const currentUserEmail = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    const handleUnlist = async (productID) => {
        if (!window.confirm("Are you sure you want to remove this product from the marketplace?")) return;

        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/products/${productID}/sell`,
                { isForSale: false },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Product removed from marketplace");
            setProducts(products.filter(p => p.productID !== productID));
        } catch (error) {
            console.error("Unlist error", error);
            toast.error("Failed to unlist product");
        }
    };

    useEffect(() => {
        const fetchMarketplace = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/marketplace`);
                setProducts(res.data);
            } catch (error) {
                console.error("Marketplace fetch error", error);
                toast.error("Failed to load marketplace");
            } finally {
                setLoading(false);
            }
        };

        fetchMarketplace();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-800 dark:text-slate-100 font-display">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">EcoCycle Marketplace</h1>
                    <p className="text-zinc-500 font-bold max-w-2xl">Give products a second life. Browse high-quality used products from our verified community.</p>
                </header>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                        <span className="material-icons text-6xl text-zinc-300 mb-4">storefront</span>
                        <p className="text-zinc-500 font-bold">No products listed for sale currently.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border-b-4 border-b-transparent hover:border-b-primary">
                                <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                    {product.images?.[0] ? (
                                        <img src={product.images[0]} alt={product.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <span className="material-symbols-outlined text-6xl text-zinc-300">
                                            {product.category?.toLowerCase().includes('electronics') ? 'smartphone' :
                                                product.category?.toLowerCase().includes('appliances') ? 'kitchen' :
                                                    product.category?.toLowerCase().includes('furniture') ? 'chair' : 'inventory_2'}
                                        </span>
                                    )}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                                        <span className="bg-primary text-zinc-900 font-bold px-3 py-1 rounded-full text-xs shadow-lg">
                                            ${product.price}
                                        </span>
                                        {product.qrCode && (
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setQrModal({ show: true, qrCode: product.qrCode, productID: product.productID });
                                                }}
                                                className="w-12 h-12 bg-white p-1 rounded-lg shadow-lg border border-zinc-200 cursor-zoom-in hover:scale-110 transition-transform active:scale-95"
                                                title="Click to enlarge QR"
                                            >
                                                <img src={product.qrCode} alt="QR Code" className="w-full h-full" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-3 left-3">
                                        <span className="bg-black/50 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                            {product.condition}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-lg mb-1">{product.productName} {product.model}</h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden border border-zinc-300 dark:border-zinc-700">
                                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${product.ownerEmail}`} alt="Seller" />
                                        </div>
                                        <span className="text-[10px] text-zinc-400 font-bold truncate">{product.ownerEmail}</span>
                                    </div>
                                    {currentUserEmail === product.ownerEmail ? (
                                        <button
                                            onClick={() => handleUnlist(product.productID)}
                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-icons text-sm">money_off</span>
                                            Unlist Product
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => toast.success("Buy feature coming soon!")}
                                            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-icons text-sm">shopping_cart</span>
                                            Buy Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* QR Modal */}
            {qrModal.show && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setQrModal({ ...qrModal, show: false })}
                >
                    <div
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="w-full flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Product QR Code</h3>
                            <button
                                onClick={() => setQrModal({ ...qrModal, show: false })}
                                className="w-8 h-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors"
                            >
                                <span className="material-icons text-zinc-400">close</span>
                            </button>
                        </header>

                        <div className="bg-white p-6 rounded-2xl border-4 border-primary shadow-inner mb-8 w-64 h-64 flex items-center justify-center overflow-hidden">
                            <img src={qrModal.qrCode} alt="Enlarged QR" className="w-full h-full" />
                        </div>

                        <Link
                            to={`/product-public/${qrModal.productID}`}
                            className="bg-primary hover:bg-primary/90 text-zinc-900 w-full py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mb-2"
                        >
                            <span className="material-icons">info</span>
                            View Public Details
                        </Link>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2">Verified via EcoCycle Pro</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
