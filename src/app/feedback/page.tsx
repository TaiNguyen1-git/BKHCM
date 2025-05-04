'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './feedback.module.css';

// Dữ liệu mẫu cho các loại phản hồi
const feedbackTypes = [
  {
    id: 'general',
    label: 'Góp ý chung',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={styles.feedbackTypeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    id: 'bug',
    label: 'Báo lỗi',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={styles.feedbackTypeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    id: 'feature',
    label: 'Đề xuất tính năng',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={styles.feedbackTypeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: 'improvement',
    label: 'Cải thiện hệ thống',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={styles.feedbackTypeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export default function FeedbackPage() {
  const { user, logout, isLoading } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [feedbackType, setFeedbackType] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.replace('/login');
    }
  }, [user, isLoading]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (showProfileDropdown && !target.closest(`.${styles.userInfo}`)) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, this would send a request to the API
    console.log('Submitting feedback:', {
      type: feedbackType,
      subject: subject,
      message: message,
      rating: rating
    });
    
    // Show success message
    setShowSuccess(true);
    
    // Reset form
    setFeedbackType('general');
    setSubject('');
    setMessage('');
    setRating(0);
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle new feedback button click
  const handleNewFeedback = () => {
    setShowSuccess(false);
  };

  // Hiển thị loading khi đang tải
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo đăng nhập nếu chưa đăng nhập
  if (!user) {
    return (
      <div className={styles.loginPromptContainer}>
        <div className={styles.loginPromptContent}>
          <h2>Vui lòng đăng nhập để gửi ý kiến phản hồi</h2>
          <p>Bạn cần đăng nhập để có thể gửi ý kiến phản hồi và góp ý cho hệ thống.</p>
          <Link href="/login" className={styles.loginButton}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.feedbackContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <Image
              src="/hcmut.png"
              alt="HCMUT Logo"
              width={40}
              height={40}
            />
            <div className={styles.logoText}>
              <h1>Trường Đại học Bách khoa - ĐHQG TPHCM</h1>
              <p>Smart Study Space Management and Reservation System for HCMUT</p>
            </div>
          </div>
          <div className={styles.userInfo}>
            <div 
              className={styles.userProfileIcon} 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            {/* User Profile Dropdown */}
            <div className={`${styles.userProfileDropdown} ${showProfileDropdown ? styles.show : ''}`}>
              <div className={styles.profileDropdownHeader}>
                <div className={styles.userProfileIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className={styles.userDetails}>
                  <p className={styles.userName}>{user.name}</p>
                  <p className={styles.userRole}>{user.role}</p>
                </div>
              </div>
              <div className={styles.profileDropdownContent}>
                <ul className={styles.accountInfoList}>
                  <li className={styles.accountInfoItem}>
                    <span className={styles.accountInfoLabel}>ID:</span>
                    <span className={styles.accountInfoValue}>{user.id}</span>
                  </li>
                  <li className={styles.accountInfoItem}>
                    <span className={styles.accountInfoLabel}>Tên:</span>
                    <span className={styles.accountInfoValue}>{user.name}</span>
                  </li>
                  <li className={styles.accountInfoItem}>
                    <span className={styles.accountInfoLabel}>Vai trò:</span>
                    <span className={`${styles.accountInfoValue} ${styles.highlight}`}>{user.role}</span>
                  </li>
                  <li className={styles.accountInfoItem}>
                    <span className={styles.accountInfoLabel}>Email:</span>
                    <span className={styles.accountInfoValue}>{user.email}</span>
                  </li>
                </ul>
                <div className={styles.quickLinksGrid} style={{marginTop: '1rem'}}>
                  <Link href="/user" className={styles.quickLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.quickLinkIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Trang chủ
                  </Link>
                  <Link href="/booking" className={styles.quickLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.quickLinkIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Đặt phòng
                  </Link>
                  <Link href="/equipment" className={styles.quickLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.quickLinkIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    Mượn thiết bị
                  </Link>
                  <Link href="/history" className={styles.quickLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.quickLinkIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Lịch sử
                  </Link>
                  <Link href="/feedback" className={styles.quickLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.quickLinkIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Góp ý
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                    }}
                    className={`${styles.quickLink} ${styles.danger}`}
                    style={{background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem'}}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.quickLinkIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconMedium} ${styles.pageTitleIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Góp ý phản hồi
        </h1>

        {/* Success Message */}
        {showSuccess && (
          <div className={styles.successMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.successIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className={styles.successContent}>
              <h3 className={styles.successTitle}>Cảm ơn bạn đã gửi phản hồi!</h3>
              <p className={styles.successText}>Phản hồi của bạn đã được ghi nhận. Chúng tôi sẽ xem xét và cải thiện hệ thống dựa trên góp ý của bạn.</p>
              <button className={styles.successButton} onClick={handleNewFeedback}>
                <span>Gửi phản hồi khác</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.successButtonIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Feedback Form */}
        {!showSuccess && (
          <form className={styles.feedbackForm} onSubmit={handleSubmit}>
            <h2 className={styles.formTitle}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconMedium} ${styles.formTitleIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Gửi ý kiến phản hồi
            </h2>

            {/* Feedback Types */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Loại phản hồi</label>
              <div className={styles.feedbackTypes}>
                {feedbackTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`${styles.feedbackType} ${feedbackType === type.id ? styles.active : ''}`}
                    onClick={() => setFeedbackType(type.id)}
                  >
                    {type.icon}
                    <span className={styles.feedbackTypeLabel}>{type.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className={styles.ratingGroup}>
              <label className={styles.ratingLabel}>Đánh giá trải nghiệm của bạn</label>
              <div className={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${styles.ratingStar} ${rating >= star ? styles.active : ''}`}
                    fill={rating >= star ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={() => setRating(star)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ))}
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="subject" className={styles.formLabel}>Tiêu đề</label>
                <input
                  type="text"
                  id="subject"
                  className={styles.formInput}
                  placeholder="Nhập tiêu đề phản hồi..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>Nội dung phản hồi</label>
              <textarea
                id="message"
                className={styles.formTextarea}
                placeholder="Nhập nội dung phản hồi chi tiết..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={`${styles.formButton} ${styles.secondary}`} onClick={() => {
                setFeedbackType('general');
                setSubject('');
                setMessage('');
                setRating(0);
              }}>
                <span>Xóa form</span>
              </button>
              <button type="submit" className={styles.formButton}>
                <span>Gửi phản hồi</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <Image
              src="/hcmut.png"
              alt="HCMUT Logo"
              width={30}
              height={30}
              className={styles.footerLogoImage}
            />
            <span className={styles.footerLogoText}>SSMR - Trường Đại học Bách khoa - ĐHQG TPHCM</span>
          </div>
          <div className={styles.footerCopyright}>
            © 2025 - All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
