import React from 'react';

export const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-color)',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        background: 'var(--bg-surface)',
        width: '100%'
      }}
    >
      <p>&copy; {new Date().getFullYear()} Smart Expense Tracker. Built with React & Vite.</p>
    </footer>
  );
};

export default Footer;
