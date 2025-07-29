import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    companyId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await signup(
      formData.email, 
      formData.password, 
      formData.role, 
      formData.companyId
    );
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const showCompanyField = formData.role === 'referrer' || formData.role === 'hr';

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card">
              <div className="card-header text-center">
                <div className="mb-3">
                  <i className="fas fa-handshake fa-3x text-primary"></i>
                </div>
                <h3>Join ReferralLink</h3>
                <p className="text-muted">Create your account and start connecting</p>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">I am a...</label>
                    <select 
                      className="form-select" 
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select your role</option>
                      <option value="candidate">Job Seeker / Candidate</option>
                      <option value="referrer">Employee / Referrer</option>
                      <option value="hr">HR Admin</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  {showCompanyField && (
                    <div className="mb-3">
                      <label htmlFor="companyId" className="form-label">Company ID (Optional)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="companyId"
                        name="companyId"
                        value={formData.companyId}
                        onChange={handleInputChange}
                      />
                      <small className="text-muted">Leave blank if your company isn't registered yet</small>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>
                
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Already have an account? 
                    <Link to="/login" className="text-primary text-decoration-none ms-1">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;