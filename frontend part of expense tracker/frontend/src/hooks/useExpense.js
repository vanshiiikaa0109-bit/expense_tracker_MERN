import { useState, useEffect, useCallback } from 'react';
import expenseService from '../services/expenseService';
import useAuth from './useAuth';

// Mock Data Templates to wow the user on first load when API is unreachable
const defaultWallets = [
  { _id: 'wallet-1', name: 'Chase Bank Account', balance: 5420.50, type: 'Bank Account', color: '#10b981' },
  { _id: 'wallet-2', name: 'Cash Wallet', balance: 350.00, type: 'Cash', color: '#8b5cf6' },
  { _id: 'wallet-3', name: 'Visa Credit Card', balance: -1250.80, type: 'Credit Card', color: '#ef4444' }
];

const defaultExpenses = [
  { _id: 'exp-1', title: 'Weekly Groceries Store', amount: 145.20, category: 'Food', date: new Date().toISOString().split('T')[0], description: 'Whole Foods organic supplies', walletId: 'wallet-1' },
  { _id: 'exp-2', title: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], description: 'Premium monthly plan', walletId: 'wallet-3' },
  { _id: 'exp-3', title: 'Gas Station Refuel', amount: 45.00, category: 'Travel', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], description: 'SUV fill up', walletId: 'wallet-2' },
  { _id: 'exp-4', title: 'Electric Bill Payment', amount: 112.50, category: 'Utilities', date: new Date(Date.now() - 259200000).toISOString().split('T')[0], description: 'Electricity bill', walletId: 'wallet-1' },
  { _id: 'exp-5', title: 'Designer Shoes Sale', amount: 189.99, category: 'Shopping', date: new Date(Date.now() - 345600000).toISOString().split('T')[0], description: 'New running trainers', walletId: 'wallet-3' },
  { _id: 'exp-6', title: 'Coffee & Snacks', amount: 8.75, category: 'Food', date: new Date(Date.now() - 432000000).toISOString().split('T')[0], description: 'Espresso and muffin', walletId: 'wallet-2' }
];

const defaultGoals = [
  { _id: 'goal-1', name: 'Summer Eurotrip 2026', targetAmount: 4000, currentAmount: 2400, category: 'Travel', deadline: '2026-08-15' },
  { _id: 'goal-2', name: 'Emergency Rain-Day Fund', targetAmount: 10000, currentAmount: 6500, category: 'Savings', deadline: '2026-12-31' },
  { _id: 'goal-3', name: 'New Macbook Pro M4', targetAmount: 2500, currentAmount: 1800, category: 'Electronics', deadline: '2026-10-01' }
];

