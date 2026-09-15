import { Song, Artist, Album, Genre, Playlist, Comment, ArtistSubmission, AdminStats, ContentReport, User } from '../src/types';

export interface DatabaseState {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  genres: Genre[];
  playlists: Playlist[];
  comments: Comment[];
  submissions: ArtistSubmission[];
  reports: ContentReport[];
  users: User[];
  stats: AdminStats;
  heroBanner: {
    title: string;
    subtitle: string;
    tagline: string;
    bgImage: string;
    featuredSongId: string;
    ctaUrl: string;
  };
}

// User requested: Clean empty catalog until uploaded via Admin Panel
export const initialSongs: Song[] = [];

export const initialArtists: Artist[] = [
  {
    id: 'artist-kenzo',
    name: 'Eddy Kenzo',
    stageName: 'Eddy Kenzo (Edrisah Musuuza)',
    isVerified: true,
    country: 'Uganda',
    region: 'Uganda',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80',
    bio: 'Grammy-nominated Ugandan music powerhouse, BET Award winner, and founder of Big Talent Entertainment.',
    genres: ['Baxx Ragga', 'Afro-Pop', 'Kidandali'],
    totalPlays: 0,
    totalDownloads: 0,
    monthlyListeners: 0,
    followersCount: 0,
    isFeatured: true,
    popularRank: 1
  },
  {
    id: 'artist-chameleone',
    name: 'Jose Chameleone',
    stageName: 'Dr. Jose Chameleone',
    isVerified: true,
    country: 'Uganda',
    region: 'Uganda',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1600&q=80',
    bio: 'Living legend of East African music and founder of Leone Island Music Empire.',
    genres: ['Kidandali', 'Bongo Fusion', 'Afropop'],
    totalPlays: 0,
    totalDownloads: 0,
    monthlyListeners: 0,
    followersCount: 0,
    isFeatured: true,
    popularRank: 2
  },
  {
    id: 'artist-bobi',
    name: 'Bobi Wine',
    stageName: 'Bobi Wine (Ghetto President)',
    isVerified: true,
    country: 'Uganda',
    region: 'Uganda',
    profileImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&q=80',
    bio: 'Iconic Ugandan musician and leader of Firebase Crew, acclaimed for conscious reggae and street pop.',
    genres: ['Afro-Pop', 'Kidandali', 'Reggae & Dancehall'],
    totalPlays: 0,
    totalDownloads: 0,
    monthlyListeners: 0,
    followersCount: 0,
    isFeatured: true,
    popularRank: 3
  },
  {
    id: 'artist-sheebah',
    name: 'Sheebah Karungi',
    stageName: 'Queen Karma Sheebah',
    isVerified: true,
    country: 'Uganda',
    region: 'Uganda',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&q=80',
    bio: 'Ugandan singer, dancer, and feminist icon. Multiple AFRIMA winner with an electrifying dancehall catalog.',
    genres: ['Kidandali', 'Dancehall', 'Afro-Pop'],
    totalPlays: 0,
    totalDownloads: 0,
    monthlyListeners: 0,
    followersCount: 0,
    isFeatured: true,
    popularRank: 4
  },
  {
    id: 'artist-azawi',
    name: 'Azawi',
    stageName: 'Azawi (Zawedde Priscilla)',
    isVerified: true,
    country: 'Uganda',
    region: 'Uganda',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&q=80',
    bio: 'Multi-talented singer-songwriter signed to Swangz Avenue. Master of contemporary Afro-Soul.',
    genres: ['Afro-Soul', 'Afrobeats', 'Reggae & Dancehall'],
    totalPlays: 0,
    totalDownloads: 0,
    monthlyListeners: 0,
    followersCount: 0,
    isFeatured: true,
    popularRank: 5
  }
];

export const initialAlbums: Album[] = [];

