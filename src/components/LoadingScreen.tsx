import React from 'react';

interface LoadingScreenProps {
  title: string;
  subtitle: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ title, subtitle }) => {
  return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
};

export default LoadingScreen;