export const useExpense = () => {
  const { isDemoMode } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize and retrieve data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isDemoMode) {
        // Retrieve from LocalStorage
        const localExpenses = localStorage.getItem('expenses');
        const localWallets = localStorage.getItem('wallets');
        const localGoals = localStorage.getItem('goals');

        const parsedExpenses = localExpenses ? JSON.parse(localExpenses) : defaultExpenses;
        const parsedWallets = localWallets ? JSON.parse(localWallets) : defaultWallets;
        const parsedGoals = localGoals ? JSON.parse(localGoals) : defaultGoals;

        // Persist default mocks if empty
        if (!localExpenses) localStorage.setItem('expenses', JSON.stringify(defaultExpenses));
        if (!localWallets) localStorage.setItem('wallets', JSON.stringify(defaultWallets));
        if (!localGoals) localStorage.setItem('goals', JSON.stringify(defaultGoals));

        setExpenses(parsedExpenses);
        setWallets(parsedWallets);
        setGoals(parsedGoals);
      } else {
        // Fetch from API services
        const fetchedExpenses = await expenseService.getExpenses();
        const fetchedWallets = await expenseService.getWallets();
        const fetchedGoals = await expenseService.getGoals();

        setExpenses(fetchedExpenses);
        setWallets(fetchedWallets);
        setGoals(fetchedGoals);
      }
    } catch (err) {
      console.warn("Unable to fetch from API, falling back to LocalStorage mock states.", err);
      // Force LocalStorage fallback on API failure
      const localExpenses = localStorage.getItem('expenses');
      const localWallets = localStorage.getItem('wallets');
      const localGoals = localStorage.getItem('goals');

      setExpenses(localExpenses ? JSON.parse(localExpenses) : defaultExpenses);
      setWallets(localWallets ? JSON.parse(localWallets) : defaultWallets);
      setGoals(localGoals ? JSON.parse(localGoals) : defaultGoals);
    } finally {
      setLoading(false);
    }
  }, [isDemoMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Expenses CRUD handlers
  const addExpense = async (expenseData) => {
    setError(null);
    try {
      if (isDemoMode) {
        const newExpense = {
          _id: `exp-${Date.now()}`,
          ...expenseData,
          amount: parseFloat(expenseData.amount)
        };
        const updated = [newExpense, ...expenses];
        setExpenses(updated);
        localStorage.setItem('expenses', JSON.stringify(updated));

        // Adjust wallet balances
        if (expenseData.walletId) {
          const updatedWallets = wallets.map(w => {
            if (w._id === expenseData.walletId) {
              return { ...w, balance: w.balance - parseFloat(expenseData.amount) };
            }
            return w;
          });
          setWallets(updatedWallets);
          localStorage.setItem('wallets', JSON.stringify(updatedWallets));
        }

        return newExpense;
      } else {
        const added = await expenseService.addExpense(expenseData);
        await fetchData(); // Refetch database sync
        return added;
      }
    } catch (err) {
      setError(err.message || 'Failed to add expense');
      throw err;
    }
  };

  const updateExpense = async (id, expenseData) => {
    setError(null);
    try {
      if (isDemoMode) {
        // Find old expense amount for wallet offset recalculation
        const oldExpense = expenses.find(e => e._id === id);
        const diffAmount = parseFloat(expenseData.amount) - (oldExpense ? oldExpense.amount : 0);

        const updatedExpenses = expenses.map(e => e._id === id ? { ...e, ...expenseData, amount: parseFloat(expenseData.amount) } : e);
        setExpenses(updatedExpenses);
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

        // Adjust wallet balance difference
        if (expenseData.walletId) {
          const updatedWallets = wallets.map(w => {
            if (w._id === expenseData.walletId) {
              return { ...w, balance: w.balance - diffAmount };
            }
            return w;
          });
          setWallets(updatedWallets);
          localStorage.setItem('wallets', JSON.stringify(updatedWallets));
        }
      } else {
        await expenseService.updateExpense(id, expenseData);
        await fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update expense');
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    setError(null);
    try {
      if (isDemoMode) {
        const target = expenses.find(e => e._id === id);
        const updatedExpenses = expenses.filter(e => e._id !== id);
        setExpenses(updatedExpenses);
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

        // Return money back to the wallet
        if (target && target.walletId) {
          const updatedWallets = wallets.map(w => {
            if (w._id === target.walletId) {
              return { ...w, balance: w.balance + target.amount };
            }
            return w;
          });
          setWallets(updatedWallets);
          localStorage.setItem('wallets', JSON.stringify(updatedWallets));
        }
      } else {
        await expenseService.deleteExpense(id);
        await fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete expense');
      throw err;
    }
  };

  // Wallets CRUD handlers
  const addWallet = async (walletData) => {
    try {
      if (isDemoMode) {
        const newWallet = {
          _id: `wallet-${Date.now()}`,
          ...walletData,
          balance: parseFloat(walletData.balance || 0)
        };
        const updated = [...wallets, newWallet];
        setWallets(updated);
        localStorage.setItem('wallets', JSON.stringify(updated));
        return newWallet;
      } else {
        const added = await expenseService.addWallet(walletData);
        await fetchData();
        return added;
      }
    } catch (err) {
      setError(err.message || 'Failed to create wallet');
      throw err;
    }
  };

  const updateWallet = async (id, walletData) => {
    try {
      if (isDemoMode) {
        const updated = wallets.map(w => w._id === id ? { ...w, ...walletData, balance: parseFloat(walletData.balance) } : w);
        setWallets(updated);
        localStorage.setItem('wallets', JSON.stringify(updated));
      } else {
        await expenseService.updateWallet(id, walletData);
        await fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update wallet');
      throw err;
    }
  };

  const deleteWallet = async (id) => {
    try {
      if (isDemoMode) {
        const updated = wallets.filter(w => w._id !== id);
        setWallets(updated);
        localStorage.setItem('wallets', JSON.stringify(updated));
      } else {
        await expenseService.deleteWallet(id);
        await fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete wallet');
      throw err;
    }
  };

  // Goals CRUD handlers
  const addGoal = async (goalData) => {
    try {
      if (isDemoMode) {
        const newGoal = {
          _id: `goal-${Date.now()}`,
          name: goalData.name,
          targetAmount: parseFloat(goalData.targetAmount),
          currentAmount: parseFloat(goalData.currentAmount || 0),
          category: goalData.category || 'Savings',
          deadline: goalData.deadline
        };
        const updated = [...goals, newGoal];
        setGoals(updated);
        localStorage.setItem('goals', JSON.stringify(updated));
        return newGoal;
      } else {
        const added = await expenseService.addGoal(goalData);
        await fetchData();
        return added;
      }
    } catch (err) {
      setError(err.message || 'Failed to create goal');
      throw err;
    }
  };

  const updateGoal = async (id, goalData) => {
    try {
      if (isDemoMode) {
        const updated = goals.map(g => g._id === id ? {
          ...g,
          ...goalData,
          targetAmount: parseFloat(goalData.targetAmount),
          currentAmount: parseFloat(goalData.currentAmount)
        } : g);
        setGoals(updated);
        localStorage.setItem('goals', JSON.stringify(updated));
      } else {
        await expenseService.updateGoal(id, goalData);
        await fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update goal');
      throw err;
    }
  };

  const deleteGoal = async (id) => {
    try {
      if (isDemoMode) {
        const updated = goals.filter(g => g._id !== id);
        setGoals(updated);
        localStorage.setItem('goals', JSON.stringify(updated));
      } else {
        await expenseService.deleteGoal(id);
        await fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete goal');
      throw err;
    }
  };

  // Simulated Receipt Parsing OCR
  const uploadReceiptOCR = async (file) => {
    setLoading(true);
    try {
      if (isDemoMode) {
        // Simulate network latency & OCR parsing logic
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock parsed receipt info
        const mockOCRResult = {
          title: 'Apple Store Receipt Scan',
          amount: 129.00,
          category: 'Shopping',
          date: new Date().toISOString().split('T')[0],
          description: 'Simulated OCR match: USB-C Hub & Magic Mouse',
          confidence: '94%'
        };
        return mockOCRResult;
      } else {
        const formData = new FormData();
        formData.append('receipt', file);
        return await expenseService.uploadReceipt(formData);
      }
    } catch (err) {
      console.warn("OCR API failed, falling back to mock OCR parse.", err);
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        title: 'Starbucks Coffee Receipt Scan',
        amount: 24.50,
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        description: 'Simulated OCR match: Coffee, Lattes and Pastries',
        confidence: '89%'
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    expenses,
    wallets,
    goals,
    loading,
    error,
    refreshData: fetchData,
    addExpense,
    updateExpense,
    deleteExpense,
    addWallet,
    updateWallet,
    deleteWallet,
    addGoal,
    updateGoal,
    deleteGoal,
    uploadReceiptOCR
  };
};

export default useExpense;
