import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  RotateCcw, 
  Pause,
  Play,
  Volume2,
  VolumeX,
  Zap,
  Sparkles,
  Star
} from "lucide-react";

const GRID_SIZE = 8;

const CANDY_TYPES = [
  { gradient: "from-rose-400 via-rose-500 to-rose-600", glow: "shadow-rose-500/50" },
  { gradient: "from-orange-400 via-orange-500 to-orange-600", glow: "shadow-orange-500/50" },
  { gradient: "from-yellow-300 via-yellow-400 to-yellow-500", glow: "shadow-yellow-400/50" },
  { gradient: "from-emerald-400 via-emerald-500 to-emerald-600", glow: "shadow-emerald-500/50" },
  { gradient: "from-sky-400 via-sky-500 to-sky-600", glow: "shadow-sky-500/50" },
  { gradient: "from-indigo-400 via-indigo-500 to-indigo-600", glow: "shadow-indigo-500/50" },
];

interface Candy {
  id: number;
  colorIndex: number;
  isMatched: boolean;
  isNew: boolean;
}

interface Position {
  row: number;
  col: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
}

export default function CandyGamePage() {
  const [grid, setGrid] = useState<Candy[][]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [level, setLevel] = useState(1);
  const [targetScore, setTargetScore] = useState(1000);
  const [selectedCandy, setSelectedCandy] = useState<Position | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showComboText, setShowComboText] = useState(false);
  const [swappingCandies, setSwappingCandies] = useState<{pos1: Position, pos2: Position} | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const createCandy = useCallback((id: number, isNew = false): Candy => ({
    id,
    colorIndex: Math.floor(Math.random() * CANDY_TYPES.length),
    isMatched: false,
    isNew,
  }), []);

  const initializeGrid = useCallback(() => {
    let idCounter = 0;
    const newGrid: Candy[][] = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      const rowArray: Candy[] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        let candy = createCandy(idCounter++);
        
        while (
          (col >= 2 && 
           rowArray[col - 1].colorIndex === candy.colorIndex && 
           rowArray[col - 2].colorIndex === candy.colorIndex) ||
          (row >= 2 && 
           newGrid[row - 1][col].colorIndex === candy.colorIndex && 
           newGrid[row - 2][col].colorIndex === candy.colorIndex)
        ) {
          candy = createCandy(idCounter++);
        }
        
        rowArray.push(candy);
      }
      newGrid.push(rowArray);
    }
    
    return newGrid;
  }, [createCandy]);

  useEffect(() => {
    setGrid(initializeGrid());
  }, [initializeGrid]);

  const spawnParticles = useCallback((row: number, col: number, colorIndex: number) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];
    const color = colors[colorIndex] || '#ffffff';
    
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Date.now() + i + row * 100 + col,
        x: col * 12.5 + 6.25,
        y: row * 12.5 + 6.25,
        color,
        size: Math.random() * 8 + 4,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: (Math.random() - 0.5) * 4 - 2,
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 600);
  }, []);

  const findMatches = useCallback((currentGrid: Candy[][]): Position[] => {
    const matches: Position[] = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 2; col++) {
        const color = currentGrid[row][col].colorIndex;
        if (
          currentGrid[row][col + 1].colorIndex === color &&
          currentGrid[row][col + 2].colorIndex === color
        ) {
          matches.push({ row, col }, { row, col: col + 1 }, { row, col: col + 2 });
          let extend = col + 3;
          while (extend < GRID_SIZE && currentGrid[row][extend].colorIndex === color) {
            matches.push({ row, col: extend });
            extend++;
          }
        }
      }
    }

    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = 0; row < GRID_SIZE - 2; row++) {
        const color = currentGrid[row][col].colorIndex;
        if (
          currentGrid[row + 1][col].colorIndex === color &&
          currentGrid[row + 2][col].colorIndex === color
        ) {
          matches.push({ row, col }, { row: row + 1, col }, { row: row + 2, col });
          let extend = row + 3;
          while (extend < GRID_SIZE && currentGrid[extend][col].colorIndex === color) {
            matches.push({ row: extend, col });
            extend++;
          }
        }
      }
    }

    const uniqueMatches = matches.filter(
      (pos, index, self) =>
        index === self.findIndex((p) => p.row === pos.row && p.col === pos.col)
    );

    return uniqueMatches;
  }, []);

  const removeMatches = useCallback((currentGrid: Candy[][], matches: Position[]): Candy[][] => {
    const newGrid = currentGrid.map(row => row.map(candy => ({ ...candy, isNew: false })));
    let idCounter = Date.now();

    for (const pos of matches) {
      spawnParticles(pos.row, pos.col, newGrid[pos.row][pos.col].colorIndex);
      newGrid[pos.row][pos.col] = { ...newGrid[pos.row][pos.col], colorIndex: -1, isMatched: true };
    }

    for (let col = 0; col < GRID_SIZE; col++) {
      let emptySpaces = 0;
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        if (newGrid[row][col].colorIndex === -1) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          newGrid[row + emptySpaces][col] = { ...newGrid[row][col], isNew: false };
          newGrid[row][col] = { ...newGrid[row][col], colorIndex: -1 };
        }
      }

      for (let row = 0; row < emptySpaces; row++) {
        newGrid[row][col] = createCandy(idCounter++, true);
      }
    }

    return newGrid;
  }, [createCandy, spawnParticles]);

  const processMatches = useCallback(async (currentGrid: Candy[][], combo = 0) => {
    const matches = findMatches(currentGrid);
    
    if (matches.length > 0) {
      const newCombo = combo + 1;
      setComboCount(newCombo);
      
      if (newCombo > 1) {
        setShowComboText(true);
        setTimeout(() => setShowComboText(false), 800);
      }
      
      const points = matches.length * 10 * newCombo;
      setScore(prev => prev + points);
      
      const newGrid = removeMatches(currentGrid, matches);
      setGrid(newGrid);
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return processMatches(newGrid, newCombo);
    }
    
    setComboCount(0);
    return currentGrid;
  }, [findMatches, removeMatches]);

  const swapCandies = useCallback(async (pos1: Position, pos2: Position) => {
    if (isAnimating || isPaused || gameOver) return;
    
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    
    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      setIsAnimating(true);
      setSwappingCandies({ pos1, pos2 });
      
      await new Promise(resolve => setTimeout(resolve, 250));
      
      const newGrid = grid.map(row => row.map(c => ({ ...c })));
      const temp = newGrid[pos1.row][pos1.col];
      newGrid[pos1.row][pos1.col] = newGrid[pos2.row][pos2.col];
      newGrid[pos2.row][pos2.col] = temp;
      
      setGrid(newGrid);
      setSwappingCandies(null);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const matches = findMatches(newGrid);
      
      if (matches.length > 0) {
        await processMatches(newGrid);
        setMoves(prev => prev - 1);
      } else {
        setSwappingCandies({ pos1: pos2, pos2: pos1 });
        await new Promise(resolve => setTimeout(resolve, 250));
        
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
  }, [grid, isAnimating, isPaused, gameOver, findMatches, processMatches]);

  const handleCandyClick = (row: number, col: number) => {
    if (isAnimating || isPaused || gameOver) return;
    
    if (selectedCandy) {
      swapCandies(selectedCandy, { row, col });
    } else {
      setSelectedCandy({ row, col });
    }
  };

  const resetGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setMoves(30);
    setLevel(1);
    setTargetScore(1000);
    setGameOver(false);
    setLevelComplete(false);
    setSelectedCandy(null);
    setParticles([]);
  };

  const nextLevel = () => {
    setGrid(initializeGrid());
    setLevel(prev => prev + 1);
    setMoves(30 + level * 5);
    setTargetScore(prev => prev + 500);
    setLevelComplete(false);
    setSelectedCandy(null);
    setParticles([]);
  };

  useEffect(() => {
    if (score >= targetScore && !levelComplete) {
      setLevelComplete(true);
    } else if (moves <= 0 && score < targetScore && !gameOver) {
      setGameOver(true);
    }
  }, [score, moves, targetScore, levelComplete, gameOver]);

  const progress = Math.min((score / targetScore) * 100, 100);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-4 px-2 sm:py-8 sm:px-4 overflow-hidden">
      <style>{`
        @keyframes candyBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes candyPop {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.5; }
          100% { transform: scale(0); opacity: 0; }
        }
        @keyframes candyDrop {
          0% { transform: translateY(-100%); opacity: 0; }
          60% { transform: translateY(10%); }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes particle {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        @keyframes comboText {
          0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.3); }
          50% { box-shadow: 0 0 40px rgba(255,255,255,0.6); }
        }
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .candy-selected {
          animation: candyBounce 0.5s ease-in-out infinite;
        }
        .candy-matched {
          animation: candyPop 0.3s ease-out forwards;
        }
        .candy-new {
          animation: candyDrop 0.4s ease-out forwards;
        }
        .combo-text {
          animation: comboText 0.5s ease-out forwards;
        }
        .board-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-lg mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-red-500 to-purple-500 drop-shadow-lg" data-testid="text-game-title">
            Candy Rush Saga
          </h1>
          <p className="text-pink-100/80 text-sm font-medium">Sweetest Puzzle Adventure!</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gradient-to-br from-purple-600/40 to-purple-800/40 backdrop-blur-xl rounded-2xl p-3 border border-purple-400/30 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-purple-200 uppercase tracking-wide">Score</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums" data-testid="text-score">
              {score.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-600/40 to-orange-800/40 backdrop-blur-xl rounded-2xl p-3 border border-amber-400/30 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-amber-200 uppercase tracking-wide">Moves</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums" data-testid="text-moves">
              {moves}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-600/40 to-green-800/40 backdrop-blur-xl rounded-2xl p-3 border border-emerald-400/30 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-emerald-200 uppercase tracking-wide">Level</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400" data-testid="text-level">
              {level}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-xl rounded-2xl p-3 mb-4 border border-white/20">
          <div className="flex items-center gap-3">
            <span className="text-purple-200 text-xs uppercase tracking-wide whitespace-nowrap">Goal: {targetScore.toLocaleString()}</span>
            <div className="flex-1 h-4 bg-black/30 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animation: 'shine 2s linear infinite' }} />
              </div>
            </div>
            <span className="text-white font-bold text-sm tabular-nums">{Math.round(progress)}%</span>
          </div>
          
          {showComboText && comboCount > 1 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="combo-text text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-lg">
                {comboCount}x COMBO!
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-3 mb-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsPaused(!isPaused)}
            className="bg-white/10 border-white/30 text-white backdrop-blur-sm"
            data-testid="button-pause"
          >
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={resetGame}
            className="bg-white/10 border-white/30 text-white backdrop-blur-sm"
            data-testid="button-reset"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsMuted(!isMuted)}
            className="bg-white/10 border-white/30 text-white backdrop-blur-sm"
            data-testid="button-mute"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
          
          <div 
            ref={boardRef}
            className="relative bg-gradient-to-br from-indigo-800/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-2 sm:p-3 border-4 border-purple-400/50 board-glow"
          >
            <div className="absolute inset-2 rounded-2xl border border-white/10" />
            
            <div 
              className="grid gap-1 relative"
              style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                aspectRatio: '1'
              }}
            >
              {grid.map((row, rowIndex) =>
                row.map((candy, colIndex) => {
                  const isSelected = selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex;
                  const candyType = CANDY_TYPES[candy.colorIndex];
                  const swapTransform = getSwapTransform(rowIndex, colIndex);
                  
                  return (
                    <button
                      key={`${rowIndex}-${colIndex}-${candy.id}`}
                      onClick={() => handleCandyClick(rowIndex, colIndex)}
                      disabled={isAnimating || isPaused || gameOver}
                      className="aspect-square p-0.5 sm:p-1 relative"
                      style={{ transform: swapTransform, transition: swapTransform ? 'transform 0.25s ease-in-out' : 'none' }}
                      data-testid={`button-candy-${rowIndex}-${colIndex}`}
                    >
                      <div
                        className={`
                          w-full h-full rounded-xl relative overflow-hidden
                          ${candyType ? `bg-gradient-to-br ${candyType.gradient}` : 'bg-transparent'}
                          ${isSelected ? 'candy-selected ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''}
                          ${candy.isMatched ? 'candy-matched' : ''}
                          ${candy.isNew ? 'candy-new' : ''}
                          ${candy.colorIndex === -1 ? 'opacity-0' : 'opacity-100'}
                          shadow-lg ${candyType?.glow || ''}
                          transition-opacity duration-200
                        `}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-xl" />
                        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-black/20 to-transparent rounded-xl" />
                        <div className="absolute top-1 left-1 w-2 h-2 sm:w-3 sm:h-3 bg-white/50 rounded-full blur-sm" />
                      </div>
                    </button>
                  );
                })
              )}
              
              {particles.map(particle => (
                <div
                  key={particle.id}
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: particle.size,
                    height: particle.size,
                    backgroundColor: particle.color,
                    '--tx': `${particle.velocityX * 30}px`,
                    '--ty': `${particle.velocityY * 30}px`,
                    animation: 'particle 0.6s ease-out forwards',
                    boxShadow: `0 0 ${particle.size}px ${particle.color}`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>

        {comboCount > 1 && (
          <div className="flex justify-center mt-4">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-lg px-4 py-2 animate-bounce">
              <Sparkles className="h-5 w-5 mr-2" />
              {comboCount}x Combo!
            </Badge>
          </div>
        )}

        {(gameOver || levelComplete) && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
            <Card className="bg-gradient-to-br from-purple-800/90 to-indigo-900/90 backdrop-blur-xl border-2 border-purple-400/50 p-6 text-center max-w-sm mx-4 rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl sm:text-4xl font-black text-white flex flex-col items-center gap-3">
                  {levelComplete ? (
                    <>
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center animate-bounce">
                        <Trophy className="h-10 w-10 text-white" />
                      </div>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                        Level Complete!
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                        <RotateCcw className="h-10 w-10 text-gray-400" />
                      </div>
                      <span className="text-gray-300">Game Over</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="bg-black/30 rounded-2xl p-4">
                  <p className="text-purple-200 text-sm mb-1">Final Score</p>
                  <p className="text-4xl font-black text-white">{score.toLocaleString()}</p>
                  {!levelComplete && (
                    <p className="text-sm text-purple-300 mt-2">Target was {targetScore.toLocaleString()}</p>
                  )}
                </div>
                
                <div className="flex flex-col gap-3">
                  {levelComplete ? (
                    <Button
                      onClick={nextLevel}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-2xl"
                      data-testid="button-next-level"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Next Level
                    </Button>
                  ) : (
                    <Button
                      onClick={resetGame}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl"
                      data-testid="button-try-again"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Try Again
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isPaused && !gameOver && !levelComplete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
            <Card className="bg-gradient-to-br from-purple-800/90 to-indigo-900/90 backdrop-blur-xl border-2 border-purple-400/50 p-6 text-center rounded-3xl">
              <CardHeader>
                <CardTitle className="text-4xl font-black text-white">Paused</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setIsPaused(false)}
                  className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl"
                  data-testid="button-resume"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Resume Game
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
