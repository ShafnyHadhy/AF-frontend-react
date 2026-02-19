import React, { useState } from "react";
import { Link } from "react-router-dom";
import RegisterCustomer from "../components/auth/RegisterCustomer";
import RegisterProvider from "../components/auth/RegisterProvider";

const RegisterPage = () => {
  const [userType, setUserType] = useState("customer");

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-8">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Create an Account
          </h2>

          {/* Role Selection Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setUserType("customer")}
              className={`flex-1 py-3 rounded-lg font-medium transition ${
                userType === "customer"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Register as Customer
            </button>
            <button
              onClick={() => setUserType("provider")}
              className={`flex-1 py-3 rounded-lg font-medium transition ${
                userType === "provider"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Register as Provider
            </button>
          </div>

          {/* Registration Forms */}
          {userType === "customer" ? (
            <RegisterCustomer />
          ) : (
            <RegisterProvider />
          )}

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
