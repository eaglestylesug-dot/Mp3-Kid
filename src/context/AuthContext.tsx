import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isArtist: boolean;
  isAuthenticated: boolean;
  login: (email: string, role?: 'admin' | 'artist' | 'user') => void;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  toggleFollowArtist: (artistId: string) => void;
  isFollowingArtist: (artistId: string) => boolean;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('mp3kid_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Verify stored admin token on initial load
  useEffect(() => {
    const checkToken = async () => {
      const token = api.getAdminToken();
      if (token) {
        try {
          const res = await api.verifyAdmin();
          if (res.authenticated) {
            setUser((prev) => {
              if (prev && prev.role === 'admin') return prev;
              return {
                id: 'admin-mp3kid',
                name: 'Mp3Kid Admin',
                email: 'mpkidmanagement@gmail.com',
                role: 'admin',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
                bio: 'Platform Administrator & Content Manager at The Eagle Icon Music.',
                joinedDate: '2024-01-01',
                favorites: [],
                favoriteArtists: [],
                favoriteAlbums: [],
                playlists: [],
                downloadHistory: [],
                recentlyPlayed: []
              };
            });
          } else {
            api.setAdminToken(null);
            if (user?.role === 'admin') {
              setUser(null);
            }
          }
        } catch {
          api.setAdminToken(null);
        }
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('mp3kid_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('mp3kid_current_user');
      }
    } catch {
      // Ignore
    }
  }, [user]);

  const login = (email: string, role?: 'admin' | 'artist' | 'user') => {
    const determinedRole: 'admin' | 'artist' | 'user' = 
      role || (email.toLowerCase().includes('admin') ? 'admin' : (email.toLowerCase().includes('artist') ? 'artist' : 'user'));

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim(),
      email,
      role: determinedRole,
      avatar: determinedRole === 'admin' 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80'
        : (determinedRole === 'artist' 
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' 
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'),
      bio: `${determinedRole === 'admin' ? 'Eagle Icon Platform Administrator' : (determinedRole === 'artist' ? 'Verified African Music Creator' : 'Proud Music Discovery Listener')}`,
      joinedDate: new Date().toISOString().split('T')[0],
      favorites: [],
      favoriteArtists: [],
      favoriteAlbums: [],
      playlists: [],
      downloadHistory: [],
      recentlyPlayed: []
    };

    setUser(newUser);
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await api.adminLogin(username, password);
      if (res.success && res.token) {
        const adminUser: User = {
          id: 'admin-mp3kid',
          name: 'Mp3Kid Admin',
          email: 'mpkidmanagement@gmail.com',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
          bio: 'Master Platform Administrator & Chief Content Curator at The Eagle Icon Music.',
          joinedDate: new Date().toISOString().split('T')[0],
          favorites: [],
          favoriteArtists: [],
          favoriteAlbums: [],
          playlists: [],
          downloadHistory: [],
          recentlyPlayed: []
        };
        setUser(adminUser);
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    api.adminLogout();
    setUser(null);
  };

  const toggleFavorite = (songId: string) => {
    if (!user) return;
    const exists = user.favorites.includes(songId);
    const newFavorites = exists 
      ? user.favorites.filter(id => id !== songId)
      : [...user.favorites, songId];

    setUser({ ...user, favorites: newFavorites });
  };

  const isFavorite = (songId: string) => {
    return Boolean(user?.favorites.includes(songId));
  };

  const toggleFollowArtist = (artistId: string) => {
    if (!user) return;
    const exists = user.favoriteArtists.includes(artistId);
    const newFollowing = exists 
      ? user.favoriteArtists.filter(id => id !== artistId)
      : [...user.favoriteArtists, artistId];

    setUser({ ...user, favoriteArtists: newFollowing });
  };

  const isFollowingArtist = (artistId: string) => {
    return Boolean(user?.favoriteArtists.includes(artistId));
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin' && Boolean(api.getAdminToken()),
        isArtist: user?.role === 'artist' || user?.role === 'admin',
        isAuthenticated: Boolean(user),
        login,
        adminLogin,
        logout,
        toggleFavorite,
        isFavorite,
        toggleFollowArtist,
        isFollowingArtist,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
