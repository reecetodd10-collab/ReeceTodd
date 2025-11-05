import React, { useState } from 'react';
import { Target, Bell, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/shared/Button';
import ReassessmentForm from '../components/premium/ReassessmentForm';

export default function Settings() {
  const [showReassessment, setShowReassessment] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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
