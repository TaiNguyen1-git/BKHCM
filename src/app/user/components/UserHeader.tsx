'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import NotificationBell from '@/app/components/NotificationBell';
import styles from './UserHeader.module.css';

const UserHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          <Link href="/user" className={styles.logoLink}>
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
            {user?.avatar ? (
              <Image
                src={user?.avatar || ''}
                alt={user?.name || 'User'}
                width={32}
                height={32}
                className={styles.userAvatar}
              />
            ) : (
              <div className={styles.userAvatarPlaceholder}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className={styles.userName}>{user?.name}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {showProfileDropdown && (
            <div className={styles.profileDropdown}>
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>
                  {user?.avatar ? (
                    <Image
                      src={user?.avatar || ''}
                      alt={user?.name || 'User'}
                      width={48}
                      height={48}
                      className={styles.userAvatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className={styles.profileDetails}>
                  <p className={styles.profileName}>{user?.name}</p>
                  <p className={styles.profileRole}>{user?.role}</p>
                  <p className={styles.profileEmail}>{user?.email}</p>
                </div>
              </div>
              <div className={styles.profileLinks}>
                <Link href="/user/profile" className={styles.profileLink}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Hồ sơ cá nhân
                </Link>
                <Link href="/user/settings" className={styles.profileLink}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Cài đặt
                </Link>
                <Link href="/user/bookings" className={styles.profileLink}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Lịch đặt phòng
                </Link>
                <button
                  className={styles.logoutButton}
                  onClick={() => {
                    logout();
                    window.location.href = '/login';
                  }}
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
  );
};

export default UserHeader;
