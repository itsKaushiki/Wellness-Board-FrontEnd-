import React from 'react';
import { AppProvider, useApp } from './AppContext';
import ProfileScreen from './components/ProfileScreen';
import TipsScreen from './components/TipsScreen';
import TipDetailScreen from './components/TipDetailScreen';
import SavedTipsScreen from './components/SavedTipsScreen';
import Navigation from './components/Navigation';

const AppContent: React.FC = () => {
  const { profile, currentTip, currentScreen } = useApp();

  if (currentTip) {
    return (
      <>
        <Navigation />
        <TipDetailScreen />
      </>
    );
  }

  if (profile) {
    return (
      <>
        <Navigation />
        {currentScreen === 'saved' ? <SavedTipsScreen /> : <TipsScreen />}
      </>
    );
  }

  return <ProfileScreen />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="container">
        <AppContent />
      </div>
    </AppProvider>
  );
};

export default App;
