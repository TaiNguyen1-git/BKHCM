'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './UserNavigation.module.css';

interface UserNavigationProps {
  isCollapsed: boolean;
  toggleNavigation: () => void;
}

const UserNavigation: React.FC<UserNavigationProps> = ({ isCollapsed, toggleNavigation }) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  return (
    <nav className={`${styles.navigation} ${isCollapsed ? styles.collapsed : ''}`}>
      <button
        className={styles.toggleButton}
        onClick={toggleNavigation}
        aria-label={isCollapsed ? "Hiện menu" : "Ẩn menu"}
      >
        {isCollapsed ? (
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.toggleIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.toggleIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        )}
      </button>
      <div className={styles.navContainer}>
        <Link
          href="/user"
          className={`${styles.navLink} ${isActive('/user') && !isActive('/user/profile') && !isActive('/user/settings') && !isActive('/user/bookings') ? styles.active : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className={styles.navText}>Trang chủ</span>
        </Link>

        <Link
          href="/booking"
          className={`${styles.navLink} ${isActive('/booking') ? styles.active : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={styles.navText}>Đặt phòng</span>
        </Link>

        <Link
          href="/equipment"
          className={`${styles.navLink} ${isActive('/equipment') ? styles.active : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          <span className={styles.navText}>Mượn thiết bị</span>
        </Link>

        <Link
          href="/user/bookings"
          className={`${styles.navLink} ${isActive('/user/bookings') ? styles.active : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className={styles.navText}>Lịch đặt phòng</span>
        </Link>

        <Link
          href="/history"
          className={`${styles.navLink} ${isActive('/history') ? styles.active : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={styles.navText}>Lịch sử</span>
        </Link>

        <Link
          href="/feedback"
          className={`${styles.navLink} ${isActive('/feedback') ? styles.active : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className={styles.navText}>Góp ý</span>
        </Link>

        <Link
          href="/user/profile"
          className={`${styles.navLink} ${isActive('/user/profile') ? styles.active : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className={styles.navText}>Hồ sơ cá nhân</span>
        </Link>

        <Link
          href="/user/settings"
          className={`${styles.navLink} ${isActive('/user/settings') ? styles.active : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className={styles.navText}>Cài đặt</span>
        </Link>
      </div>
    </nav>
  );
};

export default UserNavigation;
