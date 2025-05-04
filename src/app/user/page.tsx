'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './user.module.css';

export default function UserDashboard() {
  const { user, logout, isLoading } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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
    return (
      <div className={styles.loginPromptContainer}>
        <div className={styles.loginPromptContent}>
          <p>Bạn cần đăng nhập để truy cập trang này</p>
          <Link href="/login" className={styles.loginButton}>
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
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
                  <Link href="/" className={styles.quickLink}>
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
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconLarge} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div className={styles.welcomeText}>
            <h2>Xin chào, {user.name}!</h2>
            <p>Chúc bạn một ngày làm việc hiệu quả</p>
          </div>
        </div>

        <h3 className={styles.sectionTitle}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconMedium} ${styles.sectionIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Chọn dịch vụ bạn muốn sử dụng:
        </h3>

          <div className={styles.servicesGrid}>
            {/* Đặt chỗ */}
            <div className={`${styles.serviceCard} ${styles.blue}`}>
              <div className={`${styles.serviceIcon} ${styles.blue}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconLarge} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className={styles.serviceTitle}>Đặt chỗ</h4>
              <p className={styles.serviceDescription}>Đặt phòng học, phòng làm việc nhóm hoặc không gian học tập</p>
              <Link href="/booking" className={`${styles.serviceButton} ${styles.blue}`}>
                <span>Đặt ngay</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Mượn thiết bị */}
            <div className={`${styles.serviceCard} ${styles.green}`}>
              <div className={`${styles.serviceIcon} ${styles.green}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconLarge} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className={styles.serviceTitle}>Mượn thiết bị</h4>
              <p className={styles.serviceDescription}>Mượn các thiết bị học tập, nghiên cứu như máy tính, máy chiếu</p>
              <Link href="/equipment" className={`${styles.serviceButton} ${styles.green}`}>
                <span>Mượn ngay</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Lịch sử đặt phòng */}
            <div className={`${styles.serviceCard} ${styles.purple}`}>
              <div className={`${styles.serviceIcon} ${styles.purple}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconLarge} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className={styles.serviceTitle}>Lịch sử đặt phòng</h4>
              <p className={styles.serviceDescription}>Xem lại lịch sử đặt phòng, mượn thiết bị và quản lý đặt chỗ</p>
              <Link href="/history" className={`${styles.serviceButton} ${styles.purple}`}>
                <span>Xem lịch sử</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Gửi ý kiến */}
            <div className={`${styles.serviceCard} ${styles.orange}`}>
              <div className={`${styles.serviceIcon} ${styles.orange}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconLarge} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h4 className={styles.serviceTitle}>Gửi ý kiến</h4>
              <p className={styles.serviceDescription}>Gửi phản hồi, góp ý hoặc báo cáo sự cố để cải thiện dịch vụ</p>
              <Link href="/feedback" className={`${styles.serviceButton} ${styles.orange}`}>
                <span>Gửi ý kiến</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>


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
