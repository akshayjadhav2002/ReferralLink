import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">
                Connect Through Referrals, Land Your Dream Job
              </h1>
              <p className="lead mb-5">
                ReferralLink is the dedicated marketplace where job seekers connect with company 
                employees and HR professionals for trusted referral opportunities.
              </p>
              
              <div className="row g-3 justify-content-center">
                <div className="col-md-4">
                  <Link to="/signup" className="btn btn-light btn-lg w-100 text-primary">
                    <i className="fas fa-user-tie me-2"></i>I'm a Job Seeker
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link to="/signup" className="btn btn-outline-light btn-lg w-100">
                    <i className="fas fa-building me-2"></i>I'm an Employee
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link to="/signup" className="btn btn-outline-light btn-lg w-100">
                    <i className="fas fa-users-cog me-2"></i>I'm HR/Admin
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">How ReferralLink Works</h2>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card feature-card h-100 text-center">
                <div className="card-body p-4">
                  <div 
                    className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                    style={{width: '60px', height: '60px'}}
                  >
                    <i className="fas fa-user-plus fa-lg"></i>
                  </div>
                  <h5 className="card-title">1. Sign Up</h5>
                  <p className="card-text">
                    Choose your role - Candidate, Employee Referrer, or HR Admin. 
                    Create your profile and get verified.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card feature-card h-100 text-center">
                <div className="card-body p-4">
                  <div 
                    className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                    style={{width: '60px', height: '60px'}}
                  >
                    <i className="fas fa-handshake fa-lg"></i>
                  </div>
                  <h5 className="card-title">2. Connect</h5>
                  <p className="card-text">
                    Employees post referral opportunities. Candidates discover and apply 
                    to positions through trusted referrers.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card feature-card h-100 text-center">
                <div className="card-body p-4">
                  <div 
                    className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                    style={{width: '60px', height: '60px'}}
                  >
                    <i className="fas fa-trophy fa-lg"></i>
                  </div>
                  <h5 className="card-title">3. Succeed</h5>
                  <p className="card-text">
                    Get hired faster with referral advantage. Referrers earn bonuses. 
                    Companies find quality talent efficiently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;