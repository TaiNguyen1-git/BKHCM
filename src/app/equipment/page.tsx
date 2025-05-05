'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import UserLayout from '../user/components/UserLayout';
import styles from './equipment.module.css';

// Dữ liệu mẫu cho các thiết bị
const equipmentData = [
  {
    id: 1,
    name: 'Máy chiếu Epson EB-X51',
    category: 'Máy chiếu',
    status: 'available',
    location: 'Phòng thiết bị H1',
    quantity: 15,
    availableQuantity: 8,
    image: '/equipment/projector.png',
    description: 'Máy chiếu độ phân giải XGA (1024 x 768), độ sáng 3800 lumens, kết nối HDMI, VGA.',
    features: ['3800 lumens', 'Độ phân giải XGA', 'Kết nối HDMI/VGA', 'Điều khiển từ xa'],
    borrowDuration: [1, 3, 7, 14],
  },
  {
    id: 2,
    name: 'Micro không dây Shure BLX24/PG58',
    category: 'Âm thanh',
    status: 'available',
    location: 'Phòng thiết bị H3',
    quantity: 20,
    availableQuantity: 12,
    image: '/equipment/microphone.jpg',
    description: 'Micro không dây chuyên nghiệp, tần số 50Hz-15kHz, phạm vi hoạt động 100m.',
    features: ['Không dây', 'Pin AA', 'Phạm vi 100m', 'Tần số 50Hz-15kHz'],
    borrowDuration: [1, 3, 5],
  },
  {
    id: 3,
    name: 'Laptop Dell Latitude 5420',
    category: 'Máy tính',
    status: 'available',
    location: 'Phòng thiết bị H6',
    quantity: 25,
    availableQuantity: 10,
    image: '/equipment/laptop.jpg',
    description: 'Laptop Intel Core i5-1135G7, RAM 8GB, SSD 256GB, màn hình 14 inch Full HD.',
    features: ['Intel Core i5', 'RAM 8GB', 'SSD 256GB', 'Windows 10 Pro'],
    borrowDuration: [1, 3, 7],
  },
  {
    id: 4,
    name: 'Camera Sony Alpha A6400',
    category: 'Thiết bị quay phim',
    status: 'available',
    location: 'Phòng thiết bị B4',
    quantity: 10,
    availableQuantity: 3,
    image: '/equipment/camera.jpg',
    description: 'Máy ảnh mirrorless với cảm biến APS-C 24.2MP, quay video 4K, màn hình lật.',
    features: ['Cảm biến 24.2MP', 'Quay video 4K', 'Màn hình lật', 'Kết nối Wi-Fi'],
    borrowDuration: [1, 3, 5],
  },
  {
    id: 5,
    name: 'Bộ loa di động JBL Eon One Compact',
    category: 'Âm thanh',
    status: 'available',
    location: 'Phòng thiết bị H1',
    quantity: 8,
    availableQuantity: 5,
    image: '/equipment/speaker.jpg',
    description: 'Loa di động công suất 150W, pin sử dụng 12 giờ, bluetooth, mixer 4 kênh.',
    features: ['Công suất 150W', 'Pin 12 giờ', 'Bluetooth', 'Mixer 4 kênh'],
    borrowDuration: [1, 2, 3],
  },
  {
    id: 6,
    name: 'Máy tính bảng iPad Pro 11"',
    category: 'Máy tính',
    status: 'available',
    location: 'Phòng thiết bị C5',
    quantity: 15,
    availableQuantity: 7,
    image: '/equipment/ipad.jpg',
    description: 'iPad Pro 11 inch, chip M1, bộ nhớ 128GB, hỗ trợ Apple Pencil thế hệ 2.',
    features: ['Chip M1', 'Màn hình 11"', 'Bộ nhớ 128GB', 'Hỗ trợ Apple Pencil'],
    borrowDuration: [1, 3, 7],
  },
];

// Dữ liệu mẫu cho các danh mục thiết bị
const categories = ['Tất cả', 'Máy chiếu', 'Âm thanh', 'Máy tính', 'Thiết bị quay phim'];

// Dữ liệu mẫu cho các địa điểm
const locations = ['Tất cả', 'Phòng thiết bị H1', 'Phòng thiết bị H3', 'Phòng thiết bị H6', 'Phòng thiết bị B4', 'Phòng thiết bị C5'];

