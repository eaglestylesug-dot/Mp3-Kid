import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Share2, Globe } from 'lucide-react';

interface ShareModalProps {
  title: string;
  subtitle?: string;
  url?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ title, subtitle, url, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const shareUrl = url || window.location.href;
  const shareText = `Check out "${title}" on MP3 KID – Proudly from The Eagle Icon Music: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareNative = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: `Listen to "${title}" on MP3 KID`,
        url: shareUrl
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-[#12131d] border border-slate-800 p-6 shadow-2xl text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-3">
            <Share2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Share Music</h3>
          <p className="text-xs text-amber-400 font-medium truncate mt-0.5">{title}</p>
          {subtitle && <p className="text-[11px] text-slate-400 truncate">{subtitle}</p>}
        </div>

        {/* Social channels */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <button
            onClick={shareToWhatsApp}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-900/40 transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[11px] font-semibold">WhatsApp</span>
          </button>
          <button
            onClick={shareToTwitter}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-sky-950/40 border border-sky-500/20 text-sky-400 hover:bg-sky-900/40 transition"
          >
            <Globe className="w-5 h-5" />
            <span className="text-[11px] font-semibold">X / Twitter</span>
          </button>
          <button
            onClick={shareNative}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-amber-400 hover:bg-amber-900/40 transition"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-[11px] font-semibold">Device Share</span>
          </button>
        </div>

        {/* Copy Link field */}
        <div className="relative">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 pr-24 font-mono focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
