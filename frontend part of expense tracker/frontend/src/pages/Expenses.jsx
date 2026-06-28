import React, { useState } from 'react';
import { Plus, ListFilter } from 'lucide-react';
import useExpense from '../hooks/useExpense';
import ExpenseList from '../components/expense/ExpenseList';
import Modal from '../components/common/Modal';
import ExpenseForm from '../components/expense/ExpenseForm';
import Loader from '../components/common/Loader';

export const Expenses = () => {
  const {
    expenses,
    wallets,
    loading,
    addExpense,
    updateExpense,
    deleteExpense
  } = useExpense();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense._id, formData);
      } else {
        await addExpense(formData);
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
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
            Transactions History
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Detailed breakdown of all your income outputs
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      <ExpenseList
        expenses={expenses}
        wallets={wallets}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExpense ? 'Modify Transaction' : 'Record Transaction'}
      >
        <ExpenseForm
          expense={editingExpense}
          wallets={wallets}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Expenses;
