'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './about.module.css';

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={styles.aboutContainer}>
      {/* Header */}
      <header className={styles.aboutHeader}>
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

      {/* Main Content */}
      <main>
        {/* About Section */}
        <section className={styles.aboutSection}>
          <h1 className={styles.sectionTitle}>Về Chúng Tôi</h1>
          <p className={styles.introText}>
            Hệ thống Smart Study Space Management and Reservation (SSMR) được phát triển bởi đội ngũ sinh viên và giảng viên Trường Đại học Bách khoa - ĐHQG TPHCM, 
            nhằm tối ưu hóa việc quản lý và sử dụng không gian học tập trong khuôn viên trường. Chúng tôi cam kết mang đến trải nghiệm học tập hiệu quả và thuận tiện 
            cho tất cả sinh viên và giảng viên.
          </p>

          {/* Mission & Vision */}
          <div className={styles.missionVisionSection}>
            <div className={styles.missionCard}>
              <h2 className={styles.cardTitle}>
                <div className={styles.cardIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                Sứ mệnh
              </h2>
              <p className={styles.cardText}>
                Sứ mệnh của chúng tôi là tạo ra một hệ thống quản lý không gian học tập thông minh, giúp tối ưu hóa việc sử dụng tài nguyên của trường, 
                đồng thời cung cấp cho sinh viên và giảng viên công cụ hiệu quả để đặt phòng học, mượn thiết bị và tìm không gian học tập phù hợp. 
                Chúng tôi tin rằng một môi trường học tập được tổ chức tốt sẽ góp phần nâng cao chất lượng giáo dục và trải nghiệm học tập tại Trường Đại học Bách khoa.
              </p>
            </div>
            <div className={styles.visionCard}>
              <h2 className={styles.cardTitle}>
                <div className={styles.cardIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                Tầm nhìn
              </h2>
              <p className={styles.cardText}>
                Chúng tôi hướng đến việc xây dựng một hệ sinh thái học tập thông minh, nơi mọi không gian và tài nguyên học tập đều được sử dụng hiệu quả. 
                Trong tương lai, chúng tôi mong muốn mở rộng hệ thống để tích hợp các công nghệ tiên tiến như IoT, AI để tự động hóa và cá nhân hóa trải nghiệm học tập, 
                đồng thời thu thập dữ liệu để cải thiện liên tục dịch vụ của mình. Mục tiêu cuối cùng là tạo ra một mô hình có thể áp dụng cho các trường đại học khác trong cả nước.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <section className={styles.teamSection}>
            <h2 className={styles.sectionTitle}>Đội Ngũ Phát Triển</h2>
            <div className={styles.teamGrid}>
              <div className={styles.teamCard}>
                <Image 
                  src="/team/member1.jpg" 
                  alt="Nguyễn Văn A" 
                  width={300} 
                  height={300} 
                  className={styles.memberImage}
                />
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>Nguyễn Văn A</h3>
                  <p className={styles.memberRole}>Trưởng nhóm</p>
                  <p className={styles.memberBio}>
                    Sinh viên năm cuối ngành Khoa học Máy tính, chuyên về phát triển ứng dụng web và quản lý dự án.
                  </p>
                </div>
              </div>
              <div className={styles.teamCard}>
                <Image 
                  src="/team/member2.jpg" 
                  alt="Trần Thị B" 
                  width={300} 
                  height={300} 
                  className={styles.memberImage}
                />
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>Trần Thị B</h3>
                  <p className={styles.memberRole}>Frontend Developer</p>
                  <p className={styles.memberBio}>
                    Sinh viên năm ba ngành Kỹ thuật Phần mềm, có kinh nghiệm về thiết kế UI/UX và phát triển frontend.
                  </p>
                </div>
              </div>
              <div className={styles.teamCard}>
                <Image 
                  src="/team/member3.jpg" 
                  alt="Lê Văn C" 
                  width={300} 
                  height={300} 
                  className={styles.memberImage}
                />
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>Lê Văn C</h3>
                  <p className={styles.memberRole}>Backend Developer</p>
                  <p className={styles.memberBio}>
                    Sinh viên năm tư ngành Hệ thống Thông tin, chuyên về phát triển backend và quản lý cơ sở dữ liệu.
                  </p>
                </div>
              </div>
              <div className={styles.teamCard}>
                <Image 
                  src="/team/member4.jpg" 
                  alt="Phạm Thị D" 
                  width={300} 
                  height={300} 
                  className={styles.memberImage}
                />
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>Phạm Thị D</h3>
                  <p className={styles.memberRole}>QA Engineer</p>
                  <p className={styles.memberBio}>
                    Sinh viên năm ba ngành Công nghệ Thông tin, chuyên về kiểm thử phần mềm và đảm bảo chất lượng.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className={styles.contactSection}>
            <h2 className={styles.sectionTitle}>Liên Hệ</h2>
            <div className={styles.contactGrid}>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.contactIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className={styles.contactText}>
                    <strong>Địa chỉ</strong>
                    268 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.contactIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className={styles.contactText}>
                    <strong>Email</strong>
                    ssmr@hcmut.edu.vn
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.contactIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className={styles.contactText}>
                    <strong>Điện thoại</strong>
                    (028) 3864 7256
                  </div>
                </div>
              </div>
              <div className={styles.contactMap}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4946681007846!2d106.65843807486876!3d10.772910089387625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ec3c161a3fb%3A0xef77cd47a1cc691e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBCw6FjaCBraG9hIC0gxJDhuqFpIGjhu41jIFF14buRYyBnaWEgVFAuSENN!5e0!3m2!1svi!2s!4v1699000000000!5m2!1svi!2s" 
                  width="100%" 
                  height="300" 
                  style={{ border: 0, borderRadius: '0.5rem' }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </section>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm">© 2025 - SSMR - Trường Đại học Bách khoa - ĐHQG TPHCM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
