import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ReferrerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
    workStyle: "",
    skills: [] as string[],
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs/referrer", user?.id],
    enabled: !!user,
  });

  const { data: applications = [] } = useQuery({
    queryKey: ["/api/applications/referrer"],
    enabled: !!user,
  });

  const createJobMutation = useMutation({
    mutationFn: async (jobData: any) => {
      const response = await apiRequest("POST", "/api/jobs", jobData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Job Posted",
        description: "Your referral opportunity has been posted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs/referrer", user?.id] });
      setShowCreateJob(false);
      setNewJob({
        title: "",
        description: "",
        location: "",
        workStyle: "",
        skills: [],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Post Job",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    createJobMutation.mutate(newJob);
  };

  const handleSkillsChange = (skillsString: string) => {
    const skills = skillsString.split(",").map(s => s.trim()).filter(s => s);
    setNewJob({ ...newJob, skills });
  };

  const getJobStats = () => {
    const activeJobs = jobs.filter((job: any) => job.status === "active").length;
    const totalApplications = applications.length;
    const interviews = applications.filter((app: any) => app.status === "interview").length;
    const hired = applications.filter((app: any) => app.status === "hired").length;

    return { activeJobs, totalApplications, interviews, hired };
  };

  const stats = getJobStats();

  if (jobsLoading) {
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
              <h2>Referrer Dashboard</h2>
              <p className="text-muted">Manage your referral opportunities</p>
            </div>
            <div className="text-center">
              <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                   style={{width: "60px", height: "60px"}}>
                <i className="fas fa-handshake fa-2x"></i>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <Card className="bg-primary text-white">
                <CardContent className="text-center p-3">
                  <h3 className="mb-0">{stats.activeJobs}</h3>
                  <small>Active Referrals</small>
                </CardContent>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="bg-success text-white">
                <CardContent className="text-center p-3">
                  <h3 className="mb-0">{stats.totalApplications}</h3>
                  <small>Applications</small>
                </CardContent>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="bg-warning text-white">
                <CardContent className="text-center p-3">
                  <h3 className="mb-0">{stats.interviews}</h3>
                  <small>Interviews</small>
                </CardContent>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="bg-info text-white">
                <CardContent className="text-center p-3">
                  <h3 className="mb-0">$2,500</h3>
                  <small>Bonus Earned</small>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Job Posts */}
          <Card>
            <CardHeader className="d-flex flex-row justify-content-between align-items-center">
              <h6 className="mb-0">My Referral Posts</h6>
              <Dialog open={showCreateJob} onOpenChange={setShowCreateJob}>
                <DialogTrigger asChild>
                  <Button>
                    <i className="fas fa-plus me-1"></i>New Referral
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Referral</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateJob} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={newJob.title}
                        onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Job Description</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        value={newJob.description}
                        onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                        required
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newJob.location}
                          onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6">
                        <Label>Work Style</Label>
                        <Select value={newJob.workStyle} onValueChange={(value) => setNewJob({...newJob, workStyle: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select work style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="onsite">On-site</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                      <Input
                        id="skills"
                        placeholder="React, Node.js, TypeScript"
                        value={newJob.skills.join(", ")}
                        onChange={(e) => handleSkillsChange(e.target.value)}
                      />
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      <Button type="button" variant="secondary" onClick={() => setShowCreateJob(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createJobMutation.isPending}>
                        {createJobMutation.isPending ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-1"></i>
                            Creating...
                          </>
                        ) : (
                          "Create Referral"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-briefcase fa-3x text-muted mb-3"></i>
                  <h6>No Referral Posts Yet</h6>
                  <p className="text-muted mb-3">Create your first referral opportunity</p>
                  <Button onClick={() => setShowCreateJob(true)}>
                    <i className="fas fa-plus me-1"></i>Create Referral
                  </Button>
                </div>
              ) : (
                <div className="row g-3">
                  {jobs.map((job: any) => (
                    <div key={job.id} className="col-md-6">
                      <Card className="border">
                        <CardContent className="p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title">{job.title}</h6>
                            <Badge className={job.status === "active" ? "bg-success" : "bg-secondary"}>
                              {job.status}
                            </Badge>
                          </div>
                          <p className="card-text small text-muted">
                            {job.description.length > 100 
                              ? `${job.description.substring(0, 100)}...` 
                              : job.description
                            }
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {applications.filter((app: any) => app.jobId === job.id).length} applications
                            </small>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
