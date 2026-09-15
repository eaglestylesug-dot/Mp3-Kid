import React from 'react';
import { Home, Compass, Flame, HardDrive, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { isAuthenticated } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'music', label: 'Discover', icon: Compass },
    { id: 'ugandan', label: 'Uganda', icon: Flame, special: true },
    { id: 'downloads', label: 'Offline', icon: HardDrive },
    { id: 'search', label: 'Search', icon: Search },
    { id: isAuthenticated ? 'profile' : 'login', label: isAuthenticated ? 'Library' : 'Login', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#090a10]/95 backdrop-blur-xl border-t border-slate-800/90 py-1 px-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
                isActive
                  ? item.special
                    ? 'text-amber-400 font-bold'
                    : 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.special && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
