import React from 'react';
import { Edit2, Trash2, ShoppingBag, Utensils, Zap, Film, Car, HelpCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Food':
      return { icon: Utensils, color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
    case 'Entertainment':
      return { icon: Film, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' };
    case 'Utilities':
      return { icon: Zap, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' };
    case 'Shopping':
      return { icon: ShoppingBag, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' };
    case 'Travel':
      return { icon: Car, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' };
    default:
      return { icon: HelpCircle, color: '#6b7280', bg: 'rgba(107, 114, 128, 0.12)' };
  }
};

export const ExpenseCard = ({ expense, walletName = '', onEdit, onDelete }) => {
  const { title, amount, category, date, description } = expense;
  const config = getCategoryIcon(category);
  const IconComponent = config.icon;

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        marginBottom: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: config.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: config.color,
            flexShrink: 0
          }}
        >
          <IconComponent size={22} />
        </div>
        
        <div style={{ minWidth: 0, flex: 1 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }} className="truncate">
            {title}
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span className="badge" style={{ backgroundColor: config.bg, color: config.color, padding: '2px 8px' }}>
              {category}
            </span>
            <span>&bull;</span>
            <span>{formatDate(date)}</span>
            {walletName && (
              <>
                <span>&bull;</span>
                <span style={{ color: 'var(--text-muted)' }}>{walletName}</span>
              </>
            )}
          </div>
          {description && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px' }} className="truncate">
              {description}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '16px' }}>
        <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          -${amount.toFixed(2)}
        </span>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => onEdit(expense)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '6px',
              borderRadius: '6px',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(expense._id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-danger)',
              padding: '6px',
              borderRadius: '6px',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
