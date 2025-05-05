'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import UserLayout from '../components/UserLayout';
import Image from 'next/image';
import styles from './profile.module.css';

export default function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    bio: user?.bio || '',
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trong ứng dụng thực tế, bạn sẽ gửi dữ liệu đến API
    console.log('Cập nhật thông tin:', formData);
    
    // Hiển thị thông báo thành công
    setShowSuccessMessage(true);
    
    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
      setShowSuccessMessage(false);
      setIsEditing(false);
    }, 3000);
  };

  return (
    <UserLayout>
      <div className={styles.profileContent}>
        <h1 className={styles.pageTitle}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.pageTitleIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Hồ sơ cá nhân
        </h1>

        {showSuccessMessage && (
          <div className={styles.successMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.successIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Thông tin cá nhân đã được cập nhật thành công!</span>
          </div>
        )}

        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatar}>
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name || 'User'}
                  width={120}
                  height={120}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              {isEditing && (
                <button className={styles.changeAvatarButton}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.changeAvatarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Đổi ảnh</span>
                </button>
              )}
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{user?.name}</h2>
              <p className={styles.profileRole}>{user?.role}</p>
              <p className={styles.profileId}>ID: {user?.id}</p>
              {!isEditing && (
                <button 
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.editIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh sửa thông tin
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            <form className={styles.profileForm} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>Họ và tên</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={styles.formInput}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={styles.formInput}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.formLabel}>Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={styles.formInput}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="department" className={styles.formLabel}>Khoa/Phòng ban</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    className={styles.formInput}
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="bio" className={styles.formLabel}>Giới thiệu bản thân</label>
                <textarea
                  id="bio"
                  name="bio"
                  className={styles.formTextarea}
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                ></textarea>
              </div>
              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={`${styles.formButton} ${styles.cancelButton}`}
                  onClick={() => setIsEditing(false)}
                >
                  Hủy
                </button>
                <button type="submit" className={styles.formButton}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Lưu thay đổi
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.profileDetails}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Email:</span>
                  <span className={styles.detailValue}>{user?.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Số điện thoại:</span>
                  <span className={styles.detailValue}>{user?.phone || 'Chưa cập nhật'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Khoa/Phòng ban:</span>
                  <span className={styles.detailValue}>{user?.department || 'Chưa cập nhật'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Vai trò:</span>
                  <span className={styles.detailValue}>{user?.role}</span>
                </div>
              </div>
              {user?.bio && (
                <div className={styles.bioSection}>
                  <h3 className={styles.bioTitle}>Giới thiệu</h3>
                  <p className={styles.bioText}>{user.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.securitySection}>
          <h2 className={styles.sectionTitle}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.sectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Bảo mật tài khoản
          </h2>
          <div className={styles.securityCard}>
            <div className={styles.securityItem}>
              <div className={styles.securityInfo}>
                <h3 className={styles.securityTitle}>Đổi mật khẩu</h3>
                <p className={styles.securityDescription}>Cập nhật mật khẩu của bạn để bảo vệ tài khoản</p>
              </div>
              <button className={styles.securityButton}>
                Đổi mật khẩu
              </button>
            </div>
            <div className={styles.securityItem}>
              <div className={styles.securityInfo}>
                <h3 className={styles.securityTitle}>Xác thực hai yếu tố</h3>
                <p className={styles.securityDescription}>Thêm một lớp bảo mật cho tài khoản của bạn</p>
              </div>
              <button className={styles.securityButton}>
                Thiết lập
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
