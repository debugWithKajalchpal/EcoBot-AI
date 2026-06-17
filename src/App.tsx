import { useState, useEffect } from 'react';
import { DailyLog, GeoTrackerResult, UserProgress, QuizAnswers } from './types';
import TrackerQuiz from './components/TrackerQuiz';
import RegionalTracker from './components/RegionalTracker';
import AgentChat from './components/AgentChat';
import StatsDashboard from './components/StatsDashboard';
import ChallengesList from './components/ChallengesList';
import { Leaf, Award, Globe, MessageSquare, Bot, BarChart3, PlusCircle, CheckCircle, Info, Flame, Fuel, Coffee, Trash2, ShoppingBag } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logger' | 'ai-coach' | 'regional' | 'quests'>('dashboard');
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [savedTrackers, setSavedTrackers] = useState<GeoTrackerResult[]>([]);
  const [activeTracker, setActiveTracker] = useState<GeoTrackerResult | null>(null);
  const [progress, setProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    completedActions: [],
    totalSavedCo2Kg: 0
  });

  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<DailyLog | null>(null);
  const [auditAdvice, setAuditAdvice] = useState<string>('');
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // Load from localStorage on build initiation
  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem('eco_carbon_logs_v1');
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      } else {
        // Seed default logs so the dashboard initial view looks rich and visually packed!
        const initialSeeds: DailyLog[] = [
          {
            id: 'seed-1',
            date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
            answers: {
              transportType: 'car_petrol',
              transportDistance: 40,
              energyLevel: 'medium',
              cleanEnergySource: 'none',
              dietType: 'heavy_meat',
              wasteRecycling: ['paper'],
              shoppingLevel: 'average'
            },
            breakdown: { transport: 7.2, energy: 8.0, diet: 7.5, waste: 1.65, shopping: 4.0 },
            total: 28.35,
            score: 15
          },
          {
            id: 'seed-2',
            date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
            answers: {
              transportType: 'public_transit',
              transportDistance: 20,
              energyLevel: 'medium',
              cleanEnergySource: 'partial',
              dietType: 'low_meat',
              wasteRecycling: ['paper', 'plastic', 'glass'],
              shoppingLevel: 'average'
            },
            breakdown: { transport: 0.8, energy: 4.0, diet: 4.0, waste: 0.95, shopping: 4.0 },
            total: 13.75,
            score: 59
          },
          {
            id: 'seed-3',
            date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString().split('T')[0],
            answers: {
              transportType: 'electric',
              transportDistance: 15,
              energyLevel: 'low',
              cleanEnergySource: 'full',
              dietType: 'vegetarian',
              wasteRecycling: ['paper', 'plastic', 'glass', 'organic'],
              shoppingLevel: 'minimal'
            },
            breakdown: { transport: 0.75, energy: 0.3, diet: 2.5, waste: 0.6, shopping: 1.0 },
            total: 5.15,
            score: 85
          }
        ];
        setLogs(initialSeeds);
        localStorage.setItem('eco_carbon_logs_v1', JSON.stringify(initialSeeds));
      }

      const storedTrackers = localStorage.getItem('eco_carbon_trackers_v1');
      if (storedTrackers) {
        const parsed = JSON.parse(storedTrackers);
        setSavedTrackers(parsed);
        if (parsed.length > 0) setActiveTracker(parsed[0]);
      } else {
        // Seed default tracker: Denver city audit
        const seedTracker: GeoTrackerResult = {
          name: "California Grid Scope",
          tier: "state",
          rating: "B",
          perCapitaEmissionsTonnes: 8.5,
          totalEmissionsMillionTonnes: 330.1,
          gridCleanlinessPercent: 54,
          overallCarbonIndex: 51,
          summaryText: "California shows advanced regulatory sorting and rising solar imports, though private automobile transit on major highways dictates a persistent vehicular carbon output.",
          breakdown: [
            { category: "Transport", value: 3.4, baselineAverage: 4.1 },
            { category: "Residential Energy", value: 1.8, baselineAverage: 2.5 },
            { category: "Diet/Agriculture", value: 1.5, baselineAverage: 1.8 },
            { category: "Waste/Industrial", value: 1.1, baselineAverage: 1.3 },
            { category: "Goods/Shopping", value: 0.7, baselineAverage: 1.1 }
          ],
          localActions: [
            {
              title: "Retrofit Solar Batteries",
              description: "Provides solar backup buffers during hot peak-grid hours.",
              impactRating: "High",
              difficulty: "Hard",
              annualSavingsKg: 1200
            },
            {
              title: "Adopt CalTransit passes",
              description: "Decreases single-occupant sports utilities from highway tracks.",
              impactRating: "High",
              difficulty: "Easy",
              annualSavingsKg: 950
            }
          ]
        };
        setSavedTrackers([seedTracker]);
        setActiveTracker(seedTracker);
        localStorage.setItem('eco_carbon_trackers_v1', JSON.stringify([seedTracker]));
      }

      const storedProgress = localStorage.getItem('eco_carbon_progress_v1');
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      }
    } catch (e) {
      console.error("Could not load from localStorage:", e);
    }
  }, []);

  // Save updates to localStorage
  const saveLogs = (updatedLogs: DailyLog[]) => {
    setLogs(updatedLogs);
    localStorage.setItem('eco_carbon_logs_v1', JSON.stringify(updatedLogs));
  };

  const handleAddGeoResult = (result: GeoTrackerResult) => {
    const updated = [result, ...savedTrackers.filter(t => t.name !== result.name)].slice(0, 8);
    setSavedTrackers(updated);
    localStorage.setItem('eco_carbon_trackers_v1', JSON.stringify(updated));
  };

  const handleUpdateProgress = (updatedProgress: UserProgress) => {
    setProgress(updatedProgress);
    localStorage.setItem('eco_carbon_progress_v1', JSON.stringify(updatedProgress));
  };

  const handleLogQuizSubmit = async (answers: QuizAnswers) => {
    setLoadingQuiz(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });

      const data = await response.json();
      if (data.success) {
        const newLog: DailyLog = {
          id: `log-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          answers,
          breakdown: data.breakdown,
          total: data.total,
          score: data.score
        };

        const updated = [...logs.filter(l => l.date !== newLog.date), newLog];
        saveLogs(updated);

        // Earn XP for submitting a log!
        let xpGained = 45;
        let newXp = progress.xp + xpGained;
        let newLevel = progress.level;
        let newNextLevelXp = progress.nextLevelXp;

        if (newXp >= progress.nextLevelXp) {
          newXp = newXp - progress.nextLevelXp;
          newLevel = progress.level + 1;
          newNextLevelXp = Math.round(progress.nextLevelXp * 1.35);
        }

        handleUpdateProgress({
          ...progress,
          xp: newXp,
          level: newLevel,
          nextLevelXp: newNextLevelXp
        });

        // Setup detail modal immediately
        setAuditAdvice(data.aiAdvice);
        setSelectedAuditLog(newLog);
        setActiveTab('dashboard');
      } else {
        throw new Error(data.error || 'Quiz submission failed');
      }
    } catch (err) {
      console.error(err);
      // Fallback calculation directly client-side so our application is completely fault-tolerant!
      const fallbackBreakdown = {
        transport: answers.transportType === 'car_petrol' ? parseFloat((answers.transportDistance * 0.18).toFixed(1)) : 1.2,
        energy: answers.energyLevel === 'high' ? 12.0 : 6.2,
        diet: answers.dietType === 'heavy_meat' ? 7.5 : 2.5,
        waste: 1.2,
        shopping: answers.shoppingLevel === 'heavy' ? 8.0 : 3.0
      };
      const total = parseFloat(Object.values(fallbackBreakdown).reduce((a, b) => a + b, 0).toFixed(1));
      const score = Math.max(10, Math.min(100, Math.round(100 - (total * 2.8))));

      const fallbackLog: DailyLog = {
        id: `log-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        answers,
        breakdown: fallbackBreakdown,
        total,
        score
      };

      const updated = [...logs.filter(l => l.date !== fallbackLog.date), fallbackLog];
      saveLogs(updated);

      setAuditAdvice(`Your daily footprint is calculated at ${total} kg CO2e. Consider replacing high-carbon transit options with direct public transit options and decreasing home cooling baseline levels to preserve resources.`);
      setSelectedAuditLog(fallbackLog);
      setActiveTab('dashboard');
    } finally {
      setLoadingQuiz(false);
    }
  };

  const categoryLabels: Record<string, string> = {
    transport: '🚗 Travel Transits',
    energy: '⚡ Household Power',
    diet: '🍲 Food & Nutrition',
    waste: '♻️ Packaging Waste',
    shopping: '🛒 New Goods'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-emerald-600/15 rounded-full blur-[130px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-blue-600/10 rounded-full blur-[160px]"></div>
        <div className="absolute top-[30%] left-[40%] w-[35%] h-[35%] bg-teal-550/10 rounded-full blur-[110px]"></div>
      </div>

      {/* Main App Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header Navigation Panel */}
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-md w-full" id="root-header">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-sm">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-display font-black tracking-tight text-white">
                EcoBot <span className="text-emerald-400 font-medium font-mono">AI</span>
              </h1>
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest font-mono">
                Conversational Accounting & Regional Audits
              </span>
            </div>
          </div>

          {/* Tab buttons */}
          <nav className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-full" id="tab-nav">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'logger', label: 'Log Emissions', icon: PlusCircle },
              { id: 'ai-coach', label: 'AI Coach', icon: Bot },
              { id: 'regional', label: 'Regional Tracker', icon: Globe },
              { id: 'quests', label: 'Quests Board', icon: Award }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Dynamic active notification banner */}
        {activeChallenge && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-850 rounded-2xl flex items-center justify-between gap-3 animate-fade-in text-xs font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-500 animate-spin" />
              <span className="text-amber-950 dark:text-amber-250">
                Active committed daily challenge target: <strong className="font-extrabold">"{activeChallenge}"</strong>. Log completion on the Quest Board to cash in XP rewards.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('quests')}
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
            >
              Go to board →
            </button>
          </div>
        )}

        {/* Dynamic switch rendering */}
        <div className="min-h-[500px]">
          {activeTab === 'dashboard' && (
            <StatsDashboard 
              logs={logs} 
              progress={progress} 
              onSelectLog={(log) => {
                setSelectedAuditLog(log);
                setAuditAdvice(`Based on your tracked details, transport and diet sectors contribute significantly. Continue minimizing vehicle idle phases, choose organic composting, and incorporate plant options.`);
              }} 
            />
          )}

          {activeTab === 'logger' && (
            <TrackerQuiz 
              onSubmit={handleLogQuizSubmit} 
              isLoading={loadingQuiz} 
            />
          )}

          {activeTab === 'ai-coach' && (
            <AgentChat 
              userLogs={logs} 
              activeChallenge={activeChallenge} 
            />
          )}

          {activeTab === 'regional' && (
            <RegionalTracker 
              onAddGeoResult={handleAddGeoResult} 
              savedTrackers={savedTrackers} 
              activeTracker={activeTracker} 
              setActiveTracker={setActiveTracker} 
            />
          )}

          {activeTab === 'quests' && (
            <ChallengesList 
              progress={progress} 
              onUpdateProgress={handleUpdateProgress} 
              onSelectChallenge={setActiveChallenge} 
              activeChallenge={activeChallenge} 
            />
          )}
        </div>
      </main>

      {/* Footer credits line as per system margins rules (clean and simple) */}
      <footer className="mt-16 border-t border-zinc-100 dark:border-zinc-900/60 py-6 text-center text-xs text-zinc-400">
        <p>© 2026 EcoBot AI. Empowering climate transparency one entry at a time.</p>
      </footer>

      {/* Audit Detail Inspector Modal Drawer */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" id="audit-inspector-modal">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-5 animate-fade-in relative shadow-lg">
            
            <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded">
                  Analytical Deep Audit
                </span>
                <h3 className="text-lg font-display font-black text-zinc-900 dark:text-zinc-50 mt-1">
                  Log Audit: {new Date(selectedAuditLog.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAuditLog(null)}
                className="text-zinc-400 hover:text-zinc-600 p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Score & Emissions display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block font-semibold">Total Carbon Logged:</span>
                <span className="text-2xl font-black text-zinc-900 dark:text-white font-mono mt-0.5 block">
                  {selectedAuditLog.total} <span className="text-xs font-normal text-zinc-400">kg CO2e</span>
                </span>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block font-semibold">Performance Score:</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                  {selectedAuditLog.score} <span className="text-xs font-normal text-zinc-400">/ 100</span>
                </span>
              </div>
            </div>

            {/* Category breakdown visual bars */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Metric Contributions:
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {Object.entries(selectedAuditLog.breakdown).map(([cat, val]) => {
                  const numericVal = val as number;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                        <span>{categoryLabels[cat] || cat}</span>
                        <span className="font-mono text-zinc-800 dark:text-zinc-100">{numericVal} kg CO2e</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            cat === 'transport' ? 'bg-blue-500' :
                            cat === 'energy' ? 'bg-amber-500' :
                            cat === 'diet' ? 'bg-emerald-500' :
                            cat === 'waste' ? 'bg-indigo-500' :
                            'bg-purple-500'
                          }`}
                          style={{ width: `${Math.min(100, (numericVal / selectedAuditLog.total) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Review Advice */}
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-150 rounded-2xl space-y-1.5">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 animate-pulse" /> AI Auditor Recommendations
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                {auditAdvice}
              </p>
            </div>

            <button
              onClick={() => setSelectedAuditLog(null)}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-800 dark:hover:bg-zinc-750 font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Acknowledge Audit
            </button>

          </div>
        </div>
      )}

      </div>
    </div>
  );
}
