import React from 'react';
import { ShieldCheck, Music2, Globe, Flame, Award, HeartHandshake, Mail, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      {/* Brand Hero */}
      <section className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Proudly from The Eagle Icon Music</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About MP3 KID
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The premier global music discovery, streaming, and authorized direct-download ecosystem — elevating Ugandan music culture and connecting it with global listeners.
        </p>
      </section>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#11121d] border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Ugandan Sound Heritage</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Celebrating Baxx Ragga, Kidandali, Lugaflow, and Kadongo Kamu folklore. We champion Ugandan artists from Kampala to Gulu, giving them the stage and distribution they deserve.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#11121d] border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">100% Authorized Downloads</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every audio file downloaded from MP3 KID is distributed with direct artist consent or legal Creative Commons authorization. We reject ripping or pirated streams.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#11121d] border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Global Reach & Jamendo API</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Built with modern streaming infrastructure and modular Jamendo integration to give African creators global reach and bring worldwide royalty-free music to fans.
          </p>
        </div>
      </div>

      {/* The Eagle Icon Music Narrative */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-[#10121d] to-[#151726] border border-amber-500/20 space-y-4">
        <h2 className="text-2xl font-black text-white">The Eagle Icon Music Vision</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Founded as an independent entertainment and media powerhouse, <strong>The Eagle Icon Music</strong> was created with a single mission: to empower African musical storytellers. For decades, music fans in East Africa struggled with ad-infested rip sites, virus-laden downloads, and low-bitrate rips that degraded the artist's hard work in the studio.
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <strong>MP3 KID</strong> is our response: a lightning-fast, mobile-first, high-fidelity platform where listeners enjoy studio-quality 320kbps audio, embedded ID3 tags, verified artist profiles, synchronized lyrics, and seamless offline access.
        </p>
      </section>

      {/* DMCA & Takedown Notice */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>DMCA Copyright Notice & Takedown Policy</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          MP3 KID strictly adheres to international copyright laws and the Digital Millennium Copyright Act (DMCA). If you are a copyright owner or an agent thereof and believe that any content hosted on this site infringes upon your copyrights, you may submit a formal notification to our designated compliance desk.
        </p>
        <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-amber-400">
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            dmca@eagleiconmusic.com
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            Kampala, Uganda
          </span>
        </div>
      </section>
    </div>
  );
};
