import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const RequestRecycling = () => {
    const { productID } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recyclingMethod, setRecyclingMethod] = useState("pickup");
    const [notes, setNotes] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${productID}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProduct(res.data);
            } catch (error) {
                console.error("Error fetching product", error);
                toast.error("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };

        if (productID) fetchProduct();
    }, [productID, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/products/${productID}/lifecycle`, {
                eventType: "Recycling Request",
                description: `Recycling requested via ${recyclingMethod}. Notes: ${notes || "None"}`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Recycling request submitted successfully!");
            navigate("/my-products");
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit recycling request");
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-800 dark:text-slate-100 font-display p-6">
            <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-2">Request Recycling</h1>
                    <p className="text-zinc-500 font-bold mb-8">Give your product a responsible second life. Choose your preferred recycling method.</p>

                    <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl mb-8 border border-zinc-100 dark:border-zinc-700">
                        <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center overflow-hidden">
                            {product?.images?.[0] ? (
                                <img src={product.images[0]} alt={product.model} className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-icons text-4xl text-zinc-400">inventory_2</span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold">{product?.brand} {product?.model}</h3>
                            <p className="text-xs text-zinc-500 font-mono">SN: {product?.serialNumber}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-primary">Recycling Method</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRecyclingMethod("pickup")}
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${recyclingMethod === 'pickup' ? 'border-primary bg-primary/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-primary/50'}`}
                                >
                                    <span className="material-icons">local_shipping</span>
                                    <span className="font-bold">Home Pickup</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRecyclingMethod("drop-off")}
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${recyclingMethod === 'drop-off' ? 'border-primary bg-primary/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-primary/50'}`}
                                >
                                    <span className="material-icons">store</span>
                                    <span className="font-bold">Drop-off Point</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-primary">Additional Notes (Optional)</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any specific instructions for pickup or drop-off..."
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl p-4 focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px]"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="p-4 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="p-4 rounded-xl font-bold bg-primary text-zinc-900 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestRecycling;
