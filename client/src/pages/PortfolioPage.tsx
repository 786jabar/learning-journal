import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { 
  Download, 
  FileText, 
  Code2, 
  Database, 
  Globe, 
  Smartphone,
  Gamepad2,
  BookOpen,
  Loader2,
  CheckCircle2,
  Layers,
  Server,
  Wifi
} from "lucide-react";

interface PortfolioSection {
  title: string;
  description: string;
  features: string[];
  technologies: string[];
}

const portfolioData = {
  studentName: "Student Name",
  studentId: "Student ID",
  courseName: "FGCT6021 Mobile Application Development",
  projectTitle: "Learning Journal PWA",
  submissionDate: format(new Date(), "MMMM dd, yyyy"),
  
  overview: `A full-stack Progressive Web App (PWA) for tracking learning journeys. Built with React frontend, Express backend, PostgreSQL database via Drizzle ORM, and offline-first architecture using IndexedDB. Features journal entries, project tracking, analytics dashboards, and comprehensive lab demonstrations for academic coursework.`,
  
  techStack: {
    frontend: ["React 18", "TypeScript", "Tailwind CSS", "Shadcn/UI", "Wouter Router", "TanStack Query"],
    backend: ["Node.js", "Express", "Drizzle ORM", "PostgreSQL (Neon)"],
    pwa: ["Service Worker", "IndexedDB", "Web App Manifest", "Cache API"],
    tools: ["Vite", "jsPDF", "date-fns", "Recharts", "Framer Motion"]
  },
  
  labs: [
    {
      number: 3,
      title: "Lab 3: JavaScript & DOM Manipulation",
      description: "Demonstrates core JavaScript concepts and DOM manipulation techniques.",
      features: [
        "Dynamic element creation and modification",
        "Event handling (click, input, keyboard events)",
        "DOM traversal and manipulation",
        "CSS class toggling and style changes",
        "Form validation with JavaScript",
        "Interactive UI components"
      ],
      technologies: ["JavaScript ES6+", "DOM API", "Event Listeners", "CSS Manipulation"],
      demoPath: "/lab3-demo"
    },
    {
      number: 4,
      title: "Lab 4: Storage & APIs",
      description: "Demonstrates various storage mechanisms and third-party API integration.",
      features: [
        "LocalStorage - persistent key-value storage",
        "SessionStorage - session-scoped storage",
        "IndexedDB - offline database storage",
        "Clipboard API - copy/paste functionality",
        "Notifications API - browser notifications",
        "Geolocation API - user location detection",
        "Weather API (Open-Meteo) - real-time weather data",
        "GitHub API - user profile fetching"
      ],
      technologies: ["Web Storage API", "IndexedDB", "Clipboard API", "Geolocation API", "Fetch API", "REST APIs"],
      demoPath: "/lab4-demo"
    },
    {
      number: 5,
      title: "Lab 5: JSON Data Handling",
      description: "Demonstrates JSON file operations and data manipulation.",
      features: [
        "JSON file loading and parsing",
        "Dynamic data display from JSON",
        "JSON serialization/deserialization",
        "Data export to JSON format",
        "Structured data manipulation"
      ],
      technologies: ["JSON", "Fetch API", "File Handling", "Data Serialization"],
      demoPath: "/lab5-demo"
    },
    {
      number: 6,
      title: "Lab 6: Backend Integration",
      description: "Full-stack CRUD operations with Express backend and PostgreSQL database.",
      features: [
        "RESTful API endpoints (GET, POST, PUT, DELETE)",
        "PostgreSQL database with Drizzle ORM",
        "Server-side validation with Zod",
        "Error handling and response formatting",
        "Data persistence and retrieval",
        "Real-time data synchronization"
      ],
      technologies: ["Express.js", "PostgreSQL", "Drizzle ORM", "REST API", "Zod Validation"],
      demoPath: "/lab6-demo"
    },
    {
      number: 7,
      title: "Lab 7: PWA Features",
      description: "Progressive Web App capabilities for offline-first experience.",
      features: [
        "Service Worker registration and management",
        "Offline/Online status detection",
        "App installation prompt (Add to Home Screen)",
        "Cache Storage API for offline resources",
        "Push Notifications support",
        "Web App Manifest configuration",
        "Responsive mobile-first design"
      ],
      technologies: ["Service Worker", "Cache API", "Web App Manifest", "Push API", "IndexedDB"],
      demoPath: "/lab7-demo"
    }
  ],
  
  additionalFeatures: [
    {
      title: "Candy Rush Saga Game",
      description: "A professional match-3 puzzle game with 8 levels, special candies, combos, and achievements.",
      features: ["8 challenging levels", "Special candy mechanics", "Combo system", "Score tracking", "Mobile-optimized controls"]
    },
    {
      title: "Journal Management",
      description: "Create, edit, and organize learning journal entries with rich content.",
      features: ["Markdown editor", "Tag organization", "Search and filter", "PDF/JSON export"]
    },
    {
      title: "Project Tracking",
      description: "Track learning projects with tech stack and progress information.",
      features: ["Project CRUD", "Tech stack tags", "Status tracking", "Project analytics"]
    },
    {
      title: "Analytics Dashboard",
      description: "Visual insights into learning patterns and progress.",
      features: ["Entry statistics", "Tag distribution charts", "Activity heatmaps", "Progress tracking"]
    }
  ]
};

