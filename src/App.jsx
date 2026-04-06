import {
  BrowserRouter,
  Route,
  Router,
  Routes,
  useLocation,
} from "react-router-dom";
import AdminPage from "./pages/adminPage";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
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
import { AuthProvider } from "./context/AuthContext";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/register", "/verify-otp"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <BrowserRouter>
      <div className="w-full ">
        <Toaster position="top-right" />

        <Routes path="/">
          <Route
            path="/register"
            element={<h1 className="text-3xl font-bold">Register</h1>}
          />
          <Route path="/login" element={<LoginPage />} />
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
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<OTPPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/provider/dashboard"
              element={
                <ProtectedRoute role="provider">
                  <ProviderPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute role="customer">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
