import React, { useState } from 'react';
import { User, Mail, DollarSign, Wallet, Target, Settings, CheckCircle2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useExpense from '../hooks/useExpense';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { wallets, goals } = useExpense();

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    currency: user?.currency || 'USD'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
      
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          User Profile settings
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Manage your personal details and currency preferences
        </p>
      </div>

      {success && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '8px',
            color: 'var(--color-success)',
            fontSize: '0.875rem',
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={18} />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* Profile Card Summary */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={formData.avatar}
              alt={formData.username}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)'
              }}
            />
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{formData.username}</h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{formData.email}</span>
          </div>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Wallet size={16} style={{ color: 'var(--color-primary)', marginBottom: '4px' }} />
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{wallets.length}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Connected Wallets</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Target size={16} style={{ color: 'var(--color-secondary)', marginBottom: '4px' }} />
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{goals.length}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active Saving Goals</span>
            </div>
          </div>
        </div>

        {/* Profile Form Details */}
        <div className="glass-card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Personal Information</h3>

            <Input
              label="Username"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Profile Photo URL"
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
            />

            <div className="form-group">
              <label htmlFor="currency" className="label">Primary Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="input"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            <Button type="submit" variant="primary" loading={loading} style={{ alignSelf: 'flex-end', marginTop: '12px' }}>
              Save Changes
            </Button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default Profile;
