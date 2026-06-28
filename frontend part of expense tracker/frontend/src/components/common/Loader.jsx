import React from 'react';

export const Loader = ({ fullScreen = false, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4'
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div 
        className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]}`}
        style={{
          borderColor: 'var(--color-primary)',
          borderTopColor: 'transparent',
          borderRadius: '50%'
        }}
      ></div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
        Loading data...
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--bg-base)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {loaderContent}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', padding: '40px 0' }}>
      {loaderContent}
    </div>
  );
};

export default Loader;
