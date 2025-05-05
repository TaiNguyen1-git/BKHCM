'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRooms, Room } from './RoomContext';
import { useBookings, Booking } from './BookingContext';
import { useUsers } from './UserContext';
import { useDevices, Device } from './DeviceContext';

// Định nghĩa kiểu dữ liệu cho các báo cáo
export type RoomUsageReport = {
  roomId: number;
  roomName: string;
  building: string;
  totalBookings: number;
  approvedBookings: number;
  rejectedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  usageRate: number; // Tỷ lệ sử dụng (%)
};

export type UserActivityReport = {
  userId: string;
  userName: string;
  role: string;
  totalBookings: number;
  approvedBookings: number;
  rejectedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
};

export type TimeSlotUsageReport = {
  timeSlot: string;
  totalBookings: number;
  approvedBookings: number;
};

export type BuildingUsageReport = {
  building: string;
  totalRooms: number;
  totalBookings: number;
  usageRate: number; // Tỷ lệ sử dụng (%)
};

export type DailyBookingReport = {
  date: string;
  totalBookings: number;
  approvedBookings: number;
  rejectedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
};

export type DeviceUsageReport = {
  deviceId: number;
  deviceName: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  usageRate: number; // Tỷ lệ sử dụng (%)
};

// Định nghĩa kiểu dữ liệu cho ReportContext
type ReportContextType = {
  // Báo cáo sử dụng phòng
  getRoomUsageReport: (startDate?: string, endDate?: string) => RoomUsageReport[];
  getRoomUsageReportById: (roomId: number, startDate?: string, endDate?: string) => RoomUsageReport | undefined;
  
  // Báo cáo hoạt động người dùng
  getUserActivityReport: (startDate?: string, endDate?: string) => UserActivityReport[];
  getUserActivityReportById: (userId: string, startDate?: string, endDate?: string) => UserActivityReport | undefined;
  
  // Báo cáo sử dụng khung giờ
  getTimeSlotUsageReport: (startDate?: string, endDate?: string) => TimeSlotUsageReport[];
  
  // Báo cáo sử dụng tòa nhà
  getBuildingUsageReport: (startDate?: string, endDate?: string) => BuildingUsageReport[];
  
  // Báo cáo đặt phòng theo ngày
  getDailyBookingReport: (startDate?: string, endDate?: string) => DailyBookingReport[];
  
  // Báo cáo sử dụng thiết bị
  getDeviceUsageReport: () => DeviceUsageReport[];
  getDeviceUsageReportById: (deviceId: number) => DeviceUsageReport | undefined;
  
  // Xuất báo cáo
  exportReportToCSV: (reportType: string, data: any[]) => string;
};

// Tạo context
const ReportContext = createContext<ReportContextType | undefined>(undefined);

