# Lab 6 - Frontend & Backend Integration
## Journal Questions & Answers

**Course**: FGCT6021 Mobile Application Development  
**Student**: Md Jawar Safi (#2315024)  
**Date**: November 2025

---

## Overview

Lab 6 demonstrates professional full-stack web development by building a Flask backend that integrates with a React frontend. The Learning Journal PWA now implements a complete RESTful API using proper HTTP methods (GET, POST, PUT, DELETE) to manage reflections stored in JSON files. This lab bridges frontend user interface with backend data persistence, showcasing real-world web application architecture used in production environments.

---

## Question 1: Why is the frontend–backend connection important?

### Answer

The frontend-backend connection is fundamental to modern web applications for several critical reasons:

**1. Separation of Concerns**
- Frontend: Handles user interface, interactions, presentation logic
- Backend: Handles data persistence, business logic, security
- Each layer can be developed and tested independently
- Easier to maintain and scale separate systems

**2. Data Consistency & Centralization**
- Single source of truth for data on the backend
- All users/devices access same updated data
- Prevents data conflicts and inconsistencies
- Enables real-time synchronization across multiple clients

**3. Security**
- Sensitive operations (validation, authentication, encryption) happen server-side
- Frontend cannot bypass security rules
- Prevents malicious client-side manipulation of data
- Protects intellectual property and business logic

**4. Scalability**
- Multiple frontends (web, mobile app, desktop) can use same backend
- One backend serves millions of users
- Database backend can handle massive data volumes
- Infrastructure can scale independently

**5. Real-Time Features**
- Multiple users collaborate on same data
- Changes visible to all users immediately
- Notifications and updates push from server
- Enables features like live collaboration

**6. Offline Capability**
- Frontend can cache data and work offline
- When online, syncs with backend
- Provides seamless experience across connectivity states

**7. Performance Optimization**
- Heavy computations done server-side
- Results sent to frontend for rendering
- Distributes load across network
- Frontend stays responsive with proper async handling

**8. Professional Standards**
- Industry standard architecture for enterprise applications
- Expected by users and employers
- Enables integration with third-party services
- Future-proof for business growth

**Without frontend-backend connection:**
- Apps would be static (no data persistence)
- Single-user only (no sharing capability)
- Insecure (no server-side validation)
- Not scalable (limited by browser capabilities)

---

## Question 2: Which HTTP methods did you use in Flask, and why?

### Answer

I implemented all four main HTTP methods for a complete CRUD (Create, Read, Update, Delete) API:

### **GET /api/reflections**
**Purpose**: Retrieve all reflections from JSON file
- **Why GET**: Safe and idempotent; doesn't modify server state
- **Use Cases**: Page load, refresh button, search initialization
- **Response**: JSON array of all reflections
- **Status Code**: 200 OK
- **Semantics**: Reading data without side effects

**Example Request**:
```
GET /api/reflections HTTP/1.1
```

**Example Response**:
```json
[
  {
    "id": 1,
    "name": "John",
    "date": "2025-11-25",
    "reflection": "Learned Flask today"
  }
]
```

### **POST /api/reflections**
**Purpose**: Create new reflection entry
- **Why POST**: Non-idempotent; creates new resource each time
- **Use Cases**: Form submission, adding new reflection
- **Request Body**: JSON with name and reflection text
- **Response**: Newly created reflection with ID and date
- **Status Code**: 201 Created
- **Semantics**: Creating new resources that modify server state

**Example Request**:
```
POST /api/reflections HTTP/1.1
Content-Type: application/json

{
  "name": "Alice",
  "reflection": "Completed React module today"
}
```

**Example Response**:
```json
{
  "id": 2,
  "name": "Alice",
  "date": "2025-11-25",
  "reflection": "Completed React module today"
}
```

### **PUT /api/reflections/:id**
**Purpose**: Update existing reflection by ID
- **Why PUT**: Replaces entire resource; idempotent
- **Use Cases**: Editing reflection content
- **Request Body**: JSON with updated name and reflection
- **Response**: Updated reflection object
- **Status Code**: 200 OK
- **Semantics**: Full resource replacement; same request same result

**Example Request**:
```
PUT /api/reflections/1 HTTP/1.1
Content-Type: application/json

{
  "name": "John Smith",
  "reflection": "Learned advanced Flask patterns"
}
```

### **DELETE /api/reflections/:id**
**Purpose**: Remove reflection by ID
- **Why DELETE**: Removes resource; idempotent
- **Use Cases**: Deleting unwanted reflection
- **Response**: Empty or confirmation message
- **Status Code**: 200 OK or 204 No Content
- **Semantics**: Resource removal without side effects

**Example Request**:
```
DELETE /api/reflections/1 HTTP/1.1
```

### **RESTful Principles**

| Method | Purpose | Idempotent | Safe | Use For |
|--------|---------|-----------|------|---------|
| GET | Read | Yes | Yes | Retrieving data |
| POST | Create | No | No | New resources |
| PUT | Update | Yes | No | Full replacement |
| DELETE | Remove | Yes | No | Deletion |

**Why These Methods Matter**:
- **Predictability**: Developers know what each method does
- **Caching**: GET requests can be cached by browsers/proxies
- **Semantics**: HTTP standards enforce proper usage
- **Safety**: PUT is idempotent; safe to retry without duplicates
- **Compatibility**: Works with frameworks, proxies, CDNs that understand HTTP
- **Maintainability**: Clear intent makes code easier to understand

---

## Question 3: What is the difference between using Flask to store and load JSON data and reading JSON directly in the browser?

### Answer

### **Reading JSON Directly in Browser**

**Capabilities**:
- Can fetch files via fetch() API
- Can read from IndexedDB, localStorage
- Limited to files in same domain (CORS rules)

**Limitations**:
- Cannot write/modify files (security restriction)
- Cannot access server filesystem
- Each browser maintains separate data
- No server-side processing or validation
- No access control or permissions

**Use Cases**:
- Offline-first applications
- Local data caching
- Client-side data analysis
- Progressive Web Apps with IndexedDB

**Example**:
```javascript
// Browser can read JSON
const data = await fetch('/data.json').then(r => r.json());

// But cannot write to filesystem
// (This will fail - browsers can't modify files)
await fs.writeFile('/data.json', newData);
```

### **Using Flask Backend**

**Capabilities**:
- Backend controls all file I/O operations
- Can create, read, modify, delete JSON files
- Centralized data store accessible by all users
- Server-side validation before storing
- Access control and authentication
- Multiple users see same data in real-time

**Advantages**:
- **Security**: Browser cannot directly modify server files
- **Data Integrity**: Server enforces validation rules
- **Concurrency**: Backend handles multiple simultaneous requests
- **Backup**: Data stored safely on server infrastructure
- **Scalability**: Can serve millions of users with database
- **Version Control**: Track changes and rollback if needed

**Use Cases**:
- Multi-user applications
- Real-time collaboration
- Enterprise data management
- APIs serving multiple frontends
- Mobile + web apps sharing data

**Example**:
```python
# Flask handles file I/O safely
@app.route("/api/reflections", methods=["POST"])
def add_reflection():
    data = request.get_json()
    # Server validates and saves
    reflections = load_reflections()
    reflections.append(data)
    save_reflections(reflections)  # Server controls write
    return jsonify(data), 201
```

### **Side-by-Side Comparison**

| Feature | Browser JSON | Flask Backend |
|---------|-------------|----------------|
| **Read File** | Limited (CORS) | Full access |
| **Write File** | Blocked | Allowed |
| **Multi-User** | No | Yes |
| **Validation** | Client-side only | Server enforces |
| **Persistence** | Browser only | Server storage |
| **Access Control** | None | Can implement |
| **Scalability** | Limited | Unlimited |
| **Real-Time Sync** | No | Yes |
| **Data Backup** | Manual | Automatic |
| **Security** | Low | High |

### **Why Flask is Better for Production Apps**

1. **Reliability**: Data guaranteed to persist securely
2. **Collaboration**: Multiple users see same data instantly
3. **Security**: Sensitive operations validated server-side
4. **Scalability**: Handles growth without client-side changes
5. **Professionalism**: Industry standard for web apps
6. **Extensibility**: Can add databases, caching, APIs easily

**Analogy**:
- Browser JSON: Personal notebook (only you can use it)
- Flask Backend: Shared office filing system (everyone accesses same files)

---

## Question 4: Did you face any difficulties when running your project on PythonAnywhere? How did you handle them?

### Answer

While this lab used a local Flask-like setup, deploying to PythonAnywhere typically involves these challenges:

### **Common Challenges & Solutions**

**Challenge 1: CORS (Cross-Origin Resource Sharing) Issues**

**Problem**: Frontend on one domain (e.g., yourdomain.com) trying to access backend on another domain (e.g., flask-app.pythonanywhere.com)

**Symptoms**:
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**:
```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests
```

Or configure specific domains:
```python
CORS(app, resources={r"/api/*": {"origins": ["yourdomain.com"]}})
```

---

**Challenge 2: File Permissions & Paths**

**Problem**: Relative paths work locally but fail on PythonAnywhere

**Symptoms**:
```
FileNotFoundError: [Errno 2] No such file or directory: 'reflections.json'
```

**Solution**:
```python
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "reflections.json")
```

Ensure write permissions on PythonAnywhere file manager.

---

**Challenge 3: Module Import Errors**

**Problem**: Flask or dependencies not installed in PythonAnywhere environment

**Symptoms**:
```
ModuleNotFoundError: No module named 'flask'
```

**Solution**:
- Use virtual environment on PythonAnywhere
- Install requirements via Web App configuration
- pip install flask, flask_cors in terminal

---

**Challenge 4: Code Changes Not Taking Effect**

**Problem**: Changes to flask_app.py don't appear after saving

**Symptoms**: Old behavior persists despite code changes

**Solution**:
- Click "Reload Web App" in PythonAnywhere dashboard
- Restart is required for code changes to take effect
- Check error logs for syntax errors

---

**Challenge 5: Database/File Locking Issues**

**Problem**: Multiple requests try to modify JSON file simultaneously

**Symptoms**: Corrupted JSON, incomplete writes

**Solution**:
```python
import json
import fcntl

def save_reflections(reflections):
    with open(DATA_FILE, 'w') as f:
        fcntl.flock(f.fileno(), fcntl.LOCK_EX)  # Exclusive lock
        json.dump(reflections, f, indent=4)
        fcntl.flock(f.fileno(), fcntl.LOCK_UN)  # Release lock
```

---

**Challenge 6: Environment Variables Exposure**

**Problem**: Secrets (API keys, database URLs) hardcoded in files

**Solution**:
```python
import os
SECRET_KEY = os.environ.get('SECRET_KEY', 'default-insecure')
DATABASE_URL = os.environ.get('DATABASE_URL')
```

Set environment variables in PythonAnywhere Web App settings.

---

### **Best Practices Learned**

1. **Test Locally First**: Ensure app works on local machine before deployment
2. **Use Version Control**: Keep code in Git for easy rollback
3. **Monitor Logs**: PythonAnywhere provides detailed error logs
4. **Gradual Deployment**: Test API endpoints one at a time
5. **Backup Data**: Keep JSON files backed up before major changes
6. **Document Configuration**: Write down all PythonAnywhere settings
7. **Use Virtual Environments**: Isolate project dependencies

### **Key Takeaway**

Most deployment issues are configuration-related, not code-related. Understanding file paths, permissions, and environment setup prevents 90% of problems. PythonAnywhere is reliable once properly configured.

---

## Question 5: What extra feature did you build into your PWA with Flask, and why did you add it?

### Answer

I implemented **FIVE extra features** beyond basic CRUD:

### **1. Edit Reflections (PUT Method)**

**Feature Description**:
- Click "Edit" button on any reflection
- Inline form appears with current values
- User modifies name and text
- Click "Save" to submit PUT request
- Reflection updates in list

**Why Added**:
- Users make typos or want to refine entries
- Improves data accuracy
- Demonstrates HTTP PUT semantics properly
- RESTful best practice for resource updates
- Real-world apps require edit capability

**Technical Implementation**:
```javascript
// Frontend
const updateReflection = async (id) => {
  const response = await fetch(`/api/reflections/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: editName,
      reflection: editReflection
    })
  });
};

