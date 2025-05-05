'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import usePermission from '../hooks/usePermission';
import PermissionModal from '../components/PermissionModal';
import AdminLayout from './components/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const { showPermissionModal, setShowPermissionModal } = usePermission();

  // Redirect if not logged in or not an admin/manager
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        window.location.replace('/login');
      } else if (user.role !== 'Quản trị viên' && user.role !== 'Ban quản lý') {
        // Redirect non-admin/non-manager users to the user page
        window.location.replace('/user');
      }
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <AdminLayout requiredPermission="admin.dashboard">
      {/* Permission Modal */}
      <PermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        message="Bạn không có quyền truy cập chức năng này. Vui lòng liên hệ quản trị viên để được hỗ trợ."
      />

      {/* Main content */}
      <main className={styles.mainContent}>
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconLarge} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className={styles.welcomeText}>
            <h2>Xin chào, {user.name}!</h2>
            <p>Chào mừng đến với trang quản trị hệ thống</p>
          </div>
        </div>

        <div className={styles.adminSections}>
          <div className={styles.adminSection}>
            <h3 className={styles.sectionTitle}>Quản lý người dùng</h3>
            <div className={styles.sectionContent}>
              <div className={styles.adminCard}>
                <div className={styles.adminCardIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className={styles.adminCardContent}>
                  <h4>Quản lý tài khoản</h4>
                  <p>Thêm, sửa, xóa tài khoản người dùng</p>
                  <Link
                    href="/admin/users"
                    className={styles.adminCardLink}
                    onClick={(e) => {
                      if (user.role === 'Ban quản lý') {
                        e.preventDefault();
                        setShowPermissionModal(true);
                      }
                    }}
                  >
                    Truy cập
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.adminSection}>
            <h3 className={styles.sectionTitle}>Quản lý phòng học</h3>
            <div className={styles.sectionContent}>
              <div className={styles.adminCard}>
                <div className={styles.adminCardIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className={styles.adminCardContent}>
                  <h4>Quản lý phòng</h4>
                  <p>Thêm, sửa, xóa thông tin phòng học</p>
                  <Link
                    href="/admin/rooms"
                    className={styles.adminCardLink}
                    onClick={(e) => {
                      if (user.role === 'Ban quản lý') {
                        e.preventDefault();
                        setShowPermissionModal(true);
                      }
                    }}
                  >
                    Truy cập
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className={styles.adminCard}>
                <div className={styles.adminCardIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className={styles.adminCardContent}>
                  <h4>Quản lý đặt phòng</h4>
                  <p>Xem và phê duyệt yêu cầu đặt phòng</p>
                  <Link
                    href="/admin/bookings"
                    className={styles.adminCardLink}
                    onClick={(e) => {
                      if (user.role === 'Ban quản lý') {
                        e.preventDefault();
                        setShowPermissionModal(true);
                      }
                    }}
                  >
                    Truy cập
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.adminSection}>
            <h3 className={styles.sectionTitle}>Quản lý thiết bị</h3>
            <div className={styles.sectionContent}>
              <div className={styles.adminCard}>
                <div className={styles.adminCardIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div className={styles.adminCardContent}>
                  <h4>Quản lý thiết bị</h4>
                  <p>Thêm, sửa, xóa thông tin thiết bị</p>
                  <Link
                    href="/admin/equipment"
                    className={styles.adminCardLink}
                    onClick={(e) => {
                      if (user.role === 'Ban quản lý') {
                        e.preventDefault();
                        setShowPermissionModal(true);
                      }
                    }}
                  >
                    Truy cập
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className={styles.adminCard}>
                <div className={styles.adminCardIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className={styles.adminCardContent}>
                  <h4>Quản lý mượn thiết bị</h4>
                  <p>Xem và phê duyệt yêu cầu mượn thiết bị</p>
                  <Link
                    href="/admin/equipment"
                    className={styles.adminCardLink}
                    onClick={(e) => {
                      if (user.role === 'Ban quản lý') {
                        e.preventDefault();
                        setShowPermissionModal(true);
                      }
                    }}
                  >
                    Truy cập
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.adminSection}>
            <h3 className={styles.sectionTitle}>Báo cáo và thống kê</h3>
            <div className={styles.sectionContent}>
              <div className={styles.adminCard}>
                <div className={styles.adminCardIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className={styles.adminCardContent}>
                  <h4>Thống kê sử dụng</h4>
                  <p>Xem báo cáo thống kê sử dụng phòng và thiết bị</p>
                  <Link href="/admin/reports" className={styles.adminCardLink}>
                    Truy cập
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className={styles.adminCard}>
                <div className={styles.adminCardIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className={styles.adminCardContent}>
                  <h4>Quản lý phản hồi</h4>
                  <p>Xem và phản hồi góp ý của người dùng</p>
                  <Link href="/admin/feedback" className={styles.adminCardLink}>
                    Truy cập
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
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
    </AdminLayout>
  );
}
