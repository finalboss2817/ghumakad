
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
import SocialFeed from './components/SocialFeed';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<'home' | 'plan' | 'itinerary' | 'blogs' | 'profile' | 'feed'>('home');
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
    } catch (error: any) {
      console.error("Ghumakad Intelligence Error:", error);
      
      let errorMessage = "Intelligence sync failed. Please check your connection to the Ghumakad network.";
      
      // Check specifically for API Key errors which are common in browser environments
      if (error.message?.includes("API Key") || !process.env.API_KEY) {
        errorMessage = "Ghumakad Intelligence Key (API_KEY) is missing or invalid. Please configure your project environment variables.";
      }
      
      alert(errorMessage);
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
        onNavigate={(v) => setView(v as any)} 
        activeView={view} 
        session={session} 
        onAuth={() => setShowAuth(true)} 
      />
      
      <main className="flex-grow">
        {view === 'home' && (
          <>
            <Hero onStart={() => setView('plan')} />
            
            <section className="max-w-7xl mx-auto px-6 py-20">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h2 className="text-4xl md:text-6xl font-black text-emerald-950 tracking-tighter uppercase">Community <span className="text-orange-600">Pulse</span></h2>
                  <p className="text-slate-500 font-bold text-lg mt-4">Real journeys from real Ghumakads.</p>
                </div>
                <button onClick={() => setView('feed')} className="text-emerald-950 font-black uppercase tracking-widest text-xs border-b-2 border-orange-500 pb-1 hover:text-orange-600 transition-colors">See the full feed</button>
              </div>
              <SocialFeed limit={3} horizontal={true} />
            </section>

            <section className="max-w-7xl mx-auto px-6 py-20 md:py-40 border-t border-slate-100">
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
                        <i className="fas fa-route text-2xl md:text-3xl"></i>
                      </div>
                      <div>
                        <h4 className="text-xl md:text-2xl font-black text-emerald-950 mb-3 uppercase tracking-tight">Best Optimized Result</h4>
                        <p className="text-slate-500 font-bold text-base md:text-lg leading-relaxed">
                          We cluster attractions geographically through advanced AI logic to ensure you spend more time exploring and less time in transit.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative mt-12 lg:mt-0">
                  <div className="bg-white rounded-[3rem] md:rounded-[5rem] p-10 md:p-16 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] border border-slate-100 relative z-10 overflow-hidden">
                    <h3 className="text-3xl md:text-4xl font-black text-emerald-950 mb-10 uppercase tracking-tighter leading-tight">Ghumakad Ecosystem <br/><span className="text-slate-300">v1.2 Active</span></h3>
                    <div className="space-y-10">
                      <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                        <div className="flex items-center gap-6">
                           <i className="fas fa-microchip text-emerald-700 text-2xl"></i>
                           <div>
                              <p className="font-black text-xs uppercase tracking-widest text-emerald-950">Meena Tech Core</p>
                              <p className="text-[10px] font-bold text-emerald-600">Powering Smart Optimization</p>
                           </div>
                        </div>
                        <i className="fas fa-check-circle text-emerald-500"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {view === 'feed' && (
          <div className="max-w-4xl mx-auto px-6 py-20 md:py-32">
             <div className="mb-16">
               <h1 className="text-5xl md:text-7xl font-black text-emerald-950 tracking-tighter uppercase leading-none mb-6">Social <span className="text-orange-600">Feed</span></h1>
               <p className="text-slate-500 text-xl font-bold">The pulse of the Ghumakad network.</p>
             </div>
             <SocialFeed />
          </div>
        )}

        {view === 'plan' && (
          <div className="max-w-4xl mx-auto px-6 py-20 md:py-32">
            <div className="text-center mb-16 md:mb-24">
               <div className="inline-flex items-center gap-5 bg-orange-100 text-orange-700 px-8 py-3 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] mb-10 border border-orange-200">
                  <i className="fas fa-brain"></i> Meena Tech Core
               </div>
               <h1 className="text-5xl md:text-8xl font-black text-emerald-950 mb-8 tracking-tighter uppercase leading-none">Smart <span className="text-emerald-700">Planner</span></h1>
               <p className="text-slate-400 text-xl md:text-2xl font-bold max-w-2xl mx-auto leading-relaxed">Input your destination. Receive the most geographically optimized masterplan available.</p>
            </div>
            <PlanningForm onSubmit={handleGenerate} />
          </div>
        )}

        {view === 'blogs' && (
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
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
              <div className="flex flex-col items-center justify-center min-h-[600px]">
                <div className="w-24 h-24 border-8 border-emerald-950 border-t-orange-500 rounded-full animate-spin"></div>
                <h2 className="text-3xl md:text-5xl font-black text-emerald-950 mt-12 tracking-tighter uppercase text-center">Optimizing Masterplan...</h2>
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] mt-6 text-xs text-center">Calculating Most Efficient Route</p>
              </div>
            ) : currentItinerary ? (
              <ItineraryView 
                itinerary={currentItinerary} 
                onSave={() => saveItinerary(currentItinerary)} 
                canShare={!!session}
              />
            ) : (
              <div className="text-center py-32">
                 <button onClick={() => setView('plan')} className="bg-emerald-950 text-white px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl">Return to Planner</button>
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
