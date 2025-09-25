import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppContextType, UserProfile, WellnessTip, CurrentScreen } from './types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tips, setTips] = useState<WellnessTip[]>([]);
  const [savedTips, setSavedTips] = useState<string[]>(() => {
    // Load saved tips from localStorage
    const saved = localStorage.getItem('wellnessSavedTips');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentTip, setCurrentTip] = useState<WellnessTip | null>(null);
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('home');

  const updateSavedTips = (newSavedTips: string[]) => {
    setSavedTips(newSavedTips);
    localStorage.setItem('wellnessSavedTips', JSON.stringify(newSavedTips));
  };

  const value: AppContextType = {
    profile,
    setProfile,
    tips,
    setTips,
    savedTips,
    setSavedTips: updateSavedTips,
    currentTip,
    setCurrentTip,
    currentScreen,
    setCurrentScreen,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
