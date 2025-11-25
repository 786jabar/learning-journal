import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Trash2, Edit2, Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Reflection {
  id: number;
  name: string;
  date: string;
  reflection: string;
}

export default function Lab6DemoPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newReflection, setNewReflection] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editReflection, setEditReflection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const loadReflections = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/lab6-reflections");
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
    if (!newName.trim() || !newReflection.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/lab6-reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          reflection: newReflection,
        }),
      });

      if (response.ok) {
        const newEntry = await response.json();
        setReflections([...reflections, newEntry]);
        setNewName("");
        setNewReflection("");
        toast({
          title: "Success",
          description: "Reflection added successfully",
        });
      }
    } catch (error) {
      console.error("Error adding reflection:", error);
      toast({
        title: "Error",
        description: "Failed to add reflection",
        variant: "destructive",
      });
    }
  };

  const deleteReflection = async (id: number) => {
    try {
      const response = await fetch(`/api/lab6-reflections/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReflections(reflections.filter((r) => r.id !== id));
        toast({
          title: "Deleted",
          description: "Reflection removed successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting reflection:", error);
      toast({
        title: "Error",
        description: "Failed to delete reflection",
        variant: "destructive",
      });
    }
  };

  const startEdit = (reflection: Reflection) => {
    setEditingId(reflection.id);
    setEditName(reflection.name);
    setEditReflection(reflection.reflection);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditReflection("");
  };

  const updateReflection = async () => {
    if (!editingId || !editName.trim() || !editReflection.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/lab6-reflections/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          reflection: editReflection,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setReflections(
          reflections.map((r) => (r.id === editingId ? updated : r))
        );
        cancelEdit();
        toast({
          title: "Updated",
          description: "Reflection updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating reflection:", error);
      toast({
        title: "Error",
        description: "Failed to update reflection",
        variant: "destructive",
      });
    }
  };

  const filteredReflections = reflections.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reflection.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Lab 6: Frontend & Backend Integration
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Flask backend with RESTful API (GET, POST, PUT, DELETE)
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Total Reflections
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {reflections.length}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Backend Framework
            </h3>
            <p className="text-slate-700 dark:text-slate-300">Flask</p>
            <p className="text-sm text-slate-500">REST API</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Data Format
            </h3>
            <p className="text-slate-700 dark:text-slate-300">JSON</p>
            <p className="text-sm text-slate-500">Served by Flask</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              HTTP Methods
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              GET, POST, PUT, DELETE
            </p>
            <p className="text-sm text-slate-500">Full CRUD</p>
          </Card>
        </div>

        {/* Add Reflection Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
            Add New Reflection
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Your name"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              data-testid="input-reflection-name"
            />
            <textarea
              value={newReflection}
              onChange={(e) => setNewReflection(e.target.value)}
              placeholder="What did you learn this week?"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              rows={4}
              data-testid="textarea-reflection-text"
            />
            <Button
              onClick={addReflection}
              className="gap-2"
              data-testid="button-add-reflection"
            >
              <Plus className="w-4 h-4" />
              Submit Reflection
            </Button>
          </div>
        </Card>

        {/* Search Section */}
        <Card className="p-6 mb-8">
          <div className="flex gap-3 items-center">
            <Search className="w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reflections..."
              className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              data-testid="input-search-reflections"
            />
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
          {searchTerm && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Found {filteredReflections.length} result(s)
            </p>
          )}
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
          ) : filteredReflections.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <p className="text-amber-700 dark:text-amber-200">
                {searchTerm
                  ? "No reflections match your search."
                  : "No reflections yet. Add one to get started!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReflections.map((reflection) => (
                <div
                  key={reflection.id}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  data-testid={`reflection-card-${reflection.id}`}
                >
                  {editingId === reflection.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        data-testid="input-edit-name"
                      />
                      <textarea
                        value={editReflection}
                        onChange={(e) => setEditReflection(e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        rows={3}
                        data-testid="textarea-edit-reflection"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={updateReflection}
                          size="sm"
                          data-testid="button-save-edit"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          size="sm"
                          variant="outline"
                          data-testid="button-cancel-edit"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {reflection.name}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {reflection.date}
                          </p>
                        </div>
                        <span className="text-slate-400 dark:text-slate-600 text-sm">
                          #{reflection.id}
                        </span>
                      </div>
                      <p className="text-slate-900 dark:text-white mb-3">
                        {reflection.reflection}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEdit(reflection)}
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          data-testid={`button-edit-${reflection.id}`}
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteReflection(reflection.id)}
                          size="sm"
                          variant="outline"
                          className="gap-1 text-destructive"
                          data-testid={`button-delete-${reflection.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Info Section */}
        <Card className="p-6 mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            How Flask Backend Works
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
            <li>
              ✓ <strong>GET /api/reflections:</strong> Frontend fetches all
              reflections from Flask backend
            </li>
            <li>
              ✓ <strong>POST /api/reflections:</strong> Frontend sends new
              reflection to Flask, which appends to JSON
            </li>
            <li>
              ✓ <strong>PUT /api/reflections/:id:</strong> Edit existing
              reflection via Flask
            </li>
            <li>
              ✓ <strong>DELETE /api/reflections/:id:</strong> Remove reflection
              from Flask backend
            </li>
            <li>
              ✓ <strong>Search Filter:</strong> Client-side filtering of
              reflections
            </li>
            <li>
              ✓ <strong>Real-time Sync:</strong> All operations update JSON file
              instantly
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
