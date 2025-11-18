// Lab 4: Storage API Demonstrations
// Student: Md Jawar Safi (#2315024)
// This file demonstrates localStorage, sessionStorage, and IndexedDB

console.log("[STORAGE] Storage API Module Loaded");

// ===== 1. LOCAL STORAGE =====
export const LocalStorageDemo = {
  // Generic save method for HTML compatibility
  saveItem: async function(key, value) {
    try {
      localStorage.setItem(`lab4-${key}`, value);
      console.log(`[OK] '${key}' saved to localStorage: ${value}`);
      return { success: true, message: 'Saved successfully' };
    } catch (error) {
      console.error('[ERROR] LocalStorage save failed:', error);
      return { success: false, message: error.message };
    }
  },
  
  // Generic get method for HTML compatibility
  getItem: async function(key) {
    try {
      const value = localStorage.getItem(`lab4-${key}`);
      console.log(`[READ] Retrieved '${key}':`, value);
      return { success: true, data: value };
    } catch (error) {
      console.error('[ERROR] LocalStorage get failed:', error);
      return { success: false, message: error.message };
    }
  },
  
  // Save theme preference
  saveTheme: function(theme) {
    localStorage.setItem('lab4-theme', theme);
    console.log(`[OK] Theme '${theme}' saved to localStorage`);
  },
  
  // Get theme preference
  getTheme: function() {
    const theme = localStorage.getItem('lab4-theme') || 'light';
    console.log(`[READ] Retrieved theme: ${theme}`);
    return theme;
  },
  
  // Save user preferences
  savePreferences: function(prefs) {
    localStorage.setItem('lab4-preferences', JSON.stringify(prefs));
    console.log('[OK] Preferences saved:', prefs);
  },
  
  // Get user preferences
  getPreferences: function() {
    const prefs = localStorage.getItem('lab4-preferences');
    return prefs ? JSON.parse(prefs) : null;
  },
  
  // Clear all lab4 data
  clear: function() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('lab4-')) {
        localStorage.removeItem(key);
      }
    });
    console.log('[CLEAN] Lab 4 localStorage cleared');
  }
};

// ===== 2. SESSION STORAGE =====
export const SessionStorageDemo = {
  // Generic save method for HTML compatibility
  saveItem: async function(key, value) {
    try {
      sessionStorage.setItem(`lab4-${key}`, value);
      console.log(`[OK] Session data '${key}' saved`);
      return { success: true, message: 'Saved successfully' };
    } catch (error) {
      console.error('[ERROR] SessionStorage save failed:', error);
      return { success: false, message: error.message };
    }
  },
  
  // Generic get method for HTML compatibility
  getItem: async function(key) {
    try {
      const value = sessionStorage.getItem(`lab4-${key}`);
      console.log(`[READ] Retrieved session '${key}':`, value);
      return { success: true, data: value };
    } catch (error) {
      console.error('[ERROR] SessionStorage get failed:', error);
      return { success: false, message: error.message };
    }
  },
  
  // Save temporary session data
  saveSessionData: function(key, value) {
    sessionStorage.setItem(`lab4-${key}`, JSON.stringify(value));
    console.log(`[OK] Session data saved: ${key}`);
  },
  
  // Get session data
  getSessionData: function(key) {
    const data = sessionStorage.getItem(`lab4-${key}`);
    return data ? JSON.parse(data) : null;
  },
  
  // Clear session
  clearSession: function() {
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('lab4-')) {
        sessionStorage.removeItem(key);
      }
    });
    console.log('[CLEAN] Lab 4 sessionStorage cleared');
  }
};

// ===== 3. INDEXEDDB =====
export const IndexedDBDemo = {
  dbName: 'Lab4Database',
  version: 1,
  db: null,
  
  // Initialize IndexedDB
  init: function() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => {
        console.error('[ERROR] IndexedDB failed to open');
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('[OK] IndexedDB opened successfully');
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('notes')) {
          const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
          notesStore.createIndex('createdAt', 'createdAt', { unique: false });
          console.log('[OK] Created "notes" object store');
        }
        
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
          console.log('[OK] Created "images" object store');
        }
      };
    });
  },
  
  // Save a note (for HTML compatibility)
  saveNote: async function(note) {
    try {
      const transaction = this.db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      
      const request = store.put(note);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log('[OK] Note saved to IndexedDB:', note);
          resolve({ success: true, data: note });
        };
        
        request.onerror = () => {
          console.error('[ERROR] Failed to save note');
          reject({ success: false, message: request.error.message });
        };
      });
    } catch (error) {
      console.error('[ERROR] IndexedDB save failed:', error);
      return { success: false, message: error.message };
    }
  },
  
  // Get all notes (for HTML compatibility)
  getAllNotes: async function() {
    try {
      const transaction = this.db.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`[READ] Retrieved ${request.result.length} notes from IndexedDB`);
          resolve({ success: true, data: request.result });
        };
        
        request.onerror = () => {
          console.error('[ERROR] Failed to get notes');
          reject({ success: false, message: request.error.message });
        };
      });
    } catch (error) {
      console.error('[ERROR] IndexedDB get failed:', error);
      return { success: false, message: error.message };
    }
  },
  
  // Add a note (original method)
  addNote: function(noteText) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      
      const note = {
        text: noteText,
        date: new Date().toISOString()
      };
      
      const request = store.add(note);
      
      request.onsuccess = () => {
        console.log('[OK] Note added to IndexedDB');
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('[ERROR] Failed to add note');
        reject(request.error);
      };
    });
  },
  
  // Delete a note
  deleteNote: function(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const request = store.delete(id);
      
      request.onsuccess = () => {
        console.log(`[OK] Note ${id} deleted from IndexedDB`);
        resolve();
      };
      
      request.onerror = () => {
        console.error('[ERROR] Failed to delete note');
        reject(request.error);
      };
    });
  }
};
