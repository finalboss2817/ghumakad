
import React, { useState } from 'react';
import { TravelPreferences, BudgetType, TravelType } from '../types';

interface PlanningFormProps {
  onSubmit: (prefs: TravelPreferences) => void;
}

const INTERESTS = ['Adventure', 'Food', 'Culture', 'Nightlife', 'Shopping', 'Nature', 'History', 'Relaxation'];

const PlanningForm: React.FC<PlanningFormProps> = ({ onSubmit }) => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState<BudgetType>('Medium');
  const [type, setType] = useState<TravelType>('Couple');
  const [interests, setInterests] = useState<string[]>([]);
  const [pace, setPace] = useState<'Relaxed' | 'Balanced' | 'Fast'>('Balanced');

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return alert("Please specify a target destination.");
    onSubmit({ destination, days, budget, type, interests });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-12 md:p-16 rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.1)] border border-slate-100">
      <div className="space-y-12">
        <div className="space-y-4">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block">Target Destination</label>
          <div className="relative group">
             <i className="fas fa-location-dot absolute left-8 top-1/2 -translate-y-1/2 text-emerald-600 text-xl transition-transform group-focus-within:scale-125"></i>
             <input 
              type="text" 
              placeholder="e.g. Ladakh, India or Tuscany, Italy"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-16 pr-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-lg text-emerald-950 placeholder:text-slate-300"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block">Duration (Days)</label>
            <input 
              type="number" 
              min="1" 
              max="21"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-lg text-emerald-950"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block">Expedition Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as TravelType)}
              className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-lg text-emerald-950 appearance-none cursor-pointer"
            >
              <option value="Solo">Solo Explorer</option>
              <option value="Couple">Couple / Duet</option>
              <option value="Friends">Explorer Squad</option>
              <option value="Family">Family Pack</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block">Travel Pace (Intel Weight)</label>
          <div className="grid grid-cols-3 gap-6">
            {(['Relaxed', 'Balanced', 'Fast'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPace(p)}
                className={`py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${pace === p ? 'bg-orange-600 text-white shadow-2xl scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block">Budget Calibration</label>
          <div className="grid grid-cols-3 gap-6">
            {(['Low', 'Medium', 'Luxury'] as BudgetType[]).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBudget(b)}
                className={`py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${budget === b ? 'bg-emerald-950 text-white shadow-2xl scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block">Core Interests</label>
          <div className="flex flex-wrap gap-3">
            {INTERESTS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleInterest(i)}
                className={`px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2 ${interests.includes(i) ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-200'}`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-8 bg-emerald-950 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-orange-600 transition-all shadow-2xl active:scale-95 group"
        >
          GENERATE OPTIMIZED MASTERPLAN <i className="fas fa-bolt ml-4 group-hover:text-yellow-400"></i>
        </button>
      </div>
    </form>
  );
};

export default PlanningForm;
