import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { 
  Trophy, 
  RotateCcw, 
  Pause,
  Play,
  Volume2,
  VolumeX,
  Zap,
  Sparkles,
  Star,
  Target,
  Flame,
  Heart,
  Lightbulb,
  Shuffle,
  ChevronRight,
  Gift,
  Hammer,
  Candy,
  MapPin
} from "lucide-react";

const GRID_SIZE = 8;
const BASE_POINTS = 10;
const HINT_DELAY = 4000;

const CANDY_TYPES = [
  { gradient: "from-rose-400 via-rose-500 to-rose-600", glow: "shadow-rose-500/60", name: "rose", color: "#f43f5e" },
  { gradient: "from-orange-400 via-orange-500 to-orange-600", glow: "shadow-orange-500/60", name: "orange", color: "#f97316" },
  { gradient: "from-yellow-300 via-yellow-400 to-yellow-500", glow: "shadow-yellow-400/60", name: "yellow", color: "#eab308" },
  { gradient: "from-emerald-400 via-emerald-500 to-emerald-600", glow: "shadow-emerald-500/60", name: "green", color: "#22c55e" },
  { gradient: "from-sky-400 via-sky-500 to-sky-600", glow: "shadow-sky-500/60", name: "blue", color: "#0ea5e9" },
  { gradient: "from-violet-400 via-violet-500 to-violet-600", glow: "shadow-violet-500/60", name: "purple", color: "#8b5cf6" },
];

const COMBO_MESSAGES = [
  { min: 2, text: "Sweet!", color: "#fbbf24" },
  { min: 3, text: "Tasty!", color: "#fb923c" },
  { min: 4, text: "Delicious!", color: "#f472b6" },
  { min: 5, text: "Divine!", color: "#a855f7" },
  { min: 6, text: "Sugar Rush!", color: "#ef4444" },
];

type SpecialType = "none" | "striped-h" | "striped-v" | "wrapped" | "color-bomb";
type GameScreen = "menu" | "level-preview" | "playing" | "paused" | "level-complete" | "game-over";
type BlockerType = "ice" | "chocolate" | "licorice" | "jelly";
type IngredientType = "cherry" | "hazelnut";

interface Candy {
  id: number;
  colorIndex: number;
  special: SpecialType;
  isMatched: boolean;
  isNew: boolean;
  isFalling: boolean;
  ingredient?: IngredientType;
}

interface BlockerCell {
  type: BlockerType;
  layers: number;
}

interface Position {
  row: number;
  col: number;
}

interface BlockerPosition {
  row: number;
  col: number;
  type: BlockerType;
  layers?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  type: "sparkle" | "star" | "explosion";
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

interface LevelObjective {
  type: "score" | "clear-color" | "clear-jelly" | "clear-ice" | "clear-chocolate" | "clear-blockers" | "drop-ingredients" | "collect-candies";
  target: number;
  current: number;
  colorIndex?: number;
  ingredientType?: IngredientType;
}

interface IngredientSpawn {
  col: number;
  type: IngredientType;
}

interface LevelData {
  level: number;
  moves: number;
  objectives: LevelObjective[];
  starThresholds: [number, number, number];
  blockers?: BlockerPosition[];
  ingredients?: IngredientSpawn[];
}

const LEVELS: LevelData[] = [
  { 
    level: 1, 
    moves: 25, 
    objectives: [{ type: "score", target: 1500, current: 0 }], 
    starThresholds: [1500, 3000, 5000] 
  },
  { 
    level: 2, 
    moves: 25, 
    objectives: [{ type: "score", target: 2000, current: 0 }, { type: "clear-jelly", target: 10, current: 0 }], 
    starThresholds: [2000, 4000, 6000],
    blockers: [
      { row: 2, col: 2, type: "jelly" }, { row: 2, col: 3, type: "jelly" }, { row: 2, col: 4, type: "jelly" }, { row: 2, col: 5, type: "jelly" },
      { row: 5, col: 2, type: "jelly" }, { row: 5, col: 3, type: "jelly" }, { row: 5, col: 4, type: "jelly" }, { row: 5, col: 5, type: "jelly" },
      { row: 3, col: 1, type: "jelly" }, { row: 4, col: 6, type: "jelly" },
    ]
  },
  { 
    level: 3, 
    moves: 30, 
    objectives: [{ type: "score", target: 3000, current: 0 }, { type: "clear-ice", target: 12, current: 0 }], 
    starThresholds: [3000, 5000, 8000],
    blockers: [
      { row: 1, col: 3, type: "ice", layers: 2 }, { row: 1, col: 4, type: "ice", layers: 2 },
      { row: 2, col: 2, type: "ice", layers: 1 }, { row: 2, col: 5, type: "ice", layers: 1 },
      { row: 3, col: 1, type: "ice", layers: 1 }, { row: 3, col: 6, type: "ice", layers: 1 },
      { row: 4, col: 1, type: "ice", layers: 1 }, { row: 4, col: 6, type: "ice", layers: 1 },
      { row: 5, col: 2, type: "ice", layers: 2 }, { row: 5, col: 5, type: "ice", layers: 2 },
      { row: 6, col: 3, type: "ice", layers: 1 }, { row: 6, col: 4, type: "ice", layers: 1 },
    ]
  },
  { 
    level: 4, 
    moves: 30, 
    objectives: [{ type: "clear-chocolate", target: 8, current: 0 }, { type: "score", target: 2500, current: 0 }], 
    starThresholds: [2500, 5000, 7500],
    blockers: [
      { row: 3, col: 3, type: "chocolate" }, { row: 3, col: 4, type: "chocolate" },
      { row: 4, col: 3, type: "chocolate" }, { row: 4, col: 4, type: "chocolate" },
      { row: 2, col: 2, type: "licorice" }, { row: 2, col: 5, type: "licorice" },
      { row: 5, col: 2, type: "licorice" }, { row: 5, col: 5, type: "licorice" },
    ]
  },
  { 
    level: 5, 
    moves: 35, 
    objectives: [{ type: "drop-ingredients", target: 3, current: 0, ingredientType: "cherry" }], 
    starThresholds: [4000, 7000, 10000],
    ingredients: [
      { col: 2, type: "cherry" },
      { col: 4, type: "cherry" },
      { col: 6, type: "cherry" },
    ]
  },
  { 
    level: 6, 
    moves: 30, 
    objectives: [{ type: "collect-candies", target: 30, current: 0, colorIndex: 0 }, { type: "collect-candies", target: 30, current: 0, colorIndex: 2 }], 
    starThresholds: [3500, 6000, 9000],
  },
  { 
    level: 7, 
    moves: 35, 
    objectives: [{ type: "clear-blockers", target: 20, current: 0 }, { type: "score", target: 5000, current: 0 }], 
    starThresholds: [5000, 8000, 12000],
    blockers: [
      { row: 1, col: 1, type: "jelly" }, { row: 1, col: 2, type: "jelly" }, { row: 1, col: 5, type: "jelly" }, { row: 1, col: 6, type: "jelly" },
      { row: 2, col: 1, type: "jelly" }, { row: 2, col: 2, type: "jelly" }, { row: 2, col: 5, type: "jelly" }, { row: 2, col: 6, type: "jelly" },
      { row: 5, col: 1, type: "jelly" }, { row: 5, col: 2, type: "jelly" }, { row: 5, col: 5, type: "jelly" }, { row: 5, col: 6, type: "jelly" },
      { row: 3, col: 3, type: "ice", layers: 2 }, { row: 3, col: 4, type: "ice", layers: 2 },
      { row: 4, col: 3, type: "ice", layers: 2 }, { row: 4, col: 4, type: "ice", layers: 2 },
    ]
  },
  { 
    level: 8, 
    moves: 40, 
    objectives: [
      { type: "drop-ingredients", target: 2, current: 0, ingredientType: "cherry" },
      { type: "drop-ingredients", target: 2, current: 0, ingredientType: "hazelnut" },
    ], 
    starThresholds: [6000, 10000, 15000],
    ingredients: [
      { col: 1, type: "cherry" },
      { col: 3, type: "hazelnut" },
      { col: 5, type: "cherry" },
      { col: 6, type: "hazelnut" },
    ],
    blockers: [
      { row: 4, col: 0, type: "licorice" }, { row: 4, col: 7, type: "licorice" },
    ]
  },
];

export default function CandyGamePage() {
  const [grid, setGrid] = useState<Candy[][]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [level, setLevel] = useState(1);
  const [selectedCandy, setSelectedCandy] = useState<Position | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [gameScreen, setGameScreen] = useState<GameScreen>("menu");
  const [comboCount, setComboCount] = useState(0);
  const [chainMultiplier, setChainMultiplier] = useState(1);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [swappingCandies, setSwappingCandies] = useState<{pos1: Position, pos2: Position} | null>(null);
  const [screenShake, setScreenShake] = useState(0);
  const [objectives, setObjectives] = useState<LevelObjective[]>([]);
  const [totalCleared, setTotalCleared] = useState<Record<number, number>>({});
  const [blockerGrid, setBlockerGrid] = useState<(BlockerCell | null)[][]>([]);
  const [blockersCleared, setBlockersCleared] = useState<Record<BlockerType, number>>({} as Record<BlockerType, number>);
  const [ingredientsDropped, setIngredientsDropped] = useState<Record<IngredientType, number>>({ cherry: 0, hazelnut: 0 });
  const [levelIngredients, setLevelIngredients] = useState<IngredientSpawn[]>([]);
  const [ingredientSpawnIndex, setIngredientSpawnIndex] = useState(0);
  const [hintPosition, setHintPosition] = useState<Position | null>(null);
  const [showNoMoves, setShowNoMoves] = useState(false);
  const [dragStart, setDragStart] = useState<{pos: Position, x: number, y: number} | null>(null);
  const [highScores, setHighScores] = useState<Record<number, { score: number; stars: number }>>({});
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());
  
