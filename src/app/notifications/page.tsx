'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationBell from '../components/NotificationBell';
import Link from 'next/link';
import Image from 'next/image';
import styles from './notifications.module.css';

export default function NotificationsPage() {
  const { user, logout, isLoading } = useAuth();
  const { userNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  // State
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'read', 'unread'

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

  // Định dạng thời gian
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Lọc thông báo theo trạng thái
  const filteredNotifications = userNotifications.filter(notification => {
    if (filterType === 'read') return notification.isRead;
    if (filterType === 'unread') return !notification.isRead;
    return true;
  });

  // Sắp xếp thông báo theo thời gian (mới nhất lên đầu)
  const sortedNotifications = [...filteredNotifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Xử lý khi click vào thông báo
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  // Xử lý xóa thông báo
  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này không?')) {
      deleteNotification(id);
    }
  };

  // Loading state
  if (isLoading) {
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
    <div className={styles.notificationsContainer}>
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
            <span className={styles.breadcrumbCurrent}>Thông báo</span>
          </div>
          <h1 className={styles.pageTitle}>Thông báo của bạn</h1>
        </div>

        <div className={styles.notificationsControls}>
          <div className={styles.filterContainer}>
            <button
              className={`${styles.filterButton} ${filterType === 'all' ? styles.active : ''}`}
              onClick={() => setFilterType('all')}
            >
              Tất cả
            </button>
            <button
              className={`${styles.filterButton} ${filterType === 'unread' ? styles.active : ''}`}
              onClick={() => setFilterType('unread')}
            >
              Chưa đọc
            </button>
            <button
              className={`${styles.filterButton} ${filterType === 'read' ? styles.active : ''}`}
              onClick={() => setFilterType('read')}
            >
              Đã đọc
            </button>
          </div>

          {filteredNotifications.some(notification => !notification.isRead) && (
            <button
              className={styles.markAllReadButton}
              onClick={() => markAllAsRead()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Đánh dấu đã đọc tất cả
            </button>
          )}
        </div>

        {sortedNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.emptyStateIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3>Không có thông báo nào</h3>
            <p>Bạn chưa có thông báo nào {filterType === 'read' ? 'đã đọc' : filterType === 'unread' ? 'chưa đọc' : ''}.</p>
          </div>
        ) : (
          <div className={styles.notificationsList}>
            {sortedNotifications.map(notification => (
              <div
                key={notification.id}
                className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className={styles.notificationContent}>
                  <div className={styles.notificationHeader}>
                    <h3 className={styles.notificationTitle}>{notification.title}</h3>
                    <div className={styles.notificationMeta}>
                      <span className={styles.notificationTime}>{formatTime(notification.createdAt)}</span>
                      <span className={styles.notificationSender}>Từ: {notification.senderName}</span>
                    </div>
                  </div>
                  <p className={styles.notificationMessage}>{notification.message}</p>
                  {notification.feedbackId && (
                    <div className={styles.notificationActions}>
                      <Link href={`/feedback/${notification.feedbackId}`} className={styles.viewFeedbackLink}>
                        Xem phản hồi
                      </Link>
                    </div>
                  )}
                </div>
                <div className={styles.notificationControls}>
                  {!notification.isRead && (
                    <button
                      className={styles.markReadButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      title="Đánh dấu đã đọc"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => handleDeleteNotification(notification.id, e)}
                    title="Xóa thông báo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
