
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
      } else {
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'ghumakad'}`;
        const { data: authData, error: authError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              username: username,
              avatar_url: avatarUrl
            }
          }
        });
        
        if (authError) throw authError;
        
        if (authData.user) {
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: authData.user.id,
            username: username,
            full_name: username,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString()
          });
          if (profileError) console.error("Profile sync issue:", profileError);
        }
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during sync.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-md p-8 md:p-12 shadow-2xl relative border border-slate-100 animate-in slide-in-from-bottom-10 duration-500 overflow-hidden">
        <button onClick={onClose} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center text-slate-300 hover:text-slate-600 transition">
          <i className="fas fa-times text-xl"></i>
        </button>
        
        <div className="text-center mb-10">
          <div className="bg-emerald-800 text-white w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-xl mx-auto mb-6 rotate-3">
            <i className="fas fa-compass"></i>
          </div>
          <h2 className="text-4xl font-black text-emerald-950 mb-2 tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Ghumakad Adventure Awaits</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in duration-300">
            <i className="fas fa-circle-exclamation text-rose-500 mt-1"></i>
            <p className="text-rose-600 text-xs font-black leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unique Username</label>
              <input 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold transition-all"
                value={username}
                placeholder="traveler_2024"
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold transition-all"
              value={email}
              placeholder="name@meenatech.com"
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secret Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold transition-all pr-14"
                value={password}
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700 transition-colors p-2"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
          
          <button 
            disabled={loading}
            className="w-full py-5 bg-emerald-700 text-white rounded-2xl font-black text-lg hover:bg-emerald-800 transition shadow-2xl shadow-emerald-700/30 active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
          >
            {loading && <i className="fas fa-spinner animate-spin"></i>}
            {loading ? 'Authenticating...' : (isLogin ? 'Enter Ghumakad' : 'Start Journey')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-slate-500 text-xs font-black uppercase tracking-widest hover:text-emerald-700 transition">
            {isLogin ? "New to the community? Join Us" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
