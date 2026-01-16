import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import { 
  Download, 
  FileText, 
  Loader2,
  Save,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import localforage from "localforage";

interface PortfolioData {
  studentName: string;
  programme: string;
  githubLink: string;
  liveProjectLink: string;
  introduction: string;
  lab1: string;
  lab2_q1: string;
  lab2_q2: string;
  lab2_q3: string;
  lab3_q1: string;
  lab3_q2: string;
  lab3_q3: string;
  lab4_q1: string;
  lab4_q2: string;
  lab4_q3: string;
  lab4_q4: string;
  lab5_q1: string;
  lab5_q2: string;
  lab5_q3: string;
  lab5_q4: string;
  lab6_q1: string;
  lab6_q2: string;
  lab6_q3: string;
  lab6_q4: string;
  lab6_q5: string;
  lab7_q1: string;
  lab7_q2: string;
  lab7_q3: string;
  lab7_q4: string;
  mini_q1: string;
  mini_q2: string;
  mini_q3: string;
  mini_q4: string;
  appendices: string;
  bibliography: string;
}

const defaultData: PortfolioData = {
  studentName: "",
  programme: "BSc Computer Science",
  githubLink: "",
  liveProjectLink: "",
  introduction: "",
  lab1: "",
  lab2_q1: "",
  lab2_q2: "",
  lab2_q3: "",
  lab3_q1: "",
  lab3_q2: "",
  lab3_q3: "",
  lab4_q1: "",
  lab4_q2: "",
  lab4_q3: "",
  lab4_q4: "",
  lab5_q1: "",
  lab5_q2: "",
  lab5_q3: "",
  lab5_q4: "",
  lab6_q1: "",
  lab6_q2: "",
  lab6_q3: "",
  lab6_q4: "",
  lab6_q5: "",
  lab7_q1: "",
  lab7_q2: "",
  lab7_q3: "",
  lab7_q4: "",
  mini_q1: "",
  mini_q2: "",
  mini_q3: "",
  mini_q4: "",
  appendices: "",
  bibliography: ""
};

const STORAGE_KEY = "portfolio_data";

export default function PortfolioPage() {
  const { toast } = useToast();
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    intro: true,
    lab1: false,
    lab2: false,
    lab3: false,
    lab4: false,
    lab5: false,
    lab6: false,
    lab7: false,
    mini: false,
    appendix: false
  });

  useEffect(() => {
    localforage.getItem<PortfolioData>(STORAGE_KEY).then((saved) => {
      if (saved) setData(saved);
    });
  }, []);

  const updateField = (field: keyof PortfolioData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const saveData = async () => {
    setSaving(true);
    try {
      await localforage.setItem(STORAGE_KEY, data);
      toast({ title: "Saved", description: "Portfolio data saved locally" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const generatePDF = async () => {
    setGenerating(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 25;
      const maxWidth = pageWidth - 2 * margin;
      let yPos = margin;
      let pageNum = 1;

      const addPage = () => {
        doc.addPage();
        yPos = margin;
        pageNum++;
      };

      const checkPageBreak = (height: number) => {
        if (yPos + height > pageHeight - 30) {
          addPage();
        }
      };

      const addCenteredText = (text: string, size: number, bold: boolean = false) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.text(text, pageWidth / 2, yPos, { align: "center" });
        yPos += size * 0.5;
      };

      const addHeading = (text: string, level: number = 1) => {
        checkPageBreak(20);
        const size = level === 1 ? 16 : level === 2 ? 14 : 12;
        doc.setFontSize(size);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(text, margin, yPos);
        yPos += size * 0.6;
      };

      const addQuestion = (text: string) => {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(50, 50, 50);
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          checkPageBreak(6);
          doc.text(line, margin, yPos);
          yPos += 6;
        });
        yPos += 2;
      };

      const addParagraph = (text: string) => {
        if (!text.trim()) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(150, 150, 150);
          doc.text("[Answer not provided]", margin, yPos);
          yPos += 8;
          return;
        }
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 30, 30);
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          checkPageBreak(6);
          doc.text(line, margin, yPos);
          yPos += 6;
        });
        yPos += 4;
      };

      const addSpacer = (height: number = 10) => {
        yPos += height;
      };

      doc.setTextColor(0, 0, 0);
      yPos = 60;
      addCenteredText("UNIVERSITY FOR THE CREATIVE ARTS", 14, true);
      yPos += 30;
      addCenteredText("Portfolio", 24, true);
      yPos += 10;
      addCenteredText("FGCT6021 Mobile Application Development", 12);
      yPos += 40;
      addCenteredText(data.studentName || "Your Name", 16, true);
      yPos += 8;
      addCenteredText(data.programme || "BSc Computer Science", 12);
      yPos += 30;
      addCenteredText("January 2026", 12);

      yPos = pageHeight - 60;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const declaration = `I, ${data.studentName || "Your Name"}, confirm that the work presented in this portfolio is my own. ChatGPT (OpenAI) was used to paraphrase selected sentences and review grammar to improve the clarity of the writing. Where information has been derived from other sources, I confirm that this has been indicated in the portfolio.`;
      const declLines = doc.splitTextToSize(declaration, maxWidth);
      declLines.forEach((line: string) => {
        doc.text(line, margin, yPos);
        yPos += 5;
      });
      yPos += 10;
      doc.text(`© 2026, ${data.studentName || "Your Name"}`, margin, yPos);
      yPos += 5;
      doc.text("School of Games & Creative Technology", margin, yPos);
      yPos += 5;
      doc.text("University for the Creative Arts", margin, yPos);

      addPage();
      addHeading("Contents", 1);
      addSpacer(10);
      const toc = [
        "1  Introduction",
        "2  Lab 1 – Introduction to Mobile App",
        "3  Lab 2 – Frontend Fundamentals",
        "4  Lab 3 – JavaScript & DOM Manipulation",
        "5  Lab 4 – API",
        "6  Lab 5 – Python & JSON",
        "7  Lab 6 – Frontend & Backend",
        "8  Lab 7 – PWA",
        "9  Mini Project",
        "Appendices",
        "Bibliography"
      ];
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      toc.forEach(item => {
        doc.text(item, margin, yPos);
        yPos += 8;
      });

      addPage();
      addHeading("1  Introduction", 1);
      addSpacer(5);
      addParagraph(data.introduction);

      addSpacer(15);
      addHeading("2  Lab 1 – Introduction to Mobile App", 1);
      addSpacer(5);
      addParagraph(data.lab1);
      if (data.githubLink || data.liveProjectLink) {
        addSpacer(5);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Links:", margin, yPos);
        yPos += 6;
        doc.setFont("helvetica", "normal");
        if (data.githubLink) {
          doc.text(`GitHub: ${data.githubLink}`, margin, yPos);
          yPos += 5;
        }
        if (data.liveProjectLink) {
          doc.text(`Live Project: ${data.liveProjectLink}`, margin, yPos);
          yPos += 5;
        }
      }

      addPage();
      addHeading("3  Lab 2 – Frontend Fundamentals", 1);
      addSpacer(5);
      addQuestion("3.1 How did you approach mobile-first design?");
      addParagraph(data.lab2_q1);
      addQuestion("3.2 What was the most useful HTML or CSS concept you applied this week?");
      addParagraph(data.lab2_q2);
      addQuestion("3.3 What part of HTML or CSS did you find most challenging or confusing?");
      addParagraph(data.lab2_q3);

      addPage();
      addHeading("4  Lab 3 – JavaScript & DOM Manipulation", 1);
      addSpacer(5);
      addQuestion("4.1 Which DOM selection methods did you use, and why did you choose them?");
      addParagraph(data.lab3_q1);
      addQuestion("4.2 What was the most challenging part about linking JavaScript with your HTML?");
      addParagraph(data.lab3_q2);
      addQuestion("4.3 How did you test and debug your JavaScript code?");
      addParagraph(data.lab3_q3);

      addPage();
      addHeading("5  Lab 4 – API", 1);
      addSpacer(5);
      addQuestion("5.1 Which Storage, Browser, and Third-Party APIs did you choose, and why?");
      addParagraph(data.lab4_q1);
      addQuestion("5.2 How did you integrate each API with DOM manipulation?");
      addParagraph(data.lab4_q2);
      addQuestion("5.3 What challenges did you encounter, and how did you solve them?");
      addParagraph(data.lab4_q3);
      addQuestion("5.4 In what ways do these APIs improve your Learning Journal PWA?");
      addParagraph(data.lab4_q4);

      addPage();
      addHeading("6  Lab 5 – Python & JSON", 1);
      addSpacer(5);
      addQuestion("6.1 How is storing data in a JSON file different from using browser storage?");
      addParagraph(data.lab5_q1);
      addQuestion("6.2 How did you use Python to create or update your JSON file?");
      addParagraph(data.lab5_q2);
      addQuestion("6.3 What does your PWA show locally, and what will users see on GitHub? Are they the same? Why or why not?");
      addParagraph(data.lab5_q3);
      addQuestion("6.4 What extra feature did you add to your PWA using the JSON file, and why?");
      addParagraph(data.lab5_q4);

      addPage();
      addHeading("7  Lab 6 – Frontend & Backend", 1);
      addSpacer(5);
      addQuestion("7.1 Why is the frontend–backend connection important?");
      addParagraph(data.lab6_q1);
      addQuestion("7.2 Which HTTP methods did you use in Flask, and why?");
      addParagraph(data.lab6_q2);
      addQuestion("7.3 What is the difference between using Flask to store and load JSON data and reading JSON directly in the browser?");
      addParagraph(data.lab6_q3);
      addQuestion("7.4 Did you face any difficulties when running your project on PythonAnywhere? How did you handle them?");
      addParagraph(data.lab6_q4);
      addQuestion("7.5 What extra feature did you build into your PWA with Flask, and why did you add it?");
      addParagraph(data.lab6_q5);

      addPage();
      addHeading("8  Lab 7 – PWA", 1);
      addSpacer(5);
      addQuestion("8.1 Why is it useful to enhance your Flask app with PWA features?");
      addParagraph(data.lab7_q1);
      addQuestion("8.2 What did you use to support offline access and dynamic data?");
      addParagraph(data.lab7_q2);
      addQuestion("8.3 What extra feature did you add, and why?");
      addParagraph(data.lab7_q3);
      addQuestion("8.4 Did you face any challenges deploying your PWA, and how did you solve them?");
      addParagraph(data.lab7_q4);

      addPage();
      addHeading("9  Mini Project", 1);
      addSpacer(5);
      addQuestion("9.1 What additional features did you add to your Learning Journal?");
      addParagraph(data.mini_q1);
      addQuestion("9.2 Why did you choose your mini project idea?");
      addParagraph(data.mini_q2);
      addQuestion("9.3 What technical challenges did you face and how did you solve them?");
      addParagraph(data.mini_q3);
      addQuestion("9.4 What would you improve if given more time?");
      addParagraph(data.mini_q4);

      addPage();
      addHeading("Appendices", 1);
      addSpacer(5);
      addParagraph(data.appendices || "Include screenshots, code snippets, diagrams, or other supporting materials that are part of your work but too detailed to include in the main sections.");

      addSpacer(20);
      addHeading("Bibliography", 1);
      addSpacer(5);
      addParagraph(data.bibliography || "List any resources, tutorials, or documentation you used. Use a consistent referencing style for all sources.");

      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(`${i}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      }

      doc.save(`Portfolio_FGCT6021_${data.studentName?.replace(/\s+/g, '_') || 'Student'}.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Your portfolio PDF has been downloaded successfully."
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const SectionHeader = ({ id, title, expanded }: { id: string; title: string; expanded: boolean }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between gap-2 p-4 text-left hover-elevate rounded-t-lg"
      data-testid={`button-section-${id}`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" data-testid="heading-portfolio">Portfolio Submission</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            FGCT6021 Mobile Application Development - Fill in your answers below and download your portfolio PDF.
          </p>
        </div>

        <Card className="mb-6" data-testid="card-portfolio-actions">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={saveData} 
                disabled={saving}
                variant="outline"
                className="flex-1"
                data-testid="button-save-portfolio"
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Progress
              </Button>
              <Button 
                onClick={generatePDF} 
                disabled={generating}
                className="flex-1"
                data-testid="button-download-pdf"
              >
                {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4" data-testid="card-student-info">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentName">Your Name</Label>
                <Input
                  id="studentName"
                  value={data.studentName}
                  onChange={(e) => updateField("studentName", e.target.value)}
                  placeholder="Enter your full name"
                  data-testid="input-student-name"
                />
              </div>
              <div>
                <Label htmlFor="programme">Programme</Label>
                <Input
                  id="programme"
                  value={data.programme}
                  onChange={(e) => updateField("programme", e.target.value)}
                  placeholder="e.g., BSc Computer Science"
                  data-testid="input-programme"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="githubLink">GitHub Repository URL</Label>
                <Input
                  id="githubLink"
                  value={data.githubLink}
                  onChange={(e) => updateField("githubLink", e.target.value)}
                  placeholder="https://github.com/..."
                  data-testid="input-github-link"
                />
              </div>
              <div>
                <Label htmlFor="liveProjectLink">Live Project URL</Label>
                <Input
                  id="liveProjectLink"
                  value={data.liveProjectLink}
                  onChange={(e) => updateField("liveProjectLink", e.target.value)}
                  placeholder="https://..."
                  data-testid="input-live-link"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4" data-testid="card-introduction">
          <SectionHeader id="intro" title="1. Introduction (100-250 words)" expanded={expandedSections.intro} />
          {expandedSections.intro && (
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Provide an overview of your project, including its purpose and main objectives. Explain the aim of this portfolio and what it documents. Reflect on your overall experience during the project.
              </p>
              <Textarea
                value={data.introduction}
                onChange={(e) => updateField("introduction", e.target.value)}
                placeholder="Write your introduction here..."
                className="min-h-[150px]"
                data-testid="textarea-introduction"
              />
            </CardContent>
          )}
        </Card>

        <Card className="mb-4" data-testid="card-lab1">
          <SectionHeader id="lab1" title="2. Lab 1 – Introduction to Mobile App (250-400 words)" expanded={expandedSections.lab1} />
          {expandedSections.lab1 && (
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Write a short reflection on the steps you have followed using GitHub, VS Code, PythonAnywhere, Android Studio, PWA, and Kotlin code. Describe any challenges you faced while running the code.
              </p>
              <Textarea
                value={data.lab1}
                onChange={(e) => updateField("lab1", e.target.value)}
                placeholder="Write your Lab 1 reflection here..."
                className="min-h-[200px]"
                data-testid="textarea-lab1"
              />
            </CardContent>
          )}
        </Card>

        <Card className="mb-4" data-testid="card-lab2">
          <SectionHeader id="lab2" title="3. Lab 2 – Frontend Fundamentals (150-300 words)" expanded={expandedSections.lab2} />
          {expandedSections.lab2 && (
            <CardContent className="space-y-4">
              <div>
                <Label className="font-medium">3.1 How did you approach mobile-first design?</Label>
                <Textarea
                  value={data.lab2_q1}
                  onChange={(e) => updateField("lab2_q1", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab2-q1"
                />
              </div>
              <div>
                <Label className="font-medium">3.2 What was the most useful HTML or CSS concept you applied this week?</Label>
                <Textarea
                  value={data.lab2_q2}
                  onChange={(e) => updateField("lab2_q2", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab2-q2"
                />
              </div>
              <div>
                <Label className="font-medium">3.3 What part of HTML or CSS did you find most challenging or confusing?</Label>
                <Textarea
                  value={data.lab2_q3}
                  onChange={(e) => updateField("lab2_q3", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab2-q3"
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="mb-4" data-testid="card-lab3">
          <SectionHeader id="lab3" title="4. Lab 3 – JavaScript & DOM Manipulation (150-300 words)" expanded={expandedSections.lab3} />
          {expandedSections.lab3 && (
            <CardContent className="space-y-4">
              <div>
                <Label className="font-medium">4.1 Which DOM selection methods did you use, and why did you choose them?</Label>
                <Textarea
                  value={data.lab3_q1}
                  onChange={(e) => updateField("lab3_q1", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab3-q1"
                />
              </div>
              <div>
                <Label className="font-medium">4.2 What was the most challenging part about linking JavaScript with your HTML?</Label>
                <Textarea
                  value={data.lab3_q2}
                  onChange={(e) => updateField("lab3_q2", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab3-q2"
                />
              </div>
              <div>
                <Label className="font-medium">4.3 How did you test and debug your JavaScript code?</Label>
                <Textarea
                  value={data.lab3_q3}
                  onChange={(e) => updateField("lab3_q3", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab3-q3"
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="mb-4" data-testid="card-lab4">
          <SectionHeader id="lab4" title="5. Lab 4 – API (200-400 words)" expanded={expandedSections.lab4} />
          {expandedSections.lab4 && (
            <CardContent className="space-y-4">
              <div>
                <Label className="font-medium">5.1 Which Storage, Browser, and Third-Party APIs did you choose, and why?</Label>
                <Textarea
                  value={data.lab4_q1}
                  onChange={(e) => updateField("lab4_q1", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab4-q1"
                />
              </div>
              <div>
                <Label className="font-medium">5.2 How did you integrate each API with DOM manipulation?</Label>
                <Textarea
                  value={data.lab4_q2}
                  onChange={(e) => updateField("lab4_q2", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab4-q2"
                />
              </div>
              <div>
                <Label className="font-medium">5.3 What challenges did you encounter, and how did you solve them?</Label>
                <Textarea
                  value={data.lab4_q3}
                  onChange={(e) => updateField("lab4_q3", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab4-q3"
                />
              </div>
              <div>
                <Label className="font-medium">5.4 In what ways do these APIs improve your Learning Journal PWA?</Label>
                <Textarea
                  value={data.lab4_q4}
                  onChange={(e) => updateField("lab4_q4", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab4-q4"
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="mb-4" data-testid="card-lab5">
          <SectionHeader id="lab5" title="6. Lab 5 – Python & JSON (200-400 words)" expanded={expandedSections.lab5} />
          {expandedSections.lab5 && (
            <CardContent className="space-y-4">
              <div>
                <Label className="font-medium">6.1 How is storing data in a JSON file different from using browser storage?</Label>
                <Textarea
                  value={data.lab5_q1}
                  onChange={(e) => updateField("lab5_q1", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab5-q1"
                />
              </div>
              <div>
                <Label className="font-medium">6.2 How did you use Python to create or update your JSON file?</Label>
                <Textarea
                  value={data.lab5_q2}
                  onChange={(e) => updateField("lab5_q2", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab5-q2"
                />
              </div>
              <div>
                <Label className="font-medium">6.3 What does your PWA show locally, and what will users see on GitHub? Are they the same? Why or why not?</Label>
                <Textarea
                  value={data.lab5_q3}
                  onChange={(e) => updateField("lab5_q3", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab5-q3"
                />
              </div>
              <div>
                <Label className="font-medium">6.4 What extra feature did you add to your PWA using the JSON file, and why?</Label>
                <Textarea
                  value={data.lab5_q4}
                  onChange={(e) => updateField("lab5_q4", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab5-q4"
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="mb-4" data-testid="card-lab6">
          <SectionHeader id="lab6" title="7. Lab 6 – Frontend & Backend (250-500 words)" expanded={expandedSections.lab6} />
          {expandedSections.lab6 && (
            <CardContent className="space-y-4">
              <div>
                <Label className="font-medium">7.1 Why is the frontend–backend connection important?</Label>
                <Textarea
                  value={data.lab6_q1}
                  onChange={(e) => updateField("lab6_q1", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab6-q1"
                />
              </div>
              <div>
                <Label className="font-medium">7.2 Which HTTP methods did you use in Flask, and why?</Label>
                <Textarea
                  value={data.lab6_q2}
                  onChange={(e) => updateField("lab6_q2", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab6-q2"
                />
              </div>
              <div>
                <Label className="font-medium">7.3 What is the difference between using Flask to store and load JSON data and reading JSON directly in the browser?</Label>
                <Textarea
                  value={data.lab6_q3}
                  onChange={(e) => updateField("lab6_q3", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab6-q3"
                />
              </div>
              <div>
                <Label className="font-medium">7.4 Did you face any difficulties when running your project on PythonAnywhere? How did you handle them?</Label>
                <Textarea
                  value={data.lab6_q4}
                  onChange={(e) => updateField("lab6_q4", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab6-q4"
                />
              </div>
              <div>
                <Label className="font-medium">7.5 What extra feature did you build into your PWA with Flask, and why did you add it?</Label>
                <Textarea
                  value={data.lab6_q5}
                  onChange={(e) => updateField("lab6_q5", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab6-q5"
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="mb-4" data-testid="card-lab7">
          <SectionHeader id="lab7" title="8. Lab 7 – PWA (200-400 words)" expanded={expandedSections.lab7} />
          {expandedSections.lab7 && (
            <CardContent className="space-y-4">
              <div>
                <Label className="font-medium">8.1 Why is it useful to enhance your Flask app with PWA features?</Label>
                <Textarea
                  value={data.lab7_q1}
                  onChange={(e) => updateField("lab7_q1", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab7-q1"
                />
              </div>
              <div>
                <Label className="font-medium">8.2 What did you use to support offline access and dynamic data?</Label>
                <Textarea
                  value={data.lab7_q2}
                  onChange={(e) => updateField("lab7_q2", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab7-q2"
                />
              </div>
              <div>
                <Label className="font-medium">8.3 What extra feature did you add, and why?</Label>
                <Textarea
                  value={data.lab7_q3}
                  onChange={(e) => updateField("lab7_q3", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab7-q3"
                />
              </div>
              <div>
                <Label className="font-medium">8.4 Did you face any challenges deploying your PWA, and how did you solve them?</Label>
                <Textarea
                  value={data.lab7_q4}
                  onChange={(e) => updateField("lab7_q4", e.target.value)}
                  placeholder="50-100 words..."
                  className="min-h-[100px] mt-2"
                  data-testid="textarea-lab7-q4"
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="mb-4" data-testid="card-mini-project">
          <SectionHeader id="mini" title="9. Mini Project (600-1000 words)" expanded={expandedSections.mini} />
          {expandedSections.mini && (
            <CardContent className="space-y-4">
              <div>
                <Label className="font-medium">9.1 What additional features did you add to your Learning Journal?</Label>
                <Textarea
                  value={data.mini_q1}
                  onChange={(e) => updateField("mini_q1", e.target.value)}
                  placeholder="150-250 words..."
                  className="min-h-[150px] mt-2"
                  data-testid="textarea-mini-q1"
                />
              </div>
              <div>
                <Label className="font-medium">9.2 Why did you choose your mini project idea?</Label>
                <Textarea
                  value={data.mini_q2}
                  onChange={(e) => updateField("mini_q2", e.target.value)}
                  placeholder="150-250 words..."
                  className="min-h-[150px] mt-2"
                  data-testid="textarea-mini-q2"
                />
              </div>
              <div>
                <Label className="font-medium">9.3 What technical challenges did you face and how did you solve them?</Label>
                <Textarea
                  value={data.mini_q3}
                  onChange={(e) => updateField("mini_q3", e.target.value)}
                  placeholder="150-250 words..."
                  className="min-h-[150px] mt-2"
                  data-testid="textarea-mini-q3"
                />
              </div>
              <div>
                <Label className="font-medium">9.4 What would you improve if given more time?</Label>
                <Textarea
                  value={data.mini_q4}
                  onChange={(e) => updateField("mini_q4", e.target.value)}
                  placeholder="150-250 words..."
                  className="min-h-[150px] mt-2"
                  data-testid="textarea-mini-q4"
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="mb-4" data-testid="card-appendix">
          <SectionHeader id="appendix" title="Appendices & Bibliography" expanded={expandedSections.appendix} />
          {expandedSections.appendix && (
            <CardContent className="space-y-4">
              <div>
                <Label className="font-medium">Appendices</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Include screenshots, code snippets, diagrams, or other supporting materials.
                </p>
                <Textarea
                  value={data.appendices}
                  onChange={(e) => updateField("appendices", e.target.value)}
                  placeholder="Describe your appendices here..."
                  className="min-h-[100px]"
                  data-testid="textarea-appendices"
                />
              </div>
              <div>
                <Label className="font-medium">Bibliography</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  List any resources, tutorials, or documentation you used.
                </p>
                <Textarea
                  value={data.bibliography}
                  onChange={(e) => updateField("bibliography", e.target.value)}
                  placeholder="List your references here..."
                  className="min-h-[100px]"
                  data-testid="textarea-bibliography"
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card data-testid="card-final-download">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={saveData} 
                disabled={saving}
                variant="outline"
                className="flex-1"
                data-testid="button-save-final"
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Progress
              </Button>
              <Button 
                onClick={generatePDF} 
                disabled={generating}
                className="flex-1"
                data-testid="button-download-final"
              >
                {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                Download Portfolio PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
