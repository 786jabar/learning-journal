import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileJson, FileText, File } from "lucide-react";
import type { ExportFormat } from "@/lib/export";

interface ExportDialogProps {
  onExport: (format: ExportFormat) => void;
  title: string;
  description: string;
}

export function ExportDialog({ onExport, title, description }: ExportDialogProps) {
  const [open, setOpen] = useState(false);

  const handleExport = (format: ExportFormat) => {
    onExport(format);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="button-export">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-export">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 pt-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleExport("json")}
            data-testid="button-export-json"
          >
            <FileJson className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">JSON</div>
              <div className="text-sm text-muted-foreground">
                Complete data backup (importable)
              </div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleExport("markdown")}
            data-testid="button-export-markdown"
          >
            <FileText className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Markdown</div>
              <div className="text-sm text-muted-foreground">
                Portable format for viewing and editing
              </div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleExport("pdf")}
            data-testid="button-export-pdf"
          >
            <File className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">PDF</div>
              <div className="text-sm text-muted-foreground">
                Formatted document for sharing and printing
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
