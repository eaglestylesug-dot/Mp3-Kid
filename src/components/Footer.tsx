import React from 'react';
import { ShieldCheck, Music2, Heart, ExternalLink, Sparkles } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-[#07080e] border-t border-slate-800/80 pt-12 pb-24 md:pb-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black text-xs shadow-md shadow-amber-500/20">
                MK
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white block">
                  MP3 KID
                </span>
                <span className="text-[10px] text-amber-400 font-semibold tracking-wide block uppercase">
                  The Eagle Icon Music
                </span>
              </div>
            </div>

            {/* Official Tagline Badge */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <p className="font-semibold text-xs tracking-tight">
                “Proudly from The Eagle Icon Music”
              </p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Empowering Ugandan & global musicians through authorized streaming, fair artist promotion, and high-fidelity 320kbps downloads.
              </p>
            </div>
          </div>

          {/* Discovery Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Discovery</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentTab('ugandan')} className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Ugandan Music (Pearl Hits)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('global')} className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <span>Global Music Catalog</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('artists')} className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <span>Featured Artists</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('albums')} className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <span>Albums & EPs</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('genres')} className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <span>Genres & Moods</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Creators & Platform */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform & Creators</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentTab('upload')} className="hover:text-amber-400 text-amber-300 font-semibold transition">
                  Artist Submission Upload Portal
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('playlists')} className="hover:text-amber-400 transition">
                  Curated Playlists
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('downloads')} className="hover:text-amber-400 transition">
                  Offline Downloads Vault
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-amber-400 transition">
                  About The Eagle Icon Music
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('profile')} className="hover:text-amber-400 transition">
                  User Profile & Preferences
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Legal & Licensing</h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Downloads Only</span>
              </div>
              <p className="leading-relaxed">
                MP3 KID does not rip or extract audio from third-party streaming services. All downloads are directly authorized by artists and copyright licensors.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentTab('about')}
                  className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>DMCA Copyright Policy & Takedown</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits Strip */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} MP3 KID. Proudly from The Eagle Icon Music. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentTab('about')} className="hover:text-slate-300 transition">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab('about')} className="hover:text-slate-300 transition">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab('about')} className="hover:text-slate-300 transition">
              Licensing Standards
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
