import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const EditProduct = () => {
    const { productID } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        productName: "",
        model: "",
        category: "Electronics",
        description: "",
        purchasePrice: "",
        condition: "good",
        status: "",
    });

    const [images, setImages] = useState([]);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);


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
                    model: fetchedProduct.model,
                    category: fetchedProduct.category || "Electronics",
                    description: fetchedProduct.description || "",
                    purchasePrice: fetchedProduct.purchasePrice || "",
                    condition: fetchedProduct.condition || "good",
                    status: fetchedProduct.status || "registered",
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "purchasePrice") {
            if (value !== "" && !/^[0-9.]*$/.test(value)) {
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

        const price = parseFloat(formData.purchasePrice);
        if (isNaN(price) || price < 0) {
            toast.error("Please enter a valid numeric price!", {
                style: { background: '#ef4444', color: '#fff' }
            });
            return;
        }

        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/products/${productID}`,
                { ...formData, purchasePrice: price, images },
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
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-800 dark:text-slate-100">
            {/* Navigation */}
            <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between">
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

            <div className="max-w-2xl mx-auto py-12 px-6">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-bold mb-2">Edit Product</h1>
                    <p className="text-zinc-500 font-bold">Update product details and manage images.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    {/* Product Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-zinc-400">Product Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                placeholder="e.g. iPhone 15, MacBook Pro"
                                onChange={handleChange}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-zinc-400">Model <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                placeholder="e.g. A3106, M3 Chip"
                                onChange={handleChange}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase text-zinc-400">Category <span className="text-red-500">*</span></label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                                required
                            >
                                <option value="Electronics">Electronics</option>
                                <option value="Home Appliances">Home Appliances</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Fashion & Wearables">Fashion & Wearables</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase text-zinc-400">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                placeholder="Describe the product history, features, or any notable details..."
                                onChange={handleChange}
                                rows="4"
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-zinc-400">Purchase Price ($) <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="purchasePrice"
                                placeholder="0.00"
                                value={formData.purchasePrice}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || /^[0-9.]*$/.test(val)) {
                                        handleChange(e);
                                    }
                                }}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-400">Condition</label>
                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                            required
                        >
                            <option value="new">Brand New</option>
                            <option value="good">Good / Used</option>
                            <option value="damaged">Damaged / For Parts</option>
                        </select>
                    </div>

                    {/* Lifecycle Management Section */}
                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-8 mt-4">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-icons text-primary">analytics</span>
                            <h2 className="text-xl font-bold">Lifecycle Management</h2>
                        </div>

                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
                            <div className="flex flex-col gap-4">
                                <label className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    Set Current Lifecycle Stage
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-white dark:bg-zinc-800 border-2 border-primary/30 rounded-xl p-4 focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-lg cursor-pointer"
                                    required
                                >
                                    <option value="registered">Registered (Initial Entry)</option>
                                    <option value="manufacturing">Manufacturing (In Production)</option>
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
                            <label className="text-xs font-bold uppercase text-zinc-400 flex items-center gap-2">
                                <span className="material-icons text-sm">history</span>
                                Current Lifecycle Events
                            </label>
                            <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
                                <div className="space-y-4">
                                    {product?.lifecycle?.length > 0 ? (
                                        product.lifecycle.slice().reverse().map((event, i) => (
                                            <div key={i} className="flex gap-4 items-start relative pb-4 last:pb-0">
                                                {i !== product.lifecycle.length - 1 && (
                                                    <div className="absolute left-1.5 top-5 w-[1px] h-full bg-zinc-200 dark:bg-zinc-700"></div>
                                                )}
                                                <div className="w-3 h-3 rounded-full bg-primary mt-1 z-10 shadow-[0_0_5px_rgba(19,236,91,0.5)]"></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100 leading-none mb-1">{event.eventType}</p>
                                                    <p className="text-[11px] text-zinc-500 font-bold truncate">{event.description}</p>
                                                </div>
                                                <span className="text-[9px] font-bold text-zinc-400 uppercase font-mono">
                                                    {new Date(event.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-zinc-500 italic text-center py-4">No events recorded yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase text-zinc-400 block">Product Images</label>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary group">
                                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <span className="material-icons text-xs">close</span>
                                    </button>
                                </div>
                            ))}
                            <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-zinc-400 hover:text-primary">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <span className="material-icons text-3xl mb-1">add</span>
                                <span className="text-[10px] font-bold">Add Photo</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            to="/my-products"
                            className="flex-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 py-4 rounded-xl font-bold transition-all text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="flex-[2] bg-primary hover:bg-primary/90 text-zinc-900 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                        >
                            <span className="material-icons">save</span>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
