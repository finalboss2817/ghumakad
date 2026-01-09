
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Itinerary } from '../types';

interface GhumakadBlogsProps {
  onItineraryClick: (iten: Itinerary) => void;
}

const DEFAULT_BLOGS = [
  {
    id: 'b1',
    destination: "The Forbidden Spiti Loop",
    profiles: { username: "AdityaMeena", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya", full_name: "Aditya Meena" },
    data: { totalDays: 10, destination: "Spiti Valley" },
    image: "https://images.unsplash.com/photo-1582234372722-50d7ccc30e5a?auto=format&fit=crop&q=80&w=1000",
    description: "Normal planners show you Kaza. Ghumakad takes you to the caves of Gue. We focus on high-octane reality pacing and hidden gems that Google Maps doesn't index."
  },
  {
    id: 'b2',
    destination: "Kyoto's Ghost Temples",
    profiles: { username: "MeenaExplorer", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=kyoto", full_name: "Meena Explorer" },
    data: { totalDays: 4, destination: "Kyoto" },
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000",
    description: "Skip the 10,000 gates crowd. We found the 12 silent forest shrines where Zen actually lives. Our USP is 'Context Over Content'."
  },
  {
    id: 'b3',
    destination: "Icelandic Inner Fire",
    profiles: { username: "UrbanGhumakad", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=iceland", full_name: "Raj Singh" },
    data: { totalDays: 6, destination: "Iceland" },
    image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&q=80&w=1000",
    description: "The Golden Circle is basic. Ghumakad guides you to thermal springs used only by local shepherds. Authentic exploration, optimized by Meena Tech."
  }
];

const GhumakadBlogs: React.FC<GhumakadBlogsProps> = ({ onItineraryClick }) => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('itineraries')
          .select('*, profiles(username, avatar_url, full_name)')
          .limit(6);
        
        if (!error && data && data.length > 0) {
          // Map database format to blog format
          const formatted = data.map(d => ({
            ...d,
            image: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000&seed=${d.destination}`,
            description: `A masterclass journey through ${d.destination}. Verified by the community, optimized for soul over speed.`
          }));
          setBlogs(formatted);
        } else {
          setBlogs(DEFAULT_BLOGS);
        }
      } catch (err) {
        setBlogs(DEFAULT_BLOGS);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
      {[1,2,3].map(i => <div key={i} className="animate-pulse bg-emerald-900/10 h-[600px] rounded-[5rem]"></div>)}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
      {blogs.map(blog => (
        <div 
          key={blog.id} 
          onClick={() => blog.data && onItineraryClick(blog.data)}
          className="group relative bg-white/5 backdrop-blur-3xl rounded-[5rem] overflow-hidden border border-white/10 shadow-2xl hover:shadow-orange-600/20 hover:-translate-y-6 transition-all duration-1000 cursor-pointer"
        >
          <div className="absolute top-10 left-10 z-20">
             <div className="bg-orange-600 text-white px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl flex items-center gap-3 border border-orange-500">
                <i className="fas fa-check-shield"></i> 
                <span>GHUMAKAD VERIFIED</span>
             </div>
          </div>

          <div className="h-[450px] relative overflow-hidden">
            <img 
              src={blog.image} 
              alt={blog.destination}
              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[3000ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent"></div>
            
            <div className="absolute bottom-16 left-16 right-16 text-white">
              <h4 className="text-6xl font-black tracking-tighter leading-none mb-4 group-hover:text-orange-400 transition-colors uppercase">{blog.destination}</h4>
              <div className="flex items-center gap-4">
                <div className="w-16 h-1 bg-orange-500 rounded-full"></div>
                <p className="text-[12px] font-black uppercase tracking-[0.4em] text-emerald-300">EXPLORER VAULT</p>
              </div>
            </div>
          </div>
          
          <div className="p-16 pt-12">
            <div className="flex items-center gap-6 mb-12 bg-white/5 p-6 rounded-[3rem] border border-white/10">
              <img src={blog.profiles?.avatar_url} className="w-16 h-16 rounded-2xl border-4 border-white/20 shadow-xl" />
              <div className="flex flex-col">
                <p className="font-black text-white text-sm tracking-tight">@{blog.profiles?.username}</p>
                <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em] mt-1">MASTER EXPLORER</p>
              </div>
            </div>
            
            <p className="text-emerald-100/60 text-xl font-bold mb-14 leading-relaxed line-clamp-3">
              {blog.description}
            </p>
            
            <div className="flex justify-between items-center bg-white text-emerald-950 p-10 rounded-[3rem] group-hover:bg-orange-600 group-hover:text-white transition-all duration-700 shadow-2xl">
              <span className="font-black text-[12px] uppercase tracking-[0.3em]">UNLOCK GUIDE</span>
              <div className="w-16 h-16 rounded-3xl bg-emerald-950/5 flex items-center justify-center text-emerald-950 border border-emerald-950/10 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/20 transition-all">
                <i className="fas fa-arrow-right text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GhumakadBlogs;
