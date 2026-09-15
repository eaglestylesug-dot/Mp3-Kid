import React, { useState } from 'react';
import { Song } from '../types';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useAuth } from '../context/AuthContext';
import { Play, Pause, Download, Heart, Share2, Plus, Flag, ShieldCheck, Radio } from 'lucide-react';
import { ShareModal } from './ShareModal';
import { ReportModal } from './ReportModal';

interface SongRowProps {
  song: Song;
  index?: number;
  showIndex?: boolean;
  onSelectArtist?: (artistId: string) => void;
  onSelectSong?: (song: Song) => void;
}

export const SongRow: React.FC<SongRowProps> = ({
  song,
  index,
  showIndex = true,
  onSelectArtist,
  onSelectSong
}) => {
  const { currentSong, isPlaying, playSong, togglePlay, addToQueue, openDownloadModal } = useMusicPlayer();
  const { isFavorite, toggleFavorite } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const isCurrent = currentSong?.id === song.id;
  const isThisPlaying = isCurrent && isPlaying;
  const isFav = isFavorite(song.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  return (
    <div
      onClick={() => {
        if (onSelectSong) onSelectSong(song);
        else playSong(song);
      }}
      className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition cursor-pointer border ${
        isCurrent
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          : 'bg-slate-900/40 hover:bg-slate-900/90 border-transparent hover:border-slate-800'
      }`}
    >
      {/* Left: Index / Play, Thumbnail, Details */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {showIndex && (
          <div className="w-6 text-center text-xs font-mono text-slate-500 group-hover:text-amber-400 shrink-0">
            {isThisPlaying ? (
              <Radio className="w-3.5 h-3.5 mx-auto text-amber-400 animate-pulse" />
            ) : (
              (index !== undefined ? index + 1 : '')
            )}
          </div>
        )}

        <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-800">
          <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
          <button
            onClick={handlePlay}
            className={`absolute inset-0 bg-black/50 flex items-center justify-center transition ${
              isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            {isThisPlaying ? (
              <Pause className="w-4 h-4 text-amber-400 fill-amber-400" />
            ) : (
              <Play className="w-4 h-4 text-amber-400 fill-amber-400 ml-0.5" />
            )}
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className={`text-xs sm:text-sm font-bold truncate ${isCurrent ? 'text-amber-400' : 'text-white'}`}>
              {song.title}
            </h4>
            {song.isUgandan && (
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                UG
              </span>
            )}
            {song.isDownloadAuthorized && (
              <span className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-medium">
                <ShieldCheck className="w-2.5 h-2.5" />
                320k
              </span>
            )}
          </div>
          <p
            onClick={(e) => {
              if (onSelectArtist) {
                e.stopPropagation();
                onSelectArtist(song.artistId);
              }
            }}
            className="text-xs text-slate-400 truncate hover:text-amber-300 transition"
          >
            {song.artist}
            {song.album && <span className="hidden lg:inline text-slate-500"> • {song.album}</span>}
          </p>
        </div>
      </div>

      {/* Middle: Genre and Plays (Desktop) */}
      <div className="hidden md:flex items-center gap-6 px-4 text-xs text-slate-400">
        <span className="w-24 truncate text-slate-400 font-medium">{song.genre}</span>
        <span className="w-20 text-right font-mono text-slate-500">{song.plays.toLocaleString()} plays</span>
      </div>

      {/* Right: Actions and Duration */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(song.id);
          }}
          className={`p-1.5 rounded-lg transition ${
            isFav ? 'text-rose-500' : 'text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100'
          }`}
          title="Favorite"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            addToQueue(song);
          }}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition hidden sm:block"
          title="Add to queue"
        >
          <Plus className="w-4 h-4" />
        </button>

        {song.isDownloadAuthorized && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDownloadModal(song);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition"
            title="Authorized Download"
          >
            <Download className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShareOpen(true);
          }}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition hidden sm:block"
          title="Share track"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        <span className="text-xs font-mono text-slate-400 w-10 text-right pl-1">
          {song.durationFormatted}
        </span>
      </div>

      <ShareModal
        title={song.title}
        subtitle={song.artist}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />

      <ReportModal
        contentType="song"
        contentId={song.id}
        contentTitle={`${song.title} - ${song.artist}`}
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
};
