import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { X, Play, Trash2, ListMusic, Music } from 'lucide-react';

export const QueueDrawer: React.FC = () => {
  const {
    isQueueOpen,
    setIsQueueOpen,
    queue,
    queueIndex,
    playSong,
    removeFromQueue,
    clearQueue,
    currentSong
  } = useMusicPlayer();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-[#10111a] border-l border-slate-800 p-6 flex flex-col shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-amber-400">
            <ListMusic className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Playback Queue</h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold">
              {queue.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {queue.length > 1 && (
              <button
                onClick={clearQueue}
                className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition flex items-center gap-1"
                title="Clear queue"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={() => setIsQueueOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Song */}
        {currentSong && (
          <div className="py-4 border-b border-slate-800/80">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
              Now Playing
            </span>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-12 h-12 rounded-lg object-cover border border-amber-500/30"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">{currentSong.title}</h4>
                <p className="text-xs text-amber-400 truncate">{currentSong.artist}</p>
              </div>
              <span className="text-xs font-mono text-slate-400">{currentSong.durationFormatted}</span>
            </div>
          </div>
        )}

        {/* Up Next List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Up Next
          </span>
          {queue.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Music className="w-8 h-8 mx-auto mb-2 opacity-40" />
              Queue is empty. Select any song to start playing!
            </div>
          ) : (
            queue.map((song, idx) => {
              const isCurrent = idx === queueIndex;
              return (
                <div
                  key={`${song.id}-${idx}`}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition group ${
                    isCurrent
                      ? 'bg-amber-500/15 border border-amber-500/30'
                      : 'hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <button
                    onClick={() => playSong(song, queue)}
                    className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0"
                  >
                    <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                  </button>

                  <div className="min-w-0 flex-1">
                    <h5 className={`text-xs font-bold truncate ${isCurrent ? 'text-amber-300' : 'text-slate-200'}`}>
                      {song.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 truncate">{song.artist}</p>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">{song.durationFormatted}</span>

                  <button
                    onClick={() => removeFromQueue(idx)}
                    className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition"
                    title="Remove from queue"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
