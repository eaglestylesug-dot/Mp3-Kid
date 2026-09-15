import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Moon, Clock, X, Check } from 'lucide-react';

export const SleepTimerModal: React.FC = () => {
  const { isSleepTimerOpen, setIsSleepTimerOpen, sleepTimerMinutes, setSleepTimer, sleepTimerRemaining } = useMusicPlayer();

  if (!isSleepTimerOpen) return null;

  const timerOptions = [
    { label: '15 Minutes', minutes: 15 },
    { label: '30 Minutes', minutes: 30 },
    { label: '45 Minutes', minutes: 45 },
    { label: '60 Minutes', minutes: 60 },
    { label: '90 Minutes', minutes: 90 },
    { label: 'Turn Off Timer', minutes: null }
  ];

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-[#12131d] border border-slate-800 p-6 shadow-2xl text-slate-100 relative">
        <button
          onClick={() => setIsSleepTimerOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-2 text-amber-400">
          <Moon className="w-5 h-5" />
          <h3 className="text-base font-bold text-white">Sleep Timer</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Automatically stops music playback when you fall asleep.
        </p>

        {sleepTimerRemaining !== null && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              Active Sleep Timer
            </span>
            <span className="font-mono font-bold">{formatRemaining(sleepTimerRemaining)}</span>
          </div>
        )}

        <div className="space-y-2">
          {timerOptions.map((opt) => {
            const isSelected = opt.minutes === sleepTimerMinutes;
            return (
              <button
                key={opt.label}
                onClick={() => {
                  setSleepTimer(opt.minutes);
                  setIsSleepTimerOpen(false);
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                    : 'border-slate-800/80 bg-slate-900/50 text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
