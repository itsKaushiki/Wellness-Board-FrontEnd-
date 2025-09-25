import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../AppContext';
import { aiService } from '../aiService';
import LoadingScreen from './LoadingScreen';

const TipsScreen: React.FC = () => {
  const { profile, tips, setTips, setCurrentTip, setCurrentScreen } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Remove inline emojis from AI text while keeping layout and spacing
  const stripEmojis = useCallback((text: string) => {
    if (!text) return text;
    // Remove surrogate pair emojis and related variation selectors/ZWJ
    return text
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
      .replace(/[\uFE0F\u200D]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }, []);

  useEffect(() => {
    setCurrentScreen('home');
  }, [setCurrentScreen]);

  const generateTips = useCallback(async () => {
    if (!profile) return;
    
    setLoading(true);
    setError(null);
    try {
      const generatedTips = await aiService.generateWellnessTips(profile);
      setTips(generatedTips);
    } catch (error) {
      console.error('Failed to generate tips:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [profile, setTips]);

  useEffect(() => {
    if (profile && tips.length === 0) {
      generateTips();
    }
  }, [profile, tips.length, generateTips]);

  const handleTipClick = (tip: any) => {
    setCurrentTip(tip);
  };

  const handleRegenerate = () => {
    console.log('Regenerate button clicked');
    setTips([]);
    setError(null);
    generateTips();
  };

  if (loading) {
    return (
      <div className="screen">
        <LoadingScreen 
          title="Generating Your Personalized Tips..."
          subtitle="Our AI is crafting wellness recommendations just for you"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen">
        <div className="error-container">
          <h2>⚠️ Unable to Generate Tips</h2>
          <p className="error-message">{error}</p>
          {error.includes('API key') && (
            <div className="api-key-help">
              <p>To use this app, you need to:</p>
              <ol>
                <li>Get a free Gemini API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                <li>Add it to your .env file: <code>REACT_APP_GEMINI_API_KEY=your_key_here</code></li>
                <li>Restart the application</li>
              </ol>
            </div>
          )}
          <button className="button" onClick={handleRegenerate}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="saved-tips-header">
        <h1>🌟 Your Wellness Board</h1>
        <p>Personalized wellness recommendations crafted just for you</p>
      </div>

      <div className="tips-grid">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="tip-card"
            onClick={() => handleTipClick(tip)}
          >
            <div className="tip-header">
              <div className="tip-icon">{tip.icon}</div>
              <div className="tip-title">{stripEmojis(tip.title)}</div>
            </div>
            <div className="tip-description">{stripEmojis(tip.description)}</div>
          </div>
        ))}
      </div>

      <button 
        className="button regenerate-button" 
        onClick={handleRegenerate}
        disabled={loading}
      >
        🔄 Generate New Tips
      </button>
    </div>
  );
};

export default TipsScreen;
