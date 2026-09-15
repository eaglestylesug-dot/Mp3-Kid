import React, { useEffect, useState } from 'react';
import { Song } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { SongRow } from '../components/SongRow';
import { Heart, Play, Music2 } from 'lucide-react';

interface FavoritesPageProps {
  onSelectArtist: (artistId: string) => void;
  onSelectSong: (song: Song) => void;
  setCurrentTab: (tab: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onSelectArtist,
  onSelectSong,
  setCurrentTab
}) => {
  const { user } = useAuth();
  const { playSong } = useMusicPlayer();
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSongs({}).then(res => {
      const favIds = new Set(user?.favorites || []);
      const matched = (res.items || []).filter(s => favIds.has(s.id));
      setFavoriteSongs(matched);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user?.favorites]);

  const handlePlayAll = () => {
    if (favoriteSongs.length > 0) {
      playSong(favoriteSongs[0], favoriteSongs);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              Liked Tracks
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Your Favorites</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Songs you've loved on MP3 KID, curated for your personal replay sessions.
          </p>
        </div>

        {favoriteSongs.length > 0 && (
          <button
            onClick={handlePlayAll}
            className="self-start sm:self-auto py-2.5 px-5 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 active:scale-95 transition"
          >
            <Play className="w-4 h-4 fill-current stroke-[2.5]" />
            <span>Play Favorites ({favoriteSongs.length})</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading favorites...</div>
      ) : favoriteSongs.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-slate-800 p-8">
          <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Favorite Songs Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Tap the heart icon on any song to add it to your personal favorites collection.
          </p>
          <button
            onClick={() => setCurrentTab('ugandan')}
            className="mt-5 py-2.5 px-6 rounded-full bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition"
          >
            Explore Ugandan Hits
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          {favoriteSongs.map((song, idx) => (
            <SongRow
              key={song.id}
              song={song}
              index={idx}
              onSelectArtist={onSelectArtist}
              onSelectSong={onSelectSong}
            />
          ))}
        </div>
      )}
    </div>
  );
};
