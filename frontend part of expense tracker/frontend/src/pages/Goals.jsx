import React, { useState } from 'react';
import { Plus, Target, CheckCircle2 } from 'lucide-react';
import useExpense from '../hooks/useExpense';
import GoalCard from '../components/goals/GoalCard';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';

const CATEGORIES = ['Savings', 'Travel', 'Electronics', 'Investments', 'Other'];

export const Goals = () => {
  const {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal
  } = useExpense();

  const [modalOpen, setModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    category: 'Savings',
    deadline: ''
  });

  const [errors, setErrors] = useState({});

  const handleOpenAdd = () => {
    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '0',
      category: 'Savings',
      deadline: ''
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!newGoal.name.trim()) errs.name = 'Goal name is required';
    if (!newGoal.targetAmount || parseFloat(newGoal.targetAmount) <= 0) {
      errs.targetAmount = 'Please enter a valid target amount greater than 0';
    }
    if (parseFloat(newGoal.currentAmount) < 0) {
      errs.currentAmount = 'Starting balance cannot be negative';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await addGoal({
        ...newGoal,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount || 0)
      });
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleContribute = async (id, amount) => {
    const target = goals.find(g => g._id === id);
    if (!target) return;

    try {
      const updatedAmount = target.currentAmount + amount;
      await updateGoal(id, {
        ...target,
        currentAmount: updatedAmount
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this saving goal?")) {
      try {
        await deleteGoal(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Savings & Financial Goals
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Configure and fund targets for long term purchases
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} /> New Saving Goal
        </button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
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
          <Target size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No savings goals yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '360px', marginBottom: '20px' }}>
            Set a target for vacations, buying a home, or emergency backup funds.
          </p>
          <Button onClick={handleOpenAdd} variant="primary">
            Create First Goal
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {goals.map((g) => (
            <GoalCard
              key={g._id}
              goal={g}
              onContribute={handleContribute}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add Goal Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Configure Saving Goal">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Goal / Purchase Target Name"
            id="name"
            name="name"
            value={newGoal.name}
            onChange={handleInputChange}
            error={errors.name}
            required
            placeholder="e.g. Emergency Rainy Day Fund"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Target Amount"
              id="targetAmount"
              name="targetAmount"
              type="number"
              step="0.01"
              value={newGoal.targetAmount}
              onChange={handleInputChange}
              error={errors.targetAmount}
              required
              placeholder="e.g. 5000"
            />

            <Input
              label="Starting Saved Balance"
              id="currentAmount"
              name="currentAmount"
              type="number"
              step="0.01"
              value={newGoal.currentAmount}
              onChange={handleInputChange}
              error={errors.currentAmount}
              placeholder="e.g. 100"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="category" className="label">Category</label>
              <select
                id="category"
                name="category"
                value={newGoal.category}
                onChange={handleInputChange}
                className="input"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <Input
              label="Target Deadline Date"
              id="deadline"
              name="deadline"
              type="date"
              value={newGoal.deadline}
              onChange={handleInputChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Set Goal
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Goals;
