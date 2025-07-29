import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  const getDashboardTitle = () => {
    const titles = {
      'candidate': 'Candidate Dashboard',
      'referrer': 'Referrer Dashboard', 
      'hr': 'HR Admin Dashboard'
    };
    return titles[currentUser.role] || 'Dashboard';
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>{getDashboardTitle()}</h2>
              <p className="text-muted">Welcome back, {currentUser.email}!</p>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="card">
            <div className="card-body text-center py-5">
              <i className="fas fa-construction fa-3x text-muted mb-3"></i>
              <h5>Dashboard Coming Soon</h5>
              <p className="text-muted">Dashboard features are being built for {currentUser.role} users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;