  const [lives, setLives] = useState(() => {
    const saved = localStorage.getItem("candyRush_lives");
    return saved ? Math.min(JSON.parse(saved), 5) : 5;
  });
  const [maxLives] = useState(5);
  const [lastLifeTime, setLastLifeTime] = useState(() => {
    const saved = localStorage.getItem("candyRush_lastLifeTime");
    return saved ? JSON.parse(saved) : Date.now();
  });
  const [boosters, setBoosters] = useState(() => {
    const saved = localStorage.getItem("candyRush_boosters");
    return saved ? JSON.parse(saved) : { hammer: 3, shuffle: 2, lollipop: 1 };
  });
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("candyRush_coins");
    return saved ? JSON.parse(saved) : 500;
  });
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(() => {
    const saved = localStorage.getItem("candyRush_lastClaimDate");
    if (!saved) return false;
    const lastClaimDate = new Date(saved).toDateString();
    const today = new Date().toDateString();
    return lastClaimDate === today;
  });
  const [dailyStreak, setDailyStreak] = useState(() => {
    const saved = localStorage.getItem("candyRush_dailyStreak");
    const lastDate = localStorage.getItem("candyRush_lastClaimDate");
    if (!saved || !lastDate) return 1;
    const lastClaimDate = new Date(lastDate);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastClaimDate.toDateString() === yesterday.toDateString()) {
      return JSON.parse(saved);
    } else if (lastClaimDate.toDateString() === new Date().toDateString()) {
      return JSON.parse(saved);
    }
    return 1;
  });
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [selectedBooster, setSelectedBooster] = useState<"hammer" | "lollipop" | null>(null);
  const LIFE_REGEN_TIME = 300000;
  
  const boardRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);
  const hintTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getNextId = useCallback(() => {
    idCounterRef.current += 1;
    return idCounterRef.current;
  }, []);

  const createCandy = useCallback((isNew = false): Candy => ({
    id: getNextId(),
    colorIndex: Math.floor(Math.random() * CANDY_TYPES.length),
    special: "none",
    isMatched: false,
    isNew,
    isFalling: false,
  }), [getNextId]);

  const initializeGrid = useCallback((levelBlockers?: BlockerPosition[]) => {
    const newGrid: Candy[][] = [];
    const newBlockerGrid: (BlockerCell | null)[][] = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      const rowArray: Candy[] = [];
      const blockerRow: (BlockerCell | null)[] = [];
      
      for (let col = 0; col < GRID_SIZE; col++) {
        const blocker = levelBlockers?.find(b => b.row === row && b.col === col);
        
        if (blocker && (blocker.type === "chocolate" || blocker.type === "licorice")) {
          rowArray.push({
            id: getNextId(),
            colorIndex: -1,
            special: "none",
            isMatched: false,
            isNew: false,
            isFalling: false,
          });
          blockerRow.push({ type: blocker.type, layers: 1 });
        } else {
          let candy = createCandy();
          
          while (
            (col >= 2 && 
             rowArray[col - 1].colorIndex === candy.colorIndex && 
             rowArray[col - 2].colorIndex === candy.colorIndex) ||
            (row >= 2 && 
             newGrid[row - 1][col].colorIndex === candy.colorIndex && 
             newGrid[row - 2][col].colorIndex === candy.colorIndex)
          ) {
            candy = createCandy();
          }
          
          rowArray.push(candy);
          
          if (blocker) {
            blockerRow.push({ type: blocker.type, layers: blocker.layers || 1 });
          } else {
            blockerRow.push(null);
          }
        }
      }
      newGrid.push(rowArray);
      newBlockerGrid.push(blockerRow);
    }
    
    setBlockerGrid(newBlockerGrid);
    return newGrid;
  }, [createCandy, getNextId]);

  const triggerScreenShake = useCallback((intensity: number) => {
    setScreenShake(intensity);
    setTimeout(() => setScreenShake(0), 300);
  }, []);

  const spawnFloatingText = useCallback((text: string, row: number, col: number, color: string) => {
    const id = Date.now() * 1000 + Math.random() * 100000;
    setFloatingTexts(prev => [...prev, {
      id,
      text,
      x: col * 12.5 + 6.25,
      y: row * 12.5 + 6.25,
      color,
    }]);
    
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1000);
  }, []);

  const spawnParticles = useCallback((row: number, col: number, colorIndex: number, count = 8, type: "sparkle" | "star" | "explosion" = "sparkle") => {
    const color = CANDY_TYPES[colorIndex]?.color || '#ffffff';
    
    const newParticles: Particle[] = [];
    const baseId = Date.now() * 1000 + Math.random() * 10000;
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: baseId + i + row * 1000 + col * 100,
        x: col * 12.5 + 6.25,
        y: row * 12.5 + 6.25,
        color,
        size: type === "explosion" ? Math.random() * 12 + 6 : Math.random() * 8 + 4,
        velocityX: (Math.random() - 0.5) * (type === "explosion" ? 8 : 4),
        velocityY: (Math.random() - 0.5) * (type === "explosion" ? 8 : 4) - 2,
        type,
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 800);
  }, []);

  const findMatches = useCallback((currentGrid: Candy[][]): { matches: Position[], special: { pos: Position, type: SpecialType }[] } => {
    const matches: Position[] = [];
    const specialCandies: { pos: Position, type: SpecialType }[] = [];
    const checked = new Set<string>();
    
    for (let row = 0; row < GRID_SIZE; row++) {
      let col = 0;
      while (col < GRID_SIZE) {
        const color = currentGrid[row][col].colorIndex;
        if (color === -1) { col++; continue; }
        
        let matchLen = 1;
        while (col + matchLen < GRID_SIZE && currentGrid[row][col + matchLen].colorIndex === color) {
          matchLen++;
        }
        
        if (matchLen >= 3) {
          for (let i = 0; i < matchLen; i++) {
            const key = `${row}-${col + i}`;
            if (!checked.has(key)) {
              matches.push({ row, col: col + i });
              checked.add(key);
            }
          }
          
          if (matchLen === 4) {
            specialCandies.push({ pos: { row, col: col + 1 }, type: "striped-h" });
          } else if (matchLen >= 5) {
            specialCandies.push({ pos: { row, col: col + 2 }, type: "color-bomb" });
          }
        }
        
        col += Math.max(1, matchLen);
      }
    }
    
    for (let col = 0; col < GRID_SIZE; col++) {
      let row = 0;
      while (row < GRID_SIZE) {
        const color = currentGrid[row][col].colorIndex;
        if (color === -1) { row++; continue; }
        
        let matchLen = 1;
        while (row + matchLen < GRID_SIZE && currentGrid[row + matchLen][col].colorIndex === color) {
          matchLen++;
        }
        
        if (matchLen >= 3) {
          for (let i = 0; i < matchLen; i++) {
            const key = `${row + i}-${col}`;
            if (!checked.has(key)) {
              matches.push({ row: row + i, col });
              checked.add(key);
            }
          }
          
          if (matchLen === 4) {
            const existing = specialCandies.find(s => s.pos.row === row + 1 && s.pos.col === col);
            if (existing) {
              existing.type = "wrapped";
            } else {
              specialCandies.push({ pos: { row: row + 1, col }, type: "striped-v" });
            }
          } else if (matchLen >= 5) {
            specialCandies.push({ pos: { row: row + 2, col }, type: "color-bomb" });
          }
        }
        
        row += Math.max(1, matchLen);
      }
    }
    
    return { matches, special: specialCandies };
  }, []);

  const findValidMoves = useCallback((currentGrid: Candy[][]): Position[] => {
    const validMoves: Position[] = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const directions = [
          { dr: 0, dc: 1 },
          { dr: 1, dc: 0 },
        ];
        
        for (const { dr, dc } of directions) {
          const newRow = row + dr;
          const newCol = col + dc;
          
          if (newRow < GRID_SIZE && newCol < GRID_SIZE) {
            const testGrid = currentGrid.map(r => r.map(c => ({ ...c })));
            const temp = testGrid[row][col];
            testGrid[row][col] = testGrid[newRow][newCol];
            testGrid[newRow][newCol] = temp;
            
            const { matches } = findMatches(testGrid);
            if (matches.length > 0) {
              validMoves.push({ row, col });
            }
          }
        }
      }
    }
    
    return validMoves;
  }, [findMatches]);

  const shuffleBoard = useCallback(() => {
    setShowNoMoves(true);
    setTimeout(() => {
      setShowNoMoves(false);
      const newGrid = initializeGrid();
      setGrid(newGrid);
      
      let validMoves = findValidMoves(newGrid);
      let attempts = 0;
      while (validMoves.length === 0 && attempts < 10) {
        const shuffledGrid = initializeGrid();
        validMoves = findValidMoves(shuffledGrid);
        if (validMoves.length > 0) {
          setGrid(shuffledGrid);
          break;
        }
        attempts++;
      }
    }, 1500);
  }, [initializeGrid, findValidMoves]);

  const activateSpecialCandy = useCallback((currentGrid: Candy[][], row: number, col: number, targetColor?: number): Position[] => {
    const candy = currentGrid[row][col];
    const affected: Position[] = [];
    
    if (candy.special === "striped-h") {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (c !== col) affected.push({ row, col: c });
      }
    } else if (candy.special === "striped-v") {
      for (let r = 0; r < GRID_SIZE; r++) {
        if (r !== row) affected.push({ row: r, col });
      }
    } else if (candy.special === "wrapped") {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const r = row + dr;
          const c = col + dc;
          if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && !(dr === 0 && dc === 0)) {
            affected.push({ row: r, col: c });
          }
        }
      }
    } else if (candy.special === "color-bomb") {
      const colorToClear = targetColor !== undefined ? targetColor : candy.colorIndex;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (currentGrid[r][c].colorIndex === colorToClear) {
            affected.push({ row: r, col: c });
          }
        }
      }
    }
    
    return affected;
  }, []);

  const removeMatches = useCallback((currentGrid: Candy[][], matches: Position[], specialToCreate: { pos: Position, type: SpecialType }[]): Candy[][] => {
    const newGrid = currentGrid.map(row => row.map(candy => ({ ...candy, isNew: false, isFalling: false })));
    const colorsCounted: Record<number, number> = {};
    const blockersClearedThisTurn: Record<BlockerType, number> = { ice: 0, chocolate: 0, jelly: 0, licorice: 0 };
    
    const allAffected = new Set<string>();
    const adjacentToMatch = new Set<string>();
    
    for (const pos of matches) {
      allAffected.add(`${pos.row}-${pos.col}`);
      const candy = newGrid[pos.row][pos.col];
      
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of directions) {
        const nr = pos.row + dr;
        const nc = pos.col + dc;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
          adjacentToMatch.add(`${nr}-${nc}`);
        }
      }
      
      if (candy.special !== "none") {
        const specialAffected = activateSpecialCandy(newGrid, pos.row, pos.col);
        for (const sPos of specialAffected) {
          allAffected.add(`${sPos.row}-${sPos.col}`);
        }
        triggerScreenShake(candy.special === "color-bomb" ? 8 : 4);
        spawnParticles(pos.row, pos.col, candy.colorIndex, 16, "explosion");
      }
    }

    setBlockerGrid(prev => {
      const newBlockerGrid = prev.map(row => row.map(cell => cell ? { ...cell } : null));
      
      Array.from(allAffected).forEach(key => {
        const [r, c] = key.split("-").map(Number);
        const blocker = newBlockerGrid[r]?.[c];
        
        if (blocker) {
          if (blocker.type === "jelly") {
            newBlockerGrid[r][c] = null;
            blockersClearedThisTurn.jelly++;
          } else if (blocker.type === "chocolate") {
            newBlockerGrid[r][c] = null;
            blockersClearedThisTurn.chocolate++;
          }
        }
      });
      
      Array.from(adjacentToMatch).forEach(key => {
        const [r, c] = key.split("-").map(Number);
        const blocker = newBlockerGrid[r]?.[c];
        
        if (blocker && blocker.type === "ice") {
          if (blocker.layers > 1) {
            newBlockerGrid[r][c] = { ...blocker, layers: blocker.layers - 1 };
          } else {
            newBlockerGrid[r][c] = null;
          }
          blockersClearedThisTurn.ice++;
        }
      });
      
      return newBlockerGrid;
    });

    setBlockersCleared(prev => ({
      ice: (prev.ice || 0) + blockersClearedThisTurn.ice,
      chocolate: (prev.chocolate || 0) + blockersClearedThisTurn.chocolate,
      jelly: (prev.jelly || 0) + blockersClearedThisTurn.jelly,
      licorice: (prev.licorice || 0) + blockersClearedThisTurn.licorice,
    }));

    Array.from(allAffected).forEach(key => {
      const [r, c] = key.split("-").map(Number);
      const candy = newGrid[r][c];
      
      if (candy.colorIndex !== -1) {
        colorsCounted[candy.colorIndex] = (colorsCounted[candy.colorIndex] || 0) + 1;
        spawnParticles(r, c, candy.colorIndex);
      }
      
      newGrid[r][c] = { ...newGrid[r][c], colorIndex: -1, isMatched: true, special: "none" };
    });

    for (const { pos, type } of specialToCreate) {
      if (newGrid[pos.row][pos.col].colorIndex === -1) {
        const originalColor = currentGrid[pos.row][pos.col].colorIndex;
        newGrid[pos.row][pos.col] = {
          id: getNextId(),
          colorIndex: originalColor,
          special: type,
          isMatched: false,
          isNew: true,
          isFalling: false,
        };
      }
    }

    setTotalCleared(prev => {
      const updated = { ...prev };
      for (const [color, count] of Object.entries(colorsCounted)) {
        updated[Number(color)] = (updated[Number(color)] || 0) + count;
      }
      return updated;
    });

    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        const candy = newGrid[row][col];
        if (candy.ingredient && row === GRID_SIZE - 1) {
          setIngredientsDropped(prev => ({
            ...prev,
            [candy.ingredient!]: (prev[candy.ingredient!] || 0) + 1
          }));
          spawnParticles(row, col, 3, 16, "star");
          spawnFloatingText("Collected!", row, col, "#22c55e");
          newGrid[row][col] = { ...candy, ingredient: undefined, colorIndex: -1, isMatched: true };
        }
      }
    }

    for (let col = 0; col < GRID_SIZE; col++) {
      let emptySpaces = 0;
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        if (newGrid[row][col].colorIndex === -1 && !newGrid[row][col].ingredient) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          newGrid[row + emptySpaces][col] = { ...newGrid[row][col], isFalling: true };
          newGrid[row][col] = { ...newGrid[row][col], colorIndex: -1, isMatched: true, ingredient: undefined };
        }
      }
      
      for (let row = emptySpaces - 1; row >= 0; row--) {
        const newCandy = createCandy(true);
        
        if (row === 0 && levelIngredients.length > 0 && ingredientSpawnIndex < levelIngredients.length) {
          const nextIngredient = levelIngredients[ingredientSpawnIndex];
          if (nextIngredient && col === nextIngredient.col) {
            newCandy.ingredient = nextIngredient.type;
            setIngredientSpawnIndex(prev => prev + 1);
          }
        }
        
        newGrid[row][col] = newCandy;
      }
    }
    
    return newGrid;
  }, [activateSpecialCandy, createCandy, getNextId, spawnParticles, spawnFloatingText, triggerScreenShake, levelIngredients, ingredientSpawnIndex]);

  const processMatches = useCallback(async (currentGrid: Candy[][]): Promise<Candy[][]> => {
    let grid = currentGrid;
    let hasMatches = true;
    let localCombo = 0;
    let localChain = 1;
    
    while (hasMatches) {
      const { matches, special } = findMatches(grid);
      
      if (matches.length > 0) {
        localCombo++;
        setComboCount(localCombo);
        
        const basePoints = matches.length * BASE_POINTS * localChain;
        const bonusPoints = Math.floor(basePoints * (localCombo > 1 ? localCombo * 0.5 : 0));
        const totalPoints = basePoints + bonusPoints;
        
        setScore(prev => {
          const newScore = prev + totalPoints;
          setObjectives(objs => objs.map(obj => 
            obj.type === "score" ? { ...obj, current: newScore } : obj
          ));
          return newScore;
        });
        
        if (localCombo >= 2) {
          const message = COMBO_MESSAGES.find(m => localCombo >= m.min) || COMBO_MESSAGES[0];
          const centerRow = Math.floor(matches.reduce((a, m) => a + m.row, 0) / matches.length);
          const centerCol = Math.floor(matches.reduce((a, m) => a + m.col, 0) / matches.length);
          spawnFloatingText(message.text, centerRow, centerCol, message.color);
          
          if (localCombo >= 3) {
            triggerScreenShake(localCombo * 2);
          }
        }
        
        grid = removeMatches(grid, matches, special);
        setGrid(grid);
        
        await new Promise(resolve => setTimeout(resolve, 350));
        localChain++;
      } else {
        hasMatches = false;
      }
    }
    
    const validMoves = findValidMoves(grid);
    if (validMoves.length === 0 && gameScreen === "playing") {
      shuffleBoard();
    }
    
    setChainMultiplier(1);
    setComboCount(0);
    return grid;
  }, [findMatches, removeMatches, spawnFloatingText, triggerScreenShake, findValidMoves, shuffleBoard, gameScreen]);

  const swapCandies = useCallback(async (pos1: Position, pos2: Position) => {
    if (isAnimating || gameScreen !== "playing") return;
    
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    
    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      setIsAnimating(true);
      setSwappingCandies({ pos1, pos2 });
      setHintPosition(null);
      setLastMoveTime(Date.now());
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const newGrid = grid.map(row => row.map(c => ({ ...c })));
      const temp = newGrid[pos1.row][pos1.col];
      newGrid[pos1.row][pos1.col] = newGrid[pos2.row][pos2.col];
      newGrid[pos2.row][pos2.col] = temp;
      
      setGrid(newGrid);
      setSwappingCandies(null);
      
      await new Promise(resolve => setTimeout(resolve, 100));

      const candy1 = newGrid[pos1.row][pos1.col];
      const candy2 = newGrid[pos2.row][pos2.col];
      const hasSpecial = candy1.special !== "none" || candy2.special !== "none";

      if (hasSpecial) {
        let specialActivated = false;
        const colorsCounted: Record<number, number> = {};

        const isStriped = (s: SpecialType) => s === "striped-h" || s === "striped-v";

        if (candy1.special === "color-bomb" && candy2.special === "color-bomb") {
          triggerScreenShake(15);
          spawnFloatingText("MEGA BLAST!", pos1.row, pos1.col, "#ff0000");
          
          for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
              if (newGrid[r][c].colorIndex !== -1) {
                spawnParticles(r, c, newGrid[r][c].colorIndex, 16, "explosion");
                colorsCounted[newGrid[r][c].colorIndex] = (colorsCounted[newGrid[r][c].colorIndex] || 0) + 1;
                newGrid[r][c] = { ...newGrid[r][c], colorIndex: -1, isMatched: true, special: "none" };
              }
            }
          }
          setScore(prev => prev + 5000);
          specialActivated = true;
        }
        else if ((candy1.special === "color-bomb" && isStriped(candy2.special)) || 
                 (candy2.special === "color-bomb" && isStriped(candy1.special))) {
          const stripedCandy = isStriped(candy1.special) ? candy1 : candy2;
          const targetColor = stripedCandy.colorIndex;
          
          triggerScreenShake(12);
          spawnFloatingText("Striped Storm!", pos1.row, pos1.col, "#00ffff");
          
          for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
              if (newGrid[r][c].colorIndex === targetColor) {
                for (let cc = 0; cc < GRID_SIZE; cc++) {
                  if (newGrid[r][cc].colorIndex !== -1) {
                    spawnParticles(r, cc, newGrid[r][cc].colorIndex, 8, "explosion");
                    colorsCounted[newGrid[r][cc].colorIndex] = (colorsCounted[newGrid[r][cc].colorIndex] || 0) + 1;
                    newGrid[r][cc] = { ...newGrid[r][cc], colorIndex: -1, isMatched: true, special: "none" };
                  }
                }
                for (let rr = 0; rr < GRID_SIZE; rr++) {
                  if (newGrid[rr][c].colorIndex !== -1) {
                    spawnParticles(rr, c, newGrid[rr][c].colorIndex, 8, "explosion");
                    colorsCounted[newGrid[rr][c].colorIndex] = (colorsCounted[newGrid[rr][c].colorIndex] || 0) + 1;
                    newGrid[rr][c] = { ...newGrid[rr][c], colorIndex: -1, isMatched: true, special: "none" };
                  }
                }
              }
            }
          }
          newGrid[pos1.row][pos1.col] = { ...candy1, colorIndex: -1, isMatched: true, special: "none" };
          newGrid[pos2.row][pos2.col] = { ...candy2, colorIndex: -1, isMatched: true, special: "none" };
          setScore(prev => prev + 3000);
          specialActivated = true;
        }
        else if (isStriped(candy1.special) && isStriped(candy2.special)) {
          triggerScreenShake(10);
          spawnFloatingText("Cross Blast!", pos1.row, pos1.col, "#22d3ee");
          
          const centerRow = pos1.row;
          const centerCol = pos1.col;
          
          for (let c = 0; c < GRID_SIZE; c++) {
            if (newGrid[centerRow][c].colorIndex !== -1) {
              spawnParticles(centerRow, c, newGrid[centerRow][c].colorIndex, 10, "explosion");
              colorsCounted[newGrid[centerRow][c].colorIndex] = (colorsCounted[newGrid[centerRow][c].colorIndex] || 0) + 1;
              newGrid[centerRow][c] = { ...newGrid[centerRow][c], colorIndex: -1, isMatched: true, special: "none" };
            }
          }
          for (let r = 0; r < GRID_SIZE; r++) {
            if (newGrid[r][centerCol].colorIndex !== -1) {
              spawnParticles(r, centerCol, newGrid[r][centerCol].colorIndex, 10, "explosion");
              colorsCounted[newGrid[r][centerCol].colorIndex] = (colorsCounted[newGrid[r][centerCol].colorIndex] || 0) + 1;
              newGrid[r][centerCol] = { ...newGrid[r][centerCol], colorIndex: -1, isMatched: true, special: "none" };
            }
          }
          setScore(prev => prev + 2000);
          specialActivated = true;
        }
        else if (candy1.special === "wrapped" && candy2.special === "wrapped") {
          triggerScreenShake(12);
          spawnFloatingText("MEGA Wrapped!", pos1.row, pos1.col, "#a855f7");
          
          const centerRow = pos1.row;
          const centerCol = pos1.col;
          
          for (let dr = -2; dr <= 2; dr++) {
            for (let dc = -2; dc <= 2; dc++) {
              const r = centerRow + dr;
              const c = centerCol + dc;
              if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && newGrid[r][c].colorIndex !== -1) {
                spawnParticles(r, c, newGrid[r][c].colorIndex, 12, "explosion");
                colorsCounted[newGrid[r][c].colorIndex] = (colorsCounted[newGrid[r][c].colorIndex] || 0) + 1;
                newGrid[r][c] = { ...newGrid[r][c], colorIndex: -1, isMatched: true, special: "none" };
              }
            }
          }
          setScore(prev => prev + 2500);
          specialActivated = true;
        }
        else if (candy1.special === "color-bomb" || candy2.special === "color-bomb") {
          const bombCandy = candy1.special === "color-bomb" ? candy1 : candy2;
          const bombPos = candy1.special === "color-bomb" ? pos1 : pos2;
          const targetCandy = candy1.special === "color-bomb" ? candy2 : candy1;

          triggerScreenShake(10);
          spawnFloatingText("Color Bomb!", bombPos.row, bombPos.col, "#fbbf24");

          for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
              if (newGrid[r][c].colorIndex === targetCandy.colorIndex) {
                spawnParticles(r, c, newGrid[r][c].colorIndex, 12, "explosion");
                colorsCounted[newGrid[r][c].colorIndex] = (colorsCounted[newGrid[r][c].colorIndex] || 0) + 1;
                newGrid[r][c] = { ...newGrid[r][c], colorIndex: -1, isMatched: true, special: "none" };
              }
            }
          }
          newGrid[bombPos.row][bombPos.col] = { ...bombCandy, colorIndex: -1, isMatched: true, special: "none" };
          setScore(prev => prev + Object.values(colorsCounted).reduce((a, b) => a + b, 0) * 100);
          specialActivated = true;
        }
        else if (isStriped(candy1.special)) {
          const affected = activateSpecialCandy(newGrid, pos1.row, pos1.col);
          for (const aPos of affected) {
            spawnParticles(aPos.row, aPos.col, newGrid[aPos.row][aPos.col].colorIndex, 8);
            colorsCounted[newGrid[aPos.row][aPos.col].colorIndex] = (colorsCounted[newGrid[aPos.row][aPos.col].colorIndex] || 0) + 1;
            newGrid[aPos.row][aPos.col] = { ...newGrid[aPos.row][aPos.col], colorIndex: -1, isMatched: true, special: "none" };
          }
          newGrid[pos1.row][pos1.col] = { ...candy1, colorIndex: -1, isMatched: true, special: "none" };
          triggerScreenShake(5);
          spawnFloatingText("Striped!", pos1.row, pos1.col, "#22d3ee");
          specialActivated = true;
        }
        else if (isStriped(candy2.special)) {
          const affected = activateSpecialCandy(newGrid, pos2.row, pos2.col);
          for (const aPos of affected) {
            spawnParticles(aPos.row, aPos.col, newGrid[aPos.row][aPos.col].colorIndex, 8);
            colorsCounted[newGrid[aPos.row][aPos.col].colorIndex] = (colorsCounted[newGrid[aPos.row][aPos.col].colorIndex] || 0) + 1;
            newGrid[aPos.row][aPos.col] = { ...newGrid[aPos.row][aPos.col], colorIndex: -1, isMatched: true, special: "none" };
          }
          newGrid[pos2.row][pos2.col] = { ...candy2, colorIndex: -1, isMatched: true, special: "none" };
          triggerScreenShake(5);
          spawnFloatingText("Striped!", pos2.row, pos2.col, "#22d3ee");
          specialActivated = true;
        }
        else if (candy1.special === "wrapped") {
          const affected = activateSpecialCandy(newGrid, pos1.row, pos1.col);
          for (const aPos of affected) {
            spawnParticles(aPos.row, aPos.col, newGrid[aPos.row][aPos.col].colorIndex, 10, "explosion");
            colorsCounted[newGrid[aPos.row][aPos.col].colorIndex] = (colorsCounted[newGrid[aPos.row][aPos.col].colorIndex] || 0) + 1;
            newGrid[aPos.row][aPos.col] = { ...newGrid[aPos.row][aPos.col], colorIndex: -1, isMatched: true, special: "none" };
          }
          newGrid[pos1.row][pos1.col] = { ...candy1, colorIndex: -1, isMatched: true, special: "none" };
          triggerScreenShake(8);
          spawnFloatingText("Wrapped!", pos1.row, pos1.col, "#a855f7");
          specialActivated = true;
        }
        else if (candy2.special === "wrapped") {
          const affected = activateSpecialCandy(newGrid, pos2.row, pos2.col);
          for (const aPos of affected) {
            spawnParticles(aPos.row, aPos.col, newGrid[aPos.row][aPos.col].colorIndex, 10, "explosion");
            colorsCounted[newGrid[aPos.row][aPos.col].colorIndex] = (colorsCounted[newGrid[aPos.row][aPos.col].colorIndex] || 0) + 1;
            newGrid[aPos.row][aPos.col] = { ...newGrid[aPos.row][aPos.col], colorIndex: -1, isMatched: true, special: "none" };
          }
          newGrid[pos2.row][pos2.col] = { ...candy2, colorIndex: -1, isMatched: true, special: "none" };
          triggerScreenShake(8);
          spawnFloatingText("Wrapped!", pos2.row, pos2.col, "#a855f7");
          specialActivated = true;
        }

        if (specialActivated) {
          setTotalCleared(prev => {
            const updated = { ...prev };
            for (const [color, count] of Object.entries(colorsCounted)) {
              updated[Number(color)] = (updated[Number(color)] || 0) + count;
            }
            return updated;
          });
          setGrid(newGrid);
          await new Promise(resolve => setTimeout(resolve, 300));
          await processMatches(newGrid);
          setMoves(prev => prev - 1);
          setIsAnimating(false);
          setSelectedCandy(null);
          return;
        }
      }
      
      const { matches } = findMatches(newGrid);
      
      if (matches.length > 0) {
        await processMatches(newGrid);
        setMoves(prev => prev - 1);
      } else {
        setSwappingCandies({ pos1: pos2, pos2: pos1 });
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const revertGrid = newGrid.map(row => row.map(c => ({ ...c })));
        const revertTemp = revertGrid[pos1.row][pos1.col];
        revertGrid[pos1.row][pos1.col] = revertGrid[pos2.row][pos2.col];
        revertGrid[pos2.row][pos2.col] = revertTemp;
        setGrid(revertGrid);
        setSwappingCandies(null);
      }
      
      setIsAnimating(false);
    }
    
    setSelectedCandy(null);
  }, [grid, isAnimating, gameScreen, findMatches, processMatches, activateSpecialCandy, triggerScreenShake, spawnFloatingText, spawnParticles]);

  const handleCandyClick = (row: number, col: number) => {
    if (isAnimating || gameScreen !== "playing") return;
    
    if (selectedCandy) {
      swapCandies(selectedCandy, { row, col });
    } else {
      setSelectedCandy({ row, col });
    }
  };

  const handleDragStart = (row: number, col: number, e: React.PointerEvent) => {
    if (isAnimating || gameScreen !== "playing") return;
    setDragStart({ pos: { row, col }, x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = (e: React.PointerEvent) => {
    if (!dragStart || isAnimating || gameScreen !== "playing") {
      setDragStart(null);
      return;
    }
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const threshold = 20;
    
    let targetPos: Position | null = null;
    
    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      if (Math.abs(dy) > Math.abs(dx)) {
        if (dy > 0 && dragStart.pos.row < GRID_SIZE - 1) {
          targetPos = { row: dragStart.pos.row + 1, col: dragStart.pos.col };
        } else if (dy < 0 && dragStart.pos.row > 0) {
          targetPos = { row: dragStart.pos.row - 1, col: dragStart.pos.col };
        }
      } else {
        if (dx > 0 && dragStart.pos.col < GRID_SIZE - 1) {
          targetPos = { row: dragStart.pos.row, col: dragStart.pos.col + 1 };
        } else if (dx < 0 && dragStart.pos.col > 0) {
          targetPos = { row: dragStart.pos.row, col: dragStart.pos.col - 1 };
        }
      }
    }
    
    if (targetPos) {
      swapCandies(dragStart.pos, targetPos);
    }
    
    setDragStart(null);
  };

  const startLevel = (lvl: number) => {
    const levelData = LEVELS[lvl - 1] || LEVELS[LEVELS.length - 1];
    setLevel(lvl);
    setMoves(levelData.moves);
    setScore(0);
    setObjectives(levelData.objectives.map(o => ({ ...o, current: 0 })));
    setTotalCleared({});
    setBlockersCleared({ ice: 0, chocolate: 0, jelly: 0, licorice: 0 });
    setIngredientsDropped({ cherry: 0, hazelnut: 0 });
    setLevelIngredients(levelData.ingredients || []);
    setIngredientSpawnIndex(0);
    setGrid(initializeGrid(levelData.blockers));
    setParticles([]);
    setFloatingTexts([]);
    setSelectedCandy(null);
    setHintPosition(null);
    setLastMoveTime(Date.now());
    setGameScreen("level-preview");
  };

  const beginPlaying = () => {
    if (lives <= 0) return;
    setLives(prev => prev - 1);
    setLastLifeTime(Date.now());
    setGameScreen("playing");
    setLastMoveTime(Date.now());
  };

  const calculateStars = (): number => {
    const levelData = LEVELS[level - 1] || LEVELS[LEVELS.length - 1];
    if (score >= levelData.starThresholds[2]) return 3;
    if (score >= levelData.starThresholds[1]) return 2;
    if (score >= levelData.starThresholds[0]) return 1;
    return 0;
  };

  const completeLevel = () => {
    const stars = calculateStars();
    const existing = highScores[level] || { score: 0, stars: 0 };
    if (score > existing.score || stars > existing.stars) {
      setHighScores(prev => ({
        ...prev,
        [level]: { score: Math.max(score, existing.score), stars: Math.max(stars, existing.stars) }
      }));
    }
    setGameScreen("level-complete");
  };

  const nextLevel = () => {
    startLevel(level + 1);
  };

  const retryLevel = () => {
    startLevel(level);
  };

  const useHammer = (row: number, col: number) => {
    if (boosters.hammer <= 0 || isAnimating || gameScreen !== "playing") return;
    
    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    if (newGrid[row][col].colorIndex !== -1) {
      spawnParticles(row, col, newGrid[row][col].colorIndex, 16, "explosion");
      newGrid[row][col] = { ...newGrid[row][col], colorIndex: -1, isMatched: true, special: "none" };
      setBoosters((prev: { hammer: number; shuffle: number; lollipop: number }) => ({ ...prev, hammer: prev.hammer - 1 }));
      setGrid(newGrid);
      setSelectedBooster(null);
      processMatches(newGrid);
    }
  };

  const useLollipop = (row: number, col: number) => {
    if (boosters.lollipop <= 0 || isAnimating || gameScreen !== "playing") return;
    
    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    const candy = newGrid[row][col];
    if (candy.colorIndex !== -1 && candy.special === "none") {
      newGrid[row][col] = { ...candy, special: "color-bomb" };
      setBoosters((prev: { hammer: number; shuffle: number; lollipop: number }) => ({ ...prev, lollipop: prev.lollipop - 1 }));
      setGrid(newGrid);
      setSelectedBooster(null);
      spawnFloatingText("Color Bomb!", row, col, "#fbbf24");
    }
  };

  const useShuffleBooster = () => {
    if (boosters.shuffle <= 0 || isAnimating || gameScreen !== "playing") return;
    setBoosters((prev: { hammer: number; shuffle: number; lollipop: number }) => ({ ...prev, shuffle: prev.shuffle - 1 }));
    shuffleBoard();
  };

  const claimDailyReward = () => {
    if (dailyRewardClaimed) return;
    
    const rewards = [
      { coins: 100, lives: 1 },
      { coins: 150, lives: 1 },
      { coins: 200, lives: 2 },
      { coins: 250, lives: 2 },
      { coins: 300, lives: 3, boosters: { hammer: 1 } },
      { coins: 400, lives: 3, boosters: { shuffle: 1 } },
      { coins: 500, lives: 5, boosters: { hammer: 1, lollipop: 1 } },
    ];
    
    const reward = rewards[Math.min(dailyStreak - 1, rewards.length - 1)];
    
    setCoins((prev: number) => prev + reward.coins);
    setLives((prev: number) => Math.min(prev + reward.lives, maxLives));
    if (reward.boosters) {
      setBoosters((prev: { hammer: number; shuffle: number; lollipop: number }) => ({
        hammer: prev.hammer + (reward.boosters.hammer || 0),
        shuffle: prev.shuffle + (reward.boosters.shuffle || 0),
        lollipop: prev.lollipop + (reward.boosters.lollipop || 0),
      }));
    }
    
    setDailyRewardClaimed(true);
    const newStreak = dailyStreak + 1;
    setDailyStreak(newStreak);
    localStorage.setItem("candyRush_lastClaimDate", new Date().toISOString());
    localStorage.setItem("candyRush_dailyStreak", JSON.stringify(newStreak));
    setShowDailyReward(false);
  };

  const handleCandyClickWithBooster = (row: number, col: number) => {
    if (selectedBooster === "hammer") {
      useHammer(row, col);
    } else if (selectedBooster === "lollipop") {
      useLollipop(row, col);
    } else {
      handleCandyClick(row, col);
    }
  };

  useEffect(() => {
    if (gameScreen !== "playing" || objectives.length === 0) return;
    
    const totalBlockersCleared = (blockersCleared.ice || 0) + (blockersCleared.chocolate || 0) + (blockersCleared.jelly || 0) + (blockersCleared.licorice || 0);
    const totalCandiesCleared = Object.values(totalCleared).reduce((a, b) => a + b, 0);
    
    const allObjectivesMet = objectives.every(obj => {
      if (obj.type === "score") return score >= obj.target;
      if (obj.type === "clear-color" && obj.colorIndex !== undefined) {
        return (totalCleared[obj.colorIndex] || 0) >= obj.target;
      }
      if (obj.type === "clear-jelly") return (blockersCleared.jelly || 0) >= obj.target;
      if (obj.type === "clear-ice") return (blockersCleared.ice || 0) >= obj.target;
      if (obj.type === "clear-chocolate") return (blockersCleared.chocolate || 0) >= obj.target;
      if (obj.type === "clear-blockers") return totalBlockersCleared >= obj.target;
      if (obj.type === "collect-candies" && obj.colorIndex !== undefined) {
        return (totalCleared[obj.colorIndex] || 0) >= obj.target;
      }
      if (obj.type === "drop-ingredients" && obj.ingredientType) {
        return (ingredientsDropped[obj.ingredientType] || 0) >= obj.target;
      }
      return false;
    });
    
    if (allObjectivesMet) {
      completeLevel();
    } else if (moves <= 0) {
      setGameScreen("game-over");
    }
  }, [score, moves, objectives, totalCleared, blockersCleared, ingredientsDropped, gameScreen]);

  useEffect(() => {
    if (gameScreen !== "playing" || isAnimating) return;
    
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
    }
    
    hintTimerRef.current = setTimeout(() => {
      const validMoves = findValidMoves(grid);
      if (validMoves.length > 0) {
        setHintPosition(validMoves[Math.floor(Math.random() * validMoves.length)]);
      }
    }, HINT_DELAY);
    
    return () => {
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }
    };
  }, [lastMoveTime, gameScreen, isAnimating, grid, findValidMoves]);

  useEffect(() => {
    localStorage.setItem("candyRush_lives", JSON.stringify(lives));
  }, [lives]);

  useEffect(() => {
    localStorage.setItem("candyRush_lastLifeTime", JSON.stringify(lastLifeTime));
  }, [lastLifeTime]);

  useEffect(() => {
    localStorage.setItem("candyRush_boosters", JSON.stringify(boosters));
  }, [boosters]);

  useEffect(() => {
    localStorage.setItem("candyRush_coins", JSON.stringify(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem("candyRush_highScores", JSON.stringify(highScores));
  }, [highScores]);

  useEffect(() => {
    const saved = localStorage.getItem("candyRush_highScores");
    if (saved) {
      setHighScores(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (lives >= maxLives) return;
    
    const now = Date.now();
    const timeSinceLastRegen = now - lastLifeTime;
    if (timeSinceLastRegen >= LIFE_REGEN_TIME) {
      const livesToAdd = Math.floor(timeSinceLastRegen / LIFE_REGEN_TIME);
      const actualLivesToAdd = Math.min(livesToAdd, maxLives - lives);
      if (actualLivesToAdd > 0) {
        setLives(prev => Math.min(prev + actualLivesToAdd, maxLives));
        setLastLifeTime(lastLifeTime + actualLivesToAdd * LIFE_REGEN_TIME);
      }
    }
    
    const interval = setInterval(() => {
      const currentNow = Date.now();
      const elapsed = currentNow - lastLifeTime;
      
      if (elapsed >= LIFE_REGEN_TIME) {
        const livesToRegen = Math.floor(elapsed / LIFE_REGEN_TIME);
        const actualRegen = Math.min(livesToRegen, maxLives - lives);
        if (actualRegen > 0) {
          setLives((prev: number) => Math.min(prev + actualRegen, maxLives));
          setLastLifeTime((prev: number) => prev + actualRegen * LIFE_REGEN_TIME);
        }
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [lives, lastLifeTime, maxLives, LIFE_REGEN_TIME]);

  useEffect(() => {
    const checkNewDay = () => {
      const lastClaimDate = localStorage.getItem("candyRush_lastClaimDate");
      if (lastClaimDate) {
        const lastDate = new Date(lastClaimDate).toDateString();
        const today = new Date().toDateString();
        if (lastDate !== today) {
          setDailyRewardClaimed(false);
        }
      }
    };
    
    checkNewDay();
    const interval = setInterval(checkNewDay, 60000);
    return () => clearInterval(interval);
  }, []);

  const getSwapTransform = (row: number, col: number) => {
    if (!swappingCandies) return '';
    
    const { pos1, pos2 } = swappingCandies;
    
    if (pos1.row === row && pos1.col === col) {
      const dx = (pos2.col - pos1.col) * 100;
      const dy = (pos2.row - pos1.row) * 100;
      return `translate(${dx}%, ${dy}%)`;
    }
    
    if (pos2.row === row && pos2.col === col) {
      const dx = (pos1.col - pos2.col) * 100;
      const dy = (pos1.row - pos2.row) * 100;
      return `translate(${dx}%, ${dy}%)`;
    }
    
    return '';
  };

  const renderSpecialIndicator = (special: SpecialType) => {
    if (special === "striped-h") {
      return <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-1 bg-white/80 rounded-full" />;
    }
    if (special === "striped-v") {
      return <div className="absolute inset-y-1 left-1/2 -translate-x-1/2 w-1 bg-white/80 rounded-full" />;
    }
    if (special === "wrapped") {
      return (
        <>
          <div className="absolute inset-2 border-2 border-white/60 rounded-lg" />
          <div className="absolute inset-3 border border-white/40 rounded" />
        </>
      );
    }
    if (special === "color-bomb") {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white drop-shadow-lg animate-pulse" />
        </div>
      );
    }
    return null;
  };

  const renderStars = (count: number, size: "sm" | "lg" = "sm") => {
    const sizeClass = size === "lg" ? "w-8 h-8" : "w-5 h-5";
    return (
      <div className="flex gap-1 justify-center">
        {[1, 2, 3].map(i => (
          <Star
            key={i}
            className={`${sizeClass} ${i <= count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
          />
        ))}
      </div>
    );
  };

  if (gameScreen === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-4 px-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-red-500/30 px-3 py-1.5 rounded-full border border-red-400/50">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              <span className="text-white font-bold">{lives}/{maxLives}</span>
            </div>
            <div className="flex items-center gap-1 bg-yellow-500/30 px-3 py-1.5 rounded-full border border-yellow-400/50">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-bold">{coins}</span>
            </div>
          </div>
          
          {!dailyRewardClaimed && (
            <Button
              onClick={() => setShowDailyReward(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl animate-pulse"
              data-testid="button-daily-reward"
            >
              <Gift className="w-5 h-5 mr-2" />
              Day {dailyStreak}
            </Button>
          )}
        </div>

        {showDailyReward && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-sm bg-gradient-to-br from-purple-800 to-indigo-900 border-purple-500/50">
              <CardHeader className="text-center">
                <Gift className="w-16 h-16 mx-auto text-yellow-400 mb-2" />
                <CardTitle className="text-2xl text-white">Daily Reward!</CardTitle>
                <p className="text-purple-200">Day {dailyStreak} Streak</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/10 rounded-lg p-3">
                    <Star className="w-8 h-8 mx-auto text-yellow-400 fill-yellow-400" />
                    <p className="text-white font-bold mt-1">{100 + dailyStreak * 50}</p>
                    <p className="text-xs text-purple-200">Coins</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <Heart className="w-8 h-8 mx-auto text-red-400 fill-red-400" />
                    <p className="text-white font-bold mt-1">{Math.min(dailyStreak, 3)}</p>
                    <p className="text-xs text-purple-200">Lives</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <Hammer className="w-8 h-8 mx-auto text-amber-400" />
                    <p className="text-white font-bold mt-1">{dailyStreak >= 5 ? 1 : 0}</p>
                    <p className="text-xs text-purple-200">Booster</p>
                  </div>
                </div>
                <Button
                  onClick={claimDailyReward}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white h-12 text-lg font-bold rounded-xl"
                  data-testid="button-claim-reward"
                >
                  Claim Reward!
                </Button>
                <Button
                  onClick={() => setShowDailyReward(false)}
                  variant="ghost"
                  className="w-full text-purple-300"
                >
                  Maybe Later
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center mb-4">
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-red-500 to-purple-500 drop-shadow-lg mb-1" data-testid="text-game-title">
            Candy Rush Saga
          </h1>
          <p className="text-pink-200 text-sm">Sweetest Puzzle Adventure!</p>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="relative w-full max-w-md mx-auto py-4">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500/50 via-purple-500/50 to-indigo-500/50 -translate-x-1/2 rounded-full" />
            
            <div className="space-y-4">
              {LEVELS.map((lvl, idx) => {
                const hs = highScores[lvl.level];
                const isUnlocked = lvl.level === 1 || highScores[lvl.level - 1]?.stars > 0;
                const isLeft = idx % 2 === 0;
                
                return (
                  <div key={lvl.level} className={`flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}>
                    <div className={`relative ${isLeft ? 'ml-4' : 'mr-4'}`}>
                      <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 rounded-full bg-purple-400 border-2 border-white" style={{ left: isLeft ? 'calc(100% + 20px)' : '-20px' }} />
                      
                      <Button
                        onClick={() => isUnlocked && lives > 0 && startLevel(lvl.level)}
                        disabled={!isUnlocked || lives <= 0}
                        className={`w-20 h-20 rounded-full flex flex-col items-center justify-center p-2 ${
                          isUnlocked 
                            ? 'bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white shadow-lg shadow-purple-500/50' 
                            : 'bg-gray-600 text-gray-400'
                        }`}
                        data-testid={`button-level-${lvl.level}`}
                      >
                        <MapPin className="w-4 h-4 mb-1" />
                        <span className="font-black text-xl">{lvl.level}</span>
                        {hs && <div className="flex gap-0.5 mt-0.5">{renderStars(hs.stars, "sm")}</div>}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameScreen === "level-preview") {
    const levelData = LEVELS[level - 1] || LEVELS[LEVELS.length - 1];
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4 flex flex-col items-center justify-center">
        <Card className="bg-gradient-to-br from-purple-800/95 to-indigo-900/95 backdrop-blur-xl border-2 border-purple-400/60 p-6 text-center max-w-sm mx-4 rounded-3xl shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-black text-white">Level {level}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-black/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <Zap className="w-5 h-5" />
                <span className="font-bold">{levelData.moves} Moves</span>
              </div>
              
              <div className="border-t border-white/20 pt-3">
                <p className="text-purple-200 text-sm uppercase tracking-wide mb-2">Goals</p>
                {levelData.objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-center justify-center gap-2 text-white">
                    {obj.type === "score" && (
                      <>
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>Score {obj.target.toLocaleString()} points</span>
                      </>
                    )}
                    {obj.type === "clear-color" && obj.colorIndex !== undefined && (
                      <>
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${CANDY_TYPES[obj.colorIndex].gradient}`} />
                        <span>Clear {obj.target} {CANDY_TYPES[obj.colorIndex].name} candies</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              onClick={beginPlaying}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-2xl shadow-lg"
              data-testid="button-start-level"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Level
            </Button>
            
            <Button
              onClick={() => setGameScreen("menu")}
              variant="ghost"
              className="text-purple-300 hover:text-white"
              data-testid="button-back-to-menu"
            >
              Back to Levels
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-4 px-2 sm:py-8 sm:px-4 overflow-hidden">
      <style>{`
        @keyframes candyBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes candyPop {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
          100% { transform: scale(0); opacity: 0; }
        }
        @keyframes candyDrop {
          0% { transform: translateY(-120%); opacity: 0; }
          50% { transform: translateY(8%); }
          70% { transform: translateY(-4%); }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes candyFall {
          0% { transform: translateY(0); }
          50% { transform: translateY(5%); }
          100% { transform: translateY(0); }
        }
        @keyframes particle {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { transform: translateY(-10px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-60px) scale(0.8); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.3), inset 0 0 20px rgba(255,255,255,0.1); }
          50% { box-shadow: 0 0 40px rgba(255,255,255,0.5), inset 0 0 30px rgba(255,255,255,0.2); }
        }
        @keyframes hint-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.7); }
          50% { transform: scale(1.1); box-shadow: 0 0 20px 10px rgba(255,255,255,0.3); }
        }
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .candy-selected {
          animation: candyBounce 0.4s ease-in-out infinite;
        }
        .candy-matched {
          animation: candyPop 0.25s ease-out forwards;
        }
        .candy-new {
          animation: candyDrop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .candy-falling {
          animation: candyFall 0.3s ease-out;
        }
        .candy-hint {
          animation: hint-pulse 0.8s ease-in-out infinite;
        }
        .float-up {
          animation: floatUp 1s ease-out forwards;
        }
        .board-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .color-bomb-candy {
          animation: rainbow 2s linear infinite;
        }
        .screen-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-1deg); }
          75% { transform: translateX(5px) rotate(1deg); }
        }
      `}</style>

      <div 
        className={`max-w-lg mx-auto transition-transform ${screenShake ? 'screen-shake' : ''}`}
      >
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-red-500 to-purple-500 drop-shadow-lg" data-testid="text-game-title">
            Candy Rush Saga
          </h1>
          <p className="text-pink-100/80 text-sm font-medium">Level {level}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gradient-to-br from-purple-600/50 to-purple-800/50 backdrop-blur-xl rounded-2xl p-3 border border-purple-400/40 text-center shadow-lg shadow-purple-500/20">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-purple-200 uppercase tracking-wide font-semibold">Score</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums" data-testid="text-score">
              {score.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-600/50 to-orange-800/50 backdrop-blur-xl rounded-2xl p-3 border border-amber-400/40 text-center shadow-lg shadow-amber-500/20">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-amber-200 uppercase tracking-wide font-semibold">Moves</span>
            </div>
            <div className={`text-2xl sm:text-3xl font-black tabular-nums ${moves <= 5 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} data-testid="text-moves">
              {moves}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-600/50 to-green-800/50 backdrop-blur-xl rounded-2xl p-3 border border-emerald-400/40 text-center shadow-lg shadow-emerald-500/20">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-emerald-200 uppercase tracking-wide font-semibold">Level</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400" data-testid="text-level">
              {level}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/40 to-pink-600/40 backdrop-blur-xl rounded-2xl p-3 mb-4 border border-white/20 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-pink-300" />
            <span className="text-pink-200 text-xs uppercase tracking-wide font-semibold">Objectives</span>
          </div>
          <div className="space-y-2">
            {objectives.map((obj, idx) => {
              const totalBlockersCount = (blockersCleared.ice || 0) + (blockersCleared.chocolate || 0) + (blockersCleared.jelly || 0) + (blockersCleared.licorice || 0);
              let current = 0;
              if (obj.type === "score") current = score;
              else if (obj.type === "clear-color" && obj.colorIndex !== undefined) current = totalCleared[obj.colorIndex] || 0;
              else if (obj.type === "collect-candies" && obj.colorIndex !== undefined) current = totalCleared[obj.colorIndex] || 0;
              else if (obj.type === "clear-jelly") current = blockersCleared.jelly || 0;
              else if (obj.type === "clear-ice") current = blockersCleared.ice || 0;
              else if (obj.type === "clear-chocolate") current = blockersCleared.chocolate || 0;
              else if (obj.type === "clear-blockers") current = totalBlockersCount;
              else if (obj.type === "drop-ingredients" && obj.ingredientType) current = ingredientsDropped[obj.ingredientType] || 0;
              
              const isComplete = current >= obj.target;
              return (
                <div key={idx} className="flex items-center gap-2">
                  {obj.type === "score" && <Star className={`h-4 w-4 ${isComplete ? 'text-green-400' : 'text-yellow-400'}`} />}
                  {(obj.type === "clear-color" || obj.type === "collect-candies") && obj.colorIndex !== undefined && (
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${CANDY_TYPES[obj.colorIndex].gradient} ${isComplete ? 'ring-2 ring-green-400' : ''}`} />
                  )}
                  {obj.type === "clear-jelly" && (
                    <div className={`w-4 h-4 rounded bg-gradient-to-br from-pink-400 to-pink-600 ${isComplete ? 'ring-2 ring-green-400' : ''}`} />
                  )}
                  {obj.type === "clear-ice" && (
                    <div className={`w-4 h-4 rounded bg-gradient-to-br from-cyan-300 to-blue-400 ${isComplete ? 'ring-2 ring-green-400' : ''}`} />
                  )}
                  {obj.type === "clear-chocolate" && (
                    <div className={`w-4 h-4 rounded bg-gradient-to-br from-amber-700 to-amber-900 ${isComplete ? 'ring-2 ring-green-400' : ''}`} />
                  )}
                  {obj.type === "clear-blockers" && (
                    <div className={`w-4 h-4 rounded bg-gradient-to-br from-gray-500 to-gray-700 ${isComplete ? 'ring-2 ring-green-400' : ''}`} />
                  )}
                  {obj.type === "drop-ingredients" && (
                    <div className={`w-4 h-4 rounded-full ${obj.ingredientType === "cherry" ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-amber-600 to-amber-800'} ${isComplete ? 'ring-2 ring-green-400' : ''}`} />
                  )}
                  <div className="flex-1 h-3 bg-black/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'}`}
                      style={{ width: `${Math.min(100, current / obj.target * 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold tabular-nums min-w-[50px] text-right ${isComplete ? 'text-green-400' : 'text-white'}`}>
                    {current}/{obj.target}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setGameScreen("paused")}
              className="bg-white/10 border-white/30 text-white backdrop-blur-sm"
              data-testid="button-pause"
            >
              <Pause className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={retryLevel}
              className="bg-white/10 border-white/30 text-white backdrop-blur-sm"
              data-testid="button-reset"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="bg-white/10 border-white/30 text-white backdrop-blur-sm"
              data-testid="button-mute"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedBooster(selectedBooster === "hammer" ? null : "hammer")}
              disabled={boosters.hammer <= 0}
              className={`relative ${selectedBooster === "hammer" ? 'bg-amber-500/50 border-amber-400' : 'bg-white/10 border-white/30'} text-white backdrop-blur-sm`}
              data-testid="button-booster-hammer"
            >
              <Hammer className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-amber-500 text-white">
                {boosters.hammer}
              </Badge>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={useShuffleBooster}
              disabled={boosters.shuffle <= 0}
              className="relative bg-white/10 border-white/30 text-white backdrop-blur-sm"
              data-testid="button-booster-shuffle"
            >
              <Shuffle className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-green-500 text-white">
                {boosters.shuffle}
              </Badge>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedBooster(selectedBooster === "lollipop" ? null : "lollipop")}
              disabled={boosters.lollipop <= 0}
              className={`relative ${selectedBooster === "lollipop" ? 'bg-purple-500/50 border-purple-400' : 'bg-white/10 border-white/30'} text-white backdrop-blur-sm`}
              data-testid="button-booster-lollipop"
            >
              <Candy className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-purple-500 text-white">
                {boosters.lollipop}
              </Badge>
            </Button>
          </div>
        </div>
        
        {selectedBooster && (
          <div className="bg-amber-500/20 border border-amber-400/50 rounded-lg p-2 mb-4 text-center">
            <p className="text-amber-200 text-sm font-medium">
              {selectedBooster === "hammer" ? "Tap a candy to smash it!" : "Tap a candy to create a Color Bomb!"}
            </p>
          </div>
        )}

        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-indigo-500/30 rounded-3xl blur-2xl" />
          
          <div 
            ref={boardRef}
            className="relative bg-gradient-to-br from-indigo-800/90 to-purple-900/90 backdrop-blur-xl rounded-3xl p-2 sm:p-3 border-4 border-purple-400/60 board-glow shadow-2xl shadow-purple-500/30"
          >
            <div className="absolute inset-2 rounded-2xl border border-white/10 pointer-events-none" />
            
            <div 
              className="grid gap-1 relative touch-none"
              style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                aspectRatio: '1'
              }}
            >
              {grid.map((row, rowIndex) =>
                row.map((candy, colIndex) => {
                  const isSelected = selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex;
                  const isHint = hintPosition?.row === rowIndex && hintPosition?.col === colIndex;
                  const candyType = CANDY_TYPES[candy.colorIndex];
                  const swapTransform = getSwapTransform(rowIndex, colIndex);
                  const blocker = blockerGrid[rowIndex]?.[colIndex];
                  const isBlockedCell = !!(blocker && (blocker.type === "chocolate" || blocker.type === "licorice"));
                  
                  return (
                    <button
                      key={`${rowIndex}-${colIndex}-${candy.id}`}
                      onClick={() => !isBlockedCell && handleCandyClickWithBooster(rowIndex, colIndex)}
                      onPointerDown={(e) => !isBlockedCell && handleDragStart(rowIndex, colIndex, e)}
                      onPointerUp={(e) => handleDragEnd(e)}
                      onPointerLeave={(e) => {
                        if (dragStart) {
                          handleDragEnd(e);
                        }
                      }}
                      disabled={isAnimating || gameScreen !== "playing" || isBlockedCell}
                      className="aspect-square p-0.5 sm:p-1 relative touch-none"
                      style={{ transform: swapTransform, transition: swapTransform ? 'transform 0.2s ease-in-out' : 'none' }}
                      data-testid={`button-candy-${rowIndex}-${colIndex}`}
                    >
                      {isBlockedCell ? (
                        <div className={`w-full h-full rounded-xl relative overflow-hidden ${
                          blocker.type === "chocolate" 
                            ? 'bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900' 
                            : 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
                        } shadow-lg`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-xl" />
                          {blocker.type === "chocolate" && (
                            <>
                              <div className="absolute top-2 left-2 w-2 h-2 bg-amber-600 rounded-full" />
                              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-amber-950 rounded-full" />
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-amber-950/50 rounded-full" />
                            </>
                          )}
                          {blocker.type === "licorice" && (
                            <>
                              <div className="absolute inset-2 border-2 border-gray-600 rounded-lg" />
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">X</div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`
                            w-full h-full rounded-xl relative overflow-hidden
                            ${candyType ? `bg-gradient-to-br ${candyType.gradient}` : 'bg-transparent'}
                            ${isSelected ? 'candy-selected ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''}
                            ${isHint && !isSelected ? 'candy-hint' : ''}
                            ${candy.isMatched ? 'candy-matched' : ''}
                            ${candy.isNew ? 'candy-new' : ''}
                            ${candy.isFalling ? 'candy-falling' : ''}
                            ${candy.colorIndex === -1 ? 'opacity-0' : 'opacity-100'}
                            ${candy.special === "color-bomb" ? 'color-bomb-candy' : ''}
                            shadow-lg ${candyType?.glow || ''}
                            transition-opacity duration-150
                          `}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent rounded-xl" />
                          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-black/30 to-transparent rounded-xl" />
                          <div className="absolute top-1 left-1 w-2 h-2 sm:w-3 sm:h-3 bg-white/70 rounded-full blur-sm" />
                          <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full" />
                          {renderSpecialIndicator(candy.special)}
                          
                          {blocker && blocker.type === "jelly" && (
                            <div className="absolute inset-0 bg-pink-500/30 rounded-xl border-2 border-pink-400/50" />
                          )}
                          
                          {blocker && blocker.type === "ice" && (
                            <div className={`absolute inset-0 rounded-xl border-2 ${
                              blocker.layers >= 2 
                                ? 'bg-cyan-300/50 border-cyan-200/80' 
                                : 'bg-cyan-200/30 border-cyan-300/50'
                            }`}>
                              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white/80 rounded-full" />
                              <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/60 rounded-full" />
                              {blocker.layers >= 2 && (
                                <div className="absolute inset-1 border border-white/40 rounded-lg" />
                              )}
                            </div>
                          )}
                          
                          {candy.ingredient && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className={`w-3/4 h-3/4 rounded-full ${
                                candy.ingredient === "cherry" 
                                  ? 'bg-gradient-to-br from-red-400 via-red-500 to-red-700 shadow-lg shadow-red-500/50' 
                                  : 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 shadow-lg shadow-amber-500/50'
                              }`}>
                                <div className="absolute top-1 left-1/2 w-1 h-2 bg-green-600 rounded-full -translate-x-1/2" />
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-full" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })
              )}
              
              {particles.map(particle => (
                <div
                  key={particle.id}
                  className={`absolute pointer-events-none ${particle.type === "star" ? "rounded-none" : "rounded-full"}`}
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: particle.size,
                    height: particle.size,
                    backgroundColor: particle.color,
                    '--tx': `${particle.velocityX * 40}px`,
                    '--ty': `${particle.velocityY * 40}px`,
                    animation: 'particle 0.8s ease-out forwards',
                    boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                  } as React.CSSProperties}
                />
              ))}
              
              {floatingTexts.map(text => (
                <div
                  key={text.id}
                  className="absolute pointer-events-none font-black text-lg sm:text-xl float-up drop-shadow-lg"
                  style={{
                    left: `${text.x}%`,
                    top: `${text.y}%`,
                    transform: 'translate(-50%, -50%)',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    color: text.color,
                  }}
                >
                  {text.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {comboCount > 1 && (
          <div className="flex justify-center mt-4">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-lg px-4 py-2 animate-bounce shadow-lg shadow-orange-500/50">
              <Flame className="h-5 w-5 mr-2" />
              {comboCount}x Combo!
            </Badge>
          </div>
        )}

        {showNoMoves && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-purple-800 to-indigo-900 p-8 rounded-3xl border-2 border-purple-400/60 text-center">
              <Shuffle className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-spin" />
              <p className="text-2xl font-bold text-white">No Moves!</p>
              <p className="text-purple-200">Shuffling board...</p>
            </div>
          </div>
        )}

        {gameScreen === "game-over" && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
            <Card className="bg-gradient-to-br from-purple-800/95 to-indigo-900/95 backdrop-blur-xl border-2 border-purple-400/60 p-6 text-center max-w-sm mx-4 rounded-3xl shadow-2xl shadow-purple-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl sm:text-4xl font-black text-white flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-lg">
                    <Heart className="h-12 w-12 text-gray-400" />
                  </div>
                  <span className="text-gray-300">Out of Moves!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="bg-black/40 rounded-2xl p-4">
                  <p className="text-purple-200 text-sm mb-1">Final Score</p>
                  <p className="text-4xl font-black text-white">{score.toLocaleString()}</p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={retryLevel}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg shadow-purple-500/30"
                    data-testid="button-try-again"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Try Again
                  </Button>
                  <Button
                    onClick={() => setGameScreen("menu")}
                    variant="ghost"
                    className="text-purple-300 hover:text-white"
                    data-testid="button-back-to-menu-gameover"
                  >
                    Back to Levels
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {gameScreen === "level-complete" && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
            <Card className="bg-gradient-to-br from-purple-800/95 to-indigo-900/95 backdrop-blur-xl border-2 border-purple-400/60 p-6 text-center max-w-sm mx-4 rounded-3xl shadow-2xl shadow-purple-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl sm:text-4xl font-black text-white flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center animate-bounce shadow-lg shadow-amber-500/50">
                    <Trophy className="h-12 w-12 text-white" />
                  </div>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                    Level Complete!
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {renderStars(calculateStars(), "lg")}
                
                <div className="bg-black/40 rounded-2xl p-4">
                  <p className="text-purple-200 text-sm mb-1">Final Score</p>
                  <p className="text-4xl font-black text-white">{score.toLocaleString()}</p>
                </div>
                
                <div className="flex flex-col gap-3">
                  {level < LEVELS.length && (
                    <Button
                      onClick={nextLevel}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-2xl shadow-lg shadow-amber-500/30"
                      data-testid="button-next-level"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Next Level
                    </Button>
                  )}
                  <Button
                    onClick={() => setGameScreen("menu")}
                    variant="ghost"
                    className="text-purple-300 hover:text-white"
                    data-testid="button-back-to-menu-complete"
                  >
                    Back to Levels
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {gameScreen === "paused" && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
            <Card className="bg-gradient-to-br from-purple-800/95 to-indigo-900/95 backdrop-blur-xl border-2 border-purple-400/60 p-6 text-center rounded-3xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-4xl font-black text-white">Paused</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setGameScreen("playing")}
                  className="w-full h-14 px-8 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg"
                  data-testid="button-resume"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Resume Game
                </Button>
                <Button
                  onClick={() => setGameScreen("menu")}
                  variant="ghost"
                  className="text-purple-300 hover:text-white"
                  data-testid="button-quit"
                >
                  Quit to Menu
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <PWAInstallPrompt />
      </div>
    </div>
  );
}
