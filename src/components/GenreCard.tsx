import React from 'react';
import { Genre } from '../types';
import { Music2 } from 'lucide-react';

interface GenreCardProps {
  genre: Genre;
  onSelectGenre: (genreSlug: string) => void;
}

export const GenreCard: React.FC<GenreCardProps> = ({ genre, onSelectGenre }) => {
  return (
    <div
      onClick={() => onSelectGenre(genre.slug)}
      className="group relative h-28 sm:h-32 rounded-2xl overflow-hidden cursor-pointer border border-slate-800 hover:border-amber-500/50 transition-all hover:scale-[1.02] shadow-lg"
    >
      <img
        src={genre.coverImage}
        alt={genre.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 group-hover:via-black/50 transition-colors" />

      <div className="relative h-full p-4 flex flex-col justify-between z-10">
        <div className="flex items-center justify-between">
          <span className="p-1.5 rounded-lg bg-black/50 backdrop-blur-md text-amber-400 border border-amber-500/20">
            <Music2 className="w-3.5 h-3.5" />
          </span>
          <span className="text-[10px] font-bold text-amber-300/80 uppercase tracking-wider">
            {genre.songCount} Tracks
          </span>
        </div>

        <div>
          <h4 className="text-sm sm:text-base font-black text-white group-hover:text-amber-400 transition">
            {genre.name}
          </h4>
          <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
            {genre.description}
          </p>
        </div>
      </div>
    </div>
  );
};
