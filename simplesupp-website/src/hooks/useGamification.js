import { useState, useEffect, useCallback } from 'react';
import { awardXP, updateTodayProgress, XP_VALUES, checkAchievements } from '../lib/gamification';
import { XPToast } from '../components/gamification/XPDisplay';

// Custom hook for gamification
export function useGamification() {
  const [xpToast, setXpToast] = useState({ visible: false, xp: 0, action: '' });
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState([]);

  // Show XP toast
  const showXPToast = useCallback((xp, action) => {
    setXpToast({ visible: true, xp, action });
    setTimeout(() => {
      setXpToast({ visible: false, xp: 0, action: '' });
    }, 3000);
  }, []);

  // Award XP for taking a supplement
  const awardSupplementXP = useCallback(() => {
    const data = require('../lib/gamification').loadGamificationData();
    const result = awardXP(data, XP_VALUES.SUPPLEMENT_TAKEN, 'supplement_taken');
    showXPToast(XP_VALUES.SUPPLEMENT_TAKEN, 'Supplement Taken');
    
    // Check achievements
    const achievementResult = checkAchievements(result.data);
    if (achievementResult.newlyUnlocked.length > 0) {
      setNewlyUnlockedAchievements(achievementResult.newlyUnlocked);
    }
    
    return result;
  }, [showXPToast]);

  // Award XP for completing workout
  const awardWorkoutXP = useCallback(() => {
    const data = require('../lib/gamification').loadGamificationData();
    const result = awardXP(data, XP_VALUES.WORKOUT_COMPLETE, 'workout_complete');
    showXPToast(XP_VALUES.WORKOUT_COMPLETE, 'Workout Complete');
    
    // Check achievements
    const achievementResult = checkAchievements(result.data);
    if (achievementResult.newlyUnlocked.length > 0) {
      setNewlyUnlockedAchievements(achievementResult.newlyUnlocked);
    }
    
    return result;
  }, [showXPToast]);

  // Award XP for PR
  const awardPRXP = useCallback(() => {
    const data = require('../lib/gamification').loadGamificationData();
    const result = awardXP(data, XP_VALUES.PERSONAL_RECORD, 'personal_record');
    showXPToast(XP_VALUES.PERSONAL_RECORD, 'New Personal Record!');
    
    return result;
  }, [showXPToast]);

  // Update today's progress
  const updateProgress = useCallback((supplementsTaken, supplementsTotal, workoutComplete) => {
    const result = updateTodayProgress(supplementsTaken, supplementsTotal, workoutComplete);
    
    if (result.newlyUnlockedAchievements.length > 0) {
      setNewlyUnlockedAchievements(result.newlyUnlockedAchievements);
    }
    
    return result;
  }, []);

  return {
    awardSupplementXP,
    awardWorkoutXP,
    awardPRXP,
    updateProgress,
    xpToast,
    newlyUnlockedAchievements,
    clearAchievements: () => setNewlyUnlockedAchievements([]),
  };
}

