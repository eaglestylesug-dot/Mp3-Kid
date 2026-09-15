import React from 'react';
import { Artist } from '../types';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Users, Flame } from 'lucide-react';

interface ArtistCardProps {
  artist: Artist;
  onSelectArtist: (artistId: string) => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onSelectArtist }) => {
  const { isFollowingArtist, toggleFollowArtist } = useAuth();
  const isFollowing = isFollowingArtist(artist.id);

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollowArtist(artist.id);
  };

  return (
    <div
      onClick={() => onSelectArtist(artist.id)}
      className="group p-4 rounded-2xl bg-[#10121b]/80 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all cursor-pointer text-center flex flex-col items-center justify-between hover:shadow-xl hover:shadow-amber-500/10"
    >
      {/* Circular Profile Portrait */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border-2 border-slate-700/80 group-hover:border-amber-500 transition-colors shadow-lg">
        <img
          src={artist.profileImage}
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {artist.country.toLowerCase() === 'uganda' && (
          <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-amber-500 border-2 border-black flex items-center justify-center text-[10px] font-black text-black" title="Uganda">
            UG
          </span>
        )}
      </div>

      {/* Name and Verified Badge */}
      <div className="w-full">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition truncate max-w-[140px]">
            {artist.name}
          </h4>
          {artist.isVerified && (
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" title="Verified Artist" />
          )}
        </div>

        <p className="text-[11px] text-slate-400 truncate mb-1">
          {artist.genres.slice(0, 2).join(' • ')}
        </p>

        <p className="text-[10px] font-mono text-slate-500 flex items-center justify-center gap-1">
          <Users className="w-2.5 h-2.5" />
          <span>{artist.monthlyListeners.toLocaleString()} monthly listeners</span>
        </p>
      </div>

      {/* Follow Button */}
      <button
        onClick={handleFollowClick}
        className={`mt-3.5 w-full py-1.5 px-3 rounded-full text-xs font-semibold transition ${
          isFollowing
            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-black'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow Artist'}
      </button>
    </div>
  );
};
