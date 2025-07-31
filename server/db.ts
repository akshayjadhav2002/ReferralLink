import 'dotenv/config';
import * as schema from "@shared/schema";

// For development, use mock database to avoid connection issues
console.log("Using mock database for development");

// Mock database for development with proper array returns
export const db = {
  select: () => ({
    from: (table: any) => ({
      where: (condition: any) => ({
        orderBy: (order: any) => Promise.resolve([])
      }),
      orderBy: (order: any) => Promise.resolve([])
    })
  }),
  insert: (table: any) => ({
    values: (data: any) => ({
      returning: () => Promise.resolve([{ id: "1", ...data }])
    })
  }),
  update: (table: any) => ({
    set: (data: any) => ({
      where: (condition: any) => ({
        returning: () => Promise.resolve([{ id: "1", ...data }])
      })
    })
  }),
  delete: (table: any) => ({
    where: (condition: any) => Promise.resolve([])
  })
};

// Mock Drizzle ORM functions
export const eq = (column: any, value: any) => ({ column, value, operator: 'eq' });
export const and = (...conditions: any[]) => ({ conditions, operator: 'and' });
export const ilike = (column: any, value: any) => ({ column, value, operator: 'ilike' });
export const desc = (column: any) => ({ column, direction: 'desc' });
export const inArray = (column: any, values: any[]) => ({ column, values, operator: 'in' });

export const pool = null;

// Mock data for development
export const mockData = {
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
  ]
};