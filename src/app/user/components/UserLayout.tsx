'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import UserHeader from './UserHeader';
import UserNavigation from './UserNavigation';
import UserFooter from './UserFooter';
import { useRouter } from 'next/navigation';
import styles from './UserLayout.module.css';

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  // Toggle navigation collapse state
  const toggleNavigation = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  // Load navigation state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('navCollapsed');
    if (savedState !== null) {
      setIsNavCollapsed(savedState === 'true');
    }
  }, []);

  // Save navigation state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('navCollapsed', isNavCollapsed.toString());
  }, [isNavCollapsed]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

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

  // Hiển thị thông báo nếu chưa đăng nhập
  if (!user) {
    return null; // Will be redirected in useEffect
  }

  return (
    <div className={`${styles.layoutContainer} ${isNavCollapsed ? styles.navCollapsed : ''}`}>
      <UserHeader />
      <UserNavigation isCollapsed={isNavCollapsed} toggleNavigation={toggleNavigation} />
      <div className={styles.mainContent}>
        {children}
      </div>
      <UserFooter />
    </div>
  );
};

export default UserLayout;
