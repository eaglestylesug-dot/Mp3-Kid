import React, { useEffect, useState } from 'react';
import { Song, Artist, Album, Genre } from '../types';
import { api } from '../services/api';
import { SongCard } from '../components/SongCard';
import { SongRow } from '../components/SongRow';
import { ArtistCard } from '../components/ArtistCard';
import { AlbumCard } from '../components/AlbumCard';
import { GenreCard } from '../components/GenreCard';
import { Search, Music2, Users, Disc3, Layers, RefreshCw } from 'lucide-react';

interface SearchPageProps {
  initialQuery?: string;
  onSelectArtist: (artistId: string) => void;
  onSelectAlbum: (albumId: string) => void;
  onSelectGenre: (genreSlug: string) => void;
  onSelectSong: (song: Song) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = '',
  onSelectArtist,
  onSelectAlbum,
  onSelectGenre,
  onSelectSong
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<'all' | 'songs' | 'artists' | 'albums' | 'genres'>('all');
  const [results, setResults] = useState<{
    songs: Song[];
    artists: Artist[];
    albums: Album[];
    genres: Genre[];
    totalMatches: number;
  }>({
    songs: [],
    artists: [],
    albums: [],
    genres: [],
    totalMatches: 0
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ songs: [], artists: [], albums: [], genres: [], totalMatches: 0 });
      return;
    }

    setLoading(true);
    const handler = setTimeout(() => {
      api.searchAll(query.trim())
        .then(res => {
          setResults({
            songs: Array.isArray(res?.songs) ? res.songs : [],
            artists: Array.isArray(res?.artists) ? res.artists : [],
            albums: Array.isArray(res?.albums) ? res.albums : [],
            genres: Array.isArray(res?.genres) ? res.genres : [],
            totalMatches: typeof res?.totalMatches === 'number' ? res.totalMatches : 0
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  const quickTags = ['Eddy Kenzo', 'Baxx Ragga', 'Sheebah', 'Afrobeats', 'Ugandan Hits', 'Amapiano', 'Kadongo Kamu'];

  return (
    <div className="space-y-6 pb-16">
      {/* Big Search Input Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800">
        <h1 className="text-xl sm:text-2xl font-black text-white mb-3">Explore Everything on MP3 KID</h1>
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any song, artist, album, genre, or Ugandan city..."
            autoFocus
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
          />
        </div>

        {/* Quick Tag Recommendations */}
        <div className="flex items-center gap-2 mt-4 flex-wrap text-xs">
          <span className="text-slate-400 font-medium">Trending searches:</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      {query.trim() && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeFilter === 'all'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            All Results ({results.totalMatches})
          </button>
          <button
            onClick={() => setActiveFilter('songs')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeFilter === 'songs'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Songs ({results.songs?.length || 0})
          </button>
          <button
            onClick={() => setActiveFilter('artists')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeFilter === 'artists'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Artists ({results.artists?.length || 0})
          </button>
          <button
            onClick={() => setActiveFilter('albums')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeFilter === 'albums'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Albums ({results.albums?.length || 0})
          </button>
          <button
            onClick={() => setActiveFilter('genres')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeFilter === 'genres'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Genres ({results.genres?.length || 0})
          </button>
        </div>
      )}

      {/* Results Content */}
      {loading ? (
        <div className="text-center py-20">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-medium">Searching MP3 KID catalog...</p>
        </div>
      ) : !query.trim() ? (
        <div className="text-center py-20 text-slate-500 text-xs">
          Enter a search keyword above to discover Ugandan music, worldwide hits, and artists.
        </div>
      ) : results.totalMatches === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
          No matches found for "{query}". Try checking your spelling or searching another artist.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Songs Section */}
          {(activeFilter === 'all' || activeFilter === 'songs') && results.songs.length > 0 && (
            <section>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Music2 className="w-4 h-4 text-amber-400" />
                <span>Songs</span>
              </h3>
              <div className="space-y-1.5">
                {results.songs.map((song, idx) => (
                  <SongRow
                    key={song.id}
                    song={song}
                    index={idx}
                    onSelectArtist={onSelectArtist}
                    onSelectSong={onSelectSong}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Artists Section */}
          {(activeFilter === 'all' || activeFilter === 'artists') && results.artists.length > 0 && (
            <section>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Artists</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {results.artists.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    onSelectArtist={onSelectArtist}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Albums Section */}
          {(activeFilter === 'all' || activeFilter === 'albums') && results.albums.length > 0 && (
            <section>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Disc3 className="w-4 h-4 text-amber-400" />
                <span>Albums</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.albums.map((album) => (
                  <AlbumCard
                    key={album.id}
                    album={album}
                    onSelectAlbum={onSelectAlbum}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Genres Section */}
          {(activeFilter === 'all' || activeFilter === 'genres') && results.genres.length > 0 && (
            <section>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Genres</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.genres.map((genre) => (
                  <GenreCard
                    key={genre.id}
                    genre={genre}
                    onSelectGenre={onSelectGenre}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
