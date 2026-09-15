import React, { useEffect, useState } from 'react';
import { Genre, Song } from '../types';
import { api } from '../services/api';
import { GenreCard } from '../components/GenreCard';
import { SongCard } from '../components/SongCard';
import { ArrowLeft, Music2 } from 'lucide-react';

interface GenresPageProps {
  selectedGenreSlug?: string | null;
  onClearGenreSelection?: () => void;
  onSelectGenre: (genreSlug: string) => void;
  onSelectArtist: (artistId: string) => void;
  onSelectSong: (song: Song) => void;
}

export const GenresPage: React.FC<GenresPageProps> = ({
  selectedGenreSlug,
  onClearGenreSelection,
  onSelectGenre,
  onSelectArtist,
  onSelectSong
}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [currentGenreDetail, setCurrentGenreDetail] = useState<{
    genre: Genre;
    songs: Song[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGenres().then(res => {
      setGenres(res.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedGenreSlug) {
      api.getGenre(selectedGenreSlug)
        .then(res => setCurrentGenreDetail(res))
        .catch(console.error);
    } else {
      setCurrentGenreDetail(null);
    }
  }, [selectedGenreSlug]);

  if (currentGenreDetail && currentGenreDetail.genre) {
    const genre = currentGenreDetail.genre;
    const songs = currentGenreDetail.songs || [];

    return (
      <div className="space-y-8 pb-16">
        <button
          onClick={() => {
            setCurrentGenreDetail(null);
            if (onClearGenreSelection) onClearGenreSelection();
          }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Genres</span>
        </button>

        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-slate-800 bg-[#10121d]">
          <div
            className="absolute inset-0 opacity-25 bg-cover bg-center filter blur-md"
            style={{ backgroundImage: `url(${genre.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10121d] via-[#10121d]/80 to-transparent" />

          <div className="relative z-10 space-y-2 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              Musical Category
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{genre.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{genre.description}</p>
            <p className="text-xs font-mono text-amber-400/90 pt-1">{songs.length} Tracks in this genre</p>
          </div>
        </div>

        <section>
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
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Genres & Rhythms</h1>
        <p className="text-xs text-amber-400 font-medium mt-0.5">
          Browse by sonic styles, East African regional roots, and international sounds
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading genre categories...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <GenreCard
              key={genre.id}
              genre={genre}
              onSelectGenre={onSelectGenre}
            />
          ))}
        </div>
      )}
    </div>
  );
};
