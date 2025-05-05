'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import usePermission from '@/app/hooks/usePermission';
import PermissionModal from '@/app/components/PermissionModal';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
  requiredPermission: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, requiredPermission }) => {
  const { user, isLoading, logout } = useAuth();
  const { checkPermission, showPermissionModal, setShowPermissionModal } = usePermission();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Kiểm tra quyền truy cập
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        router.push('/login');
      } else if (user.role !== 'Quản trị viên' && user.role !== 'Ban quản lý') {
        // Nếu không phải admin hoặc ban quản lý, chuyển hướng đến trang user
        router.push('/user');
      } else if (user.role === 'Ban quản lý' && !checkPermission(requiredPermission)) {
        // Nếu là ban quản lý nhưng không có quyền truy cập, hiển thị modal
        setShowPermissionModal(true);
      }
    }
  }, [user, isLoading, router, requiredPermission, checkPermission, setShowPermissionModal]);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="loadingContainer">
        <div className="loadingSpinner"></div>
      </div>
    );
  }

  // If not logged in
  if (!user) {
    return null; // Will be redirected in useEffect
  }

  // Nếu là ban quản lý và không có quyền truy cập
  if (user.role === 'Ban quản lý' && !checkPermission(requiredPermission)) {
    return (
      <div>
        <PermissionModal
          isOpen={showPermissionModal}
          onClose={() => router.push('/admin')}
          message="Bạn không có quyền truy cập chức năng này. Vui lòng liên hệ quản trị viên để được hỗ trợ."
        />
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
};

export default AdminLayout;
