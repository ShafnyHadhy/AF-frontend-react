import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminPage from './pages/adminPage'
import HomePage from './pages/homePage'
import LoginPage from './pages/loginPage'
import { Toaster } from 'react-hot-toast'
import ProviderPage from './pages/providerPage'
import MyProducts from "./pages/MyProducts";

function App() {

  return (
    <BrowserRouter>

      <div className="w-full ">

        <Toaster position="top-right" />

        <Routes path="/">

          <Route path="/*" element={<HomePage />} />
          <Route path="/register" element={<h1 className="text-3xl font-bold">Register</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/provider/*" element={<ProviderPage />} />
          <Route path="/my-products" element={<MyProducts />} />
          
        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App
