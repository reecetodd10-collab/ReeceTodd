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
  FlaskConical
} from 'lucide-react';
import StackBuilder from '../components/premium/StackBuilder';
import WorkoutPlanner from '../components/premium/WorkoutPlanner';
import SettingsPage from './Settings';
import UpgradePrompt from '../components/shared/UpgradePrompt';
import AIChat from '../components/premium/AIChat';
import PillLogo from '../components/PillLogo';
import { hasPremiumAccess, TESTING_MODE } from '../lib/config';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // TODO: Replace with actual user subscription check from backend
  const userIsPremium = false; // User's actual premium status from backend
  const isPremium = hasPremiumAccess(userIsPremium); // Respects testing mode

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Pill, label: 'Stack Builder', path: '/dashboard/stack' },
    { icon: Dumbbell, label: 'Workout Planner', path: '/dashboard/fit' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
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
            <div className="mt-3 px-3 py-1.5 bg-[var(--acc)]/20 border border-[var(--acc)]/30 rounded-lg text-center">
              <span className="text-xs font-semibold text-[var(--acc)]">Free Tier</span>
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

        {/* Content */}
        <div className="p-6 lg:p-8">
          {location.pathname === '/dashboard' && <DashboardOverview isPremium={isPremium} />}
          {location.pathname === '/dashboard/stack' && isPremium && <StackBuilder />}
          {location.pathname === '/dashboard/fit' && isPremium && <WorkoutPlanner />}
          {location.pathname === '/dashboard/settings' && <SettingsPage />}
          
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
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview({ isPremium }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[var(--txt)]">Welcome back!</h1>
        <p className="text-[var(--txt-muted)]">Here's your fitness overview.</p>
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

      {isPremium && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[var(--acc)]/20 flex items-center justify-center">
              <span className="text-lg">🔥</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--txt)]">Progress</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[var(--txt-muted)]">Streak</span>
                <span className="font-bold text-[var(--txt)]">🔥 7 days</span>
              </div>
              <div className="w-full bg-[var(--bg-elev-2)] rounded-full h-2">
                <div className="bg-[var(--acc)] h-2 rounded-full" style={{ width: '58%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[var(--txt-muted)]">Weekly Completion</span>
                <span className="font-bold text-[var(--txt)]">85%</span>
              </div>
              <div className="w-full bg-[var(--bg-elev-2)] rounded-full h-2">
                <div className="bg-[var(--acc)] h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
