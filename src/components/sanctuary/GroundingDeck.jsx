import React, { useState } from 'react';
import Card from '../ui/Card';
import { Eye, Hand, Ear, Wind, Coffee, ChevronRight, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function GroundingDeck() {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState(['', '', '', '', '']); // Stores items for the current step
  const [isCompleted, setIsCompleted] = useState(false);

  const steps = [
    {
      count: 5,
      title: 'Things You Can See',
      description: 'Look around you. Notice 5 objects, colors, or textures in your immediate space.',
      icon: Eye,
      placeholder: 'e.g., A blue coffee mug on the desk...',
      itemsCount: 5,
    },
    {
      count: 4,
      title: 'Things You Can Touch',
      description: 'Bring awareness to your body. Notice 4 things you can physically feel.',
      icon: Hand,
      placeholder: 'e.g., The texture of your clothing...',
      itemsCount: 4,
    },
    {
      count: 3,
      title: 'Things You Can Hear',
      description: 'Close your eyes for a moment. Identify 3 ambient sounds around you.',
      icon: Ear,
      placeholder: 'e.g., Hum of an air conditioner or distant traffic...',
      itemsCount: 3,
    },
    {
      count: 2,
      title: 'Things You Can Smell',
      description: 'Notice 2 scents in the air. If neutral, notice clean air or your clothing scent.',
      icon: Wind,
      placeholder: 'e.g., Fresh coffee or paper...',
      itemsCount: 2,
    },
    {
      count: 1,
      title: 'Thing You Can Taste',
      description: 'Focus on 1 taste lingering in your mouth, or take a sip of water.',
      icon: Coffee,
      placeholder: 'e.g., A sip of crisp water or mint...',
      itemsCount: 1,
    },
  ];

  const activeStepData = steps[currentStep];
  const StepIcon = activeStepData.icon;

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setInputs(['', '', '', '', '']); // Reset inputs for next tier
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setInputs(['', '', '', '', '']);
    setIsCompleted(false);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-sm mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-medium tracking-wide text-sanctuary-textMain">Somatic Grounding</h2>
        <p className="text-xs text-sanctuary-textMuted">Bring your awareness back to the physical present moment.</p>
      </div>

      {/* Main Container Card */}
      <Card className="w-full relative">
        {isCompleted ? (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-sanctuary-sage/20 flex items-center justify-center text-sanctuary-sage">
              <CheckCircle2 size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-medium text-sanctuary-textMain">Grounding Complete</h3>
              <p className="text-xs text-sanctuary-textMuted max-w-[240px]">
                You successfully anchored your senses. Notice how your nervous system feels right now.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sanctuary-surface border border-sanctuary-border text-xs text-sanctuary-textMain hover:bg-sanctuary-card transition-all"
            >
              <RotateCcw size={14} /> Start Over
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Progress and Step Indicator */}
            <div className="flex items-center justify-between border-b border-sanctuary-border/40 pb-3">
              <div className="flex items-center gap-2 text-sanctuary-sage">
                <StepIcon size={18} />
                <span className="text-xs font-semibold uppercase tracking-wider">Step {currentStep + 1} of 5</span>
              </div>
              <span className="text-2xl font-light text-sanctuary-textMain">
                {activeStepData.count}
              </span>
            </div>

            {/* Title & Instructions */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-sanctuary-textMain">{activeStepData.title}</h3>
              <p className="text-xs text-sanctuary-textMuted leading-relaxed">{activeStepData.description}</p>
            </div>

            {/* Dynamic Inputs Based on Count */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {Array.from({ length: activeStepData.itemsCount }).map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={inputs[idx] || ''}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  placeholder={`${idx + 1}. ${activeStepData.placeholder}`}
                  className="w-full bg-sanctuary-bg/60 border border-sanctuary-border/60 rounded-xl px-3.5 py-2.5 text-xs text-sanctuary-textMain placeholder:text-sanctuary-textMuted/40 focus:outline-none focus:border-sanctuary-sage/50 transition-all"
                />
              ))}
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-sanctuary-textMuted">Type out or name them mentally</span>
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sanctuary-sage text-sanctuary-bg font-semibold text-xs hover:bg-sanctuary-sage/90 transition-all shadow-lg shadow-sanctuary-sage/10 cursor-pointer"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next Sense'} <ChevronRight size={14} />
              </button>
            </div>

          </div>
        )}
      </Card>

    </div>
  );
}
