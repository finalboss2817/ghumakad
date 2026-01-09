
import React from 'react';
import { supabase } from '../supabaseClient';

interface HeaderProps {
  onNavigate: (view: 'home' | 'plan' | 'itinerary' | 'blogs' | 'profile') => void;
  activeView: string;
  session: any;
  onAuth: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, activeView, session, onAuth }) => {
  return (
    <header className="sticky top-0 z-[100] glass border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="bg-emerald-950 text-white p-3.5 rounded-2xl mr-4 shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500">
              <i className="fas fa-compass text-3xl"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-tighter text-emerald-950 leading-none">GHUMAKAD</span>
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mt-1.5">A Meena Tech Powerhouse</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-12">
            <button 
              onClick={() => onNavigate('blogs')}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${activeView === 'blogs' ? 'text-emerald-900' : 'text-slate-400 hover:text-emerald-900'}`}
            >
              The Vault
              {activeView === 'blogs' && <span className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-full"></span>}
            </button>
            <button 
              onClick={() => onNavigate('plan')}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${activeView === 'plan' ? 'text-emerald-900' : 'text-slate-400 hover:text-emerald-900'}`}
            >
              Planner
              {activeView === 'plan' && <span className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-full"></span>}
            </button>
            
            {session ? (
              <div className="flex items-center gap-4">
                 <button 
                   onClick={() => onNavigate('profile')} 
                   className={`flex items-center gap-3 p-1.5 rounded-2xl border-2 transition-all ${activeView === 'profile' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-100 bg-white hover:border-emerald-200'}`}
                 >
                    <img 
                      src={session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`} 
                      className="w-10 h-10 rounded-xl shadow-sm"
                      alt="p" 
                    />
                    <div className="hidden xl:flex flex-col items-start pr-4">
                       <span className="text-[10px] font-black text-slate-900 leading-tight truncate w-24">@{session.user.user_metadata.username || 'Explorer'}</span>
                       <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">My Profile</span>
                    </div>
                 </button>
                 <button 
                   onClick={() => supabase.auth.signOut()}
                   className="w-11 h-11 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100"
                 >
                   <i className="fas fa-power-off text-lg"></i>
                 </button>
              </div>
            ) : (
              <button 
                onClick={onAuth}
                className="bg-emerald-950 text-white px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-900 transition shadow-2xl shadow-emerald-950/20 active:scale-95 border border-emerald-800"
              >
                Join Ghumakad
              </button>
            )}
          </nav>

          <div className="lg:hidden">
             <button onClick={() => onNavigate('profile')} className="w-12 h-12 bg-emerald-950 text-white rounded-2xl flex items-center justify-center">
                <i className="fas fa-user"></i>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
