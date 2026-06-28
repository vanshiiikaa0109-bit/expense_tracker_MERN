import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  FileSpreadsheet,
  BarChart3,
  Target,
  Wallet,
  ScanLine,
  User,
  Settings,
  X
} from 'lucide-react';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/reports', label: 'Reports', icon: FileSpreadsheet },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/wallets', label: 'Wallets', icon: Wallet },
  { path: '/receipt-scanner', label: 'Receipt Scanner', icon: ScanLine },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings }
];

export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 190
          }}
          className="md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        style={{
          width: '260px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          height: 'calc(100vh - 70px)',
          position: 'sticky',
          top: '70px',
          zIndex: 200,
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform var(--transition-normal)'
        }}
        className={`fixed md:sticky left-0 transform md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }} className="md:hidden">
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
          </div>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
        
        <div style={{ padding: '8px 16px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          Smart Expense v1.0.0
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
