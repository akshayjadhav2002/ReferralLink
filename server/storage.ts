import {
  users, profiles, companies, jobs, applications,
  type User, type InsertUser,
  type Profile, type InsertProfile,
  type Company, type InsertCompany,
  type Job, type InsertJob,
  type Application, type InsertApplication
} from "@shared/schema";
import { db, eq, and, desc, ilike, inArray, mockData } from "./db";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;

  // Profile methods
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;

  // Company methods
  getCompany(id: string): Promise<Company | undefined>;
  getCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, company: Partial<InsertCompany>): Promise<Company | undefined>;

  // Job methods
  getJob(id: string): Promise<Job | undefined>;
  getJobs(filters?: {
    search?: string;
    location?: string;
    workStyle?: string;
    industry?: string;
    companyId?: string;
  }): Promise<Job[]>;
  getJobsByReferrer(referrerId: string): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, job: Partial<InsertJob>): Promise<Job | undefined>;

  // Application methods
  getApplication(id: string): Promise<Application | undefined>;
  getApplicationsByCandidate(candidateId: string): Promise<Application[]>;
  getApplicationsByReferrer(referrerId: string): Promise<Application[]>;
  getApplicationsByCompany(companyId: string): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: string, application: Partial<InsertApplication>): Promise<Application | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser as any).returning();
    return user;
  }

  async updateUser(id: string, updateUser: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updateUser as any).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  // Profile methods
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile || undefined;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile as any).returning();
    return profile;
  }

  async updateProfile(userId: string, updateProfile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const [profile] = await db.update(profiles).set(updateProfile as any).where(eq(profiles.userId, userId)).returning();
    return profile || undefined;
  }

  // Company methods
  async getCompany(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || undefined;
  }

  async getCompanies(): Promise<Company[]> {
    return mockData.companies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db.insert(companies).values(insertCompany).returning();
    return company;
  }

  async updateCompany(id: string, updateCompany: Partial<InsertCompany>): Promise<Company | undefined> {
    const [company] = await db.update(companies).set(updateCompany).where(eq(companies.id, id)).returning();
    return company || undefined;
  }

  // Job methods
  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
      return job || undefined; 
  }

  async getJobs (filters: {
    search? : string;
    location?:  string;
    workStyle?: string;
    industry?: string;
    companyId?: string;
  } = {}): Promise<Job[]> {
    // Return mock jobs data
    let filteredJobs = mockData.jobs;

    if (filters.search) {
      filteredJ obs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    if (filters.location) {
      filteredJ obs = filteredJobs.filter(job =>
        job.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    if (filters.workStyle) {
      filteredJ obs = filteredJobs.filter(job =>
        job.workStyle === filters.workStyle
      );
    }
    if (filters.companyId) {
      filteredJ obs = filteredJobs.filter(job =>
        job.companyId === filters.companyId
      );
    }

    return filteredJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getJobsByReferrer(referrerId: string): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.referrerId, referrerId)).orderBy(desc(jobs.createdAt));
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob as any).returning();
    return job;
  }

  async updateJob(id: string, updateJob: Partial<InsertJob>): Promise<Job | undefined> {
    const [job] = await db.update(jobs).set(updateJob as any).where(eq(jobs.id, id)).returning();
    return job || undefined;
  }

  // Application methods
  async getApplication(id: string): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async getApplicationsByCandidate(candidateId: string): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.candidateId, candidateId)).orderBy(desc(applications.appliedAt));
  }

  async getApplicationsByReferrer(referrerId: string): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.referrerId, referrerId)).orderBy(desc(applications.appliedAt));
  }

  async getApplicationsByCompany(companyId: string): Promise<Application[]> {
    const companyJobs = await db.select({ id: jobs.id }).from(jobs).where(eq(jobs.companyId, companyId));
    const jobIds = companyJobs.map(job => job.id);

    if (jobIds.length === 0) return [];

    return await db.select().from(applications).where(inArray(applications.jobId, jobIds)).orderBy(desc(applications.appliedAt));
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db.insert(applications).values(insertApplication as any).returning();
    return application;
  }

  async updateApplication(id: string, updateApplication: Partial<InsertApplication>): Promise<Application | undefined> {
    const [application] = await db.update(applications).set(updateApplication as any).where(eq(applications.id, id)).returning();
    return application || undefined;
  }
}

export const storage = new DatabaseStorage();
