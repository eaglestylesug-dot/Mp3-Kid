import React, { useEffect, useState } from 'react';
import { Song, Artist } from '../types';
import { api } from '../services/api';
import { SongCard } from '../components/SongCard';
import { SongRow } from '../components/SongRow';
import { ArtistCard } from '../components/ArtistCard';
import { Flame, Sparkles, MapPin, Download, Music, Radio, Disc3, ShieldCheck } from 'lucide-react';

interface UgandanMusicPageProps {
  onSelectArtist: (artistId: string) => void;
  onSelectSong: (song: Song) => void;
}

export const UgandanMusicPage: React.FC<UgandanMusicPageProps> = ({
  onSelectArtist,
  onSelectSong
}) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [activeSubGenre, setActiveSubGenre] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getSongs({ region: 'uganda' }),
      api.getArtists({ region: 'uganda' })
    ])
      .then(([songsRes, artistsRes]) => {
        setSongs(songsRes.items || []);
        setArtists(artistsRes.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const subGenres = [
    { id: 'all', label: 'All Ugandan Hits' },
    { id: 'baxx', label: 'Baxx Ragga' },
    { id: 'kidandali', label: 'Kidandali / Band' },
    { id: 'lugaflow', label: 'Lugaflow / Hip-Hop' },
    { id: 'kadongo', label: 'Kadongo Kamu Folk' },
    { id: 'afrobeat', label: 'Afrobeat UG' },
    { id: 'gospel', label: 'Ugandan Gospel' },
  ];

  const filteredSongs = activeSubGenre === 'all'
    ? songs
    : songs.filter(s => s.genre.toLowerCase().includes(activeSubGenre) || (s.audioToneType && s.audioToneType.includes(activeSubGenre)));

  return (
    <div className="space-y-8 pb-16">
      {/* Ugandan Pride Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-zinc-950 to-black p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          {/* Uganda Flag Accent Strip */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center h-3 rounded overflow-hidden shadow">
              <div className="w-3 h-full bg-black" />
              <div className="w-3 h-full bg-yellow-400" />
              <div className="w-3 h-full bg-red-600" />
            </div>
            <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
              Pearl of Africa Music Portal
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ugandan Music & Cultural Heritage
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            From the raw energetic streets of Kampala to the rolling hills of Kabale and the Nile banks of Jinja. Stream and download authorized 320kbps MP3s from Uganda’s greatest recording artists.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>100% Authorized Ugandan Downloads</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Kampala • Gulu • Mbarara • Jinja • Mbale</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ugandan Sub-Genre Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {subGenres.map((sg) => (
          <button
            key={sg.id}
            onClick={() => setActiveSubGenre(sg.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              activeSubGenre === sg.id
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {sg.label}
          </button>
        ))}
      </div>

      {/* Featured Ugandan Artists Strip */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white">Uganda’s Top Icons</h2>
          </div>
          <span className="text-xs text-amber-400 font-semibold">Verified Artists</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onSelectArtist={onSelectArtist}
            />
          ))}
        </div>
      </section>

      {/* Ugandan Songs Showcase Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Disc3 className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white">
              {activeSubGenre === 'all' ? 'All Ugandan Releases' : `${activeSubGenre.toUpperCase()} Tracks`}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredSongs.length} Tracks Available
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400 text-xs">Loading Ugandan library...</div>
        ) : filteredSongs.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
            No songs found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredSongs.map((song) => (
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
    </div>
  );
};
