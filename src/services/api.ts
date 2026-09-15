import { Song, Artist, Album, Genre, Playlist, Comment, ArtistSubmission, AdminStats, ContentReport } from '../types';

export const api = {
  // Home
  async getHomeFeed() {
    const res = await fetch('/api/home');
    if (!res.ok) throw new Error('Failed to fetch home feed');
    return res.json();
  },

  // Songs
  async getSongs(params?: { search?: string; genre?: string; region?: string; sort?: string; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.genre) query.set('genre', params.genre);
    if (params?.region) query.set('region', params.region);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.limit) query.set('limit', String(params.limit));

    const res = await fetch(`/api/songs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch songs');
    return res.json();
  },

  async getSong(id: string) {
    const res = await fetch(`/api/songs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch song');
    return res.json();
  },

  async recordPlay(id: string) {
    try {
      const res = await fetch(`/api/songs/${id}/play`, { method: 'POST' });
      return res.json();
    } catch {
      return { success: false };
    }
  },

  // Authorized Download
  getDownloadUrl(songId: string, quality: string = '320kbps') {
    return `/api/download/${songId}?quality=${encodeURIComponent(quality)}`;
  },

  async requestDownloadAuthorization(songId: string, quality: string = '320kbps') {
    const res = await fetch(`/api/download/${songId}?quality=${encodeURIComponent(quality)}`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Download authorization check failed' }));
      throw new Error(err.message || 'Download not authorized');
    }
    return res.json();
  },

  // Artists
  async getArtists(params?: { search?: string; region?: string; verified?: boolean }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.region) query.set('region', params.region);
    if (params?.verified) query.set('verified', 'true');

    const res = await fetch(`/api/artists?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch artists');
    return res.json();
  },

  async getArtist(id: string) {
    const res = await fetch(`/api/artists/${id}`);
    if (!res.ok) throw new Error('Failed to fetch artist');
    return res.json();
  },

  async followArtist(id: string, action: 'follow' | 'unfollow') {
    const res = await fetch(`/api/artists/${id}/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    return res.json();
  },

  // Albums
  async getAlbums() {
    const res = await fetch('/api/albums');
    return res.json();
  },

  async getAlbum(id: string) {
    const res = await fetch(`/api/albums/${id}`);
    return res.json();
  },

  // Genres
  async getGenres() {
    const res = await fetch('/api/genres');
    return res.json();
  },

  async getGenre(slug: string) {
    const res = await fetch(`/api/genres/${slug}`);
    return res.json();
  },

  // Playlists
  async getPlaylists() {
    const res = await fetch('/api/playlists');
    return res.json();
  },

  async getPlaylist(id: string) {
    const res = await fetch(`/api/playlists/${id}`);
    return res.json();
  },

  async createPlaylist(title: string, description: string, isPublic: boolean = true) {
    const res = await fetch('/api/playlists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, isPublic })
    });
    return res.json();
  },

  async addSongToPlaylist(playlistId: string, songId: string) {
    const res = await fetch(`/api/playlists/${playlistId}/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId })
    });
    return res.json();
  },

  // Comments
  async getComments(songId: string) {
    const res = await fetch(`/api/comments?songId=${encodeURIComponent(songId)}`);
    return res.json();
  },

  async addComment(songId: string, text: string, userName?: string, userAvatar?: string) {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId, text, userName, userAvatar })
    });
    return res.json();
  },

  async likeComment(commentId: string) {
    const res = await fetch(`/api/comments/${commentId}/like`, { method: 'POST' });
    return res.json();
  },

  async replyComment(commentId: string, text: string, userName?: string) {
    const res = await fetch(`/api/comments/${commentId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, userName })
    });
    return res.json();
  },

  // Content Reporting
  async reportContent(data: {
    contentType: 'song' | 'artist' | 'album' | 'comment';
    contentId: string;
    contentTitle: string;
    reason: string;
    details: string;
  }) {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Artist Portal Submissions
  async submitTrack(data: Partial<ArtistSubmission>) {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Admin
  async getAdminStats() {
    const res = await fetch('/api/admin/stats');
    return res.json();
  },

  async getAdminSubmissions() {
    const res = await fetch('/api/submissions');
    return res.json();
  },

  // Admin Token Management
  getAdminToken(): string | null {
    try {
      return localStorage.getItem('mp3kid_admin_token');
    } catch {
      return null;
    }
  },

  setAdminToken(token: string | null) {
    try {
      if (token) {
        localStorage.setItem('mp3kid_admin_token', token);
      } else {
        localStorage.removeItem('mp3kid_admin_token');
      }
    } catch {
      // ignore
    }
  },

  getAdminHeaders(): Record<string, string> {
    const token = this.getAdminToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['x-admin-token'] = token;
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Admin Authentication
  async adminLogin(username: string, password: string) {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Admin authentication failed');
    }
    if (data.token) {
      this.setAdminToken(data.token);
    }
    return data;
  },

  async adminLogout() {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: this.getAdminHeaders()
      });
    } catch {
      // ignore
    } finally {
      this.setAdminToken(null);
    }
  },

  async verifyAdmin() {
    const token = this.getAdminToken();
    if (!token) return { authenticated: false };
    try {
      const res = await fetch('/api/admin/verify', {
        headers: this.getAdminHeaders()
      });
      if (!res.ok) return { authenticated: false };
      return res.json();
    } catch {
      return { authenticated: false };
    }
  },

  // Admin File Upload (MP3, WAV, JPG, PNG)
  async adminUploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.getAdminToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['x-admin-token'] = token;
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/admin/upload-file', {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'File upload failed');
    }
    return data;
  },

  // Direct Admin Song Upload & Publish
  async adminUploadSong(songData: {
    title: string;
    artist: string;
    featuredArtists?: string;
    album?: string;
    genre: string;
    releaseDate?: string;
    durationFormatted?: string;
    coverUrl?: string;
    audioUrl?: string;
    lyrics?: string;
    isDownloadAuthorized?: boolean;
    isFeatured?: boolean;
    isTrending?: boolean;
    isUgandan?: boolean;
    isInternational?: boolean;
    bpm?: number;
    mood?: string;
    licenseInfo?: string;
  }) {
    const res = await fetch('/api/admin/songs', {
      method: 'POST',
      headers: this.getAdminHeaders(),
      body: JSON.stringify(songData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Failed to upload song');
    }
    return data;
  },

  async getAdminReports() {
    const res = await fetch('/api/admin/reports', {
      headers: this.getAdminHeaders()
    });
    return res.json();
  },

  async reviewSubmission(id: string, status: 'approved' | 'rejected', reviewNotes?: string) {
    const res = await fetch(`/api/submissions/${id}/review`, {
      method: 'PATCH',
      headers: this.getAdminHeaders(),
      body: JSON.stringify({ status, reviewNotes })
    });
    return res.json();
  },

  async approveSubmission(id: string) {
    return this.reviewSubmission(id, 'approved');
  },

  async rejectSubmission(id: string) {
    return this.reviewSubmission(id, 'rejected');
  },

  async updateSongFlags(id: string, flags: { isTrending?: boolean; isFeatured?: boolean; isDownloadAuthorized?: boolean }) {
    const res = await fetch(`/api/admin/songs/${id}`, {
      method: 'PATCH',
      headers: this.getAdminHeaders(),
      body: JSON.stringify(flags)
    });
    return res.json();
  },

  async updateSong(id: string, updates: any) {
    return this.updateSongFlags(id, updates);
  },

  async deleteSong(id: string) {
    const res = await fetch(`/api/admin/songs/${id}`, {
      method: 'DELETE',
      headers: this.getAdminHeaders()
    });
    return res.json();
  },

  async updateBanner(banner: any) {
    const res = await fetch('/api/admin/banner', {
      method: 'POST',
      headers: this.getAdminHeaders(),
      body: JSON.stringify(banner)
    });
    return res.json();
  },

  async updateHeroBanner(banner: any) {
    return this.updateBanner(banner);
  },

  // Jamendo Status & Search
  async getJamendoStatus() {
    const res = await fetch('/api/jamendo/status');
    return res.json();
  },

  async searchJamendo(query: string) {
    const res = await fetch(`/api/jamendo/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },

  // Global Search
  async searchAll(query: string) {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },

  // Auth
  async login(email: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  }
};
