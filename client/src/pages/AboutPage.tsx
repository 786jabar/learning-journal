import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Mail, GraduationCap, User, Building2, Edit, PlusCircle } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserProfileSchema, type InsertUserProfile } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    } else {
      form.reset({
        name: "",
        studentId: "",
        university: "",
        program: "",
        email: "",
        courseDirector: "",
        courseDirectorEmail: "",
        bio: "",
        profilePicture: "",
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

  // Show empty state if no profile exists
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Empty State */}
          <Card className="mb-12 overflow-visible glass-card">
            <CardContent className="py-16 text-center">
              <div className="flex justify-center mb-6">
                <div className="h-24 w-24 gradient-bg rounded-full flex items-center justify-center shadow-lg animate-float">
                  <User className="h-12 w-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 gradient-text">Complete Your Profile</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Create your profile to personalize your Learning Journal experience. Add your details to get started.
              </p>
              <Button onClick={handleOpenEdit} size="lg" className="gradient-bg border-0 shadow-lg" data-testid="button-create-profile">
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Profile
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 gradient-text">Learning Journal Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="glass-card hover-elevate overflow-visible">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 gradient-bg rounded-xl">
                        <feature.icon className="h-5 w-5 text-white" />
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
          <Card className="glass-card overflow-visible">
            <CardHeader>
              <CardTitle className="gradient-text">About This Learning Journal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                This is a personalized learning journal application designed to help you track your academic progress,
                document learning experiences, and manage projects throughout your studies.
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
                <DialogTitle>Create Your Profile</DialogTitle>
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
                          <Input {...field} placeholder="Enter your full name" data-testid="input-name" />
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
                            <Input {...field} placeholder="e.g., 2315024" data-testid="input-student-id" />
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
                            <Input {...field} placeholder="e.g., Computer Science" data-testid="input-program" />
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
                          <Input {...field} placeholder="Enter your university name" data-testid="input-university" />
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
                          <Input type="email" {...field} placeholder="your.email@university.edu" data-testid="input-email" />
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
                            <Input {...field} placeholder="Director's name" data-testid="input-course-director" />
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
                            <Input type="email" {...field} placeholder="director@university.edu" data-testid="input-director-email" />
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
                          <Textarea {...field} value={field.value || ""} rows={3} placeholder="Tell us about yourself..." data-testid="input-bio" />
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

  // Show profile when it exists
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Hero Section */}
        <Card className="mb-12 overflow-visible glass-card">
          <div className="h-40 gradient-bg"></div>
          <CardContent className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start gap-6 -mt-20">
              <div className="relative group animate-float">
                <Avatar className="h-40 w-40 border-4 border-background shadow-2xl ring-4 ring-primary/20">
                  <AvatarImage src={profile.profilePicture || undefined} alt={profile.name} />
                  <AvatarFallback className="text-4xl font-bold gradient-bg text-white">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 mt-4 md:mt-20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2 gradient-text" data-testid="text-profile-name">{profile.name}</h1>
                    <p className="text-xl text-muted-foreground" data-testid="text-profile-program">{profile.program} Student</p>
                  </div>
                  <Button onClick={handleOpenEdit} className="gradient-bg border-0 shadow-lg" size="sm" data-testid="button-edit-profile">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                {profile.bio && (
                  <p className="text-muted-foreground mb-6 italic">{profile.bio}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 glass p-3 rounded-xl">
                    <div className="p-2 gradient-bg rounded-lg mt-0.5">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">University</p>
                      <p className="text-sm text-muted-foreground">{profile.university}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 glass p-3 rounded-xl">
                    <div className="p-2 gradient-bg rounded-lg mt-0.5">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Student ID</p>
                      <p className="text-sm text-muted-foreground font-mono">{profile.studentId}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 glass p-3 rounded-xl">
                    <div className="p-2 gradient-bg rounded-lg mt-0.5">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Student Email</p>
                      <p className="text-sm text-muted-foreground break-all">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 glass p-3 rounded-xl">
                    <div className="p-2 gradient-bg rounded-lg mt-0.5">
                      <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Course Director</p>
                      <p className="text-sm text-muted-foreground">{profile.courseDirector}</p>
                      <p className="text-xs text-muted-foreground break-all">{profile.courseDirectorEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 gradient-text">Learning Journal Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover-elevate overflow-visible">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 gradient-bg rounded-xl">
                      <feature.icon className="h-5 w-5 text-white" />
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
        <Card className="glass-card overflow-visible">
          <CardHeader>
            <CardTitle className="gradient-text">About This Learning Journal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              This is a personalized learning journal application designed to help track academic progress,
              document learning experiences, and manage projects throughout your studies.
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card">
            <DialogHeader>
              <DialogTitle className="gradient-text text-2xl">Edit Profile</DialogTitle>
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
