import React, { useState } from 'react';
import Card from '../ui/Card';
import { Flame, RefreshCw, ShieldCheck } from 'lucide-react';

export default function BrainDump() {
  const [thought, setThought] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'shredding' | 'released'

  const handleRelease = () => {
    if (!thought.trim()) return;
    setStatus('shredding');
    
    // Simulate shredding/dissolving transition duration
    setTimeout(() => {
      setStatus('released');
      setThought('');
    }, 1000);
  };

  const handleReset = () => {
    setStatus('idle');
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-sm mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-medium tracking-wide text-sanctuary-textMain">Brain Dump & Release</h2>
        <p className="text-xs text-sanctuary-textMuted">Let go of heavy thoughts. Pour them out and watch them dissolve.</p>
      </div>

      {/* Main Card Area */}
      <Card className="w-full relative overflow-hidden">
        {status === 'released' ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-sanctuary-sage/20 flex items-center justify-center text-sanctuary-sage">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-sanctuary-textMain">Released Successfully</h3>
              <p className="text-xs text-sanctuary-textMuted max-w-[220px]">
                The mental weight has lifted. Nothing was saved or stored.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-sanctuary-surface border border-sanctuary-border text-xs text-sanctuary-textMain hover:bg-sanctuary-card transition-all"
            >
              <RefreshCw size={14} /> Write Another
            </button>
          </div>
        ) : (
          <div className={`space-y-4 transition-all duration-700 ${status === 'shredding' ? 'opacity-0 scale-95 blur-sm' : 'opacity-100'}`}>
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="What is weighing on your mind right now? Pour it all out without filtering..."
              rows={6}
              disabled={status === 'shredding'}
              className="w-full bg-sanctuary-bg/60 border border-sanctuary-border/60 rounded-xl p-4 text-sm text-sanctuary-textMain placeholder:text-sanctuary-textMuted/50 focus:outline-none focus:border-sanctuary-sage/50 resize-none transition-all"
            />

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-sanctuary-textMuted flex items-center gap-1">
                <ShieldCheck size={12} className="text-sanctuary-sage" /> 100% Client-side privacy
              </span>
              
              <button
                key="dissolve-btn"
                onClick={handleRelease}
                disabled={!thought.trim() || status === 'shredding'}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs transition-all duration-300 shadow-lg ${
                  thought.trim() 
                    ? 'bg-gradient-to-r from-orange-500/80 to-amber-600/80 text-white hover:opacity-90 cursor-pointer shadow-orange-500/10' 
                    : 'bg-sanctuary-surface text-sanctuary-textMuted/40 border border-sanctuary-border/40 cursor-not-allowed'
                }`}
              >
                <Flame size={16} /> Dissolve Thought
              </button>
            </div>
          </div>
        )}
      </Card>

    </div>
  );
}
