// Mock user data for testing
export const mockUsers = [
  {
    id: 'SV2021000123',
    username: 'student',
    password: 'password',
    name: 'Nguyễn Văn A',
    role: 'Sinh viên',
    email: 'student@hcmut.edu.vn',
    avatar: null
  },
  {
    id: 'GV2021000456',
    username: 'teacher',
    password: 'password',
    name: 'Trần Thị B',
    role: 'Giảng viên',
    email: 'teacher@hcmut.edu.vn',
    avatar: null
  },
  {
    id: 'AD2021000789',
    username: 'admin',
    password: 'password',
    name: 'Lê Văn C',
    role: 'Quản trị viên',
    email: 'admin@hcmut.edu.vn',
    avatar: null
  },
  {
    id: 'BQL2021000101',
    username: 'manager',
    password: 'password',
    name: 'Phạm Thị D',
    role: 'Ban quản lý',
    email: 'manager@hcmut.edu.vn',
    avatar: null
  }
];

// Mock equipment data
export const mockEquipment = [
  {
    id: 'EQ001',
    name: 'Máy chiếu Epson EB-X51',
    type: 'Máy chiếu',
    status: 'Sẵn sàng',
    location: 'Kho thiết bị H1',
    description: 'Máy chiếu độ phân giải XGA (1024 x 768), độ sáng 3800 lumens, kết nối HDMI/VGA',
    image: '/equipment/projector.jpg',
    quantity: 10,
    availableQuantity: 8
  },
  {
    id: 'EQ002',
    name: 'Laptop Dell Latitude 3520',
    type: 'Laptop',
    status: 'Sẵn sàng',
    location: 'Kho thiết bị H1',
    description: 'Laptop Intel Core i5-1135G7, RAM 8GB, SSD 256GB, màn hình 15.6 inch Full HD',
    image: '/equipment/laptop.jpg',
    quantity: 15,
    availableQuantity: 12
  },
  {
    id: 'EQ003',
    name: 'Micro không dây Shure BLX24/PG58',
    type: 'Âm thanh',
    status: 'Sẵn sàng',
    location: 'Kho thiết bị H2',
    description: 'Micro không dây với bộ thu BLX4, tần số 524-865 MHz, phạm vi hoạt động 100m',
    image: '/equipment/microphone.jpg',
    quantity: 20,
    availableQuantity: 15
  },
  {
    id: 'EQ004',
    name: 'Loa di động JBL Eon One Compact',
    type: 'Âm thanh',
    status: 'Sẵn sàng',
    location: 'Kho thiết bị H2',
    description: 'Loa di động công suất 150W, pin sạc 12 giờ, Bluetooth, mixer 4 kênh',
    image: '/equipment/speaker.jpg',
    quantity: 8,
    availableQuantity: 6
  },
  {
    id: 'EQ005',
    name: 'Máy quay Sony HXR-NX100',
    type: 'Thiết bị ghi hình',
    status: 'Sẵn sàng',
    location: 'Kho thiết bị H3',
    description: 'Máy quay chuyên nghiệp với cảm biến CMOS 1", zoom quang 12x, ghi hình 4K',
    image: '/equipment/camera.jpg',
    quantity: 5,
    availableQuantity: 3
  },
  {
    id: 'EQ006',
    name: 'Bảng điện tử thông minh Samsung Flip 2',
    type: 'Bảng tương tác',
    status: 'Sẵn sàng',
    location: 'Kho thiết bị H1',
    description: 'Bảng điện tử 55 inch, độ phân giải 4K, cảm ứng đa điểm, kết nối không dây',
    image: '/equipment/smartboard.jpg',
    quantity: 3,
    availableQuantity: 2
  },
  {
    id: 'EQ007',
    name: 'Bộ phát Wifi di động TP-Link M7350',
    type: 'Thiết bị mạng',
    status: 'Sẵn sàng',
    location: 'Kho thiết bị H2',
    description: 'Bộ phát Wifi 4G LTE, tốc độ 150Mbps, pin 2000mAh, hỗ trợ 10 thiết bị',
    image: '/equipment/wifi.jpg',
    quantity: 12,
    availableQuantity: 10
  },
  {
    id: 'EQ008',
    name: 'Máy in HP LaserJet Pro M404dn',
    type: 'Máy in',
    status: 'Sẵn sàng',
    location: 'Kho thiết bị H3',
    description: 'Máy in laser trắng đen, tốc độ 38 trang/phút, in 2 mặt tự động, kết nối mạng',
    image: '/equipment/printer.jpg',
    quantity: 6,
    availableQuantity: 5
  }
];

// Mock equipment booking data
export const mockEquipmentBookings = [
  {
    id: 'EB001',
    userId: 'SV2021000123',
    userName: 'Nguyễn Văn A',
    equipmentId: 'EQ001',
    equipmentName: 'Máy chiếu Epson EB-X51',
    quantity: 1,
    startDate: '2023-11-15T08:00:00',
    endDate: '2023-11-15T12:00:00',
    purpose: 'Thuyết trình đồ án môn học',
    status: 'Đã duyệt',
    notes: 'Sử dụng tại phòng H1-101'
  },
  {
    id: 'EB002',
    userId: 'GV2021000456',
    userName: 'Trần Thị B',
    equipmentId: 'EQ003',
    equipmentName: 'Micro không dây Shure BLX24/PG58',
    quantity: 2,
    startDate: '2023-11-16T13:00:00',
    endDate: '2023-11-16T17:00:00',
    purpose: 'Hội thảo khoa học',
    status: 'Đã duyệt',
    notes: 'Sử dụng tại hội trường B4'
  },
  {
    id: 'EB003',
    userId: 'SV2021000123',
    userName: 'Nguyễn Văn A',
    equipmentId: 'EQ002',
    equipmentName: 'Laptop Dell Latitude 3520',
    quantity: 1,
    startDate: '2023-11-17T09:00:00',
    endDate: '2023-11-17T16:00:00',
    purpose: 'Thực hành lập trình',
    status: 'Chờ duyệt',
    notes: 'Sử dụng tại phòng máy tính H6-304'
  }
];
