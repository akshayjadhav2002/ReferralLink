// ReferralLink - Vanilla JS Application
class ReferralLinkApp {
  constructor() {
    this.currentUser = null;
    this.currentRoute = 'home';
    this.init();
  }

  init() {
    this.checkAuth();
    this.setupEventListeners();
    this.handleRoute();
  }

  // Authentication & User Management
  async checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          this.currentUser = data.user;
          this.updateNavbar();
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      }
    }
    this.updateNavbar();
  }

  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        this.currentUser = data.user;
        this.updateNavbar();
        this.showAlert('success', 'Login successful!');
        this.navigate('home');
      } else {
        this.showAlert('danger', data.message || 'Login failed');
      }
    } catch (error) {
      this.showAlert('danger', 'Login failed. Please try again.');
    }
  }

  async signup(email, password, role, companyId) {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, companyId })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        this.currentUser = data.user;
        this.updateNavbar();
        this.showAlert('success', 'Account created successfully!');
        this.navigate('home');
      } else {
        this.showAlert('danger', data.message || 'Signup failed');
      }
    } catch (error) {
      this.showAlert('danger', 'Signup failed. Please try again.');
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser = null;
    this.updateNavbar();
    this.showAlert('info', 'Logged out successfully');
    this.navigate('home');
  }

  // Navigation & Routing
  setupEventListeners() {
    // Handle navigation clicks
    document.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-route')) {
        e.preventDefault();
        const route = e.target.getAttribute('data-route');
        this.navigate(route);
      }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });
  }

  navigate(route) {
    this.currentRoute = route;
    history.pushState(null, '', `/${route === 'home' ? '' : route}`);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    if (path === '/') this.currentRoute = 'home';
    else if (path === '/jobs') this.currentRoute = 'jobs';
    else if (path === '/companies') this.currentRoute = 'companies';
    else if (path === '/login') this.currentRoute = 'login';
    else if (path === '/signup') this.currentRoute = 'signup';
    else if (path.startsWith('/dashboard')) this.currentRoute = 'dashboard';
    else this.currentRoute = 'notfound';

    this.loadPage();
    this.updateNavbar();
  }

  loadPage() {
    const app = document.getElementById('app');
    
    switch (this.currentRoute) {
      case 'home':
        app.innerHTML = this.renderHomePage();
        break;
      case 'jobs':
        app.innerHTML = this.renderJobsPage();
        this.loadJobs();
        break;
      case 'companies':
        app.innerHTML = this.renderCompaniesPage();
        this.loadCompanies();
        break;
      case 'login':
        app.innerHTML = this.renderLoginPage();
        this.setupLoginForm();
        break;
      case 'signup':
        app.innerHTML = this.renderSignupPage();
        this.setupSignupForm();
        break;
      case 'dashboard':
        if (this.currentUser) {
          app.innerHTML = this.renderDashboard();
          this.loadDashboardData();
        } else {
          this.navigate('login');
        }
        break;
      default:
        app.innerHTML = this.renderNotFoundPage();
    }
  }

  updateNavbar() {
    const authSection = document.getElementById('navbarAuth');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Update active nav link
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-route') === this.currentRoute) {
        link.classList.add('active');
      }
    });

    if (this.currentUser) {
      authSection.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-link text-white dropdown-toggle" type="button" data-bs-toggle="dropdown">
            <div class="profile-avatar d-inline-flex me-2">
              ${this.getInitials(this.currentUser.email)}
            </div>
            ${this.currentUser.email}
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" data-route="dashboard">
              <i class="fas fa-tachometer-alt me-2"></i>Dashboard
            </a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" onclick="app.logout()">
              <i class="fas fa-sign-out-alt me-2"></i>Logout
            </a></li>
          </ul>
        </div>
      `;
    } else {
      authSection.innerHTML = `
        <div class="d-flex gap-2">
          <a href="#" class="btn btn-outline-light" data-route="login">Login</a>
          <a href="#" class="btn btn-light text-primary" data-route="signup">Sign Up</a>
        </div>
      `;
    }
  }

  getInitials(email) {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  }

  // Page Renderers
  renderHomePage() {
    return `
      <!-- Hero Section -->
      <section class="hero-section text-center">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <h1 class="display-4 fw-bold mb-4">
                Connect Through Referrals, Land Your Dream Job
              </h1>
              <p class="lead mb-5">
                ReferralLink is the dedicated marketplace where job seekers connect with company 
                employees and HR professionals for trusted referral opportunities.
              </p>
              
              <div class="row g-3 justify-content-center">
                <div class="col-md-4">
                  <a href="#" class="btn btn-light btn-lg w-100 text-primary" onclick="app.navigate('signup')">
                    <i class="fas fa-user-tie me-2"></i>I'm a Job Seeker
                  </a>
                </div>
                <div class="col-md-4">
                  <a href="#" class="btn btn-outline-light btn-lg w-100">
                    <i class="fas fa-building me-2"></i>I'm an Employee
                  </a>
                </div>
                <div class="col-md-4">
                  <a href="#" class="btn btn-outline-light btn-lg w-100">
                    <i class="fas fa-users-cog me-2"></i>I'm HR/Admin
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="py-5 bg-light">
        <div class="container">
          <h2 class="text-center mb-5">How ReferralLink Works</h2>
          
          <div class="row g-4">
            <div class="col-md-4">
              <div class="card feature-card h-100 text-center">
                <div class="card-body p-4">
                  <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style="width: 60px; height: 60px;">
                    <i class="fas fa-user-plus fa-lg"></i>
                  </div>
                  <h5 class="card-title">1. Sign Up</h5>
                  <p class="card-text">
                    Choose your role - Candidate, Employee Referrer, or HR Admin. 
                    Create your profile and get verified.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="card feature-card h-100 text-center">
                <div class="card-body p-4">
                  <div class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style="width: 60px; height: 60px;">
                    <i class="fas fa-handshake fa-lg"></i>
                  </div>
                  <h5 class="card-title">2. Connect</h5>
                  <p class="card-text">
                    Employees post referral opportunities. Candidates discover and apply 
                    to positions through trusted referrers.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="card feature-card h-100 text-center">
                <div class="card-body p-4">
                  <div class="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style="width: 60px; height: 60px;">
                    <i class="fas fa-trophy fa-lg"></i>
                  </div>
                  <h5 class="card-title">3. Succeed</h5>
                  <p class="card-text">
                    Get hired faster with referral advantage. Referrers earn bonuses. 
                    Companies find quality talent efficiently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderLoginPage() {
    return `
      <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-6 col-lg-4">
              <div class="card">
                <div class="card-header text-center">
                  <div class="mb-3">
                    <i class="fas fa-handshake fa-3x text-primary"></i>
                  </div>
                  <h3>Welcome Back</h3>
                  <p class="text-muted">Sign in to your ReferralLink account</p>
                </div>
                <div class="card-body">
                  <form id="loginForm">
                    <div class="mb-3">
                      <label for="email" class="form-label">Email Address</label>
                      <input type="email" class="form-control" id="email" required>
                    </div>
                    
                    <div class="mb-3">
                      <label for="password" class="form-label">Password</label>
                      <input type="password" class="form-control" id="password" required>
                    </div>
                    
                    <button type="submit" class="btn btn-primary w-100">
                      Sign In
                    </button>
                  </form>
                  
                  <div class="text-center mt-4">
                    <p class="text-muted mb-0">
                      Don't have an account? 
                      <a href="#" class="text-primary text-decoration-none" data-route="signup">
                        Sign up here
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderSignupPage() {
    return `
      <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
              <div class="card">
                <div class="card-header text-center">
                  <div class="mb-3">
                    <i class="fas fa-handshake fa-3x text-primary"></i>
                  </div>
                  <h3>Join ReferralLink</h3>
                  <p class="text-muted">Create your account and start connecting</p>
                </div>
                <div class="card-body">
                  <form id="signupForm">
                    <div class="mb-3">
                      <label for="role" class="form-label">I am a...</label>
                      <select class="form-select" id="role" required>
                        <option value="">Select your role</option>
                        <option value="candidate">Job Seeker / Candidate</option>
                        <option value="referrer">Employee / Referrer</option>
                        <option value="hr">HR Admin</option>
                      </select>
                    </div>

                    <div class="mb-3">
                      <label for="signupEmail" class="form-label">Email Address</label>
                      <input type="email" class="form-control" id="signupEmail" required>
                    </div>

                    <div class="mb-3" id="companyIdField" style="display: none;">
                      <label for="companyId" class="form-label">Company ID (Optional)</label>
                      <input type="text" class="form-control" id="companyId">
                      <small class="text-muted">Leave blank if your company isn't registered yet</small>
                    </div>
                    
                    <div class="mb-3">
                      <label for="signupPassword" class="form-label">Password</label>
                      <input type="password" class="form-control" id="signupPassword" required>
                    </div>
                    
                    <div class="mb-3">
                      <label for="confirmPassword" class="form-label">Confirm Password</label>
                      <input type="password" class="form-control" id="confirmPassword" required>
                    </div>
                    
                    <button type="submit" class="btn btn-primary w-100">
                      Create Account
                    </button>
                  </form>
                  
                  <div class="text-center mt-4">
                    <p class="text-muted mb-0">
                      Already have an account? 
                      <a href="#" class="text-primary text-decoration-none" data-route="login">
                        Sign in here
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderJobsPage() {
    return `
      <div class="container py-4">
        <h2 class="text-center mb-5">Find Your Next Opportunity</h2>
        
        <!-- Search Bar -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <form id="jobSearchForm">
              <div class="row g-3 align-items-end">
                <div class="col-md-4">
                  <label class="form-label">Job Title or Keywords</label>
                  <input type="text" class="form-control" id="searchQuery" placeholder="e.g. Software Engineer">
                </div>
                <div class="col-md-3">
                  <label class="form-label">Location</label>
                  <input type="text" class="form-control" id="searchLocation" placeholder="e.g. San Francisco, CA">
                </div>
                <div class="col-md-2">
                  <label class="form-label">Work Style</label>
                  <select class="form-select" id="workStyle">
                    <option value="">Any</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <button type="submit" class="btn btn-primary w-100">
                    <i class="fas fa-search me-2"></i>Search Jobs
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Jobs List -->
        <div id="jobsList">
          <div class="text-center py-5">
            <div class="spinner"></div>
            <p class="mt-3">Loading jobs...</p>
          </div>
        </div>
      </div>
    `;
  }

  renderCompaniesPage() {
    return `
      <div class="container py-5">
        <h2 class="text-center mb-5">Trusted by Leading Companies</h2>
        
        <div id="companiesList">
          <div class="text-center py-5">
            <div class="spinner"></div>
            <p class="mt-3">Loading companies...</p>
          </div>
        </div>
      </div>
    `;
  }

  renderDashboard() {
    if (!this.currentUser) return '';

    const dashboardTitle = {
      'candidate': 'Candidate Dashboard',
      'referrer': 'Referrer Dashboard', 
      'hr': 'HR Admin Dashboard'
    }[this.currentUser.role] || 'Dashboard';

    return `
      <div class="container py-4">
        <div class="row">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2>${dashboardTitle}</h2>
                <p class="text-muted">Welcome back, ${this.currentUser.email}!</p>
              </div>
            </div>

            <!-- Dashboard Content -->
            <div id="dashboardContent">
              <div class="text-center py-5">
                <div class="spinner"></div>
                <p class="mt-3">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderNotFoundPage() {
    return `
      <div class="container py-5">
        <div class="text-center">
          <h1 class="display-1">404</h1>
          <h2>Page Not Found</h2>
          <p class="text-muted mb-4">The page you're looking for doesn't exist.</p>
          <a href="#" class="btn btn-primary" data-route="home">Go Home</a>
        </div>
      </div>
    `;
  }

  // Form Setup
  setupLoginForm() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      this.login(email, password);
    });
  }

  setupSignupForm() {
    const form = document.getElementById('signupForm');
    const roleSelect = document.getElementById('role');
    const companyField = document.getElementById('companyIdField');

    roleSelect.addEventListener('change', (e) => {
      if (e.target.value === 'referrer' || e.target.value === 'hr') {
        companyField.style.display = 'block';
      } else {
        companyField.style.display = 'none';
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const role = document.getElementById('role').value;
      const companyId = document.getElementById('companyId').value;
      
      if (password !== confirmPassword) {
        this.showAlert('danger', 'Passwords do not match');
        return;
      }
      
      if (password.length < 6) {
        this.showAlert('danger', 'Password must be at least 6 characters long');
        return;
      }

      this.signup(email, password, role, companyId);
    });
  }

  // Data Loading
  async loadJobs() {
    try {
      const response = await fetch('/api/jobs');
      const jobs = await response.json();
      
      const jobsList = document.getElementById('jobsList');
      if (jobs.length === 0) {
        jobsList.innerHTML = `
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="fas fa-search fa-3x text-muted mb-3"></i>
              <h5>No jobs found</h5>
              <p class="text-muted">Try adjusting your search criteria</p>
            </div>
          </div>
        `;
      } else {
        jobsList.innerHTML = jobs.map(job => this.renderJobCard(job)).join('');
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
      this.showAlert('danger', 'Failed to load jobs');
    }
  }

  async loadCompanies() {
    try {
      const response = await fetch('/api/companies');
      const companies = await response.json();
      
      const companiesList = document.getElementById('companiesList');
      if (companies.length === 0) {
        companiesList.innerHTML = `
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="fas fa-building fa-3x text-muted mb-3"></i>
              <h5>No companies registered yet</h5>
              <p class="text-muted">Be the first company to join ReferralLink!</p>
            </div>
          </div>
        `;
      } else {
        companiesList.innerHTML = `
          <div class="row g-4">
            ${companies.map(company => this.renderCompanyCard(company)).join('')}
          </div>
        `;
      }
    } catch (error) {
      console.error('Failed to load companies:', error);
      this.showAlert('danger', 'Failed to load companies');
    }
  }

  async loadDashboardData() {
    // Dashboard implementation would go here
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = `
      <div class="card">
        <div class="card-body text-center py-5">
          <i class="fas fa-construction fa-3x text-muted mb-3"></i>
          <h5>Dashboard Coming Soon</h5>
          <p class="text-muted">Dashboard features are being built for ${this.currentUser.role} users</p>
        </div>
      </div>
    `;
  }

  // Card Renderers
  renderJobCard(job) {
    return `
      <div class="card job-card mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="d-flex align-items-center">
              <div class="bg-primary rounded me-3 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                <i class="fas fa-building text-white"></i>
              </div>
              <div>
                <h5 class="card-title mb-1">${job.title}</h5>
                <p class="text-muted mb-0">Company</p>
              </div>
            </div>
            <span class="badge bg-success">Active</span>
          </div>
          
          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <small class="text-muted">Location</small>
              <div>${job.location || 'Not specified'}</div>
            </div>
            <div class="col-md-4">
              <small class="text-muted">Work Style</small>
              <div class="text-capitalize">${job.workStyle || 'Not specified'}</div>
            </div>
            <div class="col-md-4">
              <small class="text-muted">Posted by</small>
              <div>Referrer</div>
            </div>
          </div>
          
          <p class="card-text">${job.description}</p>
          
          <div class="d-flex flex-wrap gap-2 mb-3">
            ${(job.skills || []).map(skill => `<span class="badge bg-light text-dark">${skill}</span>`).join('')}
          </div>
          
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">Posted recently</small>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary btn-sm">
                <i class="fas fa-bookmark me-1"></i>Save
              </button>
              <button class="btn btn-primary btn-sm">
                <i class="fas fa-paper-plane me-1"></i>Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCompanyCard(company) {
    return `
      <div class="col-lg-4 col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="bg-primary rounded me-3 d-flex align-items-center justify-content-center" 
                   style="width: 50px; height: 50px;">
                <i class="fas fa-building text-white"></i>
              </div>
              <div>
                <h5 class="card-title mb-0">${company.name}</h5>
                <small class="text-muted">${company.industry || 'Technology'}</small>
              </div>
            </div>
            
            <p class="card-text">
              ${company.description || 'Join our team and make a difference in the world.'}
            </p>
            
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted">Open Positions</small>
                <div class="fw-bold">0 jobs</div>
              </div>
              <span class="badge bg-secondary">No openings</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Utility Methods
  showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '80px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }
}

// Initialize the app
const app = new ReferralLinkApp();