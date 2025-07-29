import React, { useState, useEffect } from 'react';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    location: '',
    workStyle: ''
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const jobsData = await response.json();
      setJobs(jobsData);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search filters:', searchFilters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const JobCard = ({ job }) => (
    <div className="card job-card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded me-3 d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
              <i className="fas fa-building text-white"></i>
            </div>
            <div>
              <h5 className="card-title mb-1">{job.title}</h5>
              <p className="text-muted mb-0">Company</p>
            </div>
          </div>
          <span className="badge bg-success">Active</span>
        </div>
        
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <small className="text-muted">Location</small>
            <div>{job.location || 'Not specified'}</div>
          </div>
          <div className="col-md-4">
            <small className="text-muted">Work Style</small>
            <div className="text-capitalize">{job.workStyle || 'Not specified'}</div>
          </div>
          <div className="col-md-4">
            <small className="text-muted">Posted by</small>
            <div>Referrer</div>
          </div>
        </div>
        
        <p className="card-text">{job.description}</p>
        
        <div className="d-flex flex-wrap gap-2 mb-3">
          {(job.skills || []).map((skill, index) => (
            <span key={index} className="badge bg-light text-dark">{skill}</span>
          ))}
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">Posted recently</small>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary btn-sm">
              <i className="fas fa-bookmark me-1"></i>Save
            </button>
            <button className="btn btn-primary btn-sm">
              <i className="fas fa-paper-plane me-1"></i>Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <h2 className="text-center mb-5">Find Your Next Opportunity</h2>
      
      {/* Search Bar */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSearchSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Job Title or Keywords</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="query"
                  value={searchFilters.query}
                  onChange={handleFilterChange}
                  placeholder="e.g. Software Engineer" 
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="location"
                  value={searchFilters.location}
                  onChange={handleFilterChange}
                  placeholder="e.g. San Francisco, CA" 
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Work Style</label>
                <select 
                  className="form-select" 
                  name="workStyle"
                  value={searchFilters.workStyle}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
              <div className="col-md-3">
                <button type="submit" className="btn btn-primary w-100">
                  <i className="fas fa-search me-2"></i>Search Jobs
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Jobs List */}
      <div>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
            <p className="mt-3">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <h5>No jobs found</h5>
              <p className="text-muted">Try adjusting your search criteria</p>
            </div>
          </div>
        ) : (
          jobs.map(job => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
}

export default Jobs;