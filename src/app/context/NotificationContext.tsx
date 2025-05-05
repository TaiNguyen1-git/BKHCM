'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Định nghĩa kiểu dữ liệu cho Notification
export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  feedbackId?: string;
  senderId: string;
  senderName: string;
};

// Dữ liệu mẫu cho thông báo
const initialNotificationsData: Notification[] = [
  {
    id: 'notif-001',
    userId: 'SV2021000123',
    title: 'Phản hồi của bạn đã được xử lý',
    message: 'Phản hồi về "Đề xuất cải thiện phòng học" đã được xử lý. Vui lòng kiểm tra.',
    isRead: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    feedbackId: 'fb-001',
    senderId: 'BQL2021000101',
    senderName: 'Phạm Thị D'
  },
  {
    id: 'notif-002',
    userId: 'GV2021000456',
    title: 'Thông báo bảo trì phòng học',
    message: 'Phòng học H1-101 sẽ được bảo trì vào ngày 15/07/2025. Vui lòng không đặt phòng trong thời gian này.',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    senderId: 'BQL2021000101',
    senderName: 'Phạm Thị D'
  }
];

// Định nghĩa kiểu dữ liệu cho NotificationContext
type NotificationContextType = {
  notifications: Notification[];
  userNotifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  getUnreadCount: () => number;
  getNotificationById: (id: string) => Notification | undefined;
  getNotificationsByUserId: (userId: string) => Notification[];
  getNotificationsByFeedbackId: (feedbackId: string) => Notification[];
};

// Tạo context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Tạo provider component
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Khởi tạo dữ liệu từ localStorage hoặc dữ liệu mẫu
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      setNotifications(initialNotificationsData);
      localStorage.setItem('notifications', JSON.stringify(initialNotificationsData));
    }
  }, []);

  // Lưu dữ liệu vào localStorage khi có thay đổi
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Lấy thông báo của người dùng hiện tại
  const userNotifications = user 
    ? notifications.filter(notification => notification.userId === user.id)
    : [];

  // Thêm thông báo mới
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  };

  // Đánh dấu thông báo đã đọc
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Đánh dấu tất cả thông báo đã đọc
  const markAllAsRead = () => {
    if (!user) return;

    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.userId === user.id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Xóa thông báo
  const deleteNotification = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  // Lấy số lượng thông báo chưa đọc
  const getUnreadCount = () => {
    if (!user) return 0;
    return userNotifications.filter(notification => !notification.isRead).length;
  };

  // Lấy thông báo theo ID
  const getNotificationById = (id: string) => {
    return notifications.find(notification => notification.id === id);
  };

  // Lấy thông báo theo userId
  const getNotificationsByUserId = (userId: string) => {
    return notifications.filter(notification => notification.userId === userId);
  };

  // Lấy thông báo theo feedbackId
  const getNotificationsByFeedbackId = (feedbackId: string) => {
    return notifications.filter(notification => notification.feedbackId === feedbackId);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        userNotifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        getUnreadCount,
        getNotificationById,
        getNotificationsByUserId,
        getNotificationsByFeedbackId
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook để sử dụng NotificationContext
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
