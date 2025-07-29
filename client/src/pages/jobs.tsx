import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { JobCard } from "@/components/job-card";
import { ApplicationModal } from "@/components/application-modal";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Jobs() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    workStyle: "",
    industry: "",
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`/api/jobs?${params}`);
      return response.json();
    },
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["/api/companies"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically refetch due to the filters dependency
  };

  const handleApply = (jobId: string) => {
    if (!user || user.role !== "candidate") {
      toast({
        title: "Authentication Required",
        description: "Please log in as a candidate to apply for jobs.",
        variant: "destructive",
      });
      return;
    }

    const job = jobs.find((j: any) => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setIsApplicationModalOpen(true);
    }
  };

  const handleSave = (jobId: string) => {
    toast({
      title: "Job Saved",
      description: "Job has been saved to your bookmarks.",
    });
    // TODO: Implement save functionality
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      workStyle: "",
      industry: "",
    });
  };

  const getCompanyById = (companyId: string) => {
    return companies.find((c: any) => c.id === companyId);
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="text-center mb-5">Find Your Next Opportunity</h2>
          
          {/* Search Bar */}
          <Card className="shadow-sm mb-4">
            <CardContent className="p-4">
              <form onSubmit={handleSearch}>
                <div className="row g-3 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label">Job Title or Keywords</label>
                    <Input
                      placeholder="e.g. Software Engineer"
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Location</label>
                    <Input
                      placeholder="e.g. San Francisco, CA"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Work Style</label>
                    <Select value={filters.workStyle} onValueChange={(value) => setFilters({...filters, workStyle: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="onsite">On-site</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-md-3">
                    <Button type="submit" className="w-100">
                      <i className="fas fa-search me-2"></i>Search Jobs
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Advanced Filters */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="text-muted">Filters:</span>
                <Select value={filters.industry} onValueChange={(value) => setFilters({...filters, industry: value})}>
                  <SelectTrigger className="w-auto">
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Industries</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <i className="fas fa-times me-1"></i>Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="row">
            <div className="col-lg-8">
              {jobsLoading ? (
                <div className="text-center py-5">
                  <i className="fas fa-spinner fa-spin fa-2x text-primary"></i>
                  <p className="mt-3">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-5">
                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                    <h5>No jobs found</h5>
                    <p className="text-muted">Try adjusting your search criteria</p>
                  </CardContent>
                </Card>
              ) : (
                jobs.map((job: any) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    company={getCompanyById(job.companyId)}
                    onApply={handleApply}
                    onSave={handleSave}
                  />
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <Card>
                <CardHeader>
                  <h6 className="mb-0"><i className="fas fa-chart-line me-2"></i>Quick Stats</h6>
                </CardHeader>
                <CardContent>
                  <div className="row text-center">
                    <div className="col-6">
                      <h4 className="text-primary mb-0">{jobs.length}</h4>
                      <small className="text-muted">Active Jobs</small>
                    </div>
                    <div className="col-6">
                      <h4 className="text-success mb-0">{companies.length}</h4>
                      <small className="text-muted">Companies</small>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-3">
                <CardHeader>
                  <h6 className="mb-0"><i className="fas fa-fire me-2"></i>Top Companies</h6>
                </CardHeader>
                <div className="list-group list-group-flush">
                  {companies.slice(0, 5).map((company: any) => (
                    <div key={company.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{company.name}</strong>
                        <br /><small className="text-muted">{company.industry}</small>
                      </div>
                      <Badge variant="secondary">
                        {jobs.filter((j: any) => j.companyId === company.id).length} jobs
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <ApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={() => {
            setIsApplicationModalOpen(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
          company={getCompanyById(selectedJob.companyId)}
        />
      )}
    </div>
  );
}
