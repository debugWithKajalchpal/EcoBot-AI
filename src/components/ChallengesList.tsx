import { UserProgress } from '../types';
import { Leaf, Check, Sparkles, Award, Flame, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  co2SavedKg: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'transport' | 'energy' | 'diet' | 'waste' | 'shopping';
}

interface ChallengesListProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onSelectChallenge: (title: string | null) => void;
  activeChallenge: string | null;
}

export default function ChallengesList({
  progress,
  onUpdateProgress,
  onSelectChallenge,
  activeChallenge
}: ChallengesListProps) {
  const availableChallenges: Challenge[] = [
    {
      id: 'ch-1',
      title: 'Plant-Powered Day',
      description: 'Commit to full plant-based meals today. Eliminating poultry and beef prevents major methane emissions.',
      xpReward: 80,
      co2SavedKg: 6.0,
      difficulty: 'Medium',
      category: 'diet'
    },
    {
      id: 'ch-2',
      title: 'Active Commute',
      description: 'Walk, cycle, or use micromobility for short runs up to 10 km instead of booting a car engine.',
      xpReward: 70,
      co2SavedKg: 5.5,
      difficulty: 'Medium',
      category: 'transport'
    },
    {
      id: 'ch-3',
      title: 'The Standing Standby Snip',
      description: 'Turn off standby power switches on screens, microwave controllers, and entertainment units overnight.',
      xpReward: 30,
      co2SavedKg: 1.5,
      difficulty: 'Easy',
      category: 'energy'
    },
    {
      id: 'ch-4',
      title: 'Bulk Refills & Zero Plastics',
      description: 'Dodge single-use polymers. Bring grocery canvas totes and purchase oats/grains from dispensers.',
      xpReward: 40,
      co2SavedKg: 2.2,
      difficulty: 'Easy',
      category: 'shopping'
    },
    {
      id: 'ch-5',
      title: 'Cold Laundry Cycle',
      description: 'Wash all clothes using cold water settings (30°C/85°F). Standard water heaters consume high grid electricity.',
      xpReward: 50,
      co2SavedKg: 2.8,
      difficulty: 'Easy',
      category: 'energy'
    },
    {
      id: 'ch-6',
      title: 'Waste Sorting Champion',
      description: 'Diligent sorting of aluminum cans, glass bins, and organics compost. Diverts materials from landfills.',
      xpReward: 30,
      co2SavedKg: 1.8,
      difficulty: 'Easy',
      category: 'waste'
    }
  ];

  const handleToggleCommit = (title: string) => {
    if (activeChallenge === title) {
      onSelectChallenge(null);
    } else {
      onSelectChallenge(title);
    }
  };

  const handleComplete = (ch: Challenge) => {
    // Generate beautiful multi-colored visual confetti!
    confetti({
      particleCount: 140,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6366f1', '#fbbf24']
    });

    // Calculate new progressive stats
    let newXp = progress.xp + ch.xpReward;
    let newLevel = progress.level;
    let newNextLevelXp = progress.nextLevelXp;

    if (newXp >= progress.nextLevelXp) {
      newXp = newXp - progress.nextLevelXp;
      newLevel = progress.level + 1;
      newNextLevelXp = Math.round(progress.nextLevelXp * 1.35);

      // Trigger standard Level Up double confetti!
      setTimeout(() => {
        confetti({
          particleCount: 180,
          spread: 120,
          colors: ['#fbbf24', '#f59e0b', '#10b981']
        });
      }, 450);
    }

    const updatedProgress: UserProgress = {
      level: newLevel,
      xp: newXp,
      nextLevelXp: newNextLevelXp,
      completedActions: [...progress.completedActions, ch.id],
      totalSavedCo2Kg: parseFloat((progress.totalSavedCo2Kg + ch.co2SavedKg).toFixed(2))
    };

    onUpdateProgress(updatedProgress);
    
    // Automatically release active focus if completed
    if (activeChallenge === ch.title) {
      onSelectChallenge(null);
    }
  };

  return (
    <div className="space-y-6" id="challenges-panel">
      <div>
        <span className="text-xs font-mono bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-3 py-1 rounded-full uppercase tracking-widest font-semibold flex items-center gap-1.5 w-fit">
          <Award className="w-3.5 h-3.5" /> Gamification & Actions
        </span>
        <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 mt-2">
          Carbon Reduction Quest Board
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Select a daily action to commit to, review instructions, and log completion to earn XP points and level up your rating.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableChallenges.map((ch) => {
          const isCompleted = progress.completedActions.includes(ch.id);
          const isCommitted = activeChallenge === ch.title;
          
          return (
            <div 
              key={ch.id}
              className={`bg-white dark:bg-zinc-900 border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                isCompleted 
                  ? 'border-emerald-200 dark:border-emerald-850 bg-emerald-50/20 opacity-80' 
                  : isCommitted
                    ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md scale-[1.01]'
                    : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    ch.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                  }`}>
                    {ch.difficulty}
                  </span>
                  
                  <div className="flex gap-1">
                    <span className="text-[9px] bg-indigo-50 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded font-mono">
                      +{ch.xpReward} XP
                    </span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-650 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded font-mono">
                      -{ch.co2SavedKg}kg CO2
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-display">
                  {ch.title}
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  {ch.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-50 dark:border-zinc-805/45 flex gap-2">
                {isCompleted ? (
                  <div className="w-full text-center py-2 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Completed Quest
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleToggleCommit(ch.title)}
                      className={`flex-1 py-2 text-[10px] font-semibold rounded-xl border transition-all cursor-pointer text-center ${
                        isCommitted
                          ? 'bg-amber-500 border-amber-500 text-white hover:bg-amber-600'
                          : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
                      }`}
                    >
                      {isCommitted ? 'Committed ✓' : 'Commit Daily'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleComplete(ch)}
                      className="flex-1 py-2 text-[10px] font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" /> Execute Action
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
