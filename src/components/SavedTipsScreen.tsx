import React, { useEffect } from 'react';
import { useApp } from '../AppContext';

const SavedTipsScreen: React.FC = () => {
  const { tips, savedTips, setCurrentTip, setCurrentScreen, setCurrentScreen: navigateToHome } = useApp();

  useEffect(() => {
    setCurrentScreen('saved');
  }, [setCurrentScreen]);

  const savedTipsList = tips.filter(tip => savedTips.includes(tip.id));

  const handleTipClick = (tip: any) => {
    setCurrentTip(tip);
  };

  const handleExploreClick = () => {
    navigateToHome('home');
  };

  // Enhanced icon mapping for better visual hierarchy
  const getEnhancedIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      'mindful eating': '🍽️',
      'exercise': '💪',
      'meditation': '🧘‍♀️',
      'sleep': '😴',
      'stress relief': '🌿',
      'hydration': '💧',
      'mental health': '🧠',
      'nutrition': '🥗',
      'fitness': '🏃‍♂️',
      'wellness': '✨',
      'breathing': '🌬️',
      'mindfulness': '🧘',
      'self-care': '💆‍♀️'
    };
    
    const key = Object.keys(iconMap).find(k => 
      category.toLowerCase().includes(k.toLowerCase())
    );
    
    return key ? iconMap[key] : '✨';
  };

  return (
    <div className="screen">
      <div className="saved-tips-page">
        <div className="saved-tips-header">
          <h1>💾 Saved Tips</h1>
          <p>Your curated collection of wellness wisdom</p>
        </div>
        
        {savedTipsList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">🌟</span>
              <h3>No saved tips yet</h3>
              <p>Start exploring personalized wellness advice and save your favorites to build your personal wellness library!</p>
              <button className="empty-state-cta" onClick={handleExploreClick}>
                <span>🏠</span>
                Explore Tips
              </button>
            </div>
          </div>
        ) : (
          <div className="saved-tips-grid">
            {savedTipsList.map((tip) => (
              <div key={tip.id} className="saved-tip-card" onClick={() => handleTipClick(tip)}>
                <div className="saved-tip-badge">Saved</div>
                <div className="saved-tip-header">
                  <div className="saved-tip-icon">
                    {getEnhancedIcon(tip.category)}
                  </div>
                  <div>
                    <div className="saved-tip-title">{tip.title}</div>
                    <div className="saved-tip-description">{tip.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTipsScreen;