export default function PortfolioPage() {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPos = margin;

      const addPage = () => {
        doc.addPage();
        yPos = margin;
      };

      const checkPageBreak = (height: number) => {
        if (yPos + height > pageHeight - margin) {
          addPage();
        }
      };

      const addTitle = (text: string, size: number = 20) => {
        checkPageBreak(15);
        doc.setFontSize(size);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(124, 58, 237);
        doc.text(text, margin, yPos);
        yPos += size * 0.6;
      };

      const addSubtitle = (text: string) => {
        checkPageBreak(12);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(55, 65, 81);
        doc.text(text, margin, yPos);
        yPos += 8;
      };

      const addText = (text: string, indent: number = 0) => {
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(75, 85, 99);
        const lines = doc.splitTextToSize(text, maxWidth - indent);
        lines.forEach((line: string) => {
          checkPageBreak(6);
          doc.text(line, margin + indent, yPos);
          yPos += 6;
        });
      };

      const addBullet = (text: string) => {
        checkPageBreak(6);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(75, 85, 99);
        const lines = doc.splitTextToSize(text, maxWidth - 10);
        doc.text("•", margin + 5, yPos);
        lines.forEach((line: string, i: number) => {
          if (i > 0) checkPageBreak(5);
          doc.text(line, margin + 12, yPos);
          yPos += 5;
        });
      };

      const addSeparator = () => {
        yPos += 5;
        doc.setDrawColor(229, 231, 235);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;
      };

      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(124, 58, 237);
      doc.text("Portfolio Submission", pageWidth / 2, yPos, { align: "center" });
      yPos += 15;

      doc.setFontSize(18);
      doc.setTextColor(55, 65, 81);
      doc.text(portfolioData.projectTitle, pageWidth / 2, yPos, { align: "center" });
      yPos += 12;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(portfolioData.courseName, pageWidth / 2, yPos, { align: "center" });
      yPos += 8;
      doc.text(`Submission Date: ${portfolioData.submissionDate}`, pageWidth / 2, yPos, { align: "center" });
      yPos += 20;

      addSeparator();

      addTitle("Project Overview", 16);
      yPos += 3;
      addText(portfolioData.overview);
      yPos += 10;

      addTitle("Technology Stack", 16);
      yPos += 3;
      
      addSubtitle("Frontend");
      portfolioData.techStack.frontend.forEach(tech => addBullet(tech));
      yPos += 5;
      
      addSubtitle("Backend");
      portfolioData.techStack.backend.forEach(tech => addBullet(tech));
      yPos += 5;
      
      addSubtitle("PWA Technologies");
      portfolioData.techStack.pwa.forEach(tech => addBullet(tech));
      yPos += 5;
      
      addSubtitle("Tools & Libraries");
      portfolioData.techStack.tools.forEach(tech => addBullet(tech));
      
      addSeparator();

      portfolioData.labs.forEach((lab, index) => {
        if (index > 0) {
          checkPageBreak(60);
        }
        
        addTitle(`${lab.title}`, 14);
        yPos += 2;
        addText(lab.description);
        yPos += 5;
        
        addSubtitle("Features Demonstrated:");
        lab.features.forEach(feature => addBullet(feature));
        yPos += 3;
        
        addSubtitle("Technologies Used:");
        addText(lab.technologies.join(", "), 5);
        yPos += 3;
        
        addText(`Demo Path: ${lab.demoPath}`, 5);
        
        if (index < portfolioData.labs.length - 1) {
          yPos += 8;
        }
      });

      addSeparator();

      addTitle("Additional Features", 16);
      yPos += 5;
      
      portfolioData.additionalFeatures.forEach((feature, index) => {
        checkPageBreak(40);
        addSubtitle(feature.title);
        addText(feature.description);
        yPos += 3;
        feature.features.forEach(f => addBullet(f));
        if (index < portfolioData.additionalFeatures.length - 1) {
          yPos += 5;
        }
      });

      addSeparator();

      addTitle("PWA Compliance Checklist", 16);
      yPos += 5;
      
      const pwaChecklist = [
        "HTTPS secure context",
        "Valid Web App Manifest with icons",
        "Service Worker for offline caching",
        "Responsive design (mobile-first)",
        "Offline functionality via IndexedDB",
        "App installable (Add to Home Screen)",
        "Push notification support",
        "Fast loading performance"
      ];
      
      pwaChecklist.forEach(item => {
        checkPageBreak(6);
        doc.setFontSize(10);
        doc.setTextColor(34, 197, 94);
        doc.text("✓", margin + 5, yPos);
        doc.setTextColor(75, 85, 99);
        doc.text(item, margin + 15, yPos);
        yPos += 6;
      });

      addPage();
      
      addTitle("Application Architecture", 16);
      yPos += 5;
      
      const architecture = `
The Learning Journal PWA follows a modern full-stack architecture:

1. Frontend Layer: React 18 with TypeScript provides type-safe component development. Wouter handles client-side routing, while TanStack Query manages server state with caching and synchronization.

2. Styling Layer: Tailwind CSS with Shadcn/UI component library ensures consistent, accessible UI components built on Radix UI primitives.

3. Backend Layer: Express.js serves both the API and static frontend assets. RESTful endpoints handle all CRUD operations with proper validation.

4. Database Layer: PostgreSQL via Neon serverless provides reliable data persistence. Drizzle ORM ensures type-safe database operations.

5. Offline Layer: IndexedDB stores data locally for offline access. A sync queue manages pending operations until connectivity is restored.

6. PWA Layer: Service Worker caches assets and handles offline requests. The Web App Manifest enables installation on mobile devices.
      `.trim();
      
      addText(architecture);

      addSeparator();
      
      addTitle("Conclusion", 16);
      yPos += 5;
      addText("This Learning Journal PWA demonstrates comprehensive knowledge of mobile application development, including modern web technologies, offline-first architecture, and progressive enhancement. The application successfully implements all required lab demonstrations (Labs 3-7) while providing practical functionality for users to track their learning journey.");

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: "center" });
        doc.text("Learning Journal PWA - Portfolio Submission", margin, pageHeight - 10);
      }

      doc.save(`Portfolio_FGCT6021_${format(new Date(), "yyyy-MM-dd")}.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Your portfolio PDF has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Portfolio Submission</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {portfolioData.courseName} - Complete portfolio demonstrating all lab requirements.
          </p>
        </div>

        <Card className="mb-8" data-testid="card-portfolio-download">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Download Portfolio PDF
            </CardTitle>
            <CardDescription>
              Generate a comprehensive PDF document for submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generatePDF} 
              disabled={generating}
              size="lg"
              className="w-full sm:w-auto"
              data-testid="button-download-pdf"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Download Portfolio PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card data-testid="card-project-overview">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground" data-testid="text-project-overview">{portfolioData.overview}</p>
            </CardContent>
          </Card>

          <Card data-testid="card-tech-stack">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Frontend</p>
                <div className="flex flex-wrap gap-1">
                  {portfolioData.techStack.frontend.map((tech, i) => (
                    <Badge key={i} variant="secondary" data-testid={`badge-frontend-${i}`}>{tech}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Backend</p>
                <div className="flex flex-wrap gap-1">
                  {portfolioData.techStack.backend.map((tech, i) => (
                    <Badge key={i} variant="secondary" data-testid={`badge-backend-${i}`}>{tech}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">PWA</p>
                <div className="flex flex-wrap gap-1">
                  {portfolioData.techStack.pwa.map((tech, i) => (
                    <Badge key={i} variant="secondary" data-testid={`badge-pwa-${i}`}>{tech}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4" data-testid="heading-labs">Lab Demonstrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {portfolioData.labs.map((lab) => (
            <Card key={lab.number} data-testid={`card-lab-${lab.number}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {lab.number === 3 && <Code2 className="h-5 w-5 text-blue-500" />}
                  {lab.number === 4 && <Database className="h-5 w-5 text-green-500" />}
                  {lab.number === 5 && <FileText className="h-5 w-5 text-amber-500" />}
                  {lab.number === 6 && <Server className="h-5 w-5 text-purple-500" />}
                  {lab.number === 7 && <Smartphone className="h-5 w-5 text-pink-500" />}
                  Lab {lab.number}
                </CardTitle>
                <CardDescription>{lab.title.replace(`Lab ${lab.number}: `, '')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3" data-testid={`text-lab-${lab.number}-desc`}>{lab.description}</p>
                <div className="space-y-2">
                  {lab.features.slice(0, 4).map((feature, i) => (
                    <div key={i} className="flex items-start gap-2" data-testid={`feature-lab-${lab.number}-${i}`}>
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {lab.features.length > 4 && (
                    <p className="text-xs text-muted-foreground pl-6">
                      +{lab.features.length - 4} more features
                    </p>
                  )}
                </div>
                <Link href={lab.demoPath}>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    data-testid={`button-view-lab-${lab.number}`}
                  >
                    View Demo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4" data-testid="heading-features">Additional Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {portfolioData.additionalFeatures.map((feature, index) => (
            <Card key={index} data-testid={`card-feature-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {index === 0 && <Gamepad2 className="h-5 w-5 text-red-500" />}
                  {index === 1 && <BookOpen className="h-5 w-5 text-blue-500" />}
                  {index === 2 && <Layers className="h-5 w-5 text-green-500" />}
                  {index === 3 && <Globe className="h-5 w-5 text-purple-500" />}
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3" data-testid={`text-feature-${index}-desc`}>{feature.description}</p>
                <div className="flex flex-wrap gap-1">
                  {feature.features.map((f, i) => (
                    <Badge key={i} variant="outline" className="text-xs" data-testid={`badge-feature-${index}-${i}`}>
                      {f}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card data-testid="card-pwa-checklist">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              PWA Compliance
            </CardTitle>
            <CardDescription>All requirements for a Progressive Web App</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "HTTPS Secure",
                "Web Manifest",
                "Service Worker",
                "Responsive",
                "Offline Support",
                "Installable",
                "Push Notifications",
                "Fast Loading"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted" data-testid={`pwa-check-${i}`}>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm" data-testid={`text-pwa-check-${i}`}>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
