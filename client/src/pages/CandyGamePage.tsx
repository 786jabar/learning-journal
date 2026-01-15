import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  RotateCcw, 
  Pause,
  Play,
  Volume2,
  VolumeX
} from "lucide-react";

const GRID_SIZE = 8;
const CANDY_COLORS = [
  "from-purple-500 to-violet-600",
  "from-pink-500 to-rose-600", 
  "from-blue-500 to-cyan-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-green-600",
  "from-red-500 to-pink-600",
];

const CANDY_SHAPES = ["rounded-full", "rounded-lg", "rounded-xl"];

interface Candy {
  id: number;
  colorIndex: number;
  shapeIndex: number;
}

interface Position {
  row: number;
  col: number;
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

  const createCandy = useCallback((id: number): Candy => ({
    id,
    colorIndex: Math.floor(Math.random() * CANDY_COLORS.length),
    shapeIndex: Math.floor(Math.random() * CANDY_SHAPES.length),
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
    const newGrid = currentGrid.map(row => [...row]);
    let idCounter = Date.now();

    for (const pos of matches) {
      newGrid[pos.row][pos.col] = { ...newGrid[pos.row][pos.col], colorIndex: -1 };
    }

    for (let col = 0; col < GRID_SIZE; col++) {
      let emptySpaces = 0;
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        if (newGrid[row][col].colorIndex === -1) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          newGrid[row + emptySpaces][col] = newGrid[row][col];
          newGrid[row][col] = { ...newGrid[row][col], colorIndex: -1 };
        }
      }

      for (let row = 0; row < emptySpaces; row++) {
        newGrid[row][col] = createCandy(idCounter++);
      }
    }

    return newGrid;
  }, [createCandy]);

  const processMatches = useCallback(async (currentGrid: Candy[][], combo = 0) => {
    const matches = findMatches(currentGrid);
    
    if (matches.length > 0) {
      setComboCount(combo + 1);
      const points = matches.length * 10 * (combo + 1);
      setScore(prev => prev + points);
      
      const newGrid = removeMatches(currentGrid, matches);
      setGrid(newGrid);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return processMatches(newGrid, combo + 1);
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
      
      const newGrid = grid.map(row => [...row]);
      const temp = newGrid[pos1.row][pos1.col];
      newGrid[pos1.row][pos1.col] = newGrid[pos2.row][pos2.col];
      newGrid[pos2.row][pos2.col] = temp;
      
      setGrid(newGrid);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const matches = findMatches(newGrid);
      
      if (matches.length > 0) {
        await processMatches(newGrid);
        setMoves(prev => prev - 1);
      } else {
        const revertGrid = newGrid.map(row => [...row]);
        const revertTemp = revertGrid[pos1.row][pos1.col];
        revertGrid[pos1.row][pos1.col] = revertGrid[pos2.row][pos2.col];
        revertGrid[pos2.row][pos2.col] = revertTemp;
        setGrid(revertGrid);
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
  };

  const nextLevel = () => {
    setGrid(initializeGrid());
    setLevel(prev => prev + 1);
    setMoves(30 + level * 5);
    setTargetScore(prev => prev + 500);
    setLevelComplete(false);
    setSelectedCandy(null);
  };

  useEffect(() => {
    if (score >= targetScore && !levelComplete) {
      setLevelComplete(true);
    } else if (moves <= 0 && score < targetScore && !gameOver) {
      setGameOver(true);
    }
  }, [score, moves, targetScore, levelComplete, gameOver]);

  const progress = (score / targetScore) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-purple-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2" data-testid="text-game-title">
            Candy Crush
          </h1>
          <p className="text-purple-200">Match 3 or more candies to score points!</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-white" data-testid="text-score">{score}</div>
              <div className="text-purple-200 text-sm">Score</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-400" data-testid="text-moves">{moves}</div>
              <div className="text-purple-200 text-sm">Moves Left</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400" data-testid="text-level">Level {level}</div>
              <div className="text-purple-200 text-sm">Target: {targetScore}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-purple-200 text-sm">Progress</span>
              <Progress value={Math.min(progress, 100)} className="flex-1" />
              <span className="text-white font-bold">{Math.round(progress)}%</span>
            </div>
            {comboCount > 1 && (
              <Badge className="mt-2 bg-amber-500 text-white animate-pulse">
                {comboCount}x Combo!
              </Badge>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
            className="bg-white/10 border-white/20 text-white"
            data-testid="button-pause"
          >
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={resetGame}
            className="bg-white/10 border-white/20 text-white"
            data-testid="button-reset"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="bg-white/10 border-white/20 text-white"
            data-testid="button-mute"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border-white/20 p-4">
          <div 
            className="grid gap-1 mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              maxWidth: '400px'
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((candy, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}-${candy.id}`}
                  onClick={() => handleCandyClick(rowIndex, colIndex)}
                  disabled={isAnimating || isPaused || gameOver}
                  className={`
                    aspect-square rounded-lg p-1 transition-all duration-200
                    ${selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex
                      ? 'ring-4 ring-white z-10'
                      : ''
                    }
                  `}
                  data-testid={`button-candy-${rowIndex}-${colIndex}`}
                >
                  <div
                    className={`
                      w-full h-full bg-gradient-to-br ${CANDY_COLORS[candy.colorIndex] || 'from-gray-500 to-gray-600'}
                      ${CANDY_SHAPES[candy.shapeIndex]}
                      shadow-lg transform transition-all duration-200
                      ${candy.colorIndex === -1 ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                    `}
                  />
                </button>
              ))
            )}
          </div>
        </Card>

        {(gameOver || levelComplete) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="bg-white/20 backdrop-blur-xl border-white/30 p-8 text-center max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-3xl text-white flex items-center justify-center gap-2">
                  {levelComplete ? (
                    <>
                      <Trophy className="h-8 w-8 text-amber-400" />
                      Level Complete!
                    </>
                  ) : (
                    'Game Over'
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-purple-200 text-lg">
                  {levelComplete 
                    ? `Amazing! You scored ${score} points!` 
                    : `You scored ${score} points. Target was ${targetScore}.`
                  }
                </p>
                <div className="flex gap-4 justify-center">
                  {levelComplete ? (
                    <Button
                      onClick={nextLevel}
                      className="bg-gradient-to-r from-purple-500 to-violet-600 text-white"
                      data-testid="button-next-level"
                    >
                      Next Level
                    </Button>
                  ) : (
                    <Button
                      onClick={resetGame}
                      className="bg-gradient-to-r from-purple-500 to-violet-600 text-white"
                      data-testid="button-try-again"
                    >
                      Try Again
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isPaused && !gameOver && !levelComplete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="bg-white/20 backdrop-blur-xl border-white/30 p-8 text-center">
              <CardHeader>
                <CardTitle className="text-3xl text-white">Paused</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setIsPaused(false)}
                  className="bg-gradient-to-r from-purple-500 to-violet-600 text-white"
                  data-testid="button-resume"
                >
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
