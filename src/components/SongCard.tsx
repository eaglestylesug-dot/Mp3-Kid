import React, { useState } from 'react';
import { Song } from '../types';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useAuth } from '../context/AuthContext';
import { Play, Pause, Download, Heart, Share2, MoreVertical, Flag, Radio, ShieldCheck } from 'lucide-react';
import { ShareModal } from './ShareModal';
import { ReportModal } from './ReportModal';

interface SongCardProps {
  song: Song;
  onSelectArtist?: (artistId: string) => void;
  onSelectSong?: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onSelectArtist, onSelectSong }) => {
  const { currentSong, isPlaying, playSong, togglePlay, openDownloadModal } = useMusicPlayer();
  const { isFavorite, toggleFavorite } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const isCurrent = currentSong?.id === song.id;
  const isThisPlaying = isCurrent && isPlaying;
  const isFav = isFavorite(song.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDownloadModal(song);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(song.id);
  };

  return (
    <div
      onClick={() => {
        if (onSelectSong) onSelectSong(song);
        else playSong(song);
      }}
      className={`group relative rounded-2xl p-3 bg-[#10121b]/80 border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10 ${
        isCurrent
          ? 'border-amber-500/50 bg-amber-500/5 shadow-md shadow-amber-500/15'
          : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
      }`}
    >
      {/* Artwork Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-800">
        <img
          src={song.coverUrl}
          alt={song.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isThisPlaying ? 'brightness-90' : ''
          }`}
          loading="lazy"
        />

        {/* Badges: Ugandan, High-Quality, etc. */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {song.isUgandan && (
            <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-black tracking-wider uppercase border border-amber-500/30">
              UG
            </span>
          )}
          {song.isDownloadAuthorized && (
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md text-emerald-400 text-[9px] font-bold border border-emerald-500/30 flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" />
              MP3
            </span>
          )}
        </div>

        {/* Favorite Heart on top right */}
        <button
          onClick={handleHeartClick}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition ${
            isFav
              ? 'bg-rose-500/80 text-white'
              : 'bg-black/50 text-white/80 opacity-0 group-hover:opacity-100 hover:text-rose-400 hover:bg-black/80'
          }`}
          title="Favorite"
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Play Overlay Button */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${
            isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <button
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/40 transform active:scale-90 transition hover:bg-amber-400"
            title={isThisPlaying ? 'Pause' : 'Play'}
          >
            {isThisPlaying ? (
              <Pause className="w-5 h-5 fill-current stroke-[2.5]" />
            ) : (
              <Play className="w-5 h-5 fill-current stroke-[2.5] ml-0.5" />
            )}
          </button>
        </div>

        {/* Equalizer animation badge when active */}
        {isThisPlaying && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            <span>PLAYING</span>
          </div>
        )}
      </div>

      {/* Song Metadata */}
      <div>
        <h4 className={`text-xs sm:text-sm font-bold truncate ${isCurrent ? 'text-amber-400' : 'text-white'}`}>
          {song.title}
        </h4>
        <p
          onClick={(e) => {
            if (onSelectArtist) {
              e.stopPropagation();
              onSelectArtist(song.artistId);
            }
          }}
          className="text-xs text-slate-400 truncate hover:text-amber-300 transition mt-0.5"
        >
          {song.artist}
        </p>

        {/* Genre Pill & Metrics Strip */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-medium truncate max-w-[80px]">
            {song.genre}
          </span>

          <div className="flex items-center gap-1.5">
            {song.isDownloadAuthorized && (
              <button
                onClick={handleDownloadClick}
                className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition"
                title="Download MP3"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShareOpen(true);
              }}
              className="p-1 rounded text-slate-400 hover:text-white transition"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setReportOpen(true);
              }}
              className="p-1 rounded text-slate-500 hover:text-red-400 transition"
              title="Report content"
            >
              <Flag className="w-3 h-3" />
            </button>
          </div>
        </div>
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
