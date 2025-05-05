'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationBell from '../../components/NotificationBell';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import styles from './notification.module.css';

export default function NotificationDetailPage() {
  const { user, logout, isLoading } = useAuth();
  const { getNotificationById, markAsRead, deleteNotification } = useNotifications();
  const router = useRouter();
  const params = useParams();
  const notificationId = params.id as string;

  // State
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notification, setNotification] = useState<any>(null);

  // Fetch notification data
  useEffect(() => {
    if (notificationId) {
      const notificationData = getNotificationById(notificationId);
      if (notificationData) {
        setNotification(notificationData);
        if (!notificationData.isRead) {
          markAsRead(notificationId);
        }
      } else {
        // Notification not found, redirect to notifications list
        router.push('/notifications');
      }
    }
  }, [notificationId, getNotificationById, markAsRead, router]);

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
      if (!target.closest('.profileDropdown') && !target.closest('.userProfileIcon')) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle delete notification
  const handleDeleteNotification = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này không?')) {
      deleteNotification(notificationId);
      router.push('/notifications');
    }
  };

  // Loading state
  if (isLoading || !notification) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  // If not logged in
  if (!user) {
    return null; // Will be redirected in useEffect
  }

  return (
    <div className={styles.notificationDetailContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <Link href={user.role === 'Quản trị viên' || user.role === 'Ban quản lý' ? '/admin' : '/user'} className={styles.logoLink}>
              <Image
                src="/hcmut.png"
                alt="HCMUT Logo"
                width={45}
                height={45}
              />
              <div className={styles.logoText}>
                <h1>Trường Đại học Bách khoa - ĐHQG TPHCM</h1>
                <p>Smart Study Space Management and Reservation System for HCMUT</p>
              </div>
            </Link>
          </div>
          <div className={styles.userInfo}>
            <NotificationBell />
            <div
              className={styles.userProfileIcon}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                  className={styles.userAvatar}
                />
              ) : (
                <div className={styles.userAvatarPlaceholder}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className={styles.userName}>{user.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {showProfileDropdown && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileInfo}>
                  <div className={styles.profileAvatar}>
                    <div className={styles.avatarPlaceholder}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className={styles.profileDetails}>
                    <h3 className={styles.profileName}>{user.name}</h3>
                    <p className={styles.profileRole}>{user.role}</p>
                    <p className={styles.profileEmail}>{user.email}</p>
                  </div>
                </div>
                <div className={styles.profileLinks}>
                  <Link href={user.role === 'Quản trị viên' || user.role === 'Ban quản lý' ? '/admin' : '/user'} className={styles.profileLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Trang chủ
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = '/login';
                    }}
                    className={styles.logoutButton}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <div className={styles.breadcrumbs}>
            <Link href={user.role === 'Quản trị viên' || user.role === 'Ban quản lý' ? '/admin' : '/user'} className={styles.breadcrumbLink}>Trang chủ</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href="/notifications" className={styles.breadcrumbLink}>Thông báo</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>Chi tiết thông báo</span>
          </div>
          <div className={styles.pageActions}>
            <button
              className={styles.backButton}
              onClick={() => router.push('/notifications')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại
            </button>
            <button
              className={styles.deleteButton}
              onClick={handleDeleteNotification}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Xóa thông báo
            </button>
          </div>
        </div>

        <div className={styles.notificationCard}>
          <div className={styles.notificationHeader}>
            <h1 className={styles.notificationTitle}>{notification.title}</h1>
            <div className={styles.notificationMeta}>
              <div className={styles.senderInfo}>
                <span className={styles.senderLabel}>Người gửi:</span>
                <span className={styles.senderName}>{notification.senderName}</span>
              </div>
              <div className={styles.timeInfo}>
                <span className={styles.timeLabel}>Thời gian:</span>
                <span className={styles.timeValue}>{formatDate(notification.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className={styles.notificationContent}>
            <p className={styles.notificationMessage}>{notification.message}</p>
          </div>

          {notification.feedbackId && (
            <div className={styles.notificationActions}>
              <Link href={`/feedback/${notification.feedbackId}`} className={styles.viewFeedbackButton}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Xem phản hồi liên quan
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
