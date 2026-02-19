import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="bg-primary text-white p-4 rounded-3 mb-4">
        <h2>Welcome, {user?.firstName}!</h2>
        <p className="mb-0">Customer Dashboard</p>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">My Profile</h5>
              <p className="card-text">
                View and update your profile information
              </p>
              <Link to="/customer/profile" className="btn btn-primary">
                Go to Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Find Providers</h5>
              <p className="card-text">Search for service providers near you</p>
              <Link to="/customer/find-providers" className="btn btn-primary">
                Find Now
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">My Repairs</h5>
              <p className="card-text">Track your repair requests</p>
              <Link to="/customer/repairs" className="btn btn-primary">
                View Repairs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
