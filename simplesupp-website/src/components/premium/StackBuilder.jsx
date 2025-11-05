import React, { useState, useEffect, useRef } from 'react';
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
  AlertTriangle,
  X,
  GripVertical,
  Settings,
  Sparkles,
  Search,
  Save,
  CheckCircle
} from 'lucide-react';
import { sampleSupplements, userStreak } from '../../lib/placeholder-data';
import { products, PRODUCT_CATEGORIES } from '../../data/products';
import GlassCard from '../shared/GlassCard';
import Button from '../shared/Button';
import Modal from '../shared/Modal';

export default function StackBuilder() {
  const [supplements, setSupplements] = useState([]);
  const [checkedToday, setCheckedToday] = useState({});
  const [showNotificationSettings, setShowNotificationSettings] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(null);
  const [showManageModal, setShowManageModal] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('aviera_user_stack');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSupplements(parsed.supplements || []);
      } catch (e) {
        console.error('Failed to load stack:', e);
        // Fallback to sample data
        setSupplements(sampleSupplements.map((s, i) => ({
          ...s,
          id: s.id || Date.now() + i,
          category: 'Performance',
          order: i,
          autoReorderThreshold: 7,
          lastUpdated: new Date().toISOString(),
        })));
      }
    } else {
      // Initialize with sample data
      setSupplements(sampleSupplements.map((s, i) => ({
        ...s,
        id: s.id || Date.now() + i,
        category: 'Performance',
        order: i,
        autoReorderThreshold: 7,
        lastUpdated: new Date().toISOString(),
      })));
    }
  }, []);

  // Save to localStorage whenever supplements change
  useEffect(() => {
    if (supplements.length > 0) {
      setSaving(true);
      const data = {
        supplements,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem('aviera_user_stack', JSON.stringify(data));
      setTimeout(() => {
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }, 500);
    }
  }, [supplements]);

  const handleCheck = (id) => {
    setCheckedToday(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddSupplement = (supplementData) => {
    const newSupplement = {
      id: Date.now(),
      name: supplementData.name,
      category: supplementData.category || 'Performance',
      dosage: supplementData.dosage || 'As directed',
      timeOfDay: supplementData.timeOfDay || 'morning',
      timeIcon: getTimeIcon(supplementData.timeOfDay || 'morning'),
      notificationTime: supplementData.notificationTime || '08:00',
      notificationEnabled: true,
      daysRemaining: supplementData.daysRemaining || 30,
      autoReorderThreshold: 7,
      lastUpdated: new Date().toISOString(),
      order: supplements.length,
      isLowStock: false,
    };
    setSupplements(prev => [...prev, newSupplement].sort((a, b) => a.order - b.order));
    setShowAddModal(false);
  };

  const handleRemoveSupplement = (id) => {
    setSupplements(prev => prev.filter(s => s.id !== id));
    setShowRemoveModal(null);
  };

  const handleUpdateSupplement = (id, updates) => {
    setSupplements(prev => prev.map(s => 
      s.id === id ? { ...s, ...updates, lastUpdated: new Date().toISOString() } : s
    ));
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newSupplements = [...supplements];
      const [removed] = newSupplements.splice(draggedIndex, 1);
      newSupplements.splice(dragOverIndex, 0, removed);
      setSupplements(newSupplements.map((s, i) => ({ ...s, order: i })));
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSetAllTime = (timeOfDay) => {
    const timeIcon = getTimeIcon(timeOfDay);
    setSupplements(prev => prev.map(s => ({
      ...s,
      timeOfDay,
      timeIcon,
      lastUpdated: new Date().toISOString(),
    })));
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getTimeIcon = (timeOfDay) => {
    const icons = {
      morning: '🌅',
      'pre-workout': '⚡',
      'post-workout': '💪',
      evening: '🌙',
      night: '😴',
    };
    return icons[timeOfDay] || '🌅';
  };

  const checkedCount = Object.values(checkedToday).filter(Boolean).length;
  const totalSupplements = supplements.length;
  const dailyCompletion = totalSupplements > 0 ? Math.round((checkedCount / totalSupplements) * 100) : 0;

  // Sort supplements by order
  const sortedSupplements = [...supplements].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--txt)]">Your Supplement Stack</h1>
            <p className="text-lg text-[var(--txt-muted)]">Track your daily supplements and stay on schedule</p>
          </div>
          <div className="flex items-center gap-2">
            {saving && (
              <div className="flex items-center gap-2 text-sm text-[var(--txt-muted)]">
                <Save size={16} className="animate-spin" />
                Saving...
              </div>
            )}
            {saved && (
              <div className="flex items-center gap-2 text-sm text-green-500">
                <CheckCircle size={16} />
                Saved
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        {supplements.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => handleSetAllTime('morning')}
              className="px-3 py-1.5 text-xs font-medium bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] border border-[var(--border)] rounded-lg text-[var(--txt-muted)] hover:text-[var(--txt)] transition"
            >
              Set All to Morning
            </button>
            <button
              onClick={() => handleSetAllTime('evening')}
              className="px-3 py-1.5 text-xs font-medium bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] border border-[var(--border)] rounded-lg text-[var(--txt-muted)] hover:text-[var(--txt)] transition"
            >
              Set All to Evening
            </button>
            <button
              onClick={() => setShowOptimizeModal(true)}
              className="px-3 py-1.5 text-xs font-medium bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] border border-[var(--border)] rounded-lg text-[var(--txt-muted)] hover:text-[var(--txt)] transition flex items-center gap-1"
            >
              <Sparkles size={12} />
              Optimize My Stack
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {supplements.length === 0 ? (
        <div className="max-w-md mx-auto mt-16">
          <GlassCard className="p-12 text-center">
            <div className="w-20 h-20 bg-[var(--acc)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Pill className="text-[var(--acc)]" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--txt)] mb-3">Your Supplement Stack is Empty</h2>
            <p className="text-[var(--txt-muted)] mb-6">
              Start building your personalized supplement stack to track your daily routine.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => setShowAddModal(true)} className="flex items-center justify-center gap-2">
                <Plus size={20} />
                Build Your Stack
              </Button>
              <Link to="/smartstack-ai">
                <Button variant="secondary" className="flex items-center justify-center gap-2">
                  <Sparkles size={20} />
                  Take Quiz to Get AI Recommendations
                </Button>
              </Link>
            </div>
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
            {sortedSupplements.map((supplement, index) => {
              const consecutiveDays = 7; // Placeholder - would calculate from history
              const showStreakBadge = consecutiveDays >= 7;
              
              return (
                <motion.div
                  key={supplement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative ${draggedIndex === index ? 'opacity-50' : ''} ${dragOverIndex === index ? 'ring-2 ring-[var(--acc)]' : ''}`}
                >
                  <GlassCard className="p-6 hover:shadow-premium-lg transition-all duration-300">
                    {/* Remove Button */}
                    <button
                      onClick={() => setShowRemoveModal(supplement)}
                      className="absolute top-4 right-4 p-1.5 hover:bg-red-500/20 rounded-lg transition text-[var(--txt-muted)] hover:text-red-400"
                      aria-label="Remove supplement"
                    >
                      <X size={16} />
                    </button>

                    {/* Drag Handle */}
                    <button
                      className="absolute top-4 left-4 p-1.5 hover:bg-[var(--bg-elev-2)] rounded-lg transition text-[var(--txt-muted)] cursor-move"
                      aria-label="Drag to reorder"
                    >
                      <GripVertical size={16} />
                    </button>

                    <div className="flex items-start gap-4 pl-6">
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
                        {/* Name and AI Button */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-[var(--txt)] mb-2">
                              {supplement.name}
                            </h3>
                            {showStreakBadge && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs font-semibold text-orange-400 mb-2">
                                <Flame size={12} />
                                {consecutiveDays} days in a row! 🔥
                              </div>
                            )}
                            <div className="flex items-center gap-3 text-sm text-[var(--txt-muted)] flex-wrap">
                              {/* Time of Day - Editable */}
                              <div className="flex items-center gap-1.5">
                                <span className="text-xl">{supplement.timeIcon}</span>
                                <select
                                  value={supplement.timeOfDay}
                                  onChange={(e) => {
                                    const timeOfDay = e.target.value;
                                    handleUpdateSupplement(supplement.id, {
                                      timeOfDay,
                                      timeIcon: getTimeIcon(timeOfDay),
                                    });
                                  }}
                                  className="text-sm font-medium bg-transparent border-none text-[var(--txt-muted)] hover:text-[var(--txt)] cursor-pointer focus:outline-none"
                                >
                                  <option value="morning">Morning</option>
                                  <option value="pre-workout">Pre-Workout</option>
                                  <option value="post-workout">Post-Workout</option>
                                  <option value="evening">Evening</option>
                                  <option value="night">Night</option>
                                </select>
                              </div>
                              <span>•</span>
                              <span className="font-medium">{supplement.dosage}</span>
                              <span className="text-xs text-[var(--txt-muted)]/60">(as per product label)</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowAIModal(true)}
                            className="p-1.5 hover:bg-[var(--bg-elev-2)] rounded-lg transition text-[var(--txt-muted)] hover:text-[var(--acc)]"
                            aria-label="Ask AI about this supplement"
                          >
                            <Sparkles size={16} />
                          </button>
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

                          {/* Manage Button */}
                          <button
                            onClick={() => setShowManageModal(supplement)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[var(--bg-elev-1)] text-[var(--txt-muted)] border border-[var(--border)] hover:bg-[var(--bg-elev-2)] hover:text-[var(--txt)] transition-all duration-200"
                          >
                            <Settings size={16} />
                            Manage
                          </button>

                          {/* Reorder Button */}
                          <Link
                            to={`/shop?product=${encodeURIComponent(supplement.name)}`}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              supplement.isLowStock
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30'
                                : 'bg-[var(--bg-elev-1)] text-[var(--txt-muted)] border border-[var(--border)] hover:bg-[var(--bg-elev-2)] hover:text-[var(--acc)] hover:border-[var(--acc)]/30'
                            }`}
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
                                  onChange={(e) => handleUpdateSupplement(supplement.id, {
                                    notificationTime: e.target.value,
                                  })}
                                  className="px-3 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-sm text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)] focus:border-transparent"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateSupplement(supplement.id, {
                                    notificationEnabled: !supplement.notificationEnabled,
                                  })}
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
              );
            })}
          </div>

          {/* Add Supplement Button */}
          <div className="flex justify-center mb-6">
            <Button
              variant="secondary"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Add Supplement
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

      {/* Add Supplement Modal */}
      <AddSupplementModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSupplement}
      />

      {/* Remove Confirmation Modal */}
      <RemoveConfirmationModal
        isOpen={showRemoveModal !== null}
        supplement={showRemoveModal}
        onClose={() => setShowRemoveModal(null)}
        onConfirm={() => showRemoveModal && handleRemoveSupplement(showRemoveModal.id)}
      />

      {/* Manage Supplement Modal */}
      <ManageSupplementModal
        isOpen={showManageModal !== null}
        supplement={showManageModal}
        onClose={() => setShowManageModal(null)}
        onUpdate={(updates) => showManageModal && handleUpdateSupplement(showManageModal.id, updates)}
      />

      {/* AI Modals */}
      <AISupplementModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
      />

      <OptimizeStackModal
        isOpen={showOptimizeModal}
        onClose={() => setShowOptimizeModal(false)}
      />
    </div>
  );
}

// Add Supplement Modal
function AddSupplementModal({ isOpen, onClose, onAdd }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [manualEntry, setManualEntry] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Performance',
    dosage: '',
    timeOfDay: 'morning',
    notificationTime: '08:00',
    daysRemaining: 30,
  });

  const categories = Object.values(PRODUCT_CATEGORIES);
  const filteredProducts = products.filter(p => 
    p.active && 
    (selectedCategory === 'all' || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFromShop = (product) => {
    onAdd({
      name: product.name,
      category: product.category,
      dosage: product.dosage || 'As directed',
      timeOfDay: 'morning',
      notificationTime: '08:00',
      daysRemaining: 30,
    });
  };

  const handleManualAdd = () => {
    if (formData.name.trim()) {
      onAdd(formData);
      setFormData({
        name: '',
        category: 'Performance',
        dosage: '',
        timeOfDay: 'morning',
        notificationTime: '08:00',
        daysRemaining: 30,
      });
      setManualEntry(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Supplement">
      <div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setManualEntry(false)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
              !manualEntry
                ? 'bg-[var(--acc)] text-white'
                : 'bg-[var(--bg-elev-1)] text-[var(--txt-muted)] hover:bg-[var(--bg-elev-2)]'
            }`}
          >
            Browse Shop
          </button>
          <button
            onClick={() => setManualEntry(true)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
              manualEntry
                ? 'bg-[var(--acc)] text-white'
                : 'bg-[var(--bg-elev-1)] text-[var(--txt-muted)] hover:bg-[var(--bg-elev-2)]'
            }`}
          >
            Manual Entry
          </button>
        </div>

        {manualEntry ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--txt)] mb-2">
                Supplement Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Creatine Monohydrate"
                className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--txt)] mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--txt)] mb-2">
                Dosage (read-only after adding)
              </label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 5g daily"
                className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--txt)] mb-2">
                Time of Day
              </label>
              <select
                value={formData.timeOfDay}
                onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
              >
                <option value="morning">Morning</option>
                <option value="pre-workout">Pre-Workout</option>
                <option value="post-workout">Post-Workout</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>
            <Button onClick={handleManualAdd} className="w-full" disabled={!formData.name.trim()}>
              Add to Stack
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-muted)]" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search supplements..."
                  className="w-full pl-10 pr-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
                />
              </div>
            </div>
            <div className="mb-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => handleAddFromShop(product)}
                  className="w-full text-left p-4 bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] rounded-lg border border-[var(--border)] transition"
                >
                  <div className="font-semibold text-[var(--txt)]">{product.name}</div>
                  <div className="text-sm text-[var(--txt-muted)] mt-1">{product.category}</div>
                  <div className="text-xs text-[var(--txt-muted)] mt-1">Dosage: {product.dosage}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Remove Confirmation Modal
