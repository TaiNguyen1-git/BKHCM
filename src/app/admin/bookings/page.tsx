'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useBookings, Booking } from '@/app/context/BookingContext';
import { useRooms } from '@/app/context/RoomContext';
import { useUsers } from '@/app/context/UserContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './bookings.module.css';

export default function BookingManagement() {
  const { user, logout, isLoading } = useAuth();
  const { bookings, approveBooking, rejectBooking, cancelBooking } = useBookings();
  const { rooms } = useRooms();
  const { users } = useUsers();

  // UI state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  // Form state
  const [notes, setNotes] = useState('');

  // Redirect if not logged in or not an admin
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

  // Helper function to get room name by ID
  const getRoomNameById = (roomId: number) => {
    const room = rooms.find(room => room.id === roomId);
    return room ? room.name : 'Không xác định';
  };

  // Helper function to get user name by ID
  const getUserNameById = (userId: string) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : 'Không xác định';
  };

  // Handle approve booking
  const handleApproveBooking = () => {
    if (currentBooking) {
      approveBooking(currentBooking.id, notes);
      setShowApproveModal(false);
      setNotes('');
    }
  };

  // Handle reject booking
  const handleRejectBooking = () => {
    if (currentBooking && notes.trim()) {
      rejectBooking(currentBooking.id, notes);
      setShowRejectModal(false);
      setNotes('');
    }
  };

  // Filter bookings based on search term and filters
  const filteredBookings = bookings.filter(booking => {
    const roomName = getRoomNameById(booking.roomId);
    const userName = getUserNameById(booking.userId);

    const matchesSearch =
      roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? booking.status === statusFilter : true;
    const matchesDate = dateFilter ? booking.date === dateFilter : true;
    const matchesRoom = roomFilter ? booking.roomId === parseInt(roomFilter) : true;
    const matchesUser = userFilter ? booking.userId === userFilter : true;

    return matchesSearch && matchesStatus && matchesDate && matchesRoom && matchesUser;
  });

  if (isLoading || !user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className={styles.bookingManagementContainer}>
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
            <span className={styles.breadcrumbCurrent}>Quản lý đặt phòng</span>
          </div>
          <h1 className={styles.pageTitle}>Quản lý đặt phòng</h1>
        </div>

        <div className={styles.bookingManagementControls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Tìm kiếm đặt phòng..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Trạng thái</label>
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="pending">Đang chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Ngày</label>
            <input
              type="date"
              className={styles.datePicker}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Phòng</label>
            <select
              className={styles.filterSelect}
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Người dùng</label>
            <select
              className={styles.filterSelect}
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              {users.filter(u => u.role !== 'Quản trị viên').map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.bookingTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderCell} style={{ width: '5%' }}>STT</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Phòng</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Người đặt</div>
            <div className={styles.tableHeaderCell} style={{ width: '10%' }}>Ngày</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Khung giờ</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Mục đích</div>
            <div className={styles.tableHeaderCell} style={{ width: '10%' }}>Trạng thái</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Thao tác</div>
          </div>

          <div className={styles.tableBody}>
            {filteredBookings.length === 0 ? (
              <div className={styles.noResults}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.noResultsIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Không tìm thấy đặt phòng nào</p>
              </div>
            ) : (
              filteredBookings.map((booking, index) => (
                <div key={booking.id} className={styles.tableRow}>
                  <div className={styles.tableCell} style={{ width: '5%' }}>{index + 1}</div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>{getRoomNameById(booking.roomId)}</div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>{getUserNameById(booking.userId)}</div>
                  <div className={styles.tableCell} style={{ width: '10%' }}>{booking.date}</div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>{booking.timeSlot}</div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>
                    {booking.purpose.length > 30 ? `${booking.purpose.substring(0, 30)}...` : booking.purpose}
                  </div>
                  <div className={styles.tableCell} style={{ width: '10%' }}>
                    <span className={`${styles.statusTag} ${
                      booking.status === 'pending' ? styles.statusPending :
                      booking.status === 'approved' ? styles.statusApproved :
                      booking.status === 'rejected' ? styles.statusRejected :
                      styles.statusCancelled
                    }`}>
                      {booking.status === 'pending' ? 'Chờ duyệt' :
                       booking.status === 'approved' ? 'Đã duyệt' :
                       booking.status === 'rejected' ? 'Từ chối' : 'Đã hủy'}
                    </span>
                  </div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.viewButton}
                        onClick={() => {
                          setCurrentBooking(booking);
                          setShowDetailsModal(true);
                        }}
                        title="Xem chi tiết"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {booking.status === 'pending' && (
                        <>
                          <button
                            className={styles.approveButton}
                            onClick={() => {
                              setCurrentBooking(booking);
                              setNotes('');
                              setShowApproveModal(true);
                            }}
                            title="Phê duyệt"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            className={styles.rejectButton}
                            onClick={() => {
                              setCurrentBooking(booking);
                              setNotes('');
                              setShowRejectModal(true);
                            }}
                            title="Từ chối"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}

                      {booking.status === 'approved' && (
                        <button
                          className={styles.cancelButton}
                          onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này không?')) {
                              cancelBooking(booking.id, 'Quản trị viên hủy đặt phòng');
                            }
                          }}
                          title="Hủy đặt phòng"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

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

      {/* Modal xem chi tiết đặt phòng */}
      {showDetailsModal && currentBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Chi tiết đặt phòng</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowDetailsModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={styles.bookingDetails}>
              <div className={styles.detailsSection}>
                <h3 className={styles.detailsTitle}>Thông tin phòng</h3>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Phòng:</span>
                  <span className={styles.detailsValue}>{getRoomNameById(currentBooking.roomId)}</span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Ngày:</span>
                  <span className={styles.detailsValue}>{currentBooking.date}</span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Khung giờ:</span>
                  <span className={styles.detailsValue}>{currentBooking.timeSlot}</span>
                </div>
              </div>

              <div className={styles.detailsSection}>
                <h3 className={styles.detailsTitle}>Thông tin người đặt</h3>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Người đặt:</span>
                  <span className={styles.detailsValue}>{getUserNameById(currentBooking.userId)}</span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Mục đích:</span>
                  <span className={styles.detailsValue}>{currentBooking.purpose}</span>
                </div>
              </div>

              <div className={styles.detailsSection}>
                <h3 className={styles.detailsTitle}>Trạng thái đặt phòng</h3>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Trạng thái:</span>
                  <span className={styles.detailsValue}>
                    <span className={`${styles.statusTag} ${
                      currentBooking.status === 'pending' ? styles.statusPending :
                      currentBooking.status === 'approved' ? styles.statusApproved :
                      currentBooking.status === 'rejected' ? styles.statusRejected :
                      styles.statusCancelled
                    }`}>
                      {currentBooking.status === 'pending' ? 'Chờ duyệt' :
                       currentBooking.status === 'approved' ? 'Đã duyệt' :
                       currentBooking.status === 'rejected' ? 'Từ chối' : 'Đã hủy'}
                    </span>
                  </span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Ngày tạo:</span>
                  <span className={styles.detailsValue}>
                    {new Date(currentBooking.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Cập nhật lần cuối:</span>
                  <span className={styles.detailsValue}>
                    {new Date(currentBooking.updatedAt).toLocaleString('vi-VN')}
                  </span>
                </div>

                {currentBooking.notes && (
                  <div className={styles.notesSection}>
                    <h4 className={styles.notesTitle}>Ghi chú:</h4>
                    <p className={styles.notesText}>{currentBooking.notes}</p>
                  </div>
                )}
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowDetailsModal(false)}
                >
                  Đóng
                </button>

                {currentBooking.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      className={styles.rejectFormButton}
                      onClick={() => {
                        setShowDetailsModal(false);
                        setNotes('');
                        setShowRejectModal(true);
                      }}
                    >
                      Từ chối
                    </button>
                    <button
                      type="button"
                      className={styles.approveFormButton}
                      onClick={() => {
                        setShowDetailsModal(false);
                        setNotes('');
                        setShowApproveModal(true);
                      }}
                    >
                      Phê duyệt
                    </button>
                  </>
                )}

                {currentBooking.status === 'approved' && (
                  <button
                    type="button"
                    className={styles.rejectFormButton}
                    onClick={() => {
                      if (window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này không?')) {
                        cancelBooking(currentBooking.id, 'Quản trị viên hủy đặt phòng');
                        setShowDetailsModal(false);
                      }
                    }}
                  >
                    Hủy đặt phòng
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal phê duyệt đặt phòng */}
      {showApproveModal && currentBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Phê duyệt đặt phòng</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowApproveModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={styles.bookingForm}>
              <div className={styles.formGroup}>
                <label htmlFor="approveNotes">Ghi chú (không bắt buộc)</label>
                <textarea
                  id="approveNotes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập ghi chú nếu cần..."
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowApproveModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className={styles.approveFormButton}
                  onClick={handleApproveBooking}
                >
                  Phê duyệt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal từ chối đặt phòng */}
      {showRejectModal && currentBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Từ chối đặt phòng</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowRejectModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={styles.bookingForm}>
              <div className={styles.formGroup}>
                <label htmlFor="rejectNotes">Lý do từ chối <span style={{ color: 'red' }}>*</span></label>
                <textarea
                  id="rejectNotes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập lý do từ chối..."
                  required
                />
                {notes.trim() === '' && (
                  <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    Vui lòng nhập lý do từ chối
                  </p>
                )}
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowRejectModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className={styles.rejectFormButton}
                  onClick={handleRejectBooking}
                  disabled={notes.trim() === ''}
                >
                  Từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
