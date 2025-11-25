import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Download, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Reflection {
  id: number;
  text: string;
  category: string;
  date: string;
  timestamp: string;
}

export default function Lab5DemoPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReflection, setNewReflection] = useState("");
  const [category, setCategory] = useState("general");
  const { toast } = useToast();

  const loadReflections = async () => {
    try {
      setLoading(true);
      const response = await fetch("/backend/reflections.json");
      if (response.ok) {
        const data = await response.json();
        setReflections(data);
      }
    } catch (error) {
      console.error("Error loading reflections:", error);
      toast({
        title: "Error",
        description: "Failed to load reflections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReflections();
  }, []);

  const addReflection = async () => {
    if (!newReflection.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reflection",
        variant: "destructive",
      });
      return;
    }

    const entry: Reflection = {
      id: reflections.length + 1,
      text: newReflection,
      category,
      date: new Date().toLocaleString(),
      timestamp: new Date().toISOString(),
    };

    const updated = [...reflections, entry];
    setReflections(updated);

    try {
      // Save to backend
      await fetch("/api/save-reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });

      toast({
        title: "Success",
        description: "Reflection added successfully",
      });
      setNewReflection("");
    } catch (error) {
      console.error("Error saving reflection:", error);
    }
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(reflections, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reflections.json";
    link.click();

    toast({
      title: "Downloaded",
      description: "reflections.json downloaded successfully",
    });
  };

  const exportCSV = () => {
    const headers = ["ID", "Date", "Category", "Text"];
    const rows = reflections.map((r) => [r.id, r.date, r.category, r.text]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",")
              ? `"${cell}"`
              : cell
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reflections.csv";
    link.click();

    toast({
      title: "Exported",
      description: "Reflections exported to CSV",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Lab 5: Python & JSON Backend
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Store reflections using Python and JSON, then display them in your
            PWA
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Reflections Count
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {reflections.length}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Storage Method
            </h3>
            <p className="text-slate-700 dark:text-slate-300">JSON File</p>
            <p className="text-sm text-slate-500">
              /backend/reflections.json
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Python Script
            </h3>
            <p className="text-slate-700 dark:text-slate-300">save_entry.py</p>
            <p className="text-sm text-slate-500">Append entries to JSON</p>
          </Card>
        </div>

        {/* Add Reflection Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
            Add New Reflection
          </h2>
          <div className="space-y-4">
            <textarea
              value={newReflection}
              onChange={(e) => setNewReflection(e.target.value)}
              placeholder="What did you learn today?"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              rows={3}
              data-testid="textarea-reflection"
            />
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  data-testid="select-category"
                >
                  <option value="general">General</option>
                  <option value="learning">Learning</option>
                  <option value="project">Project</option>
                  <option value="challenge">Challenge</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <Button
                onClick={addReflection}
                className="gap-2"
                data-testid="button-add-reflection"
              >
                <Plus className="w-4 h-4" />
                Add Reflection
              </Button>
            </div>
          </div>
        </Card>

        {/* Export Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
            Export Data
          </h2>
          <div className="flex gap-4">
            <Button
              onClick={downloadJSON}
              variant="outline"
              className="gap-2"
              data-testid="button-export-json"
            >
              <Download className="w-4 h-4" />
              Download JSON
            </Button>
            <Button
              onClick={exportCSV}
              variant="outline"
              className="gap-2"
              data-testid="button-export-csv"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button
              onClick={loadReflections}
              variant="outline"
              className="gap-2"
              data-testid="button-refresh-reflections"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </Card>

        {/* Reflections List */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
            All Reflections
          </h2>

          {loading ? (
            <p className="text-slate-600 dark:text-slate-400">
              Loading reflections...
            </p>
          ) : reflections.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <p className="text-amber-700 dark:text-amber-200">
                No reflections yet. Add one to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reflections.map((reflection) => (
                <div
                  key={reflection.id}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  data-testid={`reflection-card-${reflection.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {reflection.date}
                      </p>
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded mt-1">
                        {reflection.category}
                      </span>
                    </div>
                    <span className="text-slate-400 dark:text-slate-600 text-sm">
                      #{reflection.id}
                    </span>
                  </div>
                  <p className="text-slate-900 dark:text-white">
                    {reflection.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Info Section */}
        <Card className="p-6 mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            How It Works
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
            <li>
              ✓ <strong>Python Script:</strong> Use save_entry.py to add
              reflections
            </li>
            <li>
              ✓ <strong>JSON Storage:</strong> Data saved in
              /backend/reflections.json
            </li>
            <li>
              ✓ <strong>JavaScript Fetch:</strong> This PWA fetches and displays
              entries
            </li>
            <li>
              ✓ <strong>DOM Manipulation:</strong> Entries rendered dynamically
              in the DOM
            </li>
            <li>
              ✓ <strong>Export Feature:</strong> Download as JSON or CSV for
              data analysis
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
