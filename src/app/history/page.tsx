'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './history.module.css';

// Định nghĩa kiểu dữ liệu cho đặt phòng
interface RoomBooking {
  id: number;
  type: string;
  name: string;
  date: string;
  timeSlot: string;
  status: string;
  requestDate: string;
  location: string;
  purpose: string;
  description: string;
  rejectReason?: string;
  cancelReason?: string;
}

// Định nghĩa kiểu dữ liệu cho mượn thiết bị
interface EquipmentBorrowing {
  id: number;
  type: string;
  name: string;
  date: string;
  returnDate: string;
  status: string;
  requestDate: string;
  location: string;
  quantity: number;
  purpose: string;
  description: string;
  rejectReason?: string;
  cancelReason?: string;
}

// Kiểu dữ liệu hợp nhất
type HistoryItem = RoomBooking | EquipmentBorrowing;

// Hàm kiểm tra kiểu dữ liệu
function isRoomBooking(item: HistoryItem): item is RoomBooking {
  return item.type === 'Đặt phòng';
}

function isEquipmentBorrowing(item: HistoryItem): item is EquipmentBorrowing {
  return item.type === 'Mượn thiết bị';
}

// Dữ liệu mẫu cho lịch sử đặt phòng
const roomBookingHistoryData: RoomBooking[] = [
  {
    id: 1,
    type: 'Đặt phòng',
    name: 'Phòng học H1.101',
    date: '2025-05-10',
    timeSlot: '07:00 - 09:00',
    status: 'approved',
    requestDate: '2025-05-05',
    location: 'Tòa H1, Tầng 1',
    purpose: 'Học nhóm môn Cơ sở dữ liệu',
    description: 'Đặt phòng cho nhóm 5 người học môn Cơ sở dữ liệu, chuẩn bị bài thuyết trình cuối kỳ.',
  },
  {
    id: 2,
    type: 'Đặt phòng',
    name: 'Phòng thực hành H3.201',
    date: '2025-05-12',
    timeSlot: '13:00 - 15:00',
    status: 'pending',
    requestDate: '2025-05-06',
    location: 'Tòa H3, Tầng 2',
    purpose: 'Thực hành môn Lập trình Web',
    description: 'Đặt phòng máy tính để thực hành bài tập lớn môn Lập trình Web.',
  },
  {
    id: 3,
    type: 'Đặt phòng',
    name: 'Phòng họp H6.302',
    date: '2025-05-08',
    timeSlot: '09:00 - 11:00',
    status: 'completed',
    requestDate: '2025-05-01',
    location: 'Tòa H6, Tầng 3',
    purpose: 'Họp nhóm nghiên cứu',
    description: 'Họp nhóm nghiên cứu về trí tuệ nhân tạo, thảo luận về tiến độ dự án.',
  },
  {
    id: 4,
    type: 'Đặt phòng',
    name: 'Phòng seminar B4.203',
    date: '2025-05-15',
    timeSlot: '15:00 - 17:00',
    status: 'rejected',
    requestDate: '2025-05-07',
    location: 'Tòa B4, Tầng 2',
    purpose: 'Tổ chức seminar',
    description: 'Tổ chức seminar về công nghệ blockchain cho sinh viên khoa Công nghệ thông tin.',
    rejectReason: 'Phòng đã được đặt trước cho sự kiện của khoa.',
  },
  {
    id: 5,
    type: 'Đặt phòng',
    name: 'Phòng làm việc nhóm C5.105',
    date: '2025-05-20',
    timeSlot: '07:00 - 09:00',
    status: 'cancelled',
    requestDate: '2025-05-10',
    location: 'Tòa C5, Tầng 1',
    purpose: 'Làm đồ án môn học',
    description: 'Làm đồ án môn Công nghệ phần mềm, họp nhóm để phân chia công việc.',
    cancelReason: 'Thay đổi lịch học, không thể tham gia vào thời gian đã đặt.',
  },
];

