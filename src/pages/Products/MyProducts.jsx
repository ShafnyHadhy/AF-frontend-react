import { useEffect, useState } from "react";
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
      toast.error("Please enter a valid numeric price!", {
        style: { background: '#ef4444', color: '#fff' }
      });
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "in transit":
        return "bg-orange-500";
      case "retail ready":
      case "registered":
      case "active":
      case "distributed":
        return "bg-primary text-zinc-900";
      case "manufacturing":
        return "bg-blue-500 text-white";
      case "repair request":
        return "bg-amber-500 text-white";
      case "not repairable":
        return "bg-zinc-700 text-white";
      case "recycling request":
        return "bg-emerald-500 text-white";
      case "recycled":
        return "bg-green-700 text-white";
      case "sold":
        return "bg-purple-600 text-white";
      case "end of life":
      case "legacy":
        return "bg-red-500 text-white";
      default:
        return "bg-zinc-500 text-white";
    }
  };

  const getProgressWidth = (product) => {
    if (!product.lifecycle || product.lifecycle.length === 0) return "0%";
    const stages = ["registered", "manufacturing", "in transit", "distributed", "active", "repair request", "recycled", "sold"];
    const currentStage = product.status?.toLowerCase();

    if (currentStage === "recycled" || currentStage === "sold") return "100%";
    if (currentStage === "not repairable") return "85%";

    const index = stages.indexOf(currentStage);
    if (index === -1) return "50%"; // default for unknown
    return `${Math.min(100, ((index + 1) / 5) * 100)}%`; // Use 5 as base for 'active' phase
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
            {["All", "Manufacturing", "In Transit", "Active", "End of Life", "Listed for Sale", "Analytics"].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  if (filter === "Analytics") {
                    window.location.href = "/analytics";
                  } else {
                    setActiveFilter(filter);
                  }
                }}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeFilter === filter
                  ? "bg-white dark:bg-zinc-700 shadow-sm border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">search</span>
            <input
              className="pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary shadow-inner"
              placeholder="Search Product Name, Model, Category..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Sustainability</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => toast.success("Scanning for nearby certified recyclers...")}
                className="flex items-center gap-3 w-full p-2 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">recycling</span>
                Find Recycler
              </button>
              <Link
                to="/analytics"
                className="flex items-center gap-3 w-full p-2 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">eco</span>
                Impact Report
              </Link>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Lifecycle Stage</h3>
            <div className="space-y-1">
              {[
                { label: "Manufacturing", color: "text-blue-500", key: "Manufacturing" },
                { label: "In Transit", color: "text-orange-500", key: "In Transit" },
                { label: "Active", color: "text-primary", key: "Active" },
                { label: "End of Life", color: "text-red-500", key: "End of Life" },
                { label: "Listed for Sale", color: "text-orange-400", key: "Listed for Sale" }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveFilter(item.key)}
                  className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors ${activeFilter === item.key ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                >
                  <span className={`text-sm font-bold ${item.color}`}>{item.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-mono ${activeFilter === item.key ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                    {item.key === "Listed for Sale"
                      ? products.filter(p => p.isForSale).length.toString().padStart(2, '0')
                      : item.key === "Active"
                        ? products.filter(p => p.status?.toLowerCase() === 'active' || p.status?.toLowerCase() === 'registered').length.toString().padStart(2, '0')
                        : products.filter(p => p.status?.toLowerCase() === item.label.toLowerCase()).length.toString().padStart(2, '0')
                    }
                  </span>
                </button>
              ))}
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
              <Link to="/add-product" className="bg-primary hover:bg-primary/90 text-zinc-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md">
                <span className="material-icons text-sm font-bold">add</span>
                Register Product
              </Link>
            </div>
          </div>

          {products.filter(product => {
            const matchesCategory = activeFilter === "All" ||
              (activeFilter === "Listed for Sale" ? product.isForSale :
                activeFilter === "Active" ? (product.status?.toLowerCase() === 'active' || product.status?.toLowerCase() === 'registered') :
                  product.status?.toLowerCase() === activeFilter.toLowerCase());

            const matchesSearch = product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.category?.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesSearch;
          }).length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <span className="material-icons text-6xl text-zinc-300 mb-4">{searchQuery ? 'search_off' : 'inventory_2'}</span>
              <p className="text-zinc-500 font-bold">{searchQuery ? `No matches for "${searchQuery}"` : "No products found for this category."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {products
                .filter(product => {
                  const matchesCategory = activeFilter === "All" ||
                    (activeFilter === "Listed for Sale" ? product.isForSale :
                      activeFilter === "Active" ? (product.status?.toLowerCase() === 'active' || product.status?.toLowerCase() === 'registered') :
                        product.status?.toLowerCase() === activeFilter.toLowerCase());

                  const matchesSearch = product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.category?.toLowerCase().includes(searchQuery.toLowerCase());

                  return matchesCategory && matchesSearch;
                })
                .map((product) => (
                  <div
                    key={product._id}
                    onClick={() => setSelectedProduct(product)}
                    className={`bg-white dark:bg-zinc-900 border-2 rounded-xl overflow-hidden group transition-all shadow-sm cursor-pointer ${selectedProduct?._id === product._id ? 'border-primary' : 'border-zinc-200 dark:border-zinc-800 hover:border-primary/50'
                      }`}
                  >
                    <div className="relative h-40 overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <span className="material-symbols-outlined text-6xl text-zinc-300">
                          {product.category?.toLowerCase().includes('electronics') ? 'smartphone' :
                            product.category?.toLowerCase().includes('appliances') ? 'kitchen' :
                              product.category?.toLowerCase().includes('furniture') ? 'chair' : 'inventory_2'}
                        </span>
                      )}
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className={`${getStatusColor(product.status)} text-zinc-900 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1`}>
                          <span className="w-1 h-1 rounded-full bg-white"></span> {product.status || 'Active'}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/edit-product/${product.productID}`}
                          className="p-1.5 bg-white/90 dark:bg-zinc-800/90 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="material-icons text-sm">edit</span>
                        </Link>
                        <DeleteProduct
                          productID={product.productID}
                          onDeleteSuccess={(id) => {
                            setProducts(products.filter(p => p.productID !== id));
                            if (selectedProduct?.productID === id) {
                              setSelectedProduct(null);
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSell(product.productID, product.isForSale);
                          }}
                          className={`p-1.5 bg-white/90 dark:bg-zinc-800/90 rounded-lg transition-colors shadow-sm ${product.isForSale ? 'text-orange-500 hover:text-zinc-600' : 'text-zinc-600 dark:text-zinc-400 hover:text-primary'}`}
                          title={product.isForSale ? "Unlist from Marketplace" : "List for Sale"}
                        >
                          <span className="material-icons text-sm">{product.isForSale ? 'money_off' : 'sell'}</span>
                        </button>
                        <Link
                          to={`/qr-screen/${product.productID}`}
                          className="p-1.5 bg-white/90 dark:bg-zinc-800/90 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors shadow-sm"
                          title="View QR Code"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="material-symbols-outlined text-sm">qr_code_2</span>
                        </Link>
                        <Link
                          to={`/product-public/${product.productID}`}
                          target="_blank"
                          className="p-1.5 bg-white/90 dark:bg-zinc-800/90 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors shadow-sm"
                          title="View Public Timeline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="material-icons text-sm">history</span>
                        </Link>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <h3 className="font-bold text-sm">{product.productName} {product.model}</h3>
                        <p className="text-[10px] text-zinc-500 font-mono">Category: {product.category}</p>
                      </div>

                      <div className="mt-3">
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full transition-all duration-500" style={{ width: getProgressWidth(product) }}></div>
                        </div>
                        <div className="mt-1 flex justify-between text-[9px] font-bold text-zinc-400 uppercase">
                          <span>Progress</span>
                          <span>{getProgressWidth(product)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {product.status?.toLowerCase() === "repair request" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleResolveRepair(product.productID, "repaired"); }}
                              className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-zinc-900 transition-colors border border-primary/20"
                            >
                              <span className="material-icons text-xl">done_all</span>
                              <span className="text-[10px] font-bold mt-1 uppercase">Mark Repaired</span>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleResolveRepair(product.productID, "not repairable"); }}
                              className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20"
                            >
                              <span className="material-icons text-xl">block</span>
                              <span className="text-[10px] font-bold mt-1 uppercase">Not Repairable</span>
                            </button>
                          </div>
                        ) : product.status?.toLowerCase() === "recycling request" ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCompleteRecycling(product.productID); }}
                            className="w-full flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-500/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-500/20"
                          >
                            <span className="material-icons text-xl">check_circle</span>
                            <span className="text-[10px] font-bold mt-1 uppercase">Complete Recycling</span>
                          </button>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            <Link
                              to={`/my-products`}
                              onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                              className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-primary hover:bg-primary hover:text-zinc-900 transition-colors"
                            >
                              <span className="material-icons text-xl">info</span>
                              <span className="text-[10px] font-bold mt-1 uppercase">Details</span>
                            </Link>

                            {/* REPAIR BUTTON: Hidden if already not repairable or recycled/sold */}
                            {!["not repairable", "recycled", "sold"].includes(product.status?.toLowerCase()) ? (
                              <Link
                                to={`/request-repair/${product.productID}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors"
                              >
                                <span className="material-icons text-xl">build</span>
                                <span className="text-[10px] font-bold mt-1 uppercase">Repair</span>
                              </Link>
                            ) : (
                              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 opacity-50 cursor-not-allowed">
                                <span className="material-icons text-xl">build</span>
                                <span className="text-[10px] font-bold mt-1 uppercase">Repair</span>
                              </div>
                            )}

                            {/* RECYCLE BUTTON: Hidden if already recycled/sold */}
                            {!["recycled", "sold"].includes(product.status?.toLowerCase()) ? (
                              <Link
                                to={`/request-recycling/${product.productID}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                              >
                                <span className="material-icons text-xl">recycling</span>
                                <span className="text-[10px] font-bold mt-1 uppercase">Recycle</span>
                              </Link>
                            ) : (
                              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 opacity-50 cursor-not-allowed">
                                <span className="material-icons text-xl">recycling</span>
                                <span className="text-[10px] font-bold mt-1 uppercase">Recycle</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* Details Side Panel (Drawer) */}
        {selectedProduct && (
          <aside className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white dark:bg-zinc-900 shadow-2xl z-[60] border-l border-zinc-200 dark:border-zinc-800 flex flex-col animate-in slide-in-from-right duration-300">
            <header className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Product Details</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <span className="material-icons">close</span>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Product Visuals */}
              <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-inner border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                {selectedProduct.images?.[0] ? (
                  <img src={selectedProduct.images[0]} alt={selectedProduct.model} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-7xl text-zinc-300">inventory_2</span>
                )}
              </div>

              {/* Core Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold">{selectedProduct.productName}</h3>
                  <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">{selectedProduct.model} • {selectedProduct.category}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className={`${getStatusColor(selectedProduct.status)} font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-sm`}>
                    {selectedProduct.status}
                  </span>
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border border-zinc-200 dark:border-zinc-700">
                    {selectedProduct.condition} Condition
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Product ID</p>
                  <p className="font-mono text-xs font-bold truncate">{selectedProduct.productID}</p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Purchase Price</p>
                  <p className="font-bold">${selectedProduct.purchasePrice || '0.00'}</p>
                </div>
              </div>

              {/* QR Code Section */}
              {selectedProduct.qrCode && (
                <div className="p-6 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-4">
                  <div className="w-40 h-40 bg-white p-3 rounded-xl shadow-lg border-2 border-primary">
                    <img src={selectedProduct.qrCode} alt="QR Code" className="w-full h-full" />
                  </div>
                  <p className="text-[10px] text-zinc-400 font-black uppercase text-center leading-tight">
                    Digital Passport QR Code<br />
                    <span className="text-primary">Verified on Ledger</span>
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div className="space-y-6 pt-4">
                <h4 className="font-bold flex items-center gap-2">
                  <span className="material-icons text-primary text-lg">history</span>
                  Lifecycle History
                </h4>
                <div className="relative pl-6 border-l-2 border-zinc-100 dark:border-zinc-800 space-y-8 pb-4">
                  {selectedProduct.lifecycle?.slice().reverse().map((event, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(19,236,91,0.6)]"></div>
                      <div className="flex flex-col gap-0.5">
                        <p className="font-bold text-sm capitalize">{event.eventType}</p>
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">{event.description}</p>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <footer className="p-6 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-4">
              <Link
                to={`/edit-product/${selectedProduct.productID}`}
                className="flex items-center justify-center gap-2 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl font-bold text-sm transition-colors"
              >
                <span className="material-icons text-sm">edit</span>
                Edit Info
              </Link>
              <button
                onClick={() => setSelectedProduct(null)}
                className="py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-sm transition-all"
              >
                Close Panel
              </button>
            </footer>
          </aside>
        )}

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

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-icons text-primary text-3xl">sell</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">List for Sale</h2>
              <p className="text-zinc-500 text-sm font-bold mb-8">Set your desired price to list this product on the marketplace.</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Selling Price ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                    <input
                      autoFocus
                      type="text"
                      placeholder="0.00"
                      value={sellPrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^[0-9.]*$/.test(val)) {
                          setSellPrice(val);
                        }
                      }}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 pl-8 focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-xl"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase italic">
                    Only numeric values are accepted.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-10">
                <button
                  onClick={() => setShowSellModal(false)}
                  className="p-4 rounded-2xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSellSubmit}
                  className="p-4 rounded-2xl font-bold bg-primary text-zinc-900 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Confirm Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;