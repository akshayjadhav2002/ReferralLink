import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HRDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/applications/company"],
    enabled: !!user && user.role === "hr",
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["/api/jobs"],
    enabled: !!user,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/applications/${applicationId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Application status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/applications/company"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    updateStatusMutation.mutate({ applicationId, status: newStatus });
  };

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
    return new Date(dateString).toLocaleDateString();
  };

  const getCompanyStats = () => {
    const totalApplications = applications.length;
    const companyJobs = jobs.filter((job: any) => job.companyId === user?.companyId);
    const activeReferrers = new Set(companyJobs.map((job: any) => job.referrerId)).size;
    const hiredThisMonth = applications.filter((app: any) => 
      app.status === "hired" && 
      new Date(app.updatedAt).getMonth() === new Date().getMonth()
    ).length;

    return { totalApplications, activeReferrers, hiredThisMonth };
  };

  const stats = getCompanyStats();

  if (applicationsLoading) {
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
              <h2>HR Admin Dashboard</h2>
              <p className="text-muted">Manage your company's referral program</p>
            </div>
            <div className="text-center">
              <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                   style={{width: "60px", height: "60px"}}>
                <i className="fas fa-users-cog fa-2x"></i>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <Card className="bg-primary text-white">
                <CardContent className="text-center p-3">
                  <h3 className="mb-0">{stats.totalApplications}</h3>
                  <small>Total Applications</small>
                </CardContent>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="bg-success text-white">
                <CardContent className="text-center p-3">
                  <h3 className="mb-0">{stats.activeReferrers}</h3>
                  <small>Active Referrers</small>
                </CardContent>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="bg-info text-white">
                <CardContent className="text-center p-3">
                  <h3 className="mb-0">{stats.hiredThisMonth}</h3>
                  <small>Hired This Month</small>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <Tabs defaultValue="applications" className="w-100">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="applications">All Applications</TabsTrigger>
                  <TabsTrigger value="referrers">Company Referrers</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="applications" className="mt-4">
                  {applications.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
                      <h6>No Applications Yet</h6>
                      <p className="text-muted">Applications will appear here as candidates apply through your referrers</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Candidate</th>
                            <th>Position</th>
                            <th>Referrer</th>
                            <th>Status</th>
                            <th>Applied</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map((application: any) => (
                            <tr key={application.id}>
                              <td>
                                <div>
                                  <strong>{application.candidate?.profile?.fullName || "Anonymous"}</strong>
                                  <br />
                                  <small className="text-muted">{application.candidate?.email}</small>
                                </div>
                              </td>
                              <td>{application.job?.title || "Unknown Position"}</td>
                              <td>{application.referrer?.profile?.fullName || "Anonymous"}</td>
                              <td>
                                <Select 
                                  value={application.status} 
                                  onValueChange={(value) => handleStatusChange(application.id, value)}
                                >
                                  <SelectTrigger className="w-auto">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="applied">Applied</SelectItem>
                                    <SelectItem value="reviewing">In Review</SelectItem>
                                    <SelectItem value="interview">Interview</SelectItem>
                                    <SelectItem value="hired">Hired</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
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
                </TabsContent>

                <TabsContent value="referrers" className="mt-4">
                  <div className="text-center py-5">
                    <i className="fas fa-users fa-3x text-muted mb-3"></i>
                    <h6>Company Referrers</h6>
                    <p className="text-muted">View and manage employees who are posting referrals</p>
                    <p className="text-info">Feature coming soon!</p>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-4">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <Card>
                        <CardHeader>
                          <h6>Application Sources</h6>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-4">
                            <i className="fas fa-chart-pie fa-3x text-muted mb-3"></i>
                            <p className="text-muted">Analytics dashboard coming soon!</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="col-md-6">
                      <Card>
                        <CardHeader>
                          <h6>Hiring Timeline</h6>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-4">
                            <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                            <p className="text-muted">Timeline analytics coming soon!</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
