import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const QRScreen = () => {
    const { productID } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/products/${productID}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
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
    }, [productID, token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 text-center text-slate-800 dark:text-slate-100 font-display">
                <span className="material-icons text-6xl text-zinc-300 mb-4">search_off</span>
                <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
                <Link to="/my-products" className="bg-primary text-zinc-900 px-8 py-3 rounded-xl font-bold shadow-lg mt-4">Back to Products</Link>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col text-slate-800 dark:text-slate-100 font-display">
            <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-zinc-900 text-sm">qr_code_2</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight">QR Identity Display</span>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center gap-1 font-bold"
                >
                    <span className="material-icons">arrow_back</span>
                    Back
                </button>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-transparent to-primary/5">
                <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 shadow-2xl border border-zinc-100 dark:border-zinc-800 text-center relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

                    <header className="mb-6">
                        <h1 className="text-xl font-black uppercase tracking-tight mb-1">{product.productName}</h1>
                        <p className="text-zinc-500 font-bold text-sm">{product.model}</p>
                        <div className="inline-block mt-3 px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">
                            <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest leading-none mb-1">Serial Number</p>
                            <p className="font-mono text-xs font-bold text-primary">{product.serialNumber}</p>
                        </div>
                    </header>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary rounded-3xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <div className="relative bg-white p-4 rounded-[2rem] border-4 border-zinc-50 dark:border-zinc-800 shadow-inner inline-block">
                            <img
                                src={product.qrCode}
                                alt="Product QR Code"
                                className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto"
                            />
                        </div>

                        {/* Scanning Guides */}
                        <div className="absolute top-3 left-3 w-6 h-6 border-t-[3px] border-l-[3px] border-primary rounded-tl-lg"></div>
                        <div className="absolute top-3 right-3 w-6 h-6 border-t-[3px] border-r-[3px] border-primary rounded-tr-lg"></div>
                        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-[3px] border-l-[3px] border-primary rounded-bl-lg"></div>
                        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-[3px] border-r-[3px] border-primary rounded-br-lg"></div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <p className="text-xs font-bold text-zinc-500 px-4">
                            Scan this code to verify authenticity and view the complete digital lifecycle timeline.
                        </p>
                        <div className="flex items-center justify-center gap-1.5 text-primary">
                            <span className="material-icons animate-bounce text-sm">expand_more</span>
                            <span className="text-[9px] uppercase font-black tracking-[0.2em]">Verified digital passport</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-col items-center gap-3">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg text-sm"
                    >
                        <span className="material-icons text-sm">print</span>
                        Print Tag Label
                    </button>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        Powered by EcoCycle Secured Tagging v2.4
                    </p>
                </div>
            </main>
        </div>
    );
};

export default QRScreen;
