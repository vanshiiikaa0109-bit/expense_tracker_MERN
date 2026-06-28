import React, { useState } from 'react';
import { Calendar, CheckCircle2, ChevronRight, PlusCircle, Trash2 } from 'lucide-react';
import ProgressBar from './ProgressBar';

export const GoalCard = ({ goal, onContribute, onDelete }) => {
  const { _id, name, targetAmount, currentAmount, category, deadline } = goal;
  const [contribAmount, setContribAmount] = useState('');
  const [showInput, setShowInput] = useState(false);

  const percent = Math.min(100, Math.round((currentAmount / targetAmount) * 100));
  const remaining = targetAmount - currentAmount;
  const isCompleted = currentAmount >= targetAmount;

  const handleContributeSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(contribAmount);
    if (isNaN(val) || val <= 0) return;
    onContribute(_id, val);
    setContribAmount('');
    setShowInput(false);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{name}</h3>
          <span className="badge badge-info">{category}</span>
        </div>
        
        <button
          onClick={() => onDelete(_id)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Goal Progress</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{percent}%</span>
        </div>
        <ProgressBar percent={percent} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
        <div>
          <span>Saved: </span>
          <strong style={{ color: 'var(--text-primary)' }}>${currentAmount.toFixed(2)}</strong>
          <span> / ${targetAmount.toFixed(2)}</span>
        </div>
        {deadline && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} />
            <span>Target: {new Date(deadline).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      {isCompleted ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '8px',
            color: 'var(--color-success)',
            fontSize: '0.8125rem',
            fontWeight: 500
          }}
        >
          <CheckCircle2 size={16} />
          Goal Achieved! Excellent job saving.
        </div>
      ) : (
        <div>
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <PlusCircle size={14} /> Contribute Funds
            </button>
          ) : (
            <form onSubmit={handleContributeSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                step="0.01"
                placeholder={`Contribute (Max $${remaining.toFixed(2)})`}
                value={contribAmount}
                onChange={(e) => setContribAmount(e.target.value)}
                className="input"
                style={{ flex: 1, padding: '6px 12px', fontSize: '0.8125rem' }}
                required
                max={remaining}
                min={0.01}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
                onClick={() => setShowInput(false)}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalCard;
