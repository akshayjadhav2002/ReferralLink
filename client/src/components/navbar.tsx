import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "candidate": return "/dashboard/candidate";
      case "referrer": return "/dashboard/referrer";
      case "hr": return "/dashboard/hr";
      default: return "/";
    }
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container">
        <Link href="/" className="navbar-brand">
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
              <Link 
                href="/" 
                className={`nav-link ${location === "/" ? "active" : ""}`}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/jobs" 
                className={`nav-link ${location === "/jobs" ? "active" : ""}`}
              >
                Browse Jobs
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/companies" 
                className={`nav-link ${location === "/companies" ? "active" : ""}`}
              >
                Companies
              </Link>
            </li>
          </ul>
          
          <div className="navbar-nav">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="nav-link dropdown-toggle btn btn-link text-white text-decoration-none">
                    <div className="profile-avatar d-inline-flex me-2">
                      {getInitials(user.email)}
                    </div>
                    <span>{user.email}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardPath()}>
                      <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <i className="fas fa-user me-2"></i>Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="nav-item d-flex gap-2">
                <Link href="/login">
                  <Button variant="outline" className="btn-outline-light">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="btn-light text-primary">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .profile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }
      `}</style>
    </nav>
  );
}
