import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useAuth } from '../context/AuthContext';
import {
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
  Maximize2,
  ListMusic,
  Moon
} from 'lucide-react';
import { AudioSpectrumVisualizer } from './AudioSpectrumVisualizer';

export const StickyPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeatMode,
    queue,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    setIsQueueOpen,
    setIsFullscreenOpen,
    setIsSleepTimerOpen,
    sleepTimerRemaining,
    openDownloadModal
  } = useMusicPlayer();

  const { isFavorite, toggleFavorite } = useAuth();

  if (!currentSong) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isFav = isFavorite(currentSong.id);

  return (
    <div
      id="persistent-music-player"
      className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-[#0c0d15]/95 backdrop-blur-xl border-t border-amber-500/20 px-3 sm:px-6 py-2.5 shadow-2xl transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Track Information */}
        <div className="flex items-center gap-3 min-w-0 max-w-[200px] sm:max-w-[280px]">
          <button
            onClick={() => setIsFullscreenOpen(true)}
            className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl overflow-hidden shrink-0 border border-amber-500/30 group"
          >
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                isPlaying ? 'animate-pulse' : ''
              }`}
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </button>

          <div className="min-w-0 flex-1">
            <h4
              onClick={() => setIsFullscreenOpen(true)}
              className="text-xs sm:text-sm font-bold text-white truncate cursor-pointer hover:text-amber-400 transition"
            >
              {currentSong.title}
            </h4>
            <p className="text-[11px] text-amber-400/90 truncate">{currentSong.artist}</p>
          </div>

          <button
            onClick={() => toggleFavorite(currentSong.id)}
            className={`p-1.5 rounded-full transition shrink-0 ${
              isFav ? 'text-rose-500' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Add to Favorites"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
          </button>

          {currentSong.isDownloadAuthorized && (
            <button
              onClick={() => openDownloadModal(currentSong)}
              className="hidden sm:block p-1.5 rounded-full text-slate-400 hover:text-amber-400 transition shrink-0"
              title="Authorized Download"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Center: Playback Transport & Timeline */}
        <div className="flex-1 max-w-xl flex flex-col items-center">
          <div className="flex items-center gap-2 sm:gap-4 mb-1">
            <button
              onClick={toggleShuffle}
              className={`hidden sm:block p-1 text-xs transition ${
                shuffle ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={prevTrack}
              className="p-1.5 text-slate-300 hover:text-white transition active:scale-95"
              title="Previous"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            <button
              id="btn-player-play-toggle"
              onClick={togglePlay}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black flex items-center justify-center shadow-lg shadow-amber-500/25 transition transform active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current stroke-[2.5]" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current stroke-[2.5] ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-1.5 text-slate-300 hover:text-white transition active:scale-95"
              title="Next"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`hidden sm:block p-1 text-xs transition ${
                repeatMode !== 'off' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Repeat"
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Slider with Timestamps */}
          <div className="w-full flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="w-8 text-right shrink-0">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 210}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="w-8 text-left shrink-0">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Audio Spectrum, Volume & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Frequency Spectrum (Desktop) */}
          <div className="hidden lg:flex items-center mr-1">
            <AudioSpectrumVisualizer barCount={12} height={20} />
          </div>

          {/* Volume Control */}
          <div className="hidden md:flex items-center gap-1.5 w-24 sm:w-28">
            <button onClick={toggleMute} className="text-slate-400 hover:text-white p-1">
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

          {/* Sleep Timer */}
          <button
            onClick={() => setIsSleepTimerOpen(true)}
            className={`p-1.5 rounded-lg transition text-xs flex items-center gap-1 ${
              sleepTimerRemaining !== null
                ? 'bg-amber-500/20 text-amber-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Sleep Timer"
          >
            <Moon className="w-4 h-4" />
            {sleepTimerRemaining && (
              <span className="hidden xl:inline text-[10px]">{Math.ceil(sleepTimerRemaining / 60)}m</span>
            )}
          </button>

          {/* Queue Button with Badge */}
          <button
            onClick={() => setIsQueueOpen(true)}
            className="p-1.5 text-slate-400 hover:text-white transition relative"
            title="Playback Queue"
          >
            <ListMusic className="w-4 h-4 sm:w-5 sm:h-5" />
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center">
                {queue.length}
              </span>
            )}
          </button>

          {/* Fullscreen Expand */}
          <button
            onClick={() => setIsFullscreenOpen(true)}
            className="p-1.5 text-slate-400 hover:text-white transition"
            title="Full-screen view"
          >
            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
