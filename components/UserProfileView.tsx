
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { UserProfile, Itinerary } from '../types';

interface UserProfileViewProps {
  session: any;
  onViewItinerary: (iten: Itinerary) => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ session, onViewItinerary }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedItineraries, setSavedItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newFullName, setNewFullName] = useState('');
  
  // Track which item is in the "Confirm Delete" phase
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, [session]);

  const fetchProfileData = async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (profileError) throw profileError;

      if (!profileData) {
        const username = session.user.user_metadata.username || session.user.email?.split('@')[0] || 'traveler';
        const avatarUrl = session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        
        const { data: newData, error: insertError } = await supabase.from('profiles').upsert({
          id: session.user.id,
          username: username,
          full_name: session.user.user_metadata.full_name || username,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        }).select().single();
        
        if (insertError) throw insertError;
        if (newData) setProfile(newData as UserProfile);
      } else {
        setProfile(profileData as UserProfile);
        setNewBio(profileData.bio || '');
        setNewLocation(profileData.location || '');
        setNewFullName(profileData.full_name || profileData.username || '');
      }

      const { data: itenData, error: itenError } = await supabase
        .from('itineraries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (itenError) throw itenError;
      setSavedItineraries(itenData || []);
    } catch (err) {
      console.error("Ghumakad Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async (dbId: string) => {
    if (!session?.user?.id) return;

    // OPTIMISTIC UPDATE: Remove from UI immediately
    const previousItineraries = [...savedItineraries];
    setSavedItineraries(prev => prev.filter(item => item.id !== dbId));
    setConfirmDeleteId(null); // Reset confirmation state

    try {
      const { error } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', dbId)
        .eq('user_id', session.user.id);

      if (error) throw error;
      console.log(`Successfully purged plan ${dbId}`);

    } catch (err: any) {
      console.error("Archive sync error:", err);
      setSavedItineraries(previousItineraries);
      alert(`Deletion failed: ${err.message || 'Database connection error'}`);
    }
  };

  const handleUpdateProfile = async () => {
    if (!session?.user?.id) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          bio: newBio, 
          location: newLocation, 
          full_name: newFullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);
      
      if (error) throw error;
      setProfile(prev => prev ? { ...prev, bio: newBio, location: newLocation, full_name: newFullName } : null);
      setIsEditing(false);
    } catch (err) {
      alert("Identity sync failed.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[600px]">
      <div className="w-20 h-20 border-[10px] border-emerald-950 border-t-orange-500 rounded-full animate-spin"></div>
      <p className="mt-8 text-[11px] font-black text-emerald-950 uppercase tracking-[0.4em]">Syncing Archives...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pb-40 animate-in fade-in duration-1000">
      {/* Identity Card */}
      <div className="bg-white rounded-[5rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden mb-32 relative">
        <div className="h-96 bg-emerald-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <button 
             onClick={() => setIsEditing(!isEditing)}
             className="absolute top-12 right-12 bg-white/10 hover:bg-orange-600 backdrop-blur-3xl text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] border border-white/20 transition-all z-20 shadow-2xl active:scale-95"
          >
            {isEditing ? 'Discard Changes' : 'Edit Identity'}
          </button>
        </div>

        <div className="px-20 pb-20 -mt-40">
          <div className="relative z-10">
            <div className="relative inline-block mb-12">
               <img 
                 src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`} 
                 className="w-64 h-64 rounded-[4.5rem] border-[16px] border-white shadow-2xl bg-white object-cover"
                 alt="Avatar"
               />
               <div className="absolute bottom-6 right-6 bg-orange-600 w-14 h-14 rounded-3xl border-4 border-white flex items-center justify-center text-white text-xl shadow-2xl">
                  <i className="fas fa-bolt"></i>
               </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start gap-16">
              <div className="max-w-3xl flex-grow">
                {isEditing ? (
                  <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Identity Name</label>
                          <input 
                            className="w-full px-10 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] font-black text-xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                            value={newFullName}
                            onChange={e => setNewFullName(e.target.value)}
                            placeholder="Explorer Name"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Current Base</label>
                          <input 
                            className="w-full px-10 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] font-black text-xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                            value={newLocation}
                            onChange={e => setNewLocation(e.target.value)}
                            placeholder="Location"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Explorer Manifesto (Bio)</label>
                       <textarea 
                         className="w-full h-40 px-10 py-8 bg-slate-50 border border-slate-100 rounded-[3rem] font-bold text-slate-600 outline-none resize-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                         value={newBio}
                         onChange={e => setNewBio(e.target.value)}
                         placeholder="What drives your journeys?"
                       />
                    </div>
                    <button 
                      onClick={handleUpdateProfile}
                      className="bg-emerald-950 text-white px-14 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-orange-600 transition-all shadow-2xl active:scale-95"
                    >
                      Sync Identity
                    </button>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div>
                      <h1 className="text-8xl font-black text-emerald-950 tracking-tighter uppercase leading-none mb-4">{profile?.full_name || profile?.username}</h1>
                      <div className="flex items-center gap-6">
                         <span className="text-orange-600 font-black uppercase tracking-[0.4em] text-[12px] bg-orange-50 px-5 py-2 rounded-full border border-orange-100">@{profile?.username}</span>
                         <span className="text-emerald-700 font-black uppercase tracking-[0.4em] text-[12px] flex items-center gap-3">
                           <i className="fas fa-crown text-orange-500"></i> Master Explorer
                         </span>
                      </div>
                    </div>
                    <p className="text-slate-500 font-bold text-3xl leading-relaxed italic max-w-2xl">
                       "{profile?.bio || "Searching for the world's most authentic corners."}"
                    </p>
                    <div className="flex items-center gap-4 bg-slate-50 px-10 py-5 rounded-[2rem] border border-slate-100 shadow-sm w-fit mt-6">
                      <i className="fas fa-location-dot text-orange-600"></i>
                      <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">{profile?.location || 'Roaming Globally'}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex lg:flex-col gap-8 w-full lg:w-auto">
                <div className="flex-grow lg:w-80 bg-emerald-950 text-white p-14 rounded-[4.5rem] shadow-[0_40px_80px_-20px_rgba(6,78,59,0.4)] text-center relative overflow-hidden group border border-emerald-800">
                   <p className="text-8xl font-black tracking-tighter mb-4 relative z-10 leading-none">{savedItineraries.length}</p>
                   <p className="text-[12px] font-black uppercase tracking-[0.5em] text-orange-500 relative z-10">Masterplans</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Archive List */}
      <div className="space-y-24">
         <div className="flex items-center justify-between">
            <h2 className="text-7xl font-black text-emerald-950 tracking-tighter uppercase leading-none">The <span className="text-orange-600">Archive</span></h2>
            <div className="h-2 bg-emerald-50 flex-grow rounded-full ml-16"></div>
         </div>
         
         {savedItineraries.length === 0 ? (
           <div className="text-center py-64 bg-white rounded-[6rem] border-4 border-dashed border-slate-100 shadow-inner flex flex-col items-center">
             <i className="fas fa-map-marked text-5xl text-slate-200 mb-10"></i>
             <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-sm">Historical archive is empty.</p>
             <p className="text-slate-300 font-bold mt-4 uppercase text-[10px] tracking-widest">Generate a plan and save it to your profile.</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
             {savedItineraries.map(item => {
               const isConfirming = confirmDeleteId === item.id;
               return (
                 <div key={item.id} className="bg-white rounded-[5rem] overflow-hidden border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] group hover:-translate-y-6 transition-all duration-1000">
                   <div className="h-80 relative bg-slate-900 overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000&seed=${item.destination}`} 
                        className="w-full h-full object-cover opacity-60 group-hover:scale-125 transition-transform duration-[3000ms] ease-out" 
                        alt={item.destination}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-transparent"></div>
                      <div className="absolute bottom-12 left-12 right-12">
                         <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-3">{item.destination}</h3>
                         <p className="text-emerald-300 font-black uppercase tracking-widest text-[10px]">{item.data?.totalDays} DAYS • {item.data?.budget}</p>
                      </div>
                   </div>
                   <div className="p-14 flex flex-col gap-8">
                      <div className="flex gap-6">
                         <button 
                           onClick={() => onViewItinerary(item.data)}
                           className="flex-grow bg-emerald-950 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-2xl active:scale-95"
                         >
                           Restore Intel
                         </button>
                         
                         {isConfirming ? (
                           <button 
                             onClick={() => executeDelete(item.id)}
                             className="flex-grow bg-rose-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-700 transition-all shadow-2xl animate-pulse"
                           >
                             CONFIRM?
                           </button>
                         ) : (
                           <button 
                             onClick={() => setConfirmDeleteId(item.id)}
                             className="w-20 h-20 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-3xl flex items-center justify-center transition-all border border-slate-100 active:scale-90"
                           >
                             <i className="fas fa-trash-alt text-xl"></i>
                           </button>
                         )}
                      </div>
                      
                      {isConfirming && (
                        <button 
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-950 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                   </div>
                 </div>
               );
             })}
           </div>
         )}
      </div>

      <div className="mt-64 bg-slate-900 rounded-[6rem] p-24 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12">
            <i className="fas fa-users-viewfinder text-[300px]"></i>
         </div>
         <div className="max-w-3xl relative z-10">
            <span className="text-orange-500 font-black uppercase tracking-[0.6em] text-[12px] mb-8 block">Project Ghumakad: Phase 02 / Social Hub</span>
            <h2 className="text-7xl font-black mb-10 tracking-tighter uppercase leading-none">Shared <span className="text-emerald-400">Expeditions</span></h2>
            <p className="text-slate-400 font-bold text-2xl leading-relaxed mb-16 max-w-2xl">
               Soon you'll be able to publish your verified plans directly to the Ghumakad Feed. Let others follow your tracks or team up for multi-city voyages.
            </p>
         </div>
      </div>
    </div>
  );
};

export default UserProfileView;
