'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './services.module.css';

export default function ServicesPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setShowLoginModal(true);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const closeModal = () => {
    setShowLoginModal(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={styles.servicesContainer}>
      {/* Header */}
      <header className={styles.servicesHeader}>
        <div className={styles.headerContainer}>
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

          <div className={styles.desktopMenu}>
            <Link href="/" className={styles.menuLink}>
              Trang chủ
            </Link>
            <Link href="/services" className={styles.menuLink}>
              Dịch vụ
            </Link>
            <Link href="/about" className={styles.menuLink}>
              Về chúng tôi
            </Link>
          </div>

          <button
            className={styles.menuButton}
            onClick={toggleMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <nav>
              <ul className={styles.menuList}>
                <li className={styles.menuItem}>
                  <Link href="/" onClick={toggleMenu} className={styles.menuLink}>
                    Trang chủ
                  </Link>
                </li>
                <li className={styles.menuItem}>
                  <Link href="/services" onClick={toggleMenu} className={styles.menuLink}>
                    Dịch vụ
                  </Link>
                </li>
                <li className={styles.menuItem}>
                  <Link href="/about" onClick={toggleMenu} className={styles.menuLink}>
                    Về chúng tôi
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* Title Section */}
      <section className={styles.titleSection}>
        <div className={styles.titleDots}>
          <div className={styles.titleDot}></div>
          <div className={styles.titleDot}></div>
          <div className={styles.titleDot}></div>
        </div>
        <h1 className={styles.title}>Dịch vụ</h1>
        <div className={styles.titleDots}>
          <div className={styles.titleDot}></div>
        </div>
      </section>

      {/* Services Introduction */}
      <section className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-lg text-gray-600 mb-8">
          Hệ thống Smart Study Space cung cấp các dịch vụ tiện ích giúp sinh viên tối ưu hóa trải nghiệm học tập tại trường Đại học Bách khoa.
        </p>
      </section>

      {/* Services Grid */}
      <section className={styles.servicesGrid}>
        {/* Service 1: Đặt phòng */}
        <div className={styles.serviceCard}>
          <div className={styles.serviceIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="32" height="32">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className={styles.serviceTitle}>Đặt phòng</h3>
          <p className={styles.serviceDescription}>
            Lựa chọn phòng học theo nhu cầu của bạn với hệ thống đặt phòng trực tuyến tiện lợi và nhanh chóng
          </p>
          <button className={styles.serviceButton} onClick={() => handleServiceClick('Đặt phòng')}>
            Sử dụng ngay
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Service 2: Mượn thiết bị */}
        <div className={styles.serviceCard}>
          <div className={styles.serviceIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="32" height="32">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className={styles.serviceTitle}>Mượn thiết bị</h3>
          <p className={styles.serviceDescription}>
            Cung cấp dịch vụ mượn đa dạng thiết bị học tập và nghiên cứu với quy trình đơn giản, thuận tiện
          </p>
          <button className={styles.serviceButton} onClick={() => handleServiceClick('Mượn thiết bị')}>
            Sử dụng ngay
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Service 3: Tùy chọn */}
        <div className={styles.serviceCard}>
          <div className={styles.serviceIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="32" height="32">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className={styles.serviceTitle}>Tùy chọn</h3>
          <p className={styles.serviceDescription}>
            Cung cấp những tùy chọn linh hoạt cho không gian học tập, giúp bạn tạo môi trường học tập phù hợp nhất
          </p>
          <button className={styles.serviceButton} onClick={() => handleServiceClick('Tùy chọn')}>
            Sử dụng ngay
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </section>



      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm">© 2025 - SSMR - Trường Đại học Bách khoa - ĐHQG TPHCM. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Yêu cầu đăng nhập</h3>
              <button className={styles.closeButton} onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.modalIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.modalIconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className={styles.modalText}>
                Để sử dụng dịch vụ <span className={styles.modalHighlight}>{selectedService}</span>, bạn cần đăng nhập vào hệ thống.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.primaryButton} onClick={handleLogin}>
                Đăng nhập ngay
              </button>
              <button className={styles.secondaryButton} onClick={closeModal}>
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
