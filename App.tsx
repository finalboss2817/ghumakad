
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Itinerary, TravelPreferences } from './types';
import { generateItinerary } from './geminiService';
import Header from './components/Header';
import Hero from './components/Hero';
import PlanningForm from './components/PlanningForm';
import ItineraryView from './components/ItineraryView';
import GhumakadBlogs from './components/GhumakadBlogs';
import UserProfileView from './components/UserProfileView';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<'home' | 'plan' | 'itinerary' | 'blogs' | 'profile'>('home');
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGenerate = async (prefs: TravelPreferences) => {
    setLoading(true);
    setView('itinerary');
    try {
      const iten = await generateItinerary(prefs);
      setCurrentItinerary(iten);
    } catch (error) {
      console.error(error);
      alert("Intelligence sync failed. Please check your connection to the Ghumakad network.");
      setView('plan');
    } finally {
      setLoading(false);
    }
  };

  const saveItinerary = async (iten: Itinerary) => {
    if (!session) {
      setShowAuth(true);
      return;
    }
    try {
      const { error } = await supabase.from('itineraries').insert({
        user_id: session.user.id,
        destination: iten.destination,
        data: iten
      });
      if (!error) {
        alert("Itinerary archived in your profile successfully!");
      } else {
        throw error;
      }
    } catch (err) {
      alert("Failed to archive plan.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">
      <Header 
        onNavigate={setView} 
        activeView={view} 
        session={session} 
        onAuth={() => setShowAuth(true)} 
      />
      
      <main className="flex-grow">
        {view === 'home' && (
          <>
            <Hero onStart={() => setView('plan')} />
            
            {/* USP Section */}
            <section className="max-w-7xl mx-auto px-6 py-20 md:py-40">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                <div>
                  <div className="inline-flex items-center gap-4 bg-orange-100 text-orange-700 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8 border border-orange-200">
                    <i className="fas fa-shield-halved"></i> The Ghumakad Standard
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-emerald-950 mb-10 tracking-tighter uppercase leading-none">
                    Beyond <span className="text-emerald-700">Generic</span> <br/>Travel
                  </h2>
                  <div className="space-y-12">
                    <div className="flex flex-col md:flex-row gap-8 group">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-950 text-white rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl group-hover:bg-orange-600 transition-all duration-500">
                        <i className="fas fa-gem text-2xl md:text-3xl"></i>
                      </div>
                      <div>
                        <h4 className="text-xl md:text-2xl font-black text-emerald-950 mb-3 uppercase tracking-tight">Verified Ghumakad Gems</h4>
                        <p className="text-slate-500 font-bold text-base md:text-lg leading-relaxed">
                          We ignore the SEO-boosted tourist traps. Our intelligence identifies verified "Gems" — local spots and transit hacks known only to seasoned explorers.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 group">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-950 text-white rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl group-hover:bg-orange-600 transition-all duration-500">
                        <i className="fas fa-clock text-2xl md:text-3xl"></i>
                      </div>
                      <div>
                        <h4 className="text-xl md:text-2xl font-black text-emerald-950 mb-3 uppercase tracking-tight">Deep Reality Pacing</h4>
                        <p className="text-slate-500 font-bold text-base md:text-lg leading-relaxed">
                          Standard planners burnout travelers. Ghumakad calculates realistic transit times and local pacing so you actually experience the culture.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative mt-12 lg:mt-0">
                  <div className="bg-white rounded-[3rem] md:rounded-[5rem] p-10 md:p-16 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] border border-slate-100 relative z-10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/5 rounded-full -mr-20 -mt-20"></div>
                    <h3 className="text-3xl md:text-4xl font-black text-emerald-950 mb-10 uppercase tracking-tighter leading-tight">Project Roadmap <br/><span className="text-slate-300">Phase 02 / Staged</span></h3>
                    <div className="space-y-10">
                      <div className="flex items-center justify-between opacity-50 group cursor-not-allowed">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                            <i className="fas fa-bed text-xl"></i>
                          </div>
                          <div>
                             <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Smart Booking</p>
                             <p className="text-[8px] font-bold text-slate-300">Direct Hotel & Event Sync</p>
                          </div>
                        </div>
                        <i className="fas fa-lock text-slate-200"></i>
                      </div>
                      <div className="flex items-center justify-between group cursor-pointer opacity-80 hover:opacity-100 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700">
                            <i className="fas fa-users-viewfinder text-xl"></i>
                          </div>
                          <div>
                             <p className="font-black text-[10px] uppercase tracking-widest text-emerald-950">Community Hub</p>
                             <p className="text-[8px] font-bold text-emerald-600">Travel Social & Shared Plans</p>
                          </div>
                        </div>
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-orange-200">SOON</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 md:w-96 md:h-96 bg-orange-600/10 rounded-full blur-[80px] md:blur-[120px]"></div>
                </div>
              </div>
            </section>

            {/* Curated Blogs Section */}
            <section className="bg-emerald-950 py-20 md:py-40 overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-24 gap-12">
                  <div className="max-w-3xl">
                    <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-none">The <span className="text-orange-500">Vault</span></h2>
                    <p className="text-emerald-100/60 font-bold text-xl md:text-2xl leading-relaxed max-w-2xl italic">
                      "Deep-dive guides for travelers who loathe tourism."
                    </p>
                  </div>
                  <button onClick={() => setView('blogs')} className="bg-white text-emerald-950 px-10 md:px-14 py-5 md:py-6 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.3em] hover:bg-orange-600 hover:text-white transition-all shadow-2xl active:scale-95">EXPLORE THE ARCHIVE</button>
                </div>
                <GhumakadBlogs onItineraryClick={(iten) => { setCurrentItinerary(iten); setView('itinerary'); }} />
              </div>
            </section>
          </>
        )}

        {view === 'plan' && (
          <div className="max-w-4xl mx-auto px-6 py-20 md:py-32">
            <div className="text-center mb-16 md:mb-24">
               <div className="inline-flex items-center gap-5 bg-orange-100 text-orange-700 px-8 py-3 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] mb-10 border border-orange-200">
                  <i className="fas fa-brain"></i> Meena Tech Core
               </div>
               <h1 className="text-5xl md:text-8xl font-black text-emerald-950 mb-8 tracking-tighter uppercase leading-none">Smart <span className="text-emerald-700">Planner</span></h1>
               <p className="text-slate-400 text-xl md:text-2xl font-bold max-w-2xl mx-auto leading-relaxed">Input your ambition. Receive travel mastery.</p>
            </div>
            <PlanningForm onSubmit={handleGenerate} />
          </div>
        )}

        {view === 'blogs' && (
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
            <div className="text-center mb-16 md:mb-32">
               <div className="inline-flex items-center gap-6 bg-emerald-950 text-white px-8 md:px-10 py-4 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] mb-12 border border-emerald-800 shadow-2xl">
                  <i className="fas fa-crown text-orange-500"></i> Ghumakad Verified Vault
               </div>
               <h1 className="text-6xl md:text-9xl font-black text-emerald-950 mb-12 tracking-tighter leading-none uppercase">The <span className="text-orange-600 underline decoration-emerald-950 underline-offset-[12px] md:underline-offset-[16px] decoration-[6px] md:decoration-[10px]">Vault</span></h1>
               <p className="text-slate-400 font-bold text-xl md:text-3xl max-w-5xl mx-auto leading-relaxed px-4">
                  Ghumakad isn't a search engine. It's a verified roadmap archive. We bridge the gap between "visiting" and "exploring."
               </p>
            </div>
            <GhumakadBlogs onItineraryClick={(iten) => { setCurrentItinerary(iten); setView('itinerary'); }} />
          </div>
        )}

        {view === 'profile' && session && (
          <div className="py-20 md:py-24">
            <UserProfileView 
              session={session} 
              onViewItinerary={(iten) => { setCurrentItinerary(iten); setView('itinerary'); }}
            />
          </div>
        )}

        {view === 'itinerary' && (
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-24">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[600px] md:min-h-[700px]">
                <div className="relative w-32 h-32 md:w-48 md:h-48 mb-16">
                   <div className="absolute inset-0 border-[12px] md:border-[16px] border-emerald-50 rounded-full"></div>
                   <div className="absolute inset-0 border-[12px] md:border-[16px] border-emerald-950 border-t-orange-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fas fa-compass text-2xl md:text-3xl text-emerald-950 animate-pulse"></i>
                   </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-emerald-950 animate-pulse tracking-tighter uppercase">Syncing Intel...</h2>
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mt-8 text-xs md:sm">A Meena Technologies Ecosystem</p>
              </div>
            ) : currentItinerary ? (
              <ItineraryView 
                itinerary={currentItinerary} 
                onSave={() => saveItinerary(currentItinerary)} 
                canShare={!!session}
              />
            ) : (
              <div className="text-center py-32 md:py-48 bg-white rounded-[3rem] md:rounded-[5rem] border-4 border-dashed border-slate-100 mx-4">
                 <h2 className="text-3xl md:text-5xl font-black text-slate-200 tracking-tighter uppercase mb-12">Masterplan Required</h2>
                 <button onClick={() => setView('plan')} className="bg-emerald-950 text-white px-10 md:px-14 py-5 md:py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-orange-600 transition-all shadow-2xl active:scale-95">Initialize Planner</button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default App;