// Dữ liệu mẫu cho lịch sử mượn thiết bị
const equipmentBorrowHistoryData: EquipmentBorrowing[] = [
  {
    id: 101,
    type: 'Mượn thiết bị',
    name: 'Máy chiếu Epson EB-X51',
    date: '2025-05-08',
    returnDate: '2025-05-11',
    status: 'approved',
    requestDate: '2025-05-05',
    location: 'Phòng thiết bị H1',
    quantity: 1,
    purpose: 'Thuyết trình đồ án',
    description: 'Mượn máy chiếu để thuyết trình đồ án môn Công nghệ phần mềm tại phòng H1.101.',
  },
  {
    id: 102,
    type: 'Mượn thiết bị',
    name: 'Micro không dây Shure BLX24/PG58',
    date: '2025-05-12',
    returnDate: '2025-05-15',
    status: 'pending',
    requestDate: '2025-05-07',
    location: 'Phòng thiết bị H3',
    quantity: 2,
    purpose: 'Tổ chức sự kiện',
    description: 'Mượn micro không dây để tổ chức sự kiện giao lưu sinh viên tại hội trường B4.',
  },
  {
    id: 103,
    type: 'Mượn thiết bị',
    name: 'Laptop Dell Latitude 5420',
    date: '2025-05-05',
    returnDate: '2025-05-08',
    status: 'completed',
    requestDate: '2025-05-01',
    location: 'Phòng thiết bị H6',
    quantity: 1,
    purpose: 'Làm đồ án',
    description: 'Mượn laptop để làm đồ án môn học do máy tính cá nhân bị hỏng.',
  },
  {
    id: 104,
    type: 'Mượn thiết bị',
    name: 'Camera Sony Alpha A6400',
    date: '2025-05-15',
    returnDate: '2025-05-18',
    status: 'rejected',
    requestDate: '2025-05-10',
    location: 'Phòng thiết bị B4',
    quantity: 1,
    purpose: 'Quay phim sự kiện',
    description: 'Mượn camera để quay phim sự kiện kỷ niệm ngày thành lập khoa.',
    rejectReason: 'Thiết bị đã được đặt trước cho sự kiện của trường.',
  },
  {
    id: 105,
    type: 'Mượn thiết bị',
    name: 'Bộ loa di động JBL Eon One Compact',
    date: '2025-05-20',
    returnDate: '2025-05-22',
    status: 'cancelled',
    requestDate: '2025-05-12',
    location: 'Phòng thiết bị H1',
    quantity: 1,
    purpose: 'Tổ chức hoạt động ngoài trời',
    description: 'Mượn loa di động để tổ chức hoạt động ngoài trời cho câu lạc bộ sinh viên.',
    cancelReason: 'Hoạt động bị hủy do dự báo thời tiết xấu.',
  },
];

// Dữ liệu mẫu cho các trạng thái
const statusOptions = ['Tất cả', 'Đã duyệt', 'Đang chờ', 'Đã hoàn thành', 'Đã từ chối', 'Đã hủy'];

// Dữ liệu mẫu cho các loại yêu cầu
const requestTypes = ['Tất cả', 'Đặt phòng', 'Mượn thiết bị'];

