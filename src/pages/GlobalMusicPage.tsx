import React, { useEffect, useState } from 'react';
import { Song, JamendoTrack } from '../types';
import { api } from '../services/api';
import { SongCard } from '../components/SongCard';
import { Globe, Radio, Sparkles, ExternalLink, ShieldCheck, Search, Music2 } from 'lucide-react';

interface GlobalMusicPageProps {
  onSelectArtist: (artistId: string) => void;
  onSelectSong: (song: Song) => void;
}

export const GlobalMusicPage: React.FC<GlobalMusicPageProps> = ({
  onSelectArtist,
  onSelectSong
}) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [jamendoStatus, setJamendoStatus] = useState<any>(null);
  const [jamendoQuery, setJamendoQuery] = useState('afrobeat');
  const [jamendoResults, setJamendoResults] = useState<JamendoTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchingJamendo, setSearchingJamendo] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getSongs({ region: 'global' }),
      api.getJamendoStatus(),
      api.searchJamendo('afrobeat')
    ])
      .then(([songsRes, jamendoStatusRes, jamendoSearchRes]) => {
        setSongs(songsRes.items || []);
        setJamendoStatus(jamendoStatusRes);
        setJamendoResults(jamendoSearchRes.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleJamendoSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jamendoQuery.trim()) return;
    setSearchingJamendo(true);
    try {
      const res = await api.searchJamendo(jamendoQuery);
      setJamendoResults(res.results || []);
    } finally {
      setSearchingJamendo(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Global Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-blue-950/40 via-zinc-950 to-black p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>Worldwide Sounds • West Africa • South Africa • Caribbean • Global</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Global Music Discovery
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Discover chart-topping Afrobeats from Lagos, hypnotic Amapiano from Johannesburg, Kingston dancehall, and global royalty-free music ready for instant streaming and authorized download.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Fully compliant licensing & Creative Commons authorized distribution</span>
          </div>
        </div>
      </section>

      {/* Global Catalog Showcase */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-white">Global Hits on MP3 KID</h2>
          <span className="text-xs text-slate-400 font-mono">{songs.length} Tracks</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Loading global tracks...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onSelectArtist={onSelectArtist}
                onSelectSong={onSelectSong}
              />
            ))}
          </div>
        )}
      </section>

      {/* Jamendo Integration & Architecture Hub */}
      <section className="rounded-2xl bg-gradient-to-br from-[#10121d] to-[#0c0d15] border border-amber-500/20 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                Partner Catalog Engine
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400">Jamendo API Ready</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
              Global Royalty-Free & Creative Commons Discovery
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              MP3 KID's backend is pre-architected with a modular Jamendo service layer using <code className="text-amber-400 bg-black/40 px-1 rounded font-mono">JAMENDO_CLIENT_ID</code> for seamless authorized worldwide streaming.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-slate-400 font-medium">Service Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {jamendoStatus?.isConfigured ? 'Live API Connected' : 'Simulated Sandbox Ready'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              {jamendoStatus?.isConfigured
                ? `Active Client ID: ${jamendoStatus.clientId?.slice(0, 6)}...`
                : 'Configure JAMENDO_CLIENT_ID in Railway / .env to activate live API.'}
            </div>
          </div>
        </div>

        {/* Live Jamendo Search Tester */}
        <div className="mt-6">
          <form onSubmit={handleJamendoSearch} className="flex gap-2 max-w-md mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={jamendoQuery}
                onChange={(e) => setJamendoQuery(e.target.value)}
                placeholder="Search global tracks (e.g., afrobeat, acoustic, chill)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={searchingJamendo}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition disabled:opacity-50"
            >
              {searchingJamendo ? 'Querying...' : 'Search'}
            </button>
          </form>

          {/* Jamendo Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {jamendoResults.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-white truncate">{t.name}</h5>
                  <p className="text-[11px] text-slate-400 truncate">{t.artist_name}</p>
                  <span className="text-[10px] text-amber-400/90 font-mono">
                    {Math.floor(t.duration / 60)}:{(t.duration % 60).toString().padStart(2, '0')} • CC License
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
