'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useDevices, Device, deviceCategories, deviceLocations } from '@/app/context/DeviceContext';
import AdminLayout from '@/app/admin/components/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import styles from './equipment.module.css';

export default function EquipmentManagement() {
  const { user, isLoading, logout } = useAuth();
  const { devices, addDevice, updateDevice, deleteDevice } = useDevices();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<Omit<Device, 'id'> & { id?: number }>({
    name: '',
    category: deviceCategories[0],
    status: 'available',
    location: deviceLocations[0],
    quantity: 1,
    availableQuantity: 1,
    image: '/equipment/default.jpg',
    description: '',
    features: [],
    borrowDuration: [1, 3, 7]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [featureInput, setFeatureInput] = useState('');
  const [borrowDurationInput, setBorrowDurationInput] = useState('');

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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

  // Filter devices by search term and filters
  const filteredDevices = devices.filter(device => {
    // Search term filter
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = categoryFilter === '' || device.category === categoryFilter;

    // Location filter
    const matchesLocation = locationFilter === '' || device.location === locationFilter;

    // Status filter
    const matchesStatus = statusFilter === '' || device.status === statusFilter;

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Handle numeric values
    if (name === 'quantity' || name === 'availableQuantity') {
      const numValue = parseInt(value, 10) || 0;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // If quantity changes, update availableQuantity to not exceed quantity
    if (name === 'quantity') {
      const numValue = parseInt(value, 10) || 0;
      if (formData.availableQuantity > numValue) {
        setFormData(prev => ({ ...prev, availableQuantity: numValue }));
      }
    }
  };

  // Add a feature to the features array
  const handleAddFeature = () => {
    if (featureInput.trim() === '') return;

    setFormData(prev => ({
      ...prev,
      features: [...prev.features, featureInput.trim()]
    }));

    setFeatureInput('');
  };

  // Remove a feature from the features array
  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Add a borrow duration to the borrowDuration array
  const handleAddBorrowDuration = () => {
    const duration = parseInt(borrowDurationInput, 10);
    if (isNaN(duration) || duration <= 0) return;

    setFormData(prev => {
      // Check if duration already exists
      if (prev.borrowDuration.includes(duration)) return prev;

      // Add and sort the durations
      const newDurations = [...prev.borrowDuration, duration].sort((a, b) => a - b);
      return {
        ...prev,
        borrowDuration: newDurations
      };
    });

    setBorrowDurationInput('');
  };

  // Remove a borrow duration from the borrowDuration array
  const handleRemoveBorrowDuration = (duration: number) => {
    setFormData(prev => ({
      ...prev,
      borrowDuration: prev.borrowDuration.filter(d => d !== duration)
    }));
  };

  // Open modal to add a new device
  const handleAddDeviceModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      category: deviceCategories[0],
      status: 'available',
      location: deviceLocations[0],
      quantity: 1,
      availableQuantity: 1,
      image: '/equipment/default.jpg',
      description: '',
      features: [],
      borrowDuration: [1, 3, 7]
    });
    setShowModal(true);
  };

  // Open modal to edit an existing device
  const handleEditDeviceModal = (device: Device) => {
    setModalMode('edit');
    setCurrentDevice(device);
    setFormData({
      id: device.id,
      name: device.name,
      category: device.category,
      status: device.status,
      location: device.location,
      quantity: device.quantity,
      availableQuantity: device.availableQuantity,
      image: device.image,
      description: device.description,
      features: [...device.features],
      borrowDuration: [...device.borrowDuration]
    });
    setShowModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setConfirmDelete(id);
  };

  // Handle device deletion
  const handleDeleteDevice = (id: number) => {
    deleteDevice(id);
    setConfirmDelete(null);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === 'add') {
      const newDevice: Omit<Device, 'id'> = {
        name: formData.name,
        category: formData.category,
        status: formData.status,
        location: formData.location,
        quantity: formData.quantity,
        availableQuantity: formData.availableQuantity,
        image: formData.image,
        description: formData.description,
        features: formData.features,
        borrowDuration: formData.borrowDuration
      };

      addDevice(newDevice);
    } else if (modalMode === 'edit' && formData.id !== undefined) {
      const updatedDevice: Device = {
        id: formData.id,
        name: formData.name,
        category: formData.category,
        status: formData.status,
        location: formData.location,
        quantity: formData.quantity,
        availableQuantity: formData.availableQuantity,
        image: formData.image,
        description: formData.description,
        features: formData.features,
        borrowDuration: formData.borrowDuration
      };

      updateDevice(updatedDevice);
    }

    setShowModal(false);
  };

  // Display loading state
  if (isLoading || !user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <AdminLayout requiredPermission="admin.equipment">
      <div className={styles.equipmentManagementContainer}>

      {/* Main content */}
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <div className={styles.breadcrumbs}>
            <Link href="/admin" className={styles.breadcrumbLink}>
              Trang chủ Admin
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>Quản lý thiết bị</span>
          </div>
          <h1 className={styles.pageTitle}>Quản lý thiết bị</h1>
        </div>

        <div className={styles.equipmentManagementControls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Tìm kiếm thiết bị..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className={styles.addEquipmentButton} onClick={handleAddDeviceModal}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm thiết bị
          </button>
        </div>

        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Danh mục</label>
            <select
              className={styles.filterSelect}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              {deviceCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Địa điểm</label>
            <select
              className={styles.filterSelect}
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              {deviceLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Trạng thái</label>
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="available">Khả dụng</option>
              <option value="unavailable">Không khả dụng</option>
              <option value="maintenance">Bảo trì</option>
            </select>
          </div>
        </div>

        <div className={styles.equipmentTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderCell} style={{ width: '5%' }}>STT</div>
            <div className={styles.tableHeaderCell} style={{ width: '25%' }}>Tên thiết bị</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Danh mục</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Địa điểm</div>
            <div className={styles.tableHeaderCell} style={{ width: '10%' }}>Số lượng</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Trạng thái</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Thao tác</div>
          </div>

          <div className={styles.tableBody}>
            {filteredDevices.length === 0 ? (
              <div className={styles.noResults}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.noResultsIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Không tìm thấy thiết bị nào</p>
              </div>
            ) : (
              filteredDevices.map((device, index) => (
                <div key={device.id} className={styles.tableRow}>
                  <div className={styles.tableCell} style={{ width: '5%' }}>{index + 1}</div>
                  <div className={styles.tableCell} style={{ width: '25%' }}>{device.name}</div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>{device.category}</div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>{device.location}</div>
                  <div className={styles.tableCell} style={{ width: '10%' }}>{device.availableQuantity}/{device.quantity}</div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>
                    <span className={`${styles.statusTag} ${
                      device.status === 'available' ? styles.statusAvailable :
                      device.status === 'maintenance' ? styles.statusMaintenance :
                      styles.statusUnavailable
                    }`}>
                      {device.status === 'available' ? 'Khả dụng' :
                       device.status === 'maintenance' ? 'Bảo trì' : 'Không khả dụng'}
                    </span>
                  </div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>
                    {confirmDelete === device.id ? (
                      <div className={styles.deleteConfirm}>
                        <button
                          className={styles.confirmYes}
                          onClick={() => {
                            deleteDevice(device.id);
                            setConfirmDelete(null);
                          }}
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
                          className={styles.viewButton}
                          onClick={() => {
                            setCurrentDevice(device);
                            setShowDetailsModal(true);
                          }}
                          title="Xem chi tiết"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditDeviceModal(device)}
                          title="Chỉnh sửa"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => setConfirmDelete(device.id)}
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

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <Image
              src="/hcmut.png"
              alt="HCMUT Logo"
              width={24}
              height={24}
              className={styles.footerLogoImage}
            />
            <span className={styles.footerLogoText}>Trường Đại học Bách khoa - ĐHQG TPHCM</span>
          </div>
          <div className={styles.footerCopyright}>
            © {new Date().getFullYear()} - Smart Study Space Management System
          </div>
        </div>
      </footer>

      {/* Modal for adding/editing device */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{modalMode === 'add' ? 'Thêm thiết bị mới' : 'Chỉnh sửa thiết bị'}</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Tên thiết bị</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.formControl}
                  placeholder="Nhập tên thiết bị"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="category">Danh mục</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={styles.formControl}
                  >
                    {deviceCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="status">Trạng thái</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className={styles.formControl}
                  >
                    <option value="available">Khả dụng</option>
                    <option value="maintenance">Bảo trì</option>
                    <option value="unavailable">Không khả dụng</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="location">Vị trí</label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className={styles.formControl}
                >
                  {deviceLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="quantity">Tổng số lượng</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="1"
                    className={styles.formControl}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="availableQuantity">Số lượng khả dụng</label>
                  <input
                    type="number"
                    id="availableQuantity"
                    name="availableQuantity"
                    value={formData.availableQuantity}
                    onChange={handleChange}
                    required
                    min="0"
                    max={formData.quantity}
                    className={styles.formControl}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">Đường dẫn hình ảnh</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  className={styles.formControl}
                  placeholder="/equipment/your-image.jpg"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Mô tả</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={styles.formControl}
                  placeholder="Nhập mô tả chi tiết về thiết bị"
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label>Tính năng</label>
                <div className={styles.featureInputGroup}>
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className={styles.formControl}
                    placeholder="Nhập tính năng thiết bị"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className={styles.addFeatureButton}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Thêm
                  </button>
                </div>
                <div className={styles.featureList}>
                  {formData.features.map((feature, index) => (
                    <div key={index} className={styles.featureItem}>
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className={styles.removeFeatureButton}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {formData.features.length === 0 && (
                    <p className={styles.emptyFeatures}>Chưa có tính năng nào</p>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Thời gian mượn (ngày)</label>
                <div className={styles.featureInputGroup}>
                  <input
                    type="number"
                    value={borrowDurationInput}
                    onChange={(e) => setBorrowDurationInput(e.target.value)}
                    min="1"
                    className={styles.formControl}
                    placeholder="Nhập số ngày"
                  />
                  <button
                    type="button"
                    onClick={handleAddBorrowDuration}
                    className={styles.addFeatureButton}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Thêm
                  </button>
                </div>
                <div className={styles.durationList}>
                  {formData.borrowDuration.map((duration) => (
                    <div key={duration} className={styles.durationItem}>
                      <span>{duration} ngày</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBorrowDuration(duration)}
                        className={styles.removeDurationButton}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {formData.borrowDuration.length === 0 && (
                    <p className={styles.emptyDurations}>Chưa có thời gian mượn nào</p>
                  )}
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={styles.cancelButton}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  {modalMode === 'add' ? 'Thêm thiết bị' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Device Details Modal */}
      {showDetailsModal && currentDevice && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Chi tiết thiết bị</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowDetailsModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.deviceDetailSection}>
                <h4 className={styles.sectionTitle}>Thông tin cơ bản</h4>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Tên thiết bị:</span>
                  <span className={styles.detailValue}>{currentDevice.name}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Danh mục:</span>
                  <span className={styles.detailValue}>{currentDevice.category}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Vị trí:</span>
                  <span className={styles.detailValue}>{currentDevice.location}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Trạng thái:</span>
                  <span className={styles.detailValue}>
                    <span className={`${styles.statusTag} ${
                      currentDevice.status === 'available' ? styles.statusAvailable :
                      currentDevice.status === 'maintenance' ? styles.statusMaintenance :
                      styles.statusUnavailable
                    }`}>
                      {currentDevice.status === 'available' ? 'Khả dụng' :
                       currentDevice.status === 'maintenance' ? 'Bảo trì' : 'Không khả dụng'}
                    </span>
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Tổng số lượng:</span>
                  <span className={styles.detailValue}>{currentDevice.quantity}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Số lượng khả dụng:</span>
                  <span className={styles.detailValue}>{currentDevice.availableQuantity}</span>
                </div>
              </div>

              <div className={styles.deviceDetailSection}>
                <h4 className={styles.sectionTitle}>Mô tả</h4>
                <p className={styles.deviceDescription}>{currentDevice.description}</p>
              </div>

              <div className={styles.deviceDetailSection}>
                <h4 className={styles.sectionTitle}>Tính năng</h4>
                <div className={styles.tagList}>
                  {currentDevice.features.map((feature, index) => (
                    <span key={index} className={styles.tag}>{feature}</span>
                  ))}
                  {currentDevice.features.length === 0 && (
                    <p className={styles.emptyMessage}>Không có tính năng nào</p>
                  )}
                </div>
              </div>

              <div className={styles.deviceDetailSection}>
                <h4 className={styles.sectionTitle}>Thời gian mượn</h4>
                <div className={styles.tagList}>
                  {currentDevice.borrowDuration.map((duration, index) => (
                    <span key={index} className={styles.tag}>{duration} ngày</span>
                  ))}
                  {currentDevice.borrowDuration.length === 0 && (
                    <p className={styles.emptyMessage}>Không có thời gian mượn nào</p>
                  )}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowDetailsModal(false)}
                >
                  Đóng
                </button>
                <button
                  className={styles.submitButton}
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEditDeviceModal(currentDevice);
                  }}
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
