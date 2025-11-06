import React, { useState, useEffect } from 'react';
import { Target, Bell, User, LogOut, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/shared/Button';
import ReassessmentForm from '../components/premium/ReassessmentForm';
import GlassCard from '../components/shared/GlassCard';
import { loadGamificationData, saveGamificationData } from '../lib/gamification';

export default function Settings() {
  const [showReassessment, setShowReassessment] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [data, setData] = useState(loadGamificationData());
  
  // Goal tracking preferences
  const [trackWater, setTrackWater] = useState(true);
  const [trackSleep, setTrackSleep] = useState(true);
  const [trackMeals, setTrackMeals] = useState(true);
  const [trackMacros, setTrackMacros] = useState(true);
  const [waterGoal, setWaterGoal] = useState(8);
  const [sleepTarget, setSleepTarget] = useState(8);

  useEffect(() => {
    const goalSettings = data.dailyGoalsSettings || {
      trackWater: true,
      trackSleep: true,
      trackMeals: true,
      trackMacros: true,
      waterGoal: 8,
      sleepTarget: 8,
    };
    setTrackWater(goalSettings.trackWater);
    setTrackSleep(goalSettings.trackSleep);
    setTrackMeals(goalSettings.trackMeals);
    setTrackMacros(goalSettings.trackMacros);
    setWaterGoal(goalSettings.waterGoal);
    setSleepTarget(goalSettings.sleepTarget);
  }, []);

  const handleSaveGoals = () => {
    const newData = {
      ...data,
      dailyGoalsSettings: {
        trackWater,
        trackSleep,
        trackMeals,
        trackMacros,
        waterGoal,
        sleepTarget,
      },
    };
    // Also update water daily goal in water data
    if (newData.water) {
      newData.water.dailyGoal = waterGoal;
    }
    saveGamificationData(newData);
    setData(newData);
    alert('Goal preferences saved!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[var(--txt)]">Settings</h1>
        <p className="text-[var(--txt-muted)]">Manage your account and preferences.</p>
      </div>

      {/* Reassessment */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-[var(--acc)]" size={24} />
          <h2 className="text-xl font-bold text-[var(--txt)]">Goals & Progress</h2>
        </div>
        <p className="text-[var(--txt-muted)] mb-4">
          Update your goals, progress, and preferences to keep your plan personalized.
        </p>
        <Button variant="primary" onClick={() => setShowReassessment(true)}>
          <Target size={20} />
          Update Goals & Progress
        </Button>
      </div>

      {/* Daily Goals Configuration */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-[var(--acc)]" size={24} />
          <h2 className="text-xl font-bold text-[var(--txt)]">Daily Goal Tracking</h2>
        </div>
        <p className="text-[var(--txt-muted)] mb-6">
          Customize which goals you want to track and adjust your targets.
        </p>

        <div className="space-y-4 mb-6">
          {/* Toggle Switches */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--txt)]">Track water intake</p>
                <p className="text-sm text-[var(--txt-muted)]">Daily hydration goal</p>
              </div>
              <button
                onClick={() => setTrackWater(!trackWater)}
                className={`w-12 h-6 rounded-full transition ${
                  trackWater ? 'bg-[var(--acc)]' : 'bg-[var(--bg-elev-1)]'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    trackWater ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                  style={{ marginTop: '2px' }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--txt)]">Track sleep quality</p>
                <p className="text-sm text-[var(--txt-muted)]">7-8+ hours per night</p>
              </div>
              <button
                onClick={() => setTrackSleep(!trackSleep)}
                className={`w-12 h-6 rounded-full transition ${
                  trackSleep ? 'bg-[var(--acc)]' : 'bg-[var(--bg-elev-1)]'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    trackSleep ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                  style={{ marginTop: '2px' }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--txt)]">Track meals</p>
                <p className="text-sm text-[var(--txt-muted)]">Meal check-ins</p>
              </div>
              <button
                onClick={() => setTrackMeals(!trackMeals)}
                className={`w-12 h-6 rounded-full transition ${
                  trackMeals ? 'bg-[var(--acc)]' : 'bg-[var(--bg-elev-1)]'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    trackMeals ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                  style={{ marginTop: '2px' }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--txt)]">Track macros</p>
                <p className="text-sm text-[var(--txt-muted)]">Protein, carbs, fats</p>
              </div>
              <button
                onClick={() => setTrackMacros(!trackMacros)}
                className={`w-12 h-6 rounded-full transition ${
                  trackMacros ? 'bg-[var(--acc)]' : 'bg-[var(--bg-elev-1)]'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    trackMacros ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                  style={{ marginTop: '2px' }}
                />
              </button>
            </div>
          </div>

          {/* Adjust Targets */}
          {trackWater && (
            <div className="pt-4 border-t border-[var(--border)]">
              <label className="block text-sm font-medium text-[var(--txt)] mb-2">
                Water goal (glasses/day)
              </label>
              <input
                type="number"
                value={waterGoal}
                onChange={(e) => setWaterGoal(parseInt(e.target.value) || 8)}
                min="1"
                max="20"
                className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
              />
            </div>
          )}

          {trackSleep && (
            <div className="pt-4 border-t border-[var(--border)]">
              <label className="block text-sm font-medium text-[var(--txt)] mb-2">
                Sleep target (hours)
              </label>
              <input
                type="number"
                value={sleepTarget}
                onChange={(e) => setSleepTarget(parseInt(e.target.value) || 8)}
                min="5"
                max="12"
                className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
              />
            </div>
          )}
        </div>

        <Button onClick={handleSaveGoals} variant="primary" className="w-full">
          <Save size={16} />
          Save Preferences
        </Button>
      </GlassCard>

      {/* Notifications */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="text-[var(--acc)]" size={24} />
          <h2 className="text-xl font-bold text-[var(--txt)]">Notifications</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium mb-1 text-[var(--txt)]">Push Notifications</p>
            <p className="text-[var(--txt-muted)] text-sm">Get reminded to take your supplements</p>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`
              w-12 h-6 rounded-full transition
              ${notificationsEnabled ? 'bg-[var(--acc)]' : 'bg-[var(--bg-elev-1)]'}
            `}
          >
            <div
              className={`
                w-5 h-5 bg-white rounded-full transition-transform
                ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'}
              `}
              style={{ marginTop: '2px' }}
            />
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="text-[var(--acc)]" size={24} />
          <h2 className="text-xl font-bold text-[var(--txt)]">Account</h2>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-[var(--txt-muted)] text-sm mb-1">Email</p>
            <p className="font-medium text-[var(--txt)]">user@example.com</p>
          </div>
          <div>
            <p className="text-[var(--txt-muted)] text-sm mb-1">Subscription</p>
            <p className="font-medium text-[var(--acc)]">Premium - $9.99/month</p>
          </div>
        </div>
      </div>

      {/* Log Out */}
      <div className="glass-card p-6">
        <Button variant="secondary" className="w-full">
          <LogOut size={20} />
          Log Out
        </Button>
      </div>

      {/* Reassessment Modal */}
      <ReassessmentForm isOpen={showReassessment} onClose={() => setShowReassessment(false)} />
    </div>
  );
}
