import { useState } from 'react';
import { DailyLog, UserProgress } from '../types';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, BarChart, Bar, Cell } from 'recharts';
import { Leaf, Award, Calendar, ChevronRight, Fuel, Flame, Coffee, Trash2, ShoppingBag, Download, CircleAlert } from 'lucide-react';

interface StatsDashboardProps {
  logs: DailyLog[];
  progress: UserProgress;
  onSelectLog: (log: DailyLog) => void;
  onClearHistory?: () => void;
}

export default function StatsDashboard({ logs, progress, onSelectLog, onClearHistory }: StatsDashboardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // Category configuration for color theme consistency
  const categoryMeta: Record<string, { label: string; color: string; icon: any }> = {
    transport: { label: 'Transportation', color: '#3b82f6', icon: Fuel },
    energy: { label: 'Household Energy', color: '#f59e0b', icon: Flame },
    diet: { label: 'Dietary Footprint', color: '#10b981', icon: Coffee },
    waste: { label: 'Household Waste', color: '#6366f1', icon: Trash2 },
    shopping: { label: 'Goods & Packaging', color: '#a855f7', icon: ShoppingBag }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'csv', logs })
      });
      if (response.ok) {
        const text = await response.text();
        const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `EcoBot_AI_Carbon_Export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Export failed on carbon record database layer.");
      }
    } catch (e) {
      console.error("Export connection failed:", e);
    }
  };

  const getLatestLogData = () => {
    if (logs.length === 0) return [];
    const latest = logs[logs.length - 1];
    return Object.entries(latest.breakdown).map(([k, val]) => ({
      name: categoryMeta[k]?.label || k,
      value: val,
      color: categoryMeta[k]?.color || '#cbd5e1'
    }));
  };

  const lineChartData = logs.map(l => ({
    date: new Date(l.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    emissions: l.total,
    ecoScore: l.score,
    target: 6.5 // Sustainable recommended daily limit (6.5 kg CO2e)
  }));

  const latestLog = logs[logs.length - 1];

  return (
    <div className="space-y-6" id="stats-dashboard-panel">
      {/* Upper overview badges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Level / Gamification Card */}
        <div className="md:col-span-2 p-5 bg-gradient-to-br from-emerald-950 to-zinc-950 text-white rounded-3xl border border-emerald-800/20 shadow-sm relative overflow-hidden flex flex-col justify-between h-40">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl" />
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
                Carbon Warrior Rankings
              </span>
              <h3 className="text-2xl font-display font-black tracking-tight mt-1">
                Eco Level {progress.level}
              </h3>
            </div>
            <Award className="w-8 h-8 text-amber-400 animate-bounce" />
          </div>

          <div className="relative z-10">
            <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
              <span>{progress.xp} / {progress.nextLevelXp} XP to Eco Level {progress.level + 1}</span>
              <span>{Math.round((progress.xp / progress.nextLevelXp) * 100)}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${(progress.xp / progress.nextLevelXp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Saved Footprint Metric */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl h-40 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              Cumulative Reductions
            </span>
            <div className="text-3xl font-display font-extrabold text-emerald-600 mt-2">
              -{progress.totalSavedCo2Kg.toFixed(1)} kg
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 leading-tight">
            Total atmospheric carbon footprint safely prevented via daily challenges completed.
          </p>
        </div>

        {/* Average Eco Score metric */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl h-40 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              Current Eco Index
            </span>
            <div className="text-3xl font-display font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
              {logs.length > 0 ? Math.round(logs.reduce((acc, curr) => acc + curr.score, 0) / logs.length) : '---'}
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 leading-tight">
            Aggregate sustainability score over all tracked logs. Standard target is 75+.
          </p>
        </div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Timeline chart of tracked emissions logs */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 md:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 font-display">
                Emissions Timeline Trend
              </h3>
              <p className="text-[10px] text-zinc-400">
                Track your carbon logging history vs the global sustainable target of 6.5 kg CO2e.
              </p>
            </div>
            <Calendar className="w-4 h-4 text-zinc-400 font-mono" />
          </div>

          <div className="h-56">
            {logs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="opacity-40" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                  <YAxis label={{ value: 'kg CO2e', angle: -90, position: 'insideLeft', style: { fontSize: 9, fill: '#64748b' } }} tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
                  <Area type="monotone" name="Logged Emissions" dataKey="emissions" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEmissions)" />
                  <Area type="monotone" name="Sustainable Target" dataKey="target" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-xs">
                <Leaf className="w-8 h-8 opacity-45 select-none animate-pulse mb-2" />
                <span>No logged emissions history available.</span>
                <span className="text-[10px] opacity-75">Submit today's questionnaire to plot vectors!</span>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown list & bar charts */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 md:p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 font-display">
            Latest Footprint Breakdown
          </h3>

          <div className="h-52 w-full">
            {logs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getLatestLogData()} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <XAxis type="number" tick={{ fontSize: 9 }} />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 8 }} />
                  <Tooltip contentStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="value" strokeWidth={0} radius={[0, 4, 4, 0]}>
                    {getLatestLogData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-xs text-center px-4">
                <span className="mb-1 block font-bold text-zinc-700">Audit Awaiting Data</span>
                <p className="text-[10px] leading-tight opacity-75">
                  We analyze Transport, Diet, Household Power, and Shopping parameters immediately. Log your baseline values.
                </p>
              </div>
            )}
          </div>

          {latestLog && (
            <div className="pt-2 border-t border-zinc-50 dark:border-zinc-805/45 flex justify-between items-center text-xs">
              <span className="text-zinc-500 font-semibold">Total emissions logged:</span>
              <span className="font-mono font-bold text-emerald-600">{latestLog.total} kg CO2e</span>
            </div>
          )}
        </div>
      </div>

      {/* Logs Table / Checklist */}
      {logs.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 font-display">
                Tracked History Log Book (EcoBot AI)
              </h3>
              <p className="text-[10px] text-zinc-400 mt-0.5 font-sans">
                Privacy pledge: We do not sell user data. Store only necessary carbon activity metrics. You can wipe data at any time.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!showDeleteConfirm ? (
                <>
                  <button
                    onClick={handleExportCSV}
                    type="button"
                    className="px-3.5 py-1.5 text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Export emission factors history to CSV"
                  >
                    <Download className="w-3.5 h-3.5" /> Export as CSV
                  </button>
                  {onClearHistory && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      type="button"
                      className="px-3.5 py-1.5 text-[10px] font-bold bg-red-500/10 hover:bg-red-500/20 text-red-550 dark:text-red-400 border border-red-500/20 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Request deletion of all personal history"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete My Data
                    </button>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-1.5 rounded-xl text-[10px] animate-fade">
                  <span className="text-red-500 dark:text-red-400 font-bold ml-1 flex items-center gap-1">
                    <CircleAlert className="w-3.5 h-3.5" /> Confirm permanent deletion?
                  </span>
                  <button
                    onClick={() => {
                      if (onClearHistory) onClearHistory();
                      setShowDeleteConfirm(false);
                    }}
                    type="button"
                    className="px-2.5 py-1 bg-red-650 hover:bg-red-600 text-white font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Yes, Purge
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    type="button"
                    className="px-2.5 py-1 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 text-left font-mono">
                  <th className="pb-3 font-semibold">Track Date</th>
                  <th className="pb-3 font-semibold">Transport</th>
                  <th className="pb-3 font-semibold">Energy</th>
                  <th className="pb-3 font-semibold">Diet</th>
                  <th className="pb-3 font-semibold">Waste</th>
                  <th className="pb-3 font-semibold">Shopping</th>
                  <th className="pb-3 font-semibold">Gross Emissions</th>
                  <th className="pb-3 font-semibold text-center">Eco Score</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-850">
                {logs.slice().reverse().map((l) => (
                  <tr key={l.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all font-medium text-zinc-800 dark:text-zinc-200">
                    <td className="py-3.5 whitespace-nowrap text-zinc-500">
                      {new Date(l.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 font-mono">{l.breakdown.transport} kg</td>
                    <td className="py-3.5 font-mono">{l.breakdown.energy} kg</td>
                    <td className="py-3.5 font-mono">{l.breakdown.diet} kg</td>
                    <td className="py-3.5 font-mono">{l.breakdown.waste} kg</td>
                    <td className="py-3.5 font-mono">{l.breakdown.shopping} kg</td>
                    <td className="py-3.5 font-mono text-zinc-950 dark:text-white font-extrabold">{l.total} kg</td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        l.score >= 80 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                        l.score >= 60 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                        'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                      }`}>
                        {l.score} / 100
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => onSelectLog(l)}
                        className="text-emerald-600 hover:text-emerald-800 hover:underline text-[11px] font-bold inline-flex items-center gap-0.5"
                      >
                        Inspect Audit <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