export default function HistoryPage() {
  const { user, logout, isLoading } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [selectedType, setSelectedType] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([...roomBookingHistoryData, ...equipmentBorrowHistoryData]);
  const [showCancelModal, setShowCancelModal] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showDetailModal, setShowDetailModal] = useState<number | null>(null);

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
      if (showProfileDropdown && !target.closest(`.${styles.userInfo}`)) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Filter history based on selected criteria
  useEffect(() => {
    let filtered = [...roomBookingHistoryData, ...equipmentBorrowHistoryData];

    // Filter by tab
    if (activeTab === 'room') {
      filtered = roomBookingHistoryData;
    } else if (activeTab === 'equipment') {
      filtered = equipmentBorrowHistoryData;
    }

    // Filter by status
    if (selectedStatus !== 'Tất cả') {
      const statusMap: { [key: string]: string } = {
        'Đã duyệt': 'approved',
        'Đang chờ': 'pending',
        'Đã hoàn thành': 'completed',
        'Đã từ chối': 'rejected',
        'Đã hủy': 'cancelled'
      };
      filtered = filtered.filter(item => item.status === statusMap[selectedStatus]);
    }

    // Filter by type
    if (selectedType !== 'Tất cả') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.purpose.toLowerCase().includes(term)
      );
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(item => item.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(item => item.date <= endDate);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredHistory(filtered);
    setCurrentPage(1);
  }, [activeTab, selectedStatus, selectedType, searchTerm, startDate, endDate]);

  // Handle search button click
  const handleSearch = () => {
    // In a real application, this would fetch data from an API
    console.log('Searching for history with criteria:', {
      tab: activeTab,
      status: selectedStatus,
      type: selectedType,
      searchTerm: searchTerm,
      startDate: startDate,
      endDate: endDate
    });
  };

  // Handle cancel request
  const handleCancelRequest = (id: number) => {
    console.log('Cancelling request:', {
      id: id,
      reason: cancelReason
    });

    // In a real application, this would send a request to the API
    alert(`Đã hủy yêu cầu thành công!`);
    setShowCancelModal(null);
    setCancelReason('');

    // Update the local state to reflect the cancellation
    const updatedHistory = filteredHistory.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'cancelled',
          cancelReason: cancelReason
        };
      }
      return item;
    });

    setFilteredHistory(updatedHistory);
  };

  // Format date to display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get status text
  const getStatusText = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'approved': 'Đã duyệt',
      'pending': 'Đang chờ',
      'completed': 'Đã hoàn thành',
      'rejected': 'Đã từ chối',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hiển thị loading khi đang tải
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo đăng nhập nếu chưa đăng nhập
  if (!user) {
    return (
      <div className={styles.loginPromptContainer}>
        <div className={styles.loginPromptContent}>
          <h2>Vui lòng đăng nhập để xem lịch sử đặt phòng và mượn thiết bị</h2>
          <p>Bạn cần đăng nhập để có thể xem lịch sử và quản lý các yêu cầu của mình.</p>
          <Link href="/login" className={styles.loginButton}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.historyContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <Image
              src="/hcmut.png"
              alt="HCMUT Logo"
              width={40}
              height={40}
            />
            <div className={styles.logoText}>
              <h1>Trường Đại học Bách khoa - ĐHQG TPHCM</h1>
              <p>Smart Study Space Management and Reservation System for HCMUT</p>
            </div>
          </div>
          <div className={styles.userInfo}>
            <div
              className={styles.userProfileIcon}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            {/* User Profile Dropdown */}
            <div className={`${styles.userProfileDropdown} ${showProfileDropdown ? styles.show : ''}`}>
              <div className={styles.profileDropdownHeader}>
                <div className={styles.userProfileIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className={styles.userDetails}>
                  <p className={styles.userName}>{user.name}</p>
                  <p className={styles.userRole}>{user.role}</p>
                </div>
              </div>
              <div className={styles.profileDropdownContent}>
                <ul className={styles.accountInfoList}>
                  <li className={styles.accountInfoItem}>
                    <span className={styles.accountInfoLabel}>ID:</span>
                    <span className={styles.accountInfoValue}>{user.id}</span>
                  </li>
                  <li className={styles.accountInfoItem}>
                    <span className={styles.accountInfoLabel}>Tên:</span>
                    <span className={styles.accountInfoValue}>{user.name}</span>
                  </li>
                  <li className={styles.accountInfoItem}>
                    <span className={styles.accountInfoLabel}>Vai trò:</span>
                    <span className={`${styles.accountInfoValue} ${styles.highlight}`}>{user.role}</span>
                  </li>
                  <li className={styles.accountInfoItem}>
                    <span className={styles.accountInfoLabel}>Email:</span>
                    <span className={styles.accountInfoValue}>{user.email}</span>
                  </li>
                </ul>
                <div className={styles.quickLinksGrid} style={{marginTop: '1rem'}}>
                  <Link href="/user" className={styles.quickLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.quickLinkIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Trang chủ
                  </Link>
                  <Link href="/booking" className={styles.quickLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.quickLinkIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Đặt phòng
                  </Link>
                  <Link href="/equipment" className={styles.quickLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.quickLinkIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    Mượn thiết bị
                  </Link>
                  <Link href="/history" className={styles.quickLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.quickLinkIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Lịch sử
                  </Link>
                  <Link href="/feedback" className={styles.quickLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.quickLinkIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Góp ý
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                    }}
                    className={`${styles.quickLink} ${styles.danger}`}
                    style={{background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem'}}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.quickLinkIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconMedium} ${styles.pageTitleIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Lịch sử đặt phòng và mượn thiết bị
        </h1>

        {/* Filter Form */}
        <div className={styles.filterForm}>
          <h2 className={styles.formTitle}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconMedium} ${styles.formTitleIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Lọc lịch sử
          </h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="status" className={styles.formLabel}>Trạng thái</label>
              <select
                id="status"
                className={styles.formSelect}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="type" className={styles.formLabel}>Loại yêu cầu</label>
              <select
                id="type"
                className={styles.formSelect}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {requestTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="startDate" className={styles.formLabel}>Từ ngày</label>
              <input
                type="date"
                id="startDate"
                className={styles.formInput}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endDate" className={styles.formLabel}>Đến ngày</label>
              <input
                type="date"
                id="endDate"
                className={styles.formInput}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="search" className={styles.formLabel}>Tìm kiếm</label>
              <input
                type="text"
                id="search"
                className={styles.formInput}
                placeholder="Nhập tên phòng, thiết bị hoặc mục đích..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className={styles.formButton} onClick={handleSearch}>
                <span>Tìm kiếm</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <div
              className={`${styles.tabItem} ${activeTab === 'all' ? styles.active : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Tất cả
            </div>
            <div
              className={`${styles.tabItem} ${activeTab === 'room' ? styles.active : ''}`}
              onClick={() => setActiveTab('room')}
            >
              Đặt phòng
            </div>
            <div
              className={`${styles.tabItem} ${activeTab === 'equipment' ? styles.active : ''}`}
              onClick={() => setActiveTab('equipment')}
            >
              Mượn thiết bị
            </div>
          </div>
        </div>

        {/* History List */}
        <div className={styles.historySection}>
          <h2 className={styles.historyTitle}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconMedium} ${styles.historyTitleIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Lịch sử của bạn ({filteredHistory.length})
          </h2>

          {paginatedHistory.length > 0 ? (
            <div className={styles.historyList}>
              {paginatedHistory.map((item) => (
                <div key={item.id} className={styles.historyCard}>
                  <div className={styles.historyHeader}>
                    <div className={styles.historyType}>
                      {item.type === 'Đặt phòng' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconMedium} ${styles.historyTypeIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconMedium} ${styles.historyTypeIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      )}
                      <span>{item.name}</span>
                    </div>
                    <span className={`${styles.historyStatus} ${styles[item.status]}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>

                  <div className={styles.historyInfo}>
                    <div className={styles.historyInfoItem}>
                      <div className={styles.historyInfoLabel}>Loại yêu cầu</div>
                      <div className={styles.historyInfoValue}>{item.type}</div>
                    </div>
                    <div className={styles.historyInfoItem}>
                      <div className={styles.historyInfoLabel}>Ngày yêu cầu</div>
                      <div className={styles.historyInfoValue}>{formatDate(item.requestDate)}</div>
                    </div>
                    <div className={styles.historyInfoItem}>
                      <div className={styles.historyInfoLabel}>
                        {item.type === 'Đặt phòng' ? 'Ngày đặt' : 'Ngày mượn'}
                      </div>
                      <div className={styles.historyInfoValue}>{formatDate(item.date)}</div>
                    </div>
                    {isRoomBooking(item) ? (
                      <div className={styles.historyInfoItem}>
                        <div className={styles.historyInfoLabel}>Khung giờ</div>
                        <div className={styles.historyInfoValue}>{item.timeSlot}</div>
                      </div>
                    ) : isEquipmentBorrowing(item) && (
                      <div className={styles.historyInfoItem}>
                        <div className={styles.historyInfoLabel}>Ngày trả</div>
                        <div className={styles.historyInfoValue}>{formatDate(item.returnDate)}</div>
                      </div>
                    )}
                    <div className={styles.historyInfoItem}>
                      <div className={styles.historyInfoLabel}>Địa điểm</div>
                      <div className={styles.historyInfoValue}>{item.location}</div>
                    </div>
                    {isEquipmentBorrowing(item) && (
                      <div className={styles.historyInfoItem}>
                        <div className={styles.historyInfoLabel}>Số lượng</div>
                        <div className={styles.historyInfoValue}>{item.quantity}</div>
                      </div>
                    )}
                  </div>

                  <div className={styles.historyDescription}>
                    <strong>Mục đích:</strong> {item.purpose}
                  </div>
                  <div className={styles.historyDescription}>
                    <strong>Mô tả:</strong> {item.description}
                  </div>

                  {item.rejectReason && (
                    <div className={styles.historyDescription} style={{ color: '#ef4444' }}>
                      <strong>Lý do từ chối:</strong> {item.rejectReason}
                    </div>
                  )}

                  {item.cancelReason && (
                    <div className={styles.historyDescription} style={{ color: '#6b7280' }}>
                      <strong>Lý do hủy:</strong> {item.cancelReason}
                    </div>
                  )}

                  <div className={styles.historyActions}>
                    {item.status === 'pending' && (
                      <button
                        className={`${styles.historyButton} ${styles.danger}`}
                        onClick={() => setShowCancelModal(item.id)}
                      >
                        Hủy yêu cầu
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.historyButtonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {(item.status === 'approved' || item.status === 'completed') && (
                      <button
                        className={`${styles.historyButton} ${styles.primary}`}
                        onClick={() => setShowDetailModal(item.id)}
                      >
                        Xem chi tiết
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.historyButtonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {showCancelModal === item.id && (
                    <div className={styles.borrowForm}>
                      <h4 className={styles.borrowFormTitle}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Xác nhận hủy yêu cầu
                      </h4>

                      <div className={styles.borrowFormGroup}>
                        <label htmlFor="cancelReason" className={styles.borrowFormLabel}>Lý do hủy</label>
                        <input
                          type="text"
                          id="cancelReason"
                          className={styles.borrowFormInput}
                          placeholder="Nhập lý do hủy yêu cầu..."
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                        />
                      </div>

                      <div className={styles.borrowFormActions}>
                        <button
                          className={`${styles.borrowFormButton} ${styles.cancel}`}
                          onClick={() => {
                            setShowCancelModal(null);
                            setCancelReason('');
                          }}
                        >
                          Đóng
                        </button>
                        <button
                          className={styles.borrowFormButton}
                          onClick={() => handleCancelRequest(item.id)}
                          disabled={!cancelReason}
                          style={{
                            backgroundColor: !cancelReason ? '#9ca3af' : '#3b82f6',
                            cursor: !cancelReason ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Xác nhận
                        </button>
                      </div>
                    </div>
                  )}

                  {showDetailModal === item.id && (
                    <div className={styles.detailForm}>
                      <h4 className={styles.detailFormTitle}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Chi tiết {item.type.toLowerCase()}
                      </h4>

                      <div className={styles.detailFormSection}>
                        <div className={styles.detailFormGrid}>
                          <div>
                            <div className={styles.detailFormLabel}>Loại yêu cầu</div>
                            <div className={styles.detailFormValue}>{item.type}</div>
                          </div>
                          <div>
                            <div className={styles.detailFormLabel}>Trạng thái</div>
                            <div className={styles.detailFormValue}>{getStatusText(item.status)}</div>
                          </div>
                          <div>
                            <div className={styles.detailFormLabel}>Ngày yêu cầu</div>
                            <div className={styles.detailFormValue}>{formatDate(item.requestDate)}</div>
                          </div>
                          {isRoomBooking(item) ? (
                            <>
                              <div>
                                <div className={styles.detailFormLabel}>Ngày đặt</div>
                                <div className={styles.detailFormValue}>{formatDate(item.date)}</div>
                              </div>
                              <div>
                                <div className={styles.detailFormLabel}>Khung giờ</div>
                                <div className={styles.detailFormValue}>{item.timeSlot}</div>
                              </div>
                            </>
                          ) : isEquipmentBorrowing(item) && (
                            <>
                              <div>
                                <div className={styles.detailFormLabel}>Ngày mượn</div>
                                <div className={styles.detailFormValue}>{formatDate(item.date)}</div>
                              </div>
                              <div>
                                <div className={styles.detailFormLabel}>Ngày trả</div>
                                <div className={styles.detailFormValue}>{formatDate(item.returnDate)}</div>
                              </div>
                              <div>
                                <div className={styles.detailFormLabel}>Số lượng</div>
                                <div className={styles.detailFormValue}>{item.quantity}</div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className={styles.detailFormSection}>
                        <div className={styles.detailFormLabel}>Tên {item.type === 'Đặt phòng' ? 'phòng' : 'thiết bị'}</div>
                        <div className={styles.detailFormValue}>{item.name}</div>
                      </div>

                      <div className={styles.detailFormSection}>
                        <div className={styles.detailFormLabel}>Địa điểm</div>
                        <div className={styles.detailFormValue}>{item.location}</div>
                      </div>

                      <div className={styles.detailFormSection}>
                        <div className={styles.detailFormLabel}>Mục đích sử dụng</div>
                        <div className={styles.detailFormValue}>{item.purpose}</div>
                      </div>

                      <div className={styles.detailFormSection}>
                        <div className={styles.detailFormLabel}>Mô tả</div>
                        <div className={styles.detailFormValue}>{item.description}</div>
                      </div>

                      {item.rejectReason && (
                        <div className={styles.detailFormSection}>
                          <div className={styles.detailFormLabel} style={{ color: '#ef4444' }}>Lý do từ chối</div>
                          <div className={styles.detailFormValue} style={{ color: '#ef4444' }}>{item.rejectReason}</div>
                        </div>
                      )}

                      {item.cancelReason && (
                        <div className={styles.detailFormSection}>
                          <div className={styles.detailFormLabel} style={{ color: '#6b7280' }}>Lý do hủy</div>
                          <div className={styles.detailFormValue} style={{ color: '#6b7280' }}>{item.cancelReason}</div>
                        </div>
                      )}

                      <div className={styles.detailFormActions}>
                        <button
                          className={styles.detailFormButton}
                          onClick={() => setShowDetailModal(null)}
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconLarge} ${styles.emptyStateIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className={styles.emptyStateTitle}>Không tìm thấy lịch sử nào</h3>
              <p className={styles.emptyStateText}>Không có lịch sử đặt phòng hoặc mượn thiết bị nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
              {activeTab !== 'all' && (
                <button
                  className={styles.emptyStateButton}
                  onClick={() => setActiveTab('all')}
                >
                  Xem tất cả lịch sử
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.emptyStateButtonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredHistory.length > itemsPerPage && (
            <div className={styles.pagination}>
              <button
                className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`${styles.paginationButton} ${currentPage === page ? styles.active : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
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
    </div>
  );
}