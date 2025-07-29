import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const getInitials = (email) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-handshake me-2"></i>ReferralLink
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/jobs')}`} to="/jobs">Browse Jobs</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/companies')}`} to="/companies">Companies</Link>
            </li>
          </ul>
          
          <div className="navbar-nav">
            {currentUser ? (
              <div className="dropdown">
                <button 
                  className="btn btn-link text-white dropdown-toggle" 
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <div className="profile-avatar d-inline-flex me-2">
                    {getInitials(currentUser.email)}
                  </div>
                  {currentUser.email}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light">Login</Link>
                <Link to="/signup" className="btn btn-light text-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;