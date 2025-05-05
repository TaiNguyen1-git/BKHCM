'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSettings } from '@/app/context/SettingsContext';
import AdminLayout from '@/app/admin/components/AdminLayout';
import SuccessModal from '@/app/components/SuccessModal';
import styles from './settings.module.css';

export default function SettingsPage() {
  const {
    settings,
    updateAppearanceSettings,
    updateNotificationSettings,
    updateSystemSettings,
    updateSecuritySettings,
    resetSettings
  } = useSettings();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    appearance: { ...settings.appearance },
    notifications: { ...settings.notifications },
    system: { ...settings.system },
    security: { ...settings.security }
  });

  // Update form data when settings change
  useEffect(() => {
    console.log("Settings changed:", settings);
    setFormData({
      appearance: { ...settings.appearance },
      notifications: { ...settings.notifications },
      system: { ...settings.system },
      security: { ...settings.security }
    });

    // Apply theme immediately
    if (settings.appearance.theme !== 'system') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(settings.appearance.theme);
    }
  }, [settings]);

  // Apply theme immediately when settings change
  useEffect(() => {
    // Apply theme immediately
    if (settings.appearance.theme !== 'system') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(settings.appearance.theme);
    }
  }, [settings.appearance.theme]);

  // Handle form input changes
  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    const newValue = type === 'checkbox' ? checked : value;
    console.log(`Appearance change: ${name} = ${newValue}`);

    setFormData(prev => {
      const updated = {
        ...prev,
        appearance: {
          ...prev.appearance,
          [name]: newValue
        }
      };
      console.log("Updated form data:", updated);
      return updated;
    });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };

  const handleSystemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      system: {
        ...prev.system,
        [name]: value
      }
    }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  // Handle form submission
  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();

    try {
      console.log("Saving settings:", formData);

      // Apply each setting individually to ensure they are all updated
      updateAppearanceSettings(formData.appearance);
      updateNotificationSettings(formData.notifications);
      updateSystemSettings(formData.system);
      updateSecuritySettings(formData.security);

      // Show success message
      setSuccessMessage(formData.system.language === 'en' ? 'Settings saved successfully!' : 'Cài đặt đã được lưu thành công!');
      setShowSuccessMessage(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setErrorMessage(formData.system.language === 'en' ? 'An error occurred while saving settings.' : 'Có lỗi xảy ra khi lưu cài đặt.');
      setShowErrorMessage(true);

      // Hide error message after 3 seconds
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    }
  };

  // Handle reset settings
  const handleResetSettings = () => {
    resetSettings();
    setSuccessMessage('Cài đặt đã được đặt lại về mặc định!');
    setShowSuccessMessage(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <AdminLayout requiredPermission="admin.settings">
      <div className={styles.settingsContainer}>

        {/* Main content */}
        <main className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconMedium} ${styles.pageTitleIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Cài đặt hệ thống
            </h1>
          </div>

          {/* Settings content */}
          <div className={styles.settingsGrid}>
            {/* Appearance Settings */}
            <div className={styles.settingsCard}>
              <div className={styles.settingsCardHeader}>
                <div className={styles.settingsCardIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <h2 className={styles.settingsCardTitle}>Giao diện</h2>
                  <p className={styles.settingsCardDescription}>Tùy chỉnh giao diện người dùng</p>
                </div>
              </div>
              <div className={styles.settingsForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Chế độ hiển thị</label>
                  <select
                    className={styles.formSelect}
                    name="theme"
                    value={formData.appearance.theme}
                    onChange={handleAppearanceChange}
                  >
                    <option value="light">Sáng</option>
                    <option value="dark">Tối</option>
                    <option value="system">Theo hệ thống</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Cỡ chữ</label>
                  <select
                    className={styles.formSelect}
                    name="fontSize"
                    value={formData.appearance.fontSize}
                    onChange={handleAppearanceChange}
                  >
                    <option value="small">Nhỏ</option>
                    <option value="medium">Vừa</option>
                    <option value="large">Lớn</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tương phản cao</label>
                  <div className={styles.switchContainer}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        name="highContrast"
                        checked={formData.appearance.highContrast}
                        onChange={handleAppearanceChange}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span className={styles.switchLabel}>Bật tương phản cao</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className={styles.settingsCard}>
              <div className={styles.settingsCardHeader}>
                <div className={styles.settingsCardIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h2 className={styles.settingsCardTitle}>Thông báo</h2>
                  <p className={styles.settingsCardDescription}>Quản lý cài đặt thông báo</p>
                </div>
              </div>
              <div className={styles.settingsForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Thông báo qua email</label>
                  <div className={styles.switchContainer}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={formData.notifications.emailNotifications}
                        onChange={handleNotificationChange}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span className={styles.switchLabel}>Nhận thông báo qua email</span>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Thông báo đẩy</label>
                  <div className={styles.switchContainer}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        checked={formData.notifications.pushNotifications}
                        onChange={handleNotificationChange}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span className={styles.switchLabel}>Nhận thông báo đẩy</span>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nhắc nhở đặt phòng</label>
                  <div className={styles.switchContainer}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        name="bookingReminders"
                        checked={formData.notifications.bookingReminders}
                        onChange={handleNotificationChange}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span className={styles.switchLabel}>Nhận nhắc nhở về đặt phòng</span>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Cập nhật hệ thống</label>
                  <div className={styles.switchContainer}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        name="systemUpdates"
                        checked={formData.notifications.systemUpdates}
                        onChange={handleNotificationChange}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span className={styles.switchLabel}>Nhận thông báo về cập nhật hệ thống</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className={styles.settingsCard}>
              <div className={styles.settingsCardHeader}>
                <div className={styles.settingsCardIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className={styles.settingsCardTitle}>Hệ thống</h2>
                  <p className={styles.settingsCardDescription}>Cài đặt hệ thống chung</p>
                </div>
              </div>
              <div className={styles.settingsForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Ngôn ngữ</label>
                  <select
                    className={styles.formSelect}
                    name="language"
                    value={formData.system.language}
                    onChange={handleSystemChange}
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Định dạng thời gian</label>
                  <select
                    className={styles.formSelect}
                    name="timeFormat"
                    value={formData.system.timeFormat}
                    onChange={handleSystemChange}
                  >
                    <option value="12h">12 giờ (AM/PM)</option>
                    <option value="24h">24 giờ</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Định dạng ngày</label>
                  <select
                    className={styles.formSelect}
                    name="dateFormat"
                    value={formData.system.dateFormat}
                    onChange={handleSystemChange}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className={styles.settingsCard}>
              <div className={styles.settingsCardHeader}>
                <div className={styles.settingsCardIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h2 className={styles.settingsCardTitle}>Bảo mật</h2>
                  <p className={styles.settingsCardDescription}>Quản lý cài đặt bảo mật</p>
                </div>
              </div>
              <div className={styles.settingsForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Thời gian hết phiên (phút)</label>
                  <input
                    type="number"
                    className={styles.formControl}
                    name="sessionTimeout"
                    min="5"
                    max="120"
                    value={formData.security.sessionTimeout}
                    onChange={handleSecurityChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Yêu cầu mật khẩu mạnh</label>
                  <div className={styles.switchContainer}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        name="requireStrongPasswords"
                        checked={formData.security.requireStrongPasswords}
                        onChange={handleSecurityChange}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span className={styles.switchLabel}>Bắt buộc sử dụng mật khẩu mạnh</span>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Xác thực hai yếu tố</label>
                  <div className={styles.switchContainer}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        name="twoFactorAuth"
                        checked={formData.security.twoFactorAuth}
                        onChange={handleSecurityChange}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span className={styles.switchLabel}>Bật xác thực hai yếu tố</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <form onSubmit={handleSaveSettings}>
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleResetSettings}
              >
                Đặt lại mặc định
              </button>
              <button
                type="submit"
                className={styles.saveButton}
              >
                Lưu thay đổi
                <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.saveButtonIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </form>

          {/* Success Modal */}
          <SuccessModal
            isOpen={showSuccessMessage}
            onClose={() => setShowSuccessMessage(false)}
            message={successMessage}
          />

          {/* Error Message */}
          {showErrorMessage && (
            <div className={styles.errorMessage}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.messageIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errorMessage}
            </div>
          )}
        </main>
      </div>
    </AdminLayout>
  );
}
