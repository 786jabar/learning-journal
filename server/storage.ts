import { 
  type JournalEntry,
  type InsertJournalEntry,
  type Project,
  type InsertProject,
  type UserProfile,
  type InsertUserProfile,
  type User,
  type UpsertUser,
  journalEntries,
  projects,
  userProfile,
  users
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations for authentication
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Journal Entry operations
  getAllJournals(userId: string): Promise<JournalEntry[]>;
  getJournal(id: string, userId: string): Promise<JournalEntry | undefined>;
  createJournal(journal: InsertJournalEntry & { id?: string; createdAt?: Date; updatedAt?: Date }, userId: string): Promise<JournalEntry>;
  updateJournal(id: string, journal: InsertJournalEntry, userId: string): Promise<JournalEntry | undefined>;
  deleteJournal(id: string, userId: string): Promise<boolean>;

  // Project operations
  getAllProjects(userId: string): Promise<Project[]>;
  getProject(id: string, userId: string): Promise<Project | undefined>;
  createProject(project: InsertProject & { id?: string; createdAt?: Date; updatedAt?: Date }, userId: string): Promise<Project>;
  updateProject(id: string, project: InsertProject, userId: string): Promise<Project | undefined>;
  deleteProject(id: string, userId: string): Promise<boolean>;

  // User Profile operations
  getProfile(userId: string): Promise<UserProfile | undefined>;
  createOrUpdateProfile(profile: InsertUserProfile, userId: string): Promise<UserProfile>;
}

export class DbStorage implements IStorage {
  // User operations for authentication
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Two-step migration for legacy users with same email but different ID
    return await db.transaction(async (tx) => {
      // Step 1: Look up existing user by email
      const [existingUser] = await tx
        .select()
        .from(users)
        .where(eq(users.email, userData.email!));

      if (existingUser && existingUser.id !== userData.id) {
        // Step 2: Migrate legacy user - update ID (cascades to all child records)
        console.log(`Migrating user ${existingUser.id} to ${userData.id} for email ${userData.email}`);
        
        await tx
          .update(users)
          .set({
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.email, userData.email!));

        const [updatedUser] = await tx
          .select()
          .from(users)
          .where(eq(users.id, userData.id!));
        
        return updatedUser;
      }

      // Step 3: Insert or update normally if no migration needed
      const [user] = await tx
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      
      return user;
    });
  }

  // Journal Entry operations
  async getAllJournals(userId: string): Promise<JournalEntry[]> {
    const results = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.date));
    return results;
  }

  async getJournal(id: string, userId: string): Promise<JournalEntry | undefined> {
    const results = await db
      .select()
      .from(journalEntries)
      .where(sql`${journalEntries.id} = ${id} AND ${journalEntries.userId} = ${userId}`)
      .limit(1);
    return results[0];
  }

  async createJournal(insertJournal: InsertJournalEntry & { id?: string; createdAt?: Date; updatedAt?: Date }, userId: string): Promise<JournalEntry> {
    const id = insertJournal.id || randomUUID();
    const now = new Date();
    
    const journal = {
      id,
      userId,
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

  async updateJournal(id: string, insertJournal: InsertJournalEntry, userId: string): Promise<JournalEntry | undefined> {
    const results = await db
      .update(journalEntries)
      .set({
        ...insertJournal,
        updatedAt: new Date(),
      })
      .where(sql`${journalEntries.id} = ${id} AND ${journalEntries.userId} = ${userId}`)
      .returning();
    return results[0];
  }

  async deleteJournal(id: string, userId: string): Promise<boolean> {
    const results = await db
      .delete(journalEntries)
      .where(sql`${journalEntries.id} = ${id} AND ${journalEntries.userId} = ${userId}`)
      .returning();
    return results.length > 0;
  }

  // Project operations
  async getAllProjects(userId: string): Promise<Project[]> {
    const results = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt));
    return results;
  }

  async getProject(id: string, userId: string): Promise<Project | undefined> {
    const results = await db
      .select()
      .from(projects)
      .where(sql`${projects.id} = ${id} AND ${projects.userId} = ${userId}`)
      .limit(1);
    return results[0];
  }

  async createProject(insertProject: InsertProject & { id?: string; createdAt?: Date; updatedAt?: Date }, userId: string): Promise<Project> {
    const id = insertProject.id || randomUUID();
    const now = new Date();
    
    const project = {
      id,
      userId,
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

  async updateProject(id: string, insertProject: InsertProject, userId: string): Promise<Project | undefined> {
    const results = await db
      .update(projects)
      .set({
        ...insertProject,
        updatedAt: new Date(),
      })
      .where(sql`${projects.id} = ${id} AND ${projects.userId} = ${userId}`)
      .returning();
    return results[0];
  }

  async deleteProject(id: string, userId: string): Promise<boolean> {
    const results = await db
      .delete(projects)
      .where(sql`${projects.id} = ${id} AND ${projects.userId} = ${userId}`)
      .returning();
    return results.length > 0;
  }

  // User Profile operations
  async getProfile(userId: string): Promise<UserProfile | undefined> {
    const results = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);
    return results[0];
  }

  async createOrUpdateProfile(insertProfile: InsertUserProfile, userId: string): Promise<UserProfile> {
    const existing = await this.getProfile(userId);
    const now = new Date();

    const profile = {
      id: randomUUID(),
      userId,
      ...insertProfile,
      updatedAt: now,
    };

    if (existing) {
      const results = await db
        .update(userProfile)
        .set({
          ...insertProfile,
          updatedAt: now,
        })
        .where(eq(userProfile.userId, userId))
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