export const initialGenres: Genre[] = [
  {
    id: 'genre-ug-kidandali',
    name: 'Kidandali (Ugandan Band Music)',
    slug: 'kidandali',
    description: 'The heartbeat of Ugandan dance music, fusing synthesized brass, punchy kick-drums, and celebratory Luganda melodies.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    songCount: 0,
    isUgandan: true,
    colorAccent: '#F59E0B'
  },
  {
    id: 'genre-ug-baxx-ragga',
    name: 'Baxx Ragga',
    slug: 'baxx-ragga',
    description: 'A distinctly Ugandan genre fusing Jamaican dancehall basslines with traditional Bakisimba polyrhythmic percussion.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
    songCount: 0,
    isUgandan: true,
    colorAccent: '#10B981'
  },
  {
    id: 'genre-ug-lugaflow',
    name: 'Lugaflow (Ugandan Hip Hop)',
    slug: 'lugaflow',
    description: 'Rapid-fire Luganda rap, street philosophy, clever wordplay, and hard-hitting boom bap and trap drums.',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
    songCount: 0,
    isUgandan: true,
    colorAccent: '#EF4444'
  },
  {
    id: 'genre-ug-kadongo-kamu',
    name: 'Kadongo Kamu',
    slug: 'kadongo-kamu',
    description: 'Uganda\'s classical one-guitar storytelling tradition preserving oral history, morality, and deep philosophical proverbs.',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
    songCount: 0,
    isUgandan: true,
    colorAccent: '#D97706'
  },
  {
    id: 'genre-afrobeats',
    name: 'Afrobeats',
    slug: 'afrobeats',
    description: 'West African global juggernaut driven by infectious syncopated rhythms, brass flourishes, and catchy hooks.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    songCount: 0,
    isUgandan: false,
    colorAccent: '#EC4899'
  },
  {
    id: 'genre-amapiano',
    name: 'Amapiano',
    slug: 'amapiano',
    description: 'South African electronic sensation characterized by deep log-drum bass, soulful jazz keys, and hypnotic tempos.',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80',
    songCount: 0,
    isUgandan: false,
    colorAccent: '#8B5CF6'
  },
  {
    id: 'genre-reggae-dancehall',
    name: 'Reggae & Dancehall',
    slug: 'reggae-dancehall',
    description: 'Island roots rhythms, conscious lyrics, heavy dub echoes, and high-energy Caribbean sound system music.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    songCount: 0,
    isUgandan: false,
    colorAccent: '#06B6D4'
  },
  {
    id: 'genre-bongo-flava',
    name: 'Bongo Flava',
    slug: 'bongo-flava',
    description: 'The pride of Tanzania and the Swahili coast, blending R&B romanticism with East African Taarab melodies.',
    image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=600&q=80',
    songCount: 0,
    isUgandan: false,
    colorAccent: '#3B82F6'
  }
];

export const initialPlaylists: Playlist[] = [
  {
    id: 'playlist-official-picks',
    title: 'The Eagle Icon Curated Releases',
    description: 'Official verified releases uploaded directly via The Eagle Icon Music administration.',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    creator: { id: 'admin-1', name: 'The Eagle Icon Music', role: 'admin' },
    isPublic: true,
    songIds: [],
    createdAt: new Date().toISOString().split('T')[0]
  }
];

export const initialComments: Comment[] = [];

export const initialSubmissions: ArtistSubmission[] = [];

export const initialUsers: User[] = [
  {
    id: 'admin-mp3kid',
    name: 'Mp3Kid Admin',
    email: 'mpkidmanagement@gmail.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    bio: 'Platform Manager & Content Licensing Officer at The Eagle Icon Music.',
    joinedDate: new Date().toISOString().split('T')[0],
    favorites: [],
    favoriteArtists: [],
    favoriteAlbums: [],
    playlists: [],
    downloadHistory: [],
    recentlyPlayed: []
  }
];

export const initialStats: AdminStats = {
  totalPlays: 0,
  totalDownloads: 0,
  totalSongs: 0,
  totalArtists: initialArtists.length,
  totalUsers: 1,
  pendingSubmissionsCount: 0,
  monthlyGrowthRate: 0,
  recentDailyStats: [
    { date: 'Mon', plays: 0, downloads: 0, visitors: 0 },
    { date: 'Tue', plays: 0, downloads: 0, visitors: 0 },
    { date: 'Wed', plays: 0, downloads: 0, visitors: 0 },
    { date: 'Thu', plays: 0, downloads: 0, visitors: 0 },
    { date: 'Fri', plays: 0, downloads: 0, visitors: 0 },
    { date: 'Sat', plays: 0, downloads: 0, visitors: 0 },
    { date: 'Sun', plays: 0, downloads: 0, visitors: 0 }
  ],
  genreDistribution: []
};

// Singleton in-memory persistent database store
class Database {
  public data: DatabaseState = {
    songs: [...initialSongs],
    artists: [...initialArtists],
    albums: [...initialAlbums],
    genres: [...initialGenres],
    playlists: [...initialPlaylists],
    comments: [...initialComments],
    submissions: [...initialSubmissions],
    reports: [],
    users: [...initialUsers],
    stats: { ...initialStats },
    heroBanner: {
      title: 'Welcome to MP3 KID',
      subtitle: 'Streaming and 320kbps authorized direct downloads. Official releases managed through The Eagle Icon Music.',
      tagline: 'Proudly from The Eagle Icon Music',
      bgImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1800&q=80',
      featuredSongId: '',
      ctaUrl: '/music'
    }
  };

  public incrementPlay(songId: string): Song | undefined {
    const song = this.data.songs.find(s => s.id === songId);
    if (song) {
      song.plays += 1;
      this.data.stats.totalPlays += 1;
      const artist = this.data.artists.find(a => a.id === song.artistId);
      if (artist) {
        artist.totalPlays += 1;
      }
    }
    return song;
  }

  public incrementDownload(songId: string): Song | undefined {
    const song = this.data.songs.find(s => s.id === songId);
    if (song && song.isDownloadAuthorized) {
      song.downloads += 1;
      this.data.stats.totalDownloads += 1;
      const artist = this.data.artists.find(a => a.id === song.artistId);
      if (artist) {
        artist.totalDownloads += 1;
      }
    }
    return song;
  }
}

export const db = new Database();
