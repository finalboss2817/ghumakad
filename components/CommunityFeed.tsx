
import React from 'react';
import { Itinerary } from '../types';

interface CommunityFeedProps {
  items: Itinerary[];
  onNavigate: (view: 'itinerary') => void;
  setItinerary: (iten: Itinerary) => void;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ items, onNavigate, setItinerary }) => {
  const defaultItems: Partial<Itinerary>[] = [
    {
      destination: "Santorini, Greece",
      totalDays: 5,
      budget: "Luxury",
      travelType: "Couple",
      interests: ["Relaxation", "Food"],
      createdAt: new Date().toISOString()
    },
    {
      destination: "Reykjavik, Iceland",
      totalDays: 4,
      budget: "Medium",
      travelType: "Friends",
      interests: ["Adventure", "Nature"],
      createdAt: new Date().toISOString()
    },
    {
      destination: "Bali, Indonesia",
      totalDays: 7,
      budget: "Low",
      travelType: "Solo",
      interests: ["Culture", "Nature"],
      createdAt: new Date().toISOString()
    }
  ];

  const displayItems = items.length > 0 ? items : (defaultItems as Itinerary[]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayItems.map((item, idx) => (
        <div 
          key={item.id || idx} 
          className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200 group cursor-pointer hover:shadow-xl transition-all duration-300"
          onClick={() => {
            if (item.days) {
              setItinerary(item);
              onNavigate('itinerary');
            }
          }}
        >
          <div className="h-48 relative">
            <img 
              src={`https://picsum.photos/seed/${item.destination}/800/600`} 
              alt={item.destination}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold">{item.destination}</h3>
              <p className="text-xs text-white/80">{item.totalDays} Days • {item.budget} Budget</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {item.interests?.map((interest, i) => (
                <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded">
                  {interest}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center text-sm text-slate-500">
              <span className="flex items-center"><i className="far fa-user-circle mr-2"></i> Explorer</span>
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
            {!item.days && (
              <p className="mt-4 text-xs text-slate-400 italic">Sample itinerary preview</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityFeed;
