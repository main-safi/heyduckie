import React, { useState, useEffect, useRef } from 'react';
import { 
  Wind, Flame, Compass, Volume2, Smile, Users, Heart, Sparkles, 
  Trophy, ShoppingBag, Lock, CheckCircle2, ChevronRight, Play, Pause, 
  RotateCcw, ShieldCheck, Eye, Hand, Ear, Coffee, VolumeX, Waves, CloudRain
} from 'lucide-react';

// ==========================================
// 1. WEB AUDIO SYNTHESIZER ENGINE
// ==========================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.brownNoiseNode = null;
    this.brownGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChime(freq = 528) {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }

  playClick() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  toggleBrownNoise(enable, volume = 0.3) {
    this.init();
    if (!enable) {
      if (this.brownNoiseNode) {
        try { this.brownNoiseNode.stop(); } catch(e){}
        this.brownNoiseNode = null;
      }
      return;
    }

    if (this.brownNoiseNode) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    this.brownNoiseNode = this.ctx.createBufferSource();
    this.brownNoiseNode.buffer = buffer;
    this.brownNoiseNode.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;

    this.brownGain = this.ctx.createGain();
    this.brownGain.gain.value = volume;

    this.brownNoiseNode.connect(filter);
    filter.connect(this.brownGain);
    this.brownGain.connect(this.ctx.destination);
    this.brownNoiseNode.start(0);
  }

  setVolume(vol) {
    if (this.brownGain && this.ctx) {
      this.brownGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }
}

const audio = new SoundEngine();

