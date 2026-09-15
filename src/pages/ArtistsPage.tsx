import React, { useEffect, useState } from 'react';
import { Artist, Song, Album } from '../types';
import { api } from '../services/api';
import { ArtistCard } from '../components/ArtistCard';
import { SongRow } from '../components/SongRow';
import { AlbumCard } from '../components/AlbumCard';
import { useAuth } from '../context/AuthContext';
import { Search, Users, CheckCircle2, ArrowLeft, Play, Flame, Disc3, ShieldCheck } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

interface ArtistsPageProps {
  selectedArtistId?: string | null;
  onClearArtistSelection?: () => void;
  onSelectArtist: (artistId: string) => void;
  onSelectAlbum: (albumId: string) => void;
  onSelectSong: (song: Song) => void;
}

export const ArtistsPage: React.FC<ArtistsPageProps> = ({
  selectedArtistId,
  onClearArtistSelection,
  onSelectArtist,
  onSelectAlbum,
  onSelectSong
}) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Single artist profile state
  const [currentArtistDetail, setCurrentArtistDetail] = useState<{
    artist: Artist;
    songs: Song[];
    albums: Album[];
    topTracks: Song[];
  } | null>(null);

  const { isFollowingArtist, toggleFollowArtist } = useAuth();
  const { playSong } = useMusicPlayer();

  useEffect(() => {
    api.getArtists({
      search: search || undefined,
      region: regionFilter !== 'all' ? regionFilter : undefined
    })
      .then(res => {
        setArtists(res.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, regionFilter]);

  // Load single artist if selected
  useEffect(() => {
    if (selectedArtistId) {
      api.getArtist(selectedArtistId)
        .then(res => setCurrentArtistDetail(res))
        .catch(console.error);
    } else {
      setCurrentArtistDetail(null);
    }
  }, [selectedArtistId]);

  // If viewing a single artist detail view
  if (currentArtistDetail && currentArtistDetail.artist) {
    const artist = currentArtistDetail.artist;
    const songs = currentArtistDetail.songs || [];
    const albums = currentArtistDetail.albums || [];
    const topTracks = currentArtistDetail.topTracks || [];
    const isFollowing = isFollowingArtist(artist.id);

    return (
      <div className="space-y-8 pb-16">
        {/* Back Button */}
        <button
          onClick={() => {
            setCurrentArtistDetail(null);
            if (onClearArtistSelection) onClearArtistSelection();
          }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Artists</span>
        </button>

        {/* Artist Profile Header Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#10121d] p-6 sm:p-10 shadow-2xl">
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center filter blur-lg"
            style={{ backgroundImage: `url(${artist.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10121d] via-[#10121d]/80 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <img
              src={artist.profileImage}
              alt={artist.name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-2 border-amber-500 shadow-2xl shrink-0"
            />

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  {artist.country} Recording Artist
                </span>
                {artist.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white">{artist.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">{artist.bio}</p>

              <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <strong className="text-white">{artist.monthlyListeners.toLocaleString()}</strong> monthly listeners
                </span>
                <span>•</span>
                <span><strong className="text-white">{songs.length}</strong> Tracks</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              {topTracks.length > 0 && (
                <button
                  onClick={() => playSong(topTracks[0], topTracks)}
                  className="py-2.5 px-5 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-lg shadow-amber-500/25 flex items-center gap-2 active:scale-95 transition"
                >
                  <Play className="w-4 h-4 fill-current stroke-[2.5]" />
                  <span>Play All</span>
                </button>
              )}

              <button
                onClick={() => toggleFollowArtist(artist.id)}
                className={`py-2.5 px-5 rounded-full text-xs font-semibold border transition ${
                  isFollowing
                    ? 'bg-slate-800 text-slate-200 border-slate-700'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500 hover:text-black'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow Artist'}
              </button>
            </div>
          </div>
        </div>

        {/* Top Songs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-white">Popular Tracks</h3>
            <span className="text-xs text-slate-400 font-mono">{topTracks.length} tracks</span>
          </div>

          <div className="space-y-1.5">
            {topTracks.map((song, idx) => (
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

        {/* Discography Albums */}
        {albums.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white">Discography</h3>
              <span className="text-xs text-slate-400 font-mono">{albums.length} Releases</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onSelectAlbum={onSelectAlbum}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Browse All Artists view
  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Featured Artists</h1>
          <p className="text-xs text-amber-400 font-medium mt-0.5">
            Explore verified creators and vocalists from Uganda and international scenes
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artists by name or genre..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">🌍 All Regions</option>
            <option value="uganda">🇺🇬 Ugandan Artists Only</option>
            <option value="global">🌐 Global Artists</option>
          </select>
        </div>
      </div>

      {/* Artists Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading artists...</div>
      ) : artists.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-xs bg-slate-900/40 rounded-2xl border border-slate-800">
          No artists matched your search.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onSelectArtist={onSelectArtist}
            />
          ))}
        </div>
      )}
    </div>
  );
};
