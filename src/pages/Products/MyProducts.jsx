import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DeleteProduct from "./DeleteProduct";
import RepairRecycleForm from "../../components/RepairRecycleForm";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// ── Lifecycle event config ──────────────────────────────────────────────────
const LIFECYCLE_EVENTS = [
  { value: "registered",          label: "📝 Registered",             color: "bg-gray-100 text-gray-700 border-gray-300",     icon: "inventory_2" },
  { value: "repair request",      label: "🔧 Repair Requested",       color: "bg-amber-100 text-amber-700 border-amber-300",   icon: "build" },
  { value: "repaired",            label: "✅ Repaired",               color: "bg-green-100 text-green-700 border-green-300",   icon: "check_circle" },
  { value: "recycling request",   label: "♻️ Recycling Requested",    color: "bg-teal-100 text-teal-700 border-teal-300",     icon: "recycling" },
  { value: "recycled",            label: "🌿 Recycled",               color: "bg-emerald-100 text-emerald-700 border-emerald-300", icon: "eco" },
  { value: "listed on marketplace", label: "🏪 Listed for Sale",      color: "bg-blue-100 text-blue-700 border-blue-300",     icon: "storefront" },
  { value: "marketplace listing", label: "🏪 Listed for Sale",        color: "bg-blue-100 text-blue-700 border-blue-300",     icon: "storefront" },
  { value: "active",              label: "▶️ Back to Active Use",     color: "bg-sky-100 text-sky-700 border-sky-300",        icon: "play_circle" },
  { value: "damaged",             label: "⚠️ Damaged",                color: "bg-red-100 text-red-700 border-red-300",        icon: "warning" },
  { value: "in transit",          label: "🚚 In Transit",             color: "bg-purple-100 text-purple-700 border-purple-300", icon: "local_shipping" },
];

const getEventConfig = (eventType) => {
  const et = (eventType || "").toLowerCase();
  return LIFECYCLE_EVENTS.find(e => e.value === et) || {
    color: "bg-gray-100 text-gray-700 border-gray-300",
    icon: "history",
  };
};

