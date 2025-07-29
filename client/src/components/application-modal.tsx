import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    description: string;
    location?: string;
    workStyle?: string;
    referrerId: string;
  };
  company?: { name: string };
  referrer?: { fullName: string; email: string };
}

export function ApplicationModal({ 
  isOpen, 
  onClose, 
  job, 
  company,
  referrer 
}: ApplicationModalProps) {
  const [message, setMessage] = useState("");
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: async (applicationData: {
      jobId: string;
      referrerId: string;
      message?: string;
    }) => {
      const response = await apiRequest("POST", "/api/applications", applicationData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your application has been sent to the referrer successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/applications/candidate"] });
      onClose();
      setMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.role !== "candidate") {
      toast({
        title: "Authentication Required",
        description: "Please log in as a candidate to apply for jobs.",
        variant: "destructive",
      });
      return;
    }

    applyMutation.mutate({
      jobId: job.id,
      referrerId: job.referrerId,
      message: message.trim() || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <i className="fas fa-paper-plane me-2"></i>Apply for Position
          </DialogTitle>
        </DialogHeader>
        
        <div className="row">
          <div className="col-md-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Position</Label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={job.title} 
                  readOnly 
                />
              </div>
              
              <div>
                <Label>Company</Label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={company?.name || "Unknown Company"} 
                  readOnly 
                />
              </div>
              
              <div>
                <Label>Resume</Label>
                <div className="form-control bg-light">
                  {profile?.resumeUrl ? (
                    <span className="text-success">
                      <i className="fas fa-file-pdf me-2"></i>
                      Resume uploaded
                    </span>
                  ) : (
                    <span className="text-warning">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      No resume uploaded. Please complete your profile first.
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="message">Message to Referrer (Optional)</Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Introduce yourself to the referrer..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              
              <div className="d-flex justify-content-end gap-2">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={applyMutation.isPending || !profile?.resumeUrl}
                >
                  {applyMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-1"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-1"></i>
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="col-md-4">
            <div className="card bg-light">
              <div className="card-body">
                <h6 className="card-title">Application Summary</h6>
                <div className="mb-2">
                  <small className="text-muted">Referrer:</small>
                  <div>{referrer?.fullName || "Anonymous"}</div>
                  <small className="text-muted">{referrer?.email}</small>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Location:</small>
                  <div>{job.location || "Not specified"}</div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Work Style:</small>
                  <div className="text-capitalize">{job.workStyle || "Not specified"}</div>
                </div>
                <hr />
                {profile?.resumeUrl ? (
                  <div className="d-flex align-items-center text-success">
                    <i className="fas fa-check-circle me-2"></i>
                    <small>Ready to apply!</small>
                  </div>
                ) : (
                  <div className="d-flex align-items-center text-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <small>Complete your profile first</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
