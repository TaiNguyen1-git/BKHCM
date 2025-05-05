'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import UserLayout from '../components/UserLayout';
import styles from './settings.module.css';

export default function UserSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Cài đặt chung
  const [generalSettings, setGeneralSettings] = useState({
    language: 'vi',
    theme: 'light',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
  });

  // Cài đặt thông báo
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    bookingReminders: true,
    systemUpdates: false,
    newFeatures: true,
  });

  // Cài đặt quyền riêng tư
  const [privacySettings, setPrivacySettings] = useState({
    showProfile: true,
    showEmail: false,
    showPhone: false,
    allowDataCollection: true,
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveSettings = (type: string) => {
    // Trong ứng dụng thực tế, bạn sẽ gửi dữ liệu đến API
    console.log('Lưu cài đặt:', type, {
      general: generalSettings,
      notification: notificationSettings,
      privacy: privacySettings
    });
    
    // Hiển thị thông báo thành công
    setSuccessMessage('Cài đặt đã được lưu thành công!');
    setShowSuccessMessage(true);
    
    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <UserLayout>
      <div className={styles.settingsContent}>
        <h1 className={styles.pageTitle}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.pageTitleIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Cài đặt
        </h1>

        {showSuccessMessage && (
          <div className={styles.successMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.successIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <div className={styles.settingsContainer}>
          <div className={styles.settingsTabs}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'general' ? styles.active : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.tabIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Cài đặt chung
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'notifications' ? styles.active : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.tabIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Thông báo
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'privacy' ? styles.active : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.tabIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Quyền riêng tư
            </button>
          </div>

          <div className={styles.settingsContent}>
            {activeTab === 'general' && (
              <div className={styles.settingsPanel}>
                <h2 className={styles.panelTitle}>Cài đặt chung</h2>
                <div className={styles.settingsForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="language" className={styles.formLabel}>Ngôn ngữ</label>
                    <select
                      id="language"
                      name="language"
                      className={styles.formSelect}
                      value={generalSettings.language}
                      onChange={handleGeneralChange}
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="theme" className={styles.formLabel}>Giao diện</label>
                    <select
                      id="theme"
                      name="theme"
                      className={styles.formSelect}
                      value={generalSettings.theme}
                      onChange={handleGeneralChange}
                    >
                      <option value="light">Sáng</option>
                      <option value="dark">Tối</option>
                      <option value="system">Theo hệ thống</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="timezone" className={styles.formLabel}>Múi giờ</label>
                    <select
                      id="timezone"
                      name="timezone"
                      className={styles.formSelect}
                      value={generalSettings.timezone}
                      onChange={handleGeneralChange}
                    >
                      <option value="Asia/Ho_Chi_Minh">Hồ Chí Minh (GMT+7)</option>
                      <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                      <option value="Asia/Singapore">Singapore (GMT+8)</option>
                      <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="dateFormat" className={styles.formLabel}>Định dạng ngày</label>
                    <select
                      id="dateFormat"
                      name="dateFormat"
                      className={styles.formSelect}
                      value={generalSettings.dateFormat}
                      onChange={handleGeneralChange}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className={styles.formActions}>
                    <button 
                      className={styles.saveButton}
                      onClick={() => handleSaveSettings('general')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Lưu cài đặt
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className={styles.settingsPanel}>
                <h2 className={styles.panelTitle}>Cài đặt thông báo</h2>
                <div className={styles.settingsForm}>
                  <div className={styles.toggleGroup}>
                    <div className={styles.toggleInfo}>
                      <label htmlFor="emailNotifications" className={styles.toggleLabel}>Thông báo qua email</label>
                      <p className={styles.toggleDescription}>Nhận thông báo qua email khi có cập nhật mới</p>
                    </div>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        name="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                  <div className={styles.toggleGroup}>
                    <div className={styles.toggleInfo}>
                      <label htmlFor="bookingReminders" className={styles.toggleLabel}>Nhắc nhở đặt phòng</label>
                      <p className={styles.toggleDescription}>Nhận thông báo nhắc nhở trước khi đến giờ đặt phòng</p>
                    </div>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        id="bookingReminders"
                        name="bookingReminders"
                        checked={notificationSettings.bookingReminders}
                        onChange={handleNotificationChange}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                  <div className={styles.toggleGroup}>
                    <div className={styles.toggleInfo}>
                      <label htmlFor="systemUpdates" className={styles.toggleLabel}>Cập nhật hệ thống</label>
                      <p className={styles.toggleDescription}>Nhận thông báo khi hệ thống có cập nhật mới</p>
                    </div>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        id="systemUpdates"
                        name="systemUpdates"
                        checked={notificationSettings.systemUpdates}
                        onChange={handleNotificationChange}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                  <div className={styles.toggleGroup}>
                    <div className={styles.toggleInfo}>
                      <label htmlFor="newFeatures" className={styles.toggleLabel}>Tính năng mới</label>
                      <p className={styles.toggleDescription}>Nhận thông báo khi có tính năng mới được phát hành</p>
                    </div>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        id="newFeatures"
                        name="newFeatures"
                        checked={notificationSettings.newFeatures}
                        onChange={handleNotificationChange}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                  <div className={styles.formActions}>
                    <button 
                      className={styles.saveButton}
                      onClick={() => handleSaveSettings('notifications')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Lưu cài đặt
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className={styles.settingsPanel}>
                <h2 className={styles.panelTitle}>Cài đặt quyền riêng tư</h2>
                <div className={styles.settingsForm}>
                  <div className={styles.toggleGroup}>
                    <div className={styles.toggleInfo}>
                      <label htmlFor="showProfile" className={styles.toggleLabel}>Hiển thị hồ sơ</label>
                      <p className={styles.toggleDescription}>Cho phép người dùng khác xem hồ sơ của bạn</p>
                    </div>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        id="showProfile"
                        name="showProfile"
                        checked={privacySettings.showProfile}
                        onChange={handlePrivacyChange}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                  <div className={styles.toggleGroup}>
                    <div className={styles.toggleInfo}>
                      <label htmlFor="showEmail" className={styles.toggleLabel}>Hiển thị email</label>
                      <p className={styles.toggleDescription}>Cho phép người dùng khác xem email của bạn</p>
                    </div>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        id="showEmail"
                        name="showEmail"
                        checked={privacySettings.showEmail}
                        onChange={handlePrivacyChange}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                  <div className={styles.toggleGroup}>
                    <div className={styles.toggleInfo}>
                      <label htmlFor="showPhone" className={styles.toggleLabel}>Hiển thị số điện thoại</label>
                      <p className={styles.toggleDescription}>Cho phép người dùng khác xem số điện thoại của bạn</p>
                    </div>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        id="showPhone"
                        name="showPhone"
                        checked={privacySettings.showPhone}
                        onChange={handlePrivacyChange}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                  <div className={styles.toggleGroup}>
                    <div className={styles.toggleInfo}>
                      <label htmlFor="allowDataCollection" className={styles.toggleLabel}>Thu thập dữ liệu</label>
                      <p className={styles.toggleDescription}>Cho phép hệ thống thu thập dữ liệu sử dụng để cải thiện dịch vụ</p>
                    </div>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        id="allowDataCollection"
                        name="allowDataCollection"
                        checked={privacySettings.allowDataCollection}
                        onChange={handlePrivacyChange}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                  <div className={styles.formActions}>
                    <button 
                      className={styles.saveButton}
                      onClick={() => handleSaveSettings('privacy')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Lưu cài đặt
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
