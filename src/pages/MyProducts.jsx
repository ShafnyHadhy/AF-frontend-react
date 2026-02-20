import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import ProductDetailPanel from "../components/ProductDetailPanel";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/products/my-products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">My Products Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT SIDE - Product Cards */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.length === 0 ? (
            <p>No products registered yet.</p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))
          )}
        </div>

        {/* RIGHT SIDE - Detail Panel */}
        <div>
          {selectedProduct ? (
            <ProductDetailPanel product={selectedProduct} />
          ) : (
            <div className="bg-white rounded-xl shadow p-6 text-gray-500">
              Select a product to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProducts;