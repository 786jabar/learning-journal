import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  RotateCcw, 
  Star,
  Clock,
  Zap,
  Brain,
  Sparkles,
  Heart,
  Sun,
  Moon,
  Cloud,
  Flower2,
  Music,
  Camera,
  Gamepad2,
  Coffee,
  Pizza,
  IceCream,
  Cake,
  Apple,
  Cherry,
  Banana
} from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";

interface CardItem {
  id: number;
  iconIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const ICONS = [
  Heart, Sun, Moon, Cloud, Flower2, Music, 
  Camera, Gamepad2, Coffee, Pizza, IceCream, Cake,
  Apple, Cherry, Banana, Star, Zap, Brain
];

const ICON_COLORS = [
  "text-rose-500", "text-amber-500", "text-indigo-500", "text-sky-500",
  "text-pink-500", "text-purple-500", "text-cyan-500", "text-emerald-500",
  "text-orange-500", "text-red-500", "text-blue-400", "text-yellow-500",
  "text-green-500", "text-red-400", "text-yellow-400", "text-amber-400",
  "text-violet-500", "text-teal-500"
];

const DIFFICULTY_CONFIG = {
  easy: { pairs: 6, cols: 4, label: "Easy", description: "6 pairs - Great for beginners" },
  medium: { pairs: 8, cols: 4, label: "Medium", description: "8 pairs - A nice challenge" },
  hard: { pairs: 12, cols: 6, label: "Hard", description: "12 pairs - Test your memory!" }
};

export default function MemoryGamePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [bestScores, setBestScores] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0
  });

  const config = DIFFICULTY_CONFIG[difficulty];

  useEffect(() => {
    const saved = localStorage.getItem("memory-game-scores");
    if (saved) {
      setBestScores(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameComplete) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameComplete]);

  const initializeGame = useCallback(() => {
    const pairs = config.pairs;
    const selectedIcons = ICONS.slice(0, pairs);
    const cardPairs: CardItem[] = [];
    
    selectedIcons.forEach((_, index) => {
      cardPairs.push(
        { id: index * 2, iconIndex: index, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, iconIndex: index, isFlipped: false, isMatched: false }
      );
    });

    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }

    setCards(cardPairs);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setGameStarted(false);
    setGameComplete(false);
    setIsChecking(false);
  }, [config.pairs]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (cardId: number) => {
    if (isChecking) return;
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    if (!gameStarted) {
      setGameStarted(true);
    }

    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);
      
      const [firstId, secondId] = newFlipped;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.iconIndex === secondCard.iconIndex) {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ));
          setMatches(m => {
            const newMatches = m + 1;
            if (newMatches === config.pairs) {
              setGameComplete(true);
              const currentScore = moves + 1;
              if (bestScores[difficulty] === 0 || currentScore < bestScores[difficulty]) {
                const newScores = { ...bestScores, [difficulty]: currentScore };
                setBestScores(newScores);
                localStorage.setItem("memory-game-scores", JSON.stringify(newScores));
              }
            }
            return newMatches;
          });
          setFlippedCards([]);
          setIsChecking(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStarRating = () => {
    const perfectMoves = config.pairs;
    const ratio = moves / perfectMoves;
    if (ratio <= 1.5) return 3;
    if (ratio <= 2.5) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Brain className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 bg-clip-text text-transparent">
              Memory Match
            </h1>
            <Sparkles className="w-10 h-10 text-pink-500" />
          </div>
          <p className="text-muted-foreground">Find all matching pairs!</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((d) => (
            <Button
              key={d}
              variant={difficulty === d ? "default" : "outline"}
              onClick={() => setDifficulty(d)}
              className={difficulty === d ? "bg-purple-600 hover:bg-purple-700" : ""}
              data-testid={`button-difficulty-${d}`}
            >
              {DIFFICULTY_CONFIG[d].label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-purple-600 mb-1">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">Moves</span>
              </div>
              <p className="text-2xl font-bold" data-testid="text-moves">{moves}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-pink-600 mb-1">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-medium">Matches</span>
              </div>
              <p className="text-2xl font-bold" data-testid="text-matches">{matches}/{config.pairs}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-amber-600 mb-1">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Time</span>
              </div>
              <p className="text-2xl font-bold" data-testid="text-timer">{formatTime(timer)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
                <Star className="w-5 h-5" />
                <span className="text-sm font-medium">Best</span>
              </div>
              <p className="text-2xl font-bold" data-testid="text-best-score">
                {bestScores[difficulty] || "-"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-xl">
          <CardContent className="p-6">
            <div 
              className="grid gap-3 justify-center"
              style={{ 
                gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
                maxWidth: config.cols * 80 + (config.cols - 1) * 12
              }}
            >
              {cards.map((card) => {
                const IconComponent = ICONS[card.iconIndex];
                const iconColor = ICON_COLORS[card.iconIndex];
                
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    disabled={card.isFlipped || card.isMatched || isChecking}
                    className={`
                      relative w-16 h-16 md:w-20 md:h-20 rounded-xl
                      transition-all duration-300 transform
                      ${card.isMatched 
                        ? 'bg-gradient-to-br from-emerald-400 to-green-500 scale-95 shadow-lg shadow-emerald-500/30' 
                        : card.isFlipped 
                          ? 'bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg shadow-purple-500/30' 
                          : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 hover:scale-105 cursor-pointer shadow-md'
                      }
                      ${!card.isFlipped && !card.isMatched ? 'hover:shadow-xl' : ''}
                    `}
                    style={{
                      perspective: '1000px',
                      transformStyle: 'preserve-3d'
                    }}
                    data-testid={`card-${card.id}`}
                  >
                    <div className={`
                      absolute inset-0 flex items-center justify-center rounded-xl
                      transition-all duration-300
                      ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}
                    `}>
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-2 shadow-inner">
                        <IconComponent className={`w-8 h-8 md:w-10 md:h-10 ${iconColor}`} />
                      </div>
                    </div>
                    
                    <div className={`
                      absolute inset-0 flex items-center justify-center rounded-xl
                      transition-all duration-300
                      ${card.isFlipped || card.isMatched ? 'opacity-0' : 'opacity-100'}
                    `}>
                      <div className="text-white/30 text-3xl font-bold">?</div>
                    </div>
                    
                    {card.isMatched && (
                      <div className="absolute -top-1 -right-1">
                        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button
            onClick={initializeGame}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            data-testid="button-restart"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            New Game
          </Button>
        </div>

        {gameComplete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 shadow-2xl animate-in zoom-in-95">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  {[...Array(getStarRating())].map((_, i) => (
                    <Star key={i} className="w-12 h-12 text-yellow-400 fill-yellow-400" />
                  ))}
                  {[...Array(3 - getStarRating())].map((_, i) => (
                    <Star key={i} className="w-12 h-12 text-gray-300" />
                  ))}
                </div>
                <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Congratulations!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">
                  You found all pairs!
                </p>
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">{moves}</p>
                    <p className="text-sm text-muted-foreground">Moves</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-pink-600">{formatTime(timer)}</p>
                    <p className="text-sm text-muted-foreground">Time</p>
                  </div>
                </div>
                {moves === bestScores[difficulty] && (
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500">
                    <Trophy className="w-4 h-4 mr-1" />
                    New Best Score!
                  </Badge>
                )}
                <Button
                  onClick={initializeGame}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  data-testid="button-play-again"
                >
                  Play Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              How to Play
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>1. Click on any card to flip it and reveal the icon</p>
            <p>2. Click on a second card to find a matching pair</p>
            <p>3. If the cards match, they stay revealed</p>
            <p>4. If they don't match, they flip back over</p>
            <p>5. Find all pairs in as few moves as possible!</p>
            <div className="pt-4 flex flex-wrap gap-2">
              <Badge variant="outline">Easy: 6 pairs</Badge>
              <Badge variant="outline">Medium: 8 pairs</Badge>
              <Badge variant="outline">Hard: 12 pairs</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
