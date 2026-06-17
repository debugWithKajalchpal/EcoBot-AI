import React, { useState } from 'react';
import { QuizAnswers } from '../types';
import { Leaf, Car, Flame, ShoppingBag, Trash2, Milestone, Globe, LayoutGrid, CheckCircle2, Award, Zap, HelpCircle } from 'lucide-react';

interface TrackerQuizProps {
  onSubmit: (answers: QuizAnswers) => void;
  isLoading: boolean;
  onClose?: () => void;
}

export default function TrackerQuiz({ onSubmit, isLoading, onClose }: TrackerQuizProps) {
  const [mode, setMode] = useState<'quick' | 'detailed'>('quick');
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Default state holding all quick & detailed answers
  const [answers, setAnswers] = useState<QuizAnswers>({
    mode: 'quick',
    basis: 'individual',
    period: 'daily',
    city: 'San Francisco',
    state: 'California',
    country: 'United States',
    householdSize: 1,

    transportType: 'car_petrol',
    transportDistance: 15, // km per period
    flightsShort: 0,
    flightsMediumLong: 0,

    energyLevel: 'medium',
    cleanEnergySource: 'none',
    heatingFuel: 'electricity',
    acUsage: 'moderate',
    ledBulbs: true,
    ecoLaundry: false,
    standbyOff: false,

    dietType: 'low_meat',
    redMeatServings: 2,
    dairyServings: 3,
    foodWasteLevel: 'average',
    localFoodRatio: 40,

    shoppingLevel: 'average',
    onlineDeliveries: 4,
    fastFashionPurchases: 3,
    electronicsUpgrades: 'moderate',
    secondhandRatio: 20,

    wasteRecycling: ['paper', 'plastic'],
    garbageBags: 2,
    recyclingPaper: true,
    recyclingPlastic: true,
    recyclingMetal: false,
    recyclingOrganic: false,
  });

  const handleRecycleToggle = (item: string) => {
    setAnswers(prev => ({
      ...prev,
      wasteRecycling: prev.wasteRecycling.includes(item)
        ? prev.wasteRecycling.filter(i => i !== item)
        : [...prev.wasteRecycling, item]
    }));
  };

  const setField = <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...answers,
      mode,
    });
  };

  // Steps configuration based on selected Mode
  const quickSteps = [
    {
      id: 'context',
      title: 'Location & Profile',
      icon: Globe,
      desc: 'Set the geography and scope of calculation.'
    },
    {
      id: 'travel',
      title: 'Transits & Distance',
      icon: Car,
      desc: 'How far and by what means did you travel?'
    },
    {
      id: 'power',
      title: 'Household Power',
      icon: Flame,
      desc: 'Electricity levels and energy model.'
    },
    {
      id: 'consumables',
      title: 'Diet, Goods & Waste',
      icon: Leaf,
      desc: 'Food types, shopping and material recycling.'
    }
  ];

  const detailedSteps = [
    { id: 'geo', title: 'Scope & Demographics', icon: Globe },
    { id: 'transit_detail', title: 'Vehicle & Air Travel', icon: Car },
    { id: 'home_energy', title: 'Power, AC & Upgrades', icon: Flame },
    { id: 'diet_detail', title: 'Meals & Food Waste', icon: Milestone },
    { id: 'shopping_logistics', title: 'Deliveries & Clothes', icon: ShoppingBag },
    { id: 'waste_sorting', title: 'Landfill & Garbage Bags', icon: Trash2 }
  ];

  const steps = mode === 'quick' ? quickSteps : detailedSteps;
  const currentStepInfo = steps[currentStep] || steps[0];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleModeChange = (newMode: 'quick' | 'detailed') => {
    setMode(newMode);
    setCurrentStep(0);
    setAnswers(prev => ({ ...prev, mode: newMode }));
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 max-w-3xl w-full mx-auto shadow-2xl relative overflow-hidden" id="quiz-container">
      {/* Absolute Decorative Glow element */}
      <div className="absolute top-[-20%] right-[-20%] w-[120px] h-[120px] bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 pb-5 border-b border-white/5">
        <div>
          <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider font-semibold flex items-center gap-1.5 w-fit">
            <Leaf className="w-3.5 h-3.5" /> EcoBot AI Accounting
          </span>
          <h2 className="text-2xl font-display font-extrabold text-white mt-2">
            Calculate Carbon Footprint
          </h2>
          <p className="text-xs text-slate-300 mt-1 italic font-medium">
            “Let’s calculate your carbon footprint with a quick questionnaire. Approximate answers are okay.”
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex p-0.5 bg-white/5 rounded-xl border border-white/10 self-center md:self-auto">
          <button
            type="button"
            onClick={() => handleModeChange('quick')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'quick'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quick Mode (4 Steps)
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('detailed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'detailed'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Detailed Mode (25+ Qs)
          </button>
        </div>
      </div>

      {/* Steps indicators map bar */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          const active = idx === currentStep;
          const passed = idx < currentStep;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-left border transition-all text-[11px] ${
                active 
                  ? 'bg-white/10 border-emerald-500/40 text-white font-bold'
                  : passed
                    ? 'border-emerald-500/20 text-emerald-300 bg-emerald-500/5'
                    : 'border-white/5 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : passed ? 'text-emerald-300' : 'text-slate-500'}`} />
                <span className="truncate">Step {idx + 1}</span>
              </div>
              <div className="hidden lg:block h-0.5 mt-0.5 w-full bg-white/5 overflow-hidden rounded-full">
                <div className={`h-full ${active || passed ? 'bg-emerald-500' : 'bg-transparent'}`} style={{ width: '100%' }}></div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 md:p-6 mb-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs flex items-center justify-center font-bold">
            {currentStep + 1}
          </span>
          {currentStepInfo.title}
        </h3>

        {/* QUICK MODE RENDERERS */}
        {mode === 'quick' && (
          <div className="space-y-5 animate-fade-in">
            {/* Step 1: Location & Context */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4 col-span-1 md:col-span-2">
                  <span className="block text-xs font-semibold text-slate-400">1. What city, state, and country are you in?</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-1">City</span>
                      <input 
                        type="text" 
                        value={answers.city} 
                        onChange={e => setField('city', e.target.value)}
                        className="w-full text-xs p-2 bg-white/5 text-white border border-white/10 rounded-xl"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-1">State / Province</span>
                      <input 
                        type="text" 
                        value={answers.state} 
                        onChange={e => setField('state', e.target.value)}
                        className="w-full text-xs p-2 bg-white/5 text-white border border-white/10 rounded-xl"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-1">Country</span>
                      <input 
                        type="text" 
                        value={answers.country} 
                        onChange={e => setField('country', e.target.value)}
                        className="w-full text-xs p-2 bg-white/5 text-white border border-white/10 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-400 mb-2">2. Are we calculating for you alone or your household?</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['individual', 'household'] as const).map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setField('basis', b)}
                        className={`p-2.5 rounded-xl border text-xs capitalize transition-all font-semibold ${
                          answers.basis === b 
                            ? 'bg-emerald-500/20 border-emerald-500 text-white' 
                            : 'bg-white/5 border-white/10 text-slate-300'
                        }`}
                      >
                        {b === 'individual' ? '👤 Only Me' : '🏠 Full Household'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-400 mb-2">3. What period should we calculate for?</span>
                  <select
                    value={answers.period}
                    onChange={e => setField('period', e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-white/5 text-white border border-white/10 rounded-xl"
                  >
                    <option value="daily">Typical Day (Daily audit)</option>
                    <option value="weekly">Selected Week</option>
                    <option value="monthly">Selected Month</option>
                    <option value="yearly">Full Year (Annually)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Commuting & Distances */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-400 mb-2">4. How did you travel during this period?</span>
                  <select
                    value={answers.transportType}
                    onChange={e => setField('transportType', e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-white/5 text-white border border-white/10 rounded-xl"
                  >
                    <option value="car_petrol">Petrol-Powered Car (Standard ICE)</option>
                    <option value="car_diesel">Diesel-Powered Car</option>
                    <option value="electric">Electric Vehicle (EV / Clean grid-tied)</option>
                    <option value="public_transit">Public Transit (Bus, Metro rails, Light rail)</option>
                    <option value="walk_bike">Active Mobility (Bicycle, Walking, or Stayed home)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                    <span>Estimated total transit distance during this period:</span>
                    <span className="text-emerald-400 font-mono font-bold">{answers.transportDistance} km</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={answers.period === 'daily' ? 120 : answers.period === 'weekly' ? 800 : answers.period === 'monthly' ? 3000 : 36000}
                    step={answers.period === 'daily' ? 5 : answers.period === 'weekly' ? 25 : answers.period === 'monthly' ? 100 : 1000}
                    value={answers.transportDistance}
                    onChange={e => setField('transportDistance', parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>0 km</span>
                    <span>Midway</span>
                    <span>High Cap ({answers.period === 'daily' ? '120km' : answers.period === 'weekly' ? '800km' : 'Max'})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Household Energy */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-400 mb-2">5. How much electricity or fuel did you use? (Relative profile)</span>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'low', label: 'Low Consumption', desc: 'Efficiency apartment, low AC/heat' },
                      { value: 'medium', label: 'Average', desc: 'Standard usage, standard home' },
                      { value: 'high', label: 'High Intensity', desc: 'Spacious home, multiple screens, non-stop HVAC' }
                    ].map(st => (
                      <button
                        key={st.value}
                        type="button"
                        onClick={() => setField('energyLevel', st.value as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          answers.energyLevel === st.value
                            ? 'bg-amber-500/20 border-amber-500 text-white'
                            : 'bg-white/5 border-white/10 text-slate-300'
                        }`}
                      >
                        <span className="block text-xs font-bold">{st.label}</span>
                        <span className="block text-[9px] opacity-75 mt-1 leading-normal">{st.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-400 mb-2">On-site Solar or Clean Grid Tariffs?</span>
                  <select
                    value={answers.cleanEnergySource}
                    onChange={e => setField('cleanEnergySource', e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-white/5 text-white border border-white/10 rounded-xl"
                  >
                    <option value="none">Grid power (Standard municipal fossil mix)</option>
                    <option value="partial">Partial offsets or partial solar panels</option>
                    <option value="full">100% Certified Green Tariff / full Solar array</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 4: Food, Purchases, Waste */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <span className="block text-xs font-semibold text-slate-400 mb-2">6. What best describes your diet?</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { value: 'vegan', label: '🌱 Vegan', desc: '100% plant-based' },
                      { value: 'vegetarian', label: '🥚 Vegetarian', desc: 'No slaughtered meats' },
                      { value: 'low_meat', label: '🍗 Low Meat', desc: 'Mostly veggies/poultry' },
                      { value: 'heavy_meat', label: '🥩 Rich Meat', desc: 'Beef or pork daily' }
                    ].map(diet => (
                      <button
                        key={diet.value}
                        type="button"
                        onClick={() => setField('dietType', diet.value as any)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          answers.dietType === diet.value
                            ? 'bg-emerald-500/20 border-emerald-500 text-white'
                            : 'bg-white/5 border-white/10 text-slate-300'
                        }`}
                      >
                        <span className="block text-xs font-bold">{diet.label}</span>
                        <span className="block text-[8px] opacity-70 mt-0.5 leading-tight">{diet.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 mb-2">7. Shopping levels during this period:</span>
                    <select
                      value={answers.shoppingLevel}
                      onChange={e => setField('shoppingLevel', e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-white/5 text-white border border-white/10 rounded-xl"
                    >
                      <option value="minimal">Minimalist (repair first, secondhand, necessities only)</option>
                      <option value="average">Standard consumer (basic essentials, moderate online shopping)</option>
                      <option value="heavy">Frequent deliveries, regular electronics & retail upgrades</option>
                    </select>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-400 mb-2">8. Materials recycled or composted:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {['Paper/Cards', 'Plastics', 'Glass Vessels', 'Organics Bio-compost'].map((item, idx) => {
                        const ids = ['paper', 'plastic', 'glass', 'organic'];
                        const key = ids[idx];
                        const active = answers.wasteRecycling.includes(key);
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleRecycleToggle(key)}
                            className={`p-2 rounded-xl text-left border text-[11px] font-bold transition-all ${
                              active
                                ? 'bg-emerald-500/20 border-emerald-500 text-white'
                                : 'bg-white/5 border-white/10 text-slate-400'
                            }`}
                          >
                            {active ? '✓ ' : '+ '} {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DETAILED 25+ COMPREHENSIVE QUESTIONS MODE RENDERER */}
        {mode === 'detailed' && (
          <div className="space-y-5 animate-fade-in text-slate-200">
            {/* Step 1: Scope & Location (6 Questions) */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <p className="text-[11px] text-slate-400 font-mono">Scope demographics help configure custom local baseline figures.</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">City Name</label>
                    <input type="text" value={answers.city} onChange={e => setField('city', e.target.value)} className="w-full text-xs p-2 bg-white/5 border border-white/10 text-white rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">State or Territory</label>
                    <input type="text" value={answers.state} onChange={e => setField('state', e.target.value)} className="w-full text-xs p-2 bg-white/5 border border-white/10 text-white rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Country</label>
                    <input type="text" value={answers.country} onChange={e => setField('country', e.target.value)} className="w-full text-xs p-2 bg-white/5 border border-white/10 text-white rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 font-bold mb-1.5">Calculation Period</label>
                    <select value={answers.period} onChange={e => setField('period', e.target.value as any)} className="w-full text-xs p-2.5 bg-white/5 border border-white/10 text-white rounded-lg">
                      <option value="daily">Typical Day</option>
                      <option value="weekly">Full Week</option>
                      <option value="monthly">Full Month</option>
                      <option value="yearly">Full Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-bold mb-1.5">Apportionment Basis</label>
                    <select value={answers.basis} onChange={e => setField('basis', e.target.value as any)} className="w-full text-xs p-2.5 bg-white/5 border border-white/10 text-white rounded-lg">
                      <option value="individual">Apportioned Individual Share</option>
                      <option value="household">Complete Household Total</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-bold mb-1.5 font-mono">Household Occupants Size</label>
                    <input type="number" min="1" max="12" value={answers.householdSize} onChange={e => setField('householdSize', parseInt(e.target.value) || 1)} className="w-full text-xs p-2.5 bg-white/5 border border-white/10 text-white rounded-lg" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle & Flight Air Travel (6 Questions) */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Primary Land Commute Vehicle</label>
                    <select value={answers.transportType} onChange={e => setField('transportType', e.target.value as any)} className="w-full text-xs p-2.5 bg-white/5 border border-white/10 text-white rounded-lg">
                      <option value="car_petrol">Petrol Powered Sedans / Utility SUV</option>
                      <option value="car_diesel">Diesel Heavy Engine Vehicles</option>
                      <option value="electric">EV (Dedicated battery-electric or hybrid)</option>
                      <option value="public_transit">Mass Trains / Metro Buses</option>
                      <option value="walk_bike">No carbon vehicle (Walking/Cycled/WFH)</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
                      <span>Land Commuting distance:</span>
                      <span className="text-emerald-400 font-mono font-bold">{answers.transportDistance} km</span>
                    </label>
                    <input type="range" min="0" max={answers.period === 'daily' ? 150 : answers.period === 'weekly' ? 1000 : answers.period === 'monthly' ? 4000 : 45000} value={answers.transportDistance} onChange={e => setField('transportDistance', parseInt(e.target.value))} className="w-full accent-emerald-500 h-1.5 bg-white/10" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Short-Haul Flights Count (Last 12mo, &lt;3hr routes)</label>
                    <input type="number" min="0" max="80" value={answers.flightsShort || 0} onChange={e => setField('flightsShort', parseInt(e.target.value) || 0)} className="w-full text-xs p-2 bg-white/5 border border-white/10 text-white rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Medium/Long-Haul Flights Count (&gt;3hr routes)</label>
                    <input type="number" min="0" max="40" value={answers.flightsMediumLong || 0} onChange={e => setField('flightsMediumLong', parseInt(e.target.value) || 0)} className="w-full text-xs p-2 bg-white/5 border border-white/10 text-white rounded-lg" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Home Energy, AC & Smart Devices (6 Questions) */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Household Electricity Consumption Tier</label>
                    <select value={answers.energyLevel} onChange={e => setField('energyLevel', e.target.value as any)} className="w-full text-xs p-2.5 bg-white/5 border border-white/10 text-white rounded-lg">
                      <option value="low">Low (Studio suite / high insulation PassiveHouse)</option>
                      <option value="medium">Medium (Standard suburban family home average)</option>
                      <option value="high">High (Spacious climate-controlled, pool timers etc)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Main Home Heating/Cooking Fuel</label>
                    <select value={answers.heatingFuel || 'electricity'} onChange={e => setField('heatingFuel', e.target.value as any)} className="w-full text-xs p-2.5 bg-white/5 border border-white/10 text-white rounded-lg">
                      <option value="electricity">Electric Heat Pumps (Standard Electric)</option>
                      <option value="gas">Methane Gas Pipelines</option>
                      <option value="oil">Heating Fuel Oil / LPG tanks</option>
                      <option value="solar">On-site Solar Thermal / Geothermal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">AC usage levels</label>
                    <select value={answers.acUsage || 'moderate'} onChange={e => setField('acUsage', e.target.value as any)} className="w-full text-xs p-2 bg-white/5 border border-white/10 text-white rounded-lg">
                      <option value="none">No AC (fans only / temperate)</option>
                      <option value="moderate">Moderate AC (summer spikes)</option>
                      <option value="heavy">Continuous heavy thermostat control</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-slate-400">Energy saving upgrades:</span>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input type="checkbox" checked={answers.ledBulbs} onChange={e => setField('ledBulbs', e.target.checked)} className="accent-emerald-500 rounded" />
                      <span>Led efficient light bulbs (100%)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input type="checkbox" checked={answers.ecoLaundry} onChange={e => setField('ecoLaundry', e.target.checked)} className="accent-emerald-500 rounded" />
                      <span>Cold water laundry cycle overnight</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-slate-400">Standby settings:</span>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input type="checkbox" checked={answers.standbyOff} onChange={e => setField('standbyOff', e.target.checked)} className="accent-emerald-500 rounded" />
                      <span>Cut standby switches (hubs/screens)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Food, Servings, Organic Choices (5 Questions) */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Core Dietary Style Profile</label>
                    <select value={answers.dietType} onChange={e => setField('dietType', e.target.value as any)} className="w-full text-xs p-2.5 bg-white/5 border border-white/10 text-white rounded-lg">
                      <option value="vegan">Pure Plant-Based Vegan</option>
                      <option value="vegetarian">Vegetarian (No meat, includes eggs/pastured dairy)</option>
                      <option value="low_meat">Flexitarian / low-poultry diet</option>
                      <option value="heavy_meat">Red Meat enthusiast (regular lamb/beef)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Red Meat (beef, lamb) meal count / week</label>
                    <input type="number" min="0" max="21" value={answers.redMeatServings || 0} onChange={e => setField('redMeatServings', parseInt(e.target.value) || 0)} className="w-full text-xs p-2 bg-white/5 border border-white/10 text-white rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Dairy & Cheese servings / week</label>
                    <input type="number" min="0" max="42" value={answers.dairyServings || 0} onChange={e => setField('dairyServings', parseInt(e.target.value) || 0)} className="w-full text-xs p-2 bg-white/5 border border-white/10 text-white rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Food waste levels</label>
                    <select value={answers.foodWasteLevel || 'average'} onChange={e => setField('foodWasteLevel', e.target.value as any)} className="w-full text-xs p-2.5 bg-white/5 border border-white/10 text-white rounded-lg">
                      <option value="none">Zero Waste (Diligent scrap composting)</option>
                      <option value="minimal">Minimal (Careful meal-planning leftovers)</option>
                      <option value="average">Standard municipal average food waste</option>
                      <option value="high">High waste (regularly throw out expired foods)</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex justify-between text-xs font-bold text-slate-400 mb-1.5 font-mono">
                      <span>Local/Organic Prefer Ratio:</span>
                      <span className="text-emerald-400">{answers.localFoodRatio}%</span>
                    </label>
                    <input type="range" min="0" max="100" step="10" value={answers.localFoodRatio || 0} onChange={e => setField('localFoodRatio', parseInt(e.target.value))} className="w-full accent-emerald-500 h-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Deliveries & Goods Logistics (4 Questions) */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Goods Shopping Tier</label>
                    <select value={answers.shoppingLevel} onChange={e => setField('shoppingLevel', e.target.value as any)} className="w-full text-xs p-2.5 bg-white/5 border border-white/10 text-white rounded-lg">
                      <option value="minimal">Minimalist (Second-hand buying, zero non-essentials)</option>
                      <option value="average">Standard Consumer (Basic replacement electronics/essentials)</option>
                      <option value="heavy">Retail upgrades (Fast fashion, frequent gadgets)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Online deliveries count per Month</label>
                    <input type="number" min="0" max="60" value={answers.onlineDeliveries || 0} onChange={e => setField('onlineDeliveries', parseInt(e.target.value) || 0)} className="w-full text-xs p-2 bg-white/5 border border-white/10 text-white rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Fast-fashion clothing count purchased / year</label>
                    <input type="number" min="0" max="150" value={answers.fastFashionPurchases || 0} onChange={e => setField('fastFashionPurchases', parseInt(e.target.value) || 0)} className="w-full text-xs p-2 bg-white/5 border border-white/10 text-white rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Electronics Replacement rate</label>
                    <select value={answers.electronicsUpgrades || 'moderate'} onChange={e => setField('electronicsUpgrades', e.target.value as any)} className="w-full text-xs p-2.5 bg-white/5 border border-white/10 text-white rounded-lg">
                      <option value="rare">Keep devices until broken (4+ yrs)</option>
                      <option value="moderate">Standard tech upgrade cycle (2-3 yrs)</option>
                      <option value="frequent">Annual upgrades as flagship units launch</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex justify-between text-xs font-bold text-slate-400 mb-1.5 font-mono">
                      <span>Second-hand Buying Preference:</span>
                      <span className="text-emerald-400">{answers.secondhandRatio}%</span>
                    </label>
                    <input type="range" min="0" max="100" step="10" value={answers.secondhandRatio || 0} onChange={e => setField('secondhandRatio', parseInt(e.target.value))} className="w-full accent-emerald-500 h-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Waste Disposal & Garbage Bags (5 Questions) */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Garbage bags thrown to landfills per week</label>
                    <input type="number" min="0" max="30" value={answers.garbageBags || 0} onChange={e => setField('garbageBags', parseInt(e.target.value) || 0)} className="w-full text-xs p-2 bg-white/5 border border-white/10 text-white rounded-lg" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 mb-1.5 font-mono">Detailed active sorting checklists:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="checkbox" checked={answers.recyclingPaper} onChange={e => {
                          setField('recyclingPaper', e.target.checked);
                          handleRecycleToggle('paper');
                        }} className="accent-emerald-500 rounded" />
                        <span>Sort Paper / Card</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="checkbox" checked={answers.recyclingPlastic} onChange={e => {
                          setField('recyclingPlastic', e.target.checked);
                          handleRecycleToggle('plastic');
                        }} className="accent-emerald-500 rounded" />
                        <span>Sort Plastics</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="checkbox" checked={answers.recyclingMetal} onChange={e => {
                          setField('recyclingMetal', e.target.checked);
                          handleRecycleToggle('glass');
                        }} className="accent-emerald-500 rounded" />
                        <span>Sort Metals & Cans</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="checkbox" checked={answers.recyclingOrganic} onChange={e => {
                          setField('recyclingOrganic', e.target.checked);
                          handleRecycleToggle('organic');
                        }} className="accent-emerald-500 rounded" />
                        <span>Bio Composting</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation Action Controls */}
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-4 py-2 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl transition-all disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
        >
          ← Previous
        </button>

        {currentStep === steps.length - 1 ? (
          <button
            type="button"
            onClick={handleFormSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-550/15 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Auditing responses...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" /> Complete Audit & Calculate
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl border border-white/10 transition-all cursor-pointer"
          >
            Next Section →
          </button>
        )}
      </div>
    </div>
  );
}
