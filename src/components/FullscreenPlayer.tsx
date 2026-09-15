import React, { useState } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  Download,
  Share2,
  Moon,
  ListMusic,
  FileText,
  Radio,
  ShieldCheck
} from 'lucide-react';
import { AudioSpectrumVisualizer } from './AudioSpectrumVisualizer';
import { ShareModal } from './ShareModal';

export const FullscreenPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeatMode,
    isFullscreenOpen,
    setIsFullscreenOpen,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    setIsQueueOpen,
    setIsSleepTimerOpen,
    sleepTimerRemaining,
    openDownloadModal
  } = useMusicPlayer();

  const { isFavorite, toggleFavorite } = useAuth();
  const [activeTab, setActiveTab] = useState<'art' | 'lyrics'>('art');
  const [isShareOpen, setIsShareOpen] = useState(false);

  if (!isFullscreenOpen || !currentSong) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isFav = isFavorite(currentSong.id);

  return (
    <div className="fixed inset-0 z-50 bg-[#090a0f] text-slate-100 flex flex-col justify-between overflow-hidden animate-in fade-in duration-300">
      {/* Background ambient glow matching artwork */}
      <div
        className="absolute inset-0 opacity-25 blur-3xl scale-110 pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `url(${currentSong.coverUrl})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/80 to-transparent pointer-events-none" />

      {/* Top Header Controls */}
      <header className="relative z-10 p-5 flex items-center justify-between">
        <button
          onClick={() => setIsFullscreenOpen(false)}
          className="p-2.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase block">
            The Eagle Icon Music
          </span>
          <h4 className="text-xs font-semibold text-slate-300 truncate max-w-xs">
            {currentSong.album || 'MP3 KID Stream'}
          </h4>
        </div>

        {/* Tab Switcher: Artwork vs Lyrics */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-slate-900/80 border border-slate-800">
          <button
            onClick={() => setActiveTab('art')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
              activeTab === 'art'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Artwork
          </button>
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
              activeTab === 'lyrics'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lyrics
          </button>
        </div>
      </header>

      {/* Main Center Stage */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        {activeTab === 'art' ? (
          <div className="flex flex-col items-center justify-center w-full">
            {/* Vinyl Record & Artwork Combo */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 my-4">
              {/* Spinning Vinyl behind cover */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-tr from-black via-zinc-900 to-black border-4 border-zinc-800 shadow-2xl flex items-center justify-center transition-transform duration-700 ${
                  isPlaying ? 'translate-x-8 -translate-y-4 animate-spin-slow' : 'translate-x-0'
                }`}
                style={{ animationDuration: '8s' }}
              >
                <div className="w-24 h-24 rounded-full border-2 border-amber-500/40 bg-zinc-950 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-amber-500" />
                </div>
              </div>

              {/* Cover Artwork Card */}
              <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 group">
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-amber-300 flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span>320kbps Master</span>
                </div>
              </div>
            </div>

            {/* Audio Spectrum Equalizer */}
            <div className="mt-4 mb-2 flex items-center justify-center">
              <AudioSpectrumVisualizer barCount={24} height={32} />
            </div>
          </div>
        ) : (
          /* Lyrics View */
          <div className="w-full h-80 sm:h-96 rounded-2xl bg-black/40 border border-slate-800/80 p-6 overflow-y-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4" />
              <span>Official Lyrics</span>
            </div>
            {currentSong.lyrics ? (
              <pre className="font-sans text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-wrap">
                {currentSong.lyrics}
              </pre>
            ) : (
              <div className="py-20 text-slate-500 text-xs">
                Lyrics for this track are being synchronized by The Eagle Icon Music licensing team.
              </div>
            )}
          </div>
        )}

        {/* Track Details & Action Buttons */}
        <div className="w-full mt-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-black text-white truncate">
                {currentSong.title}
              </h2>
              <p className="text-sm font-semibold text-amber-400 truncate mt-0.5">
                {currentSong.artist}
                {currentSong.featuredArtists && (
                  <span className="text-slate-400 font-normal"> ft. {currentSong.featuredArtists.join(', ')}</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(currentSong.id)}
                className={`p-2.5 rounded-full border transition ${
                  isFav
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-500'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Favorite track"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={() => setIsShareOpen(true)}
                className="p-2.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white transition"
                title="Share track"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {currentSong.isDownloadAuthorized && (
                <button
                  onClick={() => openDownloadModal(currentSong)}
                  className="p-2.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black transition"
                  title="Authorized Download"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Seek Progress Bar */}
          <div className="w-full">
            <input
              type="range"
              min={0}
              max={duration || 210}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs font-mono text-slate-400 mt-1.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Transport Controls */}
      <footer className="relative z-10 p-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-full transition ${
              shuffle ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={prevTrack}
            className="p-2.5 text-slate-300 hover:text-white transition active:scale-95"
            title="Previous"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black flex items-center justify-center shadow-xl shadow-amber-500/25 transition transform active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current stroke-[2.5]" />
            ) : (
              <Play className="w-7 h-7 fill-current stroke-[2.5] ml-1" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2.5 text-slate-300 hover:text-white transition active:scale-95"
            title="Next"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-2 rounded-full transition ${
              repeatMode !== 'off' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Repeat"
          >
            {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
          </button>
        </div>

        {/* Volume & Utility Strip */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 w-36">
            <button onClick={toggleMute} className="text-slate-400 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSleepTimerOpen(true)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition ${
                sleepTimerRemaining !== null
                  ? 'bg-amber-500/20 text-amber-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{sleepTimerRemaining ? `${Math.ceil(sleepTimerRemaining / 60)}m` : 'Timer'}</span>
            </button>

            <button
              onClick={() => setIsQueueOpen(true)}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition"
            >
              <ListMusic className="w-4 h-4" />
              <span>Queue</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Share Modal */}
      <ShareModal
        title={currentSong.title}
        subtitle={currentSong.artist}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
};
