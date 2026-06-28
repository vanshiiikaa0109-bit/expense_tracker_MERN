import React, { useState, useMemo } from 'react';
import { Download, FileText, Printer, Calendar } from 'lucide-react';
import useExpense from '../hooks/useExpense';
import { calculateCategoryTotals } from '../utils/calculateBudget';
import formatDate from '../utils/formatDate';

export const Reports = () => {
  const { expenses, wallets } = useExpense();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // e.g. "2026-06"
  });

  // Extract all unique months from expenses for filter selector
  const availableMonths = useMemo(() => {
    const months = new Set();
    // Default current month
    const now = new Date();
    months.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    
    expenses.forEach(e => {
      const date = new Date(e.date);
      months.add(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    });

    return Array.from(months).sort().reverse();
  }, [expenses]);

  // Filter expenses matching the selected month
  const monthlyExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      const year = expDate.getFullYear();
      const month = String(expDate.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}` === selectedMonth;
    });
  }, [expenses, selectedMonth]);

  // Calculate totals and statistics for report
  const reportStats = useMemo(() => {
    const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryTotals = calculateCategoryTotals(monthlyExpenses);
    
    return {
      totalSpent,
      categoryTotals,
      transactionCount: monthlyExpenses.length
    };
  }, [monthlyExpenses]);

  // Printable layout trigger
  const handlePrint = () => {
    window.print();
  };

  // Mock download CSV file
  const handleDownloadCSV = () => {
    if (monthlyExpenses.length === 0) {
      alert("No data available to download.");
      return;
    }

    const headers = ['Date', 'Title', 'Category', 'Amount', 'Description'];
    const rows = monthlyExpenses.map(e => [
      e.date,
      `"${e.title}"`,
      e.category,
      e.amount,
      `"${e.description || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Expense_Report_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Financial Statements
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Exportable monthly logs and category balances
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input"
              style={{ padding: '8px 12px' }}
            >
              {availableMonths.map((m) => {
                const [year, month] = m.split('-');
                const label = new Date(year, month - 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
                return <option key={m} value={m}>{label}</option>;
              })}
            </select>
          </div>

          <button onClick={handlePrint} className="btn btn-secondary">
            <Printer size={16} /> Print
          </button>
          
          <button onClick={handleDownloadCSV} className="btn btn-primary">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Main printable report body */}
      <div id="printable-report-area" className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Title Block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Smart Expense Report</h3>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Statement Period: {new Date(selectedMonth.split('-')[0], selectedMonth.split('-')[1] - 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h4 style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Total Expenditures</h4>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
              ${reportStats.totalSpent.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Short metrics section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Transaction Volume</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{reportStats.transactionCount} transactions</span>
          </div>
          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Average Spend / Item</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ${reportStats.transactionCount > 0 ? (reportStats.totalSpent / reportStats.transactionCount).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>

        {/* Categorical list */}
        <div>
          <h4 style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '12px' }}>Categorical Spending Summary</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '10px 8px' }}>Category</th>
                <th style={{ padding: '10px 8px', textAlign: 'right' }}>Total Spent</th>
                <th style={{ padding: '10px 8px', textAlign: 'right' }}>% Allocation</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(reportStats.categoryTotals).length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '20px', textLight: 'center', color: 'var(--text-secondary)' }}>No transactions this month.</td>
                </tr>
              ) : (
                Object.entries(reportStats.categoryTotals).map(([cat, total]) => {
                  const percent = reportStats.totalSpent > 0 ? Math.round((total / reportStats.totalSpent) * 100) : 0;
                  return (
                    <tr key={cat} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 500, color: 'var(--text-primary)' }}>{cat}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 600 }}>${total.toFixed(2)}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', color: 'var(--text-secondary)' }}>{percent}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Detailed Transactions List */}
        <div>
          <h4 style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '12px' }}>Transaction Log Details</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '10px 8px' }}>Date</th>
                <th style={{ padding: '10px 8px' }}>Vendor / Title</th>
                <th style={{ padding: '10px 8px' }}>Category</th>
                <th style={{ padding: '10px 8px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {monthlyExpenses.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textLight: 'center', color: 'var(--text-secondary)' }}>No transactions found.</td>
                </tr>
              ) : (
                monthlyExpenses.map((exp) => (
                  <tr key={exp._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{formatDate(exp.date)}</td>
                    <td style={{ padding: '10px 8px', fontWeight: 500, color: 'var(--text-primary)' }}>{exp.title}</td>
                    <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{exp.category}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>-${exp.amount.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Embedded print page styling override */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, aside, button, select, footer {
            display: none !important;
          }
          #printable-report-area {
            background: transparent !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            width: 100% !important;
            color: black !important;
          }
          #printable-report-area * {
            color: black !important;
            border-color: #ddd !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Reports;
