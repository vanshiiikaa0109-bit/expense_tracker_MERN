import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { getBudgetStatus } from '../../utils/calculateBudget';

export const BudgetCard = ({ category, spent, limit, onEditClick }) => {
  const { status, percent } = getBudgetStatus(spent, limit);

  // Status visual configs
  const statusConfig = {
    safe: {
      color: 'var(--color-success)',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.15)',
      message: 'Within Budget'
    },
    warning: {
      color: 'var(--color-warning)',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.15)',
      message: 'Approaching Limit'
    },
    exceeded: {
      color: 'var(--color-danger)',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.15)',
      message: 'Budget Exceeded'
    }
  };

  const config = statusConfig[status];

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{category}</h3>
          <span 
            className="badge" 
            style={{ 
              backgroundColor: config.bg, 
              color: config.color, 
              border: `1px solid ${config.border}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              fontSize: '0.75rem'
            }}
          >
            {status === 'safe' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
            {config.message}
          </span>
        </div>
        <button
          onClick={() => onEditClick(category, limit)}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--border-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          Adjust Budget
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.875rem' }}>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            ${spent.toFixed(2)}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}> of ${limit.toFixed(2)} spent</span>
        </div>
        <span style={{ fontWeight: 600, color: config.color }}>{percent}%</span>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, percent)}%`,
            backgroundColor: config.color,
            borderRadius: '4px',
            transition: 'width 0.4s ease-out'
          }}
        />
      </div>
    </div>
  );
};

export default BudgetCard;
