const ProductCard = ({ product, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer p-4"
    >
      <h3 className="font-bold text-lg mb-1">
        {product.productName} {product.model}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        Serial: {product.serialNumber}
      </p>

      <p className="mt-2 text-sm">
        Condition:{" "}
        <span className="font-medium capitalize">
          {product.condition}
        </span>
      </p>

      <div className="mt-3">
        <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
          {product.status || "registered"}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;