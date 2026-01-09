
import React, { useState } from 'react';
import { Itinerary } from '../types';

interface ItineraryViewProps {
  itinerary: Itinerary;
  onSave: () => void;
  canShare: boolean;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, onSave, canShare }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);

  if (!itinerary) return null;

  const shareText = `Check out my verified trip plan to ${itinerary.destination} on Ghumakad! 🌍✨`;
  const shareUrl = window.location.href;

  const shareActions = [
    { 
      name: 'WhatsApp', 
      icon: 'fab fa-whatsapp', 
      color: 'bg-green-500', 
      link: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}` 
    },
    { 
      name: 'Twitter', 
      icon: 'fab fa-twitter', 
      color: 'bg-sky-500', 
      link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` 
    },
    { 
      name: 'LinkedIn', 
      icon: 'fab fa-linkedin-in', 
      color: 'bg-blue-700', 
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` 
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 px-2 md:px-0">
      <div className="bg-white rounded-[3rem] md:rounded-[4rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 mb-16">
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 p-8 md:p-16 text-white relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          
          <div className="md:absolute top-12 right-12 flex flex-col items-start md:items-end gap-3 z-10 mb-8 md:mb-0">
            <div className="bg-orange-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl animate-pulse flex items-center gap-2">
              <i className="fas fa-certificate"></i> MEENA TECH VERIFIED
            </div>
            {itinerary.is_verified && (
              <div className="bg-emerald-500 text-white px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-400/30">
                 GHUMAKAD GEM STATUS
              </div>
            )}
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 relative z-10">
            <div className="w-full lg:w-auto">
              <div className="flex items-center gap-4 mb-6">
                 <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 px-5 py-2 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em]">AI GEN • MASTERCLASS GUIDE</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-tight">{itinerary.destination}</h1>
              <div className="flex flex-wrap gap-4 md:gap-8 text-emerald-100 font-black uppercase tracking-[0.2em] text-[9px] md:text-[11px]">
                <span className="flex items-center bg-white/5 px-4 py-2 rounded-xl border border-white/10"><i className="far fa-clock mr-3 text-orange-500"></i>{itinerary.totalDays} DAYS</span>
                <span className="flex items-center bg-white/5 px-4 py-2 rounded-xl border border-white/10"><i className="fas fa-users mr-3 text-orange-500"></i>{itinerary.travelType}</span>
                <span className="flex items-center bg-white/5 px-4 py-2 rounded-xl border border-white/10"><i className="fas fa-crown mr-3 text-orange-500"></i>{itinerary.budget}</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
               <button 
                  onClick={onSave}
                  className={`flex items-center justify-center gap-4 px-10 py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl ${canShare ? 'bg-orange-600 hover:bg-white hover:text-orange-600' : 'bg-white/10 cursor-not-allowed border border-white/20'}`}
                >
                  <i className="fas fa-archive"></i>
                  ARCHIVE PLAN
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="w-full flex items-center justify-center gap-4 px-10 py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] bg-white text-emerald-950 hover:bg-emerald-950 hover:text-white transition-all shadow-2xl"
                  >
                    <i className="fas fa-share-nodes"></i>
                    SHARE INTEL
                  </button>
                  
                  {showShareOptions && (
                    <div className="absolute top-full left-0 mt-4 w-full md:w-64 bg-white rounded-3xl p-4 shadow-2xl border border-slate-100 flex flex-col gap-2 z-[100] animate-in slide-in-from-top-4">
                       {shareActions.map(action => (
                         <a 
                           key={action.name}
                           href={action.link}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                         >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${action.color} shadow-lg group-hover:scale-110 transition-transform`}>
                               <i className={action.icon}></i>
                            </div>
                            <span className="text-emerald-950 font-black text-xs uppercase tracking-widest">{action.name}</span>
                         </a>
                       ))}
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 md:gap-20">
            <div className="lg:col-span-3 space-y-16 md:space-y-20">
              {(itinerary.days || []).map((day) => (
                <div key={day.day} className="relative pl-8 md:pl-16 border-l-2 md:border-l-4 border-slate-50">
                  <div className="absolute -left-[9px] md:-left-[14px] top-0 w-4 h-4 md:w-6 h-6 rounded-full bg-white border-4 border-emerald-700 shadow-xl z-10"></div>
                  <h3 className="text-3xl md:text-4xl font-black text-emerald-950 mb-8 md:mb-10 uppercase tracking-tighter">CHAPTER {day.day < 10 ? `0${day.day}` : day.day}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <div className="group bg-slate-50 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-2xl transition-all duration-500">
                      <div className="w-12 h-12 md:w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-700 shadow-xl mb-6 group-hover:rotate-12 transition-all">
                        <i className="fas fa-sun text-xl md:text-2xl"></i>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-bold text-base md:text-lg">{day.morning}</p>
                    </div>
                    <div className="group bg-slate-50 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-2xl transition-all duration-500">
                      <div className="w-12 h-12 md:w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-700 shadow-xl mb-6 group-hover:rotate-12 transition-all">
                        <i className="fas fa-cloud-sun text-xl md:text-2xl"></i>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-bold text-base md:text-lg">{day.afternoon}</p>
                    </div>
                    <div className="group bg-slate-50 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-2xl transition-all duration-500">
                      <div className="w-12 h-12 md:w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-700 shadow-xl mb-6 group-hover:rotate-12 transition-all">
                        <i className="fas fa-moon text-xl md:text-2xl"></i>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-bold text-base md:text-lg">{day.evening}</p>
                    </div>
                  </div>

                  <div className="mt-10 p-6 md:p-8 bg-emerald-950 rounded-[3rem] border border-emerald-900 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                       <i className="fas fa-gem text-5xl md:text-7xl text-white"></i>
                    </div>
                    <div className="flex items-center gap-4 mb-5 relative z-10">
                       <div className="bg-orange-600 text-white p-2 rounded-xl text-xs shadow-lg">
                          <i className="fas fa-gem"></i>
                       </div>
                       <span className="font-black text-orange-500 text-[9px] md:text-[11px] uppercase tracking-[0.3em]">GHUMAKAD VERIFIED GEM</span>
                    </div>
                    <p className="text-emerald-50 italic font-bold text-lg md:text-xl leading-relaxed relative z-10">"{day.travelTips}"</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-12">
               <div className="bg-orange-50 rounded-[3rem] p-8 md:p-10 border border-orange-100 shadow-xl">
                  <h4 className="font-black text-orange-950 mb-8 flex items-center gap-3 uppercase tracking-tighter text-2xl">
                    <i className="fas fa-bowl-food text-orange-600"></i> Local Soul
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {(itinerary.days || []).flatMap(d => d.food || []).slice(0, 10).map((f, i) => (
                      <span key={i} className="bg-white px-5 py-2.5 rounded-2xl text-[9px] font-black text-orange-950 border border-orange-200 shadow-sm uppercase tracking-widest">
                        {f}
                      </span>
                    ))}
                  </div>
               </div>

               <div className="bg-emerald-950 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden border border-emerald-900">
                  <div className="absolute -bottom-10 -right-10 opacity-5">
                    <i className="fas fa-shield-halved text-[150px]"></i>
                  </div>
                  <h4 className="font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter text-2xl relative z-10">
                    <i className="fas fa-shield-halved text-orange-500"></i> Survival
                  </h4>
                  <div className="space-y-6 relative z-10">
                    {(itinerary.mustKnowTips || []).slice(0, 4).map((tip, i) => (
                      <div key={i} className="flex gap-4 text-xs md:text-sm text-emerald-100 font-bold leading-relaxed">
                        <i className="fas fa-check-circle text-orange-500 mt-1 shrink-0"></i>
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;
