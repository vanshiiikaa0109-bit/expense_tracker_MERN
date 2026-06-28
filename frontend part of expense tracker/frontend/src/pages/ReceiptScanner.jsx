import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import useExpense from '../hooks/useExpense';
import UploadReceipt from '../components/receipt/UploadReceipt';
import Modal from '../components/common/Modal';
import ExpenseForm from '../components/expense/ExpenseForm';
import Loader from '../components/common/Loader';

export const ReceiptScanner = () => {
  const navigate = useNavigate();
  const { wallets, addExpense, uploadReceiptOCR, loading } = useExpense();
  
  const [draftExpense, setDraftExpense] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  const handleScanSuccess = (parsedData) => {
    // Inject first available wallet if exists
    const defaultWalletId = wallets.length > 0 ? wallets[0]._id : '';
    setDraftExpense({
      ...parsedData,
      walletId: defaultWalletId
    });
    setModalOpen(true);
  };

  const handleConfirmDraft = async (formData) => {
    try {
      await addExpense(formData);
      setModalOpen(false);
      setDraftExpense(null);
      setSuccessBanner(true);
      
      // Auto dismiss success banner
      setTimeout(() => {
        setSuccessBanner(false);
        navigate('/expenses');
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
      
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Smart Receipt Capture
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Upload invoice snapshots and automatically fill out transaction fields using AI OCR
        </p>
      </div>

      {successBanner && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '16px',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '10px',
            color: 'var(--color-success)',
            fontSize: '0.875rem',
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={18} />
          <span>Receipt successfully scanned, verified, and logged to transactions database!</span>
        </div>
      )}

      {/* Upload Drag Card */}
      <UploadReceipt
        onScanSuccess={handleScanSuccess}
        loading={loading}
        uploadReceiptOCR={uploadReceiptOCR}
      />

      {/* OCR Scan Guide Card */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scan size={16} color="var(--color-primary)" /> How it works
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flexShrink: 0 }}>1</span>
            <span>Take a clear snapshot of your receipt from your phone or device.</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flexShrink: 0 }}>2</span>
            <span>Drag and drop or browse the file upload zone above.</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flexShrink: 0 }}>3</span>
            <span>Verify the OCR matched merchant name, transaction totals, and category drafts in the modal popups.</span>
          </div>
        </div>
      </div>

      {/* Draft Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Verify Extracted OCR Details"
      >
        {draftExpense && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: 'var(--color-success)',
                fontSize: '0.75rem',
                fontWeight: 600,
                marginBottom: '16px'
              }}
            >
              <Sparkles size={14} />
              <span>AI OCR parsed details with {draftExpense.confidence || '90%'} confidence.</span>
            </div>
            
            <ExpenseForm
              expense={draftExpense}
              wallets={wallets}
              onSubmit={handleConfirmDraft}
              onCancel={() => setModalOpen(false)}
            />
          </div>
        )}
      </Modal>

    </div>
  );
};

export default ReceiptScanner;
