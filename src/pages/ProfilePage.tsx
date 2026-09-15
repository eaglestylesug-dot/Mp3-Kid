import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import {
  User,
  Heart,
  Download,
  Users,
  ShieldAlert,
  Upload,
  LogOut,
  Award,
  Sparkles
} from 'lucide-react';

interface ProfilePageProps {
  setCurrentTab: (tab: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ setCurrentTab }) => {
  const { user, logout, isAdmin } = useAuth();
  const { downloadedTracks } = useMusicPlayer();

  if (!user) {
    return null;
  }

  const favoritesCount = user.favorites?.length ?? 0;
  const downloadsCount = downloadedTracks?.length ?? 0;
  const followingCount = user.favoriteArtists?.length ?? 0;
  const userAvatar = user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80';
  const joinedDate = user.joinedDate || '2024-01-01';

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Profile Header */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-[#11121d] border border-slate-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={userAvatar}
            alt={user.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-500 shadow-xl shrink-0"
          />

          <div className="text-center sm:text-left flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                user.role === 'admin'
                  ? 'bg-amber-500 text-black'
                  : user.role === 'artist'
                  ? 'bg-blue-500 text-black'
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {user.role === 'admin' ? 'HQ Platform Admin' : user.role === 'artist' ? 'Verified Recording Artist' : 'Premium Music Fan'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
            <p className="text-xs text-slate-400">{user.email}</p>
            <p className="text-[11px] font-mono text-slate-500 pt-1">
              Member since {new Date(joinedDate).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={() => {
              logout();
              setCurrentTab('home');
            }}
            className="py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/50 text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-center">
          <div
            onClick={() => setCurrentTab('favorites')}
            className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition cursor-pointer"
          >
            <Heart className="w-4 h-4 text-rose-500 mx-auto mb-1 fill-rose-500" />
            <span className="text-lg font-black text-white block">{favoritesCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Favorites</span>
          </div>

          <div
            onClick={() => setCurrentTab('downloads')}
            className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-lg font-black text-white block">{downloadsCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Offline Songs</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <span className="text-lg font-black text-white block">{followingCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Following</span>
          </div>
        </div>
      </div>

      {/* Role Navigation Hub */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Actions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setCurrentTab('upload')}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/30 hover:border-amber-500 text-left transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition">
                  Artist Upload Portal
                </h4>
                <p className="text-[11px] text-slate-400">Submit tracks for authorized distribution</p>
              </div>
            </div>
          </button>

          {isAdmin ? (
            <button
              onClick={() => setCurrentTab('admin')}
              className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/15 to-transparent border border-purple-500/30 hover:border-purple-500 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500 text-black flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-400 transition">
                    HQ Admin Panel
                  </h4>
                  <p className="text-[11px] text-slate-400">Review submissions & manage music catalog</p>
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setCurrentTab('admin')}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Eagle Admin Panel</h4>
                  <p className="text-[11px] text-slate-400">Access administrative credentials login</p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
