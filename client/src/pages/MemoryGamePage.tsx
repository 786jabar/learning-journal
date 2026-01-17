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
  Wand2,
  Timer,
  Calendar,
  Infinity,
  Award,
  Medal,
  Gift,
  ChevronRight,
  Layers,
  Anchor,
  Bird,
  Feather,
  Flower2,
  Leaf,
  Mountain,
  Shell,
  Waves,
  TreePine,
  CircleDot,
  Hexagon,
  Pentagon,
  Triangle,
  Dice5,
  Clover,
  Palmtree
} from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GameMode = "zen" | "challenge" | "constellation" | "daily" | "endless";
type PowerUp = "reveal" | "freeze" | "shuffle" | null;
type ThemeId = "cosmic" | "aurora" | "nebula" | "solar";
type CardBackId = "stars" | "galaxy" | "planets" | "crystals" | "dragons";

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
  type: "spark" | "comet" | "star";
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  delay: number;
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

interface CardBack {
  id: CardBackId;
  name: string;
  pattern: string;
  unlocked: boolean;
  requiredScore: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

const CELESTIAL_ICONS = [
  { icon: Moon, name: "Luna", gradient: "from-slate-200 via-blue-300 to-indigo-400" },
  { icon: Sun, name: "Sol", gradient: "from-yellow-300 via-amber-400 to-orange-500" },
  { icon: Star, name: "Polaris", gradient: "from-yellow-200 via-amber-300 to-yellow-500" },
  { icon: Sparkles, name: "Nebula", gradient: "from-pink-300 via-purple-400 to-violet-600" },
  { icon: CloudLightning, name: "Storm", gradient: "from-sky-300 via-cyan-400 to-blue-600" },
  { icon: Flame, name: "Nova", gradient: "from-amber-400 via-orange-500 to-red-600" },
  { icon: Droplets, name: "Hydra", gradient: "from-cyan-300 via-blue-400 to-indigo-500" },
  { icon: Wind, name: "Zephyr", gradient: "from-emerald-300 via-teal-400 to-cyan-500" },
  { icon: Snowflake, name: "Cryo", gradient: "from-white via-blue-200 to-indigo-400" },
  { icon: Heart, name: "Pulsar", gradient: "from-pink-300 via-rose-400 to-red-500" },
  { icon: Diamond, name: "Crystal", gradient: "from-violet-200 via-purple-400 to-fuchsia-500" },
  { icon: Crown, name: "Corona", gradient: "from-amber-300 via-yellow-400 to-orange-500" },
  { icon: Gem, name: "Stardust", gradient: "from-pink-300 via-fuchsia-400 to-purple-500" },
  { icon: Rocket, name: "Voyager", gradient: "from-slate-300 via-gray-400 to-zinc-600" },
  { icon: Globe, name: "Terra", gradient: "from-emerald-300 via-green-400 to-teal-600" },
  { icon: Orbit, name: "Eclipse", gradient: "from-indigo-300 via-violet-400 to-purple-600" },
  { icon: Bird, name: "Phoenix", gradient: "from-orange-300 via-red-400 to-rose-600" },
  { icon: Feather, name: "Zephyra", gradient: "from-sky-200 via-cyan-300 to-teal-500" },
  { icon: Flower2, name: "Blossom", gradient: "from-pink-200 via-rose-400 to-fuchsia-500" },
  { icon: Leaf, name: "Verdant", gradient: "from-lime-300 via-green-400 to-emerald-600" },
  { icon: Mountain, name: "Titan", gradient: "from-stone-300 via-slate-400 to-gray-600" },
  { icon: Shell, name: "Nautilus", gradient: "from-amber-200 via-orange-300 to-rose-400" },
  { icon: Waves, name: "Oceanus", gradient: "from-blue-300 via-cyan-400 to-teal-500" },
  { icon: TreePine, name: "Evergreen", gradient: "from-green-300 via-emerald-400 to-green-600" },
  { icon: Hexagon, name: "Prism", gradient: "from-violet-300 via-indigo-400 to-blue-500" },
  { icon: Triangle, name: "Delta", gradient: "from-cyan-300 via-sky-400 to-blue-500" },
  { icon: Clover, name: "Fortune", gradient: "from-lime-300 via-emerald-400 to-green-500" },
  { icon: Anchor, name: "Harbor", gradient: "from-slate-300 via-blue-400 to-indigo-500" },
  { icon: Compass, name: "Navigator", gradient: "from-amber-300 via-yellow-400 to-lime-500" },
  { icon: Eye, name: "Oracle", gradient: "from-violet-300 via-purple-400 to-indigo-600" },
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

const CARD_BACKS: CardBack[] = [
  { id: "stars", name: "Starfield", pattern: "stars", unlocked: true, requiredScore: 0 },
  { id: "galaxy", name: "Galaxy Spiral", pattern: "galaxy", unlocked: false, requiredScore: 5000 },
  { id: "planets", name: "Planetary", pattern: "planets", unlocked: false, requiredScore: 15000 },
  { id: "crystals", name: "Crystal Cave", pattern: "crystals", unlocked: false, requiredScore: 30000 },
  { id: "dragons", name: "Dragon Scale", pattern: "dragons", unlocked: false, requiredScore: 50000 },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_win", name: "First Light", description: "Win your first game", icon: "star", unlocked: false, progress: 0, target: 1 },
  { id: "streak_5", name: "Hot Streak", description: "Get a 5-match streak", icon: "flame", unlocked: false, progress: 0, target: 5 },
  { id: "perfect_game", name: "Perfect Memory", description: "Win with no mistakes", icon: "trophy", unlocked: false, progress: 0, target: 1 },
  { id: "speed_demon", name: "Speed Demon", description: "Win in under 60 seconds", icon: "clock", unlocked: false, progress: 0, target: 1 },
  { id: "constellation_master", name: "Constellation Master", description: "Complete all constellations in one game", icon: "compass", unlocked: false, progress: 0, target: 1 },
  { id: "score_10k", name: "Star Collector", description: "Reach 10,000 total score", icon: "gem", unlocked: false, progress: 0, target: 10000 },
  { id: "endless_10", name: "Endless Explorer", description: "Match 10 pairs in Endless mode", icon: "infinity", unlocked: false, progress: 0, target: 10 },
  { id: "daily_streak", name: "Daily Devotion", description: "Complete 7 daily challenges", icon: "calendar", unlocked: false, progress: 0, target: 7 },
];

const DIFFICULTY_CONFIG = {
  easy: { pairs: 6, cols: 4, rows: 3, label: "Stargazer", wildCards: 0, constellations: 2 },
  medium: { pairs: 9, cols: 6, rows: 3, label: "Explorer", wildCards: 1, constellations: 3 },
  hard: { pairs: 12, cols: 6, rows: 4, label: "Astronomer", wildCards: 2, constellations: 4 }
};

function getDailySeed() {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

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
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [showMenu, setShowMenu] = useState(true);
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [powerCharges, setPowerCharges] = useState<Record<string, number>>({ reveal: 0, freeze: 0 });
  const [isFrozen, setIsFrozen] = useState(false);
  const [frozenTimeLeft, setFrozenTimeLeft] = useState(0);
  const [constellationLines, setConstellationLines] = useState<ConstellationLine[]>([]);
  const [showConstellationCelebration, setShowConstellationCelebration] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>("cosmic");
  const [currentCardBack, setCurrentCardBack] = useState<CardBackId>("stars");
  const [themes, setThemes] = useState<GameTheme[]>(THEMES);
  const [cardBacks, setCardBacks] = useState<CardBack[]>(CARD_BACKS);
  const [totalWins, setTotalWins] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [dailyChallengesCompleted, setDailyChallengesCompleted] = useState(0);
  const [lastDailyDate, setLastDailyDate] = useState<string>("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{ oscillators: OscillatorNode[]; gains: GainNode[] } | null>(null);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showCardBackSelector, setShowCardBackSelector] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [score, setScore] = useState(0);
  const [endlessLevel, setEndlessLevel] = useState(1);
  const [endlessPairs, setEndlessPairs] = useState(4);
  const [endlessTotalMatches, setEndlessTotalMatches] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [bestScores, setBestScores] = useState<Record<string, { score: number; moves: number }>>({
    easy: { score: 0, moves: 0 },
    medium: { score: 0, moves: 0 },
    hard: { score: 0, moves: 0 },
    daily: { score: 0, moves: 0 },
    endless: { score: 0, moves: 0 }
  });
  const boardRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const config = gameMode === "endless" 
    ? { pairs: endlessPairs, cols: Math.min(6, Math.ceil(Math.sqrt(endlessPairs * 2))), rows: Math.ceil((endlessPairs * 2) / Math.min(6, Math.ceil(Math.sqrt(endlessPairs * 2)))), label: `Level ${endlessLevel}`, wildCards: Math.floor(endlessLevel / 3), constellations: 0 }
    : gameMode === "daily"
      ? { pairs: 8, cols: 4, rows: 4, label: "Daily", wildCards: 1, constellations: 0 }
      : DIFFICULTY_CONFIG[difficulty];
  const theme = themes.find(t => t.id === currentTheme) || THEMES[0];

  // Generate shooting stars periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const star: ShootingStar = {
          id: Date.now(),
          startX: Math.random() * 100,
          startY: Math.random() * 50,
          angle: 30 + Math.random() * 30,
          delay: 0
        };
        setShootingStars(prev => [...prev.slice(-5), star]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Ambient space music generator
  const startAmbientMusic = useCallback(() => {
    if (audioContextRef.current) return;
    
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioContextRef.current = ctx;
    
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(ctx.destination);
    
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];
    
    // Deep bass drone
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = "sine";
    bassOsc.frequency.value = 55; // A1
    bassGain.gain.value = 0.3;
    bassOsc.connect(bassGain);
    bassGain.connect(masterGain);
    bassOsc.start();
    oscillators.push(bassOsc);
    gains.push(bassGain);
    
    // Harmonic layers
    const harmonics = [110, 165, 220, 330]; // A2, E3, A3, E4
    harmonics.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0.1 - i * 0.02;
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      oscillators.push(osc);
      gains.push(gain);
      
      // Gentle frequency modulation for shimmer
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.value = 0.1 + i * 0.05;
      lfoGain.gain.value = 2;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      oscillators.push(lfo);
    });
    
    // High ethereal pad
    const padOsc = ctx.createOscillator();
    const padGain = ctx.createGain();
    padOsc.type = "triangle";
    padOsc.frequency.value = 440;
    padGain.gain.value = 0.05;
    padOsc.connect(padGain);
    padGain.connect(masterGain);
    padOsc.start();
    oscillators.push(padOsc);
    gains.push(padGain);
    
    // Slow modulation on pad
    const padLfo = ctx.createOscillator();
    const padLfoGain = ctx.createGain();
    padLfo.type = "sine";
    padLfo.frequency.value = 0.05;
    padLfoGain.gain.value = 50;
    padLfo.connect(padLfoGain);
    padLfoGain.connect(padOsc.frequency);
    padLfo.start();
    oscillators.push(padLfo);
    
    audioNodesRef.current = { oscillators, gains };
  }, []);

