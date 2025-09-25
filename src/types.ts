export interface UserProfile {
  age: number;
  gender: string;
  goals: string[];
}

export interface WellnessTip {
  id: string;
  title: string;
  description: string;
  icon: string;
  detailedExplanation?: string;
  steps?: string[];
  category: string;
}

export type CurrentScreen = 'home' | 'saved';

export interface AppContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  tips: WellnessTip[];
  setTips: (tips: WellnessTip[]) => void;
  savedTips: string[];
  setSavedTips: (savedTips: string[]) => void;
  currentTip: WellnessTip | null;
  setCurrentTip: (tip: WellnessTip | null) => void;
  currentScreen: CurrentScreen;
  setCurrentScreen: (screen: CurrentScreen) => void;
}
