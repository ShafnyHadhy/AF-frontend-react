import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyProductsPage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProducts(response.data);

    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading products...</div>;
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">My Products</h1>

      {products.length === 0 ? (
        <p>No products registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {products.map((product) => (
            <div
              key={product.productID}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{product.brand} {product.model}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Status: {product.status}
              </p>

              {/* QR CODE */}
              {product.qrCode && (
                <img
                  src={product.qrCode}
                  alt="QR Code"
                  className="w-32 h-32 mt-4"
                />
              )}

              <Link
                to={`/product/${product.productID}`}
                className="inline-block mt-4 text-blue-600 font-semibold"
              >
                View Details →
              </Link>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}