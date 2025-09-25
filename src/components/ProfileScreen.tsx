import React, { useState } from 'react';
import { useApp } from '../AppContext';

const ProfileScreen: React.FC = () => {
  const { setProfile } = useApp();
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const goals = [
    { id: 'weight-loss', label: 'Weight Loss', icon: '⚖️' },
    { id: 'muscle-gain', label: 'Muscle Gain', icon: '💪' },
    { id: 'stress-relief', label: 'Stress Relief', icon: '🧘' },
    { id: 'better-sleep', label: 'Better Sleep', icon: '🌙' },
    { id: 'energy-boost', label: 'Energy Boost', icon: '⚡' },
    { id: 'flexibility', label: 'Flexibility', icon: '🤸' },
  ];

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age && gender && selectedGoals.length > 0) {
      setProfile({
        age: parseInt(age),
        gender,
        goals: selectedGoals,
      });
    }
  };

  const canSubmit = age && gender && selectedGoals.length > 0;

  return (
    <div className="screen">
      <div className="header">
        <h1>Welcome to Wellness Board</h1>
        <p>Tell us about yourself to get personalized health tips</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            min="13"
            max="120"
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div className="form-group">
          <label>Health Goals (Select one or more)</label>
          <div className="goals-grid">
            {goals.map(goal => (
              <div
                key={goal.id}
                className={`goal-option ${selectedGoals.includes(goal.id) ? 'selected' : ''}`}
                onClick={() => toggleGoal(goal.id)}
              >
                <div className="icon">{goal.icon}</div>
                <div className="text">{goal.label}</div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="button" disabled={!canSubmit}>
          Get My Wellness Tips
        </button>
      </form>
    </div>
  );
};

export default ProfileScreen;
