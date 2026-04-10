import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const EditProduct = () => {
    const { productID } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // --- State Variables ---
    const [formData, setFormData] = useState({
        productName: "",
        Brand: "",
        model: "",
        condition: "good",
        description: "",
        status: "",
        price: "",
    });

    const [images, setImages] = useState([]);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Fetch Product Data ---
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/products/${productID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const fetchedProduct = res.data;
                setProduct(fetchedProduct);
                setFormData({
                    productName: fetchedProduct.productName,
                    Brand: fetchedProduct.Brand || "",
                    model: fetchedProduct.model,
                    condition: fetchedProduct.condition || "good",
                    description: fetchedProduct.description || "",
                    status: fetchedProduct.status || "registered",
                    price: fetchedProduct.price || "",
                });
                setImages(fetchedProduct.images || []);
            } catch (error) {
                console.error("Error fetching product", error);
                toast.error("Error loading product data");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productID, token]);

    // --- Form Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Numeric validation for price field
        if (name === "price") {
            if (value !== "" && !/^\d*$/.test(value)) {
                return;
            }
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages((prev) => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/products/${productID}`,
                { ...formData, images },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Product updated successfully!");
            navigate("/my-products");
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Error updating product";
            const errorDetail = error.response?.data?.error ? `: ${error.response.data.error}` : "";
            toast.error(errorMessage + errorDetail);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark h-screen overflow-hidden flex flex-col font-display text-slate-800 dark:text-slate-100">
            {/* Navigation */}
            <nav className="bg-white dark:bg-zinc-900 border-b border-green-300 shadow-sm shadow-green-100/50 px-6 py-3 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                        <span className="material-icons text-zinc-900 text-sm">inventory_2</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight">EcoCycle Pro</span>
                </div>
                <Link to="/my-products" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">
                    <span className="material-icons">close</span>
                </Link>
            </nav>

            <div className="w-full max-w-[90rem] mx-auto py-6 px-6 flex-1 flex flex-col min-h-0 overflow-hidden">
                <header className="mb-6 shrink-0 text-center">
                    <h1 className="text-3xl font-bold mb-1">Edit Product</h1>
                    <p className="text-zinc-500 font-bold">Update product details and manage images.</p>
                </header>

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-green-300 shadow-md shadow-green-100/50 flex-1 min-h-0 overflow-hidden">
                    {/* Column 1: Product Info Section */}
                    <div className="flex-[1.5] flex flex-col gap-4 overflow-y-auto pr-4 custom-scrollbar lg:border-r border-green-200">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-900">Product Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="productName"
                                    value={formData.productName}
                                    placeholder="e.g. iPhone 15, MacBook Pro"
                                    onChange={handleChange}
                                    className="w-full bg-green-50/30 border border-green-300 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-900">Brand <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="Brand"
                                    value={formData.Brand}
                                    placeholder="e.g. Apple, Samsung"
                                    onChange={handleChange}
                                    className="w-full bg-green-50/30 border border-green-300 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-900">Model <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    placeholder="e.g. A3106, M3 Chip"
                                    onChange={handleChange}
                                    className="w-full bg-green-50/30 border border-green-300 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-900">Condition</label>
                                <select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    className="w-full bg-green-50/30 border border-green-300 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold"
                                    required
                                >
                                    <option value="new">Brand New</option>
                                    <option value="good">Good / Used</option>
                                    <option value="damaged">Damaged / For Parts</option>
                                </select>
                            </div>
                            <div className="xl:col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-900">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    placeholder="Describe the product history, features, or any notable details..."
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full bg-green-50/30 border border-green-300 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                ></textarea>
                            </div>
                            <div className="xl:col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-900">Price (Rs.) <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold">Rs.</span>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        placeholder="e.g. 5000"
                                        onChange={handleChange}
                                        className="w-full bg-green-50/30 border border-green-300 rounded-xl p-3 pl-12 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Lifecycle Management Section */}
                    <div className="flex-1 flex flex-col gap-6 overflow-y-auto px-0 lg:px-4 custom-scrollbar lg:border-r border-green-200">
                        <div className="flex items-center gap-2">
                            <span className="material-icons text-gray-900">analytics</span>
                            <h2 className="text-lg font-bold text-gray-900">Lifecycle Management</h2>
                        </div>

                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    Set Current Lifecycle Stage
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-xl p-3 focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold cursor-pointer"
                                    required
                                >
                                    <option value="registered">Registered (Initial Entry)</option>
                                    <option value="in transit">In Transit (Shipping)</option>
                                    <option value="distributed">Distributed (At Retailer)</option>
                                    <option value="active">Active (With Customer)</option>
                                    <option value="end of life">End of Life (Disposal/Recycling)</option>
                                </select>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight italic text-right">
                                    Changing the status will record a new milestone in the product's digital passport.
                                </p>
                            </div>
                        </div>

                        {/* Lifecycle History Preview */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold uppercase text-gray-900 flex items-center gap-2">
                                <span className="material-icons text-sm">history</span>
                                Current Lifecycle Events
                            </label>
                            <div className="bg-green-50/30 rounded-2xl p-4 border border-green-200">
                                <div className="space-y-3">
                                    {product?.lifecycle?.length > 0 ? (
                                        product.lifecycle.slice().reverse().map((event, i) => (
                                            <div key={i} className="flex gap-3 items-start relative pb-3 last:pb-0">
                                                {i !== product.lifecycle.length - 1 && (
                                                    <div className="absolute left-1.5 top-4 w-[1px] h-full bg-zinc-200 dark:bg-zinc-700"></div>
                                                )}
                                                <div className="w-3 h-3 rounded-full bg-primary mt-1 z-10 shadow-[0_0_5px_rgba(19,236,91,0.5)]"></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] font-black uppercase text-zinc-900 dark:text-zinc-100 leading-none mb-1">{event.eventType}</p>
                                                    <p className="text-[10px] text-zinc-500 font-bold truncate">{event.description}</p>
                                                </div>
                                                <span className="text-[8px] font-bold text-zinc-400 uppercase font-mono">
                                                    {new Date(event.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-zinc-500 italic text-center py-2">No events recorded yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Image Upload Section & Buttons */}
                    <div className="flex-[1.2] flex flex-col justify-between overflow-y-auto pl-0 lg:pl-4 custom-scrollbar">
                        <div className="space-y-4 mb-6">
                            <label className="text-xs font-bold uppercase text-gray-900 block">Product Images</label>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {images.map((img, index) => (
                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary group">
                                        <img src={img} alt="Product" loading="lazy" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <span className="material-icons text-xs">close</span>
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-square rounded-xl border-2 border-dashed border-green-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-green-50 transition-all text-zinc-400 hover:text-gray-900">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <span className="material-icons text-2xl mb-1">add</span>
                                    <span className="text-[9px] font-bold">Add Photo</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 shrink-0">
                            <Link
                                to="/my-products"
                                className="flex-1 bg-white border border-green-300 hover:bg-green-50 text-zinc-600 py-3 rounded-xl font-bold transition-all text-center flex items-center justify-center text-sm shadow-sm shadow-green-100/50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="flex-[2] bg-primary hover:bg-gray-300 text-gray-900 hover:text-gray-900 py-3 rounded-xl font-bold transition-all shadow-md shadow-green-100/50 border border-green-300 flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
                            >
                                <span className="material-icons text-sm">save</span>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
