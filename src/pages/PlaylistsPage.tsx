import React, { useEffect, useState } from 'react';
import { Playlist, Song } from '../types';
import { api } from '../services/api';
import { SongRow } from '../components/SongRow';
import { ListMusic, Plus, Play, ArrowLeft, Disc3, ShieldCheck, Check } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useToast } from '../context/ToastContext';

interface PlaylistsPageProps {
  onSelectArtist: (artistId: string) => void;
  onSelectSong: (song: Song) => void;
}

export const PlaylistsPage: React.FC<PlaylistsPageProps> = ({
  onSelectArtist,
  onSelectSong
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistDetail, setSelectedPlaylistDetail] = useState<{
    playlist: Playlist;
    songs: Song[];
  } | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [loading, setLoading] = useState(true);

  const { playSong } = useMusicPlayer();
  const { showToast } = useToast();

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = () => {
    api.getPlaylists().then(res => {
      setPlaylists(res.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleSelectPlaylist = (id: string) => {
    api.getPlaylist(id).then(res => {
      setSelectedPlaylistDetail(res);
    }).catch(console.error);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await api.createPlaylist(newTitle.trim(), newDesc.trim());
      setNewTitle('');
      setNewDesc('');
      setCreateModalOpen(false);
      loadPlaylists();
      showToast('Playlist created successfully!', 'success');
    } catch {
      showToast('Failed to create playlist.', 'error');
    }
  };

  if (selectedPlaylistDetail && selectedPlaylistDetail.playlist) {
    const playlist = selectedPlaylistDetail.playlist;
    const songs = selectedPlaylistDetail.songs || [];

    return (
      <div className="space-y-8 pb-16">
        <button
          onClick={() => setSelectedPlaylistDetail(null)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Playlists</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800">
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover border border-amber-500/30 shadow-2xl shrink-0"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              Curated Playlist
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white">{playlist.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300">{playlist.description}</p>

            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-400 font-mono">
              <span>Curated by <strong className="text-amber-400">{playlist.creator.name}</strong></span>
              <span>•</span>
              <span>{songs.length} Tracks</span>
            </div>

            {songs.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => playSong(songs[0], songs)}
                  className="py-2.5 px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 active:scale-95 transition"
                >
                  <Play className="w-4 h-4 fill-current stroke-[2.5]" />
                  <span>Play Playlist</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <section>
          <h3 className="text-lg font-black text-white mb-4">Tracklist</h3>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Playlists</h1>
          <p className="text-xs text-amber-400 font-medium mt-0.5">
            Handpicked editorial selections and personal user sound collections
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="self-start sm:self-auto py-2 px-4 rounded-full bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Playlist</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading playlists...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => handleSelectPlaylist(pl.id)}
              className="group p-4 rounded-2xl bg-[#10121b]/80 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/80 transition cursor-pointer flex gap-4 items-center"
            >
              <img
                src={pl.coverUrl}
                alt={pl.title}
                className="w-20 h-20 rounded-xl object-cover border border-slate-800 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                  Playlist
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition truncate">
                  {pl.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{pl.description}</p>
                <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                  {pl.songIds.length} Songs
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-[#12131d] border border-slate-800 p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-2">Create New Playlist</h3>
            <p className="text-xs text-slate-400 mb-4">Organize your favorite Ugandan & international tracks.</p>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Playlist Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kampala Night Drive, Chill Baxx"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Short description of this vibe..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
