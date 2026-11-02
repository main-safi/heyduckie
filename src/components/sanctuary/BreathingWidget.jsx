import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function BreathingWidget() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Ready');
  const [countdown, setCountdown] = useState(4);
  const [scaleClass, setScaleClass] = useState('scale-100');

  useEffect(() => {
    if (!isActive) return;

    let timer;
    const runCycle = () => {
      setPhase('Inhale');
      setCountdown(4);
      setScaleClass('scale-125 bg-sanctuary-sage/20 border-sanctuary-sage');

      timer = setTimeout(() => {
        setPhase('Hold');
        setCountdown(4);
        setScaleClass('scale-125 bg-sanctuary-lavender/20 border-sanctuary-lavender');

        timer = setTimeout(() => {
          setPhase('Exhale');
          setCountdown(4);
          setScaleClass('scale-90 bg-sanctuary-surface border-sanctuary-border');

          timer = setTimeout(() => {
            setPhase('Hold');
            setCountdown(4);
            setScaleClass('scale-90 bg-sanctuary-surface border-sanctuary-border');
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
  }, [isActive]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('Ready');
    setCountdown(4);
    setScaleClass('scale-100 bg-sanctuary-surface border-sanctuary-border');
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-sm mx-auto">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-medium tracking-wide text-sanctuary-textMain">Box Breathing</h2>
        <p className="text-xs text-sanctuary-textMuted">Regulate your vagus nerve with a 4-second rhythm.</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full border-2 transition-all duration-[4000ms] ease-in-out ${scaleClass}`} />
        <Card className="w-48 h-48 rounded-full flex flex-col items-center justify-center z-10 shadow-2xl border border-sanctuary-border/80">
          <span className="text-xs uppercase tracking-widest text-sanctuary-textMuted font-medium mb-1">{phase}</span>
          <span className="text-4xl font-light text-sanctuary-textMain tracking-tighter">{isActive ? countdown : '4-4'}</span>
          <span className="text-[10px] text-sanctuary-sage mt-1">{isActive ? 'Follow the pace' : 'Tap play to start'}</span>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-lg ${
            isActive 
              ? 'bg-sanctuary-surface text-sanctuary-textMain border border-sanctuary-border hover:bg-sanctuary-card' 
              : 'bg-sanctuary-sage text-sanctuary-bg hover:bg-sanctuary-sage/90 font-semibold'
          }`}
        >
          {isActive ? <Pause size={18} /> : <Play size={18} />}
          {isActive ? 'Pause Session' : 'Begin Breathing'}
        </button>
        <button
          onClick={handleReset}
          className="p-3 rounded-xl bg-sanctuary-surface border border-sanctuary-border text-sanctuary-textMuted hover:text-sanctuary-textMain transition-all duration-200"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}
