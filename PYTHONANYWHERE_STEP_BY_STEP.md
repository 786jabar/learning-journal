# PythonAnywhere Deployment - STEP BY STEP

## ✅ STEP 1: Create PythonAnywhere Account

**What to do:**
1. Go to https://www.pythonanywhere.com
2. Click **"Sign up"** button (top right)
3. Fill in:
   - Username: `yourname` (or anything you like)
   - Email: your email
   - Password: strong password
4. Click **"Create account"**
5. Check your email and verify account
6. Log in

**What you'll see:**
- Dashboard with blue header
- "Web" tab available
- "Files" tab available

---

## ✅ STEP 2: Create Flask Web App

**What to do:**
1. You're on dashboard. Click **"Web"** tab (left side)
2. Click **"Add a new web app"** button (blue button)
3. A popup appears:
   - Click **"Next"** (no auth needed)
4. Next screen: Choose Python framework
   - Click on **"Flask"**
   - Click **"Next"**
5. Next screen: Choose Python version
   - Select **"Python 3.13"** (latest)
   - Click **"Next"**
6. Last screen: Flask project setup
   - It shows: "A Flask project will be created at /home/yourname/mysite/"
   - Click **"Next"** to confirm
7. **DONE!** Your web app is created

**What you'll see after:**
- Green message: "Web app created successfully"
- You get a URL: `yourname.pythonanywhere.com`
- Framework shows: Flask
- Status: "enabled"

---

## ✅ STEP 3: Delete Old Flask File

**What to do:**
1. Click **"Files"** tab (left side)
2. You see folders and files
3. Navigate to: `/home/yourname/mysite/`
4. You'll see `flask_app.py` file
5. **Right-click** on `flask_app.py`
6. Select **"Delete"**
7. Confirm deletion

**What you'll see:**
- File disappears from list

---

## ✅ STEP 4: Create New flask_app.py

**What to do:**
1. Still in `/home/yourname/mysite/` folder
2. Click **"New File"** button
3. Type name: `flask_app.py`
4. Click **"Create"**
5. The file opens in editor
6. **DELETE** any default content (select all, delete)
7. **COPY** the entire Python code below and paste it:

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

@app.route("/api/reflections", methods=["GET"])
def get_reflections():
    reflections = load_reflections()
    return jsonify(reflections)

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

8. Click **"Save"** button (top right)

**What you'll see:**
- Code appears in editor
- "Saved" message shows

---

## ✅ STEP 5: Create templates Folder

**What to do:**
1. Still in `/home/yourname/mysite/` folder
2. Look for **"New Directory"** button (or right-click → New Directory)
3. Type folder name: `templates`
4. Press Enter or click Create
5. **DONE!** Folder created

**What you'll see:**
- New folder appears: `templates/`

---

## ✅ STEP 6: Create index.html File in templates