export default function EquipmentPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedLocation, setSelectedLocation] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEquipment, setFilteredEquipment] = useState(equipmentData);
  const [showBorrowForm, setShowBorrowForm] = useState<number | null>(null);
  const [borrowDuration, setBorrowDuration] = useState(1);
  const [borrowQuantity, setBorrowQuantity] = useState(1);
  const [borrowPurpose, setBorrowPurpose] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState<number | null>(null);

  // Filter equipment based on selected criteria
  useEffect(() => {
    let filtered = equipmentData;

    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedLocation !== 'Tất cả') {
      filtered = filtered.filter(item => item.location === selectedLocation);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }

    setFilteredEquipment(filtered);
  }, [selectedCategory, selectedLocation, searchTerm]);

  // Handle search button click
  const handleSearch = () => {
    // In a real application, this would fetch data from an API
    console.log('Searching for equipment with criteria:', {
      category: selectedCategory,
      location: selectedLocation,
      searchTerm: searchTerm
    });
  };

  // Handle borrow button click
  const handleBorrow = (id: number) => {
    setShowBorrowForm(id);
    setBorrowDuration(1);
    setBorrowQuantity(1);
    setBorrowPurpose('');
  };

  // Handle borrow form submission
  const handleBorrowSubmit = (id: number) => {
    console.log('Borrowing equipment:', {
      equipmentId: id,
      duration: borrowDuration,
      quantity: borrowQuantity,
      purpose: borrowPurpose
    });

    // In a real application, this would send a request to the API
    alert(`Đã gửi yêu cầu mượn thiết bị thành công!`);
    setShowBorrowForm(null);
  };

  // Handle showing equipment details
  const handleShowDetails = (id: number) => {
    setShowDetailsModal(id);
  };

  // Handle closing equipment details modal
  const handleCloseDetails = () => {
    setShowDetailsModal(null);
  };



  return (
    <UserLayout>
      <div className={styles.equipmentContent}>
        <h1 className={styles.pageTitle}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconMedium} ${styles.pageTitleIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          Mượn thiết bị
        </h1>

        {/* Filter Form */}
        <div className={styles.filterForm}>
          <h2 className={styles.formTitle}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconMedium} ${styles.formTitleIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Tìm thiết bị
          </h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.formLabel}>Danh mục</label>
              <select
                id="category"
                className={styles.formSelect}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="location" className={styles.formLabel}>Địa điểm</label>
              <select
                id="location"
                className={styles.formSelect}
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="search" className={styles.formLabel}>Tìm kiếm</label>
              <input
                type="text"
                id="search"
                className={styles.formInput}
                placeholder="Nhập tên thiết bị hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className={styles.formButton} onClick={handleSearch}>
                <span>Tìm thiết bị</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Equipment List */}
        <div className={styles.equipmentSection}>
          <h2 className={styles.equipmentTitle}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconMedium} ${styles.equipmentTitleIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            Thiết bị có sẵn ({filteredEquipment.length})
          </h2>

          <div className={styles.equipmentGrid}>
            {filteredEquipment.map((equipment) => (
              <div key={equipment.id} className={styles.equipmentCard}>
                <div className={styles.equipmentHeader}>
                  <h3 className={styles.equipmentName}>{equipment.name}</h3>
                  <span className={`${styles.equipmentStatus} ${styles[equipment.status]}`}>
                    {equipment.status === 'available' ? 'Có sẵn' : 'Không có sẵn'}
                  </span>
                </div>

                <div className={styles.equipmentImageContainer}>
                  <Image
                    src={equipment.image}
                    alt={equipment.name}
                    width={300}
                    height={200}
                    className={styles.equipmentImage}
                  />
                </div>

                <div className={styles.equipmentInfo}>
                  <div className={styles.equipmentInfoItem}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.equipmentInfoIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{equipment.location}</span>
                  </div>
                  <div className={styles.equipmentInfoItem}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.equipmentInfoIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Danh mục: {equipment.category}</span>
                  </div>
                  <div className={styles.equipmentInfoItem}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.equipmentInfoIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <span>Số lượng: {equipment.availableQuantity}/{equipment.quantity}</span>
                  </div>
                </div>

                <p className={styles.equipmentDescription}>{equipment.description}</p>

                <div className={styles.equipmentFeatures}>
                  <h4 className={styles.equipmentFeaturesTitle}>Tính năng:</h4>
                  <div className={styles.featuresList}>
                    {equipment.features.map((feature, index) => (
                      <span key={index} className={styles.featureTag}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.featureIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {showBorrowForm === equipment.id && (
                  <div className={styles.borrowForm}>
                    <h4 className={styles.borrowFormTitle}>Mượn thiết bị</h4>

                    <div className={styles.borrowFormGroup}>
                      <label htmlFor={`duration-${equipment.id}`} className={styles.borrowFormLabel}>Thời gian mượn (ngày)</label>
                      <select
                        id={`duration-${equipment.id}`}
                        className={styles.borrowFormSelect}
                        value={borrowDuration}
                        onChange={(e) => setBorrowDuration(parseInt(e.target.value))}
                      >
                        {equipment.borrowDuration.map((days) => (
                          <option key={days} value={days}>{days} ngày</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.borrowFormGroup}>
                      <label htmlFor={`quantity-${equipment.id}`} className={styles.borrowFormLabel}>Số lượng</label>
                      <input
                        type="number"
                        id={`quantity-${equipment.id}`}
                        className={styles.borrowFormInput}
                        min="1"
                        max={equipment.availableQuantity}
                        value={borrowQuantity}
                        onChange={(e) => setBorrowQuantity(parseInt(e.target.value) || 1)}
                      />
                    </div>

                    <div className={styles.borrowFormGroup}>
                      <label htmlFor={`purpose-${equipment.id}`} className={styles.borrowFormLabel}>Mục đích sử dụng</label>
                      <input
                        type="text"
                        id={`purpose-${equipment.id}`}
                        className={styles.borrowFormInput}
                        placeholder="Nhập mục đích sử dụng..."
                        value={borrowPurpose}
                        onChange={(e) => setBorrowPurpose(e.target.value)}
                      />
                    </div>

                    <div className={styles.borrowFormActions}>
                      <button
                        className={`${styles.borrowFormButton} ${styles.cancel}`}
                        onClick={() => setShowBorrowForm(null)}
                      >
                        Hủy
                      </button>
                      <button
                        className={styles.borrowFormButton}
                        onClick={() => handleBorrowSubmit(equipment.id)}
                        disabled={!borrowPurpose || borrowQuantity < 1}
                        style={{
                          backgroundColor: !borrowPurpose || borrowQuantity < 1 ? '#9ca3af' : '#3b82f6',
                          cursor: !borrowPurpose || borrowQuantity < 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Xác nhận
                      </button>
                    </div>
                  </div>
                )}

                <div className={styles.equipmentActions}>
                  <button
                    className={styles.equipmentButton}
                    onClick={() => handleBorrow(equipment.id)}
                    disabled={equipment.availableQuantity < 1}
                    style={{
                      backgroundColor: equipment.availableQuantity < 1 ? '#9ca3af' : '#3b82f6',
                      cursor: equipment.availableQuantity < 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <span>Mượn thiết bị</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.equipmentButtonIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    className={styles.equipmentDetailsButton}
                    onClick={() => handleShowDetails(equipment.id)}
                  >
                    <span>Chi tiết</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.equipmentDetailsIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Details Modal */}
      {showDetailsModal !== null && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {filteredEquipment.filter(item => item.id === showDetailsModal).map(equipment => (
              <div key={equipment.id} className={styles.detailsModalContainer}>
                <div className={styles.detailsModalHeader}>
                  <h2 className={styles.detailsModalTitle}>{equipment.name}</h2>
                  <button className={styles.detailsModalClose} onClick={handleCloseDetails}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className={styles.detailsModalBody}>
                  <div className={styles.detailsModalImageContainer}>
                    <Image
                      src={equipment.image}
                      alt={equipment.name}
                      width={400}
                      height={300}
                      className={styles.detailsModalImage}
                    />
                  </div>

                  <div className={styles.detailsModalInfo}>
                    <div className={styles.detailsModalSection}>
                      <h3 className={styles.detailsModalSectionTitle}>Thông tin chung</h3>
                      <div className={styles.detailsModalGrid}>
                        <div className={styles.detailsModalItem}>
                          <span className={styles.detailsModalLabel}>Danh mục:</span>
                          <span className={styles.detailsModalValue}>{equipment.category}</span>
                        </div>
                        <div className={styles.detailsModalItem}>
                          <span className={styles.detailsModalLabel}>Trạng thái:</span>
                          <span className={`${styles.detailsModalValue} ${styles[equipment.status]}`}>
                            {equipment.status === 'available' ? 'Có sẵn' : 'Không có sẵn'}
                          </span>
                        </div>
                        <div className={styles.detailsModalItem}>
                          <span className={styles.detailsModalLabel}>Địa điểm:</span>
                          <span className={styles.detailsModalValue}>{equipment.location}</span>
                        </div>
                        <div className={styles.detailsModalItem}>
                          <span className={styles.detailsModalLabel}>Số lượng:</span>
                          <span className={styles.detailsModalValue}>{equipment.availableQuantity}/{equipment.quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.detailsModalSection}>
                      <h3 className={styles.detailsModalSectionTitle}>Mô tả</h3>
                      <p className={styles.detailsModalDescription}>{equipment.description}</p>
                    </div>

                    <div className={styles.detailsModalSection}>
                      <h3 className={styles.detailsModalSectionTitle}>Tính năng</h3>
                      <div className={styles.detailsModalFeatures}>
                        {equipment.features.map((feature, index) => (
                          <div key={index} className={styles.detailsModalFeatureItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.iconSmall} ${styles.detailsModalFeatureIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.detailsModalSection}>
                      <h3 className={styles.detailsModalSectionTitle}>Thời gian mượn</h3>
                      <div className={styles.detailsModalDurations}>
                        {equipment.borrowDuration.map((days, index) => (
                          <span key={index} className={styles.detailsModalDurationTag}>
                            {days} ngày
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.detailsModalFooter}>
                  <button
                    className={styles.detailsModalButton}
                    onClick={() => {
                      handleCloseDetails();
                      handleBorrow(equipment.id);
                    }}
                    disabled={equipment.availableQuantity < 1}
                    style={{
                      backgroundColor: equipment.availableQuantity < 1 ? '#9ca3af' : '#3b82f6',
                      cursor: equipment.availableQuantity < 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <span>Mượn thiết bị</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </UserLayout>
  );
}