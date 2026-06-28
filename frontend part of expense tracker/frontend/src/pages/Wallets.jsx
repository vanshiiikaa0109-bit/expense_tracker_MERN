import React, { useState } from 'react';
import { Plus, Wallet, ShieldAlert } from 'lucide-react';
import useExpense from '../hooks/useExpense';
import WalletCard from '../components/wallet/WalletCard';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';

const WALLET_TYPES = ['Bank Account', 'Cash', 'Credit Card'];
const PRESET_COLORS = ['#10b981', '#8b5cf6', '#ef4444', '#3b82f6', '#f59e0b', '#ec4899'];

export const Wallets = () => {
  const {
    wallets,
    loading,
    addWallet,
    deleteWallet
  } = useExpense();

  const [modalOpen, setModalOpen] = useState(false);
  const [newWallet, setNewWallet] = useState({
    name: '',
    balance: '',
    type: 'Bank Account',
    color: '#10b981'
  });

  const [errors, setErrors] = useState({});

  const handleOpenAdd = () => {
    setNewWallet({
      name: '',
      balance: '',
      type: 'Bank Account',
      color: '#10b981'
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWallet(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!newWallet.name.trim()) errs.name = 'Wallet name is required';
    if (!newWallet.balance || isNaN(parseFloat(newWallet.balance))) {
      errs.balance = 'Please enter a valid starting balance';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await addWallet({
        ...newWallet,
        balance: parseFloat(newWallet.balance)
      });
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this wallet? All associated transactions will remain but the balance will be deleted.")) {
      try {
        await deleteWallet(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  // Calculate Net balance total
  const netWorth = wallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Wallets & Bank Accounts
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Track and partition funds across cash, credit cards, or check accounts
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} /> Add Account
        </button>
      </div>

      {/* Net Worth banner */}
      <div 
        className="glass-card gradient-bg" 
        style={{ 
          padding: '30px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center',
          color: '#ffffff',
          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.25)'
        }}
      >
        <span style={{ fontSize: '0.875rem', opacity: 0.85, fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Aggregate Liquid Net Worth
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
          ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h1>
      </div>

      {/* Grid of Wallets */}
      {wallets.length === 0 ? (
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
          <Wallet size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No wallets connected
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '360px', marginBottom: '20px' }}>
            Link cash nodes or credit card accounts to properly record transaction routes.
          </p>
          <Button onClick={handleOpenAdd} variant="primary">
            Connect First Account
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {wallets.map((w) => (
            <WalletCard
              key={w._id}
              wallet={w}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal Add Wallet */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Link New Account">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Account / Wallet Name"
            id="name"
            name="name"
            value={newWallet.name}
            onChange={handleInputChange}
            error={errors.name}
            required
            placeholder="e.g. Citibank Savings Account"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Starting Balance"
              id="balance"
              name="balance"
              type="number"
              step="0.01"
              value={newWallet.balance}
              onChange={handleInputChange}
              error={errors.balance}
              required
              placeholder="e.g. 1500"
            />

            <div className="form-group">
              <label htmlFor="type" className="label">Account Type</label>
              <select
                id="type"
                name="type"
                value={newWallet.type}
                onChange={handleInputChange}
                className="input"
              >
                {WALLET_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Color Selector */}
          <div className="form-group">
            <label className="label">Theme Color Accent</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px' }}>
              {PRESET_COLORS.map(col => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setNewWallet(prev => ({ ...prev, color: col }))}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: col,
                    border: newWallet.color === col ? '3px solid #ffffff' : 'none',
                    boxShadow: newWallet.color === col ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Connect Account
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Wallets;