**What to do:**
1. Double-click **`templates/`** folder to enter it
2. Click **"New File"** button
3. Type name: `index.html`
4. Click **"Create"**
5. The file opens in editor
6. **DELETE** any default content
7. **COPY** this entire HTML code and paste it:

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
        <h1>Learning Journal</h1>
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

        <h2>Previous Reflections</h2>
        <div id="viewAll"></div>
    </div>

    <script>
        const API_URL = "/api/reflections";

        function showAlert(message, type) {
            const alertDiv = document.getElementById("alert");
            alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
            setTimeout(() => alertDiv.innerHTML = "", 5000);
        }

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

        function escapeHtml(text) {
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        function escapeJs(text) {
            return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
        }

        window.onload = loadReflections;
    </script>
</body>
</html>
```

8. Click **"Save"** button

**What you'll see:**
- Code appears in editor
- "Saved" message shows

---

## ✅ STEP 7: Reload Web App

**What to do:**
1. Click **"Web"** tab (left side, go back to web tab)
2. Find your web app in the list: `yourname.pythonanywhere.com`
3. Click on it to open details
4. Look for **"Reload"** button (green button, might say "Reload yourname.pythonanywhere.com")
5. Click **"Reload"**
6. Wait 5-10 seconds for it to finish

**What you'll see:**
- Button might show "Reloading..."
- Then returns to normal
- A green message: "Reload completed"

---

## ✅ STEP 8: Visit Your Live App

**What to do:**
1. Open a **new browser tab**
2. Go to: `https://yourname.pythonanywhere.com`
   - Replace `yourname` with your actual PythonAnywhere username
3. Press Enter

**What you should see:**
- Purple header with "Learning Journal"
- Subtitle: "Lab 6: Flask Backend Integration"
- 3 stat cards at top
- A form to add reflection
- "Previous Reflections" section below

---

## ✅ STEP 9: Test All Features

### **Test 1: Add Reflection (POST)**
1. Type your name in "Your Name" field
2. Type something in "Your Reflection" field (at least 10 characters)
3. Click **"Submit Reflection"** button
4. You should see:
   - Green success message: "Reflection added successfully!"
   - Your reflection appears below

### **Test 2: Edit Reflection (PUT)**
1. Click **"Edit"** button on your reflection
2. A popup appears asking to edit name
3. Change the name, click OK
4. Another popup asks to edit reflection
5. Change the text, click OK
6. You should see:
   - Green success message: "Reflection updated!"
   - Reflection shows new name and text

### **Test 3: Delete Reflection (DELETE)**
1. Click **"Delete"** button on your reflection
2. A popup asks: "Delete this reflection?"
3. Click **"OK"** to confirm
4. You should see:
   - Green success message: "Reflection deleted!"
   - Reflection disappears from list

### **Test 4: Add Another Reflection**
1. Do Test 1 again
2. Verify it works multiple times
3. Verify count increases (top left stat card)

---

## ✅ STEP 10: Share Your Link

**What to do:**
1. Copy your PythonAnywhere URL: `https://yourname.pythonanywhere.com`
2. Go to myUCA
3. Find Lab 6 assignment submission
4. Paste the URL
5. Also paste:
   - GitHub link: `https://github.com/786jabar/learning-journal.git`
   - Weekly journal entry with answers to 5 questions

**What to include in submission:**
- PythonAnywhere link
- GitHub link
- Lab 6 journal answers (from `LAB6_JOURNAL_ANSWERS.md`)

---

## ✅ TROUBLESHOOTING

### **Problem: "Error loading reflections" on page**
- Solution:
  1. Go back to PythonAnywhere **Web** tab
  2. Click **Reload** again
  3. Wait 10 seconds
  4. Refresh your browser (F5)

### **Problem: Page shows "404 Not Found"**
- Solution:
  1. Check your URL is correct: `https://yourname.pythonanywhere.com`
  2. Go to **Web** tab → check your web app is **"enabled"** (should be green)
  3. Click **Reload**
  4. Try again

### **Problem: Form doesn't submit**
- Solution:
  1. Check browser console (F12 → Console tab)
  2. Look for red errors
  3. Make sure you filled all fields (name and reflection)
  4. Try adding again

### **Problem: Files don't show in file list**
- Solution:
  1. Make sure you're in correct folder: `/home/yourname/mysite/`
  2. Refresh the page (F5)
  3. Try uploading files again

---

## ✅ FINAL CHECKLIST

Before submitting, verify:

- [ ] Website is live at `https://yourname.pythonanywhere.com`
- [ ] Can add reflection - check green message shows
- [ ] Can edit reflection - try editing and see changes
- [ ] Can delete reflection - try deleting and see removal
- [ ] Total count updates (top stat card)
- [ ] All 4 HTTP methods work (GET, POST, PUT, DELETE)
- [ ] No error messages on page
- [ ] Link submitted to myUCA
- [ ] Lab 6 journal answers posted
- [ ] GitHub link shared

---

## ✅ DONE!

You've successfully deployed Lab 6 on PythonAnywhere!

**Your submission includes:**
✅ Flask backend with REST API (4 HTTP methods)
✅ Live web app on PythonAnywhere
✅ Full CRUD operations
✅ Professional interface
✅ Lab 6 journal answers
✅ GitHub repo

**Submit these to myUCA:**
1. PythonAnywhere link: `https://yourname.pythonanywhere.com`
2. GitHub link: `https://github.com/786jabar/learning-journal`
3. Lab 6 journal entry with question answers

**Good luck! You're ready for submission!**
