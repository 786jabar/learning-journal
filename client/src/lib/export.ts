import type { JournalEntry, Project } from "@shared/schema";
import { format } from "date-fns";
import { jsPDF } from "jspdf";

export type ExportFormat = "json" | "markdown" | "pdf";

export function exportToJSON<T>(data: T[], filename: string) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  downloadBlob(blob, `${filename}.json`);
}

export function exportJournalsToMarkdown(journals: JournalEntry[]) {
  const sortedJournals = [...journals].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let markdown = "# Learning Journal Entries\n\n";
  markdown += `Exported on ${format(new Date(), "MMMM dd, yyyy")}\n\n`;
  markdown += "---\n\n";

  sortedJournals.forEach((journal) => {
    markdown += `## ${journal.title}\n\n`;
    markdown += `**Date:** ${format(new Date(journal.date), "MMMM dd, yyyy")}\n\n`;
    
    if (journal.tags && journal.tags.length > 0) {
      markdown += `**Tags:** ${journal.tags.join(", ")}\n\n`;
    }
    
    markdown += `${journal.content}\n\n`;
    markdown += "---\n\n";
  });

  const blob = new Blob([markdown], { type: "text/markdown" });
  downloadBlob(blob, `learning-journal-${format(new Date(), "yyyy-MM-dd")}.md`);
}

export function exportProjectsToMarkdown(projects: Project[]) {
  let markdown = "# Learning Journal Projects\n\n";
  markdown += `Exported on ${format(new Date(), "MMMM dd, yyyy")}\n\n`;
  markdown += "---\n\n";

  projects.forEach((project) => {
    markdown += `## ${project.name}\n\n`;
    markdown += `${project.description}\n\n`;
    
    if (project.techStack && project.techStack.length > 0) {
      markdown += `**Tech Stack:**\n`;
      project.techStack.forEach((tech: string) => {
        markdown += `- ${tech}\n`;
      });
      markdown += "\n";
    }
    
    markdown += "---\n\n";
  });

  const blob = new Blob([markdown], { type: "text/markdown" });
  downloadBlob(blob, `learning-journal-projects-${format(new Date(), "yyyy-MM-dd")}.md`);
}

export async function exportJournalsToPDF(journals: JournalEntry[]) {
  const sortedJournals = [...journals].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPos = margin;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Learning Journal Entries", margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Exported on ${format(new Date(), "MMMM dd, yyyy")}`, margin, yPos);
  yPos += 15;

  sortedJournals.forEach((journal, index) => {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    const titleLines = doc.splitTextToSize(journal.title, maxWidth);
    doc.text(titleLines, margin, yPos);
    yPos += titleLines.length * 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(format(new Date(journal.date), "MMMM dd, yyyy"), margin, yPos);
    yPos += 8;

    if (journal.tags && journal.tags.length > 0) {
      doc.setFontSize(9);
      doc.text(`Tags: ${journal.tags.join(", ")}`, margin, yPos);
      yPos += 8;
    }

    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);
    const contentLines = doc.splitTextToSize(journal.content, maxWidth);
    contentLines.forEach((line: string) => {
      if (yPos > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(line, margin, yPos);
      yPos += 6;
    });

    if (index < sortedJournals.length - 1) {
      yPos += 10;
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 15;
    }
  });

  doc.save(`learning-journal-${format(new Date(), "yyyy-MM-dd")}.pdf`);
}

export async function exportProjectsToPDF(projects: Project[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPos = margin;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Learning Journal Projects", margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Exported on ${format(new Date(), "MMMM dd, yyyy")}`, margin, yPos);
  yPos += 15;

  projects.forEach((project, index) => {
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    const nameLines = doc.splitTextToSize(project.name, maxWidth);
    doc.text(nameLines, margin, yPos);
    yPos += nameLines.length * 7;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    const descLines = doc.splitTextToSize(project.description, maxWidth);
    descLines.forEach((line: string) => {
      if (yPos > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(line, margin, yPos);
      yPos += 6;
    });

    if (project.techStack && project.techStack.length > 0) {
      yPos += 5;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(55, 65, 81);
      doc.text("Tech Stack:", margin, yPos);
      yPos += 6;

      doc.setFont("helvetica", "normal");
      const techText = project.techStack.join(", ");
      const techLines = doc.splitTextToSize(techText, maxWidth);
      techLines.forEach((line: string) => {
        if (yPos > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(line, margin, yPos);
        yPos += 6;
      });
    }

    if (index < projects.length - 1) {
      yPos += 10;
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 15;
    }
  });

  doc.save(`learning-journal-projects-${format(new Date(), "yyyy-MM-dd")}.pdf`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
