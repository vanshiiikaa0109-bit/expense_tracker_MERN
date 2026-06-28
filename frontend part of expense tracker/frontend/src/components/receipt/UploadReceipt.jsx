import React, { useState, useRef } from 'react';
import { UploadCloud, FileImage, ShieldAlert, Sparkles } from 'lucide-react';
import Button from '../common/Button';

export const UploadReceipt = ({ onScanSuccess, loading, uploadReceiptOCR }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSetup(droppedFile);
    }
  };

  const handleFileSetup = (selectedFile) => {
    // Only accept images
    if (!selectedFile.type.startsWith('image/')) {
      alert("Please upload an image file (PNG, JPG, JPEG).");
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSetup(e.target.files[0]);
    }
  };

  const handleScanSubmit = async () => {
    if (!file) return;
    try {
      const parsedData = await uploadReceiptOCR(file);
      onScanSuccess(parsedData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'flex-start' }}>
        <Sparkles size={18} color="var(--color-primary)" />
        <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>AI Receipt Scanner</h3>
      </div>

      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          style={{
            width: '100%',
            minHeight: '200px',
            border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--border-color)'}`,
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            cursor: 'pointer',
            backgroundColor: dragActive ? 'rgba(16, 185, 129, 0.03)' : 'rgba(255, 255, 255, 0.01)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
          <UploadCloud size={40} style={{ color: dragActive ? 'var(--color-primary)' : 'var(--text-secondary)', marginBottom: '12px' }} />
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Drag & Drop your receipt
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '240px' }}>
            Supports PNG, JPG, JPEG. The OCR engine will scan and extract transaction details.
          </p>
        </div>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          {previewUrl && (
            <div style={{ position: 'relative', width: '100%', maxWidth: '220px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <img src={previewUrl} alt="Receipt Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
            <FileImage size={16} style={{ color: 'var(--color-primary)' }} />
            <span>{file.name}</span>
            <span style={{ color: 'var(--text-muted)' }}>({(file.size / 1024).toFixed(1)} KB)</span>
          </div>

          {loading ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <div 
                style={{ 
                  height: '6px', 
                  width: '100%', 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  borderRadius: '3px',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Scanning bar effect */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '35%',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '3px',
                    animation: 'scan 1.5s ease-in-out infinite'
                  }}
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Extracting receipts vendor, total and date...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
              <Button variant="secondary" onClick={handleClear} className="w-1/2">
                Clear File
              </Button>
              <Button variant="primary" onClick={handleScanSubmit} className="w-1/2">
                Scan Receipt
              </Button>
            </div>
          )}
        </div>
      )}

      {/* CSS Animation Keyframes for Scanning bar */}
      <style>{`
        @keyframes scan {
          0% { left: 0%; }
          50% { left: 65%; }
          100% { left: 0%; }
        }
      `}</style>
    </div>
  );
};

export default UploadReceipt;
