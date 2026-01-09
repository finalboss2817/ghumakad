
import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: () => void;
  session: any;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPostCreated, session }) => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setLoading(true);

    try {
      // In a real production app, you'd upload to Supabase Storage.
      // For this demo, we store the base64 string or a fallback if too large.
      const { error } = await supabase.from('posts').insert({
        user_id: session.user.id,
        content,
        location_name: location,
        image_url: imagePreview || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000`
      });

      if (error) throw error;
      onPostCreated();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Post your Adventure</h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"><i className="fas fa-times"></i></button>
        </div>
        <form onSubmit={handlePost} className="p-8 space-y-6 max-h-[85vh] overflow-y-auto scrollbar-hide">
          <div className="flex items-center gap-4 mb-4">
            <img src={session?.user?.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=travel'} className="w-12 h-12 rounded-2xl border-2 border-emerald-100 shadow-sm" />
            <div>
               <p className="font-black text-slate-900 leading-tight">{session?.user?.user_metadata?.username || 'Ghumakad Explorer'}</p>
               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">Member • Meena Tech</span>
            </div>
          </div>
          
          <textarea 
            placeholder="Where did you go? Any secret Ghumakad Gems?..."
            className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none text-lg font-medium"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="space-y-4">
            <div className="relative group">
              <i className="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 group-hover:scale-110 transition-transform"></i>
              <input 
                placeholder="Where was this?"
                className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative cursor-pointer group border-4 border-dashed border-slate-100 rounded-3xl p-8 text-center hover:border-orange-200 transition-colors bg-slate-50/50"
            >
              {imagePreview ? (
                <div className="relative w-full h-48 overflow-hidden rounded-2xl">
                   <img src={imagePreview} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-black text-xs uppercase tracking-widest">Change Photo</span>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <i className="fas fa-cloud-upload-alt text-2xl"></i>
                  </div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Click to Upload Journey Media</p>
                  <p className="text-[10px] text-slate-300 mt-1 uppercase font-bold">Images or Videos supported</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,video/*" 
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-5 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition shadow-2xl shadow-emerald-700/30 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Publishing to Community...' : 'Share with Community'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
