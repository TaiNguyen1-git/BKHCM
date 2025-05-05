'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRooms, Room } from '@/app/context/RoomContext';
import AdminLayout from '@/app/admin/components/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import styles from './rooms.module.css';

export default function RoomManagement() {
  const { user, logout, isLoading } = useAuth();
  const { rooms, addRoom, updateRoom, deleteRoom, buildings, roomTypes } = useRooms();

  // UI state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form state
  const [formData, setFormData] = useState<Omit<Room, 'id'> & { id?: number }>({
    name: '',
    capacity: 0,
    building: '',
    floor: 1,
    type: '',
    status: 'available',
    equipment: [],
    availableTimeSlots: []
  });

  // Equipment and time slot state for form
  const [newEquipment, setNewEquipment] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');

  // Refs for input fields
  const equipmentInputRef = useRef<HTMLInputElement>(null);
  const timeSlotInputRef = useRef<HTMLInputElement>(null);

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

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'capacity' || name === 'floor') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle adding equipment
  const handleAddEquipment = () => {
    if (newEquipment.trim()) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()]
      }));
      setNewEquipment('');

      // Focus lại vào input sau khi thêm
      setTimeout(() => {
        if (equipmentInputRef.current) {
          equipmentInputRef.current.focus();
        }
      }, 0);
    }
  };

  // Handle removing equipment
  const handleRemoveEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));

    // Focus lại vào input sau khi xóa
    setTimeout(() => {
      if (equipmentInputRef.current) {
        equipmentInputRef.current.focus();
      }
    }, 0);
  };

  // Handle adding time slot
  const handleAddTimeSlot = () => {
    if (newTimeSlot.trim()) {
      setFormData(prev => ({
        ...prev,
        availableTimeSlots: [...prev.availableTimeSlots, newTimeSlot.trim()]
      }));
      setNewTimeSlot('');

      // Focus lại vào input sau khi thêm
      setTimeout(() => {
        if (timeSlotInputRef.current) {
          timeSlotInputRef.current.focus();
        }
      }, 0);
    }
  };

  // Handle removing time slot
  const handleRemoveTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availableTimeSlots: prev.availableTimeSlots.filter((_, i) => i !== index)
    }));

    // Focus lại vào input sau khi xóa
    setTimeout(() => {
      if (timeSlotInputRef.current) {
        timeSlotInputRef.current.focus();
      }
    }, 0);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === 'add') {
      addRoom(formData);
    } else if (modalMode === 'edit' && formData.id !== undefined) {
      updateRoom(formData as Room);
    }

    setShowModal(false);
  };

  // Filter rooms based on search term and filters
  const filteredRooms = rooms.filter(room => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBuilding = buildingFilter ? room.building === buildingFilter : true;
    const matchesType = typeFilter ? room.type === typeFilter : true;
    const matchesStatus = statusFilter ? room.status === statusFilter : true;

    return matchesSearch && matchesBuilding && matchesType && matchesStatus;
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
    <>
      <AdminLayout requiredPermission="admin.rooms">
        <div className={styles.roomManagementContainer}>

      {/* Main content */}
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <div className={styles.breadcrumbs}>
            <Link href="/admin" className={styles.breadcrumbLink}>
              Trang chủ Admin
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>Quản lý phòng học</span>
          </div>
          <h1 className={styles.pageTitle}>Quản lý phòng học</h1>
        </div>

        <div className={styles.roomManagementControls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Tìm kiếm phòng học..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className={styles.addRoomButton} onClick={() => {
            setModalMode('add');
            setFormData({
              name: '',
              capacity: 0,
              building: buildings[0],
              floor: 1,
              type: roomTypes[0],
              status: 'available',
              equipment: [],
              availableTimeSlots: []
            });
            setShowModal(true);
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm phòng học
          </button>
        </div>

        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Tòa nhà</label>
            <select
              className={styles.filterSelect}
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              {buildings.map(building => (
                <option key={building} value={building}>{building}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Loại phòng</label>
            <select
              className={styles.filterSelect}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              {roomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
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
              <option value="available">Có sẵn</option>
              <option value="booked">Đã đặt</option>
              <option value="maintenance">Bảo trì</option>
            </select>
          </div>
        </div>

        <div className={styles.roomTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderCell} style={{ width: '5%' }}>STT</div>
            <div className={styles.tableHeaderCell} style={{ width: '20%' }}>Tên phòng</div>
            <div className={styles.tableHeaderCell} style={{ width: '10%' }}>Tòa nhà</div>
            <div className={styles.tableHeaderCell} style={{ width: '10%' }}>Tầng</div>
            <div className={styles.tableHeaderCell} style={{ width: '10%' }}>Sức chứa</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Loại phòng</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Trạng thái</div>
            <div className={styles.tableHeaderCell} style={{ width: '15%' }}>Thao tác</div>
          </div>

          <div className={styles.tableBody}>
            {filteredRooms.length === 0 ? (
              <div className={styles.noResults}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.noResultsIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Không tìm thấy phòng học nào</p>
              </div>
            ) : (
              filteredRooms.map((room, index) => (
                <div key={room.id} className={styles.tableRow}>
                  <div className={styles.tableCell} style={{ width: '5%' }}>{index + 1}</div>
                  <div className={styles.tableCell} style={{ width: '20%' }}>{room.name}</div>
                  <div className={styles.tableCell} style={{ width: '10%' }}>{room.building}</div>
                  <div className={styles.tableCell} style={{ width: '10%' }}>{room.floor}</div>
                  <div className={styles.tableCell} style={{ width: '10%' }}>{room.capacity}</div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>{room.type}</div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>
                    <span className={`${styles.statusTag} ${
                      room.status === 'available' ? styles.statusAvailable :
                      room.status === 'booked' ? styles.statusBooked :
                      styles.statusMaintenance
                    }`}>
                      {room.status === 'available' ? 'Có sẵn' :
                       room.status === 'booked' ? 'Đã đặt' : 'Bảo trì'}
                    </span>
                  </div>
                  <div className={styles.tableCell} style={{ width: '15%' }}>
                    {confirmDelete === room.id ? (
                      <div className={styles.deleteConfirm}>
                        <button
                          className={styles.confirmYes}
                          onClick={() => {
                            deleteRoom(room.id);
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
                            setCurrentRoom(room);
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
                          onClick={() => {
                            setModalMode('edit');
                            setCurrentRoom(room);
                            setFormData({
                              id: room.id,
                              name: room.name,
                              capacity: room.capacity,
                              building: room.building,
                              floor: room.floor,
                              type: room.type,
                              status: room.status,
                              equipment: [...room.equipment],
                              availableTimeSlots: [...room.availableTimeSlots]
                            });
                            setShowModal(true);
                          }}
                          title="Chỉnh sửa"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => setConfirmDelete(room.id)}
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

      {/* Modal thêm/sửa phòng học */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{modalMode === 'add' ? 'Thêm phòng học mới' : 'Chỉnh sửa phòng học'}</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.roomForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Tên phòng</label>
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
                  <label htmlFor="building">Tòa nhà</label>
                  <select
                    id="building"
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                    required
                  >
                    {buildings.map(building => (
                      <option key={building} value={building}>{building}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="floor">Tầng</label>
                  <input
                    type="number"
                    id="floor"
                    name="floor"
                    min="1"
                    value={formData.floor}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="capacity">Sức chứa</label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="type">Loại phòng</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="status">Trạng thái</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="available">Có sẵn</option>
                  <option value="booked">Đã đặt</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </div>

              <div className={styles.equipmentSection}>
                <div className={styles.equipmentHeader}>
                  <span className={styles.equipmentTitle}>Thiết bị</span>
                  <div className={styles.equipmentItem}>
                    <input
                      type="text"
                      className={styles.equipmentInput}
                      placeholder="Thêm thiết bị..."
                      value={newEquipment}
                      onChange={(e) => setNewEquipment(e.target.value)}
                      ref={equipmentInputRef}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddEquipment();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className={styles.addEquipmentButton}
                      onClick={handleAddEquipment}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Thêm
                    </button>
                  </div>
                </div>

                {formData.equipment.map((item, index) => (
                  <div key={index} className={styles.equipmentItem}>
                    <input
                      type="text"
                      className={styles.equipmentInput}
                      value={item}
                      onChange={(e) => {
                        const newEquipment = [...formData.equipment];
                        newEquipment[index] = e.target.value;
                        setFormData(prev => ({ ...prev, equipment: newEquipment }));
                      }}
                    />
                    <button
                      type="button"
                      className={styles.removeEquipmentButton}
                      onClick={() => handleRemoveEquipment(index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.timeSlotSection}>
                <div className={styles.timeSlotHeader}>
                  <span className={styles.timeSlotTitle}>Khung giờ có sẵn</span>
                  <div className={styles.timeSlotItem}>
                    <input
                      type="text"
                      className={styles.timeSlotInput}
                      placeholder="Thêm khung giờ (VD: 07:00 - 09:00)..."
                      value={newTimeSlot}
                      onChange={(e) => setNewTimeSlot(e.target.value)}
                      ref={timeSlotInputRef}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTimeSlot();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className={styles.addTimeSlotButton}
                      onClick={handleAddTimeSlot}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Thêm
                    </button>
                  </div>
                </div>

                {formData.availableTimeSlots.map((slot, index) => (
                  <div key={index} className={styles.timeSlotItem}>
                    <input
                      type="text"
                      className={styles.timeSlotInput}
                      value={slot}
                      onChange={(e) => {
                        const newTimeSlots = [...formData.availableTimeSlots];
                        newTimeSlots[index] = e.target.value;
                        setFormData(prev => ({ ...prev, availableTimeSlots: newTimeSlots }));
                      }}
                    />
                    <button
                      type="button"
                      className={styles.removeTimeSlotButton}
                      onClick={() => handleRemoveTimeSlot(index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
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
                  {modalMode === 'add' ? 'Thêm phòng học' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết phòng học */}
      {showDetailsModal && currentRoom && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Chi tiết phòng học</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowDetailsModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconMedium} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={styles.roomDetails}>
              <div className={styles.detailsSection}>
                <h3 className={styles.detailsTitle}>Thông tin cơ bản</h3>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Tên phòng:</span>
                  <span className={styles.detailsValue}>{currentRoom.name}</span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Tòa nhà:</span>
                  <span className={styles.detailsValue}>{currentRoom.building}</span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Tầng:</span>
                  <span className={styles.detailsValue}>{currentRoom.floor}</span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Sức chứa:</span>
                  <span className={styles.detailsValue}>{currentRoom.capacity} người</span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Loại phòng:</span>
                  <span className={styles.detailsValue}>{currentRoom.type}</span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Trạng thái:</span>
                  <span className={styles.detailsValue}>
                    <span className={`${styles.statusTag} ${
                      currentRoom.status === 'available' ? styles.statusAvailable :
                      currentRoom.status === 'booked' ? styles.statusBooked :
                      styles.statusMaintenance
                    }`}>
                      {currentRoom.status === 'available' ? 'Có sẵn' :
                       currentRoom.status === 'booked' ? 'Đã đặt' : 'Bảo trì'}
                    </span>
                  </span>
                </div>
              </div>

              <div className={styles.detailsSection}>
                <h3 className={styles.detailsTitle}>Thiết bị</h3>
                {currentRoom.equipment.length === 0 ? (
                  <p>Không có thiết bị nào</p>
                ) : (
                  <div className={styles.equipmentDetailsList}>
                    {currentRoom.equipment.map((item, index) => (
                      <span key={index} className={styles.equipmentTag}>{item}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.detailsSection}>
                <h3 className={styles.detailsTitle}>Khung giờ có sẵn</h3>
                {currentRoom.availableTimeSlots.length === 0 ? (
                  <p>Không có khung giờ nào</p>
                ) : (
                  <div className={styles.timeSlotDetailsList}>
                    {currentRoom.availableTimeSlots.map((slot, index) => (
                      <span key={index} className={styles.equipmentTag}>{slot}</span>
                    ))}
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
                <button
                  type="button"
                  className={styles.submitButton}
                  onClick={() => {
                    setShowDetailsModal(false);
                    setModalMode('edit');
                    setFormData({
                      id: currentRoom.id,
                      name: currentRoom.name,
                      capacity: currentRoom.capacity,
                      building: currentRoom.building,
                      floor: currentRoom.floor,
                      type: currentRoom.type,
                      status: currentRoom.status,
                      equipment: [...currentRoom.equipment],
                      availableTimeSlots: [...currentRoom.availableTimeSlots]
                    });
                    setShowModal(true);
                  }}
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
