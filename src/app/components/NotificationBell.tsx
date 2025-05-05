'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';
import Link from 'next/link';
import styles from './NotificationBell.module.css';

const NotificationBell: React.FC = () => {
  const { userNotifications, getUnreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
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
      return date.toLocaleDateString('vi-VN');
    }
  };

  // Xử lý khi click vào thông báo
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  // Sắp xếp thông báo theo thời gian (mới nhất lên đầu)
  const sortedNotifications = [...userNotifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className={styles.notificationContainer} ref={dropdownRef}>
      <button
        className={styles.notificationButton}
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Thông báo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={styles.bellIcon}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {getUnreadCount() > 0 && (
          <span className={styles.notificationBadge}>{getUnreadCount()}</span>
        )}
      </button>

      {showDropdown && (
        <div className={styles.notificationDropdown}>
          <div className={styles.notificationHeader}>
            <h3 className={styles.notificationTitle}>Thông báo</h3>
            {getUnreadCount() > 0 && (
              <button
                className={styles.markAllReadButton}
                onClick={() => markAllAsRead()}
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>

          <div className={styles.notificationList}>
            {sortedNotifications.length === 0 ? (
              <div className={styles.emptyNotification}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.emptyIcon}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              sortedNotifications.map((notification) => (
                <Link
                  href={`/notifications/${notification.id}`}
                  key={notification.id}
                  className={`${styles.notificationItem} ${
                    !notification.isRead ? styles.unread : ''
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className={styles.notificationContent}>
                    <h4 className={styles.notificationItemTitle}>
                      {notification.title}
                    </h4>
                    <p className={styles.notificationItemMessage}>
                      {notification.message.length > 100
                        ? `${notification.message.substring(0, 100)}...`
                        : notification.message}
                    </p>
                    <div className={styles.notificationMeta}>
                      <span className={styles.notificationTime}>
                        {formatTime(notification.createdAt)}
                      </span>
                      <span className={styles.notificationSender}>
                        Từ: {notification.senderName}
                      </span>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <span className={styles.unreadDot}></span>
                  )}
                </Link>
              ))
            )}
          </div>

          <div className={styles.notificationFooter}>
            <Link href="/notifications" className={styles.viewAllLink}>
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
