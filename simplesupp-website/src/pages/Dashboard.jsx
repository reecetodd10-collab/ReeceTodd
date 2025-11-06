import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Pill, 
  Dumbbell, 
  Settings, 
  LogOut,
  Menu,
  X,
  Crown,
  User,
  FlaskConical,
  Target,
  CreditCard,
  Trophy,
  TrendingUp
} from 'lucide-react';
import StackBuilder from '../components/premium/StackBuilder';
import WorkoutPlanner from '../components/premium/WorkoutPlanner';
import SettingsPage from './Settings';
import BillingPage from './Billing';
import WelcomePage from './Welcome';
import AchievementsPage from './dashboard/Achievements';
import ProgressPage from './dashboard/Progress';
import UpgradePrompt from '../components/shared/UpgradePrompt';
import AIChat from '../components/premium/AIChat';
import Reassessment from '../components/premium/Reassessment';
import HabitRings from '../components/gamification/HabitRings';
import WeeklySummary from '../components/gamification/WeeklySummary';
import XPDisplay from '../components/gamification/XPDisplay';
import StreakCounter from '../components/gamification/StreakCounter';
import WaterTracker from '../components/tracking/WaterTracker';
import SleepTracker from '../components/tracking/SleepTracker';
import PillLogo from '../components/PillLogo';
import Button from '../components/shared/Button';
import { hasPremiumAccess, TESTING_MODE } from '../lib/config';
import { loadGamificationData } from '../lib/gamification';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showReassessment, setShowReassessment] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // TODO: Replace with actual user subscription check from backend
  const userIsPremium = false; // User's actual premium status from backend
  const isPremium = hasPremiumAccess(userIsPremium); // Respects testing mode

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Pill, label: 'Stack Builder', path: '/dashboard/stack' },
    { icon: Dumbbell, label: 'Workout Planner', path: '/dashboard/fit' },
    { icon: TrendingUp, label: 'Progress', path: '/dashboard/progress' },
    { icon: Trophy, label: 'Achievements', path: '/dashboard/achievements' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: CreditCard, label: 'Billing', path: '/dashboard/billing' },
  ];

  const handleNavClick = (path) => {
    // Only show upgrade modal if not in testing mode and user doesn't have premium
    if (!TESTING_MODE && !isPremium && (path === '/dashboard/stack' || path === '/dashboard/fit')) {
      setShowUpgradeModal(true);
      return;
    }
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[var(--bg-elev-1)] backdrop-blur-[var(--glass-blur)] border-r border-[var(--border)]
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <PillLogo size="small" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-[var(--bg-elev-2)] rounded-lg transition"
            >
              <X size={20} className="text-[var(--txt)]" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--txt)]">Aviera Premium</h1>
            {isPremium && !TESTING_MODE && (
              <Crown size={18} className="text-[var(--acc)]" />
            )}
          </div>
          {!isPremium && !TESTING_MODE && (
            <div className="mt-3 space-y-2">
              <div className="px-3 py-1.5 bg-[var(--acc)]/20 border border-[var(--acc)]/30 rounded-lg text-center">
                <span className="text-xs font-semibold text-[var(--acc)]">Free Tier</span>
              </div>
              <Link to="/pricing" className="block">
                <Button variant="primary" className="w-full text-xs py-2">
                  Upgrade to Premium
                </Button>
              </Link>
            </div>
          )}
          {isPremium && !TESTING_MODE && (
            <div className="mt-3 space-y-2">
              <div className="px-3 py-1.5 bg-[var(--acc)]/20 border border-[var(--acc)]/30 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <Crown size={12} className="text-[var(--acc)]" />
                  <span className="text-xs font-semibold text-[var(--acc)]">Premium Member</span>
                </div>
              </div>
              <Link to="/dashboard/billing" className="block">
                <button className="w-full px-3 py-2 text-xs font-medium bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] border border-[var(--border)] rounded-lg text-[var(--txt-muted)] hover:text-[var(--txt)] transition">
                  Manage Subscription
                </button>
              </Link>
            </div>
          )}
          {TESTING_MODE && (
            <div className="mt-3 px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
              <span className="text-xs font-semibold text-yellow-400 flex items-center justify-center gap-1">
                <FlaskConical size={12} />
                Testing Mode
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isPremiumFeature = item.path === '/dashboard/stack' || item.path === '/dashboard/fit';
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
                  ${isActive 
                    ? 'bg-[var(--acc)]/20 text-[var(--acc)] border border-[var(--acc)]/30' 
                    : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-2)] hover:text-[var(--txt)]'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {isPremiumFeature && !isPremium && !TESTING_MODE && (
                  <Crown size={14} className="ml-auto text-[var(--acc)] opacity-60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-[var(--border)] bg-[var(--bg-elev-1)]">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[var(--acc)]/20 flex items-center justify-center">
              <User size={16} className="text-[var(--acc)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--txt)] truncate">User Name</p>
              <p className="text-xs text-[var(--txt-muted)] truncate">user@example.com</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-[var(--txt-muted)] hover:bg-[var(--bg-elev-2)] rounded-lg transition">
            <LogOut size={18} />
            <span className="text-sm">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Testing Mode Indicator - Top Right */}
        {TESTING_MODE && (
          <div className="fixed top-4 right-4 z-50 px-3 py-1.5 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg text-xs font-semibold text-yellow-400 flex items-center gap-1.5 shadow-lg">
            <FlaskConical size={14} />
            Testing Mode
          </div>
        )}
        
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-[var(--bg-elev-1)] backdrop-blur-[var(--glass-blur)] border-b border-[var(--border)] p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-[var(--bg-elev-2)] rounded-lg transition"
          >
            <Menu size={24} className="text-[var(--txt)]" />
          </button>
        </div>

        {/* Top Navigation Bar - Desktop */}
        <div className="hidden lg:flex sticky top-0 z-30 bg-[var(--bg-elev-1)]/80 backdrop-blur-[var(--glass-blur)] border-b border-[var(--border)] px-8 py-4 items-center justify-end gap-4">
          <button
            onClick={() => setShowReassessment(true)}
            className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg text-sm font-medium text-[var(--txt)] hover:bg-[var(--bg-elev-2)] transition border border-[var(--border)]"
          >
            <Target size={16} />
            🎯 Update Goals
          </button>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[var(--acc)]/20 flex items-center justify-center">
              <User size={16} className="text-[var(--acc)]" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-[var(--txt)]">User Name</p>
              <p className="text-xs text-[var(--txt-muted)]">user@example.com</p>
            </div>
          </div>
        </div>

        {/* Mobile Top Bar with Update Goals */}
        <div className="lg:hidden sticky top-[73px] z-30 bg-[var(--bg-elev-1)]/80 backdrop-blur-[var(--glass-blur)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setShowReassessment(true)}
            className="flex items-center gap-2 px-3 py-2 glass-card rounded-lg text-xs font-medium text-[var(--txt)] hover:bg-[var(--bg-elev-2)] transition border border-[var(--border)]"
          >
            <Target size={14} />
            🎯 Update Goals
          </button>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {location.pathname === '/dashboard' && <DashboardOverview isPremium={isPremium} />}
          {location.pathname === '/dashboard/welcome' && <WelcomePage />}
          {location.pathname === '/dashboard/stack' && isPremium && <StackBuilder />}
          {location.pathname === '/dashboard/fit' && isPremium && <WorkoutPlanner />}
          {location.pathname === '/dashboard/progress' && <ProgressPage />}
          {location.pathname === '/dashboard/achievements' && <AchievementsPage />}
          {location.pathname === '/dashboard/settings' && <SettingsPage />}
          {location.pathname === '/dashboard/billing' && <BillingPage />}
          
          {/* Premium Gate Message */}
          {!TESTING_MODE && !isPremium && (location.pathname === '/dashboard/stack' || location.pathname === '/dashboard/fit') && (
            <div className="max-w-2xl mx-auto mt-12">
              <div className="glass-card p-8 text-center">
                <Crown size={48} className="mx-auto mb-4 text-[var(--acc)]" />
                <h2 className="text-2xl font-bold text-[var(--txt)] mb-3">Premium Feature</h2>
                <p className="text-[var(--txt-muted)] mb-6">
                  {location.pathname === '/dashboard/stack' 
                    ? 'Unlock AI-powered supplement stack builder with tracking and notifications.'
                    : 'Unlock custom workout plans with progressive overload tracking.'}
                </p>
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="btn-primary"
                >
                  Upgrade to Premium
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Premium Upgrade Modal - Only show if not in testing mode */}
      {!TESTING_MODE && (
        <UpgradePrompt isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      )}

      {/* AI Chat Widget - Available on all dashboard pages */}
      <AIChat userIsPremium={userIsPremium} />

      {/* Reassessment Modal */}
      <Reassessment isOpen={showReassessment} onClose={() => setShowReassessment(false)} />
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview({ isPremium }) {
  const [gamificationData, setGamificationData] = React.useState(loadGamificationData());
  const [supplementsTaken, setSupplementsTaken] = React.useState(0);
  const [supplementsTotal, setSupplementsTotal] = React.useState(0);
  const [workoutComplete, setWorkoutComplete] = React.useState(false);

  React.useEffect(() => {
    // Load supplement data from stack
    const userStack = localStorage.getItem('aviera_user_stack');
    if (userStack) {
      try {
        const stack = JSON.parse(userStack);
        const checkedToday = JSON.parse(localStorage.getItem('aviera_checked_today') || '{}');
        const taken = Object.values(checkedToday).filter(Boolean).length;
        setSupplementsTotal(stack.supplements?.length || 0);
        setSupplementsTaken(taken);
      } catch (e) {
        console.error('Failed to load stack data:', e);
      }
    }

    // Load workout completion
    const workoutData = localStorage.getItem('aviera_workout_plan');
    if (workoutData) {
      try {
        const plan = JSON.parse(workoutData);
        const today = new Date().getDay();
        const dayMapping = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
        const currentDayName = dayMapping[today];
        const currentWeek = plan.weeks?.[plan.currentWeekIndex];
        const todayWorkout = currentWeek?.days?.find(d => d.day === currentDayName);
        setWorkoutComplete(todayWorkout?.completed || false);
      } catch (e) {
        console.error('Failed to load workout data:', e);
      }
    }

    // Reload gamification data
    const interval = setInterval(() => {
      setGamificationData(loadGamificationData());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[var(--txt)]">Welcome back!</h1>
        <p className="text-[var(--txt-muted)]">Here's your fitness overview.</p>
      </div>

      {/* Habit Rings - Prominent Display */}
      <HabitRings 
        supplementsTaken={supplementsTaken}
        supplementsTotal={supplementsTotal}
        workoutComplete={workoutComplete}
      />

      {/* Water & Sleep Tracking */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <WaterTracker />
        <SleepTracker />
      </div>

      {/* Weekly Summary */}
      <div className="mb-8">
        <WeeklySummary />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Pill className="text-[var(--acc)]" size={24} />
            <h2 className="text-xl font-bold text-[var(--txt)]">Your Stack</h2>
          </div>
          {isPremium ? (
            <>
              <p className="text-[var(--txt-muted)] mb-4">3 supplements in your daily routine</p>
              <Link to="/dashboard/stack" className="text-[var(--acc)] hover:underline inline-flex items-center gap-1">
                Manage Stack →
              </Link>
            </>
          ) : (
            <>
              <p className="text-[var(--txt-muted)] mb-4">Upgrade to unlock stack tracking</p>
              <Link to="/smartstack-ai" className="text-[var(--acc)] hover:underline inline-flex items-center gap-1">
                Get Started →
              </Link>
            </>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Dumbbell className="text-[var(--acc)]" size={24} />
            <h2 className="text-xl font-bold text-[var(--txt)]">This Week's Workouts</h2>
          </div>
          {isPremium ? (
            <>
              <p className="text-[var(--txt-muted)] mb-4">4 of 7 workouts completed</p>
              <Link to="/dashboard/fit" className="text-[var(--acc)] hover:underline inline-flex items-center gap-1">
                View Plan →
              </Link>
            </>
          ) : (
            <>
              <p className="text-[var(--txt-muted)] mb-4">Upgrade to unlock workout planner</p>
              <Link to="/smartfitt" className="text-[var(--acc)] hover:underline inline-flex items-center gap-1">
                Get Started →
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Gamification Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <XPDisplay compact={false} />
        </div>
        <div className="glass-card p-6">
          <StreakCounter compact={false} />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/dashboard/progress" className="glass-card p-4 hover:shadow-premium-lg transition cursor-pointer">
          <TrendingUp className="text-[var(--acc)] mb-2" size={24} />
          <h3 className="font-semibold text-[var(--txt)] mb-1">View Progress</h3>
          <p className="text-sm text-[var(--txt-muted)]">See detailed stats</p>
        </Link>
        <Link to="/dashboard/achievements" className="glass-card p-4 hover:shadow-premium-lg transition cursor-pointer">
          <Trophy className="text-[var(--acc)] mb-2" size={24} />
          <h3 className="font-semibold text-[var(--txt)] mb-1">Achievements</h3>
          <p className="text-sm text-[var(--txt-muted)]">Unlock badges</p>
        </Link>
        {isPremium && (
          <Link to="/dashboard/stack" className="glass-card p-4 hover:shadow-premium-lg transition cursor-pointer">
            <Pill className="text-[var(--acc)] mb-2" size={24} />
            <h3 className="font-semibold text-[var(--txt)] mb-1">Manage Stack</h3>
            <p className="text-sm text-[var(--txt-muted)]">Track supplements</p>
          </Link>
        )}
      </div>
    </div>
  );
}
