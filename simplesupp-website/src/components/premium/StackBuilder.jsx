import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  Clock, 
  Bell, 
  BellOff, 
  ShoppingCart, 
  Plus,
  Check,
  Flame,
  Edit3,
  AlertTriangle
} from 'lucide-react';
import { sampleSupplements, userStreak } from '../../lib/placeholder-data';
import GlassCard from '../shared/GlassCard';
import Button from '../shared/Button';
import Modal from '../shared/Modal';

export default function StackBuilder() {
  const [supplements, setSupplements] = useState(sampleSupplements);
  const [checkedToday, setCheckedToday] = useState({});
  const [showNotificationSettings, setShowNotificationSettings] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCheck = (id) => {
    setCheckedToday(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleNotification = (id) => {
    setSupplements(prev => prev.map(s => 
      s.id === id ? { ...s, notificationEnabled: !s.notificationEnabled } : s
    ));
  };

  const handleNotificationTimeChange = (id, newTime) => {
    setSupplements(prev => prev.map(s => 
      s.id === id ? { ...s, notificationTime: newTime } : s
    ));
  };

  const handleReorder = (supplement) => {
    window.location.href = `/shop?product=${encodeURIComponent(supplement.name)}`;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Calculate weekly completion based on checked supplements
  const checkedCount = Object.values(checkedToday).filter(Boolean).length;
  const totalSupplements = supplements.length;
  const dailyCompletion = totalSupplements > 0 ? Math.round((checkedCount / totalSupplements) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--txt)]">Your Supplement Stack</h1>
        <p className="text-lg text-[var(--txt-muted)]">Track your daily supplements and stay on schedule</p>
      </div>

      {/* Empty State */}
      {supplements.length === 0 ? (
        <div className="max-w-md mx-auto mt-16">
          <GlassCard className="p-12 text-center">
            <div className="w-20 h-20 bg-[var(--acc)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Pill className="text-[var(--acc)]" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--txt)] mb-3">No Supplements Yet</h2>
            <p className="text-[var(--txt-muted)] mb-6">
              Start building your personalized supplement stack to track your daily routine.
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus size={20} />
              Build Your Stack
            </Button>
          </GlassCard>
        </div>
      ) : (
        <>
          {/* Streak Counter & Weekly Stats */}
          <div className="glass-card p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center">
                  <Flame className="text-orange-400" size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[var(--txt)]">
                      🔥 {userStreak.current} day streak!
                    </span>
                  </div>
                  <p className="text-sm text-[var(--txt-muted)] mt-1">
                    Keep it going - your longest was {userStreak.longest} days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center md:text-right">
                  <div className="text-2xl font-bold text-[var(--txt)]">{dailyCompletion}%</div>
                  <p className="text-sm text-[var(--txt-muted)]">Today</p>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-2xl font-bold text-[var(--txt)]">{userStreak.weeklyCompletion}%</div>
                  <p className="text-sm text-[var(--txt-muted)]">This week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Supplement Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {supplements.map((supplement) => (
              <motion.div
                key={supplement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="p-6 hover:shadow-premium-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    {/* Large Checkbox */}
                    <motion.button
                      onClick={() => handleCheck(supplement.id)}
                      className={`
                        w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0
                        ${checkedToday[supplement.id]
                          ? 'bg-[var(--acc)] border-[var(--acc)] shadow-accent'
                          : 'border-[var(--border)] hover:border-[var(--acc)] hover:bg-[var(--acc)]/10'
                        }
                      `}
                      whileTap={{ scale: 0.95 }}
                    >
                      <AnimatePresence>
                        {checkedToday[supplement.id] && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Check size={20} className="text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* Supplement Info */}
                    <div className="flex-1 min-w-0">
                      {/* Name and Time */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-[var(--txt)] mb-2">
                            {supplement.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-[var(--txt-muted)] flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xl">{supplement.timeIcon}</span>
                              <span>{supplement.time}</span>
                            </div>
                            <span>•</span>
                            <span className="font-medium">{supplement.dosage}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center text-xs mb-2">
                          <span className="text-[var(--txt-muted)]">Supply remaining</span>
                          <div className="flex items-center gap-1">
                            {supplement.isLowStock && (
                              <AlertTriangle size={14} className="text-yellow-400" />
                            )}
                            <span className={`font-semibold ${supplement.isLowStock ? 'text-yellow-400' : 'text-[var(--txt)]'}`}>
                              {supplement.daysRemaining} days {supplement.isLowStock && '⚠️'}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-[var(--bg-elev-2)] rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${Math.min(100, (supplement.daysRemaining / 30) * 100)}%` 
                            }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              supplement.isLowStock 
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                                : 'bg-gradient-to-r from-[var(--acc)] to-blue-500'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Actions Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Notification Toggle */}
                        <button
                          onClick={() => setShowNotificationSettings(
                            showNotificationSettings === supplement.id ? null : supplement.id
                          )}
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${supplement.notificationEnabled
                              ? 'bg-[var(--acc)]/20 text-[var(--acc)] border border-[var(--acc)]/30'
                              : 'bg-[var(--bg-elev-1)] text-[var(--txt-muted)] border border-[var(--border)] hover:bg-[var(--bg-elev-2)] hover:text-[var(--txt)]'
                            }
                          `}
                        >
                          {supplement.notificationEnabled ? (
                            <Bell size={16} />
                          ) : (
                            <BellOff size={16} />
                          )}
                          <Clock size={14} />
                          <span className="text-xs">{formatTime(supplement.notificationTime)}</span>
                        </button>

                        {/* Reorder Button */}
                        <Link
                          to={`/shop?product=${encodeURIComponent(supplement.name)}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[var(--bg-elev-1)] text-[var(--txt-muted)] border border-[var(--border)] hover:bg-[var(--bg-elev-2)] hover:text-[var(--acc)] hover:border-[var(--acc)]/30 transition-all duration-200"
                        >
                          <ShoppingCart size={16} />
                          Reorder
                        </Link>
                      </div>

                      {/* Notification Settings Panel */}
                      <AnimatePresence>
                        {showNotificationSettings === supplement.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 pt-4 border-t border-[var(--border)]"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <label className="text-sm font-medium text-[var(--txt)]">
                                Notification Time:
                              </label>
                              <input
                                type="time"
                                value={supplement.notificationTime}
                                onChange={(e) => handleNotificationTimeChange(supplement.id, e.target.value)}
                                className="px-3 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-sm text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)] focus:border-transparent"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => toggleNotification(supplement.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  supplement.notificationEnabled
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                                    : 'bg-[var(--acc)]/20 text-[var(--acc)] border border-[var(--acc)]/30 hover:bg-[var(--acc)]/30'
                                }`}
                              >
                                {supplement.notificationEnabled ? 'Disable' : 'Enable'}
                              </button>
                              <button
                                onClick={() => {
                                  // TODO: Test notification
                                  alert(`Test notification scheduled for ${formatTime(supplement.notificationTime)}!`);
                                }}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--bg-elev-1)] text-[var(--txt-muted)] border border-[var(--border)] hover:bg-[var(--bg-elev-2)] hover:text-[var(--txt)] transition-all duration-200"
                              >
                                Test Notification
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={20} />
              Add Supplement
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowEditModal(true)}
            >
              <Edit3 size={20} />
              Edit Stack
            </Button>
          </div>

          {/* Premium Member Badge */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--acc)]/20 rounded-full flex items-center justify-center">
                <Pill className="text-[var(--acc)]" size={20} />
              </div>
              <div>
                <p className="font-semibold text-[var(--txt)]">Premium Member</p>
                <p className="text-sm text-[var(--txt-muted)]">10% off all supplement orders</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Coming Soon Modals */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Supplement"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[var(--acc)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="text-[var(--acc)]" size={32} />
          </div>
          <h3 className="text-xl font-bold text-[var(--txt)] mb-2">Coming Soon</h3>
          <p className="text-[var(--txt-muted)] mb-6">
            We're working on building out the supplement library. Check back soon to add new supplements to your stack!
          </p>
          <Button onClick={() => setShowAddModal(false)}>Got it</Button>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Stack"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[var(--acc)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit3 className="text-[var(--acc)]" size={32} />
          </div>
          <h3 className="text-xl font-bold text-[var(--txt)] mb-2">Coming Soon</h3>
          <p className="text-[var(--txt-muted)] mb-6">
            Stack editing features are in development. You'll soon be able to reorder, remove, and adjust dosages directly from here.
          </p>
          <Button onClick={() => setShowEditModal(false)}>Got it</Button>
        </div>
      </Modal>
    </div>
  );
}
