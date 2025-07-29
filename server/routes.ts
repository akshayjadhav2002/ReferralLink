import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import { z } from "zod";
import { insertUserSchema, insertProfileSchema, insertJobSchema, insertApplicationSchema } from "../shared/schema.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Multer setup for file uploads
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "application/msword" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and Word documents are allowed"));
    }
  }
});

// Auth middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });

      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({ 
        user: { id: user.id, email: user.email, role: user.role },
        token 
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ message: "Invalid input data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = z.object({
        email: z.string().email(),
        password: z.string()
      }).parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
        user: { id: user.id, email: user.email, role: user.role, companyId: user.companyId },
        token 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Invalid input data" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    const profile = await storage.getProfile(req.user.id);
    res.json({ 
      user: { 
        id: req.user.id, 
        email: req.user.email, 
        role: req.user.role, 
        companyId: req.user.companyId 
      },
      profile 
    });
  });

  // Profile routes
  app.post("/api/profiles", authenticateToken, async (req: any, res) => {
    try {
      const validatedData = insertProfileSchema.parse({
        ...req.body,
        userId: req.user.id
      });

      const profile = await storage.createProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      console.error("Create profile error:", error);
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  app.put("/api/profiles", authenticateToken, async (req: any, res) => {
    try {
      const validatedData = insertProfileSchema.partial().parse(req.body);
      const profile = await storage.updateProfile(req.user.id, validatedData);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  // Resume upload
  app.post("/api/profiles/resume", authenticateToken, upload.single('resume'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const resumeUrl = `/uploads/${req.file.filename}`;
      const profile = await storage.updateProfile(req.user.id, { resumeUrl });

      res.json({ resumeUrl });
    } catch (error) {
      console.error("Resume upload error:", error);
      res.status(500).json({ message: "Failed to upload resume" });
    }
  });

  // Job routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        location: req.query.location as string,
        workStyle: req.query.workStyle as string,
        industry: req.query.industry as string,
        companyId: req.query.companyId as string,
      };

      const jobs = await storage.getJobs(filters);
      res.json(jobs);
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Get job error:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.role !== 'referrer') {
        return res.status(403).json({ message: "Only referrers can create jobs" });
      }

      const validatedData = insertJobSchema.parse({
        ...req.body,
        referrerId: req.user.id,
        companyId: req.user.companyId
      });

      const job = await storage.createJob(validatedData);
      res.status(201).json(job);
    } catch (error) {
      console.error("Create job error:", error);
      res.status(400).json({ message: "Invalid job data" });
    }
  });

  app.get("/api/jobs/referrer/:referrerId", authenticateToken, async (req: any, res) => {
    try {
      const jobs = await storage.getJobsByReferrer(req.params.referrerId);
      res.json(jobs);
    } catch (error) {
      console.error("Get referrer jobs error:", error);
      res.status(500).json({ message: "Failed to fetch referrer jobs" });
    }
  });

  // Application routes
  app.post("/api/applications", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.role !== 'candidate') {
        return res.status(403).json({ message: "Only candidates can apply" });
      }

      const validatedData = insertApplicationSchema.parse({
        ...req.body,
        candidateId: req.user.id
      });

      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      console.error("Create application error:", error);
      res.status(400).json({ message: "Invalid application data" });
    }
  });

  app.get("/api/applications/candidate", authenticateToken, async (req: any, res) => {
    try {
      const applications = await storage.getApplicationsByCandidate(req.user.id);
      res.json(applications);
    } catch (error) {
      console.error("Get candidate applications error:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get("/api/applications/referrer", authenticateToken, async (req: any, res) => {
    try {
      const applications = await storage.getApplicationsByReferrer(req.user.id);
      res.json(applications);
    } catch (error) {
      console.error("Get referrer applications error:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get("/api/applications/company", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.role !== 'hr' || !req.user.companyId) {
        return res.status(403).json({ message: "Only HR admins can view company applications" });
      }

      const applications = await storage.getApplicationsByCompany(req.user.companyId);
      res.json(applications);
    } catch (error) {
      console.error("Get company applications error:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.put("/api/applications/:id/status", authenticateToken, async (req: any, res) => {
    try {
      const { status } = z.object({
        status: z.enum(["applied", "reviewing", "interview", "hired", "rejected"])
      }).parse(req.body);

      const application = await storage.updateApplication(req.params.id, { 
        status,
        updatedAt: new Date()
      });

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json(application);
    } catch (error) {
      console.error("Update application status error:", error);
      res.status(400).json({ message: "Invalid status data" });
    }
  });

  // Company routes
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Get companies error:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      console.error("Get company error:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  const httpServer = createServer(app);
  return httpServer;
}
