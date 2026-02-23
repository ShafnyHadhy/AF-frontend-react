import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const AddProduct = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    productName: "",
    model: "",
    category: "Electronics",
    description: "",
    purchasePrice: "",
    condition: "good",
  });

  const [images, setImages] = useState([]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "purchasePrice") {
      if (value !== "" && !/^[0-9.]*$/.test(value)) {
        return; // Only allow numbers and decimal
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
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products`,
        { ...formData, purchasePrice: price, images },
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
          <h1 className="text-3xl font-bold mb-2">Register New Product</h1>
          <p className="text-zinc-500 font-bold">Provide product details and high-quality images for the lifecycle record.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          {/* Product Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Product Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="productName"
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
                placeholder="e.g. A3106, M3 Chip"
                onChange={handleChange}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
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
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Description</label>
              <textarea
                name="description"
                placeholder="Describe the product history, features, or any notable details..."
                onChange={handleChange}
                rows="4"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Condition</label>
              <select
                name="condition"
                onChange={handleChange}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                required
              >
                <option value="new">Brand New</option>
                <option value="good">Good / Used</option>
                <option value="damaged">Damaged / For Parts</option>
              </select>
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

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-zinc-900 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
          >
            <span className="material-icons">check_circle</span>
            Register Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;