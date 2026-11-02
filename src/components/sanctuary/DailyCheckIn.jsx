import React, { useState } from 'react';
import Card from '../ui/Card';
import { Heart, Sparkles, Smile, CloudRain, Zap } from 'lucide-react';

export default function DailyCheckIn() {
  const [selectedMood, setSelectedMood] = useState(null);

  const moods = [
    { id: 'anxious', label: 'Anxious / Overwhelmed', icon: Zap, tip: 'Try the Box Breathing tab to slow your heart rate down immediately.' },
    { id: 'heavy', label: 'Heavy / Low Energy', icon: CloudRain, tip: 'Use the Ambient Soundscape to rest your mind with warm brown noise.' },
    { id: 'scattered', label: 'Scattered / Racing', icon: Sparkles, tip: 'Try the Brain Dump tool to clear out mental clutter safely.' },
    { id: 'calm', label: 'At Peace', icon: Smile, tip: 'Wonderful. Enjoy this stillness or practice 5-4-3-2-1 grounding.' },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-sm mx-auto">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-medium tracking-wide text-sanctuary-textMain">Daily Check-In</h2>
        <p className="text-xs text-sanctuary-textMuted">Acknowledge how you feel right now without judgment.</p>
      </div>

      <Card className="w-full space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-sanctuary-textMuted">How is your mind feeling?</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {moods.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMood?.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-left gap-2 ${
                  isSelected 
                    ? 'bg-sanctuary-sage/10 border-sanctuary-sage text-sanctuary-sage' 
                    : 'bg-sanctuary-bg/60 border-sanctuary-border/60 text-sanctuary-textMain hover:border-sanctuary-border'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium text-center">{m.label}</span>
              </button>
            );
          })}
        </div>

        {selectedMood && (
          <div className="mt-4 p-4 rounded-xl bg-sanctuary-surface border border-sanctuary-sage/30 space-y-1 animate-fade-in">
            <span className="text-[10px] text-sanctuary-sage uppercase tracking-wider font-semibold">Gentle Guidance</span>
            <p className="text-xs text-sanctuary-textMain leading-relaxed">{selectedMood.tip}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
