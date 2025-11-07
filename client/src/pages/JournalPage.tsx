import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { JournalCard } from "@/components/JournalCard";
import { Plus, Search, X } from "lucide-react";
import type { JournalEntry, InsertJournalEntry } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertJournalEntrySchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import MDEditor from "@uiw/react-md-editor";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useJournals } from "@/hooks/useJournalStore";

export default function JournalPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();

  const { 
    journals, 
    isLoading, 
    createJournal, 
    updateJournal, 
    deleteJournal,
    isCreating,
    isUpdating,
  } = useJournals();

  const form = useForm<InsertJournalEntry>({
    resolver: zodResolver(insertJournalEntrySchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      date: new Date(),
    },
  });

  const handleOpenDialog = (entry?: JournalEntry) => {
    if (entry) {
      setEditingEntry(entry);
      form.reset({
        title: entry.title,
        content: entry.content,
        tags: entry.tags,
        date: new Date(entry.date),
      });
    } else {
      setEditingEntry(null);
      form.reset({
        title: "",
        content: "",
        tags: [],
        date: new Date(),
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEntry(null);
    form.reset();
  };

  const onSubmit = async (data: InsertJournalEntry) => {
    try {
      if (editingEntry) {
        await updateJournal({ id: editingEntry.id, data });
        toast({ title: "Success", description: "Journal entry updated!" });
      } else {
        await createJournal(data);
        toast({ title: "Success", description: "Journal entry created!" });
      }
      handleCloseDialog();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: editingEntry ? "Failed to update entry" : "Failed to create entry",
        variant: "destructive" 
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !form.getValues("tags").includes(tagInput.trim())) {
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleDeleteEntry = async (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteJournal(id);
        toast({ title: "Success", description: "Journal entry deleted!" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete entry", variant: "destructive" });
      }
    }
  };

  // Get all unique tags for filtering
  const allTags = Array.from(new Set(journals.flatMap(j => j.tags)));

  // Filter journals
  const filteredJournals = journals.filter(journal => {
    const matchesSearch = journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         journal.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => journal.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Journal Entries</h1>
            <p className="text-muted-foreground">
              Document your learning experiences and reflections
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} data-testid="button-new-journal">
            <Plus className="h-5 w-5 mr-2" />
            New Entry
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover-elevate"
                  onClick={() => {
                    setSelectedTags(prev =>
                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                    );
                  }}
                  data-testid={`badge-filter-${tag}`}
                >
                  {tag}
                </Badge>
              ))}
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  data-testid="button-clear-filters"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Journal Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-64" />
              </Card>
            ))}
          </div>
        ) : filteredJournals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJournals.map((journal) => (
              <JournalCard
                key={journal.id}
                entry={journal}
                onEdit={handleOpenDialog}
                onDelete={handleDeleteEntry}
              />
            ))}
          </div>
        ) : (
          <Card className="py-16">
            <CardContent className="text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery || selectedTags.length > 0 ? "No entries found" : "No journal entries yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedTags.length > 0
                  ? "Try adjusting your search or filters"
                  : "Create your first journal entry to start tracking your learning journey"}
              </p>
              {!searchQuery && selectedTags.length === 0 && (
                <Button onClick={() => handleOpenDialog()} data-testid="button-create-first">
                  <Plus className="h-5 w-5 mr-2" />
                  Create First Entry
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? "Edit Journal Entry" : "New Journal Entry"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="What did you learn today?" {...field} data-testid="input-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <div data-color-mode={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}>
                          <MDEditor
                            value={field.value}
                            onChange={(value) => field.onChange(value || "")}
                            preview="edit"
                            height={300}
                            data-testid="editor-content"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      data-testid="input-tag"
                    />
                    <Button type="button" onClick={handleAddTag} variant="secondary" data-testid="button-add-tag">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("tags").map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1" data-testid={`badge-tag-${index}`}>
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog} data-testid="button-cancel">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isCreating || isUpdating}
                    data-testid="button-submit"
                  >
                    {isCreating || isUpdating
                      ? "Saving..."
                      : editingEntry
                      ? "Update Entry"
                      : "Create Entry"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
