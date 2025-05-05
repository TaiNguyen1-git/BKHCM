'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Room } from './context/RoomContext';

export default function Home() {
  const featuresRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Lấy dữ liệu phòng học từ localStorage hoặc dữ liệu mẫu
  useEffect(() => {
    const storedRooms = localStorage.getItem('rooms');
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    } else {
      // Dữ liệu mẫu nếu không có trong localStorage
      const initialRoomsData: Room[] = [
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
        }
      ];
      setRooms(initialRoomsData);
    }
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="header-container">
        <div className="flex justify-between items-center relative">
          <div className="logo-container">
            <Image
              src="/hcmut.png"
              alt="HCMUT Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="logo-text">
              <div>Trường Đại học Bách khoa</div>
              <div>ĐHQG TPHCM</div>
            </div>
          </div>

          <button className="menu-button" onClick={toggleMenu} aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="mobile-menu">
              <nav>
                <ul>
                  <li><Link href="/" onClick={toggleMenu}>Trang chủ</Link></li>
                  <li><Link href="/services" onClick={toggleMenu}>Dịch vụ</Link></li>
                  <li><Link href="/about" onClick={toggleMenu}>Về chúng tôi</Link></li>
                  <li className="menu-divider"></li>
                  <li className="menu-auth-links">
                    <Link href="/login" onClick={toggleMenu} className="menu-auth-button login">Đăng nhập</Link>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h1 className="hero-title">Smart Study Space Management</h1>
          <p className="hero-description">
            Hệ thống quản lý không gian học tập thông minh và đặt phòng tự động cho sinh viên HCMUT
          </p>

          <div className="action-buttons">
            <Link href="/login" className="btn-login">
              Đăng nhập ngay
            </Link>
            <button className="btn-more" onClick={scrollToFeatures}>
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-8" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <h2 className="section-title">Tính năng nổi bật</h2>
          <p className="section-description">
            Hệ thống của chúng tôi cung cấp các tính năng hiện đại giúp việc đặt phòng và quản lý không gian học tập trở nên đơn giản hơn.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4355d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 className="font-bold mb-2">Đặt phòng dễ dàng</h3>
              <p className="text-sm text-gray-600">Đặt phòng học và không gian làm việc chỉ với vài thao tác đơn giản</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4355d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 className="font-bold mb-2">Tìm kiếm thông minh</h3>
              <p className="text-sm text-gray-600">Tìm kiếm phòng học dựa trên thời gian, số lượng người và các tiện ích</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4355d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 className="font-bold mb-2">Theo dõi trực tiếp</h3>
              <p className="text-sm text-gray-600">Xem trạng thái phòng học và số lượng chỗ ngồi còn trống theo thời gian thực</p>
            </div>
          </div>
        </div>
      </section>

      {/* Study Spaces Section */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Không gian học tập hiện đại</h2>
          <p className="section-description">
            Khám phá các không gian học tập được trang bị đầy đủ tiện nghi, phù hợp với nhiều nhu cầu học tập khác nhau.
          </p>

          <div className="rooms-grid">
            {rooms.slice(0, 4).map((room) => (
              <div key={room.id} className="room-container">
                <div className="room-header">
                  <h3 className="room-title">{room.name}</h3>
                </div>
                <p className="room-capacity">Sức chứa: {room.capacity} người</p>
                <div className="room-features">
                  {room.equipment.slice(0, 3).map((equipment, index) => (
                    <span key={index} className="room-feature">{equipment}</span>
                  ))}
                  {room.equipment.length > 3 && (
                    <span className="room-feature">+{room.equipment.length - 3}</span>
                  )}
                </div>
                <div className="room-status">
                  <span className="status-available">Có sẵn</span>
                  <Link href="/login" className="btn-book">Đặt ngay</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-info">
            <div className="footer-logo">
          <Image
                src="/hcmut.png"
                alt="HCMUT Logo"
                width={30}
                height={30}
                className="object-contain"
              />
              <span className="font-bold text-white">HCMUT</span>
            </div>

            <p className="text-sm text-gray-300">Trường Đại học Bách khoa - ĐHQG TPHCM</p>
            <p className="text-sm text-gray-300">268 Lý Thường Kiệt, P.14, Q.10, TP.HCM</p>
          </div>

          <div className="footer-links-container">
            <div className="footer-column">
              <h3 className="font-bold mb-3 text-white">Liên kết</h3>
              <div className="footer-links">
                <Link href="/" className="footer-link">Trang chủ</Link>
                <Link href="/about" className="footer-link">Về chúng tôi</Link>
                <Link href="/services" className="footer-link">Dịch vụ</Link>
                <a href="#" className="footer-link">Liên hệ</a>
              </div>
            </div>

            <div className="footer-column">
              <h3 className="font-bold mb-3 text-white">Dịch vụ</h3>
              <div className="footer-links">
                <a href="#" className="footer-link">Đặt phòng học</a>
                <a href="#" className="footer-link">Tìm không gian học tập</a>
                <a href="#" className="footer-link">Tạo nhóm học tập</a>
                <a href="#" className="footer-link">Quản lý phòng</a>
              </div>
            </div>

            <div className="footer-column">
              <h3 className="font-bold mb-3 text-white">Liên hệ</h3>
              <div className="footer-contact">
                <div className="contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>support@hcmut.edu.vn</span>
                </div>
                <div className="contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>(028) 38 651 670</span>
                </div>
              </div>
            </div>
          </div>

          <div className="social-links-container">
            <h3 className="font-bold mb-3 text-white">Theo dõi chúng tôi</h3>
            <div className="social-links">
              <a href="#" className="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2024 Trường Đại học Bách khoa - ĐHQG TPHCM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}