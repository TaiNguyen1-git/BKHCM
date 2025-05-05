'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRooms, Room } from './RoomContext';
import { useUsers } from './UserContext';

// Định nghĩa kiểu dữ liệu cho Booking
export type Booking = {
  id: string;
  roomId: number;
  userId: string;
  date: string;
  timeSlot: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  notes?: string;
};

// Dữ liệu mẫu cho các đặt phòng
const initialBookingsData: Booking[] = [
  {
    id: 'BK001',
    roomId: 1,
    userId: 'SV001',
    date: '2023-12-15',
    timeSlot: '07:00 - 09:00',
    purpose: 'Học nhóm môn Lập trình Web',
    status: 'approved',
    createdAt: '2023-12-10T08:30:00Z',
    updatedAt: '2023-12-11T10:15:00Z'
  },
  {
    id: 'BK002',
    roomId: 2,
    userId: 'GV001',
    date: '2023-12-16',
    timeSlot: '13:00 - 15:00',
    purpose: 'Buổi hướng dẫn đồ án',
    status: 'approved',
    createdAt: '2023-12-10T09:45:00Z',
    updatedAt: '2023-12-11T11:20:00Z'
  },
  {
    id: 'BK003',
    roomId: 3,
    userId: 'SV002',
    date: '2023-12-17',
    timeSlot: '09:00 - 11:00',
    purpose: 'Thảo luận nhóm',
    status: 'pending',
    createdAt: '2023-12-11T14:20:00Z',
    updatedAt: '2023-12-11T14:20:00Z'
  },
  {
    id: 'BK004',
    roomId: 4,
    userId: 'SV003',
    date: '2023-12-18',
    timeSlot: '15:00 - 17:00',
    purpose: 'Seminar khoa học',
    status: 'pending',
    createdAt: '2023-12-12T10:30:00Z',
    updatedAt: '2023-12-12T10:30:00Z'
  },
  {
    id: 'BK005',
    roomId: 5,
    userId: 'GV002',
    date: '2023-12-19',
    timeSlot: '07:00 - 09:00',
    purpose: 'Họp khoa',
    status: 'rejected',
    createdAt: '2023-12-12T11:45:00Z',
    updatedAt: '2023-12-13T09:10:00Z',
    notes: 'Phòng đã được đặt trước'
  },
  {
    id: 'BK006',
    roomId: 1,
    userId: 'SV004',
    date: '2023-12-20',
    timeSlot: '13:00 - 15:00',
    purpose: 'Ôn thi cuối kỳ',
    status: 'cancelled',
    createdAt: '2023-12-13T15:20:00Z',
    updatedAt: '2023-12-14T08:45:00Z',
    notes: 'Người dùng hủy đặt phòng'
  }
];

// Định nghĩa kiểu dữ liệu cho BookingContext
type BookingContextType = {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;
  getBookingById: (id: string) => Booking | undefined;
  approveBooking: (id: string, notes?: string) => void;
  rejectBooking: (id: string, notes: string) => void;
  cancelBooking: (id: string, notes?: string) => void;
  getBookingsByRoomId: (roomId: number) => Booking[];
  getBookingsByUserId: (userId: string) => Booking[];
  getBookingsByDate: (date: string) => Booking[];
  getBookingsByStatus: (status: Booking['status']) => Booking[];
};

// Tạo context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Tạo provider component
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { rooms } = useRooms();
  const { users } = useUsers();

  // Khởi tạo dữ liệu từ localStorage hoặc dữ liệu mẫu
  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    } else {
      setBookings(initialBookingsData);
      localStorage.setItem('bookings', JSON.stringify(initialBookingsData));
    }
  }, []);

  // Lưu dữ liệu vào localStorage khi có thay đổi
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

  // Thêm đặt phòng mới
  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newId = `BK${String(bookings.length + 1).padStart(3, '0')}`;
    
    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      createdAt: now,
      updatedAt: now
    };
    
    setBookings(prevBookings => [...prevBookings, newBooking]);
  };

  // Cập nhật thông tin đặt phòng
  const updateBooking = (updatedBooking: Booking) => {
    const now = new Date().toISOString();
    
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === updatedBooking.id 
          ? { ...updatedBooking, updatedAt: now } 
          : booking
      )
    );
  };

  // Xóa đặt phòng
  const deleteBooking = (id: string) => {
    setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));
  };

  // Lấy thông tin đặt phòng theo ID
  const getBookingById = (id: string) => {
    return bookings.find(booking => booking.id === id);
  };

  // Phê duyệt đặt phòng
  const approveBooking = (id: string, notes?: string) => {
    const now = new Date().toISOString();
    
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === id 
          ? { 
              ...booking, 
              status: 'approved', 
              updatedAt: now,
              notes: notes || booking.notes
            } 
          : booking
      )
    );
  };

  // Từ chối đặt phòng
  const rejectBooking = (id: string, notes: string) => {
    const now = new Date().toISOString();
    
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === id 
          ? { 
              ...booking, 
              status: 'rejected', 
              updatedAt: now,
              notes
            } 
          : booking
      )
    );
  };

  // Hủy đặt phòng
  const cancelBooking = (id: string, notes?: string) => {
    const now = new Date().toISOString();
    
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === id 
          ? { 
              ...booking, 
              status: 'cancelled', 
              updatedAt: now,
              notes: notes || booking.notes
            } 
          : booking
      )
    );
  };

  // Lấy danh sách đặt phòng theo roomId
  const getBookingsByRoomId = (roomId: number) => {
    return bookings.filter(booking => booking.roomId === roomId);
  };

  // Lấy danh sách đặt phòng theo userId
  const getBookingsByUserId = (userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  // Lấy danh sách đặt phòng theo ngày
  const getBookingsByDate = (date: string) => {
    return bookings.filter(booking => booking.date === date);
  };

  // Lấy danh sách đặt phòng theo trạng thái
  const getBookingsByStatus = (status: Booking['status']) => {
    return bookings.filter(booking => booking.status === status);
  };

  return (
    <BookingContext.Provider value={{ 
      bookings, 
      addBooking, 
      updateBooking, 
      deleteBooking, 
      getBookingById,
      approveBooking,
      rejectBooking,
      cancelBooking,
      getBookingsByRoomId,
      getBookingsByUserId,
      getBookingsByDate,
      getBookingsByStatus
    }}>
      {children}
    </BookingContext.Provider>
  );
};

// Hook để sử dụng BookingContext
export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
