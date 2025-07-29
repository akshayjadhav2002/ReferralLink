import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    location?: string;
    workStyle?: string;
    skills: string[];
    companyId: string;
    referrerId: string;
    status: string;
    createdAt: string;
  };
  company?: { name: string; industry?: string };
  referrer?: { fullName: string; email: string };
  onApply: (jobId: string) => void;
  onSave: (jobId: string) => void;
}

export function JobCard({ job, company, referrer, onApply, onSave }: JobCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success">Active</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      case "paused":
        return <Badge className="bg-warning">Paused</Badge>;
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

  return (
    <Card className="job-card mb-3">
      <CardContent className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded me-3 d-flex align-items-center justify-content-center" style={{width: "50px", height: "50px"}}>
              <i className="fas fa-building text-white"></i>
            </div>
            <div>
              <h5 className="card-title mb-1">{job.title}</h5>
              <p className="text-muted mb-0">{company?.name || "Unknown Company"}</p>
            </div>
          </div>
          {getStatusBadge(job.status)}
        </div>
        
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <small className="text-muted">Location</small>
            <div>{job.location || "Not specified"}</div>
          </div>
          <div className="col-md-4">
            <small className="text-muted">Work Style</small>
            <div className="text-capitalize">{job.workStyle || "Not specified"}</div>
          </div>
          <div className="col-md-4">
            <small className="text-muted">Posted by</small>
            <div>{referrer?.fullName || "Anonymous"}</div>
          </div>
        </div>
        
        <p className="card-text">{job.description}</p>
        
        <div className="d-flex flex-wrap gap-2 mb-3">
          {job.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-light text-dark">
              {skill}
            </Badge>
          ))}
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">Posted {formatDate(job.createdAt)}</small>
          <div className="d-flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSave(job.id)}
            >
              <i className="fas fa-bookmark me-1"></i>Save
            </Button>
            <Button 
              size="sm"
              onClick={() => onApply(job.id)}
              disabled={job.status !== "active"}
            >
              <i className="fas fa-paper-plane me-1"></i>Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
