import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return "/signup";
    switch (user.role) {
      case "candidate": return "/dashboard/candidate";
      case "referrer": return "/dashboard/referrer";
      case "hr": return "/dashboard/hr";
      default: return "/signup";
    }
  };

  return (
    <div>
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
                  <Link href="/signup?role=candidate">
                    <Button size="lg" className="w-100 btn-light text-primary">
                      <i className="fas fa-user-tie me-2"></i>I'm a Job Seeker
                    </Button>
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link href="/signup?role=referrer">
                    <Button size="lg" variant="outline" className="w-100 btn-outline-light">
                      <i className="fas fa-building me-2"></i>I'm an Employee
                    </Button>
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link href="/signup?role=hr">
                    <Button size="lg" variant="outline" className="w-100 btn-outline-light">
                      <i className="fas fa-users-cog me-2"></i>I'm HR/Admin
                    </Button>
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
              <Card className="feature-card h-100 text-center">
                <CardContent className="p-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: "60px", height: "60px"}}>
                    <i className="fas fa-user-plus fa-lg"></i>
                  </div>
                  <h5 className="card-title">1. Sign Up</h5>
                  <p className="card-text">
                    Choose your role - Candidate, Employee Referrer, or HR Admin. 
                    Create your profile and get verified.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-md-4">
              <Card className="feature-card h-100 text-center">
                <CardContent className="p-4">
                  <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: "60px", height: "60px"}}>
                    <i className="fas fa-handshake fa-lg"></i>
                  </div>
                  <h5 className="card-title">2. Connect</h5>
                  <p className="card-text">
                    Employees post referral opportunities. Candidates discover and apply 
                    to positions through trusted referrers.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-md-4">
              <Card className="feature-card h-100 text-center">
                <CardContent className="p-4">
                  <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: "60px", height: "60px"}}>
                    <i className="fas fa-trophy fa-lg"></i>
                  </div>
                  <h5 className="card-title">3. Succeed</h5>
                  <p className="card-text">
                    Get hired faster with referral advantage. Referrers earn bonuses. 
                    Companies find quality talent efficiently.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="text-center mt-5">
            <h4 className="mb-3">Ready to Get Started?</h4>
            <p className="text-muted mb-4">
              Join thousands of professionals already using ReferralLink to advance their careers.
            </p>
            <Link href={getDashboardPath()}>
              <Button size="lg">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h5 className="mb-3">
                <i className="fas fa-handshake me-2"></i>ReferralLink
              </h5>
              <p className="text-muted">
                Connecting talent with opportunities through trusted referrals. 
                Building careers and growing companies together.
              </p>
            </div>
            
            <div className="col-lg-2 col-md-3">
              <h6 className="mb-3">For Candidates</h6>
              <ul className="list-unstyled">
                <li><Link href="/jobs" className="text-muted text-decoration-none">Browse Jobs</Link></li>
                <li><Link href="/signup" className="text-muted text-decoration-none">Create Profile</Link></li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-3">
              <h6 className="mb-3">For Referrers</h6>
              <ul className="list-unstyled">
                <li><Link href="/signup?role=referrer" className="text-muted text-decoration-none">Post Referrals</Link></li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-3">
              <h6 className="mb-3">For Companies</h6>
              <ul className="list-unstyled">
                <li><Link href="/companies" className="text-muted text-decoration-none">Company Profiles</Link></li>
                <li><Link href="/signup?role=hr" className="text-muted text-decoration-none">HR Dashboard</Link></li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-3">
              <h6 className="mb-3">Support</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-muted text-decoration-none">Help Center</a></li>
                <li><a href="#" className="text-muted text-decoration-none">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <hr className="my-4" />
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-muted mb-0">&copy; 2024 ReferralLink. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-muted mb-0">
                Made with <i className="fas fa-heart text-danger"></i> for career growth
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .hero-section {
          background: linear-gradient(135deg, var(--primary) 0%, hsl(207, 90%, 45%) 100%);
          color: white;
          padding: 100px 0;
        }
        
        .feature-card {
          transition: transform 0.2s ease-in-out;
          border: none;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