// ── DrawerContent component ─────────────────────────────────────────────────
const DrawerContent = ({ product, token, onClose, onUpdate, handleToggleSell }) => {
  const [addingEvent, setAddingEvent] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [newEventType, setNewEventType] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLocation, setNewLocation] = useState("");

  const handleAddEvent = async () => {
    if (!newEventType) { toast.error("Please select an activity type"); return; }
    setSavingEvent(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/${product.productID}/lifecycle`,
        {
          eventType: newEventType,
          description: newDescription || `Product marked as: ${newEventType}`,
          location: newLocation,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Lifecycle activity recorded!");
      onUpdate(res.data.product);
      setAddingEvent(false);
      setNewEventType("");
      setNewDescription("");
      setNewLocation("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to record activity");
    } finally {
      setSavingEvent(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Product Details</h3>
          <p className="text-xs text-gray-400">Lifecycle & Activity Tracker</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <span className="material-icons">close</span>
        </button>
      </div>

      {/* Product Image */}
      <div className="aspect-video bg-gray-100 rounded-xl mb-5 overflow-hidden flex items-center justify-center">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt="Detail View" loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <span className="material-icons text-6xl text-gray-300">inventory_2</span>
        )}
      </div>

      {/* Info */}
      <div className="mb-5">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-lg font-bold text-gray-900">{product.productName}</h4>
          <span className="font-bold text-primary">Rs. {product.price || 0}</span>
        </div>
        <p className="text-xs text-gray-500 mb-1">{product.Brand} • {product.model}</p>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{product.description || "No description available."}</p>

        {/* Status badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold text-gray-400 uppercase">Current Status:</span>
          <span className={`px-2 py-0.5 text-[11px] font-bold rounded border capitalize ${getEventConfig(product.status).color}`}>
            {product.status || "registered"}
          </span>
        </div>

        {/* QR passport */}
        <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-4 border border-green-100">
          <div className="w-14 h-14 bg-white p-1 border border-green-300 rounded shadow-sm">
            {product.qrCode ? (
              <img src={product.qrCode} alt="Passport QR" className="w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><span className="material-icons text-gray-300 text-sm">qr_code</span></div>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Serial Passport</p>
            <p className="text-xs font-mono font-bold truncate max-w-[200px]">{(product.productID || "N/A").toUpperCase()}</p>
            <p className="text-[10px] text-green-600 font-medium">Verified by EcoCycle v2.4</p>
          </div>
        </div>
      </div>

      {/* ── Add Lifecycle Activity ─────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Track Activity</h4>
          {!addingEvent && (
            <button
              onClick={() => setAddingEvent(true)}
              className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-300 px-3 py-1 rounded-full hover:bg-green-100 transition-all"
            >
              <span className="material-icons text-sm">add</span> Add Event
            </button>
          )}
        </div>

        {addingEvent && (
          <div className="bg-green-50/50 border border-green-200 rounded-xl p-4 space-y-3 animate-in slide-in-from-top duration-200">
            <p className="text-xs font-bold text-green-800 mb-1">New Lifecycle Activity</p>

            {/* Event type dropdown */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Activity Type *</label>
              <select
                value={newEventType}
                onChange={e => setNewEventType(e.target.value)}
                className="w-full border border-green-300 rounded-lg px-3 py-2 text-sm font-semibold bg-white focus:ring-2 focus:ring-green-300 outline-none"
              >
                <option value="">— Select activity —</option>
                {LIFECYCLE_EVENTS.map(ev => (
                  <option key={ev.value} value={ev.value}>{ev.label}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Notes (optional)</label>
              <textarea
                rows={2}
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="e.g. Screen cracked, sent to service center..."
                className="w-full border border-green-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-300 outline-none resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Location (optional)</label>
              <input
                type="text"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                placeholder="e.g. Colombo Repair Hub"
                className="w-full border border-green-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-300 outline-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setAddingEvent(false); setNewEventType(""); setNewDescription(""); setNewLocation(""); }}
                className="flex-1 py-2 text-sm font-bold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                disabled={savingEvent}
                className="flex-1 py-2 text-sm font-bold text-white bg-[#166534] rounded-lg hover:bg-green-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-1"
              >
                {savingEvent ? <span className="material-icons animate-spin text-sm">refresh</span> : <span className="material-icons text-sm">save</span>}
                {savingEvent ? "Saving..." : "Save Activity"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Lifecycle Timeline ──────────────────────────────────────────── */}
      <div className="mb-24">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Lifecycle History ({product.lifecycle?.length || 0} events)</h4>

        {(!product.lifecycle || product.lifecycle.length === 0) ? (
          <div className="text-center py-8 text-gray-400">
            <span className="material-icons text-3xl mb-2">timeline</span>
            <p className="text-xs font-medium">No lifecycle events yet.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-green-200 via-green-100 to-transparent"></div>

            <div className="space-y-5">
              {product.lifecycle.slice().reverse().map((event, idx) => {
                const cfg = getEventConfig(event.eventType);
                return (
                  <div key={idx} className="relative flex gap-4 pl-1">
                    {/* Icon bubble */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm z-10 bg-white ${cfg.color}`}>
                      <span className="material-icons text-[16px]">{cfg.icon}</span>
                    </div>

                    {/* Content card */}
                    <div className="flex-1 bg-white border border-green-100 rounded-xl p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-900 capitalize">{event.eventType}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border uppercase ${cfg.color}`}>
                          {idx === 0 ? "Latest" : `#${product.lifecycle.length - idx}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 italic mb-1.5">"{event.description}"</p>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400">
                        <span className="flex items-center gap-0.5">
                          <span className="material-icons text-[11px]">calendar_today</span>
                          {new Date(event.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-0.5">
                            <span className="material-icons text-[11px]">location_on</span>
                            {event.location}
                          </span>
                        )}
                        {event.performedBy && (
                          <span className="flex items-center gap-0.5">
                            <span className="material-icons text-[11px]">person</span>
                            {event.performedBy}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white pb-2">
        <button
          onClick={() => { handleToggleSell(product.productID, product.isForSale); onClose(); }}
          className="flex-1 py-2.5 bg-white border border-green-300 text-gray-700 font-bold rounded-lg hover:bg-green-50 transition-colors shadow-sm text-sm"
        >
          {product.isForSale ? "Unlist from Market" : "List for Sale"}
        </button>
        <Link
          to={`/edit-product/${product.productID}`}
          className="flex-1 py-2.5 bg-[#166534] text-white font-bold text-center rounded-lg hover:bg-green-800 transition-colors shadow-sm text-sm"
        >
          Edit Product
        </Link>
      </div>
    </div>
  );
};



const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellPrice, setSellPrice] = useState("");
  const [sellingProductId, setSellingProductId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Read logged-in user from localStorage
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  })();
  const displayName = currentUser.name || currentUser.username || currentUser.email || "User";
  const userRole = currentUser.role ? (currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)) : "Eco Manager";

  const handleLogout = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-bold text-gray-900">Logout of ReVolve?</p>
          <p className="text-sm text-gray-500">You will be redirected to the login page.</p>
          <div className="flex gap-2">
            <button
              onClick={() => { toast.dismiss(t.id); }}
              className="flex-1 py-1.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("email");
                localStorage.removeItem("role");
                toast.success("Logged out successfully!");
                navigate("/login");
              }}
              className="flex-1 py-1.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, style: { padding: "16px", minWidth: "260px" } }
    );
  };

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
      case "under repair":
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
    const stages = ["registered", "manufacturing", "distributed", "active", "repair request", "under repair", "recycling request", "recycled", "sold"];
    const currentStage = product.status?.toLowerCase();
    if (currentStage === "recycled" || currentStage === "sold") return "100%";
    const index = stages.indexOf(currentStage);
    if (index === -1) return "50%";
    return `${Math.min(100, ((index + 1) / stages.length) * 100)}%`;
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

  // --- PDF GENERATOR ---
  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    // Add Company Logo Text (ReVolve)
    doc.setFontSize(22);
    doc.setTextColor(22, 101, 52); // Tailwind bg-[#166534]
    doc.text("ReVolve", 14, 20);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59); // zinc-800
    doc.text("Product Catalog Report", 14, 30);

    // Metadata: DateTime
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const now = new Date();
    doc.text(`Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 14, 38);
    doc.text(`Report Period: ${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`, 14, 43);

    // Table Data
    const tableColumn = ["Product ID", "Name", "Brand", "Condition", "Status", "Price (Rs.)"];
    const tableRows = [];

    filteredProducts.forEach(product => {
      const productData = [
        product.productID,
        product.productName,
        product.Brand,
        product.condition,
        product.status || "Unknown",
        product.price ? `Rs. ${product.price}` : "0"
      ];
      tableRows.push(productData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      theme: 'striped',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 101, 52] }
    });

    doc.save(`ReVolve_Products_${now.toISOString().split('T')[0]}.pdf`);
    toast.success("Catalog Report Downloaded!");
  };

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
      <header className="sticky top-0 z-50 bg-white border-b border-green-300 shadow-sm shadow-green-100/50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer lg:pl-[4.125rem]">
            <div className="w-9 h-9 rounded-xl bg-[#166534] flex items-center justify-center text-white shadow-lg shadow-green-900/20 group-hover:scale-105 transition-transform">
              <span className="material-icons text-[20px]">eco</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-['Manrope']">
              ReVolve
            </span>
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

          <nav className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-primary transition-colors relative">
              <span className="material-icons">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-gray-900">{displayName}</p>
                <p className="text-[10px] text-gray-500">{userRole}</p>
              </div>
              <Link to="/edit-profile" title="View Profile">
                <img
                  alt={displayName}
                  className="w-10 h-10 rounded-full border-2 border-green-300 shadow-sm hover:scale-105 hover:border-green-500 transition-all cursor-pointer"
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`}
                />
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all border border-transparent hover:border-red-200"
              >
                <span className="material-icons text-[20px]">logout</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 items-start h-[calc(100vh-4rem)] bg-gray-50">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 hidden lg:block space-y-8 sticky top-0 self-start h-full overflow-y-auto bg-slate-50 border border-green-300 rounded-2xl p-6 shadow-md shadow-green-100/50 custom-scrollbar">
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Sustainability</h3>
            <div className="space-y-2">
              <button
                onClick={() => setIsFormOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md text-xs font-bold hover:bg-gray-200 transition-all shadow-sm shadow-green-100/50 border border-green-300 z-40"
              >
                <span className="material-icons text-[14px]">home_repair_service</span>
                Repair / Recycle Request
              </button>
              <button
                onClick={() => navigate("/my-requests")}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-xs font-bold hover:bg-green-100 transition-all shadow-sm shadow-green-100/50 border border-green-300"
              >
                <span className="material-icons text-[14px]">assignment</span>
                View My Requests
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Lifecycle Stage</h3>
            <ul className="space-y-1">
              {[
                { label: "All Products", id: "All", icon: "inventory_2" },
                { label: "Active Use", id: "Active", icon: "verified" },
                { label: "Under Repair", id: "under repair", icon: "build" },
                { label: "Under Recycle", id: "recycling request", icon: "recycling" },
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
        <section className="flex-1 h-full overflow-y-auto bg-white border border-green-300 rounded-2xl p-8 shadow-md shadow-green-100/50 custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
              <p className="text-sm text-gray-500">Manage and track your sustainable assets</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleGeneratePDF} className="px-4 py-2 bg-white text-gray-900 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-100 transition-all shadow-md shadow-green-100/50 border border-green-300">
                <span className="material-icons text-sm text-gray-900">picture_as_pdf</span>
                Download Report
              </button>
              <Link to="/add-product" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-all shadow-md shadow-green-100/50 border border-green-300">
                <span className="material-icons text-sm">add</span>
                Register
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <article key={product._id} className="bg-white rounded-xl border border-green-300 overflow-hidden shadow-md shadow-green-100/50 hover:shadow-lg hover:shadow-green-200/50 transition-all group relative">
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

                  {/* Progress bar removed as requested */}

                  {/* Provider manages repair/recycle status - no manual buttons here */}


                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <button onClick={() => setSelectedProduct(product)} className="text-gray-600 hover:text-green-600 transition-all hover:scale-110" title="Details">
                      <span className="material-icons text-[28px]">info</span>
                    </button>
                    <Link to={`/qr-screen/${product.productID}`} className="text-gray-600 hover:text-green-600 transition-colors">
                      <span className="material-icons text-2xl">qr_code_2</span>
                    </Link>
                    <button onClick={() => handleToggleSell(product.productID, product.isForSale)} className={`text-sm font-bold flex items-center gap-1.5 ${product.isForSale ? 'text-orange-500' : 'text-gray-600 hover:text-green-600 transition-colors'}`}>
                      <span className="material-icons text-xl">{product.isForSale ? 'money_off' : 'sell'}</span>
                      {product.isForSale ? 'Listed' : 'Sell'}
                    </button>
                  </div>
                </div>
              </article>
            ))}

            <Link to="/add-product" className="bg-gray-50 rounded-xl border border-dashed border-green-400 flex flex-col items-center justify-center p-6 text-center hover:bg-green-50 hover:shadow-md hover:shadow-green-100/50 hover:border-green-400 transition-all min-h-[300px]">
              <span className="material-icons text-4xl text-gray-300 mb-2">add_circle_outline</span>
              <p className="text-sm font-medium text-gray-500 mb-4">Register a new product to start tracking its lifecycle.</p>
              <button className="px-4 py-2 bg-white border border-green-300 rounded-md text-sm font-bold text-gray-700 shadow-sm shadow-green-100/50 hover:bg-green-50 transition-colors">Add Product</button>
            </Link>
          </div>
        </section>
      </main>

      {/* Product Detail Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-[0_0_40px_rgba(34,197,94,0.15)] transform transition-transform duration-300 ease-in-out z-[60] overflow-y-auto ${selectedProduct ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedProduct && (
          <DrawerContent
            product={selectedProduct}
            token={token}
            onClose={() => setSelectedProduct(null)}
            onUpdate={(updatedProduct) => {
              setProducts(products.map(p => p.productID === updatedProduct.productID ? updatedProduct : p));
              setSelectedProduct(updatedProduct);
            }}
            handleToggleSell={handleToggleSell}
          />
        )}
      </div>

      {/* Overlay for drawer */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-300" onClick={() => setSelectedProduct(null)}></div>
      )}

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
                    className="w-full pl-8 pr-4 py-3 bg-green-50/30 border border-green-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-lg font-bold outline-none transition-all shadow-inner"
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
              <button className="flex-1 py-3 font-bold text-gray-500 hover:bg-green-50 rounded-xl transition-colors border border-green-300 shadow-sm shadow-green-100/50" onClick={() => setShowSellModal(false)}>Cancel</button>
              <button className="flex-1 py-3 font-bold text-zinc-900 bg-primary rounded-xl hover:bg-secondary transition-all shadow-md shadow-green-100/50 border border-green-300" onClick={handleSellSubmit}>Confirm Listing</button>
            </div>
          </div>
        </div>
      )}

      {/* Repair / Recycle Modal */}
      {isFormOpen && (
        <RepairRecycleForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            // Re-fetch products to show the updated status immediately
            window.location.reload(); 
          }}
        />
      )}
    </div>
  );
};

export default MyProducts;
