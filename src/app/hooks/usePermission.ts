'use client';

import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

// Định nghĩa các quyền truy cập cho từng role
const rolePermissions = {
  'Quản trị viên': [
    'admin.dashboard',
    'admin.users',
    'admin.rooms',
    'admin.devices',
    'admin.bookings',
    'admin.reports',
    'admin.feedback',
    'admin.settings'
  ],
  'Ban quản lý': [
    'admin.dashboard',
    'admin.reports',
    'admin.feedback',
    'admin.settings'
  ]
};

export const usePermission = () => {
  const { user } = useAuth();
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Kiểm tra quyền truy cập
  const checkPermission = (permission: string): boolean => {
    if (!user) return false;

    const userRole = user.role;
    const permissions = rolePermissions[userRole as keyof typeof rolePermissions] || [];

    return permissions.includes(permission);
  };

  // Kiểm tra và hiển thị modal nếu không có quyền
  const checkAndShowModal = (permission: string): boolean => {
    const hasPermission = checkPermission(permission);
    if (!hasPermission) {
      setShowPermissionModal(true);
    }
    return hasPermission;
  };

  return {
    checkPermission,
    checkAndShowModal,
    showPermissionModal,
    setShowPermissionModal
  };
};

export default usePermission;
