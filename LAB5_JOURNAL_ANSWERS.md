# Lab 5 - Python & JSON Backend Data
## Journal Questions & Answers

**Course**: FGCT6021 Mobile Application Development  
**Student**: Md Jawar Safi (#2315024)  
**Date**: November 2025

---

## Overview

Lab 5 extends the Learning Journal PWA by integrating Python backend processing with JSON file storage. This lab demonstrates how to:
- Create and update JSON files using Python
- Store data persistently in JSON format
- Fetch and display JSON data in a web application
- Implement data export and filtering features

---

## Question 1: How is storing data in a JSON file different from using browser storage?

### Answer

**Browser Storage** (IndexedDB, LocalStorage, SessionStorage):
- **Location**: Stored only in the browser's client-side storage
- **Accessibility**: Only accessible from that specific browser/device
- **Scope**: Isolated per domain/device
- **Persistence**: Persists until user clears browser data or storage quota is exceeded
- **Synchronization**: Requires explicit JavaScript code to sync between browser and server
- **Privacy**: Personal data stays on the user's device
- **Use Cases**: Offline-first apps, caching, temporary form data

**JSON File Storage** (Backend/Server):
- **Location**: Stored on the server/backend filesystem
- **Accessibility**: Can be accessed from any client via HTTP requests
- **Scope**: Centralized data for multiple users/devices
- **Persistence**: Persists until explicitly deleted from the server
- **Synchronization**: Frontend fetches data via API calls; backend manages updates
- **Privacy**: Requires security measures to protect sensitive data
- **Use Cases**: Centralized data management, multi-user applications, data analytics

### Key Differences Table

| Feature | Browser Storage | JSON File (Server) |
|---------|-----------------|-------------------|
| Location | Client (Browser) | Server (Backend) |
| Access | Single device | Multiple devices |
| Data Sharing | No sharing | Can be shared/exported |
| Processing | JavaScript only | Python, Node.js, etc. |
| Backup | Manual export needed | Handled by server |
| Scaling | Limited by browser | Can scale to millions |

**Why This Matters**: Browser storage is perfect for offline apps. JSON file storage is better for apps that need to share data across devices or analyze data server-side.

---

## Question 2: How did you use Python to create or update your JSON file?

### Answer

The Python script (`save_entry.py`) implements a complete workflow for managing JSON reflections:

#### Step 1: Load Existing Data
```python
def load_reflections():
    if os.path.exists(JSON_FILE):
        try:
            with open(JSON_FILE, 'r') as file:
                return json.load(file)
        except json.JSONDecodeError:
            return []
    return []
```
- Reads `reflections.json` from the backend folder
- Handles missing files and corrupted JSON gracefully
- Returns empty list if file doesn't exist

#### Step 2: Get User Input
```python
text = input("\nEnter your reflection: ").strip()
category_input = input("Select category (1-5) [default=1]: ").strip() or "1"
```
- Prompts user to enter reflection text
- Asks for category selection (general, learning, project, challenge, success)
- Uses sensible defaults if user skips input

#### Step 3: Create Entry with Metadata
```python
new_entry = {
    "id": len(reflections) + 1,
    "text": text,
    "category": category,
    "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "timestamp": datetime.now().isoformat()
}
```
- Generates unique ID based on list length
- Captures both human-readable date and ISO timestamp
- Includes category for organization

#### Step 4: Save Updated Data
```python
def save_reflections(reflections):
    with open(JSON_FILE, 'w') as file:
        json.dump(reflections, file, indent=2)
```
- Appends new entry to existing list
- Writes entire updated list back to JSON file
- Uses `indent=2` for readable formatting

#### Complete Workflow
```
User Input → Load JSON → Create Entry → Append to List → Save JSON → Confirmation
```

**Key Concepts Demonstrated**:
- File I/O (reading and writing)
- JSON serialization/deserialization
- Data validation and error handling
- Timestamp generation
- List manipulation in Python

---

## Question 3: What does your PWA show locally, and what will users see on GitHub? Are they the same? Why or why not?

### Answer

### What Users See Locally (in your PWA)

When you run the Learning Journal app locally:
- **Dynamic Content**: All reflections you've added using `save_entry.py`
- **Live Interaction**: Add new reflections, export data, refresh in real-time
- **Up-to-Date Data**: `reflections.json` contains your current reflections
- **Full Functionality**: Python script works, JSON updates, frontend fetches and displays everything
- **Personal Data**: Your actual reflections and learning insights

### What Users See on GitHub

When they view your repository on GitHub:
- **Source Code Only**: All Python scripts, frontend components, CSS visible
- **Static JSON**: `reflections.json` shows whatever was committed (likely empty `[]` or sample data)
- **No Execution**: GitHub shows files, not a running application
- **Read-Only View**: Cannot interact with the app (no add/refresh/export functions working)
- **No Personal Data**: Your local reflections are not uploaded

### Are They the Same?

**NO, they are fundamentally different** for these reasons:

| Aspect | Local PWA | GitHub |
|--------|-----------|--------|
| **Interactivity** | Fully functional | Read-only code view |
| **Data** | Current user reflections | Initial/sample data |
| **Execution** | App runs and responds | Static file display |
| **Python Script** | Actively runs via CLI | Shows source code only |
| **JSON File** | Updates in real-time | Snapshot at commit time |
| **User Experience** | Full features available | Can view code and architecture |

### Why the Difference?

1. **Privacy**: Personal reflections stay local; only code goes to GitHub
2. **Architecture**: GitHub is for version control of source code, not data
3. **Execution Environment**: Python runs locally; GitHub is a static repository
4. **Security**: Sensitive data (reflections) isn't exposed publicly
5. **Deployment**: To make app live, you'd deploy to Vercel/Netlify/Render with database backend

### Best Practices

- ✓ Commit: Code, configuration, documentation
- ✓ Commit: Empty or sample JSON file showing structure
- ✗ Don't Commit: User data, personal reflections, environment variables
- ✗ Don't Commit: `.env` files with secrets

---

## Question 4: What extra feature did you add to your PWA using the JSON file, and why?

### Answer

I implemented **FIVE extra features** beyond basic JSON display:

### 1. Reflection Counter
**Feature**: Displays total number of reflections added

**Why**: 
- Provides motivational feedback on progress
- Shows learning consistency at a glance
- Encourages users to maintain habit
- Simple but powerful metric for tracking

**Implementation**: 
- Counts array length from JSON
- Updates whenever data refreshes
- Displayed prominently on the dashboard

### 2. Export to JSON
**Feature**: Download `reflections.json` directly from browser

**Why**:
- **Data Portability**: Users own their data and can backup
- **Interoperability**: Can import into other tools
- **Analysis**: Developers can process data offline
- **Archive**: Create permanent records of learning journey

**Use Cases**:
- Back up reflections before clearing cache
- Import into Google Sheets for analysis
- Share data with mentors/teachers
- Long-term archiving of learning records

### 3. Export to CSV
**Feature**: Convert JSON reflections to CSV spreadsheet format

**Why**:
- **Universal Format**: Opens in Excel, Sheets, Numbers, etc.
- **Data Analysis**: Enables filtering, sorting, pivot tables
- **Visualization**: Create charts and graphs of reflections
- **Accessibility**: Non-technical users can work with data

**Example Output**:
```
ID,Date,Category,Text
1,2025-11-25 15:30:45,learning,Learned about async/await in JavaScript
2,2025-11-25 16:15:22,project,Built PWA components with Radix UI
```

### 4. Category Organization
**Feature**: Organize reflections into 5 categories

**Categories**:
- **general**: Everyday learning notes
- **learning**: Specific skills or concepts learned
- **project**: Work related to specific projects
- **challenge**: Difficulties overcome
- **success**: Achievements and wins

**Why**:
- Better organization than flat list
- Filter by topic (future enhancement)
- Understand learning patterns
- Track different types of growth

### 5. Refresh Button
**Feature**: Reload data from `reflections.json` without page refresh

**Why**:
- **Real-Time Sync**: See changes made via Python script immediately
- **Multiple Devices**: Sync between CLI and web interface
- **No Page Reload**: Smooth UX without full refresh
- **Offline Support**: Works even without network by fetching local cache

**Workflow**:
1. User runs `save_entry.py` and adds reflection via CLI
2. Clicks Refresh button in PWA
3. New reflection appears instantly

---

## Technical Implementation

### Frontend Integration
```typescript
// Fetch JSON data
const response = await fetch("/backend/reflections.json");
const data = await response.json();

// Display dynamically
reflections.map(r => (
  <div key={r.id}>
    <p>{r.date} - {r.category}</p>
    <p>{r.text}</p>
  </div>
))

// Export to CSV
const csv = reflections.map(r => 
  [r.id, r.date, r.category, r.text].join(",")
)
```

### Key Technologies
- **Fetch API**: Asynchronous data loading
- **React Hooks**: State management for reflections
- **React Query**: Efficient data fetching and caching
- **TypeScript**: Type-safe data structures
- **Tailwind CSS**: Modern UI styling

---

## Learning Outcomes

By completing Lab 5, I demonstrated understanding of:

✓ **Backend Development**: Python file I/O and JSON manipulation  
✓ **Frontend-Backend Communication**: Fetch API and HTTP requests  
✓ **Full-Stack Integration**: Coordinating Python backend with React frontend  
✓ **Data Persistence**: Comparing browser storage vs file-based storage  
✓ **User Experience**: Export features and refresh functionality  
✓ **Software Architecture**: Separation of concerns (backend/frontend)  
✓ **Data Formats**: JSON structure and CSV conversion  

---

## Conclusion

Lab 5 successfully integrated Python backend processing with JSON file storage into a modern PWA. The implementation demonstrates how professional web applications manage data across frontend and backend layers. The extra features (counter, exports, categories, refresh) show practical enhancements that add real value for users while reinforcing core concepts of data interoperability and user-centered design.

The key insight: **Data is the most important part of any application.** Whether stored in browser, JSON files, or databases, how we manage, retrieve, and present data determines the user experience and application scalability.
