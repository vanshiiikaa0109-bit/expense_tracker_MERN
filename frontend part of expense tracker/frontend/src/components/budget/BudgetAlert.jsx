import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const BudgetAlert = ({ category, spent, limit }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !limit) return null;

  const percent = Math.round((spent / limit) * 100);

  if (percent < 80) return null;

  const isExceeded = percent >= 100;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderRadius: '8px',
        backgroundColor: isExceeded ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
        border: `1px solid ${isExceeded ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
        color: isExceeded ? 'var(--color-danger)' : 'var(--color-warning)',
        fontSize: '0.875rem',
        marginBottom: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertTriangle size={18} style={{ flexShrink: 0 }} />
        <span>
          {isExceeded ? (
            <strong>Budget Exceeded!</strong>
          ) : (
            <strong>Budget Warning!</strong>
          )}{' '}
          You have spent {percent}% (${spent.toFixed(2)} of ${limit.toFixed(2)}) on <strong>{category}</strong>.
        </span>
      </div>
      
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'inherit',
          display: 'flex',
          padding: '4px'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default BudgetAlert;
