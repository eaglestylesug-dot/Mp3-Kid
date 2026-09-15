import React, { useEffect, useState } from 'react';
import { Song, Genre } from '../types';
import { api } from '../services/api';
import { SongCard } from '../components/SongCard';
import { SongRow } from '../components/SongRow';
import { Search, LayoutGrid, List, SlidersHorizontal, Filter, Music2, RefreshCw } from 'lucide-react';

interface MusicPageProps {
  onSelectArtist: (artistId: string) => void;
  onSelectSong: (song: Song) => void;
  initialGenre?: string;
  initialRegion?: string;
}

export const MusicPage: React.FC<MusicPageProps> = ({
  onSelectArtist,
  onSelectSong,
  initialGenre,
  initialRegion
}) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre || 'all');
  const [selectedRegion, setSelectedRegion] = useState(initialRegion || 'all');
  const [sort, setSort] = useState<'trending' | 'popular' | 'downloads' | 'newest' | 'az'>('trending');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    api.getGenres().then(res => setGenres(res.items || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getSongs({
      search: search || undefined,
      genre: selectedGenre !== 'all' ? selectedGenre : undefined,
      region: selectedRegion !== 'all' ? selectedRegion : undefined,
      sort
    })
      .then(res => {
        setSongs(res.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [search, selectedGenre, selectedRegion, sort]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Music Catalog</h1>
          <p className="text-xs text-amber-400 font-medium mt-0.5">
            Discover authorized releases from Uganda and across the globe
          </p>
        </div>

        {/* View Mode Toggle (Grid vs List) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Main Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, artist, or album..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Region Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">🌍 All Regions</option>
            <option value="uganda">🇺🇬 Ugandan Hits Only</option>
            <option value="global">🌐 Global Catalog Only</option>
          </select>
        </div>

        {/* Sort Selector */}
        <div className="sm:col-span-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="trending">🔥 Trending Hits</option>
            <option value="downloads">📥 Most Downloaded</option>
            <option value="popular">🎧 Most Played</option>
            <option value="newest">✨ Newest Releases</option>
            <option value="az">🔤 Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Genre Horizontal Pill Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedGenre('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
            selectedGenre === 'all'
              ? 'bg-amber-500 text-black'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Genres
        </button>

        {genres.map((g) => {
          const isSelected = selectedGenre.toLowerCase() === g.name.toLowerCase() || selectedGenre === g.slug;
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(isSelected ? 'all' : g.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {g.name}
            </button>
          );
        })}
      </div>

      {/* Song Results Container */}
      {loading ? (
        <div className="text-center py-20">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-medium">Filtering catalog...</p>
        </div>
      ) : songs.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
          <Music2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No tracks match your query</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or reset the genre filters to view all available music.
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedGenre('all'); setSelectedRegion('all'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
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
      ) : (
        <div className="space-y-1.5">
          {songs.map((song, idx) => (
            <SongRow
              key={song.id}
              song={song}
              index={idx}
              onSelectArtist={onSelectArtist}
              onSelectSong={onSelectSong}
            />
          ))}
        </div>
      )}
    </div>
  );
};
