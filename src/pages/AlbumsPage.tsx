import React, { useEffect, useState } from 'react';
import { Album, Song } from '../types';
import { api } from '../services/api';
import { AlbumCard } from '../components/AlbumCard';
import { SongRow } from '../components/SongRow';
import { ArrowLeft, Play, Calendar, Disc3 } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

interface AlbumsPageProps {
  selectedAlbumId?: string | null;
  onClearAlbumSelection?: () => void;
  onSelectAlbum: (albumId: string) => void;
  onSelectArtist: (artistId: string) => void;
  onSelectSong: (song: Song) => void;
}

export const AlbumsPage: React.FC<AlbumsPageProps> = ({
  selectedAlbumId,
  onClearAlbumSelection,
  onSelectAlbum,
  onSelectArtist,
  onSelectSong
}) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentAlbumDetail, setCurrentAlbumDetail] = useState<{
    album: Album;
    songs: Song[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const { playSong } = useMusicPlayer();

  useEffect(() => {
    api.getAlbums().then(res => {
      setAlbums(res.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedAlbumId) {
      api.getAlbum(selectedAlbumId)
        .then(res => setCurrentAlbumDetail(res))
        .catch(console.error);
    } else {
      setCurrentAlbumDetail(null);
    }
  }, [selectedAlbumId]);

  if (currentAlbumDetail && currentAlbumDetail.album) {
    const album = currentAlbumDetail.album;
    const songs = currentAlbumDetail.songs || [];

    return (
      <div className="space-y-8 pb-16">
        <button
          onClick={() => {
            setCurrentAlbumDetail(null);
            if (onClearAlbumSelection) onClearAlbumSelection();
          }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Albums</span>
        </button>

        {/* Album Header Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800">
          <img
            src={album.coverUrl}
            alt={album.title}
            className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover border border-amber-500/30 shadow-2xl shrink-0"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              {album.type} • {album.genre}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white">{album.title}</h1>
            <p
              onClick={() => onSelectArtist(album.artistId)}
              className="text-sm font-semibold text-amber-400 hover:underline cursor-pointer"
            >
              {album.artist}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {album.releaseYear}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Disc3 className="w-3.5 h-3.5" />
                {songs.length} Tracks
              </span>
            </div>

            {songs.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => playSong(songs[0], songs)}
                  className="py-2.5 px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 active:scale-95 transition"
                >
                  <Play className="w-4 h-4 fill-current stroke-[2.5]" />
                  <span>Play Album</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tracklist */}
        <section>
          <h3 className="text-lg font-black text-white mb-4">Album Tracklist</h3>
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
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Albums & EPs</h1>
        <p className="text-xs text-amber-400 font-medium mt-0.5">
          Full-length albums, extended plays, and landmark Ugandan & international anthologies
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading discography...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onSelectAlbum={onSelectAlbum}
            />
          ))}
        </div>
      )}
    </div>
  );
};
