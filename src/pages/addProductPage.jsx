import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddProductPage() {

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [condition, setCondition] = useState("good");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function createProduct() {
    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          brand,
          model,
          serialNumber,
          purchaseDate,
          condition
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Product registered successfully!");

      navigate("/my-products");

    } catch (error) {
      toast.error("Failed to create product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">Register New Product</h1>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Serial Number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="good">Good</option>
          <option value="damaged">Damaged</option>
          <option value="needs_repair">Needs Repair</option>
        </select>

        <button
          onClick={createProduct}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Register Product"}
        </button>

      </div>
    </div>
  );
}