// Tạo provider component
export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const { rooms } = useRooms();
  const { bookings } = useBookings();
  const { users } = useUsers();
  const { devices } = useDevices();

  // Lọc đặt phòng theo khoảng thời gian
  const filterBookingsByDateRange = (startDate?: string, endDate?: string): Booking[] => {
    if (!startDate && !endDate) return bookings;
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      return bookingDate >= start && bookingDate <= end;
    });
  };

  // Báo cáo sử dụng phòng
  const getRoomUsageReport = (startDate?: string, endDate?: string): RoomUsageReport[] => {
    const filteredBookings = filterBookingsByDateRange(startDate, endDate);
    
    return rooms.map(room => {
      const roomBookings = filteredBookings.filter(booking => booking.roomId === room.id);
      const approvedBookings = roomBookings.filter(booking => booking.status === 'approved').length;
      const rejectedBookings = roomBookings.filter(booking => booking.status === 'rejected').length;
      const cancelledBookings = roomBookings.filter(booking => booking.status === 'cancelled').length;
      const pendingBookings = roomBookings.filter(booking => booking.status === 'pending').length;
      
      // Tính tỷ lệ sử dụng (đơn giản: số đặt phòng được duyệt / tổng số đặt phòng)
      const usageRate = roomBookings.length > 0 
        ? (approvedBookings / roomBookings.length) * 100 
        : 0;
      
      return {
        roomId: room.id,
        roomName: room.name,
        building: room.building,
        totalBookings: roomBookings.length,
        approvedBookings,
        rejectedBookings,
        cancelledBookings,
        pendingBookings,
        usageRate
      };
    });
  };

  // Báo cáo sử dụng phòng theo ID
  const getRoomUsageReportById = (roomId: number, startDate?: string, endDate?: string): RoomUsageReport | undefined => {
    const report = getRoomUsageReport(startDate, endDate);
    return report.find(item => item.roomId === roomId);
  };

  // Báo cáo hoạt động người dùng
  const getUserActivityReport = (startDate?: string, endDate?: string): UserActivityReport[] => {
    const filteredBookings = filterBookingsByDateRange(startDate, endDate);
    
    return users.map(user => {
      const userBookings = filteredBookings.filter(booking => booking.userId === user.id);
      const approvedBookings = userBookings.filter(booking => booking.status === 'approved').length;
      const rejectedBookings = userBookings.filter(booking => booking.status === 'rejected').length;
      const cancelledBookings = userBookings.filter(booking => booking.status === 'cancelled').length;
      const pendingBookings = userBookings.filter(booking => booking.status === 'pending').length;
      
      return {
        userId: user.id,
        userName: user.name,
        role: user.role,
        totalBookings: userBookings.length,
        approvedBookings,
        rejectedBookings,
        cancelledBookings,
        pendingBookings
      };
    });
  };

  // Báo cáo hoạt động người dùng theo ID
  const getUserActivityReportById = (userId: string, startDate?: string, endDate?: string): UserActivityReport | undefined => {
    const report = getUserActivityReport(startDate, endDate);
    return report.find(item => item.userId === userId);
  };

  // Báo cáo sử dụng khung giờ
  const getTimeSlotUsageReport = (startDate?: string, endDate?: string): TimeSlotUsageReport[] => {
    const filteredBookings = filterBookingsByDateRange(startDate, endDate);
    
    // Lấy danh sách các khung giờ duy nhất
    const timeSlots = Array.from(new Set(filteredBookings.map(booking => booking.timeSlot)));
    
    return timeSlots.map(timeSlot => {
      const timeSlotBookings = filteredBookings.filter(booking => booking.timeSlot === timeSlot);
      const approvedBookings = timeSlotBookings.filter(booking => booking.status === 'approved').length;
      
      return {
        timeSlot,
        totalBookings: timeSlotBookings.length,
        approvedBookings
      };
    });
  };

  // Báo cáo sử dụng tòa nhà
  const getBuildingUsageReport = (startDate?: string, endDate?: string): BuildingUsageReport[] => {
    const filteredBookings = filterBookingsByDateRange(startDate, endDate);
    
    // Lấy danh sách các tòa nhà duy nhất
    const buildings = Array.from(new Set(rooms.map(room => room.building)));
    
    return buildings.map(building => {
      const buildingRooms = rooms.filter(room => room.building === building);
      const buildingBookings = filteredBookings.filter(booking => {
        const room = rooms.find(r => r.id === booking.roomId);
        return room && room.building === building;
      });
      
      // Tính tỷ lệ sử dụng (đơn giản: số đặt phòng / (số phòng * số ngày))
      let usageRate = 0;
      if (buildingRooms.length > 0) {
        // Tính số ngày trong khoảng thời gian
        let days = 1;
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        }
        
        usageRate = (buildingBookings.length / (buildingRooms.length * days)) * 100;
      }
      
      return {
        building,
        totalRooms: buildingRooms.length,
        totalBookings: buildingBookings.length,
        usageRate
      };
    });
  };

  // Báo cáo đặt phòng theo ngày
  const getDailyBookingReport = (startDate?: string, endDate?: string): DailyBookingReport[] => {
    const filteredBookings = filterBookingsByDateRange(startDate, endDate);
    
    // Lấy danh sách các ngày duy nhất
    const dates = Array.from(new Set(filteredBookings.map(booking => booking.date)));
    
    return dates.map(date => {
      const dateBookings = filteredBookings.filter(booking => booking.date === date);
      const approvedBookings = dateBookings.filter(booking => booking.status === 'approved').length;
      const rejectedBookings = dateBookings.filter(booking => booking.status === 'rejected').length;
      const cancelledBookings = dateBookings.filter(booking => booking.status === 'cancelled').length;
      const pendingBookings = dateBookings.filter(booking => booking.status === 'pending').length;
      
      return {
        date,
        totalBookings: dateBookings.length,
        approvedBookings,
        rejectedBookings,
        cancelledBookings,
        pendingBookings
      };
    });
  };

  // Báo cáo sử dụng thiết bị
  const getDeviceUsageReport = (): DeviceUsageReport[] => {
    return devices.map(device => {
      // Tính tỷ lệ sử dụng (đơn giản: (tổng số - số khả dụng) / tổng số)
      const usageRate = device.quantity > 0 
        ? ((device.quantity - device.availableQuantity) / device.quantity) * 100 
        : 0;
      
      return {
        deviceId: device.id,
        deviceName: device.name,
        category: device.category,
        totalQuantity: device.quantity,
        availableQuantity: device.availableQuantity,
        usageRate
      };
    });
  };

  // Báo cáo sử dụng thiết bị theo ID
  const getDeviceUsageReportById = (deviceId: number): DeviceUsageReport | undefined => {
    const report = getDeviceUsageReport();
    return report.find(item => item.deviceId === deviceId);
  };

  // Xuất báo cáo sang CSV
  const exportReportToCSV = (reportType: string, data: any[]): string => {
    if (data.length === 0) return '';
    
    // Lấy tên các cột từ đối tượng đầu tiên
    const headers = Object.keys(data[0]);
    
    // Tạo dòng tiêu đề
    let csvContent = headers.join(',') + '\n';
    
    // Thêm dữ liệu
    data.forEach(item => {
      const row = headers.map(header => {
        // Xử lý các giá trị đặc biệt (chuỗi có dấu phẩy, dấu nháy kép)
        const value = item[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
      
      csvContent += row + '\n';
    });
    
    return csvContent;
  };

  return (
    <ReportContext.Provider value={{ 
      getRoomUsageReport,
      getRoomUsageReportById,
      getUserActivityReport,
      getUserActivityReportById,
      getTimeSlotUsageReport,
      getBuildingUsageReport,
      getDailyBookingReport,
      getDeviceUsageReport,
      getDeviceUsageReportById,
      exportReportToCSV
    }}>
      {children}
    </ReportContext.Provider>
  );
};

// Hook để sử dụng ReportContext
export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
