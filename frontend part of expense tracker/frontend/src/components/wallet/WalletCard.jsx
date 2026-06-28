import React from 'react';
import { CreditCard, Landmark, Coins, Trash2 } from 'lucide-react';

const getWalletIcon = (type) => {
  switch (type) {
    case 'Bank Account':
      return Landmark;
    case 'Credit Card':
      return CreditCard;
    default:
      return Coins;
  }
};

export const WalletCard = ({ wallet, onDelete }) => {
  const { _id, name, balance, type, color = 'var(--color-primary)' } = wallet;
  const IconComponent = getWalletIcon(type);

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '160px',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `4px solid ${color}`
      }}
    >
      {/* Dynamic background highlight */}
      <div
        style={{
          position: 'absolute',
          bottom: '-30px',
          right: '-30px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: color,
          opacity: 0.08,
          filter: 'blur(20px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color
            }}
          >
            <IconComponent size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{name}</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{type}</span>
          </div>
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
            transition: 'color var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div style={{ marginTop: '24px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
          Available Balance
        </span>
        <span 
          style={{ 
            fontSize: '1.625rem', 
            fontWeight: 700, 
            fontFamily: 'var(--font-display)',
            color: balance < 0 ? 'var(--color-danger)' : 'var(--text-primary)'
          }}
        >
          {balance < 0 ? '-' : ''}${Math.abs(balance).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default WalletCard;