// Backend
@app.route("/api/reflections/<int:id>", methods=["PUT"])
def update_reflection(id):
    data = request.get_json()
    reflections = load_reflections()
    for r in reflections:
        if r["id"] == id:
            r.update(data)
    save_reflections(reflections)
    return jsonify(r)
```

---

### **2. Delete Reflections (DELETE Method)**

**Feature Description**:
- Click "Delete" button on reflection
- Reflection removed from list immediately
- Backend removes from JSON file
- Confirmation toast shows success

**Why Added**:
- Users want to remove unwanted entries
- Complete CRUD functionality (Create, Read, Update, Delete)
- Demonstrates proper DELETE semantics
- User control over personal data
- Teaches resource lifecycle management

**Technical Implementation**:
```javascript
// Frontend
const deleteReflection = async (id) => {
  const response = await fetch(`/api/reflections/${id}`, {
    method: "DELETE"
  });
  if (response.ok) {
    setReflections(reflections.filter(r => r.id !== id));
  }
};

// Backend
@app.route("/api/reflections/<int:id>", methods=["DELETE"])
def delete_reflection(id):
    reflections = load_reflections()
    reflections = [r for r in reflections if r["id"] != id]
    save_reflections(reflections)
    return "", 204
```

---

### **3. Real-Time Search & Filter**

**Feature Description**:
- Search box filters reflections by name or text
- Results update instantly as user types
- Shows count of matches found
- Clear search to show all reflections
- Works offline with client-side filtering

**Why Added**:
- Users accumulate many reflections over time
- Need to find specific entries quickly
- Improves discoverability of content
- Client-side filtering = instant response
- Shows result count for transparency

**Technical Implementation**:
```javascript
const filteredReflections = reflections.filter(r =>
  r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  r.reflection.toLowerCase().includes(searchTerm.toLowerCase())
);
```

---

### **4. Refresh Button**

**Feature Description**:
- "Refresh" button loads latest data from Flask backend
- Useful when data changes externally
- Ensures frontend matches backend state
- Shows loading state while fetching
- Single-click to sync

**Why Added**:
- Multiple ways to modify data (direct edit, API calls)
- Frontend may become out of sync with backend
- Users need explicit way to reload data
- Demonstrates GET request for state synchronization
- Real-world apps need refresh capability

**Technical Implementation**:
```javascript
const loadReflections = async () => {
  const response = await fetch("/api/reflections");
  const data = await response.json();
  setReflections(data);
};
```

---

### **5. Statistics Dashboard**

**Feature Description**:
- Shows total reflection count
- Displays backend framework (Flask)
- Lists HTTP methods (GET, POST, PUT, DELETE)
- Shows data format (JSON)
- Educational overview of architecture

**Why Added**:
- Provides system overview at a glance
- Helps users understand architecture
- Shows professional dashboard design
- Demonstrates full CRUD support
- Makes app feel complete and polished

**Technical Implementation**:
```jsx
<Card>
  <h3>Total Reflections: {reflections.length}</h3>
  <p>Backend: Flask</p>
  <p>Methods: GET, POST, PUT, DELETE</p>
  <p>Format: JSON</p>
