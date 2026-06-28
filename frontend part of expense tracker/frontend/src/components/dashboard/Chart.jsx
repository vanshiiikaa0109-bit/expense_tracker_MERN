import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { AreaChart as AreaIcon, BarChart3 as BarIcon, PieChart as PieIcon } from 'lucide-react';

const CATEGORY_COLORS = {
  Food: '#10b981',
  Entertainment: '#8b5cf6',
  Utilities: '#f59e0b',
  Shopping: '#ec4899',
  Travel: '#3b82f6',
  Other: '#6b7280'
};

export const Chart = ({ expenses = [] }) => {
  const [chartType, setChartType] = useState('area'); // area, bar, pie

  // Process data for Area Chart: spending aggregated by date
  const areaData = React.useMemo(() => {
    const dates = {};
    // Grab the last 7 unique transaction days with expenses
    expenses.forEach(e => {
      const dateLabel = new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      dates[dateLabel] = (dates[dateLabel] || 0) + e.amount;
    });

    return Object.entries(dates)
      .map(([date, amount]) => ({ date, amount: parseFloat(amount.toFixed(2)) }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7); // last 7 days of activity
  }, [expenses]);

  // Process data for Bar/Pie Charts: spending grouped by category
  const categoryData = React.useMemo(() => {
    const categories = {};
    expenses.forEach(e => {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    return Object.entries(categories).map(([category, amount]) => ({
      name: category,
      value: parseFloat(amount.toFixed(2)),
      color: CATEGORY_COLORS[category] || '#6b7280'
    }));
  }, [expenses]);

  // Custom tooltips with dark background matching Obsidian theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: '#1c1f2e',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}
        >
          {label && <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</p>}
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {payload[0].name}: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '380px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Spending Analysis</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Visual breakdown of your transactions</p>
        </div>

        {/* Chart type selection toggles */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '4px' }}>
          <button
            onClick={() => setChartType('area')}
            style={{
              padding: '6px 12px',
              border: 'none',
              background: chartType === 'area' ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderRadius: '6px',
              cursor: 'pointer',
              color: chartType === 'area' ? 'var(--text-primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem',
              fontWeight: 500
            }}
          >
            <AreaIcon size={14} /> Area
          </button>
          <button
            onClick={() => setChartType('bar')}
            style={{
              padding: '6px 12px',
              border: 'none',
              background: chartType === 'bar' ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderRadius: '6px',
              cursor: 'pointer',
              color: chartType === 'bar' ? 'var(--text-primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem',
              fontWeight: 500
            }}
          >
            <BarIcon size={14} /> Bar
          </button>
          <button
            onClick={() => setChartType('pie')}
            style={{
              padding: '6px 12px',
              border: 'none',
              background: chartType === 'pie' ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderRadius: '6px',
              cursor: 'pointer',
              color: chartType === 'pie' ? 'var(--text-primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem',
              fontWeight: 500
            }}
          >
            <PieIcon size={14} /> Pie
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: '280px', position: 'relative' }}>
        {expenses.length === 0 ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            No transaction history to chart.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" style={{ fontSize: '10px' }} />
                <YAxis stroke="var(--text-secondary)" style={{ fontSize: '10px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" name="Amount Spent" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={2} />
              </AreaChart>
            ) : chartType === 'bar' ? (
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" style={{ fontSize: '10px' }} />
                <YAxis stroke="var(--text-secondary)" style={{ fontSize: '10px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Total Spending">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{value}</span>} />
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Chart;
