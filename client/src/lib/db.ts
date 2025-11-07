import localforage from "localforage";
import type { JournalEntry, Project } from "@shared/schema";

// Configure localforage
const journalStore = localforage.createInstance({
  name: "learning-journal",
  storeName: "journals",
});

const projectStore = localforage.createInstance({
  name: "learning-journal",
  storeName: "projects",
});

const syncQueue = localforage.createInstance({
  name: "learning-journal",
  storeName: "syncQueue",
});

// Journal Entry operations
export const db = {
  // Journal Entries
  async getAllJournals(): Promise<JournalEntry[]> {
    const keys = await journalStore.keys();
    const journals = await Promise.all(
      keys.map((key) => journalStore.getItem<JournalEntry>(key))
    );
    return journals.filter((j): j is JournalEntry => j !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getJournal(id: string): Promise<JournalEntry | null> {
    return journalStore.getItem<JournalEntry>(id);
  },

  async saveJournal(journal: JournalEntry): Promise<void> {
    await journalStore.setItem(journal.id, journal);
  },

  async deleteJournal(id: string): Promise<void> {
    await journalStore.removeItem(id);
  },

  // Projects
  async getAllProjects(): Promise<Project[]> {
    const keys = await projectStore.keys();
    const projects = await Promise.all(
      keys.map((key) => projectStore.getItem<Project>(key))
    );
    return projects.filter((p): p is Project => p !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getProject(id: string): Promise<Project | null> {
    return projectStore.getItem<Project>(id);
  },

  async saveProject(project: Project): Promise<void> {
    await projectStore.setItem(project.id, project);
  },

  async deleteProject(id: string): Promise<void> {
    await projectStore.removeItem(id);
  },

  // Sync Queue
  async addToSyncQueue(operation: { type: string; data: any }): Promise<void> {
    const timestamp = Date.now().toString();
    await syncQueue.setItem(timestamp, operation);
  },

  async getSyncQueue(): Promise<Array<{ key: string; operation: any }>> {
    const keys = await syncQueue.keys();
    const operations = await Promise.all(
      keys.map(async (key) => ({
        key,
        operation: await syncQueue.getItem(key),
      }))
    );
    return operations.filter((op) => op.operation !== null);
  },

  async clearSyncQueue(): Promise<void> {
    await syncQueue.clear();
  },
};
