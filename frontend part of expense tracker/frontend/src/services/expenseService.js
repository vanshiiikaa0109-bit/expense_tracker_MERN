import api from './api';

export const expenseService = {
  // Expenses CRUD
  getExpenses: async () => {
    return api.get('/expenses');
  },

  addExpense: async (expenseData) => {
    return api.post('/expenses', expenseData);
  },

  updateExpense: async (id, expenseData) => {
    return api.put(`/expenses/${id}`, expenseData);
  },

  deleteExpense: async (id) => {
    return api.delete(`/expenses/${id}`);
  },

  // Budgets
  getBudgets: async () => {
    return api.get('/budgets');
  },

  updateBudget: async (budgetData) => {
    return api.put('/budgets', budgetData);
  },

  // Goals CRUD
  getGoals: async () => {
    return api.get('/goals');
  },

  addGoal: async (goalData) => {
    return api.post('/goals', goalData);
  },

  updateGoal: async (id, goalData) => {
    return api.put(`/goals/${id}`, goalData);
  },

  deleteGoal: async (id) => {
    return api.delete(`/goals/${id}`);
  },

  // Wallets CRUD
  getWallets: async () => {
    return api.get('/wallets');
  },

  addWallet: async (walletData) => {
    return api.post('/wallets', walletData);
  },

  updateWallet: async (id, walletData) => {
    return api.put(`/wallets/${id}`, walletData);
  },

  deleteWallet: async (id) => {
    return api.delete(`/wallets/${id}`);
  },

  // Receipt OCR Scanning
  uploadReceipt: async (formData) => {
    // Send multipart form data for file uploading
    return api.post('/receipts/upload', formData, true);
  },
};

export default expenseService;
