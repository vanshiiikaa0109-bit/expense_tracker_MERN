import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const CATEGORIES = ['Food', 'Entertainment', 'Utilities', 'Shopping', 'Travel', 'Other'];

export const ExpenseForm = ({
  expense = null,
  wallets = [],
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    description: '',
    walletId: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        amount: expense.amount || '',
        category: expense.category || 'Food',
        date: expense.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0],
        description: expense.description || '',
        walletId: expense.walletId || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        description: '',
        walletId: wallets.length > 0 ? wallets[0]._id : ''
      });
    }
  }, [expense, wallets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.walletId) newErrors.walletId = 'Please select a wallet';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input
        label="Title / Vendor"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input
          label="Amount"
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
          required
        />

        <div className="form-group">
          <label htmlFor="category" className="label">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input"
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input
          label="Date"
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
        />

        <div className="form-group">
          <label htmlFor="walletId" className="label">Wallet / Account *</label>
          <select
            id="walletId"
            name="walletId"
            value={formData.walletId}
            onChange={handleChange}
            className="input"
            required
          >
            {wallets.length === 0 ? (
              <option value="">No Wallets Available</option>
            ) : (
              wallets.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name} (${w.balance.toFixed(2)})
                </option>
              ))
            )}
          </select>
          {errors.walletId && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '4px' }}>
              {errors.walletId}
            </span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="label">Notes / Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input"
          style={{ minHeight: '80px', resize: 'vertical' }}
          placeholder="Optional notes about this expense"
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {expense ? 'Save Changes' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
