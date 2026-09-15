import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';

interface AuthPageProps {
  setCurrentTab: (tab: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ setCurrentTab }) => {
  const { user, login, register, switchRole } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      setCurrentTab('profile');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  const handleDemoSwitch = (role: 'admin' | 'artist' | 'user') => {
    switchRole(role);
    if (role === 'admin') setCurrentTab('admin');
    else setCurrentTab('profile');
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-16 pt-4">
      {/* Brand header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Proudly from The Eagle Icon Music</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {isRegister ? 'Join MP3 KID Today' : 'Welcome Back to MP3 KID'}
        </h1>
        <p className="text-xs text-slate-400">
          Stream, discover authorized music, and manage your playlists
        </p>
      </div>

      {/* Quick Demo Switcher Strip */}
      <div className="p-4 rounded-2xl bg-[#12131f] border border-amber-500/30 space-y-2.5">
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
          ⚡ One-Click Demo Role Switcher
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleDemoSwitch('user')}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition ${
              user?.role === 'user'
                ? 'bg-amber-500 text-black border-amber-500 font-bold'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            Music Fan
          </button>
          <button
            onClick={() => handleDemoSwitch('artist')}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition ${
              user?.role === 'artist'
                ? 'bg-amber-500 text-black border-amber-500 font-bold'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            UG Artist
          </button>
          <button
            onClick={() => handleDemoSwitch('admin')}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition ${
              user?.role === 'admin'
                ? 'bg-amber-500 text-black border-amber-500 font-bold'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            Eagle Admin
          </button>
        </div>
      </div>

      {/* Main Auth Form */}
      <div className="rounded-3xl bg-[#11121d] border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Kato Brian"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition"
          >
            <span>{isRegister ? 'Create Free Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-slate-400 hover:text-amber-400 transition"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account yet? Register Free"}
          </button>
        </div>
      </div>
    </div>
  );
};
