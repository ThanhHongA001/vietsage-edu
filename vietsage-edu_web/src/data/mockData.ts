import {
  Teacher,
  Student,
  AttendanceRecord,
  DeviceHN212,
  Homework,
  CanteenMeal,
  UniformItem,
  Announcement,
  ClassScheduleItem,
  GradeEntry
} from '../types';

export const INITIAL_TEACHERS: Teacher[] = [
  // 1. Giáo viên Mầm non
  {
    id: 'tc_mn_01',
    code: 'GV-MN-01',
    fullName: 'Cô Đặng Minh Châu',
    email: 'chau.dm@vietsage.edu.vn',
    phone: '0915 234 567',
    department: 'Tổ Giáo dục Mầm non',
    schoolLevel: 'Mầm non',
    homeroomClass: 'Lá 1',
    subjects: ['Tạo hình & Âm nhạc', 'Kỹ năng sống & Vui học', 'Phát triển vận động'],
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    joinDate: '2020-08-15'
  },
  {
    id: 'tc_mn_02',
    code: 'GV-MN-02',
    fullName: 'Cô Hoàng Thu Trang',
    email: 'trang.ht@vietsage.edu.vn',
    phone: '0978 654 321',
    department: 'Tổ Giáo dục Mầm non',
    schoolLevel: 'Mầm non',
    homeroomClass: 'Chồi 2',
    subjects: ['Làm quen Chữ cái & Toán', 'Khám phá khoa học', 'Cảm thụ âm nhạc'],
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinDate: '2021-09-01'
  },

  // 2. Giáo viên THCS (Trung học cơ sở)
  {
    id: 'tc_cs_01',
    code: 'GV-CS-01',
    fullName: 'Cô Vũ Thúy Hằng',
    email: 'hang.vt@vietsage.edu.vn',
    phone: '0934 555 888',
    department: 'Tổ Xã hội THCS',
    schoolLevel: 'THCS',
    homeroomClass: '7B2',
    subjects: ['Ngữ Văn THCS', 'Lịch Sử & Địa Lý'],
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinDate: '2019-10-10'
  },
  {
    id: 'tc_cs_02',
    code: 'GV-CS-02',
    fullName: 'Thầy Phạm Quốc Toàn',
    email: 'toan.pq@vietsage.edu.vn',
    phone: '0908 112 334',
    department: 'Tổ Tự nhiên THCS',
    schoolLevel: 'THCS',
    homeroomClass: '6A1',
    subjects: ['Toán THCS', 'Khoa học Tự nhiên (KHTN)'],
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinDate: '2018-03-15'
  },

  // 3. Giáo viên THPT (Trung học phổ thông)
  {
    id: 'tc_001',
    code: 'GV-101',
    fullName: 'ThS. Nguyễn Văn Hùng',
    email: 'hung.nv@vietsage.edu.vn',
    phone: '0912 345 678',
    department: 'Tổ Toán - Tin THPT',
    schoolLevel: 'THPT',
    homeroomClass: '10A1',
    subjects: ['Toán Đại số', 'Toán Hình học'],
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinDate: '2021-08-15'
  },
  {
    id: 'tc_002',
    code: 'GV-102',
    fullName: 'Cô Trần Thị Mai',
    email: 'mai.tt@vietsage.edu.vn',
    phone: '0988 765 432',
    department: 'Tổ Ngữ Văn THPT',
    schoolLevel: 'THPT',
    homeroomClass: '11B2',
    subjects: ['Ngữ Văn'],
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    joinDate: '2020-09-01'
  },
  {
    id: 'tc_003',
    code: 'GV-103',
    fullName: 'Thầy Lê Hoàng Long',
    email: 'long.lh@vietsage.edu.vn',
    phone: '0903 112 233',
    department: 'Tổ KHTN THPT',
    schoolLevel: 'THPT',
    homeroomClass: '12A3',
    subjects: ['Vật Lý'],
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    joinDate: '2019-10-10'
  },
  {
    id: 'tc_004',
    code: 'GV-104',
    fullName: 'Cô Phạm Hải Yến',
    email: 'yen.ph@vietsage.edu.vn',
    phone: '0977 445 566',
    department: 'Tổ Ngoại Ngữ Liên Cấp',
    schoolLevel: 'Toàn trường',
    homeroomClass: '10A2',
    subjects: ['Tiếng Anh Quốc Tế'],
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinDate: '2022-03-01'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  // --- CẤP 1: MẦM NON (Preschool - Độ tuổi 3-5 tuổi) ---
  {
    id: 'hs_mn_001',
    code: 'VS-MN-001',
    fullName: 'Nguyễn Bảo An (Bé Bo)',
    dob: '2021-04-10',
    gender: 'Nam',
    className: 'Lá 1',
    schoolLevel: 'Mầm non',
    homeroomTeacher: 'Cô Đặng Minh Châu',
    parentName: 'Nguyễn Quốc Anh',
    parentPhone: '0912 888 777',
    address: 'Số 15 Vạn Phúc, Ba Đình, Hà Nội',
    status: 'STUDYING',
    avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
    canteenRegistered: true,
    preschoolProfile: {
      heightCm: 112,
      weightKg: 19.5,
      allergies: 'Không dị ứng',
      favoriteActivity: 'Vẽ tranh sắc màu, lắp ráp lego khối lớn',
      healthStatus: 'Tốt'
    }
  },
  {
    id: 'hs_mn_002',
    code: 'VS-MN-002',
    fullName: 'Trần Tuệ Mẫn (Bé Bông)',
    dob: '2021-09-18',
    gender: 'Nữ',
    className: 'Lá 1',
    schoolLevel: 'Mầm non',
    homeroomTeacher: 'Cô Đặng Minh Châu',
    parentName: 'Trần Thu Thủy',
    parentPhone: '0988 222 111',
    address: 'Toà R2 Royal City, Thanh Xuân, Hà Nội',
    status: 'STUDYING',
    avatar: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&auto=format&fit=crop&q=80',
    canteenRegistered: true,
    preschoolProfile: {
      heightCm: 108,
      weightKg: 18.0,
      allergies: 'Dị ứng nhẹ với đậu phộng',
      favoriteActivity: 'Kể chuyện theo tranh, múa hát mầm non',
      healthStatus: 'Tốt'
    }
  },
  {
    id: 'hs_mn_003',
    code: 'VS-MN-003',
    fullName: 'Lê Gia Khang (Bé Ken)',
    dob: '2022-02-15',
    gender: 'Nam',
    className: 'Chồi 2',
    schoolLevel: 'Mầm non',
    homeroomTeacher: 'Cô Hoàng Thu Trang',
    parentName: 'Lê Quang Huy',
    parentPhone: '0904 333 444',
    address: 'Số 28 Liễu Giai, Ba Đình, Hà Nội',
    status: 'STUDYING',
    avatar: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=150&auto=format&fit=crop&q=80',
    canteenRegistered: true,
    preschoolProfile: {
      heightCm: 102,
      weightKg: 16.5,
      allergies: 'Không dị ứng',
      favoriteActivity: 'Tập bơi bóng nước, nhận biết màu sắc con vật',
      healthStatus: 'Tốt'
    }
  },

  // --- CẤP 2: TRUNG HỌC CƠ SỞ (THCS - Khối 6, 7, 8, 9) ---
  {
    id: 'hs_cs_001',
    code: 'VS-CS-001',
    fullName: 'Nguyễn Thị Mai',
    dob: '2014-11-20',
    gender: 'Nữ',
    className: '7B2',
    schoolLevel: 'THCS',
    homeroomTeacher: 'Cô Vũ Thúy Hằng',
    parentName: 'Nguyễn Thị Lan',
    parentPhone: '0912 345 678',
    address: 'Tòa Park 2 Times City, Hai Bà Trưng, Hà Nội',
    status: 'STUDYING',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    canteenRegistered: true
  },
  {
    id: 'hs_cs_002',
    code: 'VS-CS-002',
    fullName: 'Hoàng Minh Trí',
    dob: '2015-05-12',
    gender: 'Nam',
    className: '6A1',
    schoolLevel: 'THCS',
    homeroomTeacher: 'Thầy Phạm Quốc Toàn',
    parentName: 'Hoàng Văn Hưng',
    parentPhone: '0936 123 789',
    address: 'Số 91 Nguyễn Chí Thanh, Đống Đa, Hà Nội',
    status: 'STUDYING',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    canteenRegistered: true
  },
  {
    id: 'hs_cs_003',
    code: 'VS-CS-003',
    fullName: 'Bùi Phương Linh',
    dob: '2013-08-04',
    gender: 'Nữ',
    className: '8A1',
    schoolLevel: 'THCS',
    homeroomTeacher: 'Cô Vũ Thúy Hằng',
    parentName: 'Bùi Quốc Trọng',
    parentPhone: '0945 666 777',
    address: 'Số 14 Thụy Khuê, Tây Hồ, Hà Nội',
    status: 'STUDYING',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    canteenRegistered: true
  },

  // --- CẤP 3: TRUNG HỌC PHỔ THÔNG (THPT - Khối 10, 11, 12) ---
  {
    id: 'hs_001',
    code: 'VS-2026-001',
    fullName: 'Nguyễn Minh Quân',
    dob: '2010-04-12',
    gender: 'Nam',
    className: '10A1',
    schoolLevel: 'THPT',
    homeroomTeacher: 'ThS. Nguyễn Văn Hùng',
    parentName: 'Nguyễn Văn Thành',
    parentPhone: '0912 999 111',
    address: 'Số 45 Cầu Giấy, Hà Nội',
    status: 'STUDYING',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    canteenRegistered: true
  },
  {
    id: 'hs_002',
    code: 'VS-2026-002',
    fullName: 'Lê Thảo My',
    dob: '2010-08-25',
    gender: 'Nữ',
    className: '10A1',
    schoolLevel: 'THPT',
    homeroomTeacher: 'ThS. Nguyễn Văn Hùng',
    parentName: 'Lê Hoàng Hải',
    parentPhone: '0913 222 333',
    address: 'Số 12 Kim Mã, Ba Đình, Hà Nội',
    status: 'STUDYING',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    canteenRegistered: true
  },
  {
    id: 'hs_003',
    code: 'VS-2026-003',
    fullName: 'Trần Gia Bảo',
    dob: '2010-02-18',
    gender: 'Nam',
    className: '10A1',
    schoolLevel: 'THPT',
    homeroomTeacher: 'ThS. Nguyễn Văn Hùng',
    parentName: 'Trần Quốc Đạt',
    parentPhone: '0982 777 888',
    address: 'Số 88 Trần Duy Hưng, Hà Nội',
    status: 'STUDYING',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    canteenRegistered: false
  },
  {
    id: 'hs_004',
    code: 'VS-2026-004',
    fullName: 'Vũ Ngọc Ánh',
    dob: '2010-11-05',
    gender: 'Nữ',
    className: '10A1',
    schoolLevel: 'THPT',
    homeroomTeacher: 'ThS. Nguyễn Văn Hùng',
    parentName: 'Vũ Đình Trọng',
    parentPhone: '0973 456 123',
    address: 'Số 29 Lạc Long Quân, Tây Hồ, Hà Nội',
    status: 'STUDYING',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    canteenRegistered: true
  },
  {
    id: 'hs_005',
    code: 'VS-2026-005',
    fullName: 'Phạm Đức Huy',
    dob: '2010-06-30',
    gender: 'Nam',
    className: '10A1',
    schoolLevel: 'THPT',
    homeroomTeacher: 'ThS. Nguyễn Văn Hùng',
    parentName: 'Phạm Văn Nam',
    parentPhone: '0944 555 666',
    address: 'Số 102 Hoàng Hoa Thám, Hà Nội',
    status: 'STUDYING',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    canteenRegistered: true
  },
  {
    id: 'hs_006',
    code: 'VS-2026-006',
    fullName: 'Hoàng Yến Nhi',
    dob: '2009-09-14',
    gender: 'Nữ',
    className: '11B2',
    schoolLevel: 'THPT',
    homeroomTeacher: 'Cô Trần Thị Mai',
    parentName: 'Hoàng Anh Tuấn',
    parentPhone: '0966 888 999',
    address: 'Số 55 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    status: 'STUDYING',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    canteenRegistered: false
  }
];

export const INITIAL_DEVICES_HN212: DeviceHN212[] = [
  {
    id: 'dev_01',
    deviceCode: 'HN212-GATE-A',
    name: 'Máy Nhận Diện Cổng Chính A (THPT)',
    location: 'Cổng chính - Phân khu THPT (Khuôn mặt & Thẻ NFC)',
    ipAddress: '192.168.1.101',
    status: 'ONLINE',
    lastSeenAt: '2026-10-18 19:15:32',
    totalScansToday: 428
  },
  {
    id: 'dev_02',
    deviceCode: 'HN212-GATE-B',
    name: 'Máy Nhận Diện Cổng B (THCS)',
    location: 'Cổng phân khu THCS & Sân bóng cỏ nhân tạo',
    ipAddress: '192.168.1.102',
    status: 'ONLINE',
    lastSeenAt: '2026-10-18 19:14:10',
    totalScansToday: 215
  },
  {
    id: 'dev_03',
    deviceCode: 'HN212-PRESCHOOL',
    name: 'Máy Điểm Danh Cổng Mầm Non (Kids Gate)',
    location: 'Sảnh đón trả trẻ Mầm non VietSage Kids',
    ipAddress: '192.168.1.103',
    status: 'ONLINE',
    lastSeenAt: '2026-10-18 19:18:22',
    totalScansToday: 180
  },
  {
    id: 'dev_04',
    deviceCode: 'HN212-CANTEEN',
    name: 'Máy Check-in Nhà Ăn Bán Trú',
    location: 'Cửa vào nhà ăn tầng 1',
    ipAddress: '192.168.1.105',
    status: 'ONLINE',
    lastSeenAt: '2026-10-18 19:10:04',
    totalScansToday: 350
  },
  {
    id: 'dev_05',
    deviceCode: 'HN212-STAFF',
    name: 'Máy Chấm Công Văn Phòng Giáo Viên',
    location: 'Tầng 2 - Tòa hiệu bộ liên cấp',
    ipAddress: '192.168.1.110',
    status: 'ONLINE',
    lastSeenAt: '2026-10-18 19:05:45',
    totalScansToday: 58
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Mầm non check-in
  {
    id: 'att_mn_01',
    studentId: 'hs_mn_001',
    studentCode: 'VS-MN-001',
    studentName: 'Nguyễn Bảo An (Bé Bo)',
    className: 'Lá 1',
    date: '2026-10-18',
    status: 'PRESENT',
    checkInTime: '07:35:10',
    checkOutTime: '16:45:00',
    method: 'FACE',
    note: 'Bố Nguyễn Quốc Anh đưa đón tận sảnh, nhiệt độ 36.6°C',
    deviceId: 'dev_03',
    deviceName: 'HN212 Cổng Mầm Non'
  },
  {
    id: 'att_mn_02',
    studentId: 'hs_mn_002',
    studentCode: 'VS-MN-002',
    studentName: 'Trần Tuệ Mẫn (Bé Bông)',
    className: 'Lá 1',
    date: '2026-10-18',
    status: 'PRESENT',
    checkInTime: '07:40:22',
    checkOutTime: '16:50:12',
    method: 'FACE',
    note: 'Mẹ đưa đến, mang theo bình sữa và áo ấm nhẹ',
    deviceId: 'dev_03',
    deviceName: 'HN212 Cổng Mầm Non'
  },

  // THCS check-in
  {
    id: 'att_cs_01',
    studentId: 'hs_cs_001',
    studentCode: 'VS-CS-001',
    studentName: 'Nguyễn Thị Mai',
    className: '7B2',
    date: '2026-10-18',
    status: 'PRESENT',
    checkInTime: '07:10:05',
    checkOutTime: '16:55:00',
    method: 'CARD',
    deviceId: 'dev_02',
    deviceName: 'HN212 Cổng B (THCS)'
  },
  {
    id: 'att_cs_02',
    studentId: 'hs_cs_002',
    studentCode: 'VS-CS-002',
    studentName: 'Hoàng Minh Trí',
    className: '6A1',
    date: '2026-10-18',
    status: 'PRESENT',
    checkInTime: '07:02:18',
    checkOutTime: '17:00:10',
    method: 'FACE',
    deviceId: 'dev_02',
    deviceName: 'HN212 Cổng B (THCS)'
  },

  // THPT check-in
  {
    id: 'att_001',
    studentId: 'hs_001',
    studentCode: 'VS-2026-001',
    studentName: 'Nguyễn Minh Quân',
    className: '10A1',
    date: '2026-10-18',
    status: 'PRESENT',
    checkInTime: '06:58:12',
    checkOutTime: '17:02:40',
    method: 'FACE',
    deviceId: 'dev_01',
    deviceName: 'HN212 Cổng Chính A (THPT)'
  },
  {
    id: 'att_002',
    studentId: 'hs_002',
    studentCode: 'VS-2026-002',
    studentName: 'Lê Thảo My',
    className: '10A1',
    date: '2026-10-18',
    status: 'PRESENT',
    checkInTime: '07:05:43',
    checkOutTime: '17:00:15',
    method: 'FACE',
    deviceId: 'dev_01',
    deviceName: 'HN212 Cổng Chính A (THPT)'
  },
  {
    id: 'att_003',
    studentId: 'hs_003',
    studentCode: 'VS-2026-003',
    studentName: 'Trần Gia Bảo',
    className: '10A1',
    date: '2026-10-18',
    status: 'LATE',
    checkInTime: '07:22:10',
    checkOutTime: '16:55:00',
    method: 'FACE',
    note: 'Đi muộn 22 phút do kẹt xe',
    deviceId: 'dev_01',
    deviceName: 'HN212 Cổng Chính A (THPT)'
  },
  {
    id: 'att_004',
    studentId: 'hs_004',
    studentCode: 'VS-2026-004',
    studentName: 'Vũ Ngọc Ánh',
    className: '10A1',
    date: '2026-10-18',
    status: 'PRESENT',
    checkInTime: '06:52:19',
    checkOutTime: '17:05:30',
    method: 'FACE',
    deviceId: 'dev_01',
    deviceName: 'HN212 Cổng Chính A (THPT)'
  },
  {
    id: 'att_005',
    studentId: 'hs_005',
    studentCode: 'VS-2026-005',
    studentName: 'Phạm Đức Huy',
    className: '10A1',
    date: '2026-10-18',
    status: 'EXCUSED',
    method: 'MANUAL',
    note: 'Phụ huynh xin phép nghỉ khám bệnh'
  }
];

export const INITIAL_HOMEWORKS: Homework[] = [
  // 1. Nhiệm vụ mầm non (Hoạt động cùng bé tại nhà)
  {
    id: 'hw_mn_01',
    title: 'Bé quan sát và gấp giấy Origami con thỏ ngộ nghĩnh',
    subject: 'Tạo hình & Âm nhạc',
    className: 'Lá 1',
    teacherId: 'tc_mn_01',
    teacherName: 'Cô Đặng Minh Châu',
    assignedDate: '2026-10-17',
    dueDate: '2026-10-22 20:00',
    description: 'Bố mẹ hướng dẫn bé gấp tai thỏ theo video hướng dẫn, bé tự dùng bút màu vẽ mắt mũi cho chú thỏ. Chụp ảnh sản phẩm của bé nộp lên app nhé!',
    attachments: ['Huong_dan_gap_tho_origami.pdf'],
    totalStudents: 25,
    submittedCount: 22,
    gradedCount: 20,
    submissions: []
  },

  // 2. Bài tập THCS
  {
    id: 'hw_cs_01',
    title: 'Viết đoạn văn cảm nhận về bài thơ "Đồng dao mùa xuân"',
    subject: 'Ngữ Văn THCS',
    className: '7B2',
    teacherId: 'tc_cs_01',
    teacherName: 'Cô Vũ Thúy Hằng',
    assignedDate: '2026-10-16',
    dueDate: '2026-10-21 22:00',
    description: 'Học sinh viết đoạn văn từ 150 - 200 chữ nêu cảm nghĩ về người lính trẻ trong bài thơ Đồng dao mùa xuân của nhà thơ Nguyễn Khoa Điềm.',
    attachments: ['Dan_y_Dong_dao_mua_xuan.docx'],
    totalStudents: 36,
    submittedCount: 30,
    gradedCount: 25,
    submissions: []
  },

  // 3. Bài tập THPT
  {
    id: 'hw_01',
    title: 'Bài tập Đại số: Bất phương trình bậc hai một ẩn',
    subject: 'Toán Đại số',
    className: '10A1',
    teacherId: 'tc_001',
    teacherName: 'ThS. Nguyễn Văn Hùng',
    assignedDate: '2026-10-16',
    dueDate: '2026-10-20 23:59',
    description: 'Học sinh hoàn thành bài tập 1 đến 5 trang 42 SGK Toán 10 Chân Trời Sáng Tạo. Trình bày chi tiết các bước xét dấu tam thức bậc hai.',
    attachments: ['Bai_tap_Bat_phuong_trinh_T10.pdf'],
    totalStudents: 38,
    submittedCount: 32,
    gradedCount: 20,
    submissions: [
      {
        id: 'sub_001',
        studentId: 'hs_001',
        studentName: 'Nguyễn Minh Quân',
        studentCode: 'VS-2026-001',
        submittedAt: '2026-10-17 18:30:15',
        status: 'GRADED',
        content: 'Em đã hoàn thành bài tập 1, 2, 3, 4, 5. Đã vẽ bảng xét dấu và kết luận tập nghiệm từng câu ạ.',
        fileUrls: ['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'],
        score: 9.5,
        feedback: 'Bài giải rất chuẩn xác, lập luận chặt chẽ, chữ viết rõ ràng!',
        gradedAt: '2026-10-17 21:00:00'
      },
      {
        id: 'sub_002',
        studentId: 'hs_002',
        studentName: 'Lê Thảo My',
        studentCode: 'VS-2026-002',
        submittedAt: '2026-10-17 20:15:00',
        status: 'GRADED',
        content: 'Dạ em gửi thầy bài tập Đại số chương 3.',
        fileUrls: ['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'],
        score: 8.5,
        feedback: 'Bài 3c còn nhầm dấu nghiệm kép, chú ý ôn lại điều kiện nghiệm delta.',
        gradedAt: '2026-10-17 21:15:00'
      }
    ]
  },
  {
    id: 'hw_02',
    title: 'Hình học Oxyz: Tích vô hướng của hai vectơ',
    subject: 'Toán Hình học',
    className: '10A1',
    teacherId: 'tc_001',
    teacherName: 'ThS. Nguyễn Văn Hùng',
    assignedDate: '2026-10-15',
    dueDate: '2026-10-19 18:00',
    description: 'Tính góc giữa hai vectơ và chứng minh hai đường thẳng vuông góc. Áp dụng công thức toạ độ.',
    attachments: ['Chuyen_de_Vecto_Hinh_Hoc.pdf'],
    totalStudents: 38,
    submittedCount: 28,
    gradedCount: 15,
    submissions: []
  }
];

export const INITIAL_SCHEDULE: ClassScheduleItem[] = [
  // --- THỜI KHÓA BIỂU / LỊCH SINH HOẠT MẦM NON (LỚP LÁ 1) ---
  { id: 'sch_mn_1', dayOfWeek: 2, period: 1, timeRange: '07:30 - 08:15', subject: 'Đón trẻ & Thể dục sáng mầm non', className: 'Lá 1', room: 'Sảnh Lá 1', teacherName: 'Cô Đặng Minh Châu', schoolLevel: 'Mầm non' },
  { id: 'sch_mn_2', dayOfWeek: 2, period: 2, timeRange: '08:20 - 09:00', subject: 'Bé làm quen Chữ cái & Kể chuyện', className: 'Lá 1', room: 'Phòng Lá 1', teacherName: 'Cô Đặng Minh Châu', schoolLevel: 'Mầm non' },
  { id: 'sch_mn_3', dayOfWeek: 2, period: 3, timeRange: '09:15 - 10:15', subject: 'Hoạt động góc & Khám phá thiên nhiên', className: 'Lá 1', room: 'Vườn sinh thái', teacherName: 'Cô Hoàng Thu Trang', schoolLevel: 'Mầm non' },
  { id: 'sch_mn_4', dayOfWeek: 2, period: 4, timeRange: '10:30 - 11:30', subject: 'Vệ sinh cá nhân & Ăn trưa bán trú', className: 'Lá 1', room: 'Phòng Ăn Mầm Non', teacherName: 'Cô Đặng Minh Châu', schoolLevel: 'Mầm non' },
  { id: 'sch_mn_5', dayOfWeek: 2, period: 5, timeRange: '14:00 - 15:00', subject: 'Ăn xế chiều & Tạo hình sắc màu', className: 'Lá 1', room: 'Phòng Nghệ Thuật Kids', teacherName: 'Cô Đặng Minh Châu', schoolLevel: 'Mầm non' },

  // --- THỜI KHÓA BIỂU THCS (LỚP 7B2) ---
  { id: 'sch_cs_1', dayOfWeek: 2, period: 1, timeRange: '07:15 - 08:00', subject: 'Chào cờ đầu tuần liên cấp', className: '7B2', room: 'Sân trường', teacherName: 'Ban Giám Hiệu', schoolLevel: 'THCS' },
  { id: 'sch_cs_2', dayOfWeek: 2, period: 2, timeRange: '08:05 - 08:50', subject: 'Ngữ Văn THCS', className: '7B2', room: 'Phòng 201 (Khu CS)', teacherName: 'Cô Vũ Thúy Hằng', schoolLevel: 'THCS' },
  { id: 'sch_cs_3', dayOfWeek: 2, period: 3, timeRange: '09:05 - 09:50', subject: 'Khoa học Tự nhiên', className: '7B2', room: 'Lab KHTN 2', teacherName: 'Thầy Phạm Quốc Toàn', schoolLevel: 'THCS' },
  { id: 'sch_cs_4', dayOfWeek: 2, period: 4, timeRange: '09:55 - 10:40', subject: 'Tiếng Anh THCS', className: '7B2', room: 'Phòng 201 (Khu CS)', teacherName: 'Cô Phạm Hải Yến', schoolLevel: 'THCS' },
  { id: 'sch_cs_5', dayOfWeek: 2, period: 5, timeRange: '10:45 - 11:30', subject: 'Lịch Sử & Địa Lý', className: '7B2', room: 'Phòng 201 (Khu CS)', teacherName: 'Cô Vũ Thúy Hằng', schoolLevel: 'THCS' },

  // --- THỜI KHÓA BIỂU THPT (LỚP 10A1) ---
  { id: 'sch_1', dayOfWeek: 2, period: 1, timeRange: '07:15 - 08:00', subject: 'Chào cờ đầu tuần liên cấp', className: 'Toàn trường', room: 'Sân trường', teacherName: 'Ban Giám Hiệu', schoolLevel: 'THPT' },
  { id: 'sch_2', dayOfWeek: 2, period: 2, timeRange: '08:05 - 08:50', subject: 'Toán Đại số', className: '10A1', room: 'Phòng 301', teacherName: 'ThS. Nguyễn Văn Hùng', schoolLevel: 'THPT' },
  { id: 'sch_3', dayOfWeek: 2, period: 3, timeRange: '09:05 - 09:50', subject: 'Toán Hình học', className: '10A1', room: 'Phòng 301', teacherName: 'ThS. Nguyễn Văn Hùng', schoolLevel: 'THPT' },
  { id: 'sch_4', dayOfWeek: 2, period: 4, timeRange: '09:55 - 10:40', subject: 'Vật Lý', className: '10A1', room: 'Phòng 301', teacherName: 'Thầy Lê Hoàng Long', schoolLevel: 'THPT' },
  { id: 'sch_5', dayOfWeek: 2, period: 5, timeRange: '10:45 - 11:30', subject: 'Tiếng Anh Quốc Tế', className: '10A1', room: 'Phòng 301', teacherName: 'Cô Phạm Hải Yến', schoolLevel: 'THPT' },

  { id: 'sch_6', dayOfWeek: 3, period: 1, timeRange: '07:15 - 08:00', subject: 'Toán Đại số', className: '10A2', room: 'Phòng 302', teacherName: 'ThS. Nguyễn Văn Hùng', schoolLevel: 'THPT' },
  { id: 'sch_7', dayOfWeek: 3, period: 2, timeRange: '08:05 - 08:50', subject: 'Toán Đại số', className: '10A2', room: 'Phòng 302', teacherName: 'ThS. Nguyễn Văn Hùng', schoolLevel: 'THPT' },
  { id: 'sch_8', dayOfWeek: 3, period: 3, timeRange: '09:05 - 09:50', subject: 'Ngữ Văn', className: '10A1', room: 'Phòng 301', teacherName: 'Cô Trần Thị Mai', schoolLevel: 'THPT' },
  { id: 'sch_9', dayOfWeek: 3, period: 4, timeRange: '09:55 - 10:40', subject: 'Hóa Học', className: '10A1', room: 'Lab Hóa 1', teacherName: 'Cô Trần Thị Mai', schoolLevel: 'THPT' },

  { id: 'sch_10', dayOfWeek: 4, period: 1, timeRange: '07:15 - 08:00', subject: 'Sinh Hoạt Lớp 10A1', className: '10A1', room: 'Phòng 301', teacherName: 'ThS. Nguyễn Văn Hùng', schoolLevel: 'THPT' },
  { id: 'sch_11', dayOfWeek: 4, period: 2, timeRange: '08:05 - 08:50', subject: 'Toán Hình học', className: '10A1', room: 'Phòng 301', teacherName: 'ThS. Nguyễn Văn Hùng', schoolLevel: 'THPT' },
  { id: 'sch_12', dayOfWeek: 4, period: 3, timeRange: '09:05 - 09:50', subject: 'Lịch Sử', className: '10A1', room: 'Phòng 301', teacherName: 'Cô Trần Thị Mai', schoolLevel: 'THPT' },

  { id: 'sch_13', dayOfWeek: 5, period: 2, timeRange: '08:05 - 08:50', subject: 'Toán Đại số', className: '10A1', room: 'Phòng 301', teacherName: 'ThS. Nguyễn Văn Hùng', schoolLevel: 'THPT' },
  { id: 'sch_14', dayOfWeek: 5, period: 3, timeRange: '09:05 - 09:50', subject: 'Tin Học', className: '10A1', room: 'Phòng Máy 2', teacherName: 'ThS. Nguyễn Văn Hùng', schoolLevel: 'THPT' },

  { id: 'sch_15', dayOfWeek: 6, period: 1, timeRange: '07:15 - 08:00', subject: 'Toán Ôn tập', className: '10A1', room: 'Phòng 301', teacherName: 'ThS. Nguyễn Văn Hùng', schoolLevel: 'THPT' },
  { id: 'sch_16', dayOfWeek: 6, period: 4, timeRange: '09:55 - 10:40', subject: 'Sinh Hoạt Cuối Tuần', className: '10A1', room: 'Phòng 301', teacherName: 'ThS. Nguyễn Văn Hùng', schoolLevel: 'THPT' }
];

export const INITIAL_GRADES: GradeEntry[] = [
  // 1. Đánh giá phát triển Mầm non (Bé mẫu giáo)
  {
    studentId: 'hs_mn_001',
    studentCode: 'VS-MN-001',
    studentName: 'Nguyễn Bảo An (Bé Bo)',
    className: 'Lá 1',
    schoolLevel: 'Mầm non',
    preschoolEvaluation: {
      physicalDevelopment: 'Vượt trội',
      cognitiveDevelopment: 'Đạt',
      languageDevelopment: 'Vượt trội',
      socialEmotionalDevelopment: 'Đạt',
      aestheticDevelopment: 'Vượt trội',
      mealsAndSleep: 'Ăn hết suất ngon miệng, ngủ đủ giấc 2 tiếng trưa',
      generalComment: 'Bé thông minh, lễ phép, nói lưu loát, rất thích vẽ tranh và phụ cô xếp đồ chơi.',
      isWellBehaved: true
    }
  },
  {
    studentId: 'hs_mn_002',
    studentCode: 'VS-MN-002',
    studentName: 'Trần Tuệ Mẫn (Bé Bông)',
    className: 'Lá 1',
    schoolLevel: 'Mầm non',
    preschoolEvaluation: {
      physicalDevelopment: 'Đạt',
      cognitiveDevelopment: 'Vượt trội',
      languageDevelopment: 'Vượt trội',
      socialEmotionalDevelopment: 'Đạt',
      aestheticDevelopment: 'Đạt',
      mealsAndSleep: 'Ăn ngoan, thích uống sữa tươi tiệt trùng, ngủ ngoan',
      generalComment: 'Bé nhớ mặt chữ cái rất nhanh, biểu cảm múa hát tự tin và hòa đồng cùng các bạn.',
      isWellBehaved: true
    }
  },

  // 2. Điểm học bạ THCS (Lớp 7B2)
  {
    studentId: 'hs_cs_001',
    studentCode: 'VS-CS-001',
    studentName: 'Nguyễn Thị Mai',
    className: '7B2',
    schoolLevel: 'THCS',
    scoreOral1: 9.5,
    scoreOral2: 9.0,
    score15m1: 9.5,
    score15m2: 9.0,
    score1Period: 9.0,
    scoreMidTerm: 9.5,
    scoreFinal: 9.5,
    averageScore: 9.4
  },
  {
    studentId: 'hs_cs_002',
    studentCode: 'VS-CS-002',
    studentName: 'Hoàng Minh Trí',
    className: '6A1',
    schoolLevel: 'THCS',
    scoreOral1: 8.5,
    scoreOral2: 8.0,
    score15m1: 8.5,
    score15m2: 8.5,
    score1Period: 8.0,
    scoreMidTerm: 8.8,
    scoreFinal: 8.5,
    averageScore: 8.4
  },

  // 3. Điểm học bạ THPT (Lớp 10A1)
  {
    studentId: 'hs_001',
    studentCode: 'VS-2026-001',
    studentName: 'Nguyễn Minh Quân',
    className: '10A1',
    schoolLevel: 'THPT',
    scoreOral1: 9.0,
    scoreOral2: 10,
    score15m1: 9.5,
    score15m2: 9.0,
    score1Period: 9.0,
    scoreMidTerm: 9.2,
    scoreFinal: 9.5,
    averageScore: 9.3
  },
  {
    studentId: 'hs_002',
    studentCode: 'VS-2026-002',
    studentName: 'Lê Thảo My',
    className: '10A1',
    schoolLevel: 'THPT',
    scoreOral1: 8.5,
    scoreOral2: 9.0,
    score15m1: 8.5,
    score15m2: 8.0,
    score1Period: 8.5,
    scoreMidTerm: 8.8,
    scoreFinal: 8.5,
    averageScore: 8.6
  },
  {
    studentId: 'hs_003',
    studentCode: 'VS-2026-003',
    studentName: 'Trần Gia Bảo',
    className: '10A1',
    schoolLevel: 'THPT',
    scoreOral1: 7.0,
    scoreOral2: 7.5,
    score15m1: 7.0,
    score15m2: 8.0,
    score1Period: 7.5,
    scoreMidTerm: 7.5,
    scoreFinal: 8.0,
    averageScore: 7.6
  },
  {
    studentId: 'hs_004',
    studentCode: 'VS-2026-004',
    studentName: 'Vũ Ngọc Ánh',
    className: '10A1',
    schoolLevel: 'THPT',
    scoreOral1: 9.5,
    scoreOral2: 9.0,
    score15m1: 10,
    score15m2: 9.5,
    score1Period: 9.0,
    scoreMidTerm: 9.5,
    scoreFinal: 9.5,
    averageScore: 9.5
  },
  {
    studentId: 'hs_005',
    studentCode: 'VS-2026-005',
    studentName: 'Phạm Đức Huy',
    className: '10A1',
    schoolLevel: 'THPT',
    scoreOral1: 7.5,
    scoreOral2: 8.0,
    score15m1: 7.5,
    score15m2: 7.0,
    score1Period: 7.5,
    scoreMidTerm: 7.0,
    scoreFinal: 7.5,
    averageScore: 7.4
  },
  {
    studentId: 'hs_006',
    studentCode: 'VS-2026-006',
    studentName: 'Hoàng Yến Nhi',
    className: '10A1',
    schoolLevel: 'THPT',
    scoreOral1: 8.5,
    scoreOral2: 8.5,
    score15m1: 8.0,
    score15m2: 8.5,
    score1Period: 8.0,
    scoreMidTerm: 8.5,
    scoreFinal: 8.5,
    averageScore: 8.4
  }
];

export const INITIAL_CANTEEN_MENU: CanteenMeal[] = [
  {
    id: 'meal_1',
    date: '2026-10-19',
    dayOfWeek: 'Thứ Hai',
    mainDish: 'Thịt kho trứng cút & Tôm rim thịt ba chỉ',
    sideDish: 'Đậu phụ sốt cà chua',
    soup: 'Canh cải ngọt nấu thịt băm',
    dessert: 'Dưa hấu Long An',
    nutritionKcal: 680,
    preschoolMenu: {
      morningSnack: 'Cháo sườn non cà rốt hạt sen',
      lunchMain: 'Cơm nát mềm, thịt nạc heo băm rim trứng cút, súp bí đỏ',
      afternoonSnack: 'Sữa chua hạt óc chó & Bánh flan mềm',
      milkType: 'Sữa tươi thanh trùng TH True Milk 180ml'
    }
  },
  {
    id: 'meal_2',
    date: '2026-10-20',
    dayOfWeek: 'Thứ Ba',
    mainDish: 'Gà chiên mắm bơ tỏi & Cá thu sốt cà',
    sideDish: 'Bắp cải xào nấm',
    soup: 'Canh bí đỏ hầm xương heo',
    dessert: 'Sữa chua men sống Betagen',
    nutritionKcal: 720,
    preschoolMenu: {
      morningSnack: 'Súp gà xé nấm hương ngô ngọt',
      lunchMain: 'Cơm mềm, ức gà sốt teriyaki xay nhỏ, canh rau ngót thịt nạc',
      afternoonSnack: 'Bánh bông lan trứng muối mềm & chuối ngự',
      milkType: 'Sữa chua uống men sống tiệt trùng'
    }
  },
  {
    id: 'meal_3',
    date: '2026-10-21',
    dayOfWeek: 'Thứ Tư',
    mainDish: 'Bò xào lúc lắc & Sườn non chua ngọt',
    sideDish: 'Khoai tây nghiền phô mai',
    soup: 'Canh rong biển đậu non thịt nạc',
    dessert: 'Chuối ngự tráng miệng',
    nutritionKcal: 750,
    preschoolMenu: {
      morningSnack: 'Cháo bò băm bí ngô phô mai',
      lunchMain: 'Cơm dẻo thơm, bò lúc lắc thái mỏng mềm, canh rong biển đậu hũ',
      afternoonSnack: 'Chè đậu xanh hạt sen cốt dừa',
      milkType: 'Sữa chua dinh dưỡng Probi'
    }
  },
  {
    id: 'meal_4',
    date: '2026-10-22',
    dayOfWeek: 'Thứ Năm',
    mainDish: 'Thịt ba rọi nướng sả & Chả lụa rim tiêu',
    sideDish: 'Rau muống xào tỏi giòn',
    soup: 'Canh cua đồng mồng tơi mướp hương',
    dessert: 'Thanh long ruột đỏ',
    nutritionKcal: 710,
    preschoolMenu: {
      morningSnack: 'Phở bò mềm nước hầm xương ống',
      lunchMain: 'Chả cá thác lác hấp thì là, canh mồng tơi cua đồng giã tay',
      afternoonSnack: 'Bánh su kem vani & Nước ép cam tươi',
      milkType: 'Sữa hạt dinh dưỡng Macca óc chó'
    }
  },
  {
    id: 'meal_5',
    date: '2026-10-23',
    dayOfWeek: 'Thứ Sáu',
    mainDish: 'Cơm gà xối mỡ & Trứng ốp la thơm lừng',
    sideDish: 'Xà lách trộn dầu giấm chua ngọt',
    soup: 'Canh chua cá lăng nấu dọc mùng',
    dessert: 'Chè sen hạt long nhãn',
    nutritionKcal: 740,
    preschoolMenu: {
      morningSnack: 'Bánh mì sandwich bơ đậu phộng & mứt dâu',
      lunchMain: 'Cơm gà xé phay mềm ngọt, canh bí xanh tôm khô tươi',
      afternoonSnack: 'Caramen cốt dừa & Quả thanh long cắt miếng',
      milkType: 'Sữa tươi Vinamilk Organic'
    }
  }
];

export const INITIAL_UNIFORMS: UniformItem[] = [
  // --- ĐỒNG PHỤC CẤP MẦM NON ---
  {
    id: 'uni_mn_01',
    code: 'UF-MN-01',
    name: 'Bộ Cộc Tay Mầm Non VietSage Kids (Áo polo + Quần đùi/Váy)',
    category: 'Bộ mầm non',
    gradeGroup: 'Mầm non',
    price: 135000,
    inStock: 150,
    sizes: ['Số 2 (3 tuổi)', 'Số 3 (4 tuổi)', 'Số 4 (5 tuổi)'],
    imageUrl: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni_mn_02',
    code: 'UF-MN-02',
    name: 'Ba Lô Mầm Non Chống Gù Hình Thú VietSage',
    category: 'Ba lô / Phụ kiện',
    gradeGroup: 'Mầm non',
    price: 185000,
    inStock: 90,
    sizes: ['Tiêu chuẩn'],
    imageUrl: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni_mn_03',
    code: 'UF-MN-03',
    name: 'Mũ Tai Bèo Vải Cotton Chống Nắng Bé Mầm Non',
    category: 'Ba lô / Phụ kiện',
    gradeGroup: 'Mầm non',
    price: 55000,
    inStock: 200,
    sizes: ['Freesize'],
    imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=300&auto=format&fit=crop&q=80'
  },

  // --- ĐỒNG PHỤC CẤP THCS ---
  {
    id: 'uni_cs_01',
    code: 'UF-CS-01',
    name: 'Áo Polo Học Sinh THCS VietSage (Cổ phối sọc navy)',
    category: 'Áo sơ mi',
    gradeGroup: 'THCS',
    price: 155000,
    inStock: 160,
    sizes: ['XS', 'S', 'M', 'L'],
    imageUrl: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni_cs_02',
    code: 'UF-CS-02',
    name: 'Chân Váy Xếp Ly / Quần Short Tây THCS',
    category: 'Quần tây / Váy',
    gradeGroup: 'THCS',
    price: 175000,
    inStock: 110,
    sizes: ['26', '27', '28', '29', '30'],
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni_cs_03',
    code: 'UF-CS-03',
    name: 'Bộ Quần Áo Thể Thao Năng Động THCS',
    category: 'Áo thể dục',
    gradeGroup: 'THCS',
    price: 195000,
    inStock: 220,
    sizes: ['S', 'M', 'L'],
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&auto=format&fit=crop&q=80'
  },

  // --- ĐỒNG PHỤC CẤP THPT ---
  {
    id: 'uni_01',
    code: 'UF-SM-01',
    name: 'Áo Sơ Mi Trắng Tay Dài Thêu Logo VietSage THPT',
    category: 'Áo sơ mi',
    gradeGroup: 'THPT',
    price: 165000,
    inStock: 180,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni_02',
    code: 'UF-QT-01',
    name: 'Quần Tây Xanh Navy Cao Cấp Nam THPT',
    category: 'Quần tây / Váy',
    gradeGroup: 'THPT',
    price: 195000,
    inStock: 120,
    sizes: ['28', '29', '30', '31', '32'],
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni_03',
    code: 'UF-VY-01',
    name: 'Váy Xếp Ly Kẻ Caro Nữ Sinh THPT',
    category: 'Quần tây / Váy',
    gradeGroup: 'THPT',
    price: 185000,
    inStock: 95,
    sizes: ['S', 'M', 'L'],
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni_04',
    code: 'UF-TD-01',
    name: 'Bộ Thể Dục VietSage Sport Pro THPT',
    category: 'Áo thể dục',
    gradeGroup: 'THPT',
    price: 220000,
    inStock: 250,
    sizes: ['S', 'M', 'L', 'XL'],
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'uni_05',
    code: 'UF-KG-01',
    name: 'Áo Khoác Gió Mùa Đông 2 Lớp Chống Nước Toàn Trường',
    category: 'Áo khoác gió',
    gradeGroup: 'THPT',
    price: 290000,
    inStock: 140,
    sizes: ['M', 'L', 'XL', '2XL'],
    imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=300&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_01',
    title: 'Thông báo triển khai hệ thống điểm danh nhận diện khuôn mặt HN212 cho 3 cấp học',
    content: 'Ban Giám Hiệu nhà trường xin thông báo: Từ tuần học này, toàn bộ 3 phân khu trường học (Mầm non Kids, Phân khu THCS và Khối THPT) đã kích hoạt đồng bộ hệ thống camera nhận diện AI HN212. Khi trẻ và học sinh bước qua cổng, hệ thống tự động ghi nhận và gửi thông báo tức thời tới phụ huynh.',
    author: 'Ban Giám Hiệu',
    category: 'TOÀN TRƯỜNG',
    targetAudience: 'Toàn thể Giáo viên, Học sinh và Phụ huynh Mầm non - THCS - THPT',
    createdAt: '2026-10-18 08:00',
    priority: 'HIGH'
  },
  {
    id: 'ann_02',
    title: 'Kế hoạch kiểm tra định kỳ học kỳ I (THCS, THPT) & Ngày hội Bé vui khỏe (Mầm non)',
    content: 'Nhà trường công bố lịch thi giữa kỳ 1 cho khối THCS & THPT từ ngày 25/10/2026. Riêng cấp Mầm non, nhà trường tổ chức tuần lễ ngày hội Bé vui khỏe trải nghiệm vận động và thẩm mỹ tại sân cỏ trường.',
    author: 'Phòng Đào Tạo & Quản Lý Học Vụ',
    category: 'PHỤ HUYNH',
    targetAudience: 'Phụ huynh và Học sinh 3 cấp',
    createdAt: '2026-10-17 15:30',
    priority: 'NORMAL'
  },
  {
    id: 'ann_03',
    title: 'Họp Hội đồng Sư phạm tháng 10 liên cấp Mầm non - THCS - THPT',
    content: 'Kính mời quý thầy cô giáo các tổ bộ môn (Tổ Mầm non, Tổ Tự nhiên THCS, Tổ Xã hội THCS, Tổ Toán - Tin THPT, Tổ KHTN THPT, Tổ Ngoại ngữ) tham dự phiên họp đánh giá giữa kỳ vào 14h00 thứ Sáu tại Hội trường A.',
    author: 'Hiệu trưởng - ThS. Lê Văn Đức',
    category: 'GIÁO VIÊN',
    targetAudience: 'Toàn thể Cán bộ Giáo viên 3 cấp học',
    createdAt: '2026-10-16 09:15',
    priority: 'NORMAL'
  }
];
