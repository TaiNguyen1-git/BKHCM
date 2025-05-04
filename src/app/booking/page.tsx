'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './booking.module.css';

// Dữ liệu mẫu cho các phòng
const roomsData = [
  {
    id: 1,
    name: 'Phòng học H1.101',
    capacity: 40,
    building: 'H1',
    floor: 1,
    type: 'Phòng học',
    status: 'available',
    equipment: ['Máy chiếu', 'Bảng trắng', 'Điều hòa', 'Micro'],
    availableTimeSlots: ['07:00 - 09:00', '09:00 - 11:00', '13:00 - 15:00', '15:00 - 17:00'],
  },
  {
    id: 2,
    name: 'Phòng thực hành H3.201',
    capacity: 30,
    building: 'H3',
    floor: 2,
    type: 'Phòng thực hành',
    status: 'available',
    equipment: ['Máy tính (30)', 'Máy chiếu', 'Bảng trắng', 'Điều hòa'],
    availableTimeSlots: ['07:00 - 09:00', '13:00 - 15:00', '15:00 - 17:00'],
  },
  {
    id: 3,
    name: 'Phòng họp H6.302',
    capacity: 15,
    building: 'H6',
    floor: 3,
    type: 'Phòng họp',
    status: 'available',
    equipment: ['Máy chiếu', 'Bảng trắng', 'Điều hòa', 'Bàn họp'],
    availableTimeSlots: ['09:00 - 11:00', '13:00 - 15:00', '17:00 - 19:00'],
  },
  {
    id: 4,
    name: 'Phòng seminar B4.203',
    capacity: 50,
    building: 'B4',
    floor: 2,
    type: 'Phòng seminar',
    status: 'available',
    equipment: ['Máy chiếu', 'Bảng trắng', 'Điều hòa', 'Micro', 'Loa'],
    availableTimeSlots: ['07:00 - 09:00', '09:00 - 11:00', '15:00 - 17:00'],
  },
  {
    id: 5,
    name: 'Phòng làm việc nhóm C5.105',
    capacity: 10,
    building: 'C5',
    floor: 1,
    type: 'Phòng làm việc nhóm',
    status: 'available',
    equipment: ['Bảng trắng', 'Điều hòa', 'Bàn tròn'],
    availableTimeSlots: ['07:00 - 09:00', '09:00 - 11:00', '13:00 - 15:00', '15:00 - 17:00', '17:00 - 19:00'],
  },
  {
    id: 6,
    name: 'Phòng học H2.304',
    capacity: 35,
    building: 'H2',
    floor: 3,
    type: 'Phòng học',
    status: 'available',
    equipment: ['Máy chiếu', 'Bảng trắng', 'Điều hòa'],
    availableTimeSlots: ['07:00 - 09:00', '13:00 - 15:00'],
  },
];

// Dữ liệu mẫu cho các tòa nhà
const buildings = ['Tất cả', 'H1', 'H2', 'H3', 'H6', 'B4', 'C5'];

// Dữ liệu mẫu cho các loại phòng
const roomTypes = ['Tất cả', 'Phòng học', 'Phòng thực hành', 'Phòng họp', 'Phòng seminar', 'Phòng làm việc nhóm'];

