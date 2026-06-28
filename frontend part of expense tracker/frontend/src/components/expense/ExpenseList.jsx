import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Inbox } from 'lucide-react';
import ExpenseCard from './ExpenseCard';

const CATEGORIES = ['All', 'Food', 'Entertainment', 'Utilities', 'Shopping', 'Travel', 'Other'];

export const ExpenseList = ({ expenses = [], wallets = [], onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

  const walletMap = useMemo(() => {
    const map = {};
    wallets.forEach(w => {
      map[w._id] = w.name;
    });
    return map;
  }, [wallets]);

  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.title.toLowerCase().includes(term) ||
          (exp.description && exp.description.toLowerCase().includes(term))
      );
    }

    // Filter by category
    if (categoryFilter !== 'All') {
      result = result.filter((exp) => exp.category === categoryFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      } else if (sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [expenses, searchTerm, categoryFilter, sortBy]);

  return (
    <div>
      {/* Filters Bar */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '16px 20px',
          marginBottom: '24px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', flex: '1', minWidth: '240px', position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)'
            }}
          />
          <input
            type="text"
            placeholder="Search vendor or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
            style={{ width: '100%', paddingLeft: '40px' }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {/* Category Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input"
              style={{ padding: '8px 12px' }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-secondary)' }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
              style={{ padding: '8px 12px' }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Stack */}
      {filteredAndSortedExpenses.length === 0 ? (
        <div
          className="glass-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            textAlign: 'center'
          }}
        >
          <Inbox size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No expenses found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '360px' }}>
            Try adjusting your search criteria, category filters, or add a new expense transaction.
          </p>
        </div>
      ) : (
        filteredAndSortedExpenses.map((exp) => (
          <ExpenseCard
            key={exp._id}
            expense={exp}
            walletName={walletMap[exp.walletId] || ''}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default ExpenseList;
