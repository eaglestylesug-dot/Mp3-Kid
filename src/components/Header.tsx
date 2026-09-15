import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Search,
  Upload,
  Shield,
  User,
  LogOut,
  Sparkles,
  Flame,
  Radio,
  Menu,
  X,
  Music2,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSearch?: () => void;
  onSearchQuery?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onSearchQuery
}) => {
  const { user, isAdmin, isArtist, logout } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCurrentTab('search');
      if (onSearchQuery) onSearchQuery(searchInput.trim());
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'music', label: 'Music Catalog' },
    { id: 'ugandan', label: 'Ugandan Music', highlight: true },
    { id: 'global', label: 'Global Music' },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums' },
    { id: 'genres', label: 'Genres' },
    { id: 'playlists', label: 'Playlists' },
    { id: 'downloads', label: 'Downloads' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0b12]/90 backdrop-blur-xl border-b border-amber-500/15">
      {/* Top Banner Tagline Strip */}
      <div className="bg-gradient-to-r from-amber-950/50 via-amber-900/30 to-zinc-950 px-4 py-1 text-center text-[11px] font-medium text-amber-300/90 border-b border-amber-500/10 flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>MP3 KID — <strong>Proudly from The Eagle Icon Music</strong></span>
        <span className="hidden md:inline text-amber-500/40">•</span>
        <span className="hidden md:inline text-slate-400">100% Authorized Streaming & Fast Direct MP3 Downloads</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 text-left group"
          >
            {/* Eagle Icon Stylized Emblem */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <span className="text-sm font-black tracking-tighter">MK</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white group-hover:text-amber-400 transition">
                  MP3 KID
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-amber-400/80 font-medium tracking-tight -mt-0.5 leading-none">
                The Eagle Icon Music
              </p>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md relative items-center"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search songs, Ugandan hits, artists, albums..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-full pl-10 pr-12 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:bg-slate-900 transition"
          />
          <span className="absolute right-3.5 text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/60">
            ↵
          </span>
        </form>

        {/* Action Controls & User menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Artist Upload Portal CTA Button */}
          <button
            id="btn-nav-upload"
            onClick={() => { setCurrentTab('upload'); setMobileMenuOpen(false); }}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              currentTab === 'upload'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-amber-400 border border-amber-500/30'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Artist Upload</span>
          </button>

          {/* Admin Dashboard CTA Button */}
          {isAdmin && (
            <button
              id="btn-nav-admin"
              onClick={() => { setCurrentTab('admin'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                currentTab === 'admin'
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-red-400 border border-red-500/30'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin Panel</span>
            </button>
          )}

          {/* User Profile Avatar Dropdown */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setUserDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 p-1 pl-2 rounded-full bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition"
              >
                <span className="text-xs font-semibold text-slate-200 hidden lg:inline max-w-[100px] truncate">
                  {user.name}
                </span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-amber-500/30"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-0.5" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Dropdown Menu */}
            {userDropdownOpen && user && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#12131d] border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-2 border-b border-slate-800/80">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-amber-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[9px] font-bold uppercase">
                    Role: {user.role}
                  </span>
                </div>

                <button
                  onClick={() => { setCurrentTab('profile'); setUserDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>My Profile & Library</span>
                </button>

                <button
                  onClick={() => { setCurrentTab('downloads'); setUserDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2"
                >
                  <Radio className="w-3.5 h-3.5 text-slate-400" />
                  <span>Offline Downloads</span>
                </button>

                <button
                  onClick={() => { setCurrentTab('upload'); setUserDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Submit Music</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => { setCurrentTab('admin'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-slate-800/80 flex items-center gap-2"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Dashboard</span>
                  </button>
                )}

                <div className="border-t border-slate-800/80 my-1" />

                <button
                  onClick={() => { logout(); setUserDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:bg-slate-800/80 hover:text-rose-400 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation Links Strip */}
      <nav className="hidden md:flex border-t border-slate-800/60 bg-[#08090f]/70 px-4 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 w-full">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-sm shadow-amber-500/20'
                    : link.highlight
                      ? 'text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                {link.highlight && <Flame className="w-3 h-3 text-amber-400" />}
                <span>{link.label}</span>
              </button>
            );
          })}
          <div className="flex-1" />
          <button
            onClick={() => setCurrentTab('about')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              currentTab === 'about'
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            About & Licensing
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0d16] border-b border-slate-800 p-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search MP3 KID songs, artists..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { setCurrentTab(link.id); setMobileMenuOpen(false); }}
                className={`p-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 ${
                  currentTab === link.id
                    ? 'bg-amber-500 text-black'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Music2 className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => { setCurrentTab('upload'); setMobileMenuOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Artist Upload Portal</span>
            </button>
            <button
              onClick={() => { setCurrentTab('about'); setMobileMenuOpen(false); }}
              className="text-slate-400 hover:text-white"
            >
              About The Eagle Icon Music
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
