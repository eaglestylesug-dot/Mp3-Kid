import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Song, AudioQualityOption } from '../types';
import { audioEngine } from '../services/audioEngine';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface DownloadedTrack {
  song: Song;
  downloadedAt: string;
  quality: string;
  fileSize: string;
}

interface MusicPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Song[];
  queueIndex: number;
  shuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  isQueueOpen: boolean;
  isFullscreenOpen: boolean;
  isSleepTimerOpen: boolean;
  sleepTimerMinutes: number | null;
  sleepTimerRemaining: number | null;
  recentlyPlayed: Song[];
  downloadedTracks: DownloadedTrack[];
  downloadModalSong: Song | null;

  playSong: (song: Song, newQueue?: Song[]) => void;
  togglePlay: () => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  setIsQueueOpen: (open: boolean) => void;
  setIsFullscreenOpen: (open: boolean) => void;
  setIsSleepTimerOpen: (open: boolean) => void;
  setSleepTimer: (minutes: number | null) => void;
  openDownloadModal: (song: Song) => void;
  closeDownloadModal: () => void;
  executeDownload: (song: Song, qualityOption: AudioQualityOption) => Promise<void>;
  deleteDownload: (songId: string) => void;
  getFrequencyData: () => Uint8Array;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(210);
  const [volume, setVolumeState] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.85);

  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');

  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);

  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem('mp3kid_recently_played');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [downloadedTracks, setDownloadedTracks] = useState<DownloadedTrack[]>(() => {
    try {
      const saved = localStorage.getItem('mp3kid_downloads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [downloadModalSong, setDownloadModalSong] = useState<Song | null>(null);
  const timerRef = useRef<any>(null);

  // Sync recently played to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mp3kid_recently_played', JSON.stringify(recentlyPlayed.slice(0, 30)));
    } catch {
      // Ignore
    }
  }, [recentlyPlayed]);

  // Sync downloads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mp3kid_downloads', JSON.stringify(downloadedTracks));
    } catch {
      // Ignore
    }
  }, [downloadedTracks]);

  // Sleep Timer countdown handler
  useEffect(() => {
    if (sleepTimerRemaining !== null && sleepTimerRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSleepTimerRemaining(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timerRef.current);
            audioEngine.pause();
            setIsPlaying(false);
            setSleepTimerMinutes(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [sleepTimerRemaining]);

  const handleTrackEnded = useCallback(() => {
    if (repeatMode === 'one') {
      audioEngine.seek(0);
      audioEngine.play(setCurrentTime, handleTrackEnded);
      setIsPlaying(true);
      return;
    }

    if (queue.length > 0) {
      if (queueIndex < queue.length - 1) {
        const nextIdx = queueIndex + 1;
        setQueueIndex(nextIdx);
        const nextSong = queue[nextIdx];
        setCurrentSong(nextSong);
        setDuration(nextSong.duration || 210);
        audioEngine.loadSong(nextSong);
        audioEngine.play(setCurrentTime, handleTrackEnded);
        setIsPlaying(true);
      } else if (repeatMode === 'all') {
        setQueueIndex(0);
        const nextSong = queue[0];
        setCurrentSong(nextSong);
        setDuration(nextSong.duration || 210);
        audioEngine.loadSong(nextSong);
        audioEngine.play(setCurrentTime, handleTrackEnded);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(false);
    }
  }, [queue, queueIndex, repeatMode]);

  const playSong = useCallback((song: Song, newQueue?: Song[]) => {
    setCurrentSong(song);
    setDuration(song.duration || 210);
    setCurrentTime(0);

    // Update queue
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const foundIdx = newQueue.findIndex(s => s.id === song.id);
      setQueueIndex(foundIdx >= 0 ? foundIdx : 0);
    } else {
      setQueue(prev => {
        const existing = prev.findIndex(s => s.id === song.id);
        if (existing >= 0) {
          setQueueIndex(existing);
          return prev;
        }
        const updated = [song, ...prev];
        setQueueIndex(0);
        return updated;
      });
    }

    // Record play on server
    api.recordPlay(song.id);

    // Update Recently Played
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== song.id);
      return [song, ...filtered].slice(0, 30);
    });

    // Start audio engine
    audioEngine.loadSong(song);
    audioEngine.play(setCurrentTime, handleTrackEnded);
    setIsPlaying(true);
  }, [handleTrackEnded]);

  const togglePlay = useCallback(() => {
    if (!currentSong) return;
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.play(setCurrentTime, handleTrackEnded);
      setIsPlaying(true);
    }
  }, [currentSong, isPlaying, handleTrackEnded]);

  const pauseSong = useCallback(() => {
    audioEngine.pause();
    setIsPlaying(false);
  }, []);

  const resumeSong = useCallback(() => {
    if (currentSong) {
      audioEngine.play(setCurrentTime, handleTrackEnded);
      setIsPlaying(true);
    }
  }, [currentSong, handleTrackEnded]);

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;
    let nextIdx = queueIndex + 1;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      nextIdx = 0;
    }
    setQueueIndex(nextIdx);
    const nextSong = queue[nextIdx];
    playSong(nextSong, queue);
  }, [queue, queueIndex, shuffle, playSong]);

  const prevTrack = useCallback(() => {
    if (currentTime > 4) {
      audioEngine.seek(0);
      setCurrentTime(0);
      return;
    }
    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }
    setQueueIndex(prevIdx);
    const prevSong = queue[prevIdx];
    playSong(prevSong, queue);
  }, [currentTime, queue, queueIndex, playSong]);

  const seek = useCallback((seconds: number) => {
    audioEngine.seek(seconds);
    setCurrentTime(seconds);
  }, []);

  const setVolume = useCallback((val: number) => {
    setVolumeState(val);
    audioEngine.setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(prevVolume);
      setVolumeState(prevVolume);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      audioEngine.setVolume(0);
      setVolumeState(0);
    }
  }, [isMuted, prevVolume, volume]);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setQueue(prev => {
      if (prev.some(s => s.id === song.id)) return prev;
      return [...prev, song];
    });
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index < queueIndex) {
      setQueueIndex(prev => Math.max(0, prev - 1));
    }
  }, [queueIndex]);

  const clearQueue = useCallback(() => {
    setQueue(currentSong ? [currentSong] : []);
    setQueueIndex(0);
  }, [currentSong]);

  const setSleepTimer = useCallback((minutes: number | null) => {
    setSleepTimerMinutes(minutes);
    if (minutes === null) {
      setSleepTimerRemaining(null);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setSleepTimerRemaining(minutes * 60);
    }
  }, []);

  const openDownloadModal = useCallback((song: Song) => {
    setDownloadModalSong(song);
  }, []);

  const closeDownloadModal = useCallback(() => {
    setDownloadModalSong(null);
  }, []);

  const executeDownload = useCallback(async (song: Song, qualityOption: AudioQualityOption) => {
    if (!song.isDownloadAuthorized) {
      showToast('This track is available for streaming only under current licensing terms.', 'info');
      return;
    }

    try {
      // Trigger native download file download
      const downloadUrl = api.getDownloadUrl(song.id, qualityOption.quality);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${song.artist} - ${song.title} (${qualityOption.quality}).mp3`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Save to offline storage collection
      const newEntry: DownloadedTrack = {
        song,
        downloadedAt: new Date().toISOString(),
        quality: qualityOption.quality,
        fileSize: qualityOption.fileSize
      };

      setDownloadedTracks(prev => {
        const filtered = prev.filter(d => d.song.id !== song.id);
        return [newEntry, ...filtered];
      });

      showToast(`Downloading "${song.title}" (${qualityOption.quality} MP3)...`, 'success');
      closeDownloadModal();
    } catch (err: any) {
      showToast(err.message || 'Download error occurred. Please try again.', 'error');
    }
  }, [closeDownloadModal, showToast]);

  const deleteDownload = useCallback((songId: string) => {
    setDownloadedTracks(prev => prev.filter(d => d.song.id !== songId));
  }, []);

  const getFrequencyData = useCallback(() => {
    return audioEngine.getFrequencyData();
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        queue,
        queueIndex,
        shuffle,
        repeatMode,
        isQueueOpen,
        isFullscreenOpen,
        isSleepTimerOpen,
        sleepTimerMinutes,
        sleepTimerRemaining,
        recentlyPlayed,
        downloadedTracks,
        downloadModalSong,

        playSong,
        togglePlay,
        pauseSong,
        resumeSong,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
        setIsQueueOpen,
        setIsFullscreenOpen,
        setIsSleepTimerOpen,
        setSleepTimer,
        openDownloadModal,
        closeDownloadModal,
        executeDownload,
        deleteDownload,
        getFrequencyData
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
