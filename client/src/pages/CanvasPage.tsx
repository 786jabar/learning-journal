import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  Pencil, 
  Eraser, 
  Square, 
  Circle, 
  Trash2, 
  Download, 
  Undo2, 
  Redo2,
  Palette,
  Save
} from "lucide-react";

type Tool = "pen" | "eraser" | "rectangle" | "circle";

interface DrawingState {
  imageData: ImageData | null;
}

const COLORS = [
  "#7C3AED", // Purple
  "#EC4899", // Pink
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#000000", // Black
  "#FFFFFF", // White
];

export default function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#7C3AED");
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState<DrawingState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { toast } = useToast();
  const historyRef = useRef<DrawingState[]>([]);
  const historyIndexRef = useRef(-1);

  useEffect(() => {
    historyRef.current = history;
    historyIndexRef.current = historyIndex;
  }, [history, historyIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      canvas.width = rect.width * dpr;
      canvas.height = 500 * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = "500px";
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, rect.width, 500);
      
      if (imageData.width > 0 && imageData.height > 0) {
        ctx.putImageData(imageData, 0, 0);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    saveToHistory();
    
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const currentHistory = historyRef.current;
    const currentIndex = historyIndexRef.current;
    const newHistory = currentHistory.slice(0, currentIndex + 1);
    newHistory.push({ imageData });
    
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, []);

  const undo = () => {
    if (historyIndex <= 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const newIndex = historyIndex - 1;
    const state = history[newIndex];
    
    if (state.imageData) {
      ctx.putImageData(state.imageData, 0, 0);
    }
    
    setHistoryIndex(newIndex);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const newIndex = historyIndex + 1;
    const state = history[newIndex];
    
    if (state.imageData) {
      ctx.putImageData(state.imageData, 0, 0);
    }
    
    setHistoryIndex(newIndex);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const pos = getCoordinates(e);
    setStartPos(pos);
    setIsDrawing(true);
    
    if (tool === "pen" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const pos = getCoordinates(e);
    
    if (tool === "pen" || tool === "eraser") {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const pos = getCoordinates(e);
    
    if (tool === "rectangle") {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(
        startPos.x,
        startPos.y,
        pos.x - startPos.x,
        pos.y - startPos.y
      );
    } else if (tool === "circle") {
      const radius = Math.sqrt(
        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.stroke();
    }
    
    setIsDrawing(false);
    saveToHistory();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, rect.width, 500);
    
    saveToHistory();
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = `drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const saveToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const drawings = JSON.parse(localStorage.getItem("canvas-drawings") || "[]");
    drawings.push({
      id: Date.now(),
      data: canvas.toDataURL("image/png"),
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("canvas-drawings", JSON.stringify(drawings));
    toast({
      title: "Drawing saved",
      description: "Your drawing has been saved to the gallery!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-canvas-title">
            Drawing Canvas
          </h1>
          <p className="text-gray-600 dark:text-purple-200">Express your creativity with our drawing tools!</p>
        </div>

        <div className="grid lg:grid-cols-[200px_1fr] gap-6">
          <Card className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border-purple-200 dark:border-white/20 h-fit">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={tool === "pen" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTool("pen")}
                  className="w-full"
                  data-testid="button-tool-pen"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Pen
                </Button>
                <Button
                  variant={tool === "eraser" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTool("eraser")}
                  className="w-full"
                  data-testid="button-tool-eraser"
                >
                  <Eraser className="h-4 w-4 mr-1" />
                  Eraser
                </Button>
                <Button
                  variant={tool === "rectangle" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTool("rectangle")}
                  className="w-full"
                  data-testid="button-tool-rectangle"
                >
                  <Square className="h-4 w-4 mr-1" />
                  Rect
                </Button>
                <Button
                  variant={tool === "circle" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTool("circle")}
                  className="w-full"
                  data-testid="button-tool-circle"
                >
                  <Circle className="h-4 w-4 mr-1" />
                  Circle
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Colors</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                        color === c ? "ring-2 ring-purple-500 ring-offset-2" : ""
                      }`}
                      style={{ backgroundColor: c, borderColor: c === "#FFFFFF" ? "#ccc" : c }}
                      data-testid={`button-color-${c.replace("#", "")}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Brush Size: {brushSize}px
                </label>
                <Slider
                  value={[brushSize]}
                  onValueChange={(value) => setBrushSize(value[0])}
                  min={1}
                  max={50}
                  step={1}
                  data-testid="slider-brush-size"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  data-testid="button-undo"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  data-testid="button-redo"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCanvas}
                  data-testid="button-clear"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={saveToGallery}
                  data-testid="button-save"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white"
                  onClick={downloadCanvas}
                  data-testid="button-download"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-purple-200 dark:border-white/20 overflow-hidden">
            <CardContent className="p-4">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full cursor-crosshair rounded-lg border border-gray-200 dark:border-gray-700"
                style={{ touchAction: "none" }}
                data-testid="canvas-drawing"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
