import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Mail, GraduationCap, User, Building2, Edit, Camera } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserProfileSchema, type InsertUserProfile } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Default profile picture path
const defaultProfilePicture = "/attached_assets/WhatsApp Image 2025-11-07 at 20.35.48_1762547768163.jpeg";

export default function AboutPage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const { toast } = useToast();

  const form = useForm<InsertUserProfile>({
    resolver: zodResolver(insertUserProfileSchema),
    defaultValues: {
      name: "",
      studentId: "",
      university: "",
      program: "",
      email: "",
      courseDirector: "",
      courseDirectorEmail: "",
      bio: "",
      profilePicture: "",
    },
  });

  const handleOpenEdit = () => {
    if (profile) {
      form.reset({
        name: profile.name,
        studentId: profile.studentId,
        university: profile.university,
        program: profile.program,
        email: profile.email,
        courseDirector: profile.courseDirector,
        courseDirectorEmail: profile.courseDirectorEmail,
        bio: profile.bio || "",
        profilePicture: profile.profilePicture || "",
      });
    }
    setIsEditingProfile(true);
  };

  const onSubmit = async (data: InsertUserProfile) => {
    try {
      await updateProfile(data);
      toast({ title: "Success", description: "Profile updated successfully!" });
      setIsEditingProfile(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: BookOpen,
      title: "Journal Entries",
      description: "Create rich journal entries with Markdown support to document your learning journey.",
    },
    {
      icon: GraduationCap,
      title: "Project Tracking",
      description: "Manage your learning projects, track technologies, and showcase your portfolio.",
    },
    {
      icon: Building2,
      title: "Export & Backup",
      description: "Export your data in JSON, Markdown, or PDF formats for backup and sharing.",
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Hero Section */}
        <Card className="mb-12 overflow-hidden border-2">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-background"></div>
          <CardContent className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start gap-6 -mt-16">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={profile?.profilePicture || defaultProfilePicture} alt={profile?.name || "Profile"} />
                  <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                    {profile?.name ? getInitials(profile.name) : "JS"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 mt-4 md:mt-16">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{profile?.name || "Md Jawar Safi"}</h1>
                    <p className="text-lg text-muted-foreground">{profile?.program || "Computer Science"} Student</p>
                  </div>
                  <Button onClick={handleOpenEdit} variant="outline" size="sm" data-testid="button-edit-profile">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                {profile?.bio && (
                  <p className="text-muted-foreground mb-6">{profile.bio}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-md mt-0.5">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">University</p>
                      <p className="text-sm text-muted-foreground">{profile?.university || "University for the Creative Arts"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-md mt-0.5">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Student ID</p>
                      <p className="text-sm text-muted-foreground font-mono">{profile?.studentId || "2315024"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-md mt-0.5">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Student Email</p>
                      <p className="text-sm text-muted-foreground break-all">{profile?.email || "2315024@students.ucreative.ac.uk"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-md mt-0.5">
                      <GraduationCap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Course Director</p>
                      <p className="text-sm text-muted-foreground">{profile?.courseDirector || "Adila Nordin"}</p>
                      <p className="text-xs text-muted-foreground break-all">{profile?.courseDirectorEmail || "adila.nordin@ac.uk"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Learning Journal Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About This Learning Journal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              This is a personalized learning journal application designed to help track academic progress,
              document learning experiences, and manage projects throughout my Computer Science studies at
              the University for the Creative Arts.
            </p>
            <p>
              The app features offline-first architecture, automatic data synchronization, and comprehensive
              export capabilities. All journal entries and projects are securely stored and can be exported
              in multiple formats including JSON, Markdown, and PDF.
            </p>
            <div className="pt-4 border-t grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Built With</p>
                <p className="text-sm">React, TypeScript, PostgreSQL</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Last Updated</p>
                <p className="text-sm">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student ID</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-student-id" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="program"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program/Major</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-program" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-university" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="courseDirector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Director</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-course-director" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="courseDirectorEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Director Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} data-testid="input-director-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio (Optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value || ""} rows={3} data-testid="input-bio" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture URL (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="https://..." data-testid="input-profile-picture" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUpdating} data-testid="button-save-profile">
                    {isUpdating ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
