import React, { useState, useEffect } from 'react';

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      const companiesData = await response.json();
      setCompanies(companiesData);
    } catch (error) {
      console.error('Failed to load companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const CompanyCard = ({ company }) => (
    <div className="col-lg-4 col-md-6">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <div className="bg-primary rounded me-3 d-flex align-items-center justify-content-center" 
                 style={{width: '50px', height: '50px'}}>
              <i className="fas fa-building text-white"></i>
            </div>
            <div>
              <h5 className="card-title mb-0">{company.name}</h5>
              <small className="text-muted">{company.industry || 'Technology'}</small>
            </div>
          </div>
          
          <p className="card-text">
            {company.description || 'Join our team and make a difference in the world.'}
          </p>
          
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <small className="text-muted">Open Positions</small>
              <div className="fw-bold">0 jobs</div>
            </div>
            <span className="badge bg-secondary">No openings</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">Trusted by Leading Companies</h2>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-3">Loading companies...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-building fa-3x text-muted mb-3"></i>
            <h5>No companies registered yet</h5>
            <p className="text-muted">Be the first company to join ReferralLink!</p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {companies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Companies;