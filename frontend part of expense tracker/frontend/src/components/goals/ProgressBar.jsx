import React from 'react';

export const ProgressBar = ({ percent = 0, height = '8px', color = 'var(--color-primary)' }) => {
  const normalizedPercent = Math.min(100, Math.max(0, percent));

  // Dynamic gradient based on percentage to make it look premium
  const getGradient = (pct) => {
    if (pct >= 100) return 'linear-gradient(135deg, #10b981, #059669)'; // Complete Emerald
    if (pct >= 85) return 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'; // Approaching Purple
    return `linear-gradient(135deg, ${color}, #60a5fa)`; // Default blue-teal
  };

  return (
    <div
      style={{
        height: height,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '9999px',
        overflow: 'hidden',
        width: '100%'
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${normalizedPercent}%`,
          background: getGradient(normalizedPercent),
          borderRadius: '9999px',
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
    </div>
  );
};

export default ProgressBar;
