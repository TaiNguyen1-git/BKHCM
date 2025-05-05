'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFeedback, feedbackTypes } from '../context/FeedbackContext';
import Link from 'next/link';
import Image from 'next/image';
import UserLayout from '../user/components/UserLayout';
import styles from './feedback.module.css';

// Thêm icon cho các loại phản hồi
const feedbackTypeIcons = {
  'general': (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.feedbackTypeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  'bug': (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.feedbackTypeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  'feature': (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.feedbackTypeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  'complaint': (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.feedbackTypeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'question': (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.feedbackTypeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function FeedbackPage() {
  const { user } = useAuth();
  const [feedbackType, setFeedbackType] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Import useFeedback hook
  const { addFeedback } = useFeedback();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Add feedback to context
    addFeedback({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      userEmail: user.email,
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



  return (
    <UserLayout>
      <div className={styles.feedbackContent}>
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
                    {feedbackTypeIcons[type.id as keyof typeof feedbackTypeIcons]}
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
      </div>
    </UserLayout>
  );
}
