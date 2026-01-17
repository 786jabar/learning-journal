import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  RotateCcw, 
  Star,
  Clock,
  Zap,
  Sparkles,
  Moon,
  Sun,
  CloudLightning,
  Flame,
  Droplets,
  Wind,
  Snowflake,
  Heart,
  Diamond,
  Crown,
  Gem,
  Rocket,
  Globe,
  Orbit,
  Eye,
  Lightbulb,
  HelpCircle,
  Lock,
  Unlock,
  Palette,
  Volume2,
  VolumeX,
  Compass,
  Target,
  Shield,
  Wand2,
  Timer,
  Comet
} from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GameMode = "zen" | "challenge" | "constellation";
type PowerUp = "reveal" | "freeze" | "shuffle" | null;
type ThemeId = "cosmic" | "aurora" | "nebula" | "solar";

interface CardItem {
  id: number;
  iconIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
  isHinted: boolean;
  isWild: boolean;
  constellationId: number;
  ghostVisible: boolean;
}

interface Constellation {
  id: number;
  name: string;
  pairs: number[];
  completed: boolean;
  power: PowerUp;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

interface ConstellationLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

interface GameTheme {
  id: ThemeId;
  name: string;
  bgGradient: string;
  cardGradient: string;
  unlocked: boolean;
  requiredWins: number;
}

const CELESTIAL_ICONS = [
  { icon: Moon, name: "Luna", gradient: "from-slate-300 to-indigo-400" },
  { icon: Sun, name: "Sol", gradient: "from-amber-300 to-orange-500" },
  { icon: Star, name: "Polaris", gradient: "from-yellow-300 to-amber-500" },
  { icon: Sparkles, name: "Nebula", gradient: "from-pink-400 to-purple-600" },
  { icon: CloudLightning, name: "Storm", gradient: "from-cyan-400 to-blue-600" },
  { icon: Flame, name: "Nova", gradient: "from-orange-400 to-red-600" },
  { icon: Droplets, name: "Hydra", gradient: "from-blue-400 to-cyan-500" },
  { icon: Wind, name: "Zephyr", gradient: "from-teal-300 to-emerald-500" },
  { icon: Snowflake, name: "Cryo", gradient: "from-blue-200 to-indigo-400" },
  { icon: Heart, name: "Pulsar", gradient: "from-rose-400 to-pink-600" },
  { icon: Diamond, name: "Crystal", gradient: "from-violet-300 to-purple-500" },
  { icon: Crown, name: "Corona", gradient: "from-yellow-400 to-amber-600" },
  { icon: Gem, name: "Stardust", gradient: "from-fuchsia-400 to-pink-500" },
  { icon: Rocket, name: "Voyager", gradient: "from-slate-400 to-zinc-600" },
  { icon: Globe, name: "Terra", gradient: "from-emerald-400 to-teal-600" },
  { icon: Orbit, name: "Eclipse", gradient: "from-indigo-400 to-violet-600" },
];

const CONSTELLATIONS = [
  { id: 0, name: "Orion", pairs: [0, 1, 2], power: "reveal" as PowerUp },
  { id: 1, name: "Cassiopeia", pairs: [3, 4, 5], power: "freeze" as PowerUp },
  { id: 2, name: "Ursa Major", pairs: [6, 7, 8], power: "reveal" as PowerUp },
  { id: 3, name: "Andromeda", pairs: [9, 10, 11], power: "freeze" as PowerUp },
];

const THEMES: GameTheme[] = [
  { id: "cosmic", name: "Cosmic Night", bgGradient: "from-slate-900 via-purple-950 to-indigo-950", cardGradient: "from-indigo-600 via-purple-600 to-pink-600", unlocked: true, requiredWins: 0 },
  { id: "aurora", name: "Aurora Borealis", bgGradient: "from-emerald-950 via-teal-900 to-cyan-950", cardGradient: "from-emerald-500 via-teal-500 to-cyan-500", unlocked: false, requiredWins: 3 },
  { id: "nebula", name: "Pink Nebula", bgGradient: "from-pink-950 via-fuchsia-950 to-purple-950", cardGradient: "from-pink-500 via-fuchsia-500 to-purple-500", unlocked: false, requiredWins: 6 },
  { id: "solar", name: "Solar Flare", bgGradient: "from-orange-950 via-red-950 to-amber-950", cardGradient: "from-orange-500 via-red-500 to-amber-500", unlocked: false, requiredWins: 10 },
];

const DIFFICULTY_CONFIG = {
  easy: { pairs: 6, cols: 4, rows: 3, label: "Stargazer", wildCards: 0, constellations: 2 },
  medium: { pairs: 9, cols: 6, rows: 3, label: "Explorer", wildCards: 1, constellations: 3 },
  hard: { pairs: 12, cols: 6, rows: 4, label: "Astronomer", wildCards: 2, constellations: 4 }
};

export default function MemoryGamePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameMode, setGameMode] = useState<GameMode>("constellation");
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showMenu, setShowMenu] = useState(true);
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [activePower, setActivePower] = useState<PowerUp>(null);
  const [powerCharges, setPowerCharges] = useState<Record<string, number>>({ reveal: 0, freeze: 0 });
  const [isFrozen, setIsFrozen] = useState(false);
  const [frozenTimeLeft, setFrozenTimeLeft] = useState(0);
  const [constellationLines, setConstellationLines] = useState<ConstellationLine[]>([]);
  const [showConstellationCelebration, setShowConstellationCelebration] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>("cosmic");
  const [themes, setThemes] = useState<GameTheme[]>(THEMES);
  const [totalWins, setTotalWins] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [score, setScore] = useState(0);
  const [bestScores, setBestScores] = useState<Record<Difficulty, { score: number; moves: number }>>({
    easy: { score: 0, moves: 0 },
    medium: { score: 0, moves: 0 },
    hard: { score: 0, moves: 0 }
  });
  const boardRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const config = DIFFICULTY_CONFIG[difficulty];
  const theme = themes.find(t => t.id === currentTheme) || THEMES[0];

  useEffect(() => {
    const saved = localStorage.getItem("celestial-memory-data");
    if (saved) {
      const data = JSON.parse(saved);
      setBestScores(data.bestScores || bestScores);
      setTotalWins(data.totalWins || 0);
      if (data.currentTheme) {
        setCurrentTheme(data.currentTheme);
      }
      setThemes(prev => prev.map(t => ({
        ...t,
        unlocked: t.requiredWins <= (data.totalWins || 0)
      })));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameComplete && !isFrozen) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameComplete, isFrozen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFrozen && frozenTimeLeft > 0) {
      interval = setInterval(() => {
        setFrozenTimeLeft(t => {
          if (t <= 1) {
            setIsFrozen(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFrozen, frozenTimeLeft]);

  const createParticles = useCallback((x: number, y: number, color: string, count: number = 12) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x: x + (Math.random() - 0.5) * 120,
        y: y + (Math.random() - 0.5) * 120,
        color,
        size: 3 + Math.random() * 6
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1200);
  }, []);

  const addConstellationLine = useCallback((card1Id: number, card2Id: number, color: string) => {
    const card1El = cardRefs.current.get(card1Id);
    const card2El = cardRefs.current.get(card2Id);
    const boardEl = boardRef.current;
    
    if (card1El && card2El && boardEl) {
      const boardRect = boardEl.getBoundingClientRect();
      const rect1 = card1El.getBoundingClientRect();
      const rect2 = card2El.getBoundingClientRect();
      
      const line: ConstellationLine = {
        id: `${card1Id}-${card2Id}`,
        x1: rect1.left - boardRect.left + rect1.width / 2,
        y1: rect1.top - boardRect.top + rect1.height / 2,
        x2: rect2.left - boardRect.left + rect2.width / 2,
        y2: rect2.top - boardRect.top + rect2.height / 2,
        color
      };
      setConstellationLines(prev => [...prev, line]);
    }
  }, []);

  const initializeGame = useCallback(() => {
    const pairs = config.pairs;
    const selectedIcons = CELESTIAL_ICONS.slice(0, pairs);
    const cardPairs: CardItem[] = [];
    
    const numConstellations = config.constellations;
    const pairsPerConstellation = Math.floor(pairs / numConstellations);
    
    selectedIcons.forEach((_, index) => {
      const constellationId = Math.floor(index / pairsPerConstellation);
      cardPairs.push(
        { id: index * 2, iconIndex: index, isFlipped: false, isMatched: false, isHinted: false, isWild: false, constellationId, ghostVisible: false },
        { id: index * 2 + 1, iconIndex: index, isFlipped: false, isMatched: false, isHinted: false, isWild: false, constellationId, ghostVisible: false }
      );
    });

    // Ensure unique wild card assignment by shuffling indices and picking first N
    if (config.wildCards > 0) {
      const indices = cardPairs.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      for (let w = 0; w < Math.min(config.wildCards, cardPairs.length); w++) {
        cardPairs[indices[w]].isWild = true;
      }
    }

    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }

    const gameConstellations: Constellation[] = CONSTELLATIONS.slice(0, numConstellations).map((c, idx) => ({
      ...c,
      id: idx,
      pairs: Array.from({ length: pairsPerConstellation }, (_, i) => idx * pairsPerConstellation + i),
      completed: false
    }));

    setCards(cardPairs);
    setConstellations(gameConstellations);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setStreak(0);
    setMaxStreak(0);
    setScore(0);
    setComboMultiplier(1);
    setTimer(0);
    setGameStarted(false);
    setGameComplete(false);
    setIsChecking(false);
    setHintsRemaining(3);
    setParticles([]);
    setConstellationLines([]);
    setPowerCharges({ reveal: 0, freeze: 0 });
    setActivePower(null);
    setIsFrozen(false);
    setFrozenTimeLeft(0);
    setShowMenu(false);
  }, [config]);

  const usePower = (power: PowerUp) => {
    if (!power || powerCharges[power] <= 0) return;
    
    if (power === "reveal") {
      const unmatchedCards = cards.filter(c => !c.isMatched && !c.isFlipped);
      if (unmatchedCards.length >= 2) {
        const firstCard = unmatchedCards[0];
        const matchingCard = unmatchedCards.find(c => c.id !== firstCard.id && c.iconIndex === firstCard.iconIndex);
        if (matchingCard) {
          setCards(prev => prev.map(c => 
            c.id === firstCard.id || c.id === matchingCard.id ? { ...c, isHinted: true } : c
          ));
          setTimeout(() => {
            setCards(prev => prev.map(c => ({ ...c, isHinted: false })));
          }, 2000);
        }
      }
    } else if (power === "freeze") {
      setIsFrozen(true);
      setFrozenTimeLeft(10);
    }
    
    setPowerCharges(prev => ({ ...prev, [power]: prev[power] - 1 }));
  };

  const useHint = () => {
    if (hintsRemaining <= 0 || isChecking || flippedCards.length > 0) return;
    
    const unmatchedCards = cards.filter(c => !c.isMatched && !c.isFlipped);
    if (unmatchedCards.length < 2) return;

    const firstCard = unmatchedCards[0];
    const matchingCard = unmatchedCards.find(c => c.id !== firstCard.id && (c.iconIndex === firstCard.iconIndex || c.isWild || firstCard.isWild));
    
    if (matchingCard) {
      setCards(prev => prev.map(c => 
        c.id === firstCard.id || c.id === matchingCard.id ? { ...c, isHinted: true } : c
      ));
      setHintsRemaining(h => h - 1);
      setTimeout(() => {
        setCards(prev => prev.map(c => ({ ...c, isHinted: false })));
      }, 1500);
    }
  };

  const handleCardClick = (cardId: number) => {
    if (isChecking || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    if (!gameStarted) setGameStarted(true);

    const newCards = cards.map(c => c.id === cardId ? { ...c, isFlipped: true } : c);
    setCards(newCards);
    
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);
      
      const [firstId, secondId] = newFlipped;
      const firstCard = newCards.find(c => c.id === firstId)!;
      const secondCard = newCards.find(c => c.id === secondId)!;

      const isMatch = firstCard.iconIndex === secondCard.iconIndex || firstCard.isWild || secondCard.isWild;

      if (isMatch) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        
        const newMultiplier = Math.min(1 + newStreak * 0.5, 5);
        setComboMultiplier(newMultiplier);
        
        const basePoints = 100;
        const wildBonus = (firstCard.isWild || secondCard.isWild) ? 50 : 0;
        const points = Math.round((basePoints + wildBonus) * newMultiplier);
        // Score is set in the setTimeout block using locally computed value

        if (boardRef.current) {
          const rect = boardRef.current.getBoundingClientRect();
          const gradient = CELESTIAL_ICONS[firstCard.iconIndex]?.gradient || "from-purple-500 to-pink-500";
          const color = gradient.includes("pink") ? "#ec4899" : 
                       gradient.includes("purple") ? "#a855f7" :
                       gradient.includes("blue") ? "#3b82f6" :
                       gradient.includes("amber") ? "#f59e0b" :
                       gradient.includes("emerald") ? "#10b981" : "#8b5cf6";
          createParticles(rect.width / 2, rect.height / 2, color, 20);
        }

        addConstellationLine(firstId, secondId, "#fff");
        
        // Calculate new score locally to avoid stale state issues
        const newScore = score + points;
        const newMoves = moves + 1;

        setTimeout(() => {
          // Use functional update to get the latest cards state
          setCards(prev => {
            const updatedCards = prev.map(c => 
              c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
            );
            
            // Determine which icon to attribute to constellation
            // If both are wild, skip constellation check; otherwise use non-wild card's iconIndex
            const matchedIconIndex = (firstCard.isWild && secondCard.isWild) 
              ? -1 // Skip constellation attribution for wild-wild matches
              : firstCard.isWild 
                ? secondCard.iconIndex 
                : firstCard.iconIndex;
            
            if (matchedIconIndex >= 0) {
              setConstellations(prevConst => {
                return prevConst.map(constellation => {
                  if (constellation.pairs.includes(matchedIconIndex) && !constellation.completed) {
                    // Use the updatedCards array to count matched pairs correctly
                    const matchedPairs = updatedCards.filter(c => 
                      constellation.pairs.includes(c.iconIndex) && c.isMatched
                    ).length / 2;
                    
                    if (matchedPairs >= constellation.pairs.length) {
                      setTimeout(() => {
                        setShowConstellationCelebration(constellation.name);
                        if (constellation.power) {
                          setPowerCharges(pc => ({ ...pc, [constellation.power!]: pc[constellation.power!] + 1 }));
                        }
                        setTimeout(() => setShowConstellationCelebration(null), 2500);
                      }, 300);
                      return { ...constellation, completed: true };
                    }
                  }
                  return constellation;
                });
              });
            }
            
            return updatedCards;
          });
          
          setScore(newScore);
          
          setMatches(m => {
            const newMatches = m + 1;
            if (newMatches === config.pairs) {
              setGameComplete(true);
              const newWins = totalWins + 1;
              setTotalWins(newWins);
              setThemes(prev => prev.map(t => ({
                ...t,
                unlocked: t.requiredWins <= newWins
              })));
              
              // Use locally computed values to avoid stale state
              if (bestScores[difficulty].score === 0 || newScore > bestScores[difficulty].score) {
                const newScores = { ...bestScores, [difficulty]: { score: newScore, moves: newMoves }};
                setBestScores(newScores);
                localStorage.setItem("celestial-memory-data", JSON.stringify({
                  bestScores: newScores,
                  totalWins: newWins,
                  currentTheme
                }));
              } else {
                localStorage.setItem("celestial-memory-data", JSON.stringify({
                  bestScores,
                  totalWins: newWins,
                  currentTheme
                }));
              }
            }
            return newMatches;
          });
          setFlippedCards([]);
          setIsChecking(false);
        }, 600);
      } else {
        setStreak(0);
        setComboMultiplier(1);
        
        setCards(prev => prev.map(c => 
          c.id === firstId || c.id === secondId ? { ...c, ghostVisible: true } : c
        ));
        
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false, ghostVisible: false }
              : c
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1200);
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
    if (ratio <= 1.3) return 3;
    if (ratio <= 2) return 2;
    return 1;
  };

  if (showMenu) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient}`}>
          <div className="stars-bg absolute inset-0 opacity-60" />
          <div className="shooting-stars absolute inset-0" />
        </div>
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Moon className="w-10 h-10 md:w-14 md:h-14 text-indigo-300 animate-float" />
                <Sparkles className="w-5 h-5 md:w-7 md:h-7 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Celestial Memory
              </h1>
              <div className="relative">
                <Star className="w-10 h-10 md:w-14 md:h-14 text-amber-300 animate-float-delayed" />
              </div>
            </div>
            <p className="text-indigo-200/80 text-base md:text-lg">Discover constellations, unlock cosmic powers</p>
          </div>

          <Card className="w-full max-w-lg bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center gap-4">
                <CardTitle className="text-xl md:text-2xl text-white/90">Choose Your Quest</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowThemeSelector(!showThemeSelector)}
                  className="text-purple-300 hover:text-white"
                  data-testid="button-theme-selector"
                >
                  <Palette className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {showThemeSelector && (
                <div className="space-y-2 p-3 bg-white/5 rounded-xl border border-white/10 animate-in fade-in">
                  <p className="text-xs text-indigo-200/60 text-center mb-2">Themes (Win games to unlock)</p>
                  <div className="grid grid-cols-2 gap-2">
                    {themes.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          if (t.unlocked) {
                            setCurrentTheme(t.id);
                            // Persist theme choice to localStorage
                            const saved = localStorage.getItem("celestial-memory-data");
                            const data = saved ? JSON.parse(saved) : { bestScores, totalWins };
                            localStorage.setItem("celestial-memory-data", JSON.stringify({ ...data, currentTheme: t.id }));
                          }
                        }}
                        disabled={!t.unlocked}
                        className={`p-2 rounded-lg text-xs transition-all border ${
                          currentTheme === t.id
                            ? 'bg-white/20 border-purple-400'
                            : t.unlocked
                              ? 'bg-white/5 border-white/10 hover:bg-white/10'
                              : 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {t.unlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          <span className={t.unlocked ? 'text-white/80' : 'text-white/40'}>{t.name}</span>
                        </div>
                        {!t.unlocked && <span className="text-white/30 text-[10px]">{t.requiredWins} wins</span>}
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-xs text-indigo-200/40">Total wins: {totalWins}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm text-indigo-200/60 text-center">Difficulty</p>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`p-3 rounded-xl transition-all duration-300 border ${
                        difficulty === d 
                          ? 'bg-gradient-to-br from-purple-500/30 to-indigo-600/30 border-purple-400/50 shadow-lg shadow-purple-500/20' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      data-testid={`button-difficulty-${d}`}
                    >
                      <div className={`text-sm font-semibold ${difficulty === d ? 'text-purple-200' : 'text-white/70'}`}>
                        {DIFFICULTY_CONFIG[d].label}
                      </div>
                      <div className="text-xs text-white/40 mt-1">{DIFFICULTY_CONFIG[d].pairs} pairs</div>
                      {DIFFICULTY_CONFIG[d].wildCards > 0 && (
                        <Badge className="mt-1 bg-amber-500/30 text-amber-200 text-[10px]">
                          +{DIFFICULTY_CONFIG[d].wildCards} Wild
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-indigo-200/60 text-center">Game Mode</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setGameMode("zen")}
                    className={`p-3 rounded-xl transition-all duration-300 border text-center ${
                      gameMode === "zen"
                        ? 'bg-gradient-to-br from-teal-500/30 to-cyan-600/30 border-teal-400/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    data-testid="button-mode-zen"
                  >
                    <Eye className={`w-5 h-5 mx-auto mb-1 ${gameMode === "zen" ? 'text-teal-300' : 'text-white/50'}`} />
                    <div className={`text-xs font-semibold ${gameMode === "zen" ? 'text-teal-200' : 'text-white/70'}`}>Zen</div>
                  </button>
                  <button
                    onClick={() => setGameMode("challenge")}
                    className={`p-3 rounded-xl transition-all duration-300 border text-center ${
                      gameMode === "challenge"
                        ? 'bg-gradient-to-br from-orange-500/30 to-red-600/30 border-orange-400/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    data-testid="button-mode-challenge"
                  >
                    <Zap className={`w-5 h-5 mx-auto mb-1 ${gameMode === "challenge" ? 'text-orange-300' : 'text-white/50'}`} />
                    <div className={`text-xs font-semibold ${gameMode === "challenge" ? 'text-orange-200' : 'text-white/70'}`}>Challenge</div>
                  </button>
                  <button
                    onClick={() => setGameMode("constellation")}
                    className={`p-3 rounded-xl transition-all duration-300 border text-center ${
                      gameMode === "constellation"
                        ? 'bg-gradient-to-br from-violet-500/30 to-purple-600/30 border-violet-400/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    data-testid="button-mode-constellation"
                  >
                    <Compass className={`w-5 h-5 mx-auto mb-1 ${gameMode === "constellation" ? 'text-violet-300' : 'text-white/50'}`} />
                    <div className={`text-xs font-semibold ${gameMode === "constellation" ? 'text-violet-200' : 'text-white/70'}`}>Quest</div>
                  </button>
                </div>
                <p className="text-center text-xs text-white/40">
                  {gameMode === "zen" && "Relaxed play, no pressure"}
                  {gameMode === "challenge" && "Combo multipliers, high scores"}
                  {gameMode === "constellation" && "Complete constellations for powers"}
                </p>
              </div>

              <Button
                onClick={initializeGame}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 text-white font-semibold py-6 text-lg shadow-xl shadow-purple-500/25 border-0"
                data-testid="button-start-game"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Launch Mission
              </Button>

              {bestScores[difficulty].score > 0 && (
                <div className="text-center text-sm text-indigo-200/50">
                  Best: {bestScores[difficulty].score.toLocaleString()} pts in {bestScores[difficulty].moves} moves
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <style>{`
          .stars-bg {
            background-image: 
              radial-gradient(2px 2px at 20px 30px, white, transparent),
              radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
              radial-gradient(1px 1px at 90px 40px, white, transparent),
              radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.6), transparent),
              radial-gradient(1px 1px at 160px 120px, white, transparent),
              radial-gradient(2px 2px at 200px 50px, rgba(255,255,255,0.7), transparent),
              radial-gradient(1px 1px at 250px 160px, white, transparent),
              radial-gradient(2px 2px at 300px 100px, rgba(255,255,255,0.5), transparent);
            background-size: 320px 200px;
            animation: twinkle 4s ease-in-out infinite alternate;
          }
          .shooting-stars::before, .shooting-stars::after {
            content: '';
            position: absolute;
            width: 100px;
            height: 2px;
            background: linear-gradient(90deg, white, transparent);
            animation: shoot 6s linear infinite;
            opacity: 0;
          }
          .shooting-stars::after {
            animation-delay: 3s;
            top: 30%;
            left: 70%;
          }
          .shooting-stars::before {
            top: 20%;
            left: 40%;
          }
          @keyframes shoot {
            0% { transform: translateX(0) translateY(0); opacity: 0; }
            5% { opacity: 1; }
            20% { transform: translateX(300px) translateY(100px); opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes twinkle {
            0% { opacity: 0.4; }
            100% { opacity: 0.8; }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float 3s ease-in-out infinite 1.5s;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient}`}>
        <div className="stars-bg absolute inset-0 opacity-50" />
      </div>

      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none animate-particle"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}, 0 0 ${particle.size * 4}px ${particle.color}`,
          }}
        />
      ))}

      {showConstellationCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-in zoom-in-50 fade-in duration-500">
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-4xl font-bold text-white mb-2">{showConstellationCelebration}</h2>
            <p className="text-xl text-purple-300">Constellation Complete!</p>
            <Badge className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-lg">
              +1 Power Unlocked
            </Badge>
          </div>
        </div>
      )}

      {isFrozen && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40">
          <Badge className="bg-cyan-500/80 text-white px-4 py-2 text-lg animate-pulse">
            <Timer className="w-5 h-5 mr-2 inline" />
            Time Frozen: {frozenTimeLeft}s
          </Badge>
        </div>
      )}

      <div className="relative z-10 py-4 px-2 md:px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => setShowMenu(true)}
            className="text-indigo-200 hover:text-white hover:bg-white/10"
            data-testid="button-back-menu"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Menu
          </Button>
          
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-300" />
            <span className="text-base font-bold text-white/90 hidden sm:inline">Celestial Memory</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-indigo-200 hover:text-white hover:bg-white/10"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              onClick={initializeGame}
              className="text-indigo-200 hover:text-white hover:bg-white/10"
              data-testid="button-restart"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-2 md:p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-300 mb-0.5">
                <Trophy className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-[10px] md:text-xs font-medium">Score</span>
              </div>
              <p className="text-lg md:text-xl font-bold text-white" data-testid="text-score">{score.toLocaleString()}</p>
              {comboMultiplier > 1 && (
                <span className="text-[10px] text-amber-400">x{comboMultiplier.toFixed(1)}</span>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-2 md:p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-purple-300 mb-0.5">
                <Target className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-[10px] md:text-xs font-medium">Moves</span>
              </div>
              <p className="text-lg md:text-xl font-bold text-white" data-testid="text-moves">{moves}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-2 md:p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-pink-300 mb-0.5">
                <Star className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-[10px] md:text-xs font-medium">Matched</span>
              </div>
              <p className="text-lg md:text-xl font-bold text-white" data-testid="text-matches">{matches}/{config.pairs}</p>
            </CardContent>
          </Card>
          
          <Card className={`bg-white/5 backdrop-blur-xl border-white/10 ${isFrozen ? 'ring-2 ring-cyan-400' : ''}`}>
            <CardContent className="p-2 md:p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-cyan-300 mb-0.5">
                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-[10px] md:text-xs font-medium">Time</span>
              </div>
              <p className="text-lg md:text-xl font-bold text-white" data-testid="text-timer">{formatTime(timer)}</p>
            </CardContent>
          </Card>

          <Card 
            className={`bg-white/5 backdrop-blur-xl border-white/10 cursor-pointer hover:bg-white/10 transition-all ${hintsRemaining === 0 ? 'opacity-50' : ''}`}
            onClick={useHint}
          >
            <CardContent className="p-2 md:p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-teal-300 mb-0.5">
                <Lightbulb className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-[10px] md:text-xs font-medium">Hints</span>
              </div>
              <p className="text-lg md:text-xl font-bold text-white" data-testid="text-hints">{hintsRemaining}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-2 md:p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-orange-300 mb-0.5">
                <Flame className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-[10px] md:text-xs font-medium">Streak</span>
              </div>
              <p className="text-lg md:text-xl font-bold text-white">{streak}</p>
            </CardContent>
          </Card>
        </div>

        {gameMode === "constellation" && (
          <div className="mb-4 p-3 bg-white/5 backdrop-blur rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-indigo-200/60">Constellation Progress</span>
              <div className="flex gap-2">
                {powerCharges.reveal > 0 && (
                  <Button size="sm" variant="outline" onClick={() => usePower("reveal")} className="h-7 text-xs border-violet-400/50 text-violet-300 hover:bg-violet-500/20">
                    <Eye className="w-3 h-3 mr-1" /> Reveal ({powerCharges.reveal})
                  </Button>
                )}
                {powerCharges.freeze > 0 && (
                  <Button size="sm" variant="outline" onClick={() => usePower("freeze")} className="h-7 text-xs border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20">
                    <Timer className="w-3 h-3 mr-1" /> Freeze ({powerCharges.freeze})
                  </Button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {constellations.map(c => (
                <div key={c.id} className={`p-2 rounded-lg border ${c.completed ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-purple-400/50' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center gap-1 mb-1">
                    {c.completed ? <Sparkles className="w-3 h-3 text-yellow-400" /> : <Compass className="w-3 h-3 text-white/40" />}
                    <span className={`text-xs font-medium ${c.completed ? 'text-purple-200' : 'text-white/60'}`}>{c.name}</span>
                  </div>
                  <Progress 
                    value={(cards.filter(card => c.pairs.includes(card.iconIndex) && card.isMatched).length / 2 / c.pairs.length) * 100} 
                    className="h-1.5" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl mb-4 relative overflow-hidden" ref={boardRef}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {constellationLines.map(line => (
              <line
                key={line.id}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={line.color}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.4"
                className="animate-in fade-in duration-500"
              />
            ))}
          </svg>
          <CardContent className="p-3 md:p-6 relative z-20">
            <div 
              className="grid gap-2 md:gap-3 justify-center mx-auto"
              style={{ 
                gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
                maxWidth: config.cols * 85
              }}
            >
              {cards.map((card) => {
                const celestialItem = CELESTIAL_ICONS[card.iconIndex];
                const IconComponent = celestialItem?.icon || Star;
                
                return (
                  <div key={card.id} style={{ perspective: '1000px' }}>
                    <button
                      ref={el => { if (el) cardRefs.current.set(card.id, el); }}
                      onClick={() => handleCardClick(card.id)}
                      disabled={card.isFlipped || card.isMatched || isChecking}
                      className={`
                        relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl
                        transition-all duration-500 transform-gpu
                        ${card.isHinted ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent animate-pulse scale-105' : ''}
                        ${!card.isFlipped && !card.isMatched ? 'hover:scale-105 cursor-pointer' : ''}
                      `}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)'
                      }}
                      data-testid={`card-${card.id}`}
                    >
                      <div 
                        className={`absolute inset-0 rounded-xl flex items-center justify-center bg-gradient-to-br ${theme.cardGradient} border border-white/20 shadow-lg ${!card.isFlipped && !card.isMatched ? 'hover:shadow-xl' : ''}`}
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
                        {card.isWild ? (
                          <Wand2 className="w-5 h-5 md:w-6 md:h-6 text-amber-300 animate-pulse" />
                        ) : (
                          <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-white/40" />
                        )}
                        {card.ghostVisible && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className={`absolute inset-0 rounded-xl flex items-center justify-center bg-gradient-to-br ${celestialItem?.gradient || 'from-purple-500 to-pink-500'} border-2 shadow-lg ${card.isMatched ? 'border-white/60 shadow-xl' : 'border-white/30'}`}
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent" />
                        {card.isWild && <div className="absolute inset-0 rounded-xl ring-2 ring-amber-400 animate-pulse" />}
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg relative z-10" />
                        {card.isMatched && (
                          <Sparkles className="absolute top-0.5 right-0.5 w-3 h-3 text-white animate-pulse" />
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Badge variant="outline" className="bg-white/5 border-white/20 text-indigo-200">
            {DIFFICULTY_CONFIG[difficulty].label} · {gameMode === "zen" ? "Zen" : gameMode === "challenge" ? "Challenge" : "Quest"}
          </Badge>
        </div>
      </div>

      {gameComplete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-gradient-to-br from-slate-900/95 via-purple-950/95 to-indigo-950/95 border-white/20 shadow-2xl animate-in zoom-in-95">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                {[...Array(getStarRating())].map((_, i) => (
                  <Star key={i} className="w-10 h-10 md:w-12 md:h-12 text-amber-400 fill-amber-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
                {[...Array(3 - getStarRating())].map((_, i) => (
                  <Star key={i} className="w-10 h-10 md:w-12 md:h-12 text-white/20" />
                ))}
              </div>
              <CardTitle className="text-2xl md:text-3xl bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                Mission Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-2xl font-bold text-amber-400">{score.toLocaleString()}</p>
                  <p className="text-xs text-indigo-200/60">Score</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-2xl font-bold text-white">{moves}</p>
                  <p className="text-xs text-indigo-200/60">Moves</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-2xl font-bold text-white">{formatTime(timer)}</p>
                  <p className="text-xs text-indigo-200/60">Time</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-2xl font-bold text-orange-400">{maxStreak}</p>
                  <p className="text-xs text-indigo-200/60">Max Streak</p>
                </div>
              </div>

              {constellations.filter(c => c.completed).length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {constellations.filter(c => c.completed).map(c => (
                    <Badge key={c.id} className="bg-purple-500/30 text-purple-200">
                      <Sparkles className="w-3 h-3 mr-1" /> {c.name}
                    </Badge>
                  ))}
                </div>
              )}

              {score === bestScores[difficulty].score && moves === bestScores[difficulty].moves && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0">
                  <Trophy className="w-4 h-4 mr-1" /> New Best Score!
                </Badge>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowMenu(true)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                  data-testid="button-back-to-menu"
                >
                  Menu
                </Button>
                <Button
                  onClick={initializeGame}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-0"
                  data-testid="button-play-again"
                >
                  <Rocket className="w-4 h-4 mr-2" /> Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <style>{`
        .stars-bg {
          background-image: 
            radial-gradient(2px 2px at 20px 30px, white, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, white, transparent),
            radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 160px 120px, white, transparent),
            radial-gradient(2px 2px at 200px 50px, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 250px 160px, white, transparent),
            radial-gradient(2px 2px at 300px 100px, rgba(255,255,255,0.5), transparent);
          background-size: 320px 200px;
          animation: twinkle 4s ease-in-out infinite alternate;
        }
        @keyframes twinkle { 0% { opacity: 0.3; } 100% { opacity: 0.7; } }
        @keyframes particle {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0) translateY(-60px); opacity: 0; }
        }
        .animate-particle { animation: particle 1.2s ease-out forwards; }
      `}</style>
    </div>
  );
}
