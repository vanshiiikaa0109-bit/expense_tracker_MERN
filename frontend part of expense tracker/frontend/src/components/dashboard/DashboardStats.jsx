import React, { useMemo } from 'react';
import { ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateCategoryTotals } from '../../utils/calculateBudget';
import formatDate from '../../utils/formatDate';

const CATEGORY_COLORS = {
  Food: 'var(--color-success)',
  Entertainment: 'var(--color-secondary)',
  Utilities: 'var(--color-warning)',
  Shopping: '#ec4899',
  Travel: 'var(--color-info)',
  Other: 'var(--text-muted)'
};

export const DashboardStats = ({ expenses = [], wallets = [], user = null }) => {
  // Aggregate recent 4 transactions
  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);
  }, [expenses]);

  // Aggregate category spending totals
  const categoryTotals = useMemo(() => {
    return calculateCategoryTotals(expenses);
  }, [expenses]);

  // Map wallet IDs to names
  const walletMap = useMemo(() => {
    const map = {};
    wallets.forEach(w => {
      map[w._id] = w.name;
    });
    return map;
  }, [wallets]);

  // Calculate budget limit details and alerts from User Profile setting
  const budgetAlerts = useMemo(() => {
    if (!user || !user.categoryBudgets) return [];

    const alerts = [];
    Object.entries(user.categoryBudgets).forEach(([category, limit]) => {
      const spent = categoryTotals[category] || 0;
      const ratio = spent / limit;
      const percent = Math.round(ratio * 100);

      if (percent >= 100) {
        alerts.push({
          category,
          message: `Exceeded! You have spent $${spent.toFixed(2)} of your $${limit} budget.`,
          percent,
          type: 'danger'
        });
      } else if (percent >= 80) {
        alerts.push({
          category,
          message: `Warning! You spent ${percent}% of your $${limit} budget.`,
          percent,
          type: 'warning'
        });
      }
    });

    return alerts;
  }, [categoryTotals, user]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      
      {/* Category Spending Progress */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>Category Breakdown</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>All-time Totals</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.keys(CATEGORY_COLORS).map((cat) => {
            const spent = categoryTotals[cat] || 0;
            const limit = user?.categoryBudgets?.[cat] || 0;
            const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
            const barColor = CATEGORY_COLORS[cat];

            return (
              <div key={cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{cat}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    ${spent.toFixed(2)}
                    {limit > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / ${limit}</span>}
                  </span>
                </div>
                
                {/* Progress bar container */}
                <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${limit > 0 ? pct : spent > 0 ? 100 : 0}%`,
                      backgroundColor: barColor,
                      borderRadius: '3px',
                      transition: 'width 0.5s ease-out'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>Recent Transactions</h3>
          <Link to="/expenses" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 500 }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '40px 0' }}>
            No expenses logged yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentExpenses.map((exp) => (
              <div
                key={exp._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)' }}>{exp.title}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDate(exp.date)} &bull; {walletMap[exp.walletId] || 'Main Account'}
                  </span>
                </div>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  -${exp.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Budget Alerts & Health Card */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '20px' }}>Financial Alerts</h3>
        
        {budgetAlerts.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '30px 0', gap: '12px' }}>
            <CheckCircle size={40} color="var(--color-success)" />
            <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>All Clear!</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '240px' }}>
              Your spending is currently within all established category budgets. Keep it up!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
            {budgetAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="badge"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'left',
                  backgroundColor: alert.type === 'danger' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                  border: `1px solid ${alert.type === 'danger' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                  color: alert.type === 'danger' ? 'var(--color-danger)' : 'var(--color-warning)'
                }}
              >
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ fontWeight: 600, fontSize: '0.8125rem', marginBottom: '2px' }}>{alert.category} Budget Alert</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardStats;