export default function BookingPage() {
  const { user, logout, isLoading } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('Tất cả');
  const [selectedRoomType, setSelectedRoomType] = useState<string>('Tất cả');
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [filteredRooms, setFilteredRooms] = useState(roomsData);
  const [showBookingForm, setShowBookingForm] = useState<number | null>(null);
  const [showDetailsForm, setShowDetailsForm] = useState<number | null>(null);
  const [bookingPurpose, setBookingPurpose] = useState('');
  const [bookingDescription, setBookingDescription] = useState('');
  const [participantCount, setParticipantCount] = useState(1);

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

  // Filter rooms based on selected criteria
  useEffect(() => {
    let filtered = roomsData;

    if (selectedBuilding !== 'Tất cả') {
      filtered = filtered.filter(room => room.building === selectedBuilding);
    }

    if (selectedRoomType !== 'Tất cả') {
      filtered = filtered.filter(room => room.type === selectedRoomType);
    }

    if (minCapacity > 0) {
      filtered = filtered.filter(room => room.capacity >= minCapacity);
    }

    setFilteredRooms(filtered);
  }, [selectedBuilding, selectedRoomType, minCapacity]);

  // Format date to display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get day of week
  const getDayOfWeek = (date: Date): string => {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return days[date.getDay()];
  };

  // Handle search button click
  const handleSearch = () => {
    // In a real application, this would fetch data from an API
    // For now, we'll just use our filtered data
    console.log('Searching for rooms with criteria:', {
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      building: selectedBuilding,
      roomType: selectedRoomType,
      minCapacity: minCapacity
    });
  };

  // Handle booking button click
  const handleBookingClick = (roomId: number) => {
    setShowBookingForm(roomId);
    setBookingPurpose('');
    setBookingDescription('');
    setParticipantCount(1);
  };

  // Handle booking form submission
  const handleBookingSubmit = (roomId: number) => {
    const room = roomsData.find(r => r.id === roomId);

    if (!room) return;

    console.log('Booking room:', {
      roomId: roomId,
      roomName: room.name,
      date: selectedDate.toISOString().split('T')[0],
      timeSlot: selectedTimeSlot,
      purpose: bookingPurpose,
      description: bookingDescription,
      participantCount: participantCount
    });

    // In a real application, this would send a request to the API
    alert(`Đã gửi yêu cầu đặt phòng ${room.name} thành công!`);
    setShowBookingForm(null);
  };

  // Handle details button click
  const handleDetailsClick = (roomId: number) => {
    setShowDetailsForm(roomId);
    // Close booking form if it's open
    if (showBookingForm === roomId) {
      setShowBookingForm(null);
    }
  };

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
          <h2>Vui lòng đăng nhập để sử dụng dịch vụ đặt phòng</h2>
          <p>Bạn cần đăng nhập để có thể đặt phòng và sử dụng các dịch vụ khác.</p>
          <Link href="/login" className={styles.loginButton}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookingContainer}>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Đặt phòng
        </h1>

        {/* Booking Form */}
        <div className={styles.bookingForm}>
          <h2 className={styles.formTitle}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconMedium} ${styles.formTitleIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Tìm phòng trống
          </h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="date" className={styles.formLabel}>Ngày</label>
              <input
                type="date"
                id="date"
                className={styles.formInput}
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
                {getDayOfWeek(selectedDate)}, {formatDate(selectedDate)}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="timeSlot" className={styles.formLabel}>Khung giờ</label>
              <select
                id="timeSlot"
                className={styles.formSelect}
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
              >
                <option value="">Chọn khung giờ</option>
                <option value="07:00 - 09:00">07:00 - 09:00</option>
                <option value="09:00 - 11:00">09:00 - 11:00</option>
                <option value="13:00 - 15:00">13:00 - 15:00</option>
                <option value="15:00 - 17:00">15:00 - 17:00</option>
                <option value="17:00 - 19:00">17:00 - 19:00</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="building" className={styles.formLabel}>Tòa nhà</label>
              <select
                id="building"
                className={styles.formSelect}
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
              >
                {buildings.map((building, index) => (
                  <option key={index} value={building}>{building}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="roomType" className={styles.formLabel}>Loại phòng</label>
              <select
                id="roomType"
                className={styles.formSelect}
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
              >
                {roomTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="capacity" className={styles.formLabel}>Sức chứa tối thiểu</label>
              <input
                type="number"
                id="capacity"
                className={styles.formInput}
                min="0"
                value={minCapacity}
                onChange={(e) => setMinCapacity(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className={styles.formButton} onClick={handleSearch}>
                <span>Tìm phòng</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Available Rooms */}
        <div className={styles.roomsSection}>
          <h2 className={styles.roomsTitle}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconMedium} ${styles.roomsTitleIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Phòng trống ({filteredRooms.length})
          </h2>

          <div className={styles.roomsGrid}>
            {filteredRooms.map((room) => (
              <div key={room.id} className={styles.roomCard}>
                <div className={styles.roomHeader}>
                  <h3 className={styles.roomName}>{room.name}</h3>
                  <span className={`${styles.roomStatus} ${styles[room.status]}`}>
                    {room.status === 'available' ? 'Trống' : 'Đã đặt'}
                  </span>
                </div>

                <div className={styles.roomInfo}>
                  <div className={styles.roomInfoItem}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.roomInfoIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>Tòa {room.building}, Tầng {room.floor}</span>
                  </div>
                  <div className={styles.roomInfoItem}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.roomInfoIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Sức chứa: {room.capacity} người</span>
                  </div>
                  <div className={styles.roomInfoItem}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.roomInfoIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Loại: {room.type}</span>
                  </div>
                </div>

                <div className={styles.roomEquipment}>
                  <h4 className={styles.roomEquipmentTitle}>Thiết bị:</h4>
                  <div className={styles.equipmentList}>
                    {room.equipment.map((item, index) => (
                      <span key={index} className={styles.equipmentTag}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.equipmentIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.timeSlots}>
                  <h4 className={styles.roomEquipmentTitle}>Khung giờ trống:</h4>
                  <div className={styles.timeSlots}>
                    {room.availableTimeSlots.map((slot, index) => (
                      <span
                        key={index}
                        className={`${styles.timeSlot} ${styles.available} ${selectedTimeSlot === slot ? styles.selected : ''}`}
                        onClick={() => setSelectedTimeSlot(slot)}
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>

                {showDetailsForm === room.id && (
                  <div className={styles.bookingFormModal}>
                    <h4 className={styles.bookingFormTitle}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Chi tiết phòng {room.name}
                    </h4>

                    <div className={styles.bookingFormSection}>
                      <div className={styles.bookingFormGrid}>
                        <div>
                          <div className={styles.bookingFormLabel}>Tên phòng</div>
                          <div className={styles.bookingFormValue}>{room.name}</div>
                        </div>
                        <div>
                          <div className={styles.bookingFormLabel}>Loại phòng</div>
                          <div className={styles.bookingFormValue}>{room.type}</div>
                        </div>
                        <div>
                          <div className={styles.bookingFormLabel}>Vị trí</div>
                          <div className={styles.bookingFormValue}>Tòa {room.building}, Tầng {room.floor}</div>
                        </div>
                        <div>
                          <div className={styles.bookingFormLabel}>Sức chứa</div>
                          <div className={styles.bookingFormValue}>{room.capacity} người</div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.bookingFormSection}>
                      <div className={styles.bookingFormLabel}>Thiết bị có sẵn</div>
                      <div className={styles.equipmentList} style={{ marginTop: '0.5rem' }}>
                        {room.equipment.map((item, index) => (
                          <span key={index} className={styles.equipmentTag}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.equipmentIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={styles.bookingFormSection}>
                      <div className={styles.bookingFormLabel}>Khung giờ trống</div>
                      <div className={styles.timeSlots} style={{ marginTop: '0.5rem' }}>
                        {room.availableTimeSlots.map((slot, index) => (
                          <span
                            key={index}
                            className={`${styles.timeSlot} ${styles.available}`}
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={styles.bookingFormActions}>
                      <button
                        className={`${styles.bookingFormButton} ${styles.cancel}`}
                        onClick={() => setShowDetailsForm(null)}
                      >
                        Đóng
                      </button>
                      <button
                        className={styles.bookingFormButton}
                        onClick={() => {
                          setShowDetailsForm(null);
                          handleBookingClick(room.id);
                        }}
                        disabled={!selectedTimeSlot}
                        style={{
                          backgroundColor: !selectedTimeSlot ? '#9ca3af' : '#3b82f6',
                          cursor: !selectedTimeSlot ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Đặt phòng
                      </button>
                    </div>
                  </div>
                )}

                {showBookingForm === room.id && (
                  <div className={styles.bookingFormModal}>
                    <h4 className={styles.bookingFormTitle}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Đặt phòng {room.name}
                    </h4>

                    <div className={styles.bookingFormInfo}>
                      <strong>Thông tin đặt phòng:</strong> {getDayOfWeek(selectedDate)}, {formatDate(selectedDate)}, {selectedTimeSlot || 'Chưa chọn khung giờ'}
                    </div>

                    <div className={styles.bookingFormGrid}>
                      <div className={styles.bookingFormGroup}>
                        <label htmlFor={`participants-${room.id}`} className={styles.bookingFormLabel}>Số người tham gia</label>
                        <input
                          type="number"
                          id={`participants-${room.id}`}
                          className={styles.bookingFormInput}
                          min="1"
                          max={room.capacity}
                          value={participantCount}
                          onChange={(e) => setParticipantCount(parseInt(e.target.value) || 1)}
                        />
                        <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                          Sức chứa tối đa: {room.capacity} người
                        </div>
                      </div>

                      <div className={styles.bookingFormGroup}>
                        <label htmlFor={`purpose-${room.id}`} className={styles.bookingFormLabel}>Mục đích sử dụng</label>
                        <input
                          type="text"
                          id={`purpose-${room.id}`}
                          className={styles.bookingFormInput}
                          placeholder="Nhập mục đích sử dụng phòng..."
                          value={bookingPurpose}
                          onChange={(e) => setBookingPurpose(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.bookingFormGroup}>
                      <label htmlFor={`description-${room.id}`} className={styles.bookingFormLabel}>Mô tả chi tiết</label>
                      <textarea
                        id={`description-${room.id}`}
                        className={styles.bookingFormTextarea}
                        placeholder="Nhập mô tả chi tiết về buổi học/họp..."
                        value={bookingDescription}
                        onChange={(e) => setBookingDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <div className={styles.bookingFormActions}>
                      <button
                        className={`${styles.bookingFormButton} ${styles.cancel}`}
                        onClick={() => setShowBookingForm(null)}
                      >
                        Hủy
                      </button>
                      <button
                        className={styles.bookingFormButton}
                        onClick={() => handleBookingSubmit(room.id)}
                        disabled={!bookingPurpose || !selectedTimeSlot}
                        style={{
                          backgroundColor: !bookingPurpose || !selectedTimeSlot ? '#9ca3af' : '#3b82f6',
                          cursor: !bookingPurpose || !selectedTimeSlot ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Xác nhận đặt phòng
                      </button>
                    </div>
                  </div>
                )}

                <div className={styles.roomActions}>
                  <button
                    className={styles.roomButton}
                    onClick={() => handleBookingClick(room.id)}
                    disabled={!selectedTimeSlot}
                    style={{
                      backgroundColor: !selectedTimeSlot ? '#9ca3af' : '#3b82f6',
                      cursor: !selectedTimeSlot ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <span>Đặt phòng</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.roomButtonIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    className={styles.roomDetailsButton}
                    onClick={() => handleDetailsClick(room.id)}
                  >
                    <span>Chi tiết</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.roomDetailsIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
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
    </div>
  );
}