  const stopAmbientMusic = useCallback(() => {
    if (audioNodesRef.current) {
      audioNodesRef.current.oscillators.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      audioNodesRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  // Toggle music on/off
  const toggleMusic = useCallback(() => {
    if (musicEnabled) {
      stopAmbientMusic();
      setMusicEnabled(false);
    } else {
      startAmbientMusic();
      setMusicEnabled(true);
    }
  }, [musicEnabled, startAmbientMusic, stopAmbientMusic]);

  // Cleanup music on unmount
  useEffect(() => {
    return () => {
      stopAmbientMusic();
    };
  }, [stopAmbientMusic]);

  useEffect(() => {
    const saved = localStorage.getItem("celestial-memory-data");
    if (saved) {
      const data = JSON.parse(saved);
      setBestScores(data.bestScores || bestScores);
      setTotalWins(data.totalWins || 0);
      setTotalScore(data.totalScore || 0);
      setDailyChallengesCompleted(data.dailyChallengesCompleted || 0);
      setLastDailyDate(data.lastDailyDate || "");
      if (data.currentTheme) setCurrentTheme(data.currentTheme);
      if (data.currentCardBack) setCurrentCardBack(data.currentCardBack);
      if (data.achievements) setAchievements(data.achievements);
      setThemes(prev => prev.map(t => ({
        ...t,
        unlocked: t.requiredWins <= (data.totalWins || 0)
      })));
      setCardBacks(prev => prev.map(cb => ({
        ...cb,
        unlocked: cb.requiredScore <= (data.totalScore || 0)
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

  const saveGameData = useCallback((updates: Record<string, unknown>) => {
    const saved = localStorage.getItem("celestial-memory-data");
    const data = saved ? JSON.parse(saved) : {};
    localStorage.setItem("celestial-memory-data", JSON.stringify({ ...data, ...updates }));
  }, []);

  const unlockAchievement = useCallback((achievementId: string) => {
    setAchievements(prev => {
      const updated = prev.map(a => 
        a.id === achievementId && !a.unlocked ? { ...a, unlocked: true, progress: a.target } : a
      );
      const unlockedAch = updated.find(a => a.id === achievementId);
      if (unlockedAch && !prev.find(a => a.id === achievementId)?.unlocked) {
        setNewAchievement(unlockedAch);
        setTimeout(() => setNewAchievement(null), 3000);
      }
      saveGameData({ achievements: updated });
      return updated;
    });
  }, [saveGameData]);

  const updateAchievementProgress = useCallback((achievementId: string, progress: number) => {
    setAchievements(prev => {
      const updated = prev.map(a => {
        if (a.id === achievementId && !a.unlocked) {
          const newProgress = Math.min(progress, a.target);
          if (newProgress >= a.target) {
            setTimeout(() => unlockAchievement(achievementId), 500);
          }
          return { ...a, progress: newProgress };
        }
        return a;
      });
      saveGameData({ achievements: updated });
      return updated;
    });
  }, [saveGameData, unlockAchievement]);

  const createParticles = useCallback((x: number, y: number, color: string, count: number = 12, type: "spark" | "comet" | "star" = "spark") => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x: x + (Math.random() - 0.5) * 150,
        y: y + (Math.random() - 0.5) * 150,
        color,
        size: type === "star" ? 8 + Math.random() * 8 : 3 + Math.random() * 6,
        type
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, type === "comet" ? 2000 : 1200);
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

  const initializeGame = useCallback((mode?: GameMode, seed?: number) => {
    const currentMode = mode || gameMode;
    const pairCount = currentMode === "endless" ? 4 : currentMode === "daily" ? 8 : config.pairs;
    const wildCount = currentMode === "endless" ? 0 : currentMode === "daily" ? 1 : config.wildCards;
    
    const selectedIcons = CELESTIAL_ICONS.slice(0, pairCount);
    const cardPairs: CardItem[] = [];
    
    const numConstellations = currentMode === "constellation" ? config.constellations : 0;
    const pairsPerConstellation = numConstellations > 0 ? Math.floor(pairCount / numConstellations) : 0;
    
    selectedIcons.forEach((_, index) => {
      const constellationId = numConstellations > 0 ? Math.floor(index / pairsPerConstellation) : 0;
      cardPairs.push(
        { id: index * 2, iconIndex: index, isFlipped: false, isMatched: false, isHinted: false, isWild: false, constellationId, ghostVisible: false },
        { id: index * 2 + 1, iconIndex: index, isFlipped: false, isMatched: false, isHinted: false, isWild: false, constellationId, ghostVisible: false }
      );
    });

    if (wildCount > 0) {
      const indices = cardPairs.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      for (let w = 0; w < Math.min(wildCount, cardPairs.length); w++) {
        cardPairs[indices[w]].isWild = true;
      }
    }

    // Shuffle cards (use seed for daily challenge)
    if (seed) {
      let seedVal = seed;
      for (let i = cardPairs.length - 1; i > 0; i--) {
        seedVal = (seedVal * 9301 + 49297) % 233280;
        const j = Math.floor((seedVal / 233280) * (i + 1));
        [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
      }
    } else {
      for (let i = cardPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
      }
    }

    const gameConstellations: Constellation[] = numConstellations > 0
      ? CONSTELLATIONS.slice(0, numConstellations).map((c, idx) => ({
          ...c,
          id: idx,
          pairs: Array.from({ length: pairsPerConstellation }, (_, i) => idx * pairsPerConstellation + i),
          completed: false
        }))
      : [];

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
    setIsFrozen(false);
    setFrozenTimeLeft(0);
    setShowMenu(false);
    
    if (currentMode === "endless") {
      setEndlessLevel(1);
      setEndlessPairs(4);
      setEndlessTotalMatches(0);
    }
  }, [gameMode, config]);

  const advanceEndlessLevel = useCallback(() => {
    const nextLevel = endlessLevel + 1;
    const nextPairs = Math.min(4 + nextLevel, 16);
    
    setEndlessLevel(nextLevel);
    setEndlessPairs(nextPairs);
    
    // Create new cards for next level
    const selectedIcons = CELESTIAL_ICONS.slice(0, nextPairs);
    const cardPairs: CardItem[] = [];
    
    selectedIcons.forEach((_, index) => {
      cardPairs.push(
        { id: index * 2 + (nextLevel * 100), iconIndex: index, isFlipped: false, isMatched: false, isHinted: false, isWild: nextLevel > 3 && index === 0, constellationId: 0, ghostVisible: false },
        { id: index * 2 + 1 + (nextLevel * 100), iconIndex: index, isFlipped: false, isMatched: false, isHinted: false, isWild: false, constellationId: 0, ghostVisible: false }
      );
    });

    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }

    setCards(cardPairs);
    setMatches(0);
    setConstellationLines([]);
    setHintsRemaining(h => h + 1);
    
    // Level up celebration
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      createParticles(rect.width / 2, rect.height / 2, "#fbbf24", 30, "star");
    }
  }, [endlessLevel, createParticles]);

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
        
        // Check streak achievement
        if (newStreak >= 5) unlockAchievement("streak_5");
        
        const newMultiplier = Math.min(1 + newStreak * 0.5, 5);
        setComboMultiplier(newMultiplier);
        
        const basePoints = 100;
        const wildBonus = (firstCard.isWild || secondCard.isWild) ? 50 : 0;
        const endlessBonus = gameMode === "endless" ? endlessLevel * 20 : 0;
        const points = Math.round((basePoints + wildBonus + endlessBonus) * newMultiplier);

        if (boardRef.current) {
          const rect = boardRef.current.getBoundingClientRect();
          const gradient = CELESTIAL_ICONS[firstCard.iconIndex]?.gradient || "from-purple-500 to-pink-500";
          const color = gradient.includes("pink") ? "#ec4899" : 
                       gradient.includes("purple") ? "#a855f7" :
                       gradient.includes("blue") ? "#3b82f6" :
                       gradient.includes("amber") ? "#f59e0b" :
                       gradient.includes("emerald") ? "#10b981" : "#8b5cf6";
          createParticles(rect.width / 2, rect.height / 2, color, 25, newStreak >= 3 ? "comet" : "spark");
        }

        addConstellationLine(firstId, secondId, newStreak >= 3 ? "#fbbf24" : "#fff");
        
        const newScore = score + points;
        const newMoves = moves + 1;

        setTimeout(() => {
          // Calculate updated cards with match
          const updatedCards = cards.map(c => 
            c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
          );
          setCards(updatedCards);
          
          const matchedIconIndex = (firstCard.isWild && secondCard.isWild) 
            ? -1 
            : firstCard.isWild 
              ? secondCard.iconIndex 
              : firstCard.iconIndex;
          
          // Track constellation completion and check for master achievement
          let allConstellationsComplete = false;
          if (matchedIconIndex >= 0 && gameMode === "constellation") {
            setConstellations(prevConst => {
              const updated = prevConst.map(constellation => {
                if (constellation.pairs.includes(matchedIconIndex) && !constellation.completed) {
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
              allConstellationsComplete = updated.every(c => c.completed);
              return updated;
            });
          }
          
          setScore(newScore);
          
          const newMatches = matches + 1;
          setMatches(newMatches);
          const targetPairs = gameMode === "endless" ? endlessPairs : gameMode === "daily" ? 8 : config.pairs;
          
          if (newMatches === targetPairs) {
            if (gameMode === "endless") {
              // Track total matches and advance to next level
              const newEndlessTotal = endlessTotalMatches + newMatches;
              setEndlessTotalMatches(newEndlessTotal);
              updateAchievementProgress("endless_10", newEndlessTotal);
              
              // Save endless best score
              if (bestScores.endless.score === 0 || newScore > bestScores.endless.score) {
                const newScores = { ...bestScores, endless: { score: newScore, moves: newMoves }};
                setBestScores(newScores);
                saveGameData({ bestScores: newScores });
              }
              
              setTimeout(() => advanceEndlessLevel(), 1000);
            } else {
              setGameComplete(true);
              const newWins = totalWins + 1;
              const newTotalScore = totalScore + newScore;
              setTotalWins(newWins);
              setTotalScore(newTotalScore);
              
              // Build updated achievements list directly
              let updatedAchievements = [...achievements];
              const unlockAch = (id: string) => {
                updatedAchievements = updatedAchievements.map(a => 
                  a.id === id && !a.unlocked ? { ...a, unlocked: true, progress: a.target } : a
                );
                const ach = updatedAchievements.find(a => a.id === id);
                if (ach && !achievements.find(a => a.id === id)?.unlocked) {
                  setNewAchievement(ach);
                  setTimeout(() => setNewAchievement(null), 3000);
                }
              };
              
              // Check achievements
              unlockAch("first_win");
              if (timer < 60) unlockAch("speed_demon");
              if (newMoves === targetPairs) unlockAch("perfect_game");
              if (newTotalScore >= 10000) unlockAch("score_10k");
              if (gameMode === "constellation" && allConstellationsComplete) {
                unlockAch("constellation_master");
              }
              
              setAchievements(updatedAchievements);
              
              if (gameMode === "daily") {
                const today = new Date().toISOString().split('T')[0];
                if (lastDailyDate !== today) {
                  const newDailyCount = dailyChallengesCompleted + 1;
                  setDailyChallengesCompleted(newDailyCount);
                  setLastDailyDate(today);
                  if (newDailyCount >= 7) unlockAch("daily_streak");
                  saveGameData({ dailyChallengesCompleted: newDailyCount, lastDailyDate: today });
                }
              }
              
              setThemes(prev => prev.map(t => ({
                ...t,
                unlocked: t.requiredWins <= newWins
              })));
              setCardBacks(prev => prev.map(cb => ({
                ...cb,
                unlocked: cb.requiredScore <= newTotalScore
              })));
              
              const scoreKey = gameMode === "daily" ? "daily" : difficulty;
              const newScores = bestScores[scoreKey].score === 0 || newScore > bestScores[scoreKey].score
                ? { ...bestScores, [scoreKey]: { score: newScore, moves: newMoves }}
                : bestScores;
              if (newScores !== bestScores) setBestScores(newScores);
              
              // Save all data with updated achievements
              saveGameData({
                bestScores: newScores,
                totalWins: newWins,
                totalScore: newTotalScore,
                currentTheme,
                currentCardBack,
                achievements: updatedAchievements
              });
            }
          }
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
    const targetPairs = gameMode === "endless" ? endlessPairs : gameMode === "daily" ? 8 : config.pairs;
    const ratio = moves / targetPairs;
    if (ratio <= 1.3) return 3;
    if (ratio <= 2) return 2;
    return 1;
  };

  const getCardBackStyle = () => {
    switch (currentCardBack) {
      case "galaxy": return "bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900";
      case "planets": return "bg-gradient-to-br from-orange-600 via-red-700 to-purple-800";
      case "crystals": return "bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700";
      case "dragons": return "bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500";
      default: return `bg-gradient-to-br ${theme.cardGradient}`;
    }
  };

  const isDailyCompleted = lastDailyDate === new Date().toISOString().split('T')[0];

  if (showMenu) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient}`}>
          <div className="stars-bg absolute inset-0 opacity-60" />
          <div className="aurora-bg absolute inset-0" />
          {shootingStars.map(star => (
            <div
              key={star.id}
              className="shooting-star"
              style={{
                left: `${star.startX}%`,
                top: `${star.startY}%`,
                transform: `rotate(${star.angle}deg)`,
                animationDelay: `${star.delay}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 py-8">
          <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="relative">
                <Moon className="w-8 h-8 md:w-12 md:h-12 text-indigo-300 animate-float" />
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Celestial Memory
              </h1>
              <div className="relative">
                <Star className="w-8 h-8 md:w-12 md:h-12 text-amber-300 animate-float-delayed" />
              </div>
            </div>
            <p className="text-indigo-200/80 text-sm md:text-base">Discover constellations, unlock cosmic powers</p>
            
            <div className="flex justify-center gap-3 mt-3">
              <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/30">
                <Trophy className="w-3 h-3 mr-1" /> {totalWins} Wins
              </Badge>
              <Badge className="bg-amber-500/30 text-amber-200 border-amber-400/30">
                <Star className="w-3 h-3 mr-1" /> {totalScore.toLocaleString()} pts
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAchievements(true)}
                className="text-indigo-200 hover:text-white"
                data-testid="button-achievements"
              >
                <Award className="w-4 h-4 mr-1" />
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMusic}
                className={`${musicEnabled ? 'text-emerald-400 bg-emerald-500/20' : 'text-indigo-200'} hover:text-white`}
                data-testid="button-menu-music"
              >
                <span className="mr-1">♪</span>
                {musicEnabled ? "On" : "Off"}
              </Button>
            </div>
          </div>

          <Card className="w-full max-w-lg bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center gap-3">
                <CardTitle className="text-lg md:text-xl text-white/90">Choose Your Quest</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { setShowThemeSelector(!showThemeSelector); setShowCardBackSelector(false); }}
                  className="text-purple-300 hover:text-white h-8 w-8"
                  data-testid="button-theme-selector"
                >
                  <Palette className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { setShowCardBackSelector(!showCardBackSelector); setShowThemeSelector(false); }}
                  className="text-cyan-300 hover:text-white h-8 w-8"
                  data-testid="button-cardback-selector"
                >
                  <Layers className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showThemeSelector && (
                <div className="space-y-2 p-3 bg-white/5 rounded-xl border border-white/10 animate-in fade-in">
                  <p className="text-xs text-indigo-200/60 text-center">Themes (Win games to unlock)</p>
                  <div className="grid grid-cols-2 gap-2">
                    {themes.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          if (t.unlocked) {
                            setCurrentTheme(t.id);
                            saveGameData({ currentTheme: t.id });
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
                </div>
              )}

              {showCardBackSelector && (
                <div className="space-y-2 p-3 bg-white/5 rounded-xl border border-white/10 animate-in fade-in">
                  <p className="text-xs text-indigo-200/60 text-center">Card Backs (Score to unlock)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {cardBacks.map(cb => (
                      <button
                        key={cb.id}
                        onClick={() => {
                          if (cb.unlocked) {
                            setCurrentCardBack(cb.id);
                            saveGameData({ currentCardBack: cb.id });
                          }
                        }}
                        disabled={!cb.unlocked}
                        className={`p-2 rounded-lg text-xs transition-all border ${
                          currentCardBack === cb.id
                            ? 'bg-white/20 border-cyan-400'
                            : cb.unlocked
                              ? 'bg-white/5 border-white/10 hover:bg-white/10'
                              : 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {cb.unlocked ? <Gift className="w-4 h-4 text-cyan-300" /> : <Lock className="w-4 h-4 text-white/30" />}
                          <span className={cb.unlocked ? 'text-white/80' : 'text-white/40'}>{cb.name}</span>
                          {!cb.unlocked && <span className="text-white/30 text-[9px]">{cb.requiredScore.toLocaleString()}</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Game Modes */}
              <div className="space-y-2">
                <p className="text-sm text-indigo-200/60 text-center">Game Mode</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setGameMode("daily"); initializeGame("daily", getDailySeed()); }}
                    disabled={isDailyCompleted}
                    className={`p-3 rounded-xl transition-all border text-left relative overflow-hidden ${
                      isDailyCompleted
                        ? 'bg-green-500/20 border-green-400/30'
                        : 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-400/30 hover:border-amber-400/50'
                    }`}
                    data-testid="button-mode-daily"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-5 h-5 ${isDailyCompleted ? 'text-green-300' : 'text-amber-300'}`} />
                      <div>
                        <div className="text-sm font-semibold text-white/90">Daily Challenge</div>
                        <div className="text-xs text-white/50">{isDailyCompleted ? 'Completed!' : 'New puzzle today'}</div>
                      </div>
                    </div>
                    {isDailyCompleted && <Medal className="absolute top-2 right-2 w-5 h-5 text-green-400" />}
                  </button>
                  <button
                    onClick={() => { setGameMode("endless"); initializeGame("endless"); }}
                    className="p-3 rounded-xl transition-all border text-left bg-gradient-to-br from-violet-500/20 to-purple-600/20 border-violet-400/30 hover:border-violet-400/50"
                    data-testid="button-mode-endless"
                  >
                    <div className="flex items-center gap-2">
                      <Infinity className="w-5 h-5 text-violet-300" />
                      <div>
                        <div className="text-sm font-semibold text-white/90">Endless Mode</div>
                        <div className="text-xs text-white/50">How far can you go?</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Standard Modes */}
              <div className="space-y-2">
                <p className="text-sm text-indigo-200/60 text-center">Classic Modes</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setGameMode("zen")}
                    className={`p-2 rounded-xl transition-all border text-center ${
                      gameMode === "zen"
                        ? 'bg-gradient-to-br from-teal-500/30 to-cyan-600/30 border-teal-400/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    data-testid="button-mode-zen"
                  >
                    <Eye className={`w-4 h-4 mx-auto mb-1 ${gameMode === "zen" ? 'text-teal-300' : 'text-white/50'}`} />
                    <div className={`text-xs font-semibold ${gameMode === "zen" ? 'text-teal-200' : 'text-white/70'}`}>Zen</div>
                  </button>
                  <button
                    onClick={() => setGameMode("challenge")}
                    className={`p-2 rounded-xl transition-all border text-center ${
                      gameMode === "challenge"
                        ? 'bg-gradient-to-br from-orange-500/30 to-red-600/30 border-orange-400/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    data-testid="button-mode-challenge"
                  >
                    <Zap className={`w-4 h-4 mx-auto mb-1 ${gameMode === "challenge" ? 'text-orange-300' : 'text-white/50'}`} />
                    <div className={`text-xs font-semibold ${gameMode === "challenge" ? 'text-orange-200' : 'text-white/70'}`}>Challenge</div>
                  </button>
                  <button
                    onClick={() => setGameMode("constellation")}
                    className={`p-2 rounded-xl transition-all border text-center ${
                      gameMode === "constellation"
                        ? 'bg-gradient-to-br from-violet-500/30 to-purple-600/30 border-violet-400/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    data-testid="button-mode-constellation"
                  >
                    <Compass className={`w-4 h-4 mx-auto mb-1 ${gameMode === "constellation" ? 'text-violet-300' : 'text-white/50'}`} />
                    <div className={`text-xs font-semibold ${gameMode === "constellation" ? 'text-violet-200' : 'text-white/70'}`}>Quest</div>
                  </button>
                </div>
              </div>

              {/* Difficulty (for standard modes) */}
              {(gameMode === "zen" || gameMode === "challenge" || gameMode === "constellation") && (
                <div className="space-y-2">
                  <p className="text-sm text-indigo-200/60 text-center">Difficulty</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`p-2 rounded-xl transition-all border ${
                          difficulty === d 
                            ? 'bg-gradient-to-br from-purple-500/30 to-indigo-600/30 border-purple-400/50' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        data-testid={`button-difficulty-${d}`}
                      >
                        <div className={`text-xs font-semibold ${difficulty === d ? 'text-purple-200' : 'text-white/70'}`}>
                          {DIFFICULTY_CONFIG[d].label}
                        </div>
                        <div className="text-[10px] text-white/40 mt-0.5">{DIFFICULTY_CONFIG[d].pairs} pairs</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={() => initializeGame()}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 text-white font-semibold py-5 text-base shadow-xl shadow-purple-500/25 border-0"
                data-testid="button-start-game"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Launch Mission
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Modal */}
        {showAchievements && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAchievements(false)}>
            <Card className="w-full max-w-md bg-gradient-to-br from-slate-900/95 via-purple-950/95 to-indigo-950/95 border-white/20 shadow-2xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-center bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 overflow-y-auto max-h-[60vh]">
                {achievements.map(ach => (
                  <div key={ach.id} className={`p-3 rounded-lg border ${ach.unlocked ? 'bg-amber-500/20 border-amber-400/30' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ach.unlocked ? 'bg-amber-500/30' : 'bg-white/10'}`}>
                        {ach.icon === "star" && <Star className={`w-5 h-5 ${ach.unlocked ? 'text-amber-400' : 'text-white/30'}`} />}
                        {ach.icon === "flame" && <Flame className={`w-5 h-5 ${ach.unlocked ? 'text-amber-400' : 'text-white/30'}`} />}
                        {ach.icon === "trophy" && <Trophy className={`w-5 h-5 ${ach.unlocked ? 'text-amber-400' : 'text-white/30'}`} />}
                        {ach.icon === "clock" && <Clock className={`w-5 h-5 ${ach.unlocked ? 'text-amber-400' : 'text-white/30'}`} />}
                        {ach.icon === "compass" && <Compass className={`w-5 h-5 ${ach.unlocked ? 'text-amber-400' : 'text-white/30'}`} />}
                        {ach.icon === "gem" && <Gem className={`w-5 h-5 ${ach.unlocked ? 'text-amber-400' : 'text-white/30'}`} />}
                        {ach.icon === "infinity" && <Infinity className={`w-5 h-5 ${ach.unlocked ? 'text-amber-400' : 'text-white/30'}`} />}
                        {ach.icon === "calendar" && <Calendar className={`w-5 h-5 ${ach.unlocked ? 'text-amber-400' : 'text-white/30'}`} />}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-semibold ${ach.unlocked ? 'text-amber-200' : 'text-white/60'}`}>{ach.name}</div>
                        <div className="text-xs text-white/40">{ach.description}</div>
                        {!ach.unlocked && (
                          <Progress value={(ach.progress / ach.target) * 100} className="h-1 mt-1" />
                        )}
                      </div>
                      {ach.unlocked && <Medal className="w-5 h-5 text-amber-400" />}
                    </div>
                  </div>
                ))}
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
          .aurora-bg {
            background: linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.1) 50%, transparent 100%);
            animation: aurora 8s ease-in-out infinite;
          }
          @keyframes aurora {
            0%, 100% { opacity: 0.3; transform: translateY(0); }
            50% { opacity: 0.6; transform: translateY(-20px); }
          }
          .shooting-star {
            position: absolute;
            width: 100px;
            height: 2px;
            background: linear-gradient(90deg, white, transparent);
            animation: shoot 1.5s linear forwards;
          }
          @keyframes shoot {
            0% { transform: translateX(0) translateY(0) rotate(inherit); opacity: 1; }
            100% { transform: translateX(300px) translateY(150px) rotate(inherit); opacity: 0; }
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

  const targetPairs = gameMode === "endless" ? endlessPairs : gameMode === "daily" ? 8 : config.pairs;
  const gridCols = gameMode === "endless" 
    ? Math.min(6, Math.ceil(Math.sqrt(endlessPairs * 2)))
    : gameMode === "daily" ? 4 : config.cols;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient}`}>
        <div className="stars-bg absolute inset-0 opacity-50" />
        <div className="aurora-bg absolute inset-0" />
      </div>

      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute rounded-full pointer-events-none ${particle.type === "comet" ? "animate-comet" : particle.type === "star" ? "animate-star" : "animate-particle"}`}
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

      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4">
          <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-2 text-base shadow-lg">
            <Award className="w-5 h-5 mr-2" />
            Achievement Unlocked: {newAchievement.name}!
          </Badge>
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
        <div className="flex items-center justify-between mb-3">
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
            {gameMode === "daily" && <Calendar className="w-5 h-5 text-amber-300" />}
            {gameMode === "endless" && <Infinity className="w-5 h-5 text-violet-300" />}
            {gameMode !== "daily" && gameMode !== "endless" && <Moon className="w-5 h-5 text-indigo-300" />}
            <span className="text-sm font-bold text-white/90">
              {gameMode === "daily" ? "Daily Challenge" : gameMode === "endless" ? `Endless Lv.${endlessLevel}` : "Celestial Memory"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMusic}
              className={`h-8 w-8 ${musicEnabled ? 'text-emerald-400 bg-emerald-500/20' : 'text-indigo-200'} hover:text-white hover:bg-white/10`}
              data-testid="button-music-toggle"
              title={musicEnabled ? "Music On" : "Music Off"}
            >
              {musicEnabled ? (
                <span className="text-xs font-bold">♪</span>
              ) : (
                <span className="text-xs font-bold opacity-50">♪</span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-indigo-200 hover:text-white hover:bg-white/10 h-8 w-8"
              data-testid="button-sound-toggle"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => initializeGame()}
              className="text-indigo-200 hover:text-white hover:bg-white/10 h-8 w-8"
              data-testid="button-restart"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-3">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-300 mb-0.5">
                <Trophy className="w-3 h-3" />
                <span className="text-[10px] font-medium">Score</span>
              </div>
              <p className="text-base font-bold text-white" data-testid="text-score">{score.toLocaleString()}</p>
              {comboMultiplier > 1 && <span className="text-[9px] text-amber-400">x{comboMultiplier.toFixed(1)}</span>}
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-purple-300 mb-0.5">
                <Target className="w-3 h-3" />
                <span className="text-[10px] font-medium">Moves</span>
              </div>
              <p className="text-base font-bold text-white" data-testid="text-moves">{moves}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-pink-300 mb-0.5">
                <Star className="w-3 h-3" />
                <span className="text-[10px] font-medium">Matched</span>
              </div>
              <p className="text-base font-bold text-white" data-testid="text-matches">{matches}/{targetPairs}</p>
            </CardContent>
          </Card>
          
          <Card className={`bg-white/5 backdrop-blur-xl border-white/10 ${isFrozen ? 'ring-2 ring-cyan-400' : ''}`}>
            <CardContent className="p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-cyan-300 mb-0.5">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-medium">Time</span>
              </div>
              <p className="text-base font-bold text-white" data-testid="text-timer">{formatTime(timer)}</p>
            </CardContent>
          </Card>

          <Card 
            className={`bg-white/5 backdrop-blur-xl border-white/10 cursor-pointer hover:bg-white/10 transition-all ${hintsRemaining === 0 ? 'opacity-50' : ''} hidden md:block`}
            onClick={useHint}
          >
            <CardContent className="p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-teal-300 mb-0.5">
                <Lightbulb className="w-3 h-3" />
                <span className="text-[10px] font-medium">Hints</span>
              </div>
              <p className="text-base font-bold text-white" data-testid="text-hints">{hintsRemaining}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 hidden md:block">
            <CardContent className="p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-orange-300 mb-0.5">
                <Flame className="w-3 h-3" />
                <span className="text-[10px] font-medium">Streak</span>
              </div>
              <p className="text-base font-bold text-white">{streak}</p>
            </CardContent>
          </Card>
        </div>

        {/* Constellation Progress */}
        {gameMode === "constellation" && constellations.length > 0 && (
          <div className="mb-3 p-2 bg-white/5 backdrop-blur rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-indigo-200/60">Constellation Progress</span>
              <div className="flex gap-1">
                {powerCharges.reveal > 0 && (
                  <Button size="sm" variant="outline" onClick={() => usePower("reveal")} className="h-6 text-[10px] border-violet-400/50 text-violet-300 hover:bg-violet-500/20 px-2">
                    <Eye className="w-3 h-3 mr-1" /> {powerCharges.reveal}
                  </Button>
                )}
                {powerCharges.freeze > 0 && (
                  <Button size="sm" variant="outline" onClick={() => usePower("freeze")} className="h-6 text-[10px] border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20 px-2">
                    <Timer className="w-3 h-3 mr-1" /> {powerCharges.freeze}
                  </Button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {constellations.map(c => (
                <div key={c.id} className={`p-1.5 rounded-lg border ${c.completed ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-purple-400/50' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center gap-1">
                    {c.completed ? <Sparkles className="w-3 h-3 text-yellow-400" /> : <Compass className="w-3 h-3 text-white/40" />}
                    <span className={`text-[10px] font-medium ${c.completed ? 'text-purple-200' : 'text-white/60'}`}>{c.name}</span>
                  </div>
                  <Progress 
                    value={(cards.filter(card => c.pairs.includes(card.iconIndex) && card.isMatched).length / 2 / c.pairs.length) * 100} 
                    className="h-1 mt-1" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Board */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl mb-3 relative overflow-hidden" ref={boardRef}>
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
                opacity="0.5"
                className="animate-in fade-in duration-500"
              />
            ))}
          </svg>
          <CardContent className="p-3 md:p-4 relative z-20">
            <div 
              className="grid gap-2 justify-center mx-auto"
              style={{ 
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                maxWidth: gridCols * 75
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
                        relative w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl
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
                      {/* Card Back */}
                      <div 
                        className={`absolute inset-0 rounded-xl flex items-center justify-center ${getCardBackStyle()} border border-white/20 shadow-lg ${!card.isFlipped && !card.isMatched ? 'hover:shadow-xl' : ''}`}
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
                        {card.isWild ? (
                          <Wand2 className="w-4 h-4 md:w-5 md:h-5 text-amber-300 animate-pulse" />
                        ) : (
                          <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-white/40" />
                        )}
                        {card.ghostVisible && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                        )}
                      </div>
                      
                      {/* Card Front */}
                      <div 
                        className={`absolute inset-0 rounded-xl flex items-center justify-center bg-gradient-to-br ${celestialItem?.gradient || 'from-purple-500 to-pink-500'} border-2 shadow-lg ${card.isMatched ? 'border-white/60 shadow-xl' : 'border-white/30'}`}
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent" />
                        {card.isWild && <div className="absolute inset-0 rounded-xl ring-2 ring-amber-400 animate-pulse" />}
                        <IconComponent className="w-5 h-5 md:w-7 md:h-7 text-white drop-shadow-lg relative z-10" />
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
          <Badge variant="outline" className="bg-white/5 border-white/20 text-indigo-200 text-xs">
            {gameMode === "daily" ? "Daily Challenge" : gameMode === "endless" ? `Endless Level ${endlessLevel}` : `${DIFFICULTY_CONFIG[difficulty].label} · ${gameMode === "zen" ? "Zen" : gameMode === "challenge" ? "Challenge" : "Quest"}`}
          </Badge>
        </div>
      </div>

      {/* Victory Modal */}
      {gameComplete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-gradient-to-br from-slate-900/95 via-purple-950/95 to-indigo-950/95 border-white/20 shadow-2xl animate-in zoom-in-95">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-3">
                {[...Array(getStarRating())].map((_, i) => (
                  <Star key={i} className="w-10 h-10 text-amber-400 fill-amber-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
                {[...Array(3 - getStarRating())].map((_, i) => (
                  <Star key={i} className="w-10 h-10 text-white/20" />
                ))}
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                {gameMode === "daily" ? "Daily Complete!" : "Mission Complete!"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-xl p-2">
                  <p className="text-xl font-bold text-amber-400">{score.toLocaleString()}</p>
                  <p className="text-[10px] text-indigo-200/60">Score</p>
                </div>
                <div className="bg-white/5 rounded-xl p-2">
                  <p className="text-xl font-bold text-white">{moves}</p>
                  <p className="text-[10px] text-indigo-200/60">Moves</p>
                </div>
                <div className="bg-white/5 rounded-xl p-2">
                  <p className="text-xl font-bold text-white">{formatTime(timer)}</p>
                  <p className="text-[10px] text-indigo-200/60">Time</p>
                </div>
                <div className="bg-white/5 rounded-xl p-2">
                  <p className="text-xl font-bold text-orange-400">{maxStreak}</p>
                  <p className="text-[10px] text-indigo-200/60">Max Streak</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => setShowMenu(true)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                  data-testid="button-back-to-menu"
                >
                  Menu
                </Button>
                <Button
                  onClick={() => initializeGame()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-0"
                  data-testid="button-play-again"
                >
                  <Rocket className="w-4 h-4 mr-1" /> Again
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
        .aurora-bg {
          background: linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.1) 50%, transparent 100%);
          animation: aurora 8s ease-in-out infinite;
        }
        @keyframes aurora {
          0%, 100% { opacity: 0.2; transform: translateY(0); }
          50% { opacity: 0.4; transform: translateY(-10px); }
        }
        @keyframes twinkle { 0% { opacity: 0.3; } 100% { opacity: 0.7; } }
        @keyframes particle {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0) translateY(-60px); opacity: 0; }
        }
        @keyframes comet {
          0% { transform: scale(1) translateX(0); opacity: 1; }
          100% { transform: scale(0.5) translateX(50px) translateY(-80px); opacity: 0; }
        }
        @keyframes star-particle {
          0% { transform: scale(1) rotate(0deg); opacity: 1; }
          100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
        .animate-particle { animation: particle 1.2s ease-out forwards; }
        .animate-comet { animation: comet 2s ease-out forwards; }
        .animate-star { animation: star-particle 1.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
