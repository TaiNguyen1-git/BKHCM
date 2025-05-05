'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import UserLayout from '../components/UserLayout';
import Link from 'next/link';
import styles from './bookings.module.css';

// Định nghĩa kiểu dữ liệu cho đặt phòng
interface Booking {
  id: number;
  roomName: string;
  date: string;
  timeSlot: string;
  status: string;
  location: string;
  purpose: string;
  participants: number;
  requestDate: string;
}

export default function UserBookings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [showCancelModal, setShowCancelModal] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Dữ liệu mẫu cho đặt phòng
  const mockBookings: Booking[] = [
    {
      id: 1,
      roomName: 'Phòng học H1.101',
      date: '2025-05-15',
      timeSlot: '07:00 - 09:00',
      status: 'approved',
      location: 'Tòa H1, Tầng 1',
      purpose: 'Học nhóm môn Cơ sở dữ liệu',
      participants: 5,
      requestDate: '2025-05-05',
    },
    {
      id: 2,
      roomName: 'Phòng thực hành H3.201',
      date: '2025-05-20',
      timeSlot: '13:00 - 15:00',
      status: 'pending',
      location: 'Tòa H3, Tầng 2',
      purpose: 'Thực hành môn Lập trình Web',
      participants: 10,
      requestDate: '2025-05-06',
    },
    {
      id: 3,
      roomName: 'Phòng họp H6.302',
      date: '2025-04-30',
      timeSlot: '09:00 - 11:00',
      status: 'completed',
      location: 'Tòa H6, Tầng 3',
      purpose: 'Họp nhóm nghiên cứu',
      participants: 8,
      requestDate: '2025-04-20',
    },
    {
      id: 4,
      roomName: 'Phòng seminar B4.203',
      date: '2025-05-25',
      timeSlot: '15:00 - 17:00',
      status: 'rejected',
      location: 'Tòa B4, Tầng 2',
      purpose: 'Tổ chức seminar',
      participants: 30,
      requestDate: '2025-05-07',
    },
    {
      id: 5,
      roomName: 'Phòng làm việc nhóm C5.105',
      date: '2025-04-25',
      timeSlot: '07:00 - 09:00',
      status: 'cancelled',
      location: 'Tòa C5, Tầng 1',
      purpose: 'Làm đồ án môn học',
      participants: 6,
      requestDate: '2025-04-10',
    },
  ];

  // Khởi tạo dữ liệu
  useEffect(() => {
    setBookings(mockBookings);
  }, []);

  // Lọc đặt phòng dựa trên tab đang chọn
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = [...bookings];

    if (activeTab === 'upcoming') {
      filtered = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= today && (booking.status === 'approved' || booking.status === 'pending');
      });
    } else if (activeTab === 'past') {
      filtered = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate < today || booking.status === 'completed';
      });
    } else if (activeTab === 'cancelled') {
      filtered = bookings.filter(booking =>
        booking.status === 'cancelled' || booking.status === 'rejected'
      );
    }

    setFilteredBookings(filtered);
  }, [activeTab, bookings]);

  // Format date to display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get status text and color
  const getStatusInfo = (status: string) => {
    const statusMap: { [key: string]: { text: string, color: string } } = {
      'approved': { text: 'Đã duyệt', color: 'green' },
      'pending': { text: 'Đang chờ', color: 'yellow' },
      'completed': { text: 'Đã hoàn thành', color: 'blue' },
      'rejected': { text: 'Đã từ chối', color: 'red' },
      'cancelled': { text: 'Đã hủy', color: 'gray' }
    };
    return statusMap[status] || { text: status, color: 'gray' };
  };

  // Xử lý hiển thị chi tiết đặt phòng
  const handleViewDetails = (id: number) => {
    setShowDetailModal(id);
  };

  // Handle cancel booking
  const handleCancelBooking = (id: number) => {
    if (!cancelReason.trim()) {
      alert('Vui lòng nhập lý do hủy đặt phòng');
      return;
    }

    // Trong ứng dụng thực tế, bạn sẽ gửi yêu cầu hủy đến API
    console.log('Hủy đặt phòng:', {
      id: id,
      reason: cancelReason
    });

    // Cập nhật trạng thái đặt phòng trong dữ liệu
    const updatedBookings = bookings.map(booking => {
      if (booking.id === id) {
        return {
          ...booking,
          status: 'cancelled'
        };
      }
      return booking;
    });

    setBookings(updatedBookings);
    setShowCancelModal(null);
    setCancelReason('');

    // Hiển thị thông báo thành công
    setSuccessMessage('Đã hủy đặt phòng thành công!');
    setShowSuccessMessage(true);

    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <UserLayout>
      <div className={styles.bookingsContent}>
        <h1 className={styles.pageTitle}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.pageTitleIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Lịch đặt phòng
        </h1>

        {showSuccessMessage && (
          <div className={styles.successMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.successIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <div className={styles.bookingActions}>
          <div className={styles.bookingTabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'upcoming' ? styles.active : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Sắp tới
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'past' ? styles.active : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Đã qua
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'cancelled' ? styles.active : ''}`}
              onClick={() => setActiveTab('cancelled')}
            >
              Đã hủy
            </button>
          </div>
          <Link href="/booking" className={styles.newBookingButton}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Đặt phòng mới
          </Link>
        </div>

        {filteredBookings.length === 0 ? (
          <div className={styles.emptyState}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className={styles.emptyTitle}>Không có lịch đặt phòng</h3>
            <p className={styles.emptyDescription}>
              {activeTab === 'upcoming'
                ? 'Bạn chưa có lịch đặt phòng nào sắp tới.'
                : activeTab === 'past'
                  ? 'Bạn chưa có lịch đặt phòng nào đã qua.'
                  : 'Bạn chưa có lịch đặt phòng nào đã hủy.'}
            </p>
            {activeTab === 'upcoming' && (
              <Link href="/booking" className={styles.emptyActionButton}>
                Đặt phòng ngay
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.bookingsList}>
            {filteredBookings.map(booking => {
              const statusInfo = getStatusInfo(booking.status);
              return (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingHeader}>
                    <h3 className={styles.bookingTitle}>{booking.roomName}</h3>
                    <span className={`${styles.bookingStatus} ${styles[statusInfo.color]}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                  <div className={styles.bookingDetails}>
                    <div className={styles.bookingDetail}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.detailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className={styles.bookingDetail}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.detailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{booking.timeSlot}</span>
                    </div>
                    <div className={styles.bookingDetail}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.detailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{booking.location}</span>
                    </div>
                    <div className={styles.bookingDetail}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.detailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{booking.participants} người tham gia</span>
                    </div>
                  </div>
                  <div className={styles.bookingPurpose}>
                    <h4 className={styles.purposeTitle}>Mục đích:</h4>
                    <p className={styles.purposeText}>{booking.purpose}</p>
                  </div>
                  <div className={styles.bookingActions}>
                    <button
                      className={styles.viewDetailsButton}
                      onClick={() => handleViewDetails(booking.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.actionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Chi tiết
                    </button>
                    {(booking.status === 'approved' || booking.status === 'pending') && (
                      <button
                        className={styles.cancelButton}
                        onClick={() => setShowCancelModal(booking.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.actionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Hủy đặt phòng
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Xác nhận hủy đặt phòng</h3>
                <button
                  className={styles.modalCloseButton}
                  onClick={() => {
                    setShowCancelModal(null);
                    setCancelReason('');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.modalCloseIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className={styles.modalBody}>
                <p className={styles.modalText}>Bạn có chắc chắn muốn hủy đặt phòng này không? Hành động này không thể hoàn tác.</p>
                <div className={styles.formGroup}>
                  <label htmlFor="cancelReason" className={styles.formLabel}>Lý do hủy</label>
                  <textarea
                    id="cancelReason"
                    className={styles.formTextarea}
                    placeholder="Nhập lý do hủy đặt phòng..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button
                  className={styles.cancelModalButton}
                  onClick={() => {
                    setShowCancelModal(null);
                    setCancelReason('');
                  }}
                >
                  Không, giữ lại
                </button>
                <button
                  className={styles.confirmCancelButton}
                  onClick={() => handleCancelBooking(showCancelModal)}
                >
                  Có, hủy đặt phòng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && (
          <div className={styles.modalOverlay}>
            <div className={`${styles.modalContent} ${styles.detailModalContent}`}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  {bookings.find(b => b.id === showDetailModal)?.roomName}
                </h3>
                <button
                  className={styles.modalCloseButton}
                  onClick={() => setShowDetailModal(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.modalCloseIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className={styles.modalBody}>
                {bookings.find(b => b.id === showDetailModal) && (
                  <>
                    <div className={styles.detailSection}>
                      <h4 className={styles.detailSectionTitle}>Thông tin đặt phòng</h4>
                      <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Trạng thái:</span>
                          <span className={`${styles.detailValue} ${styles[getStatusInfo(bookings.find(b => b.id === showDetailModal)?.status || '').color]}`}>
                            {getStatusInfo(bookings.find(b => b.id === showDetailModal)?.status || '').text}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Ngày đặt:</span>
                          <span className={styles.detailValue}>
                            {formatDate(bookings.find(b => b.id === showDetailModal)?.date || '')}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Thời gian:</span>
                          <span className={styles.detailValue}>
                            {bookings.find(b => b.id === showDetailModal)?.timeSlot}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Vị trí:</span>
                          <span className={styles.detailValue}>
                            {bookings.find(b => b.id === showDetailModal)?.location}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Số người tham gia:</span>
                          <span className={styles.detailValue}>
                            {bookings.find(b => b.id === showDetailModal)?.participants} người
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Ngày yêu cầu:</span>
                          <span className={styles.detailValue}>
                            {formatDate(bookings.find(b => b.id === showDetailModal)?.requestDate || '')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.detailSection}>
                      <h4 className={styles.detailSectionTitle}>Mục đích sử dụng</h4>
                      <p className={styles.detailPurpose}>
                        {bookings.find(b => b.id === showDetailModal)?.purpose}
                      </p>
                    </div>

                    <div className={styles.detailSection}>
                      <h4 className={styles.detailSectionTitle}>Thông tin phòng</h4>
                      <div className={styles.roomInfo}>
                        <div className={styles.roomInfoItem}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={styles.roomInfoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>Tòa nhà: {bookings.find(b => b.id === showDetailModal)?.location.split(',')[0]}</span>
                        </div>
                        <div className={styles.roomInfoItem}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={styles.roomInfoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <span>Loại phòng: Phòng học</span>
                        </div>
                        <div className={styles.roomInfoItem}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={styles.roomInfoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Sức chứa: 50 người</span>
                        </div>
                        <div className={styles.roomInfoItem}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={styles.roomInfoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span>Trang thiết bị: Máy chiếu, Điều hòa, Bảng</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className={styles.modalFooter}>
                {bookings.find(b => b.id === showDetailModal)?.status === 'approved' ||
                 bookings.find(b => b.id === showDetailModal)?.status === 'pending' ? (
                  <button
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowDetailModal(null);
                      setShowCancelModal(showDetailModal);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.actionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hủy đặt phòng
                  </button>
                ) : (
                  <button
                    className={styles.closeDetailButton}
                    onClick={() => setShowDetailModal(null)}
                  >
                    Đóng
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
