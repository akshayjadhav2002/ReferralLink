import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));

// Mock data
const mockData = {
    users: [
        { id: "1", email: "test@example.com", password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", role: "candidate", verified: true },
        { id: "2", email: "hr@company.com", password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", role: "hr", verified: true },
        { id: "3", email: "john@techcorp.com", password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", role: "referrer", verified: true },
        { id: "4", email: "sarah@innovate.com", password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", role: "referrer", verified: true }
    ],
    jobs: [
        {
            id: "1",
            title: "Senior Frontend Developer",
            description: "We're looking for a talented Frontend Developer to join our team and help build amazing user experiences. You'll work with React, TypeScript, and modern web technologies.",
            location: "San Francisco, CA",
            workStyle: "hybrid",
            skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
            companyId: "1",
            referrerId: "3",
            status: "active",
            createdAt: new Date("2024-01-15")
        },
        {
            id: "2",
            title: "Backend Engineer",
            description: "Join our backend team to build scalable APIs and microservices. Experience with Node.js, Python, or Go is required.",
            location: "New York, NY",
            workStyle: "remote",
            skills: ["Node.js", "Python", "PostgreSQL", "AWS", "Docker"],
            companyId: "1",
            referrerId: "3",
            status: "active",
            createdAt: new Date("2024-01-20")
        },
        {
            id: "3",
            title: "UX/UI Designer",
            description: "Create beautiful and intuitive user interfaces. You'll work closely with product managers and developers to bring designs to life.",
            location: "Austin, TX",
            workStyle: "onsite",
            skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
            companyId: "2",
            referrerId: "4",
            status: "active",
            createdAt: new Date("2024-01-25")
        },
        {
            id: "4",
            title: "Data Scientist",
            description: "Help us extract insights from large datasets and build machine learning models. Experience with Python, R, and statistical analysis required.",
            location: "Seattle, WA",
            workStyle: "hybrid",
            skills: ["Python", "R", "Machine Learning", "SQL", "Statistics"],
            companyId: "2",
            referrerId: "4",
            status: "active",
            createdAt: new Date("2024-01-30")
        },
        {
            id: "5",
            title: "DevOps Engineer",
            description: "Manage our cloud infrastructure and deployment pipelines. Experience with AWS, Kubernetes, and CI/CD required.",
            location: "Remote",
            workStyle: "remote",
            skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins"],
            companyId: "1",
            referrerId: "3",
            status: "active",
            createdAt: new Date("2024-02-01")
        },
        {
            id: "6",
            title: "Product Manager",
            description: "Lead product strategy and development. You'll work with cross-functional teams to deliver amazing products.",
            location: "Boston, MA",
            workStyle: "hybrid",
            skills: ["Product Strategy", "Agile", "User Research", "Analytics"],
            companyId: "3",
            referrerId: "4",
            status: "active",
            createdAt: new Date("2024-02-05")
        },
        {
            id: "7",
            title: "Mobile Developer (iOS)",
            description: "Build native iOS applications using Swift and SwiftUI. Experience with iOS development and app store guidelines required.",
            location: "Los Angeles, CA",
            workStyle: "onsite",
            skills: ["Swift", "SwiftUI", "iOS", "Xcode", "Core Data"],
            companyId: "3",
            referrerId: "4",
            status: "active",
            createdAt: new Date("2024-02-10")
        },
        {
            id: "8",
            title: "Full Stack Developer",
            description: "Work on both frontend and backend development. Experience with React, Node.js, and databases required.",
            location: "Chicago, IL",
            workStyle: "hybrid",
            skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
            companyId: "1",
            referrerId: "3",
            status: "active",
            createdAt: new Date("2024-02-15")
        }
    ],
    companies: [
        {
            id: "1",
            name: "TechCorp Solutions",
            description: "Leading technology company specializing in web applications and cloud solutions.",
            website: "https://techcorp.com",
            logoUrl: "https://via.placeholder.com/150x50/2563eb/ffffff?text=TechCorp",
            industry: "Technology",
            size: "500-1000 employees",
            createdAt: new Date("2023-01-01")
        },
        {
            id: "2",
            name: "Innovate Design Studio",
            description: "Creative design agency focused on user experience and digital innovation.",
            website: "https://innovatedesign.com",
            logoUrl: "https://via.placeholder.com/150x50/059669/ffffff?text=Innovate",
            industry: "Design",
            size: "50-200 employees",
            createdAt: new Date("2023-06-01")
        },
        {
            id: "3",
            name: "DataFlow Analytics",
            description: "Data science and analytics company helping businesses make data-driven decisions.",
            website: "https://dataflow.com",
            logoUrl: "https://via.placeholder.com/150x50/d97706/ffffff?text=DataFlow",
            industry: "Analytics",
            size: "200-500 employees",
            createdAt: new Date("2024-03-01")
        }
    ],
    profiles: [],
    applications: []
};

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
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = mockData.users.find(u => u.id === decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Helper functions
const findUserByEmail = (email) => {
    return mockData.users.find(user => user.email === email);
};

const findUserById = (id) => {
    return mockData.users.find(user => user.id === id);
};

// Auth routes
app.post("/api/auth/signup", async (req, res) => {
    try {
        const { email, password, role, companyId } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: "Email, password, and role are required" });
        }

        // Check if user already exists
        const existingUser = findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            id: (mockData.users.length + 1).toString(),
            email,
            password: hashedPassword,
            role,
            companyId: companyId || null,
            verified: true,
            createdAt: new Date()
        };

        mockData.users.push(newUser);

        // Generate token
        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            user: { id: newUser.id, email: newUser.email, role: newUser.role, companyId: newUser.companyId },
            token
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(400).json({ message: "Invalid input data" });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = findUserByEmail(email);
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

app.get("/api/auth/me", authenticateToken, async (req, res) => {
    const profile = mockData.profiles.find(p => p.userId === req.user.id);
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
app.post("/api/profiles", authenticateToken, async (req, res) => {
    try {
        const { fullName, resumeUrl, skills, experience, education, portfolioUrl, bio } = req.body;

        const newProfile = {
            id: (mockData.profiles.length + 1).toString(),
            userId: req.user.id,
            fullName,
            resumeUrl,
            skills: skills || [],
            experience,
            education,
            portfolioUrl,
            bio
        };

        mockData.profiles.push(newProfile);
        res.status(201).json(newProfile);
    } catch (error) {
        console.error("Create profile error:", error);
        res.status(400).json({ message: "Invalid profile data" });
    }
});

app.put("/api/profiles", authenticateToken, async (req, res) => {
    try {
        const profileIndex = mockData.profiles.findIndex(p => p.userId === req.user.id);

        if (profileIndex === -1) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const updatedProfile = { ...mockData.profiles[profileIndex], ...req.body };
        mockData.profiles[profileIndex] = updatedProfile;

        res.json(updatedProfile);
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(400).json({ message: "Invalid profile data" });
    }
});

// Resume upload
app.post("/api/profiles/resume", authenticateToken, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const resumeUrl = `/uploads/${req.file.filename}`;
        const profileIndex = mockData.profiles.findIndex(p => p.userId === req.user.id);

        if (profileIndex !== -1) {
            mockData.profiles[profileIndex].resumeUrl = resumeUrl;
        }

        res.json({ resumeUrl });
    } catch (error) {
        console.error("Resume upload error:", error);
        res.status(500).json({ message: "Failed to upload resume" });
    }
});

// Job routes
app.get("/api/jobs", async (req, res) => {
    try {
        const { search, location, workStyle, industry, companyId } = req.query;

        let filteredJobs = mockData.jobs;

        if (search) {
            filteredJobs = filteredJobs.filter(job =>
                job.title.toLowerCase().includes(search.toLowerCase()) ||
                job.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (location) {
            filteredJobs = filteredJobs.filter(job =>
                job.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        if (workStyle) {
            filteredJobs = filteredJobs.filter(job =>
                job.workStyle === workStyle
            );
        }

        if (companyId) {
            filteredJobs = filteredJobs.filter(job =>
                job.companyId === companyId
            );
        }

        // Sort by creation date (newest first)
        filteredJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(filteredJobs);
    } catch (error) {
        console.error("Get jobs error:", error);
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
});

app.get("/api/jobs/:id", async (req, res) => {
    try {
        const job = mockData.jobs.find(j => j.id === req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.json(job);
    } catch (error) {
        console.error("Get job error:", error);
        res.status(500).json({ message: "Failed to fetch job" });
    }
});

// Company routes
app.get("/api/companies", async (req, res) => {
    try {
        const sortedCompanies = mockData.companies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(sortedCompanies);
    } catch (error) {
        console.error("Get companies error:", error);
        res.status(500).json({ message: "Failed to fetch companies" });
    }
});

app.get("/api/companies/:id", async (req, res) => {
    try {
        const company = mockData.companies.find(c => c.id === req.params.id);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        res.json(company);
    } catch (error) {
        console.error("Get company error:", error);
        res.status(500).json({ message: "Failed to fetch company" });
    }
});

// Application routes
app.post("/api/applications", authenticateToken, async (req, res) => {
    try {
        const { jobId, message } = req.body;

        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }

        const job = mockData.jobs.find(j => j.id === jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const newApplication = {
            id: (mockData.applications.length + 1).toString(),
            jobId,
            candidateId: req.user.id,
            referrerId: job.referrerId,
            status: "applied",
            message: message || "",
            appliedAt: new Date(),
            updatedAt: new Date()
        };

        mockData.applications.push(newApplication);
        res.status(201).json(newApplication);
    } catch (error) {
        console.error("Create application error:", error);
        res.status(400).json({ message: "Invalid application data" });
    }
});

app.get("/api/applications", authenticateToken, async (req, res) => {
    try {
        let applications;

        if (req.user.role === "candidate") {
            applications = mockData.applications.filter(a => a.candidateId === req.user.id);
        } else if (req.user.role === "referrer") {
            applications = mockData.applications.filter(a => a.referrerId === req.user.id);
        } else {
            applications = mockData.applications;
        }

        // Sort by application date (newest first)
        applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

        res.json(applications);
    } catch (error) {
        console.error("Get applications error:", error);
        res.status(500).json({ message: "Failed to fetch applications" });
    }
});

// Serve static files from public directory
app.use(express.static("public"));

// Catch-all handler for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 