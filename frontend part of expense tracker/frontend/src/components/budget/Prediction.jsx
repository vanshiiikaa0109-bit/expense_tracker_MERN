import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Sparkles, AlertTriangle } from 'lucide-react';
import { calculateSpendingForecast } from '../../utils/calculateBudget';

export const Prediction = ({ expenses = [], user = null }) => {
  const forecast = useMemo(() => {
    return calculateSpendingForecast(expenses, 30);
  }, [expenses]);

  const totalBudget = useMemo(() => {
    if (!user || !user.categoryBudgets) return 0;
    return Object.values(user.categoryBudgets).reduce((sum, val) => sum + val, 0);
  }, [user]);

  const insights = useMemo(() => {
    if (expenses.length === 0) {
      return {
        title: 'Insufficient Data',
        message: 'Log some expenses to generate an AI-powered spending forecast.',
        type: 'info',
        color: 'var(--color-info)'
      };
    }

    const { monthlyForecast } = forecast;
    const difference = monthlyForecast - totalBudget;
    
    if (totalBudget === 0) {
      return {
        title: 'Budget Limits Not Set',
        message: 'Define category budgets in settings to contrast your predicted spending.',
        type: 'info',
        color: 'var(--color-secondary)'
      };
    }

    if (difference > 0) {
      return {
        title: 'Budget Exceed Forecast',
        message: `Based on recent trends, you are projected to spend $${monthlyForecast.toFixed(2)} next month. This exceeds your $${totalBudget.toFixed(2)} total budget limit by $${difference.toFixed(2)}. Consider cutting down on non-essential categories like Shopping or Entertainment.`,
        type: 'warning',
        color: 'var(--color-warning)'
      };
    } else {
      const savings = Math.abs(difference);
      return {
        title: 'Healthy Budget Forecast',
        message: `Excellent! You are projected to spend $${monthlyForecast.toFixed(2)} next month, keeping you $${savings.toFixed(2)} under your total budget of $${totalBudget.toFixed(2)}. Try contributing this surplus to your saving goals!`,
        type: 'success',
        color: 'var(--color-success)'
      };
    }
  }, [forecast, totalBudget, expenses]);

  return (
    <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Sparkles background effect */}
      <div 
        style={{
          position: 'absolute',
          top: '-20px',
          left: '-20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: insights.color,
          opacity: 0.08,
          filter: 'blur(16px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Sparkles size={20} style={{ color: insights.color }} />
        <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>Predictive AI Forecast</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        
        {/* Estimated Daily Spend */}
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Average Daily Spend
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              ${forecast.dailyAverage.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Projected Monthly Spend */}
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Projected Next 30 Days
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              ${forecast.monthlyForecast.toFixed(2)}
            </span>
            {forecast.monthlyForecast > totalBudget && totalBudget > 0 ? (
              <TrendingUp size={18} color="var(--color-danger)" />
            ) : (
              <TrendingDown size={18} color="var(--color-success)" />
            )}
          </div>
        </div>

      </div>

      {/* AI Insight Box */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          padding: '16px',
          borderRadius: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)'
        }}
      >
        <AlertTriangle size={18} style={{ color: insights.color, flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {insights.title}
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {insights.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
