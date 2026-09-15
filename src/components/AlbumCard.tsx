import React from 'react';
import { Album } from '../types';
import { Disc3, Calendar } from 'lucide-react';

interface AlbumCardProps {
  album: Album;
  onSelectAlbum: (albumId: string) => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, onSelectAlbum }) => {
  return (
    <div
      onClick={() => onSelectAlbum(album.id)}
      className="group p-3 rounded-2xl bg-[#10121b]/80 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/10"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-800 shadow-md">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
          {album.type}
        </div>
      </div>

      <div>
        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition truncate">
          {album.title}
        </h4>
        <p className="text-xs text-slate-400 truncate mt-0.5">{album.artist}</p>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Disc3 className="w-3 h-3 text-slate-400" />
            <span>{album.trackCount} Tracks</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{album.releaseYear}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
