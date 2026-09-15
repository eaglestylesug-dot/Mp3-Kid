import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Song } from '../types';
import { Download, HardDrive, Play, Trash2, ShieldCheck, WifiOff, Disc3 } from 'lucide-react';

interface DownloadsPageProps {
  onSelectArtist: (artistId: string) => void;
  onSelectSong: (song: Song) => void;
  setCurrentTab: (tab: string) => void;
}

export const DownloadsPage: React.FC<DownloadsPageProps> = ({
  onSelectArtist,
  onSelectSong,
  setCurrentTab
}) => {
  const { downloadedTracks, deleteDownload, playSong } = useMusicPlayer();

  const handlePlayAll = () => {
    if (downloadedTracks.length > 0) {
      const queue = downloadedTracks.map(d => d.song);
      playSong(queue[0], queue);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Authorized DRM-Free Downloads
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Offline Downloads Vault</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Your authorized songs saved for high-fidelity offline listening, zero data consumption, and local playback.
          </p>
        </div>

        {downloadedTracks.length > 0 && (
          <button
            onClick={handlePlayAll}
            className="self-start sm:self-auto py-2.5 px-5 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 active:scale-95 transition"
          >
            <Play className="w-4 h-4 fill-current stroke-[2.5]" />
            <span>Play All Offline ({downloadedTracks.length})</span>
          </button>
        )}
      </div>

      {downloadedTracks.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-slate-800 p-8">
          <HardDrive className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Downloads in Your Vault Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Browse our catalog and look for the <strong className="text-amber-400">Download (MP3)</strong> button on any track to save it for offline listening.
          </p>
          <button
            onClick={() => setCurrentTab('ugandan')}
            className="mt-5 py-2.5 px-6 rounded-full bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition"
          >
            Discover Ugandan Hits
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {downloadedTracks.map((item) => (
            <div
              key={item.song.id}
              className="group flex items-center justify-between p-3 rounded-2xl bg-[#11121d] border border-slate-800/80 hover:border-amber-500/40 transition"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-800">
                  <img
                    src={item.song.coverUrl}
                    alt={item.song.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => playSong(item.song)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <Play className="w-4 h-4 text-amber-400 fill-amber-400 ml-0.5" />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {item.song.title}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                      {item.quality}
                    </span>
                    <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                      {item.fileSize}
                    </span>
                  </div>
                  <p
                    onClick={() => onSelectArtist(item.song.artistId)}
                    className="text-xs text-slate-400 truncate hover:text-amber-300 transition cursor-pointer"
                  >
                    {item.song.artist}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => playSong(item.song)}
                  className="py-1.5 px-3 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Play</span>
                </button>

                <button
                  onClick={() => deleteDownload(item.song.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                  title="Remove from offline downloads"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
