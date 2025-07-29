import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Companies() {
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["/api/companies"],
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["/api/jobs"],
  });

  const getJobCountForCompany = (companyId: string) => {
    return jobs.filter((job: any) => job.companyId === companyId && job.status === "active").length;
  };

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin fa-2x text-primary"></i>
          <p className="mt-3">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">Trusted by Leading Companies</h2>
      
      <div className="row g-4">
        {companies.length === 0 ? (
          <div className="col-12">
            <Card>
              <CardContent className="text-center py-5">
                <i className="fas fa-building fa-3x text-muted mb-3"></i>
                <h5>No companies registered yet</h5>
                <p className="text-muted">Be the first company to join ReferralLink!</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          companies.map((company: any) => (
            <div key={company.id} className="col-lg-4 col-md-6">
              <Card className="h-100">
                <CardContent className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary rounded me-3 d-flex align-items-center justify-content-center" 
                         style={{width: "50px", height: "50px"}}>
                      <i className="fas fa-building text-white"></i>
                    </div>
                    <div>
                      <h5 className="card-title mb-0">{company.name}</h5>
                      <small className="text-muted">{company.industry || "Technology"}</small>
                    </div>
                  </div>
                  
                  <p className="card-text">
                    {company.description || "Join our team and make a difference in the world."}
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">Open Positions</small>
                      <div className="fw-bold">
                        {getJobCountForCompany(company.id)} jobs
                      </div>
                    </div>
                    {getJobCountForCompany(company.id) > 0 ? (
                      <Link href={`/jobs?companyId=${company.id}`}>
                        <Button variant="outline" size="sm">
                          View Jobs
                        </Button>
                      </Link>
                    ) : (
                      <Badge variant="secondary">No openings</Badge>
                    )}
                  </div>
                  
                  {company.website && (
                    <div className="mt-3">
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-none small"
                      >
                        <i className="fas fa-external-link-alt me-1"></i>
                        Visit Website
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
