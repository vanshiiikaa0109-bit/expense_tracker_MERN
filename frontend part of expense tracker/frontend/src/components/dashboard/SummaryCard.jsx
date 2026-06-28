import React from 'react';

export const SummaryCard = ({
  title,
  value,
  icon: IconComponent,
  trend = null, // e.g., { value: '12%', isPositive: true }
  accentColor = 'var(--color-primary)',
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Decorative accent glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: accentColor,
          opacity: 0.12,
          filter: 'blur(16px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        <span style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          {value}
        </span>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
            <span
              style={{
                color: trend.isPositive ? 'var(--color-success)' : 'var(--color-danger)',
                fontWeight: 600
              }}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>{trend.label || 'since last month'}</span>
          </div>
        )}
      </div>

      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accentColor
        }}
      >
        {IconComponent && <IconComponent size={24} />}
      </div>
    </div>
  );
};

export default SummaryCard;
