import { 
  users, profiles, companies, jobs, applications,
  type User, type InsertUser, 
  type Profile, type InsertProfile,
  type Company, type InsertCompany,
  type Job, type InsertJob,
  type Application, type InsertApplication
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, ilike, inArray } from "drizzle-orm";

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
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updateUser: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updateUser).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  // Profile methods
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile || undefined;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile).returning();
    return profile;
  }

  async updateProfile(userId: string, updateProfile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const [profile] = await db.update(profiles).set(updateProfile).where(eq(profiles.userId, userId)).returning();
    return profile || undefined;
  }

  // Company methods
  async getCompany(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || undefined;
  }

  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies).orderBy(desc(companies.createdAt));
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

  async getJobs(filters: { 
    search?: string; 
    location?: string; 
    workStyle?: string; 
    industry?: string;
    companyId?: string;
  } = {}): Promise<Job[]> {
    let query = db.select().from(jobs).where(eq(jobs.status, "active"));

    if (filters.search) {
      query = query.where(ilike(jobs.title, `%${filters.search}%`));
    }
    if (filters.location) {
      query = query.where(ilike(jobs.location, `%${filters.location}%`));
    }
    if (filters.workStyle) {
      query = query.where(eq(jobs.workStyle, filters.workStyle as any));
    }
    if (filters.companyId) {
      query = query.where(eq(jobs.companyId, filters.companyId));
    }

    return await query.orderBy(desc(jobs.createdAt));
  }

  async getJobsByReferrer(referrerId: string): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.referrerId, referrerId)).orderBy(desc(jobs.createdAt));
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }

  async updateJob(id: string, updateJob: Partial<InsertJob>): Promise<Job | undefined> {
    const [job] = await db.update(jobs).set(updateJob).where(eq(jobs.id, id)).returning();
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
    const [application] = await db.insert(applications).values(insertApplication).returning();
    return application;
  }

  async updateApplication(id: string, updateApplication: Partial<InsertApplication>): Promise<Application | undefined> {
    const [application] = await db.update(applications).set(updateApplication).where(eq(applications.id, id)).returning();
    return application || undefined;
  }
}

export const storage = new DatabaseStorage();
