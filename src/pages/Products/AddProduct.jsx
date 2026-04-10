import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const AddProduct = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // --- State Variables ---
  const [formData, setFormData] = useState({
    productName: "",
    Brand: "",
    model: "",
    condition: "good",
    description: "",
    price: "",
  });

  const [images, setImages] = useState([]);

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
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products`,
        { ...formData, images },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product registered successfully!");
      navigate("/my-products");
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Error adding product";
      const errorDetail = error.response?.data?.error ? `: ${error.response.data.error}` : "";
      toast.error(errorMessage + errorDetail, {
        style: { background: '#ef4444', color: '#fff' }
      });
    }
  };

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

      <div className="w-full max-w-7xl mx-auto py-6 px-6 flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="mb-6 shrink-0 text-center">
          <h1 className="text-3xl font-bold mb-1">Register New Product</h1>
          <p className="text-zinc-500 font-bold">Provide product details and high-quality images for the lifecycle record.</p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-green-300 shadow-md shadow-green-100/50 flex-1 min-h-0 overflow-hidden">
          {/* Left Column: Product Info Section */}
          <div className="flex-[2] flex flex-col gap-4 overflow-y-auto pr-4 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-900">Product Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="productName"
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
                  onChange={handleChange}
                  className="w-full bg-green-50/30 border border-green-300 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold"
                  required
                >
                  <option value="new">Brand New</option>
                  <option value="good">Good / Used</option>
                  <option value="damaged">Damaged / For Parts</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase text-gray-900">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe the product history, features, or any notable details..."
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-green-50/30 border border-green-300 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                ></textarea>
              </div>
              <div className="md:col-span-2 space-y-2">
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

          {/* Right Column: Image Upload Section & Submit */}
          <div className="flex-1 flex flex-col justify-between overflow-y-auto pl-4 md:border-l border-green-200 custom-scrollbar">
            <div className="space-y-4 mb-6">
              <label className="text-xs font-bold uppercase text-gray-900 block">Product Images</label>
              <div className="grid grid-cols-2 gap-4">
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
                  <span className="material-icons text-3xl mb-1">add</span>
                  <span className="text-[10px] font-bold">Add Photo</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="shrink-0 w-full bg-primary hover:bg-gray-300 text-gray-900 hover:text-gray-900 py-4 rounded-xl font-bold transition-all shadow-md shadow-green-100/50 border border-green-300 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
            >
              <span className="material-icons">check_circle</span>
              Register Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;