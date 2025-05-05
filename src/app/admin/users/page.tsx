'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useUsers, User } from '@/app/context/UserContext';
import AdminLayout from '@/app/admin/components/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import styles from './users.module.css';

export default function UserManagement() {
  const { user, isLoading, logout } = useAuth();
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Omit<User, 'id'> & { id?: string }>({
    username: '',
    password: '',
    name: '',
    role: 'Sinh viên',
    email: '',
    avatar: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Kiểm tra đăng nhập được xử lý bởi AdminLayout
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.replace('/login');
    }
  }, [user, isLoading]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (showProfileDropdown && !target.closest(`.${styles.userInfo}`)) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Lọc danh sách người dùng theo từ khóa tìm kiếm và loại bỏ tài khoản quản trị viên
  const filteredUsers = users.filter(user =>
    (user.role !== 'Quản trị viên') && // Loại bỏ tài khoản quản trị viên
    (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Xử lý thay đổi trong form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Mở modal thêm người dùng mới
  const handleAddUser = () => {
    setModalMode('add');
    setFormData({
      username: '',
      password: '',
      name: '',
      role: 'Sinh viên',
      email: '',
      avatar: null
    });
    setShowModal(true);
  };

  // Mở modal chỉnh sửa người dùng
  const handleEditUser = (user: User) => {
    setModalMode('edit');
    setCurrentUser(user);
    setFormData({
      id: user.id,
      username: user.username,
      password: user.password,
      name: user.name,
      role: user.role,
      email: user.email,
      avatar: user.avatar
    });
    setShowModal(true);
  };

  // Xử lý xác nhận xóa người dùng
  const handleDeleteConfirm = (id: string) => {
    setConfirmDelete(id);
  };

  // Xử lý xóa người dùng
  const handleDeleteUser = (id: string) => {
    deleteUser(id);
    setConfirmDelete(null);
  };

  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === 'add') {
      // Tạo ID mới dựa trên vai trò
      let prefix = '';
      switch (formData.role) {
        case 'Sinh viên':
          prefix = 'SV';
          break;
        case 'Giảng viên':
          prefix = 'GV';
          break;
        default:
          prefix = 'US';
      }

      const timestamp = new Date().getTime().toString().slice(-10);
      const newId = `${prefix}${timestamp}`;

      const newUser: User = {
        id: newId,
        username: formData.username,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        email: formData.email,
        avatar: formData.avatar
      };

      addUser(newUser);
    } else if (modalMode === 'edit' && formData.id) {
      const updatedUser: User = {
        id: formData.id,
        username: formData.username,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        email: formData.email,
        avatar: formData.avatar
      };

      updateUser(updatedUser);
    }

    setShowModal(false);
  };

  if (isLoading || !user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <AdminLayout requiredPermission="admin.users">
      <div className={styles.userManagementContainer}>
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
            <div
              className={styles.userProfileIcon}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
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
                        alt="Avatar"
                        width={50}
                        height={50}
                        className={styles.avatarImage}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className={styles.profileDetails}>
                    <p className={styles.profileName}>{user.name}</p>
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
                  <Link href="/profile" className={styles.profileLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Thông tin cá nhân
                  </Link>
                  <Link href="/settings" className={styles.profileLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Cài đặt
                  </Link>
                  <button
                    className={styles.logoutButton}
                    onClick={() => logout()}
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
            <Link href="/admin" className={styles.breadcrumbLink}>
              Trang chủ Admin
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>Quản lý tài khoản</span>
          </div>
          <h1 className={styles.pageTitle}>Quản lý tài khoản người dùng</h1>
        </div>

        <div className={styles.userManagementControls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className={styles.addUserButton} onClick={handleAddUser}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm người dùng
          </button>
        </div>

        <div className={styles.userTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderCell} style={{ width: '5%' }}>STT</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Mã số</div>
            <div className={styles.tableHeaderCell} style={{ width: '20%' }}>Họ và tên</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Tên đăng nhập</div>
            <div className={styles.tableHeaderCell} style={{ width: '20%' }}>Email</div>
            <div className={styles.tableHeaderCell} style={{ width: '10%' }}>Vai trò</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Thao tác</div>
          </div>

          <div className={styles.tableBody}>
            {filteredUsers.length === 0 ? (
              <div className={styles.noResults}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.noResultsIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Không tìm thấy người dùng nào</p>
              </div>
            ) : (
              filteredUsers.map((user, index) => (
                <div key={user.id} className={styles.tableRow}>
                  <div className={styles.tableCell} style={{ width: '5%' }}>{index + 1}</div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>{user.id}</div>
                  <div className={styles.tableCell} style={{ width: '20%' }}>{user.name}</div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>{user.username}</div>
                  <div className={styles.tableCell} style={{ width: '20%' }}>{user.email}</div>
                  <div className={styles.tableCell} style={{ width: '10%' }}>
                    <span className={`${styles.roleTag} ${
                      user.role === 'Quản trị viên' ? styles.roleAdmin :
                      user.role === 'Giảng viên' ? styles.roleTeacher :
                      styles.roleStudent
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>
                    {confirmDelete === user.id ? (
                      <div className={styles.deleteConfirm}>
                        <button
                          className={styles.confirmYes}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Xóa
                        </button>
                        <button
                          className={styles.confirmNo}
                          onClick={() => setConfirmDelete(null)}
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditUser(user)}
                          title="Chỉnh sửa"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteConfirm(user.id)}
                          title="Xóa"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal thêm/sửa người dùng */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{modalMode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.userForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Họ và tên</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="username">Tên đăng nhập</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Mật khẩu</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="role">Vai trò</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="Sinh viên">Sinh viên</option>
                  <option value="Giảng viên">Giảng viên</option>
                </select>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  {modalMode === 'add' ? 'Thêm người dùng' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <Image
              src="/hcmut.png"
              alt="HCMUT Logo"
              width={30}
              height={30}
              className={styles.footerLogoImage}
            />
            <span className={styles.footerLogoText}>SSMR - Trường Đại học Bách khoa - ĐHQG TPHCM</span>
          </div>
          <div className={styles.footerCopyright}>
            © 2025 - All rights reserved
          </div>
        </div>
      </footer>
    </div>
    </AdminLayout>
  );
}
