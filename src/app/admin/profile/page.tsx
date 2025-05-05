'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import AdminLayout from '@/app/admin/components/AdminLayout';
import NotificationBell from '@/app/components/NotificationBell';
import Link from 'next/link';
import Image from 'next/image';
import styles from './profile.module.css';

export default function AdminProfilePage() {
  const { user, logout, isLoading, updateUserProfile, changePassword } = useAuth();

  // State
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: null as string | null,
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });
    }
  }, [user]);

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
      if (!target.closest('.profileDropdown') && !target.closest('.userProfileIcon')) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle password form input changes
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      updateUserProfile({
        ...user,
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
      });

      setIsEditing(false);
      setShowSuccessMessage(true);
      setSuccessMessage('Thông tin cá nhân đã được cập nhật thành công!');

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage('Có lỗi xảy ra khi cập nhật thông tin cá nhân.');

      // Hide error message after 3 seconds
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Validate password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setShowErrorMessage(true);
      setErrorMessage('Mật khẩu mới và xác nhận mật khẩu không khớp.');

      // Hide error message after 3 seconds
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);

      return;
    }

    try {
      changePassword(user.id, passwordData.currentPassword, passwordData.newPassword);

      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setShowSuccessMessage(true);
      setSuccessMessage('Mật khẩu đã được thay đổi thành công!');

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage('Có lỗi xảy ra khi thay đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.');

      // Hide error message after 3 seconds
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  // If not logged in
  if (!user) {
    return null; // Will be redirected in useEffect
  }

  return (
    <AdminLayout requiredPermission="admin.dashboard">
      <div className={styles.profileContainer}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logoContainer}>
              <Link href="/admin" className={styles.logoLink}>
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
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className={styles.userAvatar}
                  />
                ) : (
                  <div className={styles.userAvatarPlaceholder}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className={styles.userName}>{user.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {showProfileDropdown && (
                <div className={styles.profileDropdown}>
                  <div className={styles.profileInfo}>
                    <div className={styles.profileAvatar}>
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={48}
                          height={48}
                          className={styles.avatarImage}
                        />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className={styles.profileDetails}>
                      <h3 className={styles.profileName}>{user.name}</h3>
                      <p className={styles.profileRole}>{user.role}</p>
                      <p className={styles.profileEmail}>{user.email}</p>
                    </div>
                  </div>
                  <div className={styles.profileLinks}>
                    <Link href="/admin" className={styles.profileLink}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Trang chủ Admin
                    </Link>
                    <Link href="/admin/profile" className={styles.profileLink}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Hồ sơ cá nhân
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        window.location.href = '/login';
                      }}
                      className={styles.logoutButton}
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

        {/* Main content */}
        <main className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <div className={styles.breadcrumbs}>
              <Link href="/admin" className={styles.breadcrumbLink}>Trang chủ</Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>Hồ sơ cá nhân</span>
            </div>
            <h1 className={styles.pageTitle}>Hồ sơ cá nhân</h1>
          </div>

          {/* Success and Error Messages */}
          {showSuccessMessage && (
            <div className={styles.successMessage}>
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {showErrorMessage && (
            <div className={styles.errorMessage}>
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className={styles.profileContent}>
            {/* Profile Tabs */}
            <div className={styles.profileTabs}>
              <button
                className={`${styles.tabButton} ${activeTab === 'profile' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Thông tin cá nhân
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === 'password' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('password')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Đổi mật khẩu
              </button>
            </div>

            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
              <div className={styles.tabContent}>
                <div className={styles.profileCard}>
                  <div className={styles.profileCardHeader}>
                    <h2 className={styles.profileCardTitle}>Thông tin cá nhân</h2>
                    {!isEditing ? (
                      <button
                        className={styles.editButton}
                        onClick={() => setIsEditing(true)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Chỉnh sửa
                      </button>
                    ) : (
                      <button
                        className={styles.cancelButton}
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form data
                          if (user) {
                            setFormData({
                              name: user.name,
                              email: user.email,
                              avatar: user.avatar,
                            });
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Hủy
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleProfileSubmit} className={styles.profileForm}>
                    <div className={styles.avatarSection}>
                      <div className={styles.avatarContainer}>
                        {formData.avatar ? (
                          <Image
                            src={formData.avatar}
                            alt={formData.name}
                            width={100}
                            height={100}
                            className={styles.profileAvatar}
                          />
                        ) : (
                          <div className={styles.profileAvatarPlaceholder}>
                            {formData.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        {isEditing && (
                          <label className={styles.avatarUploadButton}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className={styles.avatarInput}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="name" className={styles.formLabel}>Họ và tên</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        disabled={!isEditing}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.formLabel}>Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        disabled={!isEditing}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="role" className={styles.formLabel}>Vai trò</label>
                      <input
                        type="text"
                        id="role"
                        value={user.role}
                        className={styles.formInput}
                        disabled
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="id" className={styles.formLabel}>ID</label>
                      <input
                        type="text"
                        id="id"
                        value={user.id}
                        className={styles.formInput}
                        disabled
                      />
                    </div>

                    {isEditing && (
                      <div className={styles.formActions}>
                        <button type="submit" className={styles.saveButton}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Lưu thay đổi
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {/* Password Tab Content */}
            {activeTab === 'password' && (
              <div className={styles.tabContent}>
                <div className={styles.profileCard}>
                  <div className={styles.profileCardHeader}>
                    <h2 className={styles.profileCardTitle}>Đổi mật khẩu</h2>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className={styles.profileForm}>
                    <div className={styles.formGroup}>
                      <label htmlFor="currentPassword" className={styles.formLabel}>Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        className={styles.formInput}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="newPassword" className={styles.formLabel}>Mật khẩu mới</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        className={styles.formInput}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="confirmPassword" className={styles.formLabel}>Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className={styles.formInput}
                        required
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button type="submit" className={styles.saveButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Đổi mật khẩu
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}
