/**
 * Jamendo API Service Integration Layer
 * 
 * Prepares MP3 KID for future Jamendo catalog streaming & authorized downloads
 * utilizing JAMENDO_CLIENT_ID.
 * 
 * Rules:
 * 1. Clearly mark external items with `source: 'jamendo'` and `isExternalCatalog: true`.
 * 2. Only allow downloading when `audiodownload_allowed === true` according to Jamendo terms.
 * 3. Fall back gracefully when JAMENDO_CLIENT_ID is not set or API is unreachable.
 */

import { Song } from '../src/types';

export class JamendoService {
  private clientId: string;
  private baseUrl: string = 'https://api.jamendo.com/v3.0';

  constructor() {
    this.clientId = process.env.JAMENDO_CLIENT_ID || '';
  }

  public getStatus() {
    const isConfigured = Boolean(this.clientId && this.clientId.trim().length > 0);
    return {
      isConfigured,
      clientIdMasked: isConfigured ? `${this.clientId.substring(0, 4)}••••${this.clientId.slice(-3)}` : 'Not Configured',
      statusMessage: isConfigured 
        ? 'Jamendo API client configured. Ready to stream Creative Commons & authorized music.'
        : 'JAMENDO_CLIENT_ID environment variable is empty. Running in standalone authorized catalog mode.',
      apiEndpoint: this.baseUrl,
      downloadPolicy: 'Authorized CC downloads only when audiodownload_allowed === true',
      lastChecked: new Date().toISOString()
    };
  }

  /**
   * Search Jamendo catalog if clientId is provided
   */
  public async searchTracks(query: string, limit: number = 20): Promise<Song[]> {
    if (!this.clientId) {
      return [];
    }

    try {
      const url = `${this.baseUrl}/tracks/?client_id=${encodeURIComponent(this.clientId)}&format=json&limit=${limit}&search=${encodeURIComponent(query)}&include=musicinfo+licenses`;
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Jamendo API returned HTTP ${response.status}`);
        return [];
      }

      const data = await response.json();
      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }

      return data.results.map((item: any): Song => {
        const canDownload = Boolean(item.audiodownload_allowed);
        return {
          id: `jamendo_${item.id}`,
          title: item.name || 'Untitled Track',
          artist: item.artist_name || 'Jamendo Artist',
          artistId: `jamendo_artist_${item.artist_id || 'ext'}`,
          genre: item.musicinfo?.tags?.genres?.[0] || 'Global Indie',
          releaseDate: item.releasedate || new Date().toISOString().split('T')[0],
          duration: item.duration || 180,
          durationFormatted: this.formatDuration(item.duration || 180),
          coverUrl: item.album_image || item.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
          audioUrl: item.audio || '',
          plays: item.stats?.rate_listened_total || 1200,
          downloads: canDownload ? (item.stats?.rate_downloaded_total || 340) : 0,
          lyrics: '',
          isDownloadAuthorized: canDownload,
          downloadQualities: canDownload ? [
            { quality: '320kbps', format: 'MP3', fileSize: '7.8 MB', bitrate: 320 },
            { quality: '128kbps', format: 'MP3', fileSize: '3.1 MB', bitrate: 128 }
          ] : [],
          isInternational: true,
          licenseInfo: item.license_ccurl || 'Jamendo Creative Commons / Authorized Licensing',
          source: 'jamendo',
          audioToneType: 'pop'
        };
      });
    } catch (err) {
      console.error('Error contacting Jamendo API:', err);
      return [];
    }
  }

  private formatDuration(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}

export const jamendoService = new JamendoService();
