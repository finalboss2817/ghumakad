
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-slate-400 py-16 md:py-24 border-t border-emerald-900 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-20">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center">
              <div className="bg-white text-emerald-950 p-3 rounded-2xl mr-4 shadow-2xl rotate-3">
                <i className="fas fa-compass text-3xl"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black tracking-tighter text-white leading-none uppercase">GHUMAKAD</span>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] mt-1.5">A Meena Tech Powerhouse</span>
              </div>
            </div>
            <p className="text-slate-400 font-medium text-base md:text-lg leading-relaxed max-w-md">
              The world's first decentralized travel intelligence platform. Verified by explorers, powered by AI, and built for the bold at <span className="text-white font-black">Meena Technologies</span>.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-orange-500 transition-all flex items-center gap-2"><i className="fas fa-chevron-right text-[10px] text-orange-500"></i> The Vault</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-all flex items-center gap-2"><i className="fas fa-chevron-right text-[10px] text-orange-500"></i> Feed Hub</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-all flex items-center gap-2"><i className="fas fa-chevron-right text-[10px] text-orange-500"></i> Smart Planner</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Ecosystem</h4>
            <div className="flex flex-wrap gap-4">
              <a href="https://linkedin.com/in/adityameena" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-emerald-900 flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg border border-emerald-800">
                <i className="fab fa-linkedin-in text-white"></i>
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-emerald-900 flex items-center justify-center hover:bg-orange-600 transition-all shadow-lg border border-emerald-800">
                <i className="fab fa-twitter text-white"></i>
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-emerald-900 flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg border border-emerald-800">
                <i className="fab fa-instagram text-white"></i>
              </a>
            </div>
            <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Connect with the Lead Explorer</p>
          </div>
        </div>
        
        <div className="border-t border-emerald-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-center md:text-left">
          <p className="text-slate-500">&copy; {new Date().getFullYear()} GHUMAKAD • MEENA TECHNOLOGIES. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
