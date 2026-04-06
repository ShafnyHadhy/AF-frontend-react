import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/adminPage";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import UserPage from "./pages/userPage";
import VerifyOTPPage from "./pages/verifyOTPPage";
import { Toaster } from "react-hot-toast";
import ProviderPage from "./pages/providerPage";
import MyProducts from "./pages/Products/MyProducts";
import AddProduct from "./pages/Products/AddProduct";
import EditProduct from "./pages/Products/EditProduct";
import Marketplace from "./pages/Products/Marketplace";
import ProductPublicDetails from "./pages/Products/ProductPublicDetails";
import Analytics from "./pages/Products/Analytics";
import QRScreen from "./pages/Products/QRScreen";
import RequestRepair from "./pages/Products/RequestRepair";
import RequestRecycling from "./pages/Products/RequestRecycling";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full">
        <Toaster position="top-right" />

        <Routes>
          <Route path="/register/step1" element={<RegisterPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/edit-profile" element={<div>Edit Profile Page</div>} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/provider/*" element={<ProviderPage />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:productID" element={<EditProduct />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route
            path="/product-public/:productID"
            element={<ProductPublicDetails />}
          />
          <Route path="/qr-screen/:productID" element={<QRScreen />} />
          <Route
            path="/request-repair/:productID"
            element={<RequestRepair />}
          />
          <Route
            path="/request-recycling/:productID"
            element={<RequestRecycling />}
          />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/*" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
