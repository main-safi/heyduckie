import React, { useState } from 'react';
import AppLayout from './layouts/AppLayout';
import DailyCheckIn from './components/sanctuary/DailyCheckIn';
import BreathingWidget from './components/sanctuary/BreathingWidget';
import BrainDump from './components/sanctuary/BrainDump';
import GroundingDeck from './components/sanctuary/GroundingDeck';
import SoundMixer from './components/sanctuary/SoundMixer';

export default function App() {
  const [currentView, setCurrentView] = useState('checkin');

  const renderView = () => {
    switch (currentView) {
      case 'checkin':
        return <DailyCheckIn />;
      case 'breathe':
        return <BreathingWidget />;
      case 'dumpp':
        return <BrainDump />;
      case 'ground':
        return <GroundingDeck />;
      case 'sound':
        return <SoundMixer />;
      default:
        return <DailyCheckIn />;
    }
  };

  return (
    <AppLayout currentView={currentView} setCurrentView={setCurrentView}>
      <div className="w-full flex items-center justify-center transition-all duration-300">
        {renderView()}
      </div>
    </AppLayout>
  );
}
