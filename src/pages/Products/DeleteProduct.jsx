import axios from "axios";
import { toast } from "react-hot-toast";

const DeleteProduct = ({ productID, onDeleteSuccess }) => {
    const token = localStorage.getItem("token");

    const handleProductDelete = async (e) => {
        e.stopPropagation();

        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${productID}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Product deleted successfully");
            if (onDeleteSuccess) {
                onDeleteSuccess(productID);
            }
        } catch (error) {
            console.error("Delete error", error);
            toast.error("Failed to delete product");
        }
    };

    return (
        <button
            onClick={handleProductDelete}
            className="p-1.5 bg-white/90 dark:bg-zinc-800/90 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-red-500 transition-colors shadow-sm"
            title="Delete Product"
        >
            <span className="material-icons text-sm">delete</span>
        </button>
    );
};

export default DeleteProduct;
