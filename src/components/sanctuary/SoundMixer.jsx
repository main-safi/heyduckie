import React, { useState, useEffect, useRef } from 'react';
import Card from '../ui/Card';
import { Volume2, VolumeX, Play, Pause, Waves } from 'lucide-react';

export default function SoundMixer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;

      const gainNode = ctx.createGain();
      gainNode.gain.value = volume;

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start(0);
      gainNodeRef.current = gainNode;

      return () => {
        try {
          whiteNoise.stop();
          whiteNoise.disconnect();
        } catch (e) {}
      };
    } catch (e) {
      console.error("Web Audio API error:", e);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-sm mx-auto">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-medium tracking-wide text-sanctuary-textMain">Ambient Soundscape</h2>
        <p className="text-xs text-sanctuary-textMuted">Calming brown noise generated directly in your browser.</p>
      </div>

      <Card className="w-full space-y-6">
        <div className="flex flex-col items-center justify-center py-6 space-y-3">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 border ${
            isPlaying 
              ? 'bg-sanctuary-sage/10 border-sanctuary-sage text-sanctuary-sage animate-pulse shadow-lg shadow-sanctuary-sage/5' 
              : 'bg-sanctuary-surface border-sanctuary-border text-sanctuary-textMuted'
          }`}>
            <Waves size={36} strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-sanctuary-textMain">Deep Brown Noise</span>
            <p className="text-[11px] text-sanctuary-textMuted mt-0.5">
              {isPlaying ? 'Playing ambient frequency...' : 'Muted & resting'}
            </p>
          </div>
        </div>

        <div className="space-y-2 bg-sanctuary-bg/40 p-4 rounded-xl border border-sanctuary-border/40">
          <div className="flex justify-between items-center text-xs text-sanctuary-textMuted">
            <span className="flex items-center gap-1.5">
              {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />} Volume
            </span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-sanctuary-sage cursor-pointer h-1.5 bg-sanctuary-surface rounded-lg"
          />
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-xs transition-all duration-200 shadow-lg ${
            isPlaying 
              ? 'bg-sanctuary-surface border border-sanctuary-border text-sanctuary-textMain hover:bg-sanctuary-card' 
              : 'bg-sanctuary-sage text-sanctuary-bg hover:bg-sanctuary-sage/90 font-semibold shadow-sanctuary-sage/10'
          }`}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Pause Soundscape' : 'Start Soundscape'}
        </button>
      </Card>
    </div>
  );
}
