import React, { useState } from 'react';
import { GeoProfileInput, GeoTrackerResult } from '../types';
import { Network, Globe, MapPin, CheckCircle, ChevronRight, Zap, Info, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

interface RegionalTrackerProps {
  onAddGeoResult: (result: GeoTrackerResult) => void;
  savedTrackers: GeoTrackerResult[];
  activeTracker: GeoTrackerResult | null;
  setActiveTracker: (tracker: GeoTrackerResult) => void;
}

export default function RegionalTracker({
  onAddGeoResult,
  savedTrackers,
  activeTracker,
  setActiveTracker
}: RegionalTrackerProps) {
  const [profile, setProfile] = useState<GeoProfileInput>({
    name: 'Denver',
    tier: 'city',
    gridPowerType: 'mixed',
    transitInfrastructure: 'average',
    wastePrograms: 'basic',
    industrialActivity: 'moderate'
  });

  const [loading, setLoading] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) return;

    setLoading(true);
    setErrorString(null);

    try {
      const response = await fetch('/api/geo-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geoProfile: profile })
      });

      const data = await response.json();
      if (data.success && data.data) {
        onAddGeoResult(data.data);
        setActiveTracker(data.data);
      } else {
        throw new Error(data.error || 'Failed to generate tracker');
      }
    } catch (err: any) {
      console.error(err);
      setErrorString('Failed to retrieve geo footprint intelligence from server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Dynamically assign rating colors for regional audits
  const getRatingStyle = (rating: string) => {
    switch (rating) {
      case 'A': return 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
      case 'B': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900';
      case 'C': return 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
      case 'D': return 'bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-850';
      case 'F': return 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:border-red-850';
      default: return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="regional-tracker-panel">
      {/* Questionnaire Form Side */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6">
          <span className="text-xs font-mono bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 px-3 py-1 rounded-full uppercase tracking-widest font-semibold flex items-center gap-1.5 w-fit">
            <Globe className="w-3.5 h-3.5" /> Regional Generator
          </span>
          <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-50 mt-2">
            Build Geographic Model
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Specify local infrastructure features to estimate carbon balances and local action lists dynamically.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Region / Place Name
              </label>
              <input
                type="text"
                placeholder="e.g. Vancouver"
                value={profile.name}
                onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-750 p-2.5 bg-white dark:bg-zinc-805 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Scope Tier
                </label>
                <select
                  value={profile.tier}
                  onChange={e => setProfile(prev => ({ ...prev, tier: e.target.value as any }))}
                  className="w-full text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-750 p-2 bg-white dark:bg-zinc-805 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="city">🌆 City</option>
                  <option value="state">🗺️ State / Province</option>
                  <option value="country">🏳️ Country</option>
                  <option value="world">🌐 Global Cluster</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Grid Power Mix
                </label>
                <select
                  value={profile.gridPowerType}
                  onChange={e => setProfile(prev => ({ ...prev, gridPowerType: e.target.value as any }))}
                  className="w-full text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-750 p-2 bg-white dark:bg-zinc-805 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="coal">Coal Dominated</option>
                  <option value="gas">Natural Gas Baseline</option>
                  <option value="mixed">Mixed Fuels</option>
                  <option value="nuclear">Nuclear Infused</option>
                  <option value="renewables">Renewables (Hydro, Solar, Wind)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-3">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Public Transit Quality
                </label>
              </div>
              {(['poor', 'average', 'excellent'] as const).map(quality => (
                <button
                  key={quality}
                  type="button"
                  onClick={() => setProfile(prev => ({ ...prev, transitInfrastructure: quality }))}
                  className={`p-2 rounded-xl text-center border text-[11px] font-semibold capitalize transition-all ${
                    profile.transitInfrastructure === quality
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-550 dark:text-indigo-400'
                      : 'bg-white dark:bg-zinc-900 border-zinc-250 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {quality}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-3">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Waste & Recycling Infrastructure
                </label>
              </div>
              {[
                { value: 'none', label: 'Landfill Only' },
                { value: 'basic', label: 'Basic Sort' },
                { value: 'advanced_composting', label: 'Organics & Composing' }
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setProfile(prev => ({ ...prev, wastePrograms: opt.value as any }))}
                  className={`p-2 rounded-xl text-center border text-[10px] leading-tight font-semibold transition-all ${
                    profile.wastePrograms === opt.value
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-550 dark:text-indigo-400'
                      : 'bg-white dark:bg-zinc-900 border-zinc-250 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Industrial Intensity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'moderate', 'high'] as const).map(intensity => (
                  <button
                    key={intensity}
                    type="button"
                    onClick={() => setProfile(prev => ({ ...prev, industrialActivity: intensity }))}
                    className={`p-2 rounded-xl text-center border text-[11px] font-semibold capitalize transition-all ${
                      profile.industrialActivity === intensity
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-550 dark:text-indigo-400'
                        : 'bg-white dark:bg-zinc-900 border-zinc-250 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-750 active:bg-indigo-800 text-white font-medium text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Geo Engine...
                </>
              ) : (
                <>
                  <Network className="w-4 h-4" /> Generate Interactive Tracker
                </>
              )}
            </button>
          </form>

          {errorString && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs border border-red-100 flex gap-2 items-start">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorString}</span>
            </div>
          )}
        </div>

        {/* Saved Trackers Menu Selection */}
        {savedTrackers.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Generated Regional Audits
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {savedTrackers.map((t, idx) => (
                <button
                  key={`${t.name}-${idx}`}
                  onClick={() => setActiveTracker(t)}
                  className={`w-full text-left p-3 rounded-2xl border text-xs font-medium flex items-center justify-between transition-all ${
                    activeTracker?.name === t.name
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200'
                      : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    <div>
                      <span className="font-semibold block">{t.name}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 capitalize">{t.tier} Tracker</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 dark:text-zinc-400">
                      {t.perCapitaEmissionsTonnes} t CO2e
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Rendering side */}
      <div className="lg:col-span-7">
        {activeTracker ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 animate-fade-in animate-once">
            <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 pb-5">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
                  <MapPin className="w-3.5 h-3.5" /> Environmental Audit Scope: {activeTracker.tier}
                </div>
                <h3 className="text-2xl font-display font-black text-zinc-900 dark:text-zinc-50 mt-1">
                  {activeTracker.name} Emissions Dashboard
                </h3>
              </div>
              <div className={`p-4 rounded-2xl border text-center font-display font-black text-2xl w-14 h-14 flex items-center justify-center shadow-sm shrink-0 ${getRatingStyle(activeTracker.rating)}`}>
                {activeTracker.rating}
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/50">
                <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">
                  Per Capita
                </span>
                <span className="block text-lg font-bold font-display text-zinc-900 dark:text-zinc-100 mt-1">
                  {activeTracker.perCapitaEmissionsTonnes} t
                </span>
                <span className="block text-[9px] text-zinc-400 mt-0.5 leading-tight">
                  Annual CO2e / citizen
                </span>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/50">
                <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">
                  Total Regional
                </span>
                <span className="block text-lg font-bold font-display text-zinc-900 dark:text-zinc-100 mt-1">
                  {activeTracker.totalEmissionsMillionTonnes}M t
                </span>
                <span className="block text-[9px] text-zinc-400 mt-0.5 leading-tight">
                  Gross emissions output
                </span>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/50">
                <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">
                  Grid Cleanliness
                </span>
                <span className="block text-lg font-bold font-display text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500" /> {activeTracker.gridCleanlinessPercent}%
                </span>
                <span className="block text-[9px] text-zinc-400 mt-0.5 leading-tight">
                  Renewable ratio
                </span>
              </div>
            </div>

            {/* AI Analytical Summary */}
            <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/15 border border-indigo-100/60 dark:border-indigo-850 rounded-2xl flex gap-3 items-start">
              <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                  AI Auditor Key Insights
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-350 mt-1 leading-relaxed">
                  {activeTracker.summaryText}
                </p>
              </div>
            </div>

            {/* Recharts Sector Breakdown comparison */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
                Carbon Breakdown vs Benchmark average (Tonnes per Capita)
              </h4>
              <div className="h-60 w-full bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-2 border border-zinc-100 dark:border-zinc-800">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activeTracker.breakdown}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="opacity-50" />
                    <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                    <YAxis label={{ value: 't CO2e', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#94a3b8' } }} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="value" name={`${activeTracker.name} (Calculated)`} fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="baselineAverage" name="Benchmark average" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Customized local climate actions */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Target Citizen Climate Directives
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeTracker.localActions.map((act, i) => (
                  <div key={i} className="p-4 border border-zinc-100 dark:border-zinc-800 rounded-2xl space-y-2 bg-white dark:bg-zinc-905 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-xs font-bold text-zinc-950 dark:text-zinc-100 font-display">
                          {act.title}
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          act.impactRating === 'High' ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                        }`}>
                          {act.impactRating} Impact
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                        {act.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-zinc-50 dark:border-zinc-800 flex justify-between items-center text-[10px] font-semibold text-zinc-400">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        -{act.annualSavingsKg} kg/yr CO2e
                      </span>
                      <span className="bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded">
                        {act.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full min-h-[460px] bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-center p-8">
            <Globe className="w-12 h-12 text-zinc-300 dark:text-zinc-700 animate-pulse" />
            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mt-4">
              Geographic Carbon Audits
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 max-w-sm mt-1 leading-relaxed">
              Use the builder on the left to simulate custom carbon models for your City, State, Country, or world scope. Our AI-Agent will construct sector breakdowns immediately.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
