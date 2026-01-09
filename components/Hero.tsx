
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="relative bg-emerald-950 h-[800px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070" 
          alt="Travel background" 
          className="w-full h-full object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/80 to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-4 bg-orange-600/20 text-orange-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8 border border-orange-500/30">
            <i className="fas fa-bolt"></i> Verified Travel Intelligence
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase leading-none">
            Beyond the <br/><span className="text-orange-600 underline decoration-white underline-offset-[14px]">Tourists</span>
          </h1>
          <p className="text-2xl text-emerald-100/60 mb-12 leading-relaxed max-w-2xl font-bold">
            Ghumakad uses Meena Tech intelligence to craft verified, realistic masterclass journeys. No traps, just pure soul.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={onStart}
              className="px-14 py-6 bg-orange-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-orange-600 transition shadow-2xl shadow-orange-600/30 flex items-center justify-center active:scale-95"
            >
              Start Masterplan <i className="fas fa-arrow-right ml-4"></i>
            </button>
            <button className="px-14 py-6 bg-white/5 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition border border-white/20 backdrop-blur-3xl group">
              Explore The Vault <i className="fas fa-chevron-right ml-4 group-hover:translate-x-2 transition-transform"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative Branding */}
      <div className="absolute bottom-20 right-20 text-white/5 text-[20vw] font-black pointer-events-none select-none">
         GHMKD
      </div>
    </section>
  );
};

export default Hero;
