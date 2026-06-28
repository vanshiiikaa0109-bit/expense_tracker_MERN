import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, PieChart, Pie } from 'recharts';
import { BarChart3, PieChart as PieIcon, Lightbulb, TrendingUp } from 'lucide-react';
import useExpense from '../hooks/useExpense';
import useAuth from '../hooks/useAuth';
import { calculateCategoryTotals } from '../utils/calculateBudget';

const CATEGORY_COLORS = {
  Food: '#10b981',
  Entertainment: '#8b5cf6',
  Utilities: '#f59e0b',
  Shopping: '#ec4899',
  Travel: '#3b82f6',
  Other: '#6b7280'
};

export const Analytics = () => {
  const { expenses, wallets } = useExpense();
  const { user } = useAuth();

  // Spend totals by category
  const categoryTotals = useMemo(() => {
    return calculateCategoryTotals(expenses);
  }, [expenses]);

  // Aggregate Category Budgets vs Spent data
  const budgetComparisonData = useMemo(() => {
    if (!user || !user.categoryBudgets) return [];

    return Object.entries(user.categoryBudgets).map(([category, limit]) => {
      const spent = categoryTotals[category] || 0;
      return {
        name: category,
        Budget: limit,
        Spent: parseFloat(spent.toFixed(2))
      };
    });
  }, [categoryTotals, user]);

  // Pie chart structure
  const pieData = useMemo(() => {
    return Object.entries(categoryTotals).map(([cat, amount]) => ({
      name: cat,
      value: parseFloat(amount.toFixed(2)),
      color: CATEGORY_COLORS[cat] || '#6b7280'
    }));
  }, [categoryTotals]);

  // Total balance sum
  const totalBalance = useMemo(() => {
    return wallets.reduce((sum, w) => sum + w.balance, 0);
  }, [wallets]);

  // Total expenses sum
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  // Generating smart text insights
  const generatedInsights = useMemo(() => {
    const list = [];
    if (expenses.length === 0) {
      list.push("No transaction records found. Log your expenses to view insights.");
      return list;
    }

    // Top spending category
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0) {
      const [topCat, topVal] = sortedCategories[0];
      const percent = totalExpenses > 0 ? Math.round((topVal / totalExpenses) * 100) : 0;
      list.push(`Your highest spending category is ${topCat}, accounting for ${percent}% ($${topVal.toFixed(2)}) of your total spending.`);
    }

    // Checking if credit card balance is negative (high debt ratio)
    const creditCards = wallets.filter(w => w.type === 'Credit Card');
    const creditDebt = creditCards.reduce((sum, w) => sum + w.balance, 0);
    if (creditDebt < -1000) {
      list.push(`Credit Card debt is relatively high at $${Math.abs(creditDebt).toFixed(2)}. Make sure to pay off balances to avoid high APR charges.`);
    }

    // Savings ratio (net worth comparison)
    if (totalBalance > totalExpenses) {
      list.push(`Excellent liquidity! Your current net worth ($${totalBalance.toFixed(2)}) is well above your historical spending limits.`);
    } else {
      list.push(`Notice: Your cumulative spending ($${totalExpenses.toFixed(2)}) exceeds your available wallet balance. Take care to budget tightly.`);
    }

    return list;
  }, [expenses, categoryTotals, wallets, totalExpenses, totalBalance]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Portfolio Analytics
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Deconstruct spending allocations and budget utilization ratios
        </p>
      </div>

      {/* Charts split row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Category Share (Pie) */}
        <div className="glass-card" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <PieIcon size={18} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>Expenses Allocations Share</h3>
          </div>
          <div style={{ flex: 1, minHeight: '260px' }}>
            {pieData.length === 0 ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                No category data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Budget vs Actual (Bar) */}
        <div className="glass-card" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChart3 size={18} color="var(--color-secondary)" />
            <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>Budget Limits vs Spending</h3>
          </div>
          <div style={{ flex: 1, minHeight: '260px' }}>
            {budgetComparisonData.length === 0 ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                No active budget limits configured.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" style={{ fontSize: '10px' }} />
                  <YAxis stroke="var(--text-secondary)" style={{ fontSize: '10px' }} />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{value}</span>} />
                  <Bar dataKey="Budget" fill="rgba(139, 92, 246, 0.4)" stroke="var(--color-secondary)" strokeWidth={1} />
                  <Bar dataKey="Spent" fill="rgba(16, 185, 129, 0.6)" stroke="var(--color-primary)" strokeWidth={1} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* AI Smart Insights */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Lightbulb size={20} color="var(--color-warning)" />
          <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>AI-Powered Budget Insights</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {generatedInsights.map((insight, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)'
              }}
            >
              <TrendingUp size={16} style={{ color: 'var(--color-primary)', marginTop: '2px', flexShrink: 0 }} />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Analytics;
