'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import UserLayout from './components/UserLayout';
import styles from './user.module.css';

export default function UserDashboard() {
  const { user, logout } = useAuth();

  return (
    <UserLayout>

      <div className={styles.dashboardContent}>
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconLarge} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div className={styles.welcomeText}>
            <h2>Xin chào, {user?.name || 'người dùng'}!</h2>
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


      </div>
    </UserLayout>
  );
}
