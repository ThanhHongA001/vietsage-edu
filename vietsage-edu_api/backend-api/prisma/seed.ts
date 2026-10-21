import { PrismaClient, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const adminPassword = await bcrypt.hash('AdminPassword_123!', 12);
  const managerPassword = await bcrypt.hash('ManagerPassword_123!', 12);
  const staffPassword = await bcrypt.hash('StaffPassword_123!', 12);

  // 1. Tạo tài khoản Quản trị viên (ADMIN)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vietsage.edu.vn' },
    update: {},
    create: {
      email: 'admin@vietsage.edu.vn',
      fullName: 'Quản Trị Viên Hệ Thống',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: UserStatus.ACTIVE,
    },
  });

  // 2. Tạo tài khoản Quản lý (MANAGER)
  const manager = await prisma.user.upsert({
    where: { email: 'manager@vietsage.edu.vn' },
    update: {},
    create: {
      email: 'manager@vietsage.edu.vn',
      fullName: 'Quản Lý Đào Tạo & Nhân Sự',
      passwordHash: managerPassword,
      role: 'MANAGER',
      status: UserStatus.ACTIVE,
    },
  });

  // 3. Tạo tài khoản Nhân viên (STAFF)
  const staff = await prisma.user.upsert({
    where: { email: 'staff@vietsage.edu.vn' },
    update: {},
    create: {
      email: 'staff@vietsage.edu.vn',
      fullName: 'Nhân Viên Mẫu',
      passwordHash: staffPassword,
      role: 'STAFF',
      status: UserStatus.ACTIVE,
    },
  });

  // 3.1. Tạo tài khoản Phụ huynh crush001 (PARENT)
  const crush001Password = await bcrypt.hash('500anhem', 12);
  const crush001User = await prisma.user.upsert({
    where: { email: 'crush001@vietsage.edu.vn' },
    update: {},
    create: {
      email: 'crush001@vietsage.edu.vn',
      fullName: 'Phụ Huynh Học Sinh (crush001)',
      passwordHash: crush001Password,
      role: 'PARENT',
      phone: '0988001001',
      status: UserStatus.ACTIVE,
    },
  });

  // 4. Tạo các thiết bị mẫu điểm danh cho 3 cấp học
  const deviceMN = await prisma.device.upsert({
    where: { deviceCode: 'HN212-MAMNON' },
    update: {},
    create: {
      deviceCode: 'HN212-MAMNON',
      name: 'Máy Điểm Danh Cổng Trường Mầm Non VietSage Kids',
      location: 'Cổng Khối Mầm Non - Cơ sở 1',
      isActive: true,
      lastSeenAt: new Date(),
    },
  });

  const deviceTHCS = await prisma.device.upsert({
    where: { deviceCode: 'HN212-THCS' },
    update: {},
    create: {
      deviceCode: 'HN212-THCS',
      name: 'Máy Điểm Danh Khu THCS VietSage',
      location: 'Sảnh Tòa Nhà B - Khối THCS',
      isActive: true,
      lastSeenAt: new Date(),
    },
  });

  const deviceTHPT = await prisma.device.upsert({
    where: { deviceCode: 'HN212-THPT' },
    update: {},
    create: {
      deviceCode: 'HN212-THPT',
      name: 'Máy Điểm Danh Sảnh Chính THPT VietSage',
      location: 'Cổng Chính Khối THPT',
      isActive: true,
      lastSeenAt: new Date(),
    },
  });

  // 5. Tạo giáo viên mẫu đại diện cho 3 cấp
  await prisma.teacher.upsert({
    where: { code: 'GV-MN01' },
    update: {},
    create: {
      code: 'GV-MN01',
      fullName: 'Cô Đặng Minh Châu',
      email: 'chaudm@vietsage.edu.vn',
      phone: '0901 123 456',
      department: 'Khối Mầm Non',
      homeroomClass: 'Lá 1',
      subjects: ['Giáo dục Mầm non', 'Phát triển Kỹ năng'],
      status: 'ACTIVE',
      joinDate: '2021-08-15',
    },
  });

  await prisma.teacher.upsert({
    where: { code: 'GV-CS01' },
    update: {},
    create: {
      code: 'GV-CS01',
      fullName: 'Cô Vũ Thúy Hằng',
      email: 'hangvt@vietsage.edu.vn',
      phone: '0912 345 678',
      department: 'Tổ Tự Nhiên (THCS)',
      homeroomClass: '7B2',
      subjects: ['Khoa học Tự nhiên', 'Toán THCS'],
      status: 'ACTIVE',
      joinDate: '2019-09-01',
    },
  });

  await prisma.teacher.upsert({
    where: { code: 'GV-PT01' },
    update: {},
    create: {
      code: 'GV-PT01',
      fullName: 'ThS. Nguyễn Văn Hùng',
      email: 'hungnv@vietsage.edu.vn',
      phone: '0988 776 655',
      department: 'Tổ Toán - Tin (THPT)',
      homeroomClass: '10A1',
      subjects: ['Toán Đại số 10', 'Toán Hình học 10'],
      status: 'ACTIVE',
      joinDate: '2018-08-01',
    },
  });

  // 6. Tạo học sinh mẫu cho 3 cấp
  await prisma.student.upsert({
    where: { code: 'HS-MN001' },
    update: {},
    create: {
      code: 'HS-MN001',
      fullName: 'Bé Nguyễn Bảo An',
      dob: '2021-04-12',
      gender: 'Nữ',
      className: 'Lá 1',
      homeroomTeacher: 'Cô Đặng Minh Châu',
      parentName: 'Nguyễn Văn Đức',
      parentPhone: '0903 111 222',
      address: 'Số 12 Đường Hoa Hồng, Phường 2, TP.HCM',
      status: 'STUDYING',
      canteenRegistered: true,
    },
  });

  await prisma.student.upsert({
    where: { code: 'HS-CS001' },
    update: {},
    create: {
      code: 'HS-CS001',
      fullName: 'Nguyễn Thị Mai',
      dob: '2013-05-18',
      gender: 'Nữ',
      className: '7B2',
      homeroomTeacher: 'Cô Vũ Thúy Hằng',
      parentName: 'Nguyễn Hoàng Sơn',
      parentPhone: '0912 333 444',
      address: 'Số 45 Đường CMT8, Quận 3, TP.HCM',
      status: 'STUDYING',
      canteenRegistered: true,
    },
  });

  await prisma.student.upsert({
    where: { code: 'HS-PT001' },
    update: {},
    create: {
      code: 'HS-PT001',
      fullName: 'Nguyễn Minh Quân',
      dob: '2010-09-10',
      gender: 'Nam',
      className: '10A1',
      homeroomTeacher: 'ThS. Nguyễn Văn Hùng',
      parentName: 'Nguyễn Văn Thành',
      parentPhone: '0908 999 888',
      address: '28 Đường số 9, TP. Thủ Đức, TP.HCM',
      status: 'STUDYING',
      canteenRegistered: true,
    },
  });

  console.log('✅ Khởi tạo dữ liệu mẫu thành công:');
  console.log(` - Admin:   ${admin.email} (Mật khẩu: AdminPassword_123!)`);
  console.log(` - Manager: ${manager.email} (Mật khẩu: ManagerPassword_123!)`);
  console.log(` - Staff:   ${staff.email} (Mật khẩu: StaffPassword_123!)`);
  console.log(` - Devices: ${deviceMN.deviceCode}, ${deviceTHCS.deviceCode}, ${deviceTHPT.deviceCode}`);
  console.log(' - Cấp học: Mầm non (Lá 1), THCS (7B2), THPT (10A1)');
}

main()
  .catch((error: unknown) => {
    console.error('Lỗi khi seed database:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
