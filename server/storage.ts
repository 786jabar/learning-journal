import { 
  type User, 
  type InsertUser,
  type JournalEntry,
  type InsertJournalEntry,
  type Project,
  type InsertProject
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations (existing)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Journal Entry operations
  getAllJournals(): Promise<JournalEntry[]>;
  getJournal(id: string): Promise<JournalEntry | undefined>;
  createJournal(journal: InsertJournalEntry): Promise<JournalEntry>;
  updateJournal(id: string, journal: InsertJournalEntry): Promise<JournalEntry | undefined>;
  deleteJournal(id: string): Promise<boolean>;

  // Project operations
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: InsertProject): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private journals: Map<string, JournalEntry>;
  private projects: Map<string, Project>;

  constructor() {
    this.users = new Map();
    this.journals = new Map();
    this.projects = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Journal Entry operations
  async getAllJournals(): Promise<JournalEntry[]> {
    return Array.from(this.journals.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getJournal(id: string): Promise<JournalEntry | undefined> {
    return this.journals.get(id);
  }

  async createJournal(insertJournal: InsertJournalEntry & { id?: string; createdAt?: Date; updatedAt?: Date }): Promise<JournalEntry> {
    const id = insertJournal.id || randomUUID();
    const now = new Date();
    const journal: JournalEntry = {
      ...insertJournal,
      id,
      date: insertJournal.date || now,
      createdAt: insertJournal.createdAt || now,
      updatedAt: insertJournal.updatedAt || now,
    };
    this.journals.set(id, journal);
    return journal;
  }

  async updateJournal(id: string, insertJournal: InsertJournalEntry): Promise<JournalEntry | undefined> {
    const existing = this.journals.get(id);
    if (!existing) return undefined;

    const updated: JournalEntry = {
      ...existing,
      ...insertJournal,
      id: existing.id,
      date: insertJournal.date || existing.date,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    };
    this.journals.set(id, updated);
    return updated;
  }

  async deleteJournal(id: string): Promise<boolean> {
    return this.journals.delete(id);
  }

  // Project operations
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject & { id?: string; createdAt?: Date; updatedAt?: Date }): Promise<Project> {
    const id = insertProject.id || randomUUID();
    const now = new Date();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: insertProject.createdAt || now,
      updatedAt: insertProject.updatedAt || now,
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, insertProject: InsertProject): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;

    const updated: Project = {
      ...existing,
      ...insertProject,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }
}

export const storage = new MemStorage();
