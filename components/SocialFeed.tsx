
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Post } from '../types';

interface SocialFeedProps {
  limit?: number;
  horizontal?: boolean;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ limit, horizontal }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles (id, username, avatar_url, full_name),
        likes (user_id)
      `)
      .order('created_at', { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (!error && data) {
      // Get current user's follows
      let userFollows: any[] = [];
      if (user) {
        const { data: followData } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id);
        userFollows = followData || [];
      }

      const formattedPosts = data.map((p: any) => ({
        ...p,
        likes_count: p.likes?.length || 0,
        has_liked: p.likes?.some((l: any) => l.user_id === user?.id) || false,
        has_followed: userFollows.some(f => f.following_id === p.profiles.id)
      }));
      setPosts(formattedPosts);
    }
    setLoading(false);
  };

  const toggleLike = async (postId: string, hasLiked: boolean) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Login to join the conversation!");

    if (hasLiked) {
      await supabase.from('likes').delete().match({ post_id: postId, user_id: user.id });
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
    }
    fetchPosts();
  };

  const toggleFollow = async (userId: string, hasFollowed: boolean) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Login to follow travelers!");
    if (user.id === userId) return;

    if (hasFollowed) {
      await supabase.from('follows').delete().match({ follower_id: user.id, following_id: userId });
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, following_id: userId });
    }
    fetchPosts();
  };

  if (loading) return <div className="text-center py-8">Syncing community updates...</div>;

  return (
    <div className={horizontal ? 'flex gap-8 overflow-x-auto pb-6 scrollbar-hide px-4' : 'space-y-10'}>
      {posts.length === 0 && (
        <div className="text-center w-full py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
          <i className="fas fa-mountain text-4xl text-slate-200 mb-4"></i>
          <p className="text-slate-400 font-bold">The feed is waiting for your first story.</p>
        </div>
      )}
      {posts.map(post => (
        <div 
          key={post.id} 
          className={`bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 ${horizontal ? 'min-w-[340px] max-w-[340px]' : 'w-full shadow-xl shadow-slate-200/50'}`}
        >
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={post.profiles.avatar_url} className="w-12 h-12 rounded-full border-2 border-emerald-100 p-0.5" alt="user" />
              <div>
                <p className="font-black text-slate-900 text-sm tracking-tight">{post.profiles.username}</p>
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{post.location_name || 'Ghumakad'}</p>
              </div>
            </div>
            <button 
              onClick={() => toggleFollow(post.profiles.id, !!post.has_followed)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${post.has_followed ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
            >
              {post.has_followed ? 'Following' : '+ Follow'}
            </button>
          </div>
          {post.image_url && (
            <div className="h-80 relative">
              <img src={post.image_url} className="w-full h-full object-cover" alt="post" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
            </div>
          )}
          <div className="p-8">
            <p className="text-slate-700 mb-8 leading-relaxed font-medium line-clamp-4">{post.content}</p>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex gap-8">
                <button 
                  onClick={() => toggleLike(post.id, post.has_liked)}
                  className={`group flex items-center gap-2 text-sm transition-all ${post.has_liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${post.has_liked ? 'bg-rose-50' : 'bg-slate-50 group-hover:bg-rose-50'}`}>
                    <i className={`${post.has_liked ? 'fas' : 'far'} fa-heart text-lg`}></i>
                  </div>
                  <span className="font-black">{post.likes_count}</span>
                </button>
                <button className="group flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-600 transition-all">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-emerald-50">
                    <i className="far fa-comment text-lg"></i>
                  </div>
                  <span className="font-black">Chat</span>
                </button>
              </div>
              <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-orange-600 transition-all">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialFeed;
