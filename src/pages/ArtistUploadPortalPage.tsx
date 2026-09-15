import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Upload,
  Music2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Disc3,
  User,
  Radio
} from 'lucide-react';

interface ArtistUploadPortalPageProps {
  setCurrentTab: (tab: string) => void;
}

export const ArtistUploadPortalPage: React.FC<ArtistUploadPortalPageProps> = ({ setCurrentTab }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any>(null);

  // Form State
  const [artistName, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Uganda');

  const [songTitle, setSongTitle] = useState('');
  const [featuredArtists, setFeaturedArtists] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');
  const [genre, setGenre] = useState('Baxx Ragga');
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [explicitContent, setExplicitContent] = useState(false);

  const [audioFileName, setAudioFileName] = useState('');
  const [audioToneType, setAudioToneType] = useState<'afrobeat' | 'baxx_ragga' | 'lugaflow' | 'amapiano' | 'acoustic'>('baxx_ragga');
  const [coverArtworkUrl, setCoverArtworkUrl] = useState('');
  const [downloadPermission, setDownloadPermission] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const sampleArtworks = [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80'
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) {
      showToast('You must confirm copyright ownership and agree to the distribution licensing terms.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitTrack({
        artistName,
        email,
        phone,
        songTitle,
        featuredArtists,
        albumTitle,
        genre,
        releaseDate,
        description,
        lyrics,
        explicitContent,
        audioFileName: audioFileName || `${songTitle || 'Track'}.mp3`,
        audioToneType,
        coverArtworkUrl: coverArtworkUrl || sampleArtworks[0],
        downloadPermission
      });

      setSubmittedResult(res.submission);
      setStep(5);
      showToast('Track submitted successfully for review!', 'success');
    } catch {
      showToast('Failed to submit track. Please check required fields.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Eagle Icon Music Creator Network</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">Artist Upload & Distribution Portal</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Submit your official recordings for authorized global distribution, verified streaming, and 320kbps fan downloads on MP3 KID.
        </p>
      </div>

      {/* Multi-Step Indicator */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-semibold">
        {[
          { num: 1, label: 'Artist Info' },
          { num: 2, label: 'Track Details' },
          { num: 3, label: 'Audio & Art' },
          { num: 4, label: 'Licensing' },
        ].map((item) => {
          const isDone = step > item.num || step === 5;
          const isCurrent = step === item.num;
          return (
            <div key={item.num} className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  isDone
                    ? 'bg-emerald-500 text-black'
                    : isCurrent
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : item.num}
              </span>
              <span className={`hidden sm:inline ${isCurrent ? 'text-white font-bold' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Steps */}
      <div className="rounded-3xl bg-[#11121d] border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" />
              <span>Step 1: Artist Identity & Contact</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your professional recording artist name and direct contact details.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Artist / Stage Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Eddy Kenzo, Azawi, King Saha"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Contact Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="artist@management.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Phone / WhatsApp (For verification)
                </label>
                <input
                  type="text"
                  placeholder="+256 700 000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Country of Residence / Origin
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Uganda">Uganda (Central, Western, Northern, Eastern)</option>
                <option value="Kenya">Kenya</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Nigeria">Nigeria</option>
                <option value="South Africa">South Africa</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Other">Other Global</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-2 transition"
              >
                <span>Continue to Track Info</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Music2 className="w-5 h-5 text-amber-400" />
              <span>Step 2: Song Metadata & Lyrics</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Song Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sitya Loss, Weekend Fever, Kampala Fire"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Featured Artists (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sheebah, Fik Fameica (comma-separated)"
                  value={featuredArtists}
                  onChange={(e) => setFeaturedArtists(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Primary Genre *
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Baxx Ragga">Baxx Ragga (Uganda)</option>
                  <option value="Kidandali">Kidandali / Band (Uganda)</option>
                  <option value="Lugaflow">Lugaflow / Hip-Hop (Uganda)</option>
                  <option value="Kadongo Kamu">Kadongo Kamu (Uganda)</option>
                  <option value="Afrobeats">Afrobeats</option>
                  <option value="Amapiano">Amapiano</option>
                  <option value="Dancehall">Dancehall</option>
                  <option value="Ugandan Gospel">Ugandan Gospel</option>
                  <option value="R&B / Soul">R&B / Soul</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Album / EP Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Single Release or Album Name"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Release Date
                </label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Official Lyrics (Luganda / English / Swahili)
              </label>
              <textarea
                rows={3}
                placeholder="Paste track lyrics here for synchronization in Full-Screen player..."
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="check-explicit"
                checked={explicitContent}
                onChange={(e) => setExplicitContent(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
              />
              <label htmlFor="check-explicit" className="text-xs text-slate-300 cursor-pointer">
                Track contains explicit language or mature lyrical themes (18+)
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-2 transition"
              >
                <span>Continue to Audio & Art</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleNext} className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Disc3 className="w-5 h-5 text-amber-400" />
              <span>Step 3: Master Audio & Cover Artwork</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Audio File Master Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Artist - Song_Master_320k.mp3"
                value={audioFileName}
                onChange={(e) => setAudioFileName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Recommended: 320kbps CBR / 44.1kHz stereo MP3 or WAV format.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Synthesizer Groove Audio Profile (For Web Player Engine)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'baxx_ragga', label: 'Baxx Ragga Kick & Clapper' },
                  { id: 'afrobeat', label: 'Afrobeats Polyrhythm & Keys' },
                  { id: 'lugaflow', label: 'Lugaflow 808 Sub-Boom' },
                  { id: 'amapiano', label: 'Amapiano Log-Drum Pitch Drop' },
                  { id: 'acoustic', label: 'Acoustic Guitar & Kalimba' }
                ].map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setAudioToneType(tone.id as any)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition ${
                      audioToneType === tone.id
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5 mb-1 text-amber-400" />
                    <span>{tone.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Cover Artwork Image URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... or choose below"
                value={coverArtworkUrl}
                onChange={(e) => setCoverArtworkUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Artwork Presets */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                Or select from curated high-resolution sleeve presets:
              </span>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {sampleArtworks.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Preset ${idx + 1}`}
                    onClick={() => setCoverArtworkUrl(url)}
                    className={`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 transition ${
                      coverArtworkUrl === url ? 'border-amber-500 scale-105' : 'border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-2.5 px-4 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-2 transition"
              >
                <span>Continue to Licensing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Step 4: Distribution Licensing & Download Authorization</span>
            </h3>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Track:</span>
                <span className="font-bold text-white">{songTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Artist:</span>
                <span className="font-bold text-amber-400">{artistName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Genre:</span>
                <span className="text-slate-300">{genre}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <input
                  type="checkbox"
                  id="check-download-perm"
                  checked={downloadPermission}
                  onChange={(e) => setDownloadPermission(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="check-download-perm" className="text-xs text-slate-200 cursor-pointer">
                  <strong>Enable Free Fan Direct MP3 Downloads (320kbps / 256kbps / 128kbps)</strong>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    Authorized listeners can save this track for offline playback. Highly recommended for viral airplay in Uganda & East Africa.
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <input
                  type="checkbox"
                  id="check-terms"
                  required
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="check-terms" className="text-xs text-amber-300 cursor-pointer">
                  <strong>The Eagle Icon Music Licensing Agreement & Anti-Piracy Warranty</strong>
                  <span className="block text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    I represent and warrant that I am the sole owner or authorized licensee of all master and publishing rights in this track. I strictly agree that MP3 KID never rips or extracts third-party copyrighted content.
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-2.5 px-4 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !termsAgreed}
                className="py-2.5 px-7 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black shadow-xl shadow-amber-500/30 flex items-center gap-2 active:scale-95 transition disabled:opacity-50"
              >
                <Upload className="w-4 h-4 stroke-[2.5]" />
                <span>{isSubmitting ? 'Submitting Track...' : 'Submit Track for Review'}</span>
              </button>
            </div>
          </form>
        )}

        {step === 5 && submittedResult && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">Track Submitted Successfully!</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Your submission for <strong>"{submittedResult.songTitle}"</strong> has been received by The Eagle Icon Music administrative curation desk.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 max-w-sm mx-auto text-xs text-left space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Submission ID:</span>
                <span className="text-amber-400 font-bold">{submittedResult.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="text-amber-300 uppercase font-bold">Pending Review</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Contact Email:</span>
                <span className="text-slate-300 truncate max-w-[160px]">{submittedResult.email}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setStep(1);
                  setSongTitle('');
                  setLyrics('');
                }}
                className="py-2.5 px-5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Upload Another Track
              </button>

              <button
                onClick={() => setCurrentTab('home')}
                className="py-2.5 px-6 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition"
              >
                Return to MP3 KID Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