function RemoveConfirmationModal({ isOpen, supplement, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Remove Supplement">
      <div className="text-center py-4">
        <p className="text-lg text-[var(--txt)] mb-6">
          Remove <strong>{supplement?.name}</strong> from your stack?
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
            Remove
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Manage Supplement Modal
function ManageSupplementModal({ isOpen, supplement, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    daysRemaining: supplement?.daysRemaining || 30,
    autoReorderThreshold: supplement?.autoReorderThreshold || 7,
  });

  useEffect(() => {
    if (supplement) {
      setFormData({
        daysRemaining: supplement.daysRemaining || 30,
        autoReorderThreshold: supplement.autoReorderThreshold || 7,
      });
    }
  }, [supplement]);

  const handleSave = () => {
    onUpdate({
      daysRemaining: parseInt(formData.daysRemaining),
      autoReorderThreshold: parseInt(formData.autoReorderThreshold),
      isLowStock: parseInt(formData.daysRemaining) < parseInt(formData.autoReorderThreshold),
    });
    onClose();
  };

  if (!supplement) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage ${supplement.name}`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--txt)] mb-2">
            Days Supply Remaining
          </label>
          <input
            type="number"
            value={formData.daysRemaining}
            onChange={(e) => setFormData({ ...formData, daysRemaining: e.target.value })}
            min="0"
            className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--txt)] mb-2">
            Auto-reorder when below (days)
          </label>
          <input
            type="number"
            value={formData.autoReorderThreshold}
            onChange={(e) => setFormData({ ...formData, autoReorderThreshold: e.target.value })}
            min="1"
            max="30"
            className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
          />
        </div>
        {supplement.lastUpdated && (
          <div className="text-sm text-[var(--txt-muted)]">
            Last updated: {new Date(supplement.lastUpdated).toLocaleDateString()}
          </div>
        )}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} className="flex-1">Save</Button>
        </div>
      </div>
    </Modal>
  );
}

// AI Modals
function AISupplementModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ask Aviera AI">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-[var(--acc)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="text-[var(--acc)]" size={32} />
        </div>
        <h3 className="text-xl font-bold text-[var(--txt)] mb-2">Coming Soon</h3>
        <p className="text-[var(--txt-muted)] mb-6">
          Ask questions about supplements, get dosage advice, and learn about interactions. This feature will be powered by AI soon.
        </p>
        <Button onClick={onClose}>Got it</Button>
      </div>
    </Modal>
  );
}

function OptimizeStackModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Optimize My Stack">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-[var(--acc)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="text-[var(--acc)]" size={32} />
        </div>
        <h3 className="text-xl font-bold text-[var(--txt)] mb-2">Coming Soon</h3>
        <p className="text-[var(--txt-muted)] mb-6">
          AI will analyze your stack and suggest optimizations, timing improvements, and potential gaps. This feature is in development.
        </p>
        <Button onClick={onClose}>Got it</Button>
      </div>
    </Modal>
  );
}
