import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Heart } from 'lucide-react';
import { aiService } from '../aiService';
import LoadingScreen from './LoadingScreen';

const TipDetailScreen: React.FC = () => {
  const { currentTip, setCurrentTip, savedTips, setSavedTips } = useApp();
  const [loading, setLoading] = useState(false);
  const [detailedTip, setDetailedTip] = useState(currentTip);

  useEffect(() => {
    const loadDetailedTip = async () => {
      if (!currentTip) return;
      
      setLoading(true);
      try {
        const detailed = await aiService.generateDetailedTip(currentTip);
        setDetailedTip(detailed);
      } catch (error) {
        console.error('Failed to load detailed tip:', error);
        setDetailedTip(currentTip);
      } finally {
        setLoading(false);
      }
    };

    loadDetailedTip();
  }, [currentTip]);

  if (!currentTip) {
    return null;
  }

  const tipToShow = detailedTip || currentTip;
  const isSaved = savedTips.includes(currentTip.id);

  const handleSaveTip = () => {
    if (isSaved) {
      setSavedTips(savedTips.filter(id => id !== currentTip.id));
    } else {
      setSavedTips([...savedTips, currentTip.id]);
    }
  };

  const handleBack = () => {
    setCurrentTip(null);
  };

  if (loading) {
    return (
      <div className="screen">
        <div className="loading">
          <div className="loading-spinner"></div>
          <h2>Loading Detailed Advice...</h2>
          <p>Getting personalized step-by-step guidance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="tip-detail">
        <h2>
          <span>{tipToShow.icon}</span>
          {tipToShow.title}
        </h2>
        
        {tipToShow.detailedExplanation && (
          <div className="description">
            {tipToShow.detailedExplanation}
          </div>
        )}

        {tipToShow.steps && (
          <>
            <h3>Step-by-Step Guide:</h3>
            <ol className="steps-list">
              {tipToShow.steps.map((step, index) => (
                <li key={index}>
                  <div className="step-number">{index + 1}</div>
                  <div className="step-text">{step}</div>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>

      <div className="action-buttons">
        <button className="button-secondary" onClick={handleBack}>
          ← Back to Tips
        </button>
        <button 
          className={`button-primary ${isSaved ? 'saved' : ''}`}
          onClick={handleSaveTip}
        >
          <Heart fill={isSaved ? '#4caf50' : 'none'} size={16} />
          {isSaved ? 'Saved' : 'Save Tip'}
        </button>
      </div>
    </div>
  );
};

export default TipDetailScreen;
