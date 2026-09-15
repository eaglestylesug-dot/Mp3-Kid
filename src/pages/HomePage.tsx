import React, { useEffect, useState } from 'react';
import { Song, Artist, Genre, HeroBanner } from '../types';
import { api } from '../services/api';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { SongCard } from '../components/SongCard';
import { SongRow } from '../components/SongRow';
import { ArtistCard } from '../components/ArtistCard';
import { GenreCard } from '../components/GenreCard';
import {
  Play,
  Flame,
  Sparkles,
  Download,
  ArrowRight,
  TrendingUp,
  Radio,
  Disc3,
  Award,
  Globe
} from 'lucide-react';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  onSelectArtist: (artistId: string) => void;
  onSelectAlbum: (albumId: string) => void;
  onSelectGenre: (genreSlug: string) => void;
  onSelectSong: (song: Song) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentTab,
  onSelectArtist,
  onSelectAlbum,
  onSelectGenre,
  onSelectSong
}) => {
  const { playSong } = useMusicPlayer();
  const [data, setData] = useState<{
    banner: HeroBanner | null;
    featuredMusic: Song[];
    trendingNow: Song[];
    newReleases: Song[];
    mostDownloaded: Song[];
    popularArtists: Artist[];
    ugandanMusic: Song[];
    internationalMusic: Song[];
    recommendedMusic: Song[];
    popularGenres: Genre[];
    recentlyAdded: Song[];
  }>({
    banner: null,
    featuredMusic: [],
    trendingNow: [],
    newReleases: [],
    mostDownloaded: [],
    popularArtists: [],
    ugandanMusic: [],
    internationalMusic: [],
    recommendedMusic: [],
    popularGenres: [],
    recentlyAdded: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getHomeFeed()
      .then(res => {
        if (mounted) {
          setData({
            banner: res?.banner || null,
            featuredMusic: Array.isArray(res?.featuredMusic) ? res.featuredMusic : [],
            trendingNow: Array.isArray(res?.trendingNow) ? res.trendingNow : [],
            newReleases: Array.isArray(res?.newReleases) ? res.newReleases : [],
            mostDownloaded: Array.isArray(res?.mostDownloaded) ? res.mostDownloaded : [],
            popularArtists: Array.isArray(res?.popularArtists) ? res.popularArtists : [],
            ugandanMusic: Array.isArray(res?.ugandanMusic) ? res.ugandanMusic : [],
            internationalMusic: Array.isArray(res?.internationalMusic) ? res.internationalMusic : [],
            recommendedMusic: Array.isArray(res?.recommendedMusic) ? res.recommendedMusic : [],
            popularGenres: Array.isArray(res?.popularGenres) ? res.popularGenres : [],
            recentlyAdded: Array.isArray(res?.recentlyAdded) ? res.recentlyAdded : []
          });
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Home feed error:', err);
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-400">Loading MP3 KID Experience...</p>
      </div>
    );
  }

  const heroSong = (data.featuredMusic && data.featuredMusic[0]) || (data.trendingNow && data.trendingNow[0]) || null;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-amber-950/40 via-zinc-950 to-black shadow-2xl min-h-[380px] sm:min-h-[440px] flex items-center">
        {/* Background artwork with dark overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url(${data.banner?.bgImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&q=80'})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{data.banner?.tagline || 'Proudly from The Eagle Icon Music'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-3">
            {data.banner?.title || 'The Sound of Uganda & The World.'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
            {data.banner?.subtitle || 'Discover trending Ugandan baxx ragga, afrobeats, authorized 320kbps direct downloads, and global chart-toppers.'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {heroSong && (
              <button
                id="btn-hero-play"
                onClick={() => playSong(heroSong, data.featuredMusic)}
                className="py-3 px-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs sm:text-sm font-bold shadow-xl shadow-amber-500/25 flex items-center gap-2 transform active:scale-95 transition"
              >
                <Play className="w-4 h-4 fill-current stroke-[2.5]" />
                <span>Play Featured ({heroSong.title})</span>
              </button>
            )}

            <button
              onClick={() => setCurrentTab('ugandan')}
              className="py-3 px-6 rounded-full bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-semibold flex items-center gap-2 transition"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Explore Ugandan Hits</span>
            </button>

            <button
              onClick={() => setCurrentTab('downloads')}
              className="py-3 px-5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs sm:text-sm font-semibold flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Downloads</span>
            </button>
          </div>
        </div>
      </section>

      {/* Ugandan Music Showcase (Pearl of Africa) */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">Ugandan Music Hits</h2>
              <p className="text-xs text-amber-400 font-medium">Proud Pearl of Africa Anthems & Baxx Ragga</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('ugandan')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
          >
            <span>View All UG</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {(data.ugandanMusic?.length ?? 0) === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center space-y-3">
            <p className="text-xs text-slate-400">
              The Ugandan catalog is ready for fresh releases. Upload official tracks via the Admin Portal.
            </p>
            <button
              onClick={() => setCurrentTab('admin')}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition"
            >
              Upload Ugandan Track
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {(data.ugandanMusic || []).slice(0, 4).map((song) => (
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

      {/* Trending Now & Most Downloaded 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trending Now Table (7 Cols) */}
        <section className="lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-black text-white">Trending Now</h2>
            </div>
            <button
              onClick={() => setCurrentTab('music')}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              See all
            </button>
          </div>

          {(data.trendingNow?.length ?? 0) === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800 text-center text-xs text-slate-400">
              No trending songs recorded yet. Releases will rank here as listeners stream.
            </div>
          ) : (
            <div className="space-y-1.5">
              {(data.trendingNow || []).slice(0, 5).map((song, idx) => (
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
        </section>

        {/* Most Downloaded (5 Cols) */}
        <section className="lg:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-black text-white">Most Downloaded</h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              320kbps Authorized
            </span>
          </div>

          {(data.mostDownloaded?.length ?? 0) === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800 text-center text-xs text-slate-400">
              Authorized 320kbps downloads will be highlighted here.
            </div>
          ) : (
            <div className="space-y-1.5">
              {(data.mostDownloaded || []).slice(0, 5).map((song, idx) => (
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
        </section>
      </div>

      {/* Featured Global Tracks */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">Global Music Catalog</h2>
              <p className="text-xs text-slate-400">Afrobeats, Amapiano, Dancehall & Worldwide Hits</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('global')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
          >
            <span>Explore Global</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {(data.internationalMusic?.length ?? 0) === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center text-xs text-slate-400">
            Global catalog awaiting releases. Upload tracks via the Admin Portal.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {(data.internationalMusic || []).slice(0, 4).map((song) => (
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

      {/* Popular Artists Carousel / Grid */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-black text-white">Popular Artists</h2>
          </div>
          <button
            onClick={() => setCurrentTab('artists')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
          >
            <span>All Artists</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {(data.popularArtists || []).slice(0, 6).map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onSelectArtist={onSelectArtist}
            />
          ))}
        </div>
      </section>

      {/* Genres and Moods Grid */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Disc3 className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-black text-white">Explore Genres</h2>
          </div>
          <button
            onClick={() => setCurrentTab('genres')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
          >
            <span>All Genres</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(data.popularGenres || []).slice(0, 6).map((genre) => (
            <GenreCard
              key={genre.id}
              genre={genre}
              onSelectGenre={onSelectGenre}
            />
          ))}
        </div>
      </section>

      {/* Artist Submission CTA Callout */}
      <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500/15 via-amber-950/20 to-black border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wide">
            Artist Upload Portal
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Are You an Artist or Music Producer?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Distribute your music to millions across Uganda, East Africa, and globally. Fast curator review by The Eagle Icon Music and 100% verified artist status.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('upload')}
          className="py-3 px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs sm:text-sm font-bold shadow-xl shadow-amber-500/20 whitespace-nowrap active:scale-95 transition"
        >
          Submit Your Track Today
        </button>
      </section>
    </div>
  );
};
