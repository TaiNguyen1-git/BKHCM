'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu cho Device
export type Device = {
  id: number;
  name: string;
  category: string;
  status: string;
  location: string;
  quantity: number;
  availableQuantity: number;
  image: string;
  description: string;
  features: string[];
  borrowDuration: number[];
};

// Dữ liệu mẫu cho các thiết bị
const initialDevicesData: Device[] = [
  {
    id: 1,
    name: 'Máy chiếu Epson EB-X51',
    category: 'Máy chiếu',
    status: 'available',
    location: 'Phòng thiết bị H1',
    quantity: 15,
    availableQuantity: 8,
    image: '/equipment/projector.jpg',
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
export const deviceCategories = ['Máy chiếu', 'Âm thanh', 'Máy tính', 'Thiết bị quay phim'];

// Dữ liệu mẫu cho các địa điểm
export const deviceLocations = ['Phòng thiết bị H1', 'Phòng thiết bị H3', 'Phòng thiết bị H6', 'Phòng thiết bị B4', 'Phòng thiết bị C5'];

// Định nghĩa kiểu dữ liệu cho DeviceContext
type DeviceContextType = {
  devices: Device[];
  addDevice: (device: Omit<Device, 'id'>) => void;
  updateDevice: (device: Device) => void;
  deleteDevice: (id: number) => void;
  getDeviceById: (id: number) => Device | undefined;
  deviceCategories: string[];
  deviceLocations: string[];
};

// Tạo context
const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

// Tạo provider component
export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>([]);

  // Khởi tạo dữ liệu từ localStorage hoặc dữ liệu mẫu
  useEffect(() => {
    const storedDevices = localStorage.getItem('devices');
    if (storedDevices) {
      setDevices(JSON.parse(storedDevices));
    } else {
      setDevices(initialDevicesData);
      localStorage.setItem('devices', JSON.stringify(initialDevicesData));
    }
  }, []);

  // Lưu dữ liệu vào localStorage khi có thay đổi
  useEffect(() => {
    if (devices.length > 0) {
      localStorage.setItem('devices', JSON.stringify(devices));
    }
  }, [devices]);

  // Thêm thiết bị mới
  const addDevice = (device: Omit<Device, 'id'>) => {
    const newId = devices.length > 0 ? Math.max(...devices.map(d => d.id)) + 1 : 1;
    const newDevice = { ...device, id: newId };
    setDevices(prevDevices => [...prevDevices, newDevice]);
  };

  // Cập nhật thông tin thiết bị
  const updateDevice = (updatedDevice: Device) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === updatedDevice.id ? updatedDevice : device
      )
    );
  };

  // Xóa thiết bị
  const deleteDevice = (id: number) => {
    setDevices(prevDevices => prevDevices.filter(device => device.id !== id));
  };

  // Lấy thông tin thiết bị theo ID
  const getDeviceById = (id: number) => {
    return devices.find(device => device.id === id);
  };

  return (
    <DeviceContext.Provider value={{ 
      devices, 
      addDevice, 
      updateDevice, 
      deleteDevice, 
      getDeviceById,
      deviceCategories,
      deviceLocations
    }}>
      {children}
    </DeviceContext.Provider>
  );
};

// Hook để sử dụng DeviceContext
export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
};
