import React, { useState, useEffect } from 'react';
import { Wind, Flame, Compass, Volume2, Smile, Users } from 'lucide-react';

export default function AppLayout({ currentView, setCurrentView, children }) {
  // Simulated live counter for a comforting sense of shared quiet space
  const [onlineCount, setOnlineCount] = useState(12);

  useEffect(() => {
    // Gently fluctuate the active user count to feel organic
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.min(24, Math.max(8, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'checkin', label: 'Check-In', icon: Smile },
    { id: 'breathe', label: 'Breathe', icon: Wind },
    { id: 'dumpp', label: 'Brain Dump', icon: Flame },
    { id: 'ground', label: 'Grounding', icon: Compass },
    { id: 'sound', label: 'Ambience', icon: Volume2 },
  ];

  return (
    <div className="min-h-screen bg-sanctuary-bg text-sanctuary-textMain flex flex-col items-center justify-between font-sans selection:bg-sanctuary-sage/30">
      
      {/* Header with Live Sanctuary Counter */}
      <header className="w-full max-w-md px-6 py-4 flex items-center justify-between border-b border-sanctuary-border/30">
        <h1 className="text-lg font-medium tracking-wide text-sanctuary-textMain flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sanctuary-sage animate-pulse"></span>
          HeyDuckie
        </h1>
        
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sanctuary-surface border border-sanctuary-border/60 text-[11px] text-sanctuary-textMuted">
          <Users size={12} className="text-sanctuary-sage" />
          <span>{onlineCount} resting here</span>
        </div>
      </header>

      {/* Main View Container */}
      <main className="w-full max-w-md flex-1 px-6 py-6 flex flex-col justify-center">
        {children}
      </main>

      {/* Navigation */}
      <nav className="w-full max-w-md px-3 py-3 bg-sanctuary-surface/80 backdrop-blur-lg border-t border-sanctuary-border/40 flex justify-around items-center sticky bottom-0 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 py-1 px-2.5 rounded-xl ${
                isActive 
                  ? 'text-sanctuary-sage bg-sanctuary-sage/10' 
                  : 'text-sanctuary-textMuted hover:text-sanctuary-textMain'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[9px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
