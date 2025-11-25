# PythonAnywhere Deployment Guide
## Learning Journal PWA - Lab 6 Final Submission

### Quick Start (5 steps)

#### Step 1: Set Up PythonAnywhere Account
1. Go to https://www.pythonanywhere.com
2. Sign up for FREE account
3. Confirm email

#### Step 2: Create Web App on PythonAnywhere
1. Log in to PythonAnywhere dashboard
2. Click **Web** tab → **Add a new web app**
3. Select **Flask** framework
4. Choose **Python 3.13** (latest)
5. Accept default project name (`flask_app.py`)
6. Click through to create

#### Step 3: Upload Project Files
1. In PythonAnywhere, go to **Files** tab
2. Navigate to `/home/yourusername/mysite/`
3. You'll see `flask_app.py` already exists
4. Delete it and create new files below

#### Step 4: Create Flask Backend Files

**File 1: `/home/yourusername/mysite/flask_app.py`**
```python
from flask import Flask, request, jsonify, render_template
import json, os
from datetime import datetime

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "reflections.json")

def load_reflections():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            try:
                return json.load(f)
            except:
                return []
    return []

def save_reflections(reflections):
    with open(DATA_FILE, "w") as f:
        json.dump(reflections, f, indent=4)

@app.route("/")
def index():
    return render_template("index.html")

# GET - Retrieve all reflections
@app.route("/api/reflections", methods=["GET"])
def get_reflections():
    reflections = load_reflections()
    return jsonify(reflections)

# POST - Create new reflection
@app.route("/api/reflections", methods=["POST"])
def add_reflection():
    try:
        data = request.get_json()
        new_reflection = {
            "id": len(load_reflections()) + 1,
            "name": data.get("name", "Anonymous"),
            "date": datetime.now().strftime("%a %b %d %Y"),
            "reflection": data.get("reflection", "")
        }
        reflections = load_reflections()
        reflections.append(new_reflection)
        save_reflections(reflections)
        return jsonify(new_reflection), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# PUT - Update reflection
@app.route("/api/reflections/<int:id>", methods=["PUT"])
def update_reflection(id):
    try:
        data = request.get_json()
        reflections = load_reflections()
        for r in reflections:
            if r["id"] == id:
                r["name"] = data.get("name", r["name"])
                r["reflection"] = data.get("reflection", r["reflection"])
                save_reflections(reflections)
                return jsonify(r)
        return jsonify({"error": "Not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# DELETE - Remove reflection
@app.route("/api/reflections/<int:id>", methods=["DELETE"])
def delete_reflection(id):
    try:
        reflections = load_reflections()
        reflections = [r for r in reflections if r["id"] != id]
        save_reflections(reflections)
        return "", 204
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run()
```

**File 2: Create `/home/yourusername/mysite/templates/` directory**
- In PythonAnywhere Files, right-click → New Directory → `templates`

