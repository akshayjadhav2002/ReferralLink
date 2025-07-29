import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CandidateDashboard() {
  const { user, profile } = useAuth();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["/api/applications/candidate"],
    enabled: !!user,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <Badge className="bg-primary">Applied</Badge>;
      case "reviewing":
        return <Badge className="bg-warning">In Review</Badge>;
      case "interview":
        return <Badge className="bg-success">Interview</Badge>;
      case "hired":
        return <Badge className="bg-success">Hired</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin fa-2x text-primary"></i>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>Candidate Dashboard</h2>
              <p className="text-muted">Welcome back, {profile?.fullName || user?.email}!</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                   style={{width: "60px", height: "60px"}}>
                <i className="fas fa-user-tie fa-2x"></i>
              </div>
            </div>
          </div>

          {/* Profile Completion Alert */}
          {!profile && (
            <div className="alert alert-warning mb-4">
              <h6><i className="fas fa-exclamation-triangle me-2"></i>Complete Your Profile</h6>
              <p className="mb-2">Your profile is incomplete. Complete it to improve your chances of getting hired.</p>
              <Link href="/profile">
                <Button size="sm">Complete Profile</Button>
              </Link>
            </div>
          )}

          {/* Quick Stats */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <Card className="text-center">
                <CardContent className="p-3">
                  <h3 className="text-primary mb-0">{applications.length}</h3>
                  <small className="text-muted">Applications</small>
                </CardContent>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="text-center">
                <CardContent className="p-3">
                  <h3 className="text-warning mb-0">
                    {applications.filter((app: any) => app.status === "reviewing").length}
                  </h3>
                  <small className="text-muted">In Review</small>
                </CardContent>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="text-center">
                <CardContent className="p-3">
                  <h3 className="text-success mb-0">
                    {applications.filter((app: any) => app.status === "interview").length}
                  </h3>
                  <small className="text-muted">Interviews</small>
                </CardContent>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="text-center">
                <CardContent className="p-3">
                  <h3 className="text-info mb-0">
                    {applications.filter((app: any) => app.status === "hired").length}
                  </h3>
                  <small className="text-muted">Hired</small>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Applications Table */}
          <Card>
            <CardHeader className="d-flex flex-row justify-content-between align-items-center">
              <h6 className="mb-0">My Applications</h6>
              <Link href="/jobs">
                <Button size="sm">
                  <i className="fas fa-plus me-1"></i>Find More Jobs
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {applications.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
                  <h6>No Applications Yet</h6>
                  <p className="text-muted mb-3">Start applying to jobs to see them here</p>
                  <Link href="/jobs">
                    <Button>Browse Jobs</Button>
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Position</th>
                        <th>Company</th>
                        <th>Referrer</th>
                        <th>Status</th>
                        <th>Applied</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((application: any) => (
                        <tr key={application.id}>
                          <td>{application.job?.title || "Unknown Position"}</td>
                          <td>{application.job?.company?.name || "Unknown Company"}</td>
                          <td>{application.referrer?.fullName || "Anonymous"}</td>
                          <td>{getStatusBadge(application.status)}</td>
                          <td>{formatDate(application.appliedAt)}</td>
                          <td>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
