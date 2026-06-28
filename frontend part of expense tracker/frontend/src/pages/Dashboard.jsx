import React, { useState, useMemo } from 'react';
import { Wallet, Plus, CreditCard, PiggyBank, RefreshCw } from 'lucide-react';
import useExpense from '../hooks/useExpense';
import useAuth from '../hooks/useAuth';
import SummaryCard from '../components/dashboard/SummaryCard';
import Chart from '../components/dashboard/Chart';
import DashboardStats from '../components/dashboard/DashboardStats';
import Modal from '../components/common/Modal';
import ExpenseForm from '../components/expense/ExpenseForm';
import Loader from '../components/common/Loader';

export const Dashboard = () => {
  const { user } = useAuth();
  const {
    expenses,
    wallets,
    loading,
    addExpense,
    refreshData
  } = useExpense();

  const [modalOpen, setModalOpen] = useState(false);

  // Math totals calculation
  const stats = useMemo(() => {
    // Current Wallet net balances
    const balanceTotal = wallets.reduce((sum, w) => sum + w.balance, 0);

    // Current Month expenses
    const now = new Date();
    const currentMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    });

    const monthlySpentTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Total Budget limit set by user
    const monthlyBudgetLimit = user?.categoryBudgets
      ? Object.values(user.categoryBudgets).reduce((sum, v) => sum + v, 0)
      : 0;

    return {
      balanceTotal,
      monthlySpentTotal,
      monthlyBudgetLimit
    };
  }, [expenses, wallets, user]);

  const handleCreateExpense = async (formData) => {
    try {
      await addExpense(formData);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Loader fullScreen={false} size="large" />;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Hello, {user?.username || 'Guest'}!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Here is a summary of your financial portfolio.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={refreshData}
            style={{
              background: 'none',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              padding: '10px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >
            <RefreshCw size={18} />
          </button>
          
          <button onClick={() => setModalOpen(true)} className="btn btn-primary">
            <Plus size={18} /> Log Expense
          </button>
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <SummaryCard
          title="Total Net Worth"
          value={`$${stats.balanceTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={Wallet}
          accentColor="var(--color-primary)"
        />
        <SummaryCard
          title="Monthly Spend"
          value={`$${stats.monthlySpentTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={CreditCard}
          accentColor="var(--color-accent)"
        />
        <SummaryCard
          title="Allocated Budget"
          value={`$${stats.monthlyBudgetLimit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={PiggyBank}
          accentColor="var(--color-secondary)"
        />
      </div>

      {/* Chart Visual Panels */}
      <Chart expenses={expenses} />

      {/* Breakdowns & Warn lists */}
      <DashboardStats expenses={expenses} wallets={wallets} user={user} />

      {/* Modal form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log New Expense">
        <ExpenseForm
          wallets={wallets}
          onSubmit={handleCreateExpense}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

    </div>
  );
};

export default Dashboard;
