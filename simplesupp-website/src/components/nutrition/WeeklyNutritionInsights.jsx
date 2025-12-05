import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import { loadGamificationData } from '../../lib/gamification';

// Helper to check if all macros are hit
function checkAllMacros(protein, carbs, fats, goals) {
  if (!goals) return false;
  return protein >= goals.protein && carbs >= goals.carbs && fats >= goals.fats;
}

export default function WeeklyNutritionInsights({ nutritionData }) {
  const [data, setData] = useState(nutritionData || { goals: {}, today: {}, history: [] });

  useEffect(() => {
    // Reload data periodically
    const interval = setInterval(() => {
      const gamificationData = loadGamificationData();
      setData(gamificationData.nutrition || { goals: {}, today: {}, history: [] });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate weekly stats
  const getWeeklyStats = () => {
    const today = new Date();
    const weekDays = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const historyEntry = data.history?.find(h => h.date === dateStr);
      if (historyEntry) {
        weekDays.push({
          date: dateStr,
          ...historyEntry,
          allMacrosHit: checkAllMacros(
            historyEntry.protein || 0,
            historyEntry.carbs || 0,
            historyEntry.fats || 0,
            data.goals
          ),
        });
      } else {
        weekDays.push({
          date: dateStr,
          allMacrosHit: false,
        });
      }
    }

    const proteinDays = weekDays.filter(d => (d.protein || 0) >= (data.goals.protein || 0)).length;
    const carbsDays = weekDays.filter(d => (d.carbs || 0) >= (data.goals.carbs || 0)).length;
    const fatsDays = weekDays.filter(d => (d.fats || 0) >= (data.goals.fats || 0)).length;
    const allMacrosDays = weekDays.filter(d => d.allMacrosHit).length;
    const mealConsistency = weekDays.filter(d => d.mealsComplete >= 3).length;

    // Calculate average calories
    const totalCalories = weekDays.reduce((sum, d) => sum + (d.calories || 0), 0);
    const avgCalories = weekDays.length > 0 ? Math.round(totalCalories / weekDays.length) : 0;

    // Compare to last week
    const lastWeek = [];
    for (let i = 13; i >= 7; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const historyEntry = data.history?.find(h => h.date === dateStr);
      if (historyEntry) {
        lastWeek.push(historyEntry);
      }
    }
    const lastWeekAvgCalories = lastWeek.length > 0
      ? Math.round(lastWeek.reduce((sum, d) => sum + (d.calories || 0), 0) / lastWeek.length)
      : 0;
    
    const caloriesChange = lastWeekAvgCalories > 0
      ? Math.round(((avgCalories - lastWeekAvgCalories) / lastWeekAvgCalories) * 100)
      : 0;

    return {
      proteinDays,
      carbsDays,
      fatsDays,
      allMacrosDays,
      mealConsistency,
      avgCalories,
      caloriesChange,
      weekDays,
    };
  };

  const stats = getWeeklyStats();

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-normal text-[var(--txt)] mb-4">This Week's Nutrition</h3>

      {/* Macro Goal Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-[var(--bg-elev-1)] rounded-lg">
          <div className="text-2xl font-normal text-red-400 mb-1">
            {stats.proteinDays}/7
          </div>
          <div className="text-xs text-[var(--txt-muted)]">Protein</div>
        </div>
        <div className="text-center p-3 bg-[var(--bg-elev-1)] rounded-lg">
          <div className="text-2xl font-normal text-yellow-400 mb-1">
            {stats.carbsDays}/7
          </div>
          <div className="text-xs text-[var(--txt-muted)]">Carbs</div>
        </div>
        <div className="text-center p-3 bg-[var(--bg-elev-1)] rounded-lg">
          <div className="text-2xl font-normal text-blue-400 mb-1">
            {stats.fatsDays}/7
          </div>
          <div className="text-xs text-[var(--txt-muted)]">Fats</div>
        </div>
      </div>

      {/* All Macros & Meal Consistency */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-[var(--bg-elev-1)] rounded-lg">
          <div className="text-sm text-[var(--txt-muted)] mb-1">All Macros Hit</div>
          <div className="text-xl font-normal text-[var(--txt)]">
            {stats.allMacrosDays}/7 days
          </div>
        </div>
        <div className="p-3 bg-[var(--bg-elev-1)] rounded-lg">
          <div className="text-sm text-[var(--txt-muted)] mb-1">Meal Consistency</div>
          <div className="text-xl font-normal text-[var(--txt)]">
            {Math.round((stats.mealConsistency / 7) * 100)}%
          </div>
        </div>
      </div>

      {/* Calories Chart */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-normal text-[var(--txt)]">Daily Calories</span>
          <div className="flex items-center gap-2">
            {stats.caloriesChange !== 0 && (
              <>
                {stats.caloriesChange > 0 ? (
                  <TrendingUp size={16} className="text-green-400" />
                ) : (
                  <TrendingDown size={16} className="text-red-400" />
                )}
                <span className={`text-sm font-normal ${
                  stats.caloriesChange > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stats.caloriesChange > 0 ? '↑' : '↓'} {Math.abs(stats.caloriesChange)}%
                </span>
              </>
            )}
            {stats.caloriesChange === 0 && (
              <span className="text-sm text-[var(--txt-muted)] flex items-center gap-1">
                <Minus size={16} />
                No change
              </span>
            )}
          </div>
        </div>
        <div className="h-24 flex items-end justify-between gap-1">
          {stats.weekDays.map((day, index) => {
            const calories = day.calories || 0;
            const maxCalories = Math.max(...stats.weekDays.map(d => d.calories || 0), data.goals.calories || 2100);
            const height = maxCalories > 0 ? Math.max(5, (calories / maxCalories) * 100) : 5;
            const isAllMacros = day.allMacrosHit;

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t transition-all hover:opacity-80 ${
                    isAllMacros
                      ? 'bg-gradient-to-t from-green-500 to-emerald-500'
                      : calories > 0
                        ? 'bg-gradient-to-t from-[var(--acc)] to-blue-500'
                        : 'bg-[var(--bg-elev-2)]'
                  }`}
                  style={{ height: `${height}%` }}
                  title={`${day.date}: ${calories} cal`}
                />
                <span className="text-xs text-[var(--txt-muted)]">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-xs text-[var(--txt-muted)] text-center mt-2">
          Avg: {stats.avgCalories} cal/day
        </div>
      </div>
    </GlassCard>
  );
}

