import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import DeleteProduct from "./DeleteProduct";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellPrice, setSellPrice] = useState("");
  const [sellingProductId, setSellingProductId] = useState(null);

  const token = localStorage.getItem("token");

  // --- API HANDLERS ---
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
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const handleToggleSell = async (productID, isCurrentlySelling) => {
    if (!isCurrentlySelling) {
      setSellingProductId(productID);
      setSellPrice("");
      setShowSellModal(true);
      return;
    }

    // Unlisting
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/products/${productID}/sell`,
        { isForSale: false, price: 0 },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success("Unlisted from marketplace");
      setProducts(products.map(p => p.productID === productID ? { ...p, isForSale: false, price: 0 } : p));
    } catch (error) {
      console.error(error);
      toast.error("Failed to unlist product");
    }
  };

  const handleResolveRepair = async (productID, resolution) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/products/${productID}/resolve-repair`,
        { resolution },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Repair resolved as ${resolution}`);
      setProducts(products.map(p => p.productID === productID ? res.data.product : p));
    } catch (error) {
      console.error(error);
      toast.error("Failed to resolve repair");
    }
  };

  const handleCompleteRecycling = async (productID) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/products/${productID}/complete-recycling`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Recycling completed!");
      setProducts(products.map(p => p.productID === productID ? res.data.product : p));
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete recycling");
    }
  };

  const handleSellSubmit = async () => {
    const price = parseFloat(sellPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid numeric price!");
      return;
    }

    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/products/${sellingProductId}/sell`,
        { isForSale: true, price },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success("Listed for sale!");
      setProducts(products.map(p => p.productID === sellingProductId ? { ...p, isForSale: true, price } : p));
      setShowSellModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to list product");
    }
  };

  // --- RENDER HELPERS ---
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "in transit":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "active":
      case "registered":
      case "distributed":
        return "bg-green-100 text-green-700 border-green-200";
      case "repair request":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "recycling request":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "end of life":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getProgressWidth = (product) => {
    if (!product.lifecycle || product.lifecycle.length === 0) return "0%";
    const stages = ["registered", "manufacturing", "in transit", "distributed", "active", "repair request", "recycled", "sold"];
    const currentStage = product.status?.toLowerCase();
    if (currentStage === "recycled" || currentStage === "sold") return "100%";
    const index = stages.indexOf(currentStage);
    if (index === -1) return "50%";
    return `${Math.min(100, ((index + 1) / 5) * 100)}%`;
  };

  // Helper to filter and search products (Memoized for performance to reduce load)
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const status = product.status?.toLowerCase() || "";
      const name = product.productName?.toLowerCase() || "";
      const brand = product.Brand?.toLowerCase() || "";
      const model = product.model?.toLowerCase() || "";
      const id = product.productID?.toLowerCase() || "";
      const search = searchQuery.toLowerCase();

      const matchesCategory = activeFilter === "All" ||
        (activeFilter === "Listed for Sale" ? product.isForSale :
          activeFilter === "Active" ? (status === 'active' || status === 'registered') :
            status === activeFilter.toLowerCase());

      const matchesSearch = name.includes(search) ||
        brand.includes(search) ||
        model.includes(search) ||
        id.includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeFilter, searchQuery]);

  // --- MAIN RENDER ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-[3px] border-green-300 shadow-sm shadow-green-100/50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 lg:pl-[4.125rem]">
            <span className="material-icons text-green-600 text-3xl">recycling</span>
            <h1 className="text-xl font-bold tracking-tight text-gray-800">EcoCycle <span className="text-green-600">Pro</span></h1>
          </Link>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-primary focus:border-primary text-sm"
                placeholder="Search products or serial numbers..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-primary transition-colors relative">
              <span className="material-icons">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-gray-900">John Doe</p>
                <p className="text-[10px] text-gray-500">Eco Manager</p>
              </div>
              <img alt="User" className="w-10 h-10 rounded-full border border-gray-200 shadow-sm" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 items-start h-[calc(100vh-4rem)] bg-gray-50">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 hidden lg:block space-y-8 sticky top-0 self-start h-full overflow-y-auto bg-slate-50 border-[3px] border-green-300 rounded-2xl p-6 shadow-md shadow-green-100/50 custom-scrollbar">
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Sustainability</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-primary text-zinc-900 rounded-lg font-bold hover:bg-secondary transition-all shadow-md shadow-green-100/50 border-[3px] border-green-300">
                <span className="material-icons text-sm">location_on</span>
                Find Recycler
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Lifecycle Stage</h3>
            <ul className="space-y-1">
              {[
                { label: "All Products", id: "All", icon: "inventory_2" },
                { label: "Active Use", id: "Active", icon: "verified" },
                { label: "In Transit", id: "In Transit", icon: "local_shipping" },
                { label: "End of Life", id: "End of Life", icon: "history_edu" },
                { label: "Marketplace", id: "Listed for Sale", icon: "sell" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveFilter(item.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md transition-all ${activeFilter === item.id ? 'bg-green-100 text-green-800 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-icons text-sm">{item.icon}</span>
                      {item.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${activeFilter === item.id ? 'bg-white border-green-200 shadow-sm' : 'text-gray-400 border-transparent'}`}>
                      {item.id === "All" ? products.length :
                        item.id === "Listed for Sale" ? products.filter(p => p.isForSale).length :
                          item.id === "Active" ? products.filter(p => p.status?.toLowerCase() === 'active' || p.status?.toLowerCase() === 'registered').length :
                            products.filter(p => p.status?.toLowerCase() === item.id.toLowerCase()).length
                      }
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* Main Content */}
        <section className="flex-1 h-full overflow-y-auto bg-white border-[3px] border-green-300 rounded-2xl p-8 shadow-md shadow-green-100/50 custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
              <p className="text-sm text-gray-500">Manage and track your sustainable assets</p>
            </div>
            <div className="flex gap-3">
              <Link to="/add-product" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-all shadow-md shadow-green-100/50 border-[3px] border-green-300">
                <span className="material-icons text-sm">add</span>
                Register
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <article key={product._id} className="bg-white rounded-xl border-[3px] border-green-300 overflow-hidden shadow-md shadow-green-100/50 hover:shadow-lg hover:shadow-green-200/50 transition-all group relative">
                <div className="relative aspect-video overflow-hidden bg-gray-100 flex items-center justify-center">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.model} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="material-icons text-4xl text-gray-300">inventory_2</span>
                  )}
                  <span className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${getStatusColor(product.status)}`}>
                    {product.status || 'Active'}
                  </span>

                  {/* Floating Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/edit-product/${product.productID}`} className="p-2 bg-white/90 rounded-full shadow-sm hover:text-green-600 transition-colors">
                      <span className="material-icons text-sm">edit</span>
                    </Link>
                    <DeleteProduct productID={product.productID} onDeleteSuccess={(id) => setProducts(products.filter(p => p.productID !== id))} />
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">{product.productName}</h4>
                    <span className="text-xs font-bold text-gray-900 whitespace-nowrap ml-2">Rs. {product.price || 0}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-4">{product.Brand || "Unknown Brand"} • {product.model || "Unknown Model"} • SN: {(product.productID || "N/A").slice(-8).toUpperCase()}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] font-medium text-gray-500 mb-1">
                      <span>Lifecycle Progress</span>
                      <span>{getProgressWidth(product)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-500" style={{ width: getProgressWidth(product) }}></div>
                    </div>
                  </div>

                  {product.status?.toLowerCase() === "repair request" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleResolveRepair(product.productID, "repaired")} className="py-2 px-1 text-[11px] font-bold text-green-700 bg-green-50 border-[3px] border-green-300 rounded hover:bg-green-100 flex items-center justify-center gap-1 shadow-sm shadow-green-100/50">
                        <span className="material-icons text-sm">done</span> Fixed
                      </button>
                      <button onClick={() => handleResolveRepair(product.productID, "not repairable")} className="py-2 px-1 text-[11px] font-bold text-red-600 bg-red-50 border-2 border-red-200 rounded hover:bg-red-100 flex items-center justify-center gap-1 shadow-sm shadow-red-100/50">
                        <span className="material-icons text-sm">block</span> Junk
                      </button>
                    </div>
                  ) : product.status?.toLowerCase() === "recycling request" ? (
                    <button onClick={() => handleCompleteRecycling(product.productID)} className="w-full py-2 px-3 text-[11px] font-bold text-white bg-emerald-600 border-2 border-emerald-400 rounded hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm shadow-emerald-200/50">
                      <span className="material-icons text-sm">check_circle</span> Complete Recycling
                    </button>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => setSelectedProduct(product)} className="py-2 px-1 text-[11px] font-bold text-gray-700 bg-gray-100 border-[3px] border-green-300 rounded hover:bg-gray-200 flex flex-col items-center gap-1 shadow-sm shadow-green-100/50">
                        <span className="material-icons text-sm">info</span> Details
                      </button>
                      <Link to={`/request-repair/${product.productID}`} className="py-2 px-1 text-[11px] font-bold text-gray-700 bg-gray-100 border-[3px] border-green-300 rounded hover:bg-gray-200 flex flex-col items-center gap-1 shadow-sm shadow-green-100/50">
                        <span className="material-icons text-sm">build</span> Repair
                      </Link>
                      <Link to={`/request-recycling/${product.productID}`} className="py-2 px-1 text-[11px] font-bold text-gray-700 bg-gray-100 border-[3px] border-green-300 rounded hover:bg-gray-200 flex flex-col items-center gap-1 shadow-sm shadow-green-100/50">
                        <span className="material-icons text-sm">recycling</span> Recycle
                      </Link>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <button onClick={() => handleToggleSell(product.productID, product.isForSale)} className={`text-sm font-bold flex items-center gap-1.5 ${product.isForSale ? 'text-orange-500' : 'text-gray-600 hover:text-green-600 transition-colors'}`}>
                      <span className="material-icons text-xl">{product.isForSale ? 'money_off' : 'sell'}</span>
                      {product.isForSale ? 'Listed' : 'Sell'}
                    </button>
                    <Link to={`/qr-screen/${product.productID}`} className="text-gray-600 hover:text-green-600 transition-colors">
                      <span className="material-icons text-2xl">qr_code_2</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}

            <Link to="/add-product" className="bg-gray-50 rounded-xl border-[3px] border-dashed border-green-400 flex flex-col items-center justify-center p-6 text-center hover:bg-green-50 hover:shadow-md hover:shadow-green-100/50 hover:border-green-400 transition-all min-h-[300px]">
              <span className="material-icons text-4xl text-gray-300 mb-2">add_circle_outline</span>
              <p className="text-sm font-medium text-gray-500 mb-4">Register a new product to start tracking its lifecycle.</p>
              <button className="px-4 py-2 bg-white border-[3px] border-green-300 rounded-md text-sm font-bold text-gray-700 shadow-sm shadow-green-100/50 hover:bg-green-50 transition-colors">Add Product</button>
            </Link>
          </div>
        </section>
      </main>

      {/* Product Detail Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-[0_0_40px_rgba(34,197,94,0.15)] transform transition-transform duration-300 ease-in-out z-[60] overflow-y-auto ${selectedProduct ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedProduct && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Product Details</h3>
              <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="aspect-video bg-gray-100 rounded-xl mb-6 overflow-hidden flex items-center justify-center">
              {selectedProduct.images?.[0] ? (
                <img src={selectedProduct.images[0]} alt="Detail View" loading="lazy" className="w-full h-full object-cover" />
              ) : (
                <span className="material-icons text-6xl text-gray-300">inventory_2</span>
              )}
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-bold text-gray-900">{selectedProduct.productName}</h4>
                <span className="font-bold text-primary">Rs. {selectedProduct.price || 0}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{selectedProduct.description || "No description available."}</p>

              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
                <div className="w-16 h-16 bg-white p-1 border-[3px] border-green-300 rounded shadow-sm shadow-green-100/50">
                  {selectedProduct.qrCode ? (
                    <img src={selectedProduct.qrCode} alt="Passport QR" className="w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><span className="material-icons text-gray-300">qr_code</span></div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Serial Passport</p>
                  <p className="text-sm font-mono font-bold truncate max-w-[200px]">{(selectedProduct.productID || "N/A").toUpperCase()}</p>
                  <p className="text-xs text-green-600 font-medium">Verified by EcoCycle v2.4</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Lifecycle History</h4>
              <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {selectedProduct.lifecycle?.slice().reverse().map((event, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-[3px] border-primary shadow-sm flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <p className="text-xs font-bold text-gray-900 capitalize">{event.eventType}</p>
                    <p className="text-[10px] text-gray-500 mb-1">
                      {new Date(event.date).toLocaleDateString()} • {event.location || "System"}
                    </p>
                    <p className="text-xs text-gray-600 italic">"{event.description}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
              <button onClick={() => { handleToggleSell(selectedProduct.productID, selectedProduct.isForSale); setSelectedProduct(null); }} className="flex-1 py-3 bg-white border-[3px] border-green-300 text-gray-700 font-bold rounded-lg hover:bg-green-50 transition-colors shadow-sm shadow-green-100/50">
                {selectedProduct.isForSale ? 'Unlist' : 'List for Sale'}
              </button>
              <Link to={`/edit-product/${selectedProduct.productID}`} className="flex-1 py-3 bg-primary text-zinc-900 font-bold text-center rounded-lg border-[3px] border-green-300 hover:bg-secondary transition-colors shadow-sm shadow-green-100/50">
                Edit Product
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for drawer */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-300" onClick={() => setSelectedProduct(null)}></div>
      )}

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[70] animate-in fade-in duration-300 p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSellModal(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-[0_0_40px_rgba(34,197,94,0.2)] animate-in zoom-in-95 duration-300">
            <h3 className="text-xl font-bold mb-2">List for Resale</h3>
            <p className="text-sm text-gray-500 mb-6">List your product on the EcoCycle marketplace. Higher lifecycle efficiency increases resale value.</p>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Set Your Price (Rs.)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                  <input
                    autoFocus
                    className="w-full pl-8 pr-4 py-3 bg-green-50/30 border-[3px] border-green-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-lg font-bold outline-none transition-all shadow-inner"
                    placeholder="0.00"
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                  />
                </div>
                <p className="text-[10px] text-green-600 mt-2 font-medium">Verified listing ensures faster sales and trust.</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="material-icons text-blue-500 text-sm">info</span>
                <p className="text-[10px] text-blue-700 leading-tight">A small sustainability fee may apply to fund local recycling projects.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 font-bold text-gray-500 hover:bg-green-50 rounded-xl transition-colors border-[3px] border-green-300 shadow-sm shadow-green-100/50" onClick={() => setShowSellModal(false)}>Cancel</button>
              <button className="flex-1 py-3 font-bold text-zinc-900 bg-primary rounded-xl hover:bg-secondary transition-all shadow-md shadow-green-100/50 border-[3px] border-green-300" onClick={handleSellSubmit}>Confirm Listing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
