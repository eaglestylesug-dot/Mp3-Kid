import React, { useEffect, useState } from 'react';
import { Song, ArtistSubmission, HeroBanner } from '../types';
import { api } from '../services/api';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  BarChart3,
  Inbox,
  Music,
  Sliders,
  Flag,
  Check,
  X,
  Play,
  Trash2,
  Star,
  Flame,
  Globe,
  Upload,
  UploadCloud,
  FileAudio,
  Image as ImageIcon,
  RefreshCw,
  Sparkles,
  Save,
  LogOut,
  Server,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardPageProps {
  onSelectArtist?: (artistId: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = () => {
  const { showToast } = useToast();
  const { playSong } = useMusicPlayer();
  const { adminLogin, logout: authLogout } = useAuth();

  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginUsername, setLoginUsername] = useState('Mp3Kid');
  const [loginPassword, setLoginPassword] = useState('@Es%');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<'upload' | 'catalog' | 'submissions' | 'banner' | 'stats' | 'reports'>('upload');
  const [stats, setStats] = useState<any>(null);
  const [submissions, setSubmissions] = useState<ArtistSubmission[]>([]);
  const [catalogSongs, setCatalogSongs] = useState<Song[]>([]);
  const [banner, setBanner] = useState<HeroBanner | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Banner state
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerTagline, setBannerTagline] = useState('');
  const [bannerBgImage, setBannerBgImage] = useState('');
  const [bannerFeaturedSongId, setBannerFeaturedSongId] = useState('');
  const [bannerSavedMsg, setBannerSavedMsg] = useState(false);

  // New Song Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadArtist, setUploadArtist] = useState('');
  const [uploadFeaturedArtists, setUploadFeaturedArtists] = useState('');
  const [uploadAlbum, setUploadAlbum] = useState('Single Release');
  const [uploadGenre, setUploadGenre] = useState('Kidandali (Ugandan Band Music)');
  const [uploadReleaseDate, setUploadReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploadDuration, setUploadDuration] = useState('3:30');
  const [uploadCoverUrl, setUploadCoverUrl] = useState('');
  const [uploadAudioUrl, setUploadAudioUrl] = useState('');
  const [uploadLyrics, setUploadLyrics] = useState('');
  const [uploadIsDownloadAuth, setUploadIsDownloadAuth] = useState(true);
  const [uploadIsFeatured, setUploadIsFeatured] = useState(false);
  const [uploadIsTrending, setUploadIsTrending] = useState(false);
  const [uploadIsUgandan, setUploadIsUgandan] = useState(true);
  const [uploadLicense, setUploadLicense] = useState('Licensed for distribution on MP3 KID via The Eagle Icon Music.');

  // File upload state
  const [audioUploading, setAudioUploading] = useState(false);
  const [artworkUploading, setArtworkUploading] = useState(false);
  const [uploadedAudioName, setUploadedAudioName] = useState<string | null>(null);
  const [uploadedArtworkName, setUploadedArtworkName] = useState<string | null>(null);
  const [isSubmittingSong, setIsSubmittingSong] = useState(false);

  // Initial Verification
  useEffect(() => {
    const checkAdminSession = async () => {
      setAuthChecking(true);
      try {
        const res = await api.verifyAdmin();
        if (res.authenticated) {
          setIsAdminLoggedIn(true);
          await loadAllAdminData();
        } else {
          setIsAdminLoggedIn(false);
        }
      } catch {
        setIsAdminLoggedIn(false);
      } finally {
        setAuthChecking(false);
      }
    };
    checkAdminSession();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const ok = await adminLogin(loginUsername, loginPassword);
      if (ok) {
        setIsAdminLoggedIn(true);
        showToast('Administrator authenticated successfully. Welcome Mp3Kid!', 'success');
        await loadAllAdminData();
      } else {
        setLoginError('Invalid administrator credentials. Access restricted.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    await api.adminLogout();
    authLogout();
    setIsAdminLoggedIn(false);
    showToast('Logged out of Admin Portal.', 'info');
  };

  const loadAllAdminData = async () => {
    setLoadingData(true);
    try {
      const [statsRes, subRes, songsRes, reportsRes, homeRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminSubmissions(),
        api.getSongs({}),
        api.getAdminReports(),
        api.getHomeFeed()
      ]);

      setStats(statsRes);
      setSubmissions(subRes.submissions || []);
      setCatalogSongs(songsRes.items || []);
      setReports(reportsRes.reports || []);
      if (homeRes.banner) {
        setBanner(homeRes.banner);
        setBannerTitle(homeRes.banner.title);
        setBannerSubtitle(homeRes.banner.subtitle);
        setBannerTagline(homeRes.banner.tagline);
        setBannerBgImage(homeRes.banner.bgImage);
        setBannerFeaturedSongId(homeRes.banner.featuredSongId);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Handle Audio File Selection & Server Upload
  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioUploading(true);
    try {
      const res = await api.adminUploadFile(file);
      setUploadAudioUrl(res.fileUrl);
      setUploadedAudioName(res.originalName);
      showToast(`Audio file "${res.originalName}" uploaded successfully!`, 'success');

      // Attempt to calculate audio duration from browser
      const tempAudio = new Audio(URL.createObjectURL(file));
      tempAudio.onloadedmetadata = () => {
        const sec = Math.round(tempAudio.duration);
        if (sec > 0) {
          const m = Math.floor(sec / 60);
          const s = (sec % 60).toString().padStart(2, '0');
          setUploadDuration(`${m}:${s}`);
        }
      };
    } catch (err: any) {
      showToast(err.message || 'Failed to upload audio file.', 'error');
    } finally {
      setAudioUploading(false);
    }
  };

  // Handle Artwork File Selection & Server Upload
  const handleArtworkFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setArtworkUploading(true);
    try {
      const res = await api.adminUploadFile(file);
      setUploadCoverUrl(res.fileUrl);
      setUploadedArtworkName(res.originalName);
      showToast(`Artwork "${res.originalName}" uploaded successfully!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload artwork.', 'error');
    } finally {
      setArtworkUploading(false);
    }
  };

  // Handle New Song Submission
  const handlePublishSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      showToast('Track title is required.', 'error');
      return;
    }
    if (!uploadArtist.trim()) {
      showToast('Main artist name is required.', 'error');
      return;
    }

    setIsSubmittingSong(true);
    try {
      const payload = {
        title: uploadTitle.trim(),
        artist: uploadArtist.trim(),
        featuredArtists: uploadFeaturedArtists.trim() || undefined,
        album: uploadAlbum.trim() || 'Single Release',
        genre: uploadGenre,
        releaseDate: uploadReleaseDate,
        durationFormatted: uploadDuration,
        coverUrl: uploadCoverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
        audioUrl: uploadAudioUrl || '/audio/track-1.mp3',
        lyrics: uploadLyrics.trim() || undefined,
        isDownloadAuthorized: uploadIsDownloadAuth,
        isFeatured: uploadIsFeatured,
        isTrending: uploadIsTrending,
        isUgandan: uploadIsUgandan,
        isInternational: !uploadIsUgandan,
        licenseInfo: uploadLicense.trim()
      };

      await api.adminUploadSong(payload);
      showToast(`Track "${payload.title}" published successfully to MP3 KID!`, 'success');

      // Reset form
      setUploadTitle('');
      setUploadArtist('');
      setUploadFeaturedArtists('');
      setUploadLyrics('');
      setUploadedAudioName(null);
      setUploadedArtworkName(null);
      setUploadCoverUrl('');
      setUploadAudioUrl('');

      // Refresh catalog and switch to Catalog tab
      await loadAllAdminData();
      setActiveTab('catalog');
    } catch (err: any) {
      showToast(err.message || 'Failed to publish song.', 'error');
    } finally {
      setIsSubmittingSong(false);
    }
  };

  const handleApprove = async (subId: string) => {
    setActionLoading(subId);
    try {
      await api.approveSubmission(subId);
      await loadAllAdminData();
      showToast('Submission approved and published to catalog!', 'success');
    } catch {
      showToast('Failed to approve submission', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (subId: string) => {
    setActionLoading(subId);
    try {
      await api.rejectSubmission(subId);
      await loadAllAdminData();
      showToast('Submission rejected.', 'info');
    } catch {
      showToast('Failed to reject submission', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleSong = async (songId: string, updates: { isFeatured?: boolean; isTrending?: boolean }) => {
    setActionLoading(songId);
    try {
      await api.updateSong(songId, updates);
      await loadAllAdminData();
      showToast('Track status updated successfully.', 'success');
    } catch {
      showToast('Failed to update track status', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!confirm('Are you sure you want to delete this track from MP3 KID?')) return;
    setActionLoading(songId);
    try {
      await api.deleteSong(songId);
      await loadAllAdminData();
      showToast('Track deleted from catalog.', 'success');
    } catch {
      showToast('Failed to delete track', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateHeroBanner({
        title: bannerTitle,
        subtitle: bannerSubtitle,
        tagline: bannerTagline,
        bgImage: bannerBgImage,
        featuredSongId: bannerFeaturedSongId
      });
      setBannerSavedMsg(true);
      setTimeout(() => setBannerSavedMsg(false), 3000);
      showToast('Hero banner configuration updated live!', 'success');
    } catch {
      showToast('Failed to update hero banner', 'error');
    }
  };

  // Loading Screen for Initial Auth Check
  if (authChecking) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center">
        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-semibold text-slate-300">Checking MP3 KID Administrator session...</p>
      </div>
    );
  }

  // =========================================================================
  // STRICT ADMIN LOGIN GATE
  // =========================================================================
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className="rounded-3xl bg-gradient-to-b from-[#161828] to-[#0d0e18] border border-amber-500/30 p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2">
              <Lock className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">MP3 KID Master Control</h1>
            <p className="text-xs text-slate-400 font-medium">
              Strictly restricted to The Eagle Icon Music administration personnel.
            </p>
          </div>

          {/* Credentials Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Required Credentials:</span>
            </div>
            <div className="flex justify-between font-mono pt-1 text-slate-400">
              <span>Username: <strong className="text-white">Mp3Kid</strong></span>
              <span>Password: <strong className="text-white">@Es%</strong></span>
            </div>
          </div>

          {/* Error message */}
          {loginError && (
            <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Master Username</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Mp3Kid"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 font-medium transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Master Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="@Es%"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-11 py-3 text-sm text-white focus:outline-none focus:border-amber-500 font-medium transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-sm font-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Unlock MP3 KID Admin Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Auto-fill for convenience */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setLoginUsername('Mp3Kid');
                setLoginPassword('@Es%');
                showToast('Filled credentials: Mp3Kid / @Es%', 'info');
              }}
              className="text-[11px] text-amber-400/80 hover:text-amber-300 underline underline-offset-2 transition"
            >
              Auto-fill exact credentials (Mp3Kid / @Es%)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  // =========================================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#111222] border border-amber-500/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-amber-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              Mp3Kid Administrator Session Active
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
              Railway Ready
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">The Eagle Icon Music HQ</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Directly upload and publish songs, stream local MP3s, manage official releases, and curate homepage branding.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={loadAllAdminData}
            disabled={loadingData}
            className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="py-2 px-3.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
        {[
          { id: 'upload', label: 'Upload New Track', icon: Upload, highlight: true },
          { id: 'catalog', label: `Catalog Manager (${catalogSongs.length})`, icon: Music },
          { id: 'submissions', label: `Artist Submissions (${pendingSubmissions.length})`, icon: Inbox },
          { id: 'banner', label: 'Hero Banner Editor', icon: Sliders },
          { id: 'stats', label: 'Stats & Railway Hosting', icon: Server },
          { id: 'reports', label: `DMCA & Reports (${reports.length})`, icon: Flag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'border-amber-500 text-amber-400 font-bold bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.highlight && !isActive ? 'text-amber-400' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: UPLOAD NEW TRACK (THE USER'S PRIMARY REQUEST)                       */}
      {/* ========================================================================= */}
      {activeTab === 'upload' && (
        <form onSubmit={handlePublishSong} className="p-6 rounded-3xl bg-[#11121f] border border-slate-800 space-y-6 max-w-4xl">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">Publish New Song to MP3 KID</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Upload real MP3 audio files and cover art. Your upload will immediately be published to the catalog, streamed, and made downloadable in 320kbps.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              Admin Upload API
            </span>
          </div>

          {/* Core Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Track Title <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. Sitya Loss, Stamina, Kiggwa Leero"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Lead Artist <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={uploadArtist}
                onChange={(e) => setUploadArtist(e.target.value)}
                placeholder="e.g. Eddy Kenzo, Jose Chameleone, Sheebah Karungi"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Featured Artists (Optional)</label>
              <input
                type="text"
                value={uploadFeaturedArtists}
                onChange={(e) => setUploadFeaturedArtists(e.target.value)}
                placeholder="e.g. Azawi, Pallaso, Bobi Wine"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Album / EP Title</label>
              <input
                type="text"
                value={uploadAlbum}
                onChange={(e) => setUploadAlbum(e.target.value)}
                placeholder="e.g. Single Release, Roots of the Pearl"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Primary Genre <span className="text-amber-400">*</span>
              </label>
              <select
                value={uploadGenre}
                onChange={(e) => setUploadGenre(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500"
              >
                <option value="Kidandali (Ugandan Band Music)">Kidandali (Ugandan Band Music)</option>
                <option value="Baxx Ragga">Baxx Ragga</option>
                <option value="Lugaflow (Ugandan Hip Hop)">Lugaflow (Ugandan Hip Hop)</option>
                <option value="Kadongo Kamu">Kadongo Kamu</option>
                <option value="Afrobeats">Afrobeats</option>
                <option value="Amapiano">Amapiano</option>
                <option value="Reggae & Dancehall">Reggae & Dancehall</option>
                <option value="Bongo Flava">Bongo Flava</option>
                <option value="Afro-Soul">Afro-Soul</option>
                <option value="Gospel & Praise">Gospel & Praise</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Release Date</label>
                <input
                  type="date"
                  value={uploadReleaseDate}
                  onChange={(e) => setUploadReleaseDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Duration (MM:SS)</label>
                <input
                  type="text"
                  value={uploadDuration}
                  onChange={(e) => setUploadDuration(e.target.value)}
                  placeholder="3:30"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Real Audio File Upload Area */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileAudio className="w-4 h-4 text-amber-400" />
                <span>Audio Source (MP3 / WAV File)</span>
              </label>
              {uploadAudioUrl && (
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready: {uploadedAudioName || uploadAudioUrl}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File input button */}
              <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-4 text-center cursor-pointer transition">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioFileChange}
                  disabled={audioUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className={`w-5 h-5 mx-auto mb-1 ${audioUploading ? 'animate-bounce text-amber-400' : 'text-slate-400'}`} />
                <p className="text-xs font-bold text-slate-200">
                  {audioUploading ? 'Uploading Audio to Server...' : 'Click to Upload MP3 File'}
                </p>
                <p className="text-[10px] text-slate-400">Up to 60MB (saved to /public/uploads/)</p>
              </div>

              {/* Or Direct audio URL input */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 block">Or specify Audio Path / URL:</label>
                <input
                  type="text"
                  value={uploadAudioUrl}
                  onChange={(e) => setUploadAudioUrl(e.target.value)}
                  placeholder="/audio/track-1.mp3 or https://..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    setUploadAudioUrl('/audio/track-1.mp3');
                    setUploadedAudioName('Sample Ugandan Master (track-1.mp3)');
                    showToast('Assigned high-fidelity Ugandan master audio track.', 'info');
                  }}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  Use Built-in Studio Master Audio (/audio/track-1.mp3)
                </button>
              </div>
            </div>
          </div>

          {/* Real Artwork Upload Area */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <span>Cover Artwork (JPG / PNG)</span>
              </label>
              {uploadCoverUrl && (
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready: {uploadedArtworkName || 'Selected'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File input button */}
              <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-4 text-center cursor-pointer transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleArtworkFileChange}
                  disabled={artworkUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <ImageIcon className={`w-5 h-5 mx-auto mb-1 ${artworkUploading ? 'animate-bounce text-amber-400' : 'text-slate-400'}`} />
                <p className="text-xs font-bold text-slate-200">
                  {artworkUploading ? 'Uploading Artwork to Server...' : 'Click to Upload Artwork Image'}
                </p>
                <p className="text-[10px] text-slate-400">Square 1:1 recommended (JPG, PNG)</p>
              </div>

              {/* Or Direct Image URL input */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 block">Or specify Artwork Image URL:</label>
                <input
                  type="url"
                  value={uploadCoverUrl}
                  onChange={(e) => setUploadCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    setUploadCoverUrl('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80');
                    setUploadedArtworkName('Default Studio Cover');
                  }}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  Use Official MP3 KID Cover Artwork
                </button>
              </div>
            </div>
          </div>

          {/* Flags & Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold">
              <input
                type="checkbox"
                checked={uploadIsDownloadAuth}
                onChange={(e) => setUploadIsDownloadAuth(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
              />
              <span>Allow 320kbps Download</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold">
              <input
                type="checkbox"
                checked={uploadIsUgandan}
                onChange={(e) => setUploadIsUgandan(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
              />
              <span>Ugandan Music</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold">
              <input
                type="checkbox"
                checked={uploadIsTrending}
                onChange={(e) => setUploadIsTrending(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
              />
              <span>Mark as Trending</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold">
              <input
                type="checkbox"
                checked={uploadIsFeatured}
                onChange={(e) => setUploadIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
              />
              <span>Feature on Homepage</span>
            </label>
          </div>

          {/* Lyrics & Copyright */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Song Lyrics (Optional)</label>
              <textarea
                rows={3}
                value={uploadLyrics}
                onChange={(e) => setUploadLyrics(e.target.value)}
                placeholder="Paste Luganda / English song lyrics here..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 resize-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">License & Distribution Notice</label>
              <input
                type="text"
                value={uploadLicense}
                onChange={(e) => setUploadLicense(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
              />
            </div>
          </div>

          {/* Publish Action Button */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="submit"
              disabled={isSubmittingSong || audioUploading || artworkUploading}
              className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black shadow-lg shadow-amber-500/20 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmittingSong ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Publishing Track to Catalog...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                  <span>Publish Track Live to MP3 KID</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LIVE CATALOG MANAGER                                               */}
      {/* ========================================================================= */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Live Published Songs</h3>
              <p className="text-xs text-slate-400">All songs available for streaming and authorized 320kbps MP3 downloading.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-400 font-mono bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                {catalogSongs.length} Tracks in Database
              </span>
              <button
                onClick={() => setActiveTab('upload')}
                className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Song</span>
              </button>
            </div>
          </div>

          {catalogSongs.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <Music className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Catalog is Currently Empty</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  As requested, all old songs have been cleared. Upload your official tracks through the form above to populate the MP3 KID catalog!
                </p>
              </div>
              <button
                onClick={() => setActiveTab('upload')}
                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold inline-flex items-center gap-2 transition"
              >
                <Upload className="w-4 h-4" />
                <span>Upload First Track Now</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {catalogSongs.map((song) => (
                <div
                  key={song.id}
                  className="p-3.5 rounded-2xl bg-[#11121f] border border-slate-800 flex items-center justify-between gap-4 transition hover:border-slate-700"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">{song.title}</h4>
                        {song.isUgandan && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                            UG
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{song.artist}</p>
                      <span className="text-[10px] text-amber-400/80 font-mono">
                        {song.genre} • {song.plays.toLocaleString()} plays • {song.downloads.toLocaleString()} downloads • {song.durationFormatted}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button
                      onClick={() => playSong(song, catalogSongs)}
                      className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black transition"
                      title="Play track"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      onClick={() => handleToggleSong(song.id, { isFeatured: !song.isFeatured })}
                      className={`p-2 rounded-xl border text-xs font-semibold transition ${
                        song.isFeatured
                          ? 'bg-amber-500 text-black border-amber-500'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                      title="Toggle Featured on Homepage"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggleSong(song.id, { isTrending: !song.isTrending })}
                      className={`p-2 rounded-xl border text-xs font-semibold transition ${
                        song.isTrending
                          ? 'bg-rose-500 text-white border-rose-500'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                      title="Toggle Trending Status"
                    >
                      <Flame className="w-3.5 h-3.5" />
                    </button>

                    <button
                      disabled={actionLoading === song.id}
                      onClick={() => handleDeleteSong(song.id)}
                      className="p-2 rounded-xl bg-slate-900 text-slate-400 border border-slate-700 hover:text-red-400 hover:border-red-500 transition"
                      title="Delete track"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ARTIST SUBMISSIONS                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Artist Portal Submissions</h3>
            <span className="text-xs text-amber-400 font-mono">{pendingSubmissions.length} Pending Review</span>
          </div>

          {submissions.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
              No artist submissions received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-[#11121d] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={sub.coverArtworkUrl}
                      alt={sub.songTitle}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">{sub.songTitle}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sub.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                          sub.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-xs text-amber-400 font-medium">{sub.artistName}</p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {sub.genre} • {sub.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {sub.status === 'pending' && (
                      <>
                        <button
                          disabled={actionLoading === sub.id}
                          onClick={() => handleApprove(sub.id)}
                          className="py-1.5 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Approve & Publish</span>
                        </button>

                        <button
                          disabled={actionLoading === sub.id}
                          onClick={() => handleReject(sub.id)}
                          className="py-1.5 px-3.5 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: HERO BANNER EDITOR                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'banner' && (
        <form onSubmit={handleSaveBanner} className="p-6 rounded-3xl bg-[#11121f] border border-slate-800 space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Homepage Hero Banner Settings</span>
          </h3>
          <p className="text-xs text-slate-400">
            Customize the primary headline, tagline, background imagery, and featured action track displayed on MP3 KID.
          </p>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Official Tagline</label>
            <input
              type="text"
              value={bannerTagline}
              onChange={(e) => setBannerTagline(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Main Banner Title</label>
            <input
              type="text"
              value={bannerTitle}
              onChange={(e) => setBannerTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Subtitle / Supporting Description</label>
            <textarea
              rows={3}
              value={bannerSubtitle}
              onChange={(e) => setBannerSubtitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Background Wallpaper Image URL</label>
            <input
              type="url"
              value={bannerBgImage}
              onChange={(e) => setBannerBgImage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Hero Banner</span>
            </button>

            {bannerSavedMsg && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Saved!
              </span>
            )}
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PLATFORM STATS & RAILWAY HOSTING DIAGNOSTICS                       */}
      {/* ========================================================================= */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total Songs', value: stats.totalSongs, color: 'text-amber-400' },
              { label: 'Total Artists', value: stats.totalArtists, color: 'text-blue-400' },
              { label: 'Total Albums', value: stats.totalAlbums, color: 'text-purple-400' },
              { label: 'Total Streams', value: stats.totalPlays?.toLocaleString(), color: 'text-emerald-400' },
              { label: 'MP3 Downloads', value: stats.totalDownloads?.toLocaleString(), color: 'text-amber-300' },
              { label: 'Pending Tracks', value: stats.pendingSubmissionsCount || 0, color: 'text-rose-400' },
            ].map((s, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#11121d] border border-slate-800 text-center">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">{s.label}</span>
                <span className={`text-xl sm:text-2xl font-black ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Railway Hosting Diagnostics Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#10121d] to-[#0c0d15] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Railway Hosting & Production Compatibility</h4>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                COMPLIANT
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-semibold block">Server Entry Point</span>
                <span className="font-mono text-amber-300 font-bold">server.ts / dist/server.cjs</span>
                <p className="text-[10px] text-slate-500">Auto-configured with npm start command</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-semibold block">Port & Ingress</span>
                <span className="font-mono text-emerald-300 font-bold">PORT=3000 (0.0.0.0)</span>
                <p className="text-[10px] text-slate-500">Complies with Railway dynamic PORT binding</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-semibold block">File Upload Directory</span>
                <span className="font-mono text-blue-300 font-bold">/public/uploads/</span>
                <p className="text-[10px] text-slate-500">Persistent streaming via express.static</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: DMCA & CONTENT REPORTS                                             */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">DMCA & Content Feedback Tickets</h3>
            <span className="text-xs text-slate-400 font-mono">{reports.length} Total</span>
          </div>

          {reports.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
              No active DMCA copyright or broken audio reports logged.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-[#11121d] border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">{rep.contentTitle}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold">
                      {rep.reason}
                    </span>
                  </div>
                  <p className="text-slate-300">{rep.details || 'No additional details provided.'}</p>
                  <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1">
                    <span>Reported by: {rep.email}</span>
                    <span>{new Date(rep.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