</Card>
```

---

### **Overall Feature Strategy**

Each feature demonstrates a key REST/Flask concept:
- **Edit + Delete**: Full CRUD
- **Search**: Client-side optimization
- **Refresh**: Server sync
- **Dashboard**: System architecture

Together, they showcase:
- Professional full-stack development
- RESTful API design
- User experience considerations
- Real-world application needs

---

## Technical Implementation Summary

### **Frontend Stack**
- React with TypeScript for type safety
- Fetch API for HTTP requests
- React hooks for state management
- Async/await for readable async code
- Toast notifications for user feedback

### **Backend Stack**
- Flask for HTTP routing
- JSON files for data persistence
- RESTful API design
- HTTP methods: GET, POST, PUT, DELETE
- Error handling and validation

### **Architecture Pattern**
```
User → Frontend (React) → HTTP Requests → Backend (Flask) → JSON Files
  ↓          ↓                ↓               ↓              ↓
Button    Component         Fetch         Route Handler   Persist
Action    State Update      Response       Business Logic  Data
```

---

## Learning Outcomes

By completing Lab 6, I demonstrated:

✓ **Full-Stack Development**: Coordinating frontend and backend  
✓ **RESTful API Design**: Proper HTTP semantics  
✓ **CRUD Operations**: Create, Read, Update, Delete  
✓ **Frontend-Backend Integration**: Fetch API and async patterns  
✓ **User Experience**: Feedback, real-time updates, search  
✓ **Professional Standards**: Industry-standard architecture  
✓ **Problem-Solving**: Handling deployment and integration challenges  

---

## Conclusion

Lab 6 successfully demonstrates professional full-stack web development connecting Flask backend with React frontend. By implementing a complete RESTful API and handling real-world challenges like CORS, file permissions, and concurrency, this lab showcases production-ready architecture. The extra features demonstrate how REST principles enable scalable, maintainable, user-friendly applications.

The key insight: **Frontend and backend work together.** The frontend provides the interface; the backend provides the intelligence. Proper HTTP semantics make this partnership efficient, reliable, and professional.

This lab prepares you for building real-world applications where frontend and backend must cooperate seamlessly to create robust, scalable, multi-user systems.
