import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { MusicPlayerProvider, useMusicPlayer } from './context/MusicPlayerContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { StickyPlayer } from './components/StickyPlayer';
import { FullscreenPlayer } from './components/FullscreenPlayer';
import { QueueDrawer } from './components/QueueDrawer';
import { DownloadModal } from './components/DownloadModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { MusicPage } from './pages/MusicPage';
import { UgandanMusicPage } from './pages/UgandanMusicPage';
import { GlobalMusicPage } from './pages/GlobalMusicPage';
import { ArtistsPage } from './pages/ArtistsPage';
import { AlbumsPage } from './pages/AlbumsPage';
import { GenresPage } from './pages/GenresPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SearchPage } from './pages/SearchPage';
import { AboutPage } from './pages/AboutPage';
import { ArtistUploadPortalPage } from './pages/ArtistUploadPortalPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { Song } from './types';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Drill-down selection states
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedGenreSlug, setSelectedGenreSlug] = useState<string | null>(null);

  const {
    currentSong,
    isFullscreenPlayerOpen,
    closeFullscreenPlayer,
    isQueueDrawerOpen,
    closeQueueDrawer,
    isDownloadModalOpen,
    downloadModalSong,
    closeDownloadModal,
    playSong
  } = useMusicPlayer();

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab, selectedArtistId, selectedAlbumId, selectedGenreSlug]);

  const handleSelectArtist = (artistId: string) => {
    setSelectedArtistId(artistId);
    setCurrentTab('artists');
  };

  const handleSelectAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setCurrentTab('albums');
  };

  const handleSelectGenre = (genreSlug: string) => {
    setSelectedGenreSlug(genreSlug);
    setCurrentTab('genres');
  };

  const handleSelectSong = (song: Song) => {
    playSong(song);
  };

  const handleHeaderSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentTab('search');
  };

  const renderCurrentView = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomePage
            setCurrentTab={setCurrentTab}
            onSelectArtist={handleSelectArtist}
            onSelectAlbum={handleSelectAlbum}
            onSelectGenre={handleSelectGenre}
            onSelectSong={handleSelectSong}
          />
        );
      case 'music':
        return (
          <MusicPage
            onSelectArtist={handleSelectArtist}
            onSelectSong={handleSelectSong}
          />
        );
      case 'ugandan':
        return (
          <UgandanMusicPage
            onSelectArtist={handleSelectArtist}
            onSelectSong={handleSelectSong}
          />
        );
      case 'global':
        return (
          <GlobalMusicPage
            onSelectArtist={handleSelectArtist}
            onSelectSong={handleSelectSong}
          />
        );
      case 'artists':
        return (
          <ArtistsPage
            selectedArtistId={selectedArtistId}
            onClearArtistSelection={() => setSelectedArtistId(null)}
            onSelectArtist={handleSelectArtist}
            onSelectAlbum={handleSelectAlbum}
            onSelectSong={handleSelectSong}
          />
        );
      case 'albums':
        return (
          <AlbumsPage
            selectedAlbumId={selectedAlbumId}
            onClearAlbumSelection={() => setSelectedAlbumId(null)}
            onSelectAlbum={handleSelectAlbum}
            onSelectArtist={handleSelectArtist}
            onSelectSong={handleSelectSong}
          />
        );
      case 'genres':
        return (
          <GenresPage
            selectedGenreSlug={selectedGenreSlug}
            onClearGenreSelection={() => setSelectedGenreSlug(null)}
            onSelectGenre={handleSelectGenre}
            onSelectArtist={handleSelectArtist}
            onSelectSong={handleSelectSong}
          />
        );
      case 'playlists':
        return (
          <PlaylistsPage
            onSelectArtist={handleSelectArtist}
            onSelectSong={handleSelectSong}
          />
        );
      case 'downloads':
        return (
          <DownloadsPage
            onSelectArtist={handleSelectArtist}
            onSelectSong={handleSelectSong}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'favorites':
        return (
          <FavoritesPage
            onSelectArtist={handleSelectArtist}
            onSelectSong={handleSelectSong}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'search':
        return (
          <SearchPage
            initialQuery={searchQuery}
            onSelectArtist={handleSelectArtist}
            onSelectAlbum={handleSelectAlbum}
            onSelectGenre={handleSelectGenre}
            onSelectSong={handleSelectSong}
          />
        );
      case 'upload':
        return <ArtistUploadPortalPage setCurrentTab={setCurrentTab} />;
      case 'admin':
        return <AdminDashboardPage onSelectArtist={handleSelectArtist} />;
      case 'about':
        return <AboutPage />;
      case 'auth':
        return <AuthPage setCurrentTab={setCurrentTab} />;
      case 'profile':
        return <ProfilePage setCurrentTab={setCurrentTab} />;
      default:
        return (
          <HomePage
            setCurrentTab={setCurrentTab}
            onSelectArtist={handleSelectArtist}
            onSelectAlbum={handleSelectAlbum}
            onSelectGenre={handleSelectGenre}
            onSelectSong={handleSelectSong}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Offline Connectivity Banner */}
      <OfflineIndicator />

      {/* Main Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab !== 'artists') setSelectedArtistId(null);
          if (tab !== 'albums') setSelectedAlbumId(null);
          if (tab !== 'genres') setSelectedGenreSlug(null);
          setCurrentTab(tab);
        }}
        onSearch={handleHeaderSearch}
      />

      {/* Primary Page Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-24 md:pb-28">
        {renderCurrentView()}
      </main>

      {/* Footer Branding */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Sticky Player Bar */}
      <StickyPlayer onSelectArtist={handleSelectArtist} />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Fullscreen Player Modal */}
      <FullscreenPlayer
        isOpen={isFullscreenPlayerOpen}
        onClose={closeFullscreenPlayer}
        onSelectArtist={handleSelectArtist}
      />

      {/* Queue Drawer */}
      <QueueDrawer
        isOpen={isQueueDrawerOpen}
        onClose={closeQueueDrawer}
        onSelectArtist={handleSelectArtist}
      />

      {/* Authorized Download Modal */}
      <DownloadModal
        song={downloadModalSong}
        isOpen={isDownloadModalOpen}
        onClose={closeDownloadModal}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MusicPlayerProvider>
          <AppContent />
        </MusicPlayerProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
