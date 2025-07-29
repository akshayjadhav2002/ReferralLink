import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"candidate" | "referrer" | "hr">("candidate");
  const [companyId, setCompanyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  // Get role from URL params if provided
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get("role");
    if (roleParam && ["candidate", "referrer", "hr"].includes(roleParam)) {
      setRole(roleParam as "candidate" | "referrer" | "hr");
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password, role, companyId || undefined);
      toast({
        title: "Account Created",
        description: "Welcome to ReferralLink! Please complete your profile.",
      });
      setLocation("/profile");
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDescription = (selectedRole: string) => {
    switch (selectedRole) {
      case "candidate":
        return "I'm looking for job opportunities and want to connect with referrers";
      case "referrer":
        return "I'm an employee who can refer candidates for open positions at my company";
      case "hr":
        return "I'm an HR admin managing my company's referral program";
      default:
        return "";
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <Card>
              <CardHeader className="text-center">
                <div className="mb-3">
                  <i className="fas fa-handshake fa-3x text-primary"></i>
                </div>
                <CardTitle className="h3">Join ReferralLink</CardTitle>
                <p className="text-muted">Create your account and start connecting</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-3">
                    <Label htmlFor="role">I am a...</Label>
                    <Select value={role} onValueChange={(value: "candidate" | "referrer" | "hr") => setRole(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="candidate">Job Seeker / Candidate</SelectItem>
                        <SelectItem value="referrer">Employee / Referrer</SelectItem>
                        <SelectItem value="hr">HR Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <small className="text-muted mt-1 d-block">
                      {getRoleDescription(role)}
                    </small>
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="email">
                      Email Address
                      {(role === "referrer" || role === "hr") && (
                        <span className="text-danger ms-1">*Company email required</span>
                      )}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={
                        role === "referrer" || role === "hr" 
                          ? "your.name@company.com" 
                          : "Enter your email"
                      }
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {(role === "referrer" || role === "hr") && (
                    <div className="mb-3">
                      <Label htmlFor="companyId">Company ID (Optional)</Label>
                      <Input
                        id="companyId"
                        type="text"
                        placeholder="Leave blank if your company isn't registered yet"
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                      />
                      <small className="text-muted">
                        We'll verify your company email address
                      </small>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-100" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
                
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary text-decoration-none">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
