import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProducts(res.data);
        if (res.data.length > 0) {
          setSelectedProduct(res.data[0]);
        }
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "in transit":
        return "bg-orange-500";
      case "retail ready":
      case "registered":
      case "active":
      case "distributed":
        return "bg-primary";
      case "manufacturing":
        return "bg-blue-500";
      case "end of life":
      case "legacy":
        return "bg-red-500";
      default:
        return "bg-zinc-500";
    }
  };

  const getProgressWidth = (product) => {
    if (!product.lifecycle || product.lifecycle.length === 0) return "0%";
    const stages = ["registered", "manufacturing", "in transit", "distributed", "active"];
    const currentStage = product.status?.toLowerCase();
    const index = stages.indexOf(currentStage);
    if (index === -1) return "100%";
    return `${((index + 1) / stages.length) * 100}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen flex flex-col font-display">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="material-icons text-zinc-900">inventory_2</span>
            </div>
            <span className="font-bold text-xl tracking-tight">EcoCycle Pro</span>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
            <button className="px-4 py-1.5 rounded-md text-sm font-medium transition-all bg-white dark:bg-zinc-700 shadow-sm border border-zinc-200 dark:border-zinc-600 font-bold">Inventory</button>
            <button className="px-4 py-1.5 rounded-md text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">Manufacturing</button>
            <button className="px-4 py-1.5 rounded-md text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">Distribution</button>
            <button className="px-4 py-1.5 rounded-md text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">Analytics</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">search</span>
            <input
              className="pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary"
              placeholder="Search SKU or Product..."
              type="text"
            />
          </div>
          <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 relative">
            <span className="material-icons text-zinc-600 dark:text-zinc-400">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden border-2 border-primary/20">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User Profile" />
          </div>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-8 hidden xl:flex overflow-y-auto">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-3 w-full p-2 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">qr_code_2</span>
                Bulk Tagging
              </button>
              <button className="flex items-center gap-3 w-full p-2 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">sync_alt</span>
                Batch Transfer
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Lifecycle Stage</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Manufacturing</span>
                <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono">
                  {products.filter(p => p.status?.toLowerCase() === 'manufacturing').length.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">In Transit</span>
                <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono">
                  {products.filter(p => p.status?.toLowerCase() === 'in transit').length.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Active</span>
                <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono">
                  {products.filter(p => p.status?.toLowerCase() === 'active' || p.status?.toLowerCase() === 'registered').length.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-500 font-bold">End of Life</span>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-mono">
                  {products.filter(p => p.status?.toLowerCase() === 'end of life').length.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </section>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Product Catalog</h1>
              <p className="text-zinc-500 text-sm font-bold">Unified management of products, lifecycle tracking, and QR tagging.</p>
            </div>
            <div className="flex gap-2">
              <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg mr-2">
                <button className="p-1.5 bg-white dark:bg-zinc-700 rounded-md shadow-sm">
                  <span className="material-icons text-lg">grid_view</span>
                </button>
                <button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                  <span className="material-icons text-lg">format_list_bulleted</span>
                </button>
              </div>
              <Link to="/add-product" className="bg-primary hover:bg-primary/90 text-zinc-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md">
                <span className="material-icons text-sm font-bold">add</span>
                Register Product
              </Link>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <span className="material-icons text-6xl text-zinc-300 mb-4">inventory_2</span>
              <p className="text-zinc-500 font-bold">No products registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => setSelectedProduct(product)}
                  className={`bg-white dark:bg-zinc-900 border-2 rounded-xl overflow-hidden group transition-all shadow-sm cursor-pointer ${selectedProduct?._id === product._id ? 'border-primary' : 'border-zinc-200 dark:border-zinc-800 hover:border-primary/50'
                    }`}
                >
                  <div className="relative h-40 overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    {/* Placeholder for product image if not available */}
                    <span className="material-symbols-outlined text-6xl text-zinc-300">
                      {product.brand?.toLowerCase().includes('phone') ? 'smartphone' :
                        product.brand?.toLowerCase().includes('laptop') ? 'laptop_mac' :
                          product.brand?.toLowerCase().includes('watch') ? 'watch' : 'inventory_2'}
                    </span>
                    <div className="absolute top-2 left-2">
                      <span className={`${getStatusColor(product.status)} text-zinc-900 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1`}>
                        <span className="w-1 h-1 rounded-full bg-white"></span> {product.status || 'Active'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm">{product.brand} {product.model}</h3>
                    <p className="text-[10px] text-zinc-500 font-mono">SN: {product.serialNumber}</p>
                    <div className="mt-3 w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-500" style={{ width: getProgressWidth(product) }}></div>
                    </div>
                    <div className="mt-1 flex justify-between text-[9px] font-bold text-zinc-400 uppercase">
                      <span>Progress</span>
                      <span>{getProgressWidth(product)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 py-2 flex items-center justify-between text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
        <div className="flex gap-6">
          <span className="flex items-center gap-2 font-bold"><span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_#13ec5b]"></span> Network: Stable</span>
          <span className="flex items-center gap-2 font-bold"><span className="material-icons text-[12px]">security</span> Encryption: AES-256</span>
        </div>
        <div className="font-bold italic">
          EcoCycle Systems • Secure Tagging Module v2.4.0
        </div>
      </footer>
    </div>
  );
};

export default MyProducts;