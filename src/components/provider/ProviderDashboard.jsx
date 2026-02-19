import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const ProviderDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="bg-success text-white p-4 rounded-3 mb-4">
        <h2>Welcome, {user?.firstName}!</h2>
        <p className="mb-0">Provider Dashboard</p>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">My Profile</h5>
              <p className="card-text">View and update your business profile</p>
              <Link to="/provider/profile" className="btn btn-success">
                Go to Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">My Repairs</h5>
              <p className="card-text">Manage your repair requests</p>
              <Link to="/provider/repairs" className="btn btn-success">
                View Repairs
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Earnings</h5>
              <p className="card-text">View your earnings and statistics</p>
              <Link to="/provider/earnings" className="btn btn-success">
                View Earnings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
