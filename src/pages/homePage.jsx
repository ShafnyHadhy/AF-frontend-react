import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="text-center">
      <h1 className="display-4 mt-5">Welcome to Repair Service</h1>
      <p className="lead">Your one-stop solution for all repair needs</p>

      {isAuthenticated ? (
        <Link to="/dashboard" className="btn btn-primary btn-lg mt-3">
          Go to Dashboard
        </Link>
      ) : (
        <div className="mt-4">
          <Link to="/register" className="btn btn-primary btn-lg me-3">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-outline-primary btn-lg">
            Login
          </Link>
        </div>
      )}

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">For Customers</h5>
              <p className="card-text">
                Find trusted repair service providers near you
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">For Providers</h5>
              <p className="card-text">
                Grow your business and manage repair requests
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Track Repairs</h5>
              <p className="card-text">
                Real-time tracking of your repair status
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