**File 3: `/home/yourusername/mysite/templates/index.html`**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Learning Journal - Lab 6</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 32px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }
        input, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #eee;
            border-radius: 8px;
            font-family: inherit;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        textarea {
            resize: vertical;
            min-height: 120px;
        }
        .button-group {
            display: flex;
            gap: 10px;
        }
        button {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .btn-submit {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        .btn-reset {
            background: #f0f0f0;
            color: #333;
        }
        .btn-reset:hover {
            background: #e0e0e0;
        }
        h2 {
            color: #333;
            margin-top: 40px;
            margin-bottom: 20px;
            font-size: 20px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
        }
        .reflection-card {
            background: #f9f9f9;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            transition: all 0.3s;
        }
        .reflection-card:hover {
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .reflection-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .reflection-name {
            font-weight: 600;
            color: #333;
        }
        .reflection-date {
            font-size: 12px;
            color: #999;
        }
        .reflection-text {
            color: #555;
            margin-bottom: 12px;
            line-height: 1.6;
        }
        .reflection-actions {
            display: flex;
            gap: 8px;
        }
        .btn-small {
            flex: 1;
            padding: 8px;
            border: 1px solid #ddd;
            background: white;
            color: #333;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .btn-small:hover {
            border-color: #667eea;
            color: #667eea;
        }
        .btn-delete {
            border-color: #ff6b6b;
            color: #ff6b6b;
        }
        .btn-delete:hover {
            background: #ff6b6b;
            color: white;
        }
        .empty-state {
            text-align: center;
            color: #999;
            padding: 40px 20px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-number {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 5px;
        }
        .stat-label {
            font-size: 12px;
            opacity: 0.9;
        }
        .alert {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        @media (max-width: 600px) {
            .container { padding: 20px; }
            h1 { font-size: 24px; }
            .stats { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📔 Learning Journal</h1>
        <p class="subtitle">Lab 6: Flask Backend Integration</p>

        <div id="alert"></div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number" id="total-count">0</div>
                <div class="stat-label">Total Reflections</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">4</div>
                <div class="stat-label">HTTP Methods</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">5</div>
                <div class="stat-label">Journal Questions</div>
            </div>
        </div>

        <form id="reflection-form" onsubmit="return submitReflection()">
            <div class="form-group">
                <label for="fname">Your Name</label>
                <input type="text" id="fname" name="fname" placeholder="Enter your name" required>
            </div>

            <div class="form-group">
                <label for="reflection">Your Reflection</label>
                <textarea id="reflection" name="reflection" placeholder="What did you learn this week? What did you find challenging?" minlength="10" required></textarea>
            </div>

            <div class="button-group">
                <button type="submit" class="btn-submit">Submit Reflection</button>
                <button type="reset" class="btn-reset">Clear</button>
            </div>
        </form>

        <h2>📚 Previous Reflections</h2>
        <div id="viewAll"></div>
    </div>

    <script>
        const API_URL = "/api/reflections";

        // Show alert message
        function showAlert(message, type) {
            const alertDiv = document.getElementById("alert");
            alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
            setTimeout(() => alertDiv.innerHTML = "", 5000);
        }

        // Submit new reflection (POST)
        async function submitReflection() {
            const name = document.getElementById("fname").value;
            const reflection = document.getElementById("reflection").value;

            if (!name || !reflection) {
                showAlert("Please fill in all fields", "error");
                return false;
            }

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, reflection })
                });

                if (response.ok) {
                    document.getElementById("reflection-form").reset();
                    showAlert("Reflection added successfully!", "success");
                    loadReflections();
                } else {
                    showAlert("Failed to add reflection", "error");
                }
            } catch (error) {
                console.error("Error:", error);
                showAlert("Error: " + error.message, "error");
            }

            return false;
        }

        // Load all reflections (GET)
        async function loadReflections() {
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const reflections = await response.json();
                    displayReflections(reflections);
                    document.getElementById("total-count").textContent = reflections.length;
                } else {
                    showAlert("Failed to load reflections", "error");
                }
            } catch (error) {
                console.error("Error loading:", error);
            }
        }

        // Display reflections in DOM
        function displayReflections(reflections) {
            const viewAll = document.getElementById("viewAll");
            if (reflections.length === 0) {
                viewAll.innerHTML = '<div class="empty-state">No reflections yet. Add one to get started!</div>';
                return;
            }

            viewAll.innerHTML = reflections.map(r => `
                <div class="reflection-card">
                    <div class="reflection-header">
                        <div class="reflection-name">${escapeHtml(r.name)}</div>
                        <div class="reflection-date">${r.date} (#${r.id})</div>
                    </div>
                    <div class="reflection-text">${escapeHtml(r.reflection)}</div>
                    <div class="reflection-actions">
                        <button class="btn-small" onclick="editReflection(${r.id}, '${escapeJs(r.name)}', '${escapeJs(r.reflection)}')">Edit</button>
                        <button class="btn-small btn-delete" onclick="deleteReflection(${r.id})">Delete</button>
                    </div>
                </div>
            `).join("");
        }

        // Edit reflection (PUT)
        async function editReflection(id, name, reflection) {
            const newName = prompt("Edit name:", name);
            if (newName === null) return;

            const newReflection = prompt("Edit reflection:", reflection);
            if (newReflection === null) return;

            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newName, reflection: newReflection })
                });

                if (response.ok) {
                    showAlert("Reflection updated!", "success");
                    loadReflections();
                } else {
                    showAlert("Failed to update", "error");
                }
            } catch (error) {
                showAlert("Error: " + error.message, "error");
            }
        }

        // Delete reflection (DELETE)
        async function deleteReflection(id) {
            if (!confirm("Delete this reflection?")) return;

            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    showAlert("Reflection deleted!", "success");
                    loadReflections();
                } else {
                    showAlert("Failed to delete", "error");
                }
            } catch (error) {
                showAlert("Error: " + error.message, "error");
            }
        }

        // Escape HTML
        function escapeHtml(text) {
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        // Escape JS string
        function escapeJs(text) {
            return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
        }

        // Load on page start
        window.onload = loadReflections;
    </script>
</body>
</html>
```

#### Step 5: Deploy on PythonAnywhere
1. Go to **Web** tab in PythonAnywhere
2. Click **Reload** button to apply changes
3. Visit your live URL: `yourusername.pythonanywhere.com`
4. Test: Add reflection → Edit it → Delete it

---

### Testing on PythonAnywhere

1. **Add Reflection (POST)**
   - Fill form and click Submit
   - Should appear below instantly

2. **Edit Reflection (PUT)**
   - Click "Edit" on any reflection
   - Modify in popup
   - Click OK to save

3. **Delete Reflection (DELETE)**
   - Click "Delete" on any reflection
   - Confirm deletion
   - Entry removed from list

4. **View All (GET)**
   - Page loads all reflections from Flask
   - Refresh shows latest data

---

### Troubleshooting

**Issue: "Error loading reflections"**
- Go to PythonAnywhere Web tab → Reload
- Wait 10 seconds
- Refresh page

**Issue: Files not uploading**
- Use PythonAnywhere file editor (click pencil icon)
- Copy-paste code directly into files

**Issue: 404 Not Found**
- Confirm flask_app.py exists in `/home/yourusername/mysite/`
- Check that templates folder exists
- Reload web app

**Issue: JSON file not created**
- It auto-creates on first reflection
- Check PythonAnywhere file manager for `reflections.json`

---

### Submission Checklist

- [ ] App deployed and live on `yourusername.pythonanywhere.com`
- [ ] Can add reflections (POST works)
- [ ] Can edit reflections (PUT works)
- [ ] Can delete reflections (DELETE works)
- [ ] All 4 HTTP methods demonstrated
- [ ] GitHub repo linked on myUCA
- [ ] PythonAnywhere link posted on myUCA
- [ ] Lab 6 journal entry submitted on myUCA with answers to 5 questions
- [ ] Weekly reflection posted on Learning Journal Web

---

### Lab 6 Completion Summary

✅ **Backend**: Flask REST API with GET, POST, PUT, DELETE  
✅ **Frontend**: HTML/CSS/JavaScript with Fetch API  
✅ **CRUD**: Full Create, Read, Update, Delete operations  
✅ **Deployment**: Live on PythonAnywhere  
✅ **Documentation**: LAB6_JOURNAL_ANSWERS.md with comprehensive answers  

**Next**: Submit link to myUCA and your weekly journal!
