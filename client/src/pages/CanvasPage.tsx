import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Minus,
  Save,
  Image,
  X,
  Paintbrush,
  MousePointer
} from "lucide-react";

type Tool = "pen" | "eraser" | "rectangle" | "circle" | "line" | "fill" | "select";

interface DrawingState {
  dataUrl: string;
}

const PRESET_COLORS = [
  "#7C3AED", "#EC4899", "#3B82F6", "#10B981", 
  "#F59E0B", "#EF4444", "#6366F1", "#14B8A6",
  "#F97316", "#8B5CF6", "#000000", "#FFFFFF",
];

export default function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#7C3AED");
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState<DrawingState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showGallery, setShowGallery] = useState(false);
  const [savedDrawings, setSavedDrawings] = useState<{ id: number; data: string; createdAt: string }[]>([]);
  const { toast } = useToast();
  
  const historyRef = useRef<DrawingState[]>([]);
  const historyIndexRef = useRef(-1);
  
  const canvasWidth = 900;
  const canvasHeight = 600;

  useEffect(() => {
    historyRef.current = history;
  }, [history]);
  
  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  useEffect(() => {
    const drawings = JSON.parse(localStorage.getItem("canvas-drawings") || "[]");
    setSavedDrawings(drawings);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayCanvasRef.current;
    if (!canvas || !overlay) return;

    const ctx = canvas.getContext("2d");
    const overlayCtx = overlay.getContext("2d");
    if (!ctx || !overlayCtx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    overlay.width = canvasWidth;
    overlay.height = canvasHeight;
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Initial save to history
    const dataUrl = canvas.toDataURL();
    setHistory([{ dataUrl }]);
    setHistoryIndex(0);
  }, []);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL();
    const currentIndex = historyIndexRef.current;
    const currentHistory = historyRef.current;
    
    const newHistory = currentHistory.slice(0, currentIndex + 1);
    newHistory.push({ dataUrl });
    if (newHistory.length > 50) newHistory.shift();
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, []);

  const restoreFromHistory = useCallback((historyState: DrawingState[], index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !historyState[index]) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const img = new window.Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, 0, 0);
    };
    img.src = historyState[index].dataUrl;
  }, []);

  const undo = useCallback(() => {
    const currentIndex = historyIndexRef.current;
    const currentHistory = historyRef.current;
    
    if (currentIndex <= 0) return;
    const newIndex = currentIndex - 1;
    setHistoryIndex(newIndex);
    restoreFromHistory(currentHistory, newIndex);
  }, [restoreFromHistory]);

  const redo = useCallback(() => {
    const currentIndex = historyIndexRef.current;
    const currentHistory = historyRef.current;
    
    if (currentIndex >= currentHistory.length - 1) return;
    const newIndex = currentIndex + 1;
    setHistoryIndex(newIndex);
    restoreFromHistory(currentHistory, newIndex);
  }, [restoreFromHistory]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;
    
    if ("touches" in e) {
      // Use touches for touchstart/touchmove, changedTouches for touchend
      const touch = e.touches[0] || e.changedTouches?.[0];
      if (!touch) return { x: 0, y: 0 };
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const clearOverlay = () => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
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
    } else if (tool === "fill") {
      floodFill(Math.floor(pos.x), Math.floor(pos.y), color);
      saveToHistory();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const overlay = overlayCanvasRef.current;
    if (!canvas || !overlay) return;
    
    const ctx = canvas.getContext("2d");
    const overlayCtx = overlay.getContext("2d");
    if (!ctx || !overlayCtx) return;
    
    const pos = getCoordinates(e);
    
    if (tool === "pen" || tool === "eraser") {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === "rectangle" || tool === "circle" || tool === "line") {
      clearOverlay();
      overlayCtx.strokeStyle = color;
      overlayCtx.lineWidth = brushSize;
      overlayCtx.lineCap = "round";
      overlayCtx.lineJoin = "round";
      
      if (tool === "rectangle") {
        overlayCtx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === "circle") {
        const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
        overlayCtx.beginPath();
        overlayCtx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
        overlayCtx.stroke();
      } else if (tool === "line") {
        overlayCtx.beginPath();
        overlayCtx.moveTo(startPos.x, startPos.y);
        overlayCtx.lineTo(pos.x, pos.y);
        overlayCtx.stroke();
      }
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
      ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
    } else if (tool === "circle") {
      const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.stroke();
    } else if (tool === "line") {
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    
    clearOverlay();
    setIsDrawing(false);
    
    if (tool !== "fill") {
      saveToHistory();
    }
  };

  const floodFill = (startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;
    
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };
    
    const fill = hexToRgb(fillColor);
    const startIdx = (startY * canvasWidth + startX) * 4;
    const startR = data[startIdx];
    const startG = data[startIdx + 1];
    const startB = data[startIdx + 2];
    
    if (startR === fill.r && startG === fill.g && startB === fill.b) return;
    
    const stack = [[startX, startY]];
    const visited = new Set<string>();
    
    while (stack.length > 0 && stack.length < 100000) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;
      
      if (visited.has(key)) continue;
      if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) continue;
      
      const idx = (y * canvasWidth + x) * 4;
      if (Math.abs(data[idx] - startR) > 10 || 
          Math.abs(data[idx + 1] - startG) > 10 || 
          Math.abs(data[idx + 2] - startB) > 10) continue;
      
      visited.add(key);
      data[idx] = fill.r;
      data[idx + 1] = fill.g;
      data[idx + 2] = fill.b;
      data[idx + 3] = 255;
      
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    saveToHistory();
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = `drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    
    toast({ title: "Downloaded!", description: "Your drawing has been saved to your device." });
  };

  const saveToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const newDrawing = {
      id: Date.now(),
      data: canvas.toDataURL("image/png"),
      createdAt: new Date().toISOString(),
    };
    
    const drawings = [...savedDrawings, newDrawing];
    setSavedDrawings(drawings);
    localStorage.setItem("canvas-drawings", JSON.stringify(drawings));
    
    toast({ title: "Saved!", description: "Your drawing has been saved to the gallery." });
  };

  const loadFromGallery = (dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const img = new window.Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      saveToHistory();
      setShowGallery(false);
    };
    img.src = dataUrl;
  };

  const deleteFromGallery = (id: number) => {
    const drawings = savedDrawings.filter(d => d.id !== id);
    setSavedDrawings(drawings);
    localStorage.setItem("canvas-drawings", JSON.stringify(drawings));
  };

  const tools = [
    { id: "select" as Tool, icon: MousePointer, label: "Select" },
    { id: "pen" as Tool, icon: Pencil, label: "Pen" },
    { id: "eraser" as Tool, icon: Eraser, label: "Eraser" },
    { id: "line" as Tool, icon: Minus, label: "Line" },
    { id: "rectangle" as Tool, icon: Square, label: "Rectangle" },
    { id: "circle" as Tool, icon: Circle, label: "Circle" },
    { id: "fill" as Tool, icon: Paintbrush, label: "Fill" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-950 dark:to-purple-950 py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent" data-testid="text-canvas-title">
            Creative Canvas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Express yourself with professional drawing tools</p>
        </div>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-purple-200/50 dark:border-purple-800/30 shadow-xl">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-purple-100 dark:border-purple-900/50">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                {tools.map((t) => (
                  <Button
                    key={t.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setTool(t.id)}
                    className={`px-3 ${tool === t.id ? 'bg-purple-500 text-white hover:bg-purple-600' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    title={t.label}
                    data-testid={`button-tool-${t.id}`}
                  >
                    <t.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Size:</span>
                  <div className="w-24">
                    <Slider
                      value={[brushSize]}
                      onValueChange={(value) => setBrushSize(value[0])}
                      min={1}
                      max={50}
                      step={1}
                      data-testid="slider-brush-size"
                    />
                  </div>
                  <span className="text-xs font-medium w-6">{brushSize}</span>
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

                <div className="flex items-center gap-1">
                  {PRESET_COLORS.slice(0, 8).map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-md border-2 transition-all ${
                        color === c ? "ring-2 ring-purple-500 ring-offset-1 scale-110" : "border-slate-200 dark:border-slate-600"
                      }`}
                      style={{ backgroundColor: c }}
                      data-testid={`button-color-${c.replace("#", "")}`}
                    />
                  ))}
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-6 h-6 rounded-md cursor-pointer border-0"
                    title="Custom color"
                    data-testid="input-color-picker"
                  />
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0} data-testid="button-undo" title="Undo">
                    <Undo2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1} data-testid="button-redo" title="Redo">
                    <Redo2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={clearCanvas} data-testid="button-clear" title="Clear canvas">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowGallery(true)} data-testid="button-gallery" title="Gallery">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={saveToGallery} data-testid="button-save" title="Save to gallery">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={downloadCanvas} className="bg-purple-500 hover:bg-purple-600 text-white" data-testid="button-download">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            <div 
              ref={containerRef}
              className="relative bg-white rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 mx-auto"
              style={{ maxWidth: canvasWidth, aspectRatio: `${canvasWidth}/${canvasHeight}` }}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="absolute inset-0 w-full h-full"
                style={{ 
                  touchAction: "none",
                  cursor: tool === "pen" ? "crosshair" : 
                         tool === "eraser" ? "cell" : 
                         tool === "fill" ? "cell" : "crosshair"
                }}
                data-testid="canvas-drawing"
              />
              <canvas
                ref={overlayCanvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
            </div>

            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
              <span>Current tool: <strong className="text-foreground">{tools.find(t => t.id === tool)?.label}</strong></span>
              <span>Color: <span className="inline-block w-3 h-3 rounded-sm align-middle" style={{ backgroundColor: color }} /></span>
              <span>History: {historyIndex + 1}/{history.length}</span>
            </div>
          </CardContent>
        </Card>

        {showGallery && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowGallery(false)}>
            <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Gallery</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowGallery(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {savedDrawings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Image className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No saved drawings yet</p>
                    <p className="text-sm">Create something and save it to see it here!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
                    {savedDrawings.map((drawing) => (
                      <div key={drawing.id} className="relative group">
                        <img
                          src={drawing.data}
                          alt="Saved drawing"
                          className="w-full aspect-[3/2] object-cover rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                          onClick={() => loadFromGallery(drawing.data)}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => { e.stopPropagation(); deleteFromGallery(drawing.id); }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1 text-center">
                          {new Date(drawing.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
