#!/usr/bin/env python3
"""
Lab 5 - Python Script to Save Learning Journal Reflections to JSON
This script allows users to add new reflections to the learning journal
stored in a JSON file for display in the PWA.
"""

import json
import os
from datetime import datetime

# Path to the reflections JSON file
JSON_FILE = "reflections.json"

def load_reflections():
    """Load existing reflections from JSON file."""
    if os.path.exists(JSON_FILE):
        try:
            with open(JSON_FILE, 'r') as file:
                return json.load(file)
        except json.JSONDecodeError:
            return []
    return []

def save_reflections(reflections):
    """Save reflections to JSON file."""
    with open(JSON_FILE, 'w') as file:
        json.dump(reflections, file, indent=2)

def add_reflection(text, category="general"):
    """Add a new reflection entry to the JSON file."""
    reflections = load_reflections()
    
    new_entry = {
        "id": len(reflections) + 1,
        "text": text,
        "category": category,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "timestamp": datetime.now().isoformat()
    }
    
    reflections.append(new_entry)
    save_reflections(reflections)
    
    print(f"✓ Reflection saved successfully!")
    print(f"  Date: {new_entry['date']}")
    print(f"  Category: {new_entry['category']}")
    return new_entry

def main():
    """Main function to handle user input."""
    print("\n" + "="*50)
    print("Learning Journal - Add New Reflection")
    print("="*50)
    
    # Get reflection text from user
    text = input("\nEnter your reflection: ").strip()
    
    if not text:
        print("Error: Reflection cannot be empty!")
        return
    
    # Get category
    print("\nCategories: 1=general, 2=learning, 3=project, 4=challenge, 5=success")
    category_input = input("Select category (1-5) [default=1]: ").strip() or "1"
    
    categories = {
        "1": "general",
        "2": "learning",
        "3": "project",
        "4": "challenge",
        "5": "success"
    }
    
    category = categories.get(category_input, "general")
    
    # Add reflection
    entry = add_reflection(text, category)
    
    print("\nCurrent entries in reflections.json:", len(load_reflections()))
    print("="*50 + "\n")

if __name__ == "__main__":
    main()
