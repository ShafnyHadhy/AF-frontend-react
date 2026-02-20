const ProductDetailPanel = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        {product.brand} {product.model}
      </h2>

      <p className="text-sm text-gray-600">
        Serial: {product.serialNumber}
      </p>

      <p className="mt-2">
        Condition: <span className="capitalize">{product.condition}</span>
      </p>

      <p className="mt-2">
        Status: {product.status || "registered"}
      </p>

      <div className="mt-4">
        <img
          src={product.qrCode}
          alt="QR Code"
          className="w-40 h-40"
        />
      </div>
    </div>
  );
};

export default ProductDetailPanel;