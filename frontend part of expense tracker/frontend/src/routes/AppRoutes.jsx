import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Expenses from '../pages/Expenses';
import Reports from '../pages/Reports';
import Analytics from '../pages/Analytics';
import Goals from '../pages/Goals';
import Wallets from '../pages/Wallets';
import ReceiptScanner from '../pages/ReceiptScanner';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Loader from '../components/common/Loader';

// Protected Routes Layout Wrapper
const ProtectedLayout = () => {
  const { token, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <Loader fullScreen size="large" />;
  }

  // Redirect to login if token is missing
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="main-wrapper">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="content-area">
          {/* Renders current active sub-page route */}
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const AppRoutes = () => {
  const { token } = useAuth();

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!token ? <Register /> : <Navigate to="/" replace />} />

      {/* Private Dashboard pages inside layout */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/wallets" element={<Wallets />} />
        <Route path="/receipt-scanner" element={<ReceiptScanner />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Wildcard redirects */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