// ==========================================
// 2. INTERACTIVE DUCKIE MASCOT COMPONENT
// ==========================================
function DuckieMascot({ accessory = 'none', size = 'normal', onClick }) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTap = (e) => {
    audio.playChime(600);
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setParticles(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 1000);
    if (onClick) onClick();
  };

  const scaleClasses = size === 'large' ? 'w-44 h-44' : 'w-28 h-28';

  return (
    <div className="relative flex flex-col items-center justify-center cursor-pointer select-none" onClick={handleTap}>
      {/* Tap Floating Heart Particles */}
      {particles.map(p => (
        <span 
          key={p.id} 
          className="absolute text-emerald-400 font-bold text-lg animate-bounce pointer-events-none z-30"
          style={{ left: p.x, top: p.y - 20 }}
        >
          ❤️ +5 XP
        </span>
      ))}

      {/* Main Duckie SVG Body */}
      <div className={`relative ${scaleClasses} transition-all duration-300 hover:scale-105 active:scale-95`}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_10px_20px_rgba(74,222,128,0.2)]">
          {/* Main Body */}
          <circle cx="100" cy="115" r="60" fill="#FACC15" />
          {/* Head */}
          <circle cx="100" cy="70" r="45" fill="#FDE047" />
          {/* Cheeks */}
          <circle cx="68" cy="80" r="8" fill="#F87171" opacity="0.6" />
          <circle cx="132" cy="80" r="8" fill="#F87171" opacity="0.6" />
          
          {/* Eyes */}
          {isBlinking ? (
            <>
              <line x1="72" y1="65" x2="84" y2="65" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
              <line x1="116" y1="65" x2="128" y2="65" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="78" cy="65" r="6" fill="#1E293B" />
              <circle cx="122" cy="65" r="6" fill="#1E293B" />
              <circle cx="80" cy="63" r="2" fill="#FFFFFF" />
              <circle cx="124" cy="63" r="2" fill="#FFFFFF" />
            </>
          )}

          {/* Beak */}
          <ellipse cx="100" cy="78" rx="14" ry="9" fill="#FB923C" />

          {/* Wings */}
          <path d="M 40 115 Q 25 125 45 135 Z" fill="#EAB308" />
          <path d="M 160 115 Q 175 125 155 135 Z" fill="#EAB308" />

          {/* ACCESSORY OVERLAYS */}
          {accessory === 'sunglasses' && (
            <g>
              <rect x="62" y="58" width="32" height="16" rx="3" fill="#0F172A" />
              <rect x="106" y="58" width="32" height="16" rx="3" fill="#0F172A" />
              <line x1="94" y1="64" x2="106" y2="64" stroke="#0F172A" strokeWidth="3" />
            </g>
          )}

          {accessory === 'scarf' && (
            <path d="M 60 100 Q 100 115 140 100 Q 135 115 100 120 Q 65 115 60 100 Z" fill="#EF4444" />
          )}

          {accessory === 'crown' && (
            <polygon points="75,35 85,15 100,30 115,15 125,35" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
          )}

          {accessory === 'party' && (
            <polygon points="85,35 100,5 115,35" fill="#EC4899" />
          )}
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 3. MAIN HE DUCKIE APP HUB
// ==========================================
export default function App() {
  const [currentView, setCurrentView] = useState('sanctuary'); // 'sanctuary' | 'leaderboard' | 'shop'
  const [activeTab, setActiveTab] = useState('checkin'); // 'checkin' | 'breathe' | 'dump' | 'ground' | 'sound'
  
  // User Persistent State (Stored in LocalStorage)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('heyduckie_user');
    return saved ? JSON.parse(saved) : {
      username: 'duckie_friend',
      feathers: 120,
      streak: 3,
      level: 2,
      xp: 40,
      accessory: 'none',
      inventory: ['none']
    };
  });

  const [onlineCount, setOnlineCount] = useState(14);
  const [breathePhase, setBreathePhase] = useState('Ready');
  const [breatheTimer, setBreatheTimer] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  
  // Soundscape state
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.3);

  // Thought Shredder state
  const [thought, setThought] = useState('');
  const [dumpStatus, setDumpStatus] = useState('idle');

  // Grounding state
  const [groundStep, setGroundStep] = useState(0);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('heyduckie_user', JSON.stringify(user));
  }, [user]);

  // Live user counter fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.min(28, Math.max(9, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Box Breathing Logic
  useEffect(() => {
    if (!isBreathingActive) return;

    let timer;
    const runCycle = () => {
      setBreathePhase('Inhale');
      audio.playChime(440);
      setBreatheTimer(4);

      timer = setTimeout(() => {
        setBreathePhase('Hold');
        setBreatheTimer(4);

        timer = setTimeout(() => {
          setBreathePhase('Exhale');
          audio.playChime(350);
          setBreatheTimer(4);

          timer = setTimeout(() => {
            setBreathePhase('Hold');
            setBreatheTimer(4);
          }, 4000);
        }, 4000);
      }, 4000);
    };

    runCycle();
    const interval = setInterval(runCycle, 16000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isBreathingActive]);

  const rewardUser = (feathersGained, xpGained) => {
    setUser(prev => {
      const newXp = prev.xp + xpGained;
      const leveledUp = newXp >= 100;
      return {
        ...prev,
        feathers: prev.feathers + feathersGained,
        xp: leveledUp ? newXp - 100 : newXp,
        level: leveledUp ? prev.level + 1 : prev.level
      };
    });
    audio.playChime(880);
  };

  const handleShred = () => {
    if (!thought.trim()) return;
    audio.playClick();
    setDumpStatus('shredding');
    setTimeout(() => {
      setDumpStatus('released');
      setThought('');
      rewardUser(15, 25);
    }, 1000);
  };

  const navItems = [
    { id: 'checkin', label: 'Check-In', icon: Smile },
    { id: 'breathe', label: 'Breathe', icon: Wind },
    { id: 'dump', label: 'Shredder', icon: Flame },
    { id: 'ground', label: 'Grounding', icon: Compass },
    { id: 'sound', label: 'Soundscape', icon: Volume2 },
  ];

  const shopItems = [
    { id: 'none', name: 'Natural Duckie', price: 0, icon: '🦆' },
    { id: 'scarf', name: 'Cozy Red Scarf', price: 50, icon: '🧣' },
    { id: 'sunglasses', name: 'Cool Shades', price: 100, icon: '🕶️' },
    { id: 'party', name: 'Party Hat', price: 150, icon: '🥳' },
    { id: 'crown', name: 'Royal Crown', price: 300, icon: '👑' },
  ];

  const leaderboardUsers = [
    { rank: 1, name: 'mindful_alex', feathers: 850, streak: 12, accessory: 'crown' },
    { rank: 2, name: user.username, feathers: user.feathers, streak: user.streak, accessory: user.accessory, isUser: true },
    { rank: 3, name: 'cozy_sam', feathers: 210, streak: 5, accessory: 'sunglasses' },
    { rank: 4, name: 'calm_pat', feathers: 95, streak: 2, accessory: 'scarf' },
  ].sort((a, b) => b.feathers - a.feathers);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 flex flex-col items-center">
      
      {/* TOP HEADER */}
      <header className="w-full max-w-6xl px-6 py-4 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
          <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            HeyDuckie
          </h1>
          <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            v6 Dribbble
          </span>
        </div>

        {/* Live Status Badges */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <Users size={14} className="text-emerald-400" />
            <span>{onlineCount} resting</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300">
            <span>🔥 {user.streak}d</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
            <span>🪶 {user.feathers}</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER (DESKTOP 3-PANE / MOBILE SINGLE-PANE) */}
      <div className="w-full max-w-6xl px-4 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT NAVIGATION SIDEBAR (DESKTOP) */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Sanctuary Views</h2>
            
            <button
              onClick={() => { audio.playClick(); setCurrentView('sanctuary'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all border-b-4 ${
                currentView === 'sanctuary' 
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40' 
                  : 'bg-slate-800/40 text-slate-400 border-transparent hover:bg-slate-800/80'
              }`}
            >
              <Heart size={18} /> Daily Sanctuary
            </button>

            <button
              onClick={() => { audio.playClick(); setCurrentView('leaderboard'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all border-b-4 ${
                currentView === 'leaderboard' 
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40' 
                  : 'bg-slate-800/40 text-slate-400 border-transparent hover:bg-slate-800/80'
              }`}
            >
              <Trophy size={18} /> Global Leaderboard
            </button>

            <button
              onClick={() => { audio.playClick(); setCurrentView('shop'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all border-b-4 ${
                currentView === 'shop' 
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40' 
                  : 'bg-slate-800/40 text-slate-400 border-transparent hover:bg-slate-800/80'
              }`}
            >
              <ShoppingBag size={18} /> Duckie Shop
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Level {user.level} Sanctuary</span>
              <span className="text-xs text-emerald-400 font-semibold">{user.xp}/100 XP</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${user.xp}%` }} />
            </div>
          </div>
        </aside>

        {/* CENTER ACTIVE STAGE WORKSPACE */}
        <main className="lg:col-span-6 flex flex-col items-center space-y-6">
          
          {/* Duckie Companion Display */}
          <div className="flex flex-col items-center justify-center py-2">
            <DuckieMascot accessory={user.accessory} size="large" onClick={() => rewardUser(1, 5)} />
            <p className="text-xs text-slate-400 mt-2 font-medium">Tap Duckie for gentle encouragement</p>
          </div>

          {/* VIEW 1: SANCTUARY WORKSPACE */}
          {currentView === 'sanctuary' && (
            <div className="w-full space-y-6">
              
              {/* Tab Selector */}
              <div className="flex justify-around bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { audio.playClick(); setActiveTab(item.id); }}
                      className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                        isActive 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB CONTENT: DAILY CHECK-IN */}
              {activeTab === 'checkin' && (
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-semibold text-slate-100">Emotional Check-In</h3>
                    <p className="text-xs text-slate-400">How is your mind feeling in this moment?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Anxious / Overwhelmed', tip: 'Try the Box Breathing pacer to slow your pulse.', gain: 10 },
                      { label: 'Heavy / Exhausted', tip: 'Listen to warm brown noise in the Soundscape tab.', gain: 10 },
                      { label: 'Scattered / Racing', tip: 'Use the Shredder tab to empty intrusive thoughts.', gain: 10 },
                      { label: 'Calm & Grounded', tip: 'Practice somatic grounding to anchor this feeling.', gain: 10 },
                    ].map((mood, idx) => (
                      <button
                        key={idx}
                        onClick={() => rewardUser(mood.gain, 15)}
                        className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-emerald-500/40 text-left transition-all hover:scale-[1.02] active:scale-95 space-y-1"
                      >
                        <span className="text-xs font-semibold text-slate-200 block">{mood.label}</span>
                        <span className="text-[10px] text-slate-400 block">{mood.tip}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: BOX BREATHING */}
              {activeTab === 'breathe' && (
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-semibold text-slate-100">4-4-4-4 Box Breathing</h3>
                    <p className="text-xs text-slate-400">Follow the visual ring to balance your nervous system.</p>
                  </div>

                  <div className="relative w-56 h-56 flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full border-2 border-emerald-400/30 transition-all duration-[4000ms] ${
                      isBreathingActive ? 'scale-125 bg-emerald-500/10' : 'scale-100'
                    }`} />
                    <div className="w-40 h-40 rounded-full bg-slate-900 border border-slate-700 flex flex-col items-center justify-center z-10 shadow-2xl">
                      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{breathePhase}</span>
                      <span className="text-3xl font-light text-slate-100">{isBreathingActive ? breatheTimer : '4-4'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      audio.playClick();
                      setIsBreathingActive(!isBreathingActive);
                      if (!isBreathingActive) rewardUser(15, 20);
                    }}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0"
                  >
                    {isBreathingActive ? 'Pause Session' : 'Start Breathing Rhythm'}
                  </button>
                </div>
              )}

              {/* TAB CONTENT: BRAIN DUMP SHREDDER */}
              {activeTab === 'dump' && (
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-semibold text-slate-100">Intrusive Thought Shredder</h3>
                    <p className="text-xs text-slate-400">Type what is weighing on you. Watch it dissolve safely.</p>
                  </div>

                  {dumpStatus === 'released' ? (
                    <div className="py-8 text-center space-y-3">
                      <ShieldCheck size={36} className="mx-auto text-emerald-400" />
                      <p className="text-xs text-slate-300">Thought dissolved. Zero data stored.</p>
                      <button
                        onClick={() => setDumpStatus('idle')}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200"
                      >
                        Write Another
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        value={thought}
                        onChange={(e) => setThought(e.target.value)}
                        placeholder="Pour out your racing thoughts here..."
                        rows={5}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none"
                      />
                      <button
                        onClick={handleShred}
                        disabled={!thought.trim()}
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-lg border-b-4 border-amber-700 active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2"
                      >
                        <Flame size={16} /> Dissolve Thought (+15 🪶)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: 5-4-3-2-1 GROUNDING */}
              {activeTab === 'ground' && (
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4 text-center">
                  <h3 className="text-lg font-semibold text-slate-100">Somatic Grounding</h3>
                  <p className="text-xs text-slate-400">Anchor yourself into the physical present moment.</p>

                  <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                    <span className="text-2xl font-bold text-emerald-400">
                      Step {groundStep + 1} of 5
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {[
                        "Acknowledge 5 things you can see around you right now.",
                        "Notice 4 physical textures or things you can feel.",
                        "Listen carefully for 3 distinct ambient sounds.",
                        "Identify 2 scents lingering in your environment.",
                        "Focus on 1 taste in your mouth or sip water."
                      ][groundStep]}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      audio.playClick();
                      if (groundStep < 4) {
                        setGroundStep(prev => prev + 1);
                      } else {
                        setGroundStep(0);
                        rewardUser(20, 30);
                      }
                    }}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0"
                  >
                    {groundStep === 4 ? 'Complete Grounding (+20 🪶)' : 'Next Sense Step'}
                  </button>
                </div>
              )}

              {/* TAB CONTENT: SOUNDSCAPE SYNTHESIZER */}
              {activeTab === 'sound' && (
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6 text-center">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-100">Synthesized Ambient Sound</h3>
                    <p className="text-xs text-slate-400">Deep brown noise synthesized live in your browser.</p>
                  </div>

                  <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Waves size={36} />
                  </div>

                  <div className="space-y-2 max-w-xs mx-auto">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Volume</span>
                      <span>{Math.round(soundVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={soundVolume}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setSoundVolume(val);
                        audio.setVolume(val);
                      }}
                      className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const nextState = !isSoundPlaying;
                      setIsSoundPlaying(nextState);
                      audio.toggleBrownNoise(nextState, soundVolume);
                    }}
                    className="w-full max-w-xs py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2 mx-auto"
                  >
                    {isSoundPlaying ? <Pause size={16} /> : <Play size={16} />}
                    {isSoundPlaying ? 'Mute Soundscape' : 'Start Brown Noise'}
                  </button>
                </div>
              )}

            </div>
          )}

          {/* VIEW 2: LEADERBOARD */}
          {currentView === 'leaderboard' && (
            <div className="w-full p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold text-slate-100">Global Sanctuary League</h3>
                <p className="text-xs text-slate-400">Resting together in shared quiet presence.</p>
              </div>

              <div className="space-y-2">
                {leaderboardUsers.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      item.isUser 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs w-5 text-center text-slate-400">#{index + 1}</span>
                      <DuckieMascot accessory={item.accessory} size="small" />
                      <span className="text-xs font-semibold">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span>🔥 {item.streak}d</span>
                      <span className="font-bold text-emerald-400">🪶 {item.feathers}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: DUCKIE WARDROBE SHOP */}
          {currentView === 'shop' && (
            <div className="w-full p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold text-slate-100">Duckie Wardrobe</h3>
                <p className="text-xs text-slate-400">Unlock accessories using your earned Feathers.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {shopItems.map(item => {
                  const isOwned = user.inventory.includes(item.id);
                  const isEquipped = user.accessory === item.id;

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center space-y-2 text-center"
                    >
                      <span className="text-3xl">{item.icon}</span>
                      <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                      
                      {isEquipped ? (
                        <span className="text-[10px] text-emerald-400 font-bold">Equipped</span>
                      ) : isOwned ? (
                        <button
                          onClick={() => setUser(prev => ({ ...prev, accessory: item.id }))}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-[10px] font-bold text-slate-200 hover:bg-slate-700"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (user.feathers >= item.price) {
                              setUser(prev => ({
                                ...prev,
                                feathers: prev.feathers - item.price,
                                inventory: [...prev.inventory, item.id],
                                accessory: item.id
                              }));
                              audio.playChime(700);
                            }
                          }}
                          disabled={user.feathers < item.price}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 disabled:opacity-30 text-slate-950 text-[10px] font-bold hover:bg-emerald-400"
                        >
                          Buy ({item.price} 🪶)
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>

        {/* RIGHT WIDGET PANEL (DESKTOP) */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-2 text-center">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Daily Wisdom</span>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "You don't have to control your thoughts. You just have to stop letting them control you."
            </p>
          </div>
        </aside>

      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden w-full bg-slate-900/90 backdrop-blur-lg border-t border-slate-800/80 px-4 py-3 flex justify-around items-center sticky bottom-0 z-50">
        <button
          onClick={() => { audio.playClick(); setCurrentView('sanctuary'); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${currentView === 'sanctuary' ? 'text-emerald-400' : 'text-slate-400'}`}
        >
          <Heart size={18} /> Sanctuary
        </button>
        <button
          onClick={() => { audio.playClick(); setCurrentView('leaderboard'); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${currentView === 'leaderboard' ? 'text-emerald-400' : 'text-slate-400'}`}
        >
          <Trophy size={18} /> Ranks
        </button>
        <button
          onClick={() => { audio.playClick(); setCurrentView('shop'); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${currentView === 'shop' ? 'text-emerald-400' : 'text-slate-400'}`}
        >
          <ShoppingBag size={18} /> Shop
        </button>
      </nav>

    </div>
  );
}
