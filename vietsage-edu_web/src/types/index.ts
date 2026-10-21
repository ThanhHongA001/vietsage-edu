export type Role = 'ADMIN' | 'TEACHER' | 'STAFF' | 'PARENT';

export type SchoolLevel = 'Mầm non' | 'THCS' | 'THPT';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  avatar?: string;
  phone?: string;
}

export interface Teacher {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  department: string; // Tổ chuyên môn: Tổ Mầm non, Toán - Tin, Ngữ Văn, Ngoại Ngữ, KHTN, KHXH...
  schoolLevel: SchoolLevel | 'Toàn trường';
  homeroomClass?: string; // Lớp chủ nhiệm nếu có (vd: Lá 1, 7B2, 10A1)
  subjects: string[]; // Môn giảng dạy
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  avatar: string;
  joinDate: string;
}

export interface EarlyChildhoodProfile {
  heightCm?: number;
  weightKg?: number;
  allergies?: string;
  favoriteActivity?: string;
  healthStatus?: 'Tốt' | 'Bình thường' | 'Cần lưu ý';
}

export interface Student {
  id: string;
  code: string;
  fullName: string;
  dob: string;
  gender: 'Nam' | 'Nữ';
  className: string;
  schoolLevel: SchoolLevel;
  homeroomTeacher: string;
  parentName: string;
  parentPhone: string;
  address: string;
  status: 'STUDYING' | 'SUSPENDED' | 'TRANSFERRED';
  avatar: string;
  canteenRegistered: boolean;
  preschoolProfile?: EarlyChildhoodProfile;
}

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'EXCUSED' | 'UNEXCUSED';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  className: string;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  method: 'FACE' | 'CARD' | 'FINGERPRINT' | 'MANUAL';
  note?: string;
  deviceId?: string;
  deviceName?: string;
}

export interface DeviceHN212 {
  id: string;
  deviceCode: string;
  name: string;
  location: string;
  ipAddress: string;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  lastSeenAt: string;
  totalScansToday: number;
}

export interface HomeworkSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  submittedAt: string;
  status: 'SUBMITTED' | 'GRADED' | 'LATE' | 'NOT_SUBMITTED';
  content?: string;
  fileUrls?: string[];
  score?: number; // Thang 10
  feedback?: string;
  gradedAt?: string;
}

export interface Homework {
  id: string;
  title: string;
  subject: string;
  className: string;
  teacherId: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  attachments?: string[];
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
  submissions: HomeworkSubmission[];
}

export interface EarlyChildhoodEvaluation {
  physicalDevelopment: 'Đạt' | 'Vượt trội' | 'Cần rèn luyện'; // Phát triển thể chất
  cognitiveDevelopment: 'Đạt' | 'Vượt trội' | 'Cần rèn luyện'; // Phát triển nhận thức
  languageDevelopment: 'Đạt' | 'Vượt trội' | 'Cần rèn luyện'; // Phát triển ngôn ngữ
  socialEmotionalDevelopment: 'Đạt' | 'Vượt trội' | 'Cần rèn luyện'; // Tình cảm & Kỹ năng xã hội
  aestheticDevelopment: 'Đạt' | 'Vượt trội' | 'Cần rèn luyện'; // Phát triển thẩm mỹ
  mealsAndSleep: string; // Tình hình ăn ngủ bán trú
  generalComment: string; // Lời nhận xét của cô giáo
  isWellBehaved: boolean; // Bé ngoan trong tuần
}

export interface GradeEntry {
  studentId: string;
  studentCode: string;
  studentName: string;
  className?: string;
  schoolLevel?: SchoolLevel;
  // Dành cho THCS & THPT (Hệ số thang điểm 10):
  scoreOral1?: number;
  scoreOral2?: number;
  score15m1?: number;
  score15m2?: number;
  score1Period?: number;
  scoreMidTerm?: number;
  scoreFinal?: number;
  averageScore?: number;
  // Dành riêng cho Mầm non (Đánh giá theo 5 lĩnh vực phát triển & Bé ngoan):
  preschoolEvaluation?: EarlyChildhoodEvaluation;
}

export interface ClassScheduleItem {
  id: string;
  dayOfWeek: number; // 2 -> 7 (Thứ 2 đến Thứ 7)
  period: number; // 1 -> 5 (hoặc khung giờ hoạt động mầm non)
  timeRange: string;
  subject: string;
  className: string;
  room: string;
  teacherName: string;
  schoolLevel?: SchoolLevel;
}

export interface CanteenMeal {
  id: string;
  date: string;
  dayOfWeek: string;
  mainDish: string;
  sideDish: string;
  soup: string;
  dessert: string;
  nutritionKcal: number;
  specialNote?: string;
  // Khẩu phần riêng cho lứa tuổi mầm non (3 bữa: Sáng, Trưa mềm, Xế chiều):
  preschoolMenu?: {
    morningSnack: string;
    lunchMain: string;
    afternoonSnack: string;
    milkType: string;
  };
}

export interface UniformItem {
  id: string;
  code: string;
  name: string;
  category: 'Áo sơ mi' | 'Quần tây / Váy' | 'Áo thể dục' | 'Áo khoác gió' | 'Bộ mầm non' | 'Ba lô / Phụ kiện';
  gradeGroup: SchoolLevel;
  price: number;
  inStock: number;
  sizes: string[];
  imageUrl: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'TOÀN TRƯỜNG' | 'GIÁO VIÊN' | 'PHỤ HUYNH' | 'KHẨN CẤP';
  targetAudience: string;
  createdAt: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
}
