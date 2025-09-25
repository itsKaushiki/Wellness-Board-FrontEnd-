import React from 'react';
import { useApp } from '../AppContext';

const Navigation: React.FC = () => {
  const { profile, setCurrentTip, currentScreen, setCurrentScreen } = useApp();

  const handleHomeClick = () => {
    setCurrentTip(null);
    setCurrentScreen('home');
  };

  const handleSavedTipsClick = () => {
    setCurrentTip(null);
    setCurrentScreen('saved');
  };

  // Don't show navigation on profile setup screen
  if (!profile) {
    return null;
  }

  return (
    <nav className="navigation">
      <div className="nav-content">
        <div className="nav-brand" onClick={handleHomeClick}>
          <span className="nav-logo">🧘‍♀️</span>
          <span className="nav-title">Wellness Board</span>
        </div>
        
        <div className="nav-links">
          <button 
            className={`nav-link ${currentScreen === 'home' ? 'active' : ''}`}
            onClick={handleHomeClick}
          >
            <span className="nav-link-icon">🏠</span>
            Home
          </button>
          <button 
            className={`nav-link ${currentScreen === 'saved' ? 'active' : ''}`}
            onClick={handleSavedTipsClick}
          >
            <span className="nav-link-icon">💾</span>
            Saved Tips
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
