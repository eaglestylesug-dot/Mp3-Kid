export interface AudioQualityOption {
  quality: '320kbps' | '256kbps' | '128kbps';
  format: 'MP3';
  fileSize: string;
  bitrate: number;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  featuredArtists?: string[];
  album?: string;
  albumId?: string;
  genre: string;
  releaseDate: string;
  duration: number; // in seconds
  durationFormatted: string;
  coverUrl: string;
  audioUrl: string;
  plays: number;
  downloads: number;
  lyrics?: string;
  isDownloadAuthorized: boolean;
  downloadQualities: AudioQualityOption[];
  isTrending?: boolean;
  isFeatured?: boolean;
  isUgandan?: boolean;
  isInternational?: boolean;
  explicit?: boolean;
  bpm?: number;
  key?: string;
  mood?: string;
  licenseInfo: string;
  audioToneType?: 'afrobeat' | 'baxx_ragga' | 'lugaflow' | 'amapiano' | 'rnb' | 'acoustic' | 'pop' | 'kidandali' | 'reggae';
  source?: 'local_authorized' | 'jamendo' | 'artist_submission';
}

export interface Artist {
  id: string;
  name: string;
  stageName?: string;
  isVerified: boolean;
  country: string;
  region: 'Uganda' | 'Africa' | 'Global';
  profileImage: string;
  coverImage: string;
  bio: string;
  genres: string[];
  totalPlays: number;
  totalDownloads: number;
  monthlyListeners: number;
  followersCount: number;
  isFeatured?: boolean;
  popularRank?: number;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  releaseYear: number;
  coverUrl: string;
  genre: string;
  songIds: string[];
  description: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  songCount: number;
  isUgandan: boolean;
  colorAccent: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  creator: {
    id: string;
    name: string;
    role: 'admin' | 'curator' | 'user';
  };
  isPublic: boolean;
  songIds: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  songId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  status: 'published' | 'hidden' | 'flagged';
  replies?: CommentReply[];
}

export interface CommentReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface ArtistSubmission {
  id: string;
  songTitle: string;
  artistName: string;
  featuredArtists?: string;
  email: string;
  phone?: string;
  albumTitle?: string;
  genre: string;
  releaseDate: string;
  description: string;
  lyrics?: string;
  downloadPermission: boolean;
  explicitContent: boolean;
  coverArtworkUrl: string;
  audioFileName: string;
  audioDurationSeconds: number;
  audioToneType: 'afrobeat' | 'baxx_ragga' | 'lugaflow' | 'amapiano' | 'rnb' | 'acoustic' | 'pop';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewNotes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'artist' | 'user';
  avatar: string;
  bio?: string;
  joinedDate: string;
  favorites: string[]; // songIds
  favoriteArtists: string[]; // artistIds
  favoriteAlbums: string[]; // albumIds
  playlists: string[]; // playlistIds
  downloadHistory: {
    songId: string;
    downloadedAt: string;
    quality: string;
  }[];
  recentlyPlayed: {
    songId: string;
    playedAt: string;
  }[];
}

export interface AdminStats {
  totalPlays: number;
  totalDownloads: number;
  totalSongs: number;
  totalArtists: number;
  totalUsers: number;
  pendingSubmissionsCount: number;
  monthlyGrowthRate: number;
  recentDailyStats: {
    date: string;
    plays: number;
    downloads: number;
    visitors: number;
  }[];
  genreDistribution: {
    genre: string;
    count: number;
  }[];
}

export interface ContentReport {
  id: string;
  contentType: 'song' | 'artist' | 'album' | 'comment';
  contentId: string;
  contentTitle: string;
  reportedBy: string;
  reason: 'copyright' | 'incorrect_metadata' | 'explicit' | 'poor_audio' | 'other';
  details: string;
  timestamp: string;
  status: 'open' | 'reviewed' | 'resolved';
}

export interface JamendoConfig {
  clientId: string;
  isConfigured: boolean;
  apiEndpoint: string;
  statusMessage: string;
  lastChecked?: string;
}

export interface HeroBanner {
  title: string;
  subtitle: string;
  tagline: string;
  bgImage: string;
  featuredSongId: string;
}

export interface JamendoTrack {
  id: string;
  name: string;
  duration: number;
  artist_id: string;
  artist_name: string;
  album_name?: string;
  album_id?: string;
  license_ccurl: string;
  position?: number;
  releasedate?: string;
  album_image?: string;
  image: string;
  audio: string;
  audiodownload?: string;
  prourl?: string;
  shorturl?: string;
  shareurl?: string;
}
