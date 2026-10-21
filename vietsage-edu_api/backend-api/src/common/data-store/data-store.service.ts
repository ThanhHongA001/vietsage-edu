import { Injectable } from '@nestjs/common';

export interface TeacherEntity {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  schoolLevel?: 'Mầm non' | 'THCS' | 'THPT';
  homeroomClass?: string;
  subjects: string[];
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  avatar: string;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentEntity {
  id: string;
  code: string;
  fullName: string;
  dob: string;
  gender: string;
  schoolLevel?: 'Mầm non' | 'THCS' | 'THPT';
  className: string;
  homeroomTeacher: string;
  parentName: string;
  parentPhone: string;
  address: string;
  status: string;
  avatar: string;
  canteenRegistered: boolean;
  preschoolProfile?: {
    heightCm?: number;
    weightKg?: number;
    allergies?: string;
    napRoutine?: string;
    favoriteActivities?: string;
    healthStatus?: 'Tốt' | 'Cần theo dõi' | 'Đang ốm nhẹ';
  };
  createdAt: string;
  updatedAt: string;
}

export interface DeviceEntity {
  id: string;
  deviceCode: string;
  name: string;
  location: string;
  ipAddress: string;
  status: string;
  isActive: boolean;
  lastSeenAt: string;
  totalScansToday: number;
  createdAt: string;
}

export interface AttendanceEntity {
  id: string;
  eventId: string;
  userId?: string;
  studentId?: string;
  studentCode?: string;
  studentName?: string;
  className?: string;
  deviceId?: string;
  deviceName?: string;
  date: string;
  occurredAt: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
  method: string;
  direction?: string;
  note?: string;
  rawPayload?: any;
  createdAt: string;
}

export interface LeaveRequestEntity {
  id: string;
  studentId?: string;
  studentName: string;
  className: string;
  startDate: string;
  endDate: string;
  reason: string;
  phone: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleEntity {
  id: string;
  dayOfWeek: number;
  period: number;
  timeRange: string;
  subject: string;
  className: string;
  room: string;
  teacherName: string;
  createdAt: string;
}

export interface GradeEntity {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  className: string;
  subject: string;
  semester: string;
  scoreOral1?: number;
  scoreOral2?: number;
  score15m1?: number;
  score15m2?: number;
  score1Period?: number;
  scoreMidTerm?: number;
  scoreFinal?: number;
  averageScore?: number;
  preschoolEvaluation?: {
    physical: string;
    cognitive: string;
    language: string;
    socialEmotional: string;
    aesthetic: string;
    generalComment: string;
    weeklyStar: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HomeworkSubmissionEntity {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  submittedAt: string;
  status: string;
  content?: string;
  fileUrls?: string[];
  score?: number;
  feedback?: string;
  gradedAt?: string;
}

export interface HomeworkEntity {
  id: string;
  title: string;
  subject: string;
  className: string;
  teacherId?: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  attachments?: string[];
  isUrgent?: boolean;
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
  submissions: HomeworkSubmissionEntity[];
  createdAt: string;
  updatedAt: string;
}

export interface CanteenMealEntity {
  id: string;
  dayId: string;
  date: string;
  dayOfWeek: string;
  level?: 'Mầm non' | 'THCS' | 'THPT' | 'Toàn trường';
  mainDish: string;
  sideDish: string;
  soup: string;
  dessert: string;
  nutritionKcal: number;
  specialNote?: string;
  preschoolMenu?: {
    morningSnack: string;
    lunchSoft: string;
    afternoonSnack: string;
    milkFormula: string;
  };
  items?: any;
  createdAt: string;
  updatedAt: string;
}

export interface UniformItemEntity {
  id: string;
  code: string;
  name: string;
  category: string;
  gradeGroup: string;
  price: number;
  inStock: number;
  sizes: string[];
  imageUrl: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UniformOrderEntity {
  id: string;
  orderCode: string;
  orderDate: string;
  status: string;
  items: any[];
  totalAmount: number;
  studentName: string;
  studentClass: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventEntity {
  id: string;
  title: string;
  date: string;
  location: string;
  tag: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementEntity {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  targetAudience: string;
  priority: string;
  imageUrl?: string;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserEntity {
  id: string;
  username?: string;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
  password?: string;
  studentId?: string;
  studentName?: string;
  studentClass?: string;
}

@Injectable()
export class DataStoreService {
  users: UserEntity[] = [];
  teachers: TeacherEntity[] = [];
  students: StudentEntity[] = [];
  devices: DeviceEntity[] = [];
  attendance: AttendanceEntity[] = [];
  leaveRequests: LeaveRequestEntity[] = [];
  schedules: ScheduleEntity[] = [];
  grades: GradeEntity[] = [];
  homeworks: HomeworkEntity[] = [];
  canteenMeals: CanteenMealEntity[] = [];
  canteenRegistrations: any[] = [];
  uniformItems: UniformItemEntity[] = [];
  uniformOrders: UniformOrderEntity[] = [];
  events: EventEntity[] = [];
  announcements: AnnouncementEntity[] = [];
  settings: Record<string, any> = {};

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData(): void {
    const now = new Date().toISOString();

    // Tài khoản người dùng hệ thống (Auth Users)
    this.users = [
      {
        id: 'usr_admin_01',
        username: 'admin',
        email: 'admin@vietsage.edu.vn',
        fullName: 'Quản Trị Viên Hệ Thống',
        role: 'ADMIN',
        phone: '0900000001',
        password: 'AdminPassword_123!',
      },
      {
        id: 'usr_parent_crush001',
        username: 'crush001',
        email: 'crush001@vietsage.edu.vn',
        fullName: 'Phụ Huynh Học Sinh (crush001)',
        role: 'PARENT',
        phone: '0988001001',
        password: '500anhem',
        studentId: 'hs_001',
        studentName: 'Nguyễn Minh Quân',
        studentClass: '10A1',
      },
      {
        id: 'usr_parent_01',
        username: '0988123456',
        email: '0988123456@vietsage.edu.vn',
        fullName: 'Phụ huynh học sinh (Nguyễn Văn An)',
        role: 'PARENT',
        phone: '0988123456',
        password: '12345678',
        studentId: 'hs_001',
        studentName: 'Nguyễn Minh Quân',
        studentClass: '10A1',
      },
      {
        id: 'usr_teacher_01',
        username: 'chaudm',
        email: 'chaudm@vietsage.edu.vn',
        fullName: 'Cô Đặng Minh Châu',
        role: 'TEACHER',
        phone: '0901 123 456',
        password: '12345678',
      },
      {
        id: 'usr_teacher_02',
        username: 'hangvt',
        email: 'hangvt@vietsage.edu.vn',
        fullName: 'Cô Vũ Thúy Hằng',
        role: 'TEACHER',
        phone: '0912 345 678',
        password: '12345678',
      },
      {
        id: 'usr_teacher_03',
        username: 'hungnv',
        email: 'hungnv@vietsage.edu.vn',
        fullName: 'ThS. Nguyễn Văn Hùng',
        role: 'TEACHER',
        phone: '0903 456 789',
        password: '12345678',
      },
    ];

    // Teachers
    this.teachers = [
      // --- Cấp Mầm Non ---
      {
        id: 'tc_mn_001',
        code: 'GV-MN01',
        fullName: 'Cô Đặng Minh Châu',
        email: 'chaudm@vietsage.edu.vn',
        phone: '0901 123 456',
        department: 'Khối Mầm Non',
        schoolLevel: 'Mầm non',
        homeroomClass: 'Lá 1',
        subjects: ['Phát triển Kỹ năng', 'Tạo hình & Âm nhạc Mầm non'],
        status: 'ACTIVE',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        joinDate: '2021-08-15',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'tc_mn_002',
        code: 'GV-MN02',
        fullName: 'Cô Hoàng Thu Trang',
        email: 'tranght@vietsage.edu.vn',
        phone: '0902 234 567',
        department: 'Khối Mầm Non',
        schoolLevel: 'Mầm non',
        homeroomClass: 'Chồi 2',
        subjects: ['Vận động Thể chất Mầm non', 'Phát triển Ngôn ngữ'],
        status: 'ACTIVE',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        joinDate: '2022-09-01',
        createdAt: now,
        updatedAt: now,
      },

      // --- Cấp THCS ---
      {
        id: 'tc_cs_001',
        code: 'GV-CS01',
        fullName: 'Cô Vũ Thúy Hằng',
        email: 'hangvt@vietsage.edu.vn',
        phone: '0912 345 678',
        department: 'Tổ Tự Nhiên (THCS)',
        schoolLevel: 'THCS',
        homeroomClass: '7B2',
        subjects: ['Khoa học Tự nhiên', 'Toán THCS'],
        status: 'ACTIVE',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinDate: '2019-09-01',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'tc_cs_002',
        code: 'GV-CS02',
        fullName: 'Thầy Phạm Quốc Toàn',
        email: 'toanpq@vietsage.edu.vn',
        phone: '0988 123 789',
        department: 'Tổ Xã Hội (THCS)',
        schoolLevel: 'THCS',
        homeroomClass: '8A1',
        subjects: ['Ngữ Văn THCS', 'Lịch Sử & Địa Lý'],
        status: 'ACTIVE',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        joinDate: '2020-08-01',
        createdAt: now,
        updatedAt: now,
      },

      // --- Cấp THPT ---
      {
        id: 'tc_001',
        code: 'GV-101',
        fullName: 'ThS. Nguyễn Văn Hùng',
        email: 'hung.nv@vietsage.edu.vn',
        phone: '0912 345 678',
        department: 'Toán - Tin học',
        schoolLevel: 'THPT',
        homeroomClass: '10A1',
        subjects: ['Toán Đại số', 'Toán Hình học'],
        status: 'ACTIVE',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinDate: '2021-08-15',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'tc_002',
        code: 'GV-102',
        fullName: 'Cô Trần Thị Mai',
        email: 'mai.tt@vietsage.edu.vn',
        phone: '0988 765 432',
        department: 'Ngữ Văn',
        schoolLevel: 'THPT',
        homeroomClass: '11B2',
        subjects: ['Ngữ Văn'],
        status: 'ACTIVE',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        joinDate: '2020-09-01',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'tc_003',
        code: 'GV-103',
        fullName: 'Thầy Lê Hoàng Long',
        email: 'long.lh@vietsage.edu.vn',
        phone: '0903 112 233',
        department: 'Khoa học Tự nhiên',
        schoolLevel: 'THPT',
        homeroomClass: '12A3',
        subjects: ['Vật Lý'],
        status: 'ACTIVE',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        joinDate: '2019-10-10',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'tc_004',
        code: 'GV-104',
        fullName: 'Cô Phạm Hải Yến',
        email: 'yen.ph@vietsage.edu.vn',
        phone: '0977 445 566',
        department: 'Ngoại Ngữ',
        schoolLevel: 'THPT',
        homeroomClass: '10A2',
        subjects: ['Tiếng Anh Quốc Tế'],
        status: 'ACTIVE',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        joinDate: '2022-03-01',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'tc_005',
        code: 'GV-105',
        fullName: 'Thầy Đỗ Minh Tuấn',
        email: 'tuan.dm@vietsage.edu.vn',
        phone: '0938 998 877',
        department: 'Khoa học Xã hội',
        schoolLevel: 'THPT',
        homeroomClass: undefined,
        subjects: ['Lịch Sử', 'Địa Lý'],
        status: 'ON_LEAVE',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        joinDate: '2023-01-15',
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Students
    this.students = [
      // --- Cấp Mầm Non ---
      {
        id: 'hs_mn_001',
        code: 'VS-MN-001',
        fullName: 'Bé Nguyễn Bảo An',
        dob: '2021-04-12',
        gender: 'Nữ',
        schoolLevel: 'Mầm non',
        className: 'Lá 1',
        homeroomTeacher: 'Cô Đặng Minh Châu',
        parentName: 'Nguyễn Văn Đức',
        parentPhone: '0903 111 222',
        address: 'Số 12 Đường Hoa Hồng, Ba Đình, Hà Nội',
        status: 'STUDYING',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        canteenRegistered: true,
        preschoolProfile: {
          heightCm: 104,
          weightKg: 16.5,
          allergies: 'Không có tiền sử dị ứng',
          napRoutine: 'Ngủ trưa 11h45 - 14h00',
          favoriteActivities: 'Tô màu, xếp hình khối lego, ca múa thiếu nhi',
          healthStatus: 'Tốt',
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'hs_mn_002',
        code: 'VS-MN-002',
        fullName: 'Bé Trần Tuệ Mẫn',
        dob: '2021-07-20',
        gender: 'Nữ',
        schoolLevel: 'Mầm non',
        className: 'Lá 1',
        homeroomTeacher: 'Cô Đặng Minh Châu',
        parentName: 'Trần Văn Phong',
        parentPhone: '0915 222 333',
        address: 'Số 88 Kim Mã, Ba Đình, Hà Nội',
        status: 'STUDYING',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        canteenRegistered: true,
        preschoolProfile: {
          heightCm: 102,
          weightKg: 15.8,
          allergies: 'Dị ứng nhẹ với phấn hoa',
          napRoutine: 'Dễ ngủ, tự giác cất gối',
          favoriteActivities: 'Kể chuyện tranh, nặn đất sét',
          healthStatus: 'Tốt',
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'hs_mn_003',
        code: 'VS-MN-003',
        fullName: 'Bé Lê Gia Khang',
        dob: '2022-02-14',
        gender: 'Nam',
        schoolLevel: 'Mầm non',
        className: 'Chồi 2',
        homeroomTeacher: 'Cô Hoàng Thu Trang',
        parentName: 'Lê Tuấn Hùng',
        parentPhone: '0938 444 555',
        address: 'Tòa Landmark 5, Cầu Giấy, Hà Nội',
        status: 'STUDYING',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        canteenRegistered: true,
        preschoolProfile: {
          heightCm: 98,
          weightKg: 15.0,
          allergies: 'Không',
          napRoutine: 'Cần cô vỗ về nhẹ trước khi ngủ',
          favoriteActivities: 'Lắp ráp đồ chơi xe ô tô, chạy nhảy ngoài sân',
          healthStatus: 'Tốt',
        },
        createdAt: now,
        updatedAt: now,
      },

      // --- Cấp THCS ---
      {
        id: 'hs_cs_001',
        code: 'VS-CS-001',
        fullName: 'Nguyễn Thị Mai',
        dob: '2013-05-18',
        gender: 'Nữ',
        schoolLevel: 'THCS',
        className: '7B2',
        homeroomTeacher: 'Cô Vũ Thúy Hằng',
        parentName: 'Nguyễn Hoàng Sơn',
        parentPhone: '0912 333 444',
        address: 'Số 45 Cầu Giấy, Hà Nội',
        status: 'STUDYING',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        canteenRegistered: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'hs_cs_002',
        code: 'VS-CS-002',
        fullName: 'Phan Minh Trí',
        dob: '2013-09-10',
        gender: 'Nam',
        schoolLevel: 'THCS',
        className: '7B2',
        homeroomTeacher: 'Cô Vũ Thúy Hằng',
        parentName: 'Phan Thanh Tùng',
        parentPhone: '0988 555 666',
        address: 'Số 33 Nguyễn Trãi, Thanh Xuân, Hà Nội',
        status: 'STUDYING',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        canteenRegistered: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'hs_cs_003',
        code: 'VS-CS-003',
        fullName: 'Đỗ Thùy Linh',
        dob: '2012-11-22',
        gender: 'Nữ',
        schoolLevel: 'THCS',
        className: '8A1',
        homeroomTeacher: 'Thầy Phạm Quốc Toàn',
        parentName: 'Đỗ Mạnh Cường',
        parentPhone: '0977 777 888',
        address: 'Số 90 Trần Duy Hưng, Cầu Giấy, Hà Nội',
        status: 'STUDYING',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        canteenRegistered: false,
        createdAt: now,
        updatedAt: now,
      },

      // --- Cấp THPT ---
      {
        id: 'hs_001',
        code: 'VS-2026-001',
        fullName: 'Nguyễn Minh Quân',
        dob: '2010-04-12',
        gender: 'Nam',
        schoolLevel: 'THPT',
        className: '10A1',
        homeroomTeacher: 'ThS. Nguyễn Văn Hùng',
        parentName: 'Nguyễn Văn Thành',
        parentPhone: '0912 999 111',
        address: 'Số 45 Cầu Giấy, Hà Nội',
        status: 'STUDYING',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        canteenRegistered: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'hs_002',
        code: 'VS-2026-002',
        fullName: 'Lê Thảo My',
        dob: '2010-08-25',
        gender: 'Nữ',
        schoolLevel: 'THPT',
        className: '10A1',
        homeroomTeacher: 'ThS. Nguyễn Văn Hùng',
        parentName: 'Lê Hoàng Hải',
        parentPhone: '0913 222 333',
        address: 'Số 12 Kim Mã, Ba Đình, Hà Nội',
        status: 'STUDYING',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        canteenRegistered: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'hs_003',
        code: 'VS-2026-003',
        fullName: 'Trần Gia Bảo',
        dob: '2010-02-18',
        gender: 'Nam',
        schoolLevel: 'THPT',
        className: '10A1',
        homeroomTeacher: 'ThS. Nguyễn Văn Hùng',
        parentName: 'Trần Quốc Đạt',
        parentPhone: '0982 777 888',
        address: 'Số 88 Trần Duy Hưng, Hà Nội',
        status: 'STUDYING',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        canteenRegistered: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'hs_004',
        code: 'VS-2026-004',
        fullName: 'Vũ Ngọc Ánh',
        dob: '2010-11-05',
        gender: 'Nữ',
        schoolLevel: 'THPT',
        className: '10A1',
        homeroomTeacher: 'ThS. Nguyễn Văn Hùng',
        parentName: 'Vũ Đình Trọng',
        parentPhone: '0973 456 123',
        address: 'Số 29 Lạc Long Quân, Tây Hồ, Hà Nội',
        status: 'STUDYING',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
        canteenRegistered: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'hs_005',
        code: 'VS-2026-005',
        fullName: 'Phạm Đức Huy',
        dob: '2010-06-30',
        gender: 'Nam',
        schoolLevel: 'THPT',
        className: '10A1',
        homeroomTeacher: 'ThS. Nguyễn Văn Hùng',
        parentName: 'Phạm Văn Nam',
        parentPhone: '0944 555 666',
        address: 'Số 102 Hoàng Hoa Thám, Hà Nội',
        status: 'STUDYING',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        canteenRegistered: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'hs_006',
        code: 'VS-2026-006',
        fullName: 'Hoàng Yến Nhi',
        dob: '2010-09-14',
        gender: 'Nữ',
        schoolLevel: 'THPT',
        className: '10A1',
        homeroomTeacher: 'ThS. Nguyễn Văn Hùng',
        parentName: 'Hoàng Anh Tuấn',
        parentPhone: '0966 888 999',
        address: 'Số 55 Nguyễn Trãi, Thanh Xuân, Hà Nội',
        status: 'STUDYING',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        canteenRegistered: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'hs_007',
        code: 'VS-2026-007',
        fullName: 'Bùi Tuấn Kiệt',
        dob: '2010-03-21',
        gender: 'Nam',
        schoolLevel: 'THPT',
        className: '10A2',
        homeroomTeacher: 'Cô Phạm Hải Yến',
        parentName: 'Bùi Văn Hùng',
        parentPhone: '0933 111 222',
        address: 'Số 16 Xuân Thủy, Cầu Giấy, Hà Nội',
        status: 'STUDYING',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        canteenRegistered: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'hs_008',
        code: 'VS-2026-008',
        fullName: 'Đặng Mai Phương',
        dob: '2010-12-01',
        gender: 'Nữ',
        schoolLevel: 'THPT',
        className: '10A2',
        homeroomTeacher: 'Cô Phạm Hải Yến',
        parentName: 'Đặng Quốc Huy',
        parentPhone: '0909 333 444',
        address: 'Số 77 Đội Cấn, Ba Đình, Hà Nội',
        status: 'STUDYING',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        canteenRegistered: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Devices HN212
    this.devices = [
      {
        id: 'dev_mn_01',
        deviceCode: 'HN212-MAMNON',
        name: 'Máy Điểm Danh Cổng Mầm Non VietSage Kids',
        location: 'Cổng Khối Mầm Non - Cơ sở 1',
        ipAddress: '192.168.1.100',
        status: 'ONLINE',
        isActive: true,
        lastSeenAt: '2026-10-18 19:20:15',
        totalScansToday: 180,
        createdAt: now,
      },
      {
        id: 'dev_cs_01',
        deviceCode: 'HN212-THCS',
        name: 'Máy Điểm Danh Khu THCS VietSage',
        location: 'Sảnh Tòa Nhà B - Khối THCS',
        ipAddress: '192.168.1.103',
        status: 'ONLINE',
        isActive: true,
        lastSeenAt: '2026-10-18 19:18:00',
        totalScansToday: 345,
        createdAt: now,
      },
      {
        id: 'dev_01',
        deviceCode: 'HN212-GATE-A',
        name: 'Máy Nhận Diện Cổng Chính THPT',
        location: 'Cổng chính Khối THPT (Khuôn mặt & Thẻ NFC)',
        ipAddress: '192.168.1.101',
        status: 'ONLINE',
        isActive: true,
        lastSeenAt: '2026-10-18 19:15:32',
        totalScansToday: 428,
        createdAt: now,
      },
      {
        id: 'dev_02',
        deviceCode: 'HN212-GATE-B',
        name: 'Máy Nhận Diện Cổng Phụ B',
        location: 'Cổng phụ Nhà thi đấu thể thao',
        ipAddress: '192.168.1.102',
        status: 'ONLINE',
        isActive: true,
        lastSeenAt: '2026-10-18 19:14:10',
        totalScansToday: 215,
        createdAt: now,
      },
      {
        id: 'dev_03',
        deviceCode: 'HN212-CANTEEN',
        name: 'Máy Check-in Nhà Ăn Bán Trú',
        location: 'Cửa vào nhà ăn tầng 1',
        ipAddress: '192.168.1.105',
        status: 'ONLINE',
        isActive: true,
        lastSeenAt: '2026-10-18 19:10:04',
        totalScansToday: 350,
        createdAt: now,
      },
      {
        id: 'dev_04',
        deviceCode: 'HN212-STAFF',
        name: 'Máy Chấm Công Văn Phòng Giáo Viên',
        location: 'Tầng 2 - Tòa hiệu bộ',
        ipAddress: '192.168.1.110',
        status: 'ONLINE',
        isActive: true,
        lastSeenAt: '2026-10-18 19:05:45',
        totalScansToday: 58,
        createdAt: now,
      },
    ];

    // Attendance Records
    this.attendance = [
      {
        id: 'att_001',
        eventId: 'EVT_INIT_001',
        studentId: 'hs_001',
        studentCode: 'VS-2026-001',
        studentName: 'Nguyễn Minh Quân',
        className: '10A1',
        date: '2026-10-18',
        occurredAt: '2026-10-18T06:58:12.000Z',
        status: 'PRESENT',
        checkInTime: '06:58:12',
        checkOutTime: '17:02:40',
        method: 'FACE',
        direction: 'CHECK_IN',
        deviceId: 'dev_01',
        deviceName: 'HN212 Cổng Chính A',
        createdAt: now,
      },
      {
        id: 'att_002',
        eventId: 'EVT_INIT_002',
        studentId: 'hs_002',
        studentCode: 'VS-2026-002',
        studentName: 'Lê Thảo My',
        className: '10A1',
        date: '2026-10-18',
        occurredAt: '2026-10-18T07:05:43.000Z',
        status: 'PRESENT',
        checkInTime: '07:05:43',
        checkOutTime: '17:00:15',
        method: 'FACE',
        direction: 'CHECK_IN',
        deviceId: 'dev_01',
        deviceName: 'HN212 Cổng Chính A',
        createdAt: now,
      },
      {
        id: 'att_003',
        eventId: 'EVT_INIT_003',
        studentId: 'hs_003',
        studentCode: 'VS-2026-003',
        studentName: 'Trần Gia Bảo',
        className: '10A1',
        date: '2026-10-18',
        occurredAt: '2026-10-18T07:22:10.000Z',
        status: 'LATE',
        checkInTime: '07:22:10',
        checkOutTime: '16:55:00',
        method: 'FACE',
        direction: 'CHECK_IN',
        note: 'Đi muộn 22 phút do tắc đường',
        deviceId: 'dev_01',
        deviceName: 'HN212 Cổng Chính A',
        createdAt: now,
      },
      {
        id: 'att_004',
        eventId: 'EVT_INIT_004',
        studentId: 'hs_004',
        studentCode: 'VS-2026-004',
        studentName: 'Vũ Ngọc Ánh',
        className: '10A1',
        date: '2026-10-18',
        occurredAt: '2026-10-18T06:52:19.000Z',
        status: 'PRESENT',
        checkInTime: '06:52:19',
        checkOutTime: '17:05:30',
        method: 'FACE',
        direction: 'CHECK_IN',
        deviceId: 'dev_01',
        deviceName: 'HN212 Cổng Chính A',
        createdAt: now,
      },
      {
        id: 'att_005',
        eventId: 'EVT_INIT_005',
        studentId: 'hs_005',
        studentCode: 'VS-2026-005',
        studentName: 'Phạm Đức Huy',
        className: '10A1',
        date: '2026-10-18',
        occurredAt: '2026-10-18T07:30:00.000Z',
        status: 'EXCUSED',
        method: 'MANUAL',
        direction: 'CHECK_IN',
        note: 'Phụ huynh xin nghỉ phép khám bệnh',
        createdAt: now,
      },
      {
        id: 'att_006',
        eventId: 'EVT_INIT_006',
        studentId: 'hs_006',
        studentCode: 'VS-2026-006',
        studentName: 'Hoàng Yến Nhi',
        className: '10A1',
        date: '2026-10-18',
        occurredAt: '2026-10-18T07:08:50.000Z',
        status: 'PRESENT',
        checkInTime: '07:08:50',
        checkOutTime: '17:01:10',
        method: 'CARD',
        direction: 'CHECK_IN',
        deviceId: 'dev_02',
        deviceName: 'HN212 Cổng Phụ B',
        createdAt: now,
      },
    ];

    // Leave Requests
    this.leaveRequests = [
      {
        id: 'lr_001',
        studentId: 'hs_005',
        studentName: 'Phạm Đức Huy',
        className: '10A1',
        startDate: '2026-10-18T00:00:00.000Z',
        endDate: '2026-10-18T23:59:59.000Z',
        reason: 'Học sinh bị cảm sốt, phụ huynh xin nghỉ 1 ngày để đi khám bệnh viện.',
        phone: '0944 555 666',
        status: 'APPROVED',
        reviewNote: 'Đã duyệt nghỉ có phép.',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'lr_002',
        studentId: 'hs_001',
        studentName: 'Nguyễn Minh Quân',
        className: '10A1',
        startDate: '2026-10-25T00:00:00.000Z',
        endDate: '2026-10-26T23:59:59.000Z',
        reason: 'Gia đình có việc hiếu ở quê, xin phép cho cháu nghỉ học 2 ngày.',
        phone: '0912 999 111',
        status: 'PENDING',
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Homeworks
    this.homeworks = [
      {
        id: 'hw_01',
        title: 'Bài tập Đại số: Bất phương trình bậc hai một ẩn',
        subject: 'Toán Đại số',
        className: '10A1',
        teacherId: 'tc_001',
        teacherName: 'ThS. Nguyễn Văn Hùng',
        assignedDate: '2026-10-16',
        dueDate: '2026-10-20 23:59',
        description: 'Học sinh hoàn thành bài tập 1 đến 5 trang 42 SGK Toán 10. Trình bày chi tiết các bước xét dấu tam thức bậc hai.',
        attachments: ['Bai_tap_Bat_phuong_trinh_T10.pdf'],
        isUrgent: true,
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
            gradedAt: '2026-10-17 21:00:00',
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
            gradedAt: '2026-10-17 21:15:00',
          },
          {
            id: 'sub_003',
            studentId: 'hs_003',
            studentName: 'Trần Gia Bảo',
            studentCode: 'VS-2026-003',
            submittedAt: '2026-10-18 10:45:12',
            status: 'SUBMITTED',
            content: 'Thưa thầy em nộp bài tập ạ.',
            fileUrls: ['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'],
          },
          {
            id: 'sub_004',
            studentId: 'hs_004',
            studentName: 'Vũ Ngọc Ánh',
            studentCode: 'VS-2026-004',
            submittedAt: '2026-10-18 14:20:30',
            status: 'SUBMITTED',
            content: 'Em đính kèm 2 trang lời giải bài tập SGK.',
            fileUrls: ['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'],
          },
        ],
        createdAt: now,
        updatedAt: now,
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
        isUrgent: false,
        totalStudents: 38,
        submittedCount: 28,
        gradedCount: 15,
        submissions: [],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'hw_03',
        title: 'Phân tích nhân vật Huấn Cao trong tác phẩm Chữ người tử tù',
        subject: 'Ngữ Văn',
        className: '11B2',
        teacherId: 'tc_002',
        teacherName: 'Cô Trần Thị Mai',
        assignedDate: '2026-10-14',
        dueDate: '2026-10-21 23:59',
        description: 'Viết bài văn nghị luận ngắn phân tích vẻ đẹp thiên lương và khí phách của nhân vật Huấn Cao.',
        attachments: ['Dan_y_Chu_Nguoi_Tu_Tu.docx'],
        isUrgent: false,
        totalStudents: 40,
        submittedCount: 35,
        gradedCount: 30,
        submissions: [],
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Schedules
    this.schedules = [
      { id: 'sch_1', dayOfWeek: 2, period: 1, timeRange: '07:15 - 08:00', subject: 'Chào cờ đầu tuần', className: 'Toàn trường', room: 'Sân trường', teacherName: 'Ban Giám Hiệu', createdAt: now },
      { id: 'sch_2', dayOfWeek: 2, period: 2, timeRange: '08:05 - 08:50', subject: 'Toán Đại số', className: '10A1', room: 'Phòng 301', teacherName: 'ThS. Nguyễn Văn Hùng', createdAt: now },
      { id: 'sch_3', dayOfWeek: 2, period: 3, timeRange: '09:05 - 09:50', subject: 'Toán Hình học', className: '10A1', room: 'Phòng 301', teacherName: 'ThS. Nguyễn Văn Hùng', createdAt: now },
      { id: 'sch_4', dayOfWeek: 2, period: 4, timeRange: '09:55 - 10:40', subject: 'Vật Lý', className: '10A1', room: 'Phòng 301', teacherName: 'Thầy Lê Hoàng Long', createdAt: now },
      { id: 'sch_5', dayOfWeek: 2, period: 5, timeRange: '10:45 - 11:30', subject: 'Tiếng Anh', className: '10A1', room: 'Phòng 301', teacherName: 'Cô Phạm Hải Yến', createdAt: now },

      { id: 'sch_6', dayOfWeek: 3, period: 1, timeRange: '07:15 - 08:00', subject: 'Toán Đại số', className: '10A2', room: 'Phòng 302', teacherName: 'ThS. Nguyễn Văn Hùng', createdAt: now },
      { id: 'sch_7', dayOfWeek: 3, period: 2, timeRange: '08:05 - 08:50', subject: 'Toán Đại số', className: '10A2', room: 'Phòng 302', teacherName: 'ThS. Nguyễn Văn Hùng', createdAt: now },
      { id: 'sch_8', dayOfWeek: 3, period: 3, timeRange: '09:05 - 09:50', subject: 'Ngữ Văn', className: '10A1', room: 'Phòng 301', teacherName: 'Cô Trần Thị Mai', createdAt: now },
      { id: 'sch_9', dayOfWeek: 3, period: 4, timeRange: '09:55 - 10:40', subject: 'Hóa Học', className: '10A1', room: 'Lab Hóa 1', teacherName: 'Cô Đặng Thảo', createdAt: now },

      { id: 'sch_10', dayOfWeek: 4, period: 1, timeRange: '07:15 - 08:00', subject: 'Sinh Hoạt Lớp 10A1', className: '10A1', room: 'Phòng 301', teacherName: 'ThS. Nguyễn Văn Hùng', createdAt: now },
      { id: 'sch_11', dayOfWeek: 4, period: 2, timeRange: '08:05 - 08:50', subject: 'Toán Hình học', className: '10A1', room: 'Phòng 301', teacherName: 'ThS. Nguyễn Văn Hùng', createdAt: now },
      { id: 'sch_12', dayOfWeek: 4, period: 3, timeRange: '09:05 - 09:50', subject: 'Lịch Sử', className: '10A1', room: 'Phòng 301', teacherName: 'Thầy Đỗ Minh Tuấn', createdAt: now },

      { id: 'sch_13', dayOfWeek: 5, period: 2, timeRange: '08:05 - 08:50', subject: 'Toán Đại số', className: '10A1', room: 'Phòng 301', teacherName: 'ThS. Nguyễn Văn Hùng', createdAt: now },
      { id: 'sch_14', dayOfWeek: 5, period: 3, timeRange: '09:05 - 09:50', subject: 'Tin Học', className: '10A1', room: 'Phòng Máy 2', teacherName: 'ThS. Nguyễn Văn Hùng', createdAt: now },

      { id: 'sch_15', dayOfWeek: 6, period: 1, timeRange: '07:15 - 08:00', subject: 'Toán Ôn tập', className: '10A1', room: 'Phòng 301', teacherName: 'ThS. Nguyễn Văn Hùng', createdAt: now },
      { id: 'sch_16', dayOfWeek: 6, period: 4, timeRange: '09:55 - 10:40', subject: 'Sinh Hoạt Cuối Tuần', className: '10A1', room: 'Phòng 301', teacherName: 'ThS. Nguyễn Văn Hùng', createdAt: now },
    ];

    // Grades
    this.grades = [
      // --- Cấp Mầm Non (Đánh giá phát triển 5 lĩnh vực & Bé ngoan) ---
      {
        id: 'gr_mn_001',
        studentId: 'hs_mn_001',
        studentCode: 'VS-MN-001',
        studentName: 'Bé Nguyễn Bảo An',
        className: 'Lá 1',
        subject: 'Đánh giá 5 lĩnh vực phát triển',
        semester: 'HK1_2026_2027',
        preschoolEvaluation: {
          physical: 'Đạt Tốt: Bé nhanh nhẹn, chiều cao cân nặng chuẩn, biết tự xúc ăn.',
          cognitive: 'Đạt Tốt: Nhận biết tốt màu sắc cơ bản và hình khối hình học.',
          language: 'Rất Tốt: Diễn đạt lưu loát trọn câu, thích nghe kể chuyện tranh.',
          socialEmotional: 'Đạt Tốt: Lễ phép, biết chào hỏi thầy cô và chia sẻ đồ chơi cùng bạn.',
          aesthetic: 'Đạt Tốt: Hát thuộc các bài hát thiếu nhi, tô màu khéo léo.',
          generalComment: 'Bé rất ngoan, hoạt bát và hòa đồng cùng các bạn trong lớp.',
          weeklyStar: true,
        },
        createdAt: now,
        updatedAt: now,
      },

      // --- Cấp THCS (Bảng điểm số 1-10) ---
      { id: 'gr_cs_001', studentId: 'hs_cs_001', studentCode: 'VS-CS-001', studentName: 'Nguyễn Thị Mai', className: '7B2', subject: 'Toán học (THCS)', semester: 'HK1_2026_2027', scoreOral1: 9.5, scoreOral2: 10, score15m1: 9.0, score15m2: 9.5, score1Period: 9.5, scoreMidTerm: 9.2, scoreFinal: 9.5, averageScore: 9.4, createdAt: now, updatedAt: now },
      { id: 'gr_cs_002', studentId: 'hs_cs_001', studentCode: 'VS-CS-001', studentName: 'Nguyễn Thị Mai', className: '7B2', subject: 'Khoa học Tự nhiên', semester: 'HK1_2026_2027', scoreOral1: 9.0, scoreOral2: 9.5, score15m1: 9.0, score15m2: 9.0, score1Period: 9.5, scoreMidTerm: 9.0, scoreFinal: 9.5, averageScore: 9.2, createdAt: now, updatedAt: now },

      // --- Cấp THPT (Bảng điểm số 1-10) ---
      { id: 'gr_001', studentId: 'hs_001', studentCode: 'VS-2026-001', studentName: 'Nguyễn Minh Quân', className: '10A1', subject: 'Toán Học', semester: 'HK1_2026_2027', scoreOral1: 9.0, scoreOral2: 10, score15m1: 9.5, score15m2: 9.0, score1Period: 9.0, scoreMidTerm: 9.2, scoreFinal: 9.5, averageScore: 9.3, createdAt: now, updatedAt: now },
      { id: 'gr_002', studentId: 'hs_002', studentCode: 'VS-2026-002', studentName: 'Lê Thảo My', className: '10A1', subject: 'Toán Học', semester: 'HK1_2026_2027', scoreOral1: 8.5, scoreOral2: 9.0, score15m1: 8.5, score15m2: 8.0, score1Period: 8.5, scoreMidTerm: 8.8, scoreFinal: 8.5, averageScore: 8.6, createdAt: now, updatedAt: now },
      { id: 'gr_003', studentId: 'hs_003', studentCode: 'VS-2026-003', studentName: 'Trần Gia Bảo', className: '10A1', subject: 'Toán Học', semester: 'HK1_2026_2027', scoreOral1: 7.0, scoreOral2: 7.5, score15m1: 7.0, score15m2: 8.0, score1Period: 7.5, scoreMidTerm: 7.5, scoreFinal: 8.0, averageScore: 7.6, createdAt: now, updatedAt: now },
      { id: 'gr_004', studentId: 'hs_004', studentCode: 'VS-2026-004', studentName: 'Vũ Ngọc Ánh', className: '10A1', subject: 'Toán Học', semester: 'HK1_2026_2027', scoreOral1: 9.5, scoreOral2: 9.0, score15m1: 10, score15m2: 9.5, score1Period: 9.0, scoreMidTerm: 9.5, scoreFinal: 9.5, averageScore: 9.5, createdAt: now, updatedAt: now },
      { id: 'gr_005', studentId: 'hs_005', studentCode: 'VS-2026-005', studentName: 'Phạm Đức Huy', className: '10A1', subject: 'Toán Học', semester: 'HK1_2026_2027', scoreOral1: 7.5, scoreOral2: 8.0, score15m1: 7.5, score15m2: 7.0, score1Period: 7.5, scoreMidTerm: 7.0, scoreFinal: 7.5, averageScore: 7.4, createdAt: now, updatedAt: now },
      { id: 'gr_006', studentId: 'hs_006', studentCode: 'VS-2026-006', studentName: 'Hoàng Yến Nhi', className: '10A1', subject: 'Toán Học', semester: 'HK1_2026_2027', scoreOral1: 8.5, scoreOral2: 8.5, score15m1: 8.0, score15m2: 8.5, score1Period: 8.0, scoreMidTerm: 8.5, scoreFinal: 8.5, averageScore: 8.4, createdAt: now, updatedAt: now },
    ];

    // Canteen Meals (Hỗ trợ Thực đơn Đa cấp: Mầm non 3 bữa + Sữa, THCS/THPT cơm bán trú)
    this.canteenMeals = [
      {
        id: 'meal_1',
        dayId: 't2',
        date: '2026-10-19',
        dayOfWeek: 'Thứ Hai',
        level: 'Toàn trường',
        mainDish: 'Thịt kho trứng cút & Tôm rim thịt ba chỉ',
        sideDish: 'Đậu phụ sốt cà chua',
        soup: 'Canh cải ngọt nấu thịt băm',
        dessert: 'Dưa hấu Long An',
        nutritionKcal: 680,
        preschoolMenu: {
          morningSnack: 'Súp gà ngô non & Sữa tươi nguyên kem 180ml',
          lunchSoft: 'Cháo thịt bò bằm bí đỏ phô mai & Chuối ngự tiêu nghiền',
          afternoonSnack: 'Bánh flan caramen mềm & Sữa đậu nành mè đen',
          milkFormula: 'Sữa tươi dinh dưỡng thanh trùng',
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'meal_2',
        dayId: 't3',
        date: '2026-10-20',
        dayOfWeek: 'Thứ Ba',
        level: 'Toàn trường',
        mainDish: 'Gà chiên mắm bơ tỏi & Cá thu sốt cà',
        sideDish: 'Bắp cải xào nấm',
        soup: 'Canh bí đỏ hầm xương heo',
        dessert: 'Sữa chua men sống Betagen',
        nutritionKcal: 720,
        preschoolMenu: {
          morningSnack: 'Cháo tôm rong biển cà rốt & Nước cam tươi',
          lunchSoft: 'Cơm nát cá hồi sốt bơ tỏi & Canh rau ngót nấu tôm',
          afternoonSnack: 'Sữa chua hoa quả dầm & Bánh bông lan phô mai',
          milkFormula: 'Sữa hạt sen macca hữu cơ',
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'meal_3',
        dayId: 't4',
        date: '2026-10-21',
        dayOfWeek: 'Thứ Tư',
        level: 'Toàn trường',
        mainDish: 'Bò xào lúc lắc & Sườn non chua ngọt',
        sideDish: 'Khoai tây nghiền phô mai',
        soup: 'Canh rong biển đậu non thịt nạc',
        dessert: 'Chuối ngự tráng miệng',
        nutritionKcal: 750,
        preschoolMenu: {
          morningSnack: 'Phở bò mềm Hà Nội & Sữa hạt dinh dưỡng',
          lunchSoft: 'Cháo bồ câu hầm hạt sen & Rau củ quả hấp ngũ sắc',
          afternoonSnack: 'Chè đậu đỏ nước cốt dừa & Bánh quy yến mạch',
          milkFormula: 'Sữa tươi thanh trùng Cô Gái Hà Lan 180ml',
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'meal_4',
        dayId: 't5',
        date: '2026-10-22',
        dayOfWeek: 'Thứ Năm',
        level: 'Toàn trường',
        mainDish: 'Thịt ba rọi nướng sả & Chả lụa rim tiêu',
        sideDish: 'Rau muống xào tỏi giòn',
        soup: 'Canh cua đồng mồng tơi mướp hương',
        dessert: 'Thanh long ruột đỏ',
        nutritionKcal: 710,
        preschoolMenu: {
          morningSnack: 'Bánh bao nhân thịt trứng cút & Sữa chua uống Betagen',
          lunchSoft: 'Cơm nát thịt nạc băm rim đậu hũ & Canh cua mồng tơi',
          afternoonSnack: 'Sinh tố bơ sữa dừa & Bánh quy bơ Danish',
          milkFormula: 'Sữa tươi nguyên kem TH True Milk',
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'meal_5',
        dayId: 't6',
        date: '2026-10-23',
        dayOfWeek: 'Thứ Sáu',
        level: 'Toàn trường',
        mainDish: 'Cơm gà xối mỡ & Trứng ốp la thơm lừng',
        sideDish: 'Xà lách trộn dầu giấm chua ngọt',
        soup: 'Canh chua cá lăng nấu dọc mùng',
        dessert: 'Chè sen hạt long nhãn',
        nutritionKcal: 740,
        preschoolMenu: {
          morningSnack: 'Miến lươn đồng xào rau củ & Nước ép ổi hồng',
          lunchSoft: 'Cháo sườn heo củ sen bùi ngậy & Đu đủ chín tráng miệng',
          afternoonSnack: 'Bánh tart trứng HongKong & Sữa tươi nguyên chất',
          milkFormula: 'Sữa hạnh nhân yến mạch tự nhiên',
        },
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Uniform Items (Đồng phục 3 cấp: Mầm non, THCS, THPT)
    this.uniformItems = [
      // --- Cấp Mầm Non ---
      { id: 'uni_mn_01', code: 'UF-MN-01', name: 'Bộ đồng phục Polo mầm non VietSage Kids', category: 'Bộ Polo mầm non', gradeGroup: 'Mầm non', price: 160000, inStock: 120, sizes: ['Số 2 (2-3 tuổi)', 'Số 3 (3-4 tuổi)', 'Số 4 (4-5 tuổi)', 'Số 5 (5-6 tuổi)'], imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=300&auto=format&fit=crop&q=80', description: 'Chất liệu 100% cotton organic mềm mại, an toàn cho làn da bé.', createdAt: now, updatedAt: now },
      { id: 'uni_mn_02', code: 'UF-MN-02', name: 'Balo chống gù hình thú cưng VietSage Kids', category: 'Balo mầm non', gradeGroup: 'Mầm non', price: 175000, inStock: 85, sizes: ['Tiêu chuẩn mầm non'], imageUrl: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=300&auto=format&fit=crop&q=80', description: 'Trọng lượng siêu nhẹ 350g, đệm lưng êm ái, chống nước tốt.', createdAt: now, updatedAt: now },
      { id: 'uni_mn_03', code: 'UF-MN-03', name: 'Mũ nón tai bèo cotton mầm non chống nắng', category: 'Phụ kiện', gradeGroup: 'Mầm non', price: 65000, inStock: 150, sizes: ['Freesize'], imageUrl: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=300&auto=format&fit=crop&q=80', description: 'Vành rộng che nắng, có quai đeo chống rơi khi bé hoạt động dã ngoại.', createdAt: now, updatedAt: now },

      // --- Cấp THCS ---
      { id: 'uni_cs_01', code: 'UF-CS-01', name: 'Áo polo đồng phục học sinh THCS VietSage Junior', category: 'Áo Polo', gradeGroup: 'THCS', price: 175000, inStock: 160, sizes: ['XS', 'S', 'M', 'L', 'XL'], imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80', description: 'Phối cổ cam năng động, vải cá sấu cotton co giãn 4 chiều.', createdAt: now, updatedAt: now },
      { id: 'uni_cs_02', code: 'UF-CS-02', name: 'Bộ thể dục học sinh THCS thoáng khí', category: 'Áo thể dục', gradeGroup: 'THCS', price: 210000, inStock: 200, sizes: ['XS', 'S', 'M', 'L', 'XL'], imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop&q=80', description: 'Vải thun lạnh thể thao kháng khuẩn, thoát mồ hôi tối ưu.', createdAt: now, updatedAt: now },

      // --- Cấp THPT ---
      { id: 'uni_01', code: 'UF-SM-01', name: 'Áo sơ mi trắng thêu logo VietSage', category: 'Áo sơ mi', gradeGroup: 'THPT', price: 165000, inStock: 180, sizes: ['S', 'M', 'L', 'XL', '2XL'], imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=300&auto=format&fit=crop&q=80', description: 'Chất liệu vải Kate Mỹ cao cấp, chống nhăn, thoáng mát.', createdAt: now, updatedAt: now },
      { id: 'uni_02', code: 'UF-QT-01', name: 'Quần tây xanh navy cao cấp nam', category: 'Quần tây / Váy', gradeGroup: 'THPT', price: 195000, inStock: 120, sizes: ['28', '29', '30', '31', '32'], imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&auto=format&fit=crop&q=80', description: 'Form dáng chuẩn, co giãn nhẹ, tôn dáng học sinh.', createdAt: now, updatedAt: now },
      { id: 'uni_03', code: 'UF-VY-01', name: 'Váy xếp ly kẻ caro nữ sinh', category: 'Quần tây / Váy', gradeGroup: 'THPT', price: 185000, inStock: 95, sizes: ['S', 'M', 'L'], imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&auto=format&fit=crop&q=80', description: 'Kẻ caro tinh tế có lót quần bảo hộ bên trong tiện lợi.', createdAt: now, updatedAt: now },
      { id: 'uni_04', code: 'UF-TD-01', name: 'Bộ thể dục VietSage Sport Pro', category: 'Áo thể dục', gradeGroup: 'THPT', price: 220000, inStock: 250, sizes: ['S', 'M', 'L', 'XL'], imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&auto=format&fit=crop&q=80', description: 'Vải mè thể thao thấm hút mồ hôi cực tốt.', createdAt: now, updatedAt: now },
      { id: 'uni_05', code: 'UF-KG-01', name: 'Áo khoác gió mùa đông 2 lớp chống nước', category: 'Áo khoác gió', gradeGroup: 'THPT', price: 290000, inStock: 140, sizes: ['M', 'L', 'XL', '2XL'], imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=300&auto=format&fit=crop&q=80', description: 'Giữ ấm tốt, cản gió và chống nước mưa nhỏ.', createdAt: now, updatedAt: now },
    ];

    // Uniform Orders
    this.uniformOrders = [
      {
        id: 'ord_001',
        orderCode: 'ORD-20261018-001',
        orderDate: now,
        status: 'Chờ nhận tại trường',
        items: [
          { uniformId: 'uni_01', name: 'Áo sơ mi trắng thêu logo VietSage', size: 'L', quantity: 2, unitPrice: 165000, totalPrice: 330000 },
          { uniformId: 'uni_02', name: 'Quần tây xanh navy cao cấp nam', size: '30', quantity: 1, unitPrice: 195000, totalPrice: 195000 },
        ],
        totalAmount: 525000,
        studentName: 'Nguyễn Minh Quân',
        studentClass: '10A1',
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Events
    this.events = [
      {
        id: 'evt_001',
        title: 'Hội Thao & Giải Bóng Đá Nam Khối 10',
        date: '20/10/2026 - 25/10/2026',
        location: 'Sân Vận Động Trường',
        tag: 'Thể thao',
        description: 'Giải đấu bóng đá thường niên nhằm nâng cao tinh thần rèn luyện thể chất và đoàn kết giữa các chi đoàn khối 10.',
        icon: 'sports_soccer',
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'evt_002',
        title: 'Lễ Hội Hóa Trang Halloween Đa Văn Hóa',
        date: '31/10/2026 • 18:30',
        location: 'Hội Trường Lớn',
        tag: 'Văn hóa',
        description: 'Đêm hội trải nghiệm văn hóa thế giới với các gian hàng ẩm thực, thi hóa trang sáng tạo và ca nhạc giao lưu.',
        icon: 'celebration',
        imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'evt_003',
        title: 'Hội Diễn Văn Nghệ Chào Mừng 20/11',
        date: '19/11/2026 • 08:00',
        location: 'Sân Khấu Ngoài Trời',
        tag: 'Tri ân',
        description: 'Chương trình biểu diễn nghệ thuật đặc sắc dâng tặng các thầy cô giáo nhân ngày Nhà Giáo Việt Nam.',
        icon: 'music_note',
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'evt_004',
        title: 'Quyên Góp Sách Vở Ủng Hộ Bạn Vùng Cao',
        date: 'Đến hết ngày 30/11/2026',
        location: 'Thư Viện Trường',
        tag: 'Thiện nguyện',
        description: 'Chiến dịch thu gom sách giáo khoa, vở trắng và đồ dùng học tập gửi tặng học sinh vùng sâu vùng xa.',
        icon: 'volunteer_activism',
        imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=800&q=80',
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Announcements
    this.announcements = [
      {
        id: 'ann_01',
        title: 'Thông báo triển khai hệ thống điểm danh nhận diện khuôn mặt HN212 toàn trường',
        content: 'Ban Giám Hiệu nhà trường xin thông báo: Toàn bộ cổng trường đã kích hoạt hệ thống camera nhận diện AI HN212. Học sinh khi bước qua cổng sẽ được tự động check-in và gửi thông báo về app phụ huynh trong vòng 3 giây.',
        author: 'Ban Giám Hiệu',
        category: 'TOÀN TRƯỜNG',
        targetAudience: 'Toàn thể Cán bộ Giáo viên, Học sinh và Phụ huynh',
        priority: 'HIGH',
        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
        isNew: true,
        createdAt: '2026-10-18 08:00',
        updatedAt: now,
      },
      {
        id: 'ann_02',
        title: 'Họp Hội đồng Sư phạm tháng 10 & Triển khai Hội thi Giáo viên Giỏi',
        content: 'Kính mời các thầy cô tham dự phiên họp định kỳ vào lúc 14h00 chiều thứ Sáu tại Hội trường A. Nội dung chính: Đánh giá nền nếp học tập giữa kỳ 1 và kế hoạch bồi dưỡng học sinh mũi nhọn.',
        author: 'Hiệu trưởng - ThS. Lê Văn Đức',
        category: 'GIÁO VIÊN',
        targetAudience: 'Toàn thể Giáo viên bộ môn & Giáo viên chủ nhiệm',
        priority: 'NORMAL',
        imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
        isNew: true,
        createdAt: '2026-10-17 15:30',
        updatedAt: now,
      },
      {
        id: 'ann_03',
        title: 'Nhắc nhở nộp bài tập khảo sát chất lượng giữa học kỳ I',
        content: 'Các em học sinh lưu ý hạn chót nộp bài tập tự luận và đề cương ôn tập môn Toán, Ngữ Văn và Tiếng Anh qua cổng nộp bài trước ngày 22/10.',
        author: 'Tổ Chuyên môn THPT',
        category: 'PHỤ HUYNH',
        targetAudience: 'Học sinh các khối 10, 11, 12',
        priority: 'NORMAL',
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
        isNew: false,
        createdAt: '2026-10-16 09:15',
        updatedAt: now,
      },
    ];

    // Settings
    this.settings = {
      schoolName: 'Hệ Thống Trường Học Liên Cấp VietSage Edu (Mầm non - THCS - THPT)',
      schoolLevels: ['Mầm non', 'THCS', 'THPT'],
      schoolAddress: 'Số 88 Trần Duy Hưng, Cầu Giấy, Hà Nội',
      schoolPhone: '024 3888 9999',
      schoolEmail: 'contact@vietsage.edu.vn',
      currentSemester: 'Học Kỳ I - Năm Học 2026-2027',
      canteenCutoffHour: 10,
      canteenCutoffMinute: 0,
      autoAttendanceNotification: true,
      hn212ApiKey: 'dev-hn212-key',
    };
  }
}
