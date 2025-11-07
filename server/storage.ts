import { 
  type JournalEntry,
  type InsertJournalEntry,
  type Project,
  type InsertProject,
  type UserProfile,
  type InsertUserProfile,
  journalEntries,
  projects,
  userProfile
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Journal Entry operations
  getAllJournals(): Promise<JournalEntry[]>;
  getJournal(id: string): Promise<JournalEntry | undefined>;
  createJournal(journal: InsertJournalEntry & { id?: string; createdAt?: Date; updatedAt?: Date }): Promise<JournalEntry>;
  updateJournal(id: string, journal: InsertJournalEntry): Promise<JournalEntry | undefined>;
  deleteJournal(id: string): Promise<boolean>;

  // Project operations
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject & { id?: string; createdAt?: Date; updatedAt?: Date }): Promise<Project>;
  updateProject(id: string, project: InsertProject): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // User Profile operations
  getProfile(): Promise<UserProfile | undefined>;
  createOrUpdateProfile(profile: InsertUserProfile): Promise<UserProfile>;
}

export class DbStorage implements IStorage {
  // Journal Entry operations
  async getAllJournals(): Promise<JournalEntry[]> {
    const results = await db
      .select()
      .from(journalEntries)
      .orderBy(desc(journalEntries.date));
    return results;
  }

  async getJournal(id: string): Promise<JournalEntry | undefined> {
    const results = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.id, id))
      .limit(1);
    return results[0];
  }

  async createJournal(insertJournal: InsertJournalEntry & { id?: string; createdAt?: Date; updatedAt?: Date }): Promise<JournalEntry> {
    const id = insertJournal.id || randomUUID();
    const now = new Date();
    
    const journal = {
      id,
      title: insertJournal.title,
      content: insertJournal.content,
      tags: insertJournal.tags || [],
      date: insertJournal.date || now,
      createdAt: insertJournal.createdAt || now,
      updatedAt: insertJournal.updatedAt || now,
    };

    const results = await db
      .insert(journalEntries)
      .values(journal)
      .returning();
    return results[0];
  }

  async updateJournal(id: string, insertJournal: InsertJournalEntry): Promise<JournalEntry | undefined> {
    const results = await db
      .update(journalEntries)
      .set({
        ...insertJournal,
        updatedAt: new Date(),
      })
      .where(eq(journalEntries.id, id))
      .returning();
    return results[0];
  }

  async deleteJournal(id: string): Promise<boolean> {
    const results = await db
      .delete(journalEntries)
      .where(eq(journalEntries.id, id))
      .returning();
    return results.length > 0;
  }

  // Project operations
  async getAllProjects(): Promise<Project[]> {
    const results = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt));
    return results;
  }

  async getProject(id: string): Promise<Project | undefined> {
    const results = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);
    return results[0];
  }

  async createProject(insertProject: InsertProject & { id?: string; createdAt?: Date; updatedAt?: Date }): Promise<Project> {
    const id = insertProject.id || randomUUID();
    const now = new Date();
    
    const project = {
      id,
      name: insertProject.name,
      description: insertProject.description,
      techStack: insertProject.techStack || [],
      createdAt: insertProject.createdAt || now,
      updatedAt: insertProject.updatedAt || now,
    };

    const results = await db
      .insert(projects)
      .values(project)
      .returning();
    return results[0];
  }

  async updateProject(id: string, insertProject: InsertProject): Promise<Project | undefined> {
    const results = await db
      .update(projects)
      .set({
        ...insertProject,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();
    return results[0];
  }

  async deleteProject(id: string): Promise<boolean> {
    const results = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    return results.length > 0;
  }

  // User Profile operations
  async getProfile(): Promise<UserProfile | undefined> {
    const results = await db
      .select()
      .from(userProfile)
      .limit(1);
    return results[0];
  }

  async createOrUpdateProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const existing = await this.getProfile();
    const now = new Date();

    const profile = {
      id: 'profile',
      ...insertProfile,
      updatedAt: now,
    };

    if (existing) {
      const results = await db
        .update(userProfile)
        .set(profile)
        .where(eq(userProfile.id, 'profile'))
        .returning();
      return results[0];
    } else {
      const results = await db
        .insert(userProfile)
        .values(profile)
        .returning();
      return results[0];
    }
  }
}

export const storage = new DbStorage();
