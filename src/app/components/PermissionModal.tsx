'use client';

import React from 'react';
import styles from './PermissionModal.module.css';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const PermissionModal: React.FC<PermissionModalProps> = ({ 
  isOpen, 
  onClose,
  message = 'Bạn không có quyền truy cập chức năng này. Vui lòng liên hệ quản trị viên để được hỗ trợ.'
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Không đủ quyền truy cập</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.iconContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.warningIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.okButton} onClick={onClose}>Đã hiểu</button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
