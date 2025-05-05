'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu cho Room
export type Room = {
  id: number;
  name: string;
  capacity: number;
  building: string;
  floor: number;
  type: string;
  status: string;
  equipment: string[];
  availableTimeSlots: string[];
};

// Dữ liệu mẫu cho các phòng
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
export const buildings = ['H1', 'H2', 'H3', 'H6', 'B4', 'C5'];

// Dữ liệu mẫu cho các loại phòng
export const roomTypes = ['Phòng học', 'Phòng thực hành', 'Phòng họp', 'Phòng seminar', 'Phòng làm việc nhóm'];

// Định nghĩa kiểu dữ liệu cho RoomContext
type RoomContextType = {
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: number) => void;
  getRoomById: (id: number) => Room | undefined;
  buildings: string[];
  roomTypes: string[];
};

// Tạo context
const RoomContext = createContext<RoomContextType | undefined>(undefined);

// Tạo provider component
export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>([]);

  // Khởi tạo dữ liệu từ localStorage hoặc dữ liệu mẫu
  useEffect(() => {
    const storedRooms = localStorage.getItem('rooms');
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    } else {
      setRooms(initialRoomsData);
      localStorage.setItem('rooms', JSON.stringify(initialRoomsData));
    }
  }, []);

  // Lưu dữ liệu vào localStorage khi có thay đổi
  useEffect(() => {
    if (rooms.length > 0) {
      localStorage.setItem('rooms', JSON.stringify(rooms));
    }
  }, [rooms]);

  // Thêm phòng mới
  const addRoom = (room: Omit<Room, 'id'>) => {
    const newId = rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1;
    const newRoom = { ...room, id: newId };
    setRooms(prevRooms => [...prevRooms, newRoom]);
  };

  // Cập nhật thông tin phòng
  const updateRoom = (updatedRoom: Room) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === updatedRoom.id ? updatedRoom : room
      )
    );
  };

  // Xóa phòng
  const deleteRoom = (id: number) => {
    setRooms(prevRooms => prevRooms.filter(room => room.id !== id));
  };

  // Lấy thông tin phòng theo ID
  const getRoomById = (id: number) => {
    return rooms.find(room => room.id === id);
  };

  return (
    <RoomContext.Provider value={{ 
      rooms, 
      addRoom, 
      updateRoom, 
      deleteRoom, 
      getRoomById,
      buildings,
      roomTypes
    }}>
      {children}
    </RoomContext.Provider>
  );
};

// Hook để sử dụng RoomContext
export const useRooms = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRooms must be used within a RoomProvider');
  }
  return context;
};
