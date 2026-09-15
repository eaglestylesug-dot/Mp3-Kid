import React, { useState } from 'react';
import { Song, AudioQualityOption } from '../types';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Download, ShieldCheck, Check, X, HardDrive, Music, Sparkles } from 'lucide-react';

export const DownloadModal: React.FC = () => {
  const { downloadModalSong, closeDownloadModal, executeDownload } = useMusicPlayer();
  const [selectedQuality, setSelectedQuality] = useState<'320kbps' | '256kbps' | '128kbps'>('320kbps');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!downloadModalSong) return null;

  const defaultQualities: AudioQualityOption[] = downloadModalSong.downloadQualities?.length > 0 
    ? downloadModalSong.downloadQualities 
    : [
        { quality: '320kbps', format: 'MP3', fileSize: '8.2 MB', bitrate: 320 },
        { quality: '256kbps', format: 'MP3', fileSize: '6.5 MB', bitrate: 256 },
        { quality: '128kbps', format: 'MP3', fileSize: '3.3 MB', bitrate: 128 }
      ];

  const currentOption = defaultQualities.find(q => q.quality === selectedQuality) || defaultQualities[0];

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await executeDownload(downloadModalSong, currentOption);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-[#11121b] border border-amber-500/30 p-6 shadow-2xl text-slate-100 relative">
        <button
          onClick={closeDownloadModal}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <img
            src={downloadModalSong.coverUrl}
            alt={downloadModalSong.title}
            className="w-16 h-16 rounded-xl object-cover shadow-md border border-slate-700"
          />
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold tracking-wide uppercase mb-1 border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              Authorized Direct Download
            </span>
            <h3 className="text-base font-bold text-white truncate">{downloadModalSong.title}</h3>
            <p className="text-xs text-slate-400 truncate">{downloadModalSong.artist}</p>
          </div>
        </div>

        {/* Quality selection */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-slate-300 mb-2.5 block flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-amber-400" />
            Select Audio Quality Format
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {defaultQualities.map((q) => {
              const isSelected = selectedQuality === q.quality;
              return (
                <button
                  key={q.quality}
                  onClick={() => setSelectedQuality(q.quality)}
                  className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/15 shadow-sm shadow-amber-500/20'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{q.quality}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <span className="text-[10px] text-amber-400/90 font-mono">{q.format}</span>
                  <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <HardDrive className="w-2.5 h-2.5" />
                    {q.fileSize}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Licensing information statement */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 mb-5 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Eagle Icon Music Licensing Standard</span>
          </div>
          <p className="leading-relaxed">
            This file is officially authorized for offline personal playback and DRM-free streaming by MP3 KID.
            Extracting audio from unauthorized 3rd-party streams is strictly prohibited.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={closeDownloadModal}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/60 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-download"
            disabled={isDownloading}
            onClick={handleDownload}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isDownloading ? 'Preparing MP3...' : `Download (${selectedQuality})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
