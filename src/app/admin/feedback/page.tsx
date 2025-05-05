'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFeedback, Feedback, feedbackTypes } from '../../context/FeedbackContext';
import { useNotifications } from '../../context/NotificationContext';
import AdminLayout from '@/app/admin/components/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import styles from './feedback.module.css';

export default function FeedbackManagementPage() {
  const { user, logout, isLoading } = useAuth();
  const { feedbacks, updateFeedback, deleteFeedback, respondToFeedback } = useFeedback();
  const { addNotification } = useNotifications();

  // State
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [responseStatus, setResponseStatus] = useState<Feedback['status']>('processing');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  // Kiểm tra đăng nhập được xử lý bởi AdminLayout
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.replace('/login');
    }
  }, [user, isLoading]);

  // Lọc danh sách phản hồi theo từ khóa tìm kiếm và bộ lọc
  const filteredFeedbacks = feedbacks.filter(feedback => {
    // Lọc theo từ khóa tìm kiếm
    const searchMatch =
      feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo trạng thái
    const statusMatch = statusFilter === 'all' || feedback.status === statusFilter;

    // Lọc theo loại phản hồi
    const typeMatch = typeFilter === 'all' || feedback.type === typeFilter;

    return searchMatch && statusMatch && typeMatch;
  });

  // Sắp xếp phản hồi theo thời gian tạo (mới nhất lên đầu)
  const sortedFeedbacks = [...filteredFeedbacks].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Xử lý mở modal chi tiết phản hồi
  const handleViewFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setResponseText(feedback.adminResponse || '');
    setResponseStatus(feedback.status);
    setShowDetailModal(true);
  };

  // Xử lý mở modal gửi thông báo
  const handleOpenNotifyModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setNotificationTitle(`Thông báo về phản hồi "${feedback.subject}"`);
    setNotificationMessage('');
    setShowNotifyModal(true);
  };

  // Xử lý gửi thông báo
  const handleSendNotification = () => {
    if (!selectedFeedback || !user) return;

    // Gửi thông báo cho người dùng
    addNotification({
      userId: selectedFeedback.userId,
      title: notificationTitle,
      message: notificationMessage,
      feedbackId: selectedFeedback.id,
      senderId: user.id,
      senderName: user.name
    });

    setShowNotifyModal(false);
    setNotificationTitle('');
    setNotificationMessage('');
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedFeedback(null);
    setResponseText('');
  };

  // Xử lý gửi phản hồi
  const handleSubmitResponse = () => {
    if (!selectedFeedback || !user) return;

    // Cập nhật phản hồi
    respondToFeedback(selectedFeedback.id, responseText, responseStatus);

    // Gửi thông báo cho người dùng
    addNotification({
      userId: selectedFeedback.userId,
      title: `Phản hồi cho "${selectedFeedback.subject}"`,
      message: `Phản hồi của bạn đã được ${responseStatus === 'resolved' ? 'giải quyết' :
                responseStatus === 'rejected' ? 'từ chối' : 'xử lý'}. ${responseText}`,
      feedbackId: selectedFeedback.id,
      senderId: user.id,
      senderName: user.name
    });

    setShowDetailModal(false);
  };

  // Xử lý xóa phản hồi
  const handleDeleteFeedback = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phản hồi này không?')) {
      deleteFeedback(id);
    }
  };

  // Hiển thị trạng thái phản hồi
  const renderStatus = (status: Feedback['status']) => {
    switch (status) {
      case 'pending':
        return <span className={`${styles.statusTag} ${styles.statusPending}`}>Chờ xử lý</span>;
      case 'processing':
        return <span className={`${styles.statusTag} ${styles.statusProcessing}`}>Đang xử lý</span>;
      case 'resolved':
        return <span className={`${styles.statusTag} ${styles.statusResolved}`}>Đã giải quyết</span>;
      case 'rejected':
        return <span className={`${styles.statusTag} ${styles.statusRejected}`}>Từ chối</span>;
      default:
        return null;
    }
  };

  // Hiển thị đánh giá sao
  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className={styles.ratingStar} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className={styles.ratingStarEmpty} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      }
    }
    return <div className={styles.ratingStars}>{stars}</div>;
  };

  // Hiển thị loại phản hồi
  const getFeedbackTypeName = (typeId: string) => {
    const type = feedbackTypes.find(type => type.id === typeId);
    return type ? type.label : typeId;
  };

  // Hiển thị loading khi đang tải
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  // Hiển thị thông báo nếu không đăng nhập
  if (!user) {
    return null; // Sẽ redirect trong useEffect
  }

  return (
    <AdminLayout requiredPermission="admin.feedback">
      <div className={styles.feedbackManagementContainer}>

      {/* Main content */}
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <div className={styles.breadcrumbs}>
            <Link href="/admin" className={styles.breadcrumbLink}>Trang chủ</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>Quản lý phản hồi</span>
          </div>
          <h1 className={styles.pageTitle}>Quản lý phản hồi ý kiến</h1>
        </div>

        <div className={styles.feedbackManagementControls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Tìm kiếm phản hồi..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className={styles.filterContainer}>
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="resolved">Đã giải quyết</option>
              <option value="rejected">Từ chối</option>
            </select>

            <select
              className={styles.filterSelect}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tất cả loại phản hồi</option>
              {feedbackTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {sortedFeedbacks.length === 0 ? (
          <div className={styles.emptyState}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.emptyStateIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3>Không có phản hồi nào</h3>
            <p>Không tìm thấy phản hồi nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <table className={styles.feedbackTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Người gửi</th>
                <th>Loại</th>
                <th>Tiêu đề</th>
                <th>Đánh giá</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sortedFeedbacks.map(feedback => (
                <tr key={feedback.id}>
                  <td>{feedback.id}</td>
                  <td>{feedback.userName}</td>
                  <td>{getFeedbackTypeName(feedback.type)}</td>
                  <td className={styles.truncate}>{feedback.subject}</td>
                  <td>{renderRating(feedback.rating)}</td>
                  <td>{renderStatus(feedback.status)}</td>
                  <td>{new Date(feedback.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.actionButton} ${styles.viewButton}`}
                        onClick={() => handleViewFeedback(feedback)}
                        title="Xem chi tiết"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {user && user.role === 'Ban quản lý' && (
                        <button
                          className={`${styles.actionButton} ${styles.notifyButton}`}
                          onClick={() => handleOpenNotifyModal(feedback)}
                          title="Gửi thông báo"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </button>
                      )}
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDeleteFeedback(feedback.id)}
                        title="Xóa"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal chi tiết phản hồi */}
        {showDetailModal && selectedFeedback && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Chi tiết phản hồi</h2>
                <button className={styles.closeButton} onClick={handleCloseModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.feedbackDetail}>
                  <div className={styles.feedbackDetailItem}>
                    <div className={styles.feedbackDetailLabel}>ID phản hồi</div>
                    <div className={styles.feedbackDetailValue}>{selectedFeedback.id}</div>
                  </div>
                  <div className={styles.feedbackDetailItem}>
                    <div className={styles.feedbackDetailLabel}>Người gửi</div>
                    <div className={styles.feedbackDetailValue}>{selectedFeedback.userName} ({selectedFeedback.userRole})</div>
                  </div>
                  <div className={styles.feedbackDetailItem}>
                    <div className={styles.feedbackDetailLabel}>Email</div>
                    <div className={styles.feedbackDetailValue}>{selectedFeedback.userEmail}</div>
                  </div>
                  <div className={styles.feedbackDetailItem}>
                    <div className={styles.feedbackDetailLabel}>Loại phản hồi</div>
                    <div className={styles.feedbackDetailValue}>{getFeedbackTypeName(selectedFeedback.type)}</div>
                  </div>
                  <div className={styles.feedbackDetailItem}>
                    <div className={styles.feedbackDetailLabel}>Tiêu đề</div>
                    <div className={styles.feedbackDetailValue}>{selectedFeedback.subject}</div>
                  </div>
                  <div className={styles.feedbackDetailItem}>
                    <div className={styles.feedbackDetailLabel}>Đánh giá</div>
                    <div className={styles.feedbackDetailValue}>{renderRating(selectedFeedback.rating)}</div>
                  </div>
                  <div className={styles.feedbackDetailItem}>
                    <div className={styles.feedbackDetailLabel}>Trạng thái</div>
                    <div className={styles.feedbackDetailValue}>{renderStatus(selectedFeedback.status)}</div>
                  </div>
                  <div className={styles.feedbackDetailItem}>
                    <div className={styles.feedbackDetailLabel}>Ngày tạo</div>
                    <div className={styles.feedbackDetailValue}>
                      {new Date(selectedFeedback.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <div className={styles.feedbackDetailItem}>
                    <div className={styles.feedbackDetailLabel}>Nội dung phản hồi</div>
                    <div className={styles.feedbackMessage}>{selectedFeedback.message}</div>
                  </div>
                </div>

                <div className={styles.responseForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="responseStatus" className={styles.formLabel}>Trạng thái phản hồi</label>
                    <select
                      id="responseStatus"
                      className={styles.formSelect}
                      value={responseStatus}
                      onChange={(e) => setResponseStatus(e.target.value as Feedback['status'])}
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="resolved">Đã giải quyết</option>
                      <option value="rejected">Từ chối</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="responseText" className={styles.formLabel}>Phản hồi của bạn</label>
                    <textarea
                      id="responseText"
                      className={styles.formTextarea}
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Nhập phản hồi của bạn..."
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.cancelButton} onClick={handleCloseModal}>
                  Hủy
                </button>
                <button
                  className={responseStatus === 'rejected' ? styles.rejectButton : styles.submitButton}
                  onClick={handleSubmitResponse}
                >
                  {responseStatus === 'rejected' ? 'Từ chối phản hồi' : 'Gửi phản hồi'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal gửi thông báo */}
        {showNotifyModal && selectedFeedback && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Gửi thông báo</h2>
                <button className={styles.closeButton} onClick={() => setShowNotifyModal(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.feedbackDetail}>
                  <div className={styles.feedbackDetailItem}>
                    <div className={styles.feedbackDetailLabel}>Gửi đến</div>
                    <div className={styles.feedbackDetailValue}>{selectedFeedback.userName} ({selectedFeedback.userRole})</div>
                  </div>
                  <div className={styles.feedbackDetailItem}>
                    <div className={styles.feedbackDetailLabel}>Email</div>
                    <div className={styles.feedbackDetailValue}>{selectedFeedback.userEmail}</div>
                  </div>
                </div>

                <div className={styles.responseForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="notificationTitle" className={styles.formLabel}>Tiêu đề thông báo</label>
                    <input
                      id="notificationTitle"
                      className={styles.formInput}
                      value={notificationTitle}
                      onChange={(e) => setNotificationTitle(e.target.value)}
                      placeholder="Nhập tiêu đề thông báo..."
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="notificationMessage" className={styles.formLabel}>Nội dung thông báo</label>
                    <textarea
                      id="notificationMessage"
                      className={styles.formTextarea}
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                      placeholder="Nhập nội dung thông báo..."
                      rows={5}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.cancelButton} onClick={() => setShowNotifyModal(false)}>
                  Hủy
                </button>
                <button
                  className={styles.submitButton}
                  onClick={handleSendNotification}
                  disabled={!notificationTitle || !notificationMessage}
                >
                  Gửi thông báo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
    </AdminLayout>
  );
}
