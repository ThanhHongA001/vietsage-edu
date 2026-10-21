import React from 'react';
import {
  Users,
  GraduationCap,
  DoorOpen,
  ScanFace,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Megaphone,
  Plus
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { StorageService } from '../../services/storage';

interface AdminDashboardProps {
  onNavigate: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const teachers = StorageService.getTeachers();
  const students = StorageService.getStudents();
  const devices = StorageService.getDevices();
  const attendance = StorageService.getAttendance();
  const announcements = StorageService.getAnnouncements();

  const totalScans = devices.reduce((acc, d) => acc + d.totalScansToday, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 p-6 text-white shadow-xl shadow-blue-950/10">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-sky-400" />
              <span>Năm học 2026 - 2027 | Học Kỳ I</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Trung Tâm Điều Hành Quản Trị VietSage
            </h1>
            <p className="mt-1 text-sm text-blue-200/90">
              Giám sát toàn diện học vụ, chấm công nhận diện khuôn mặt HN212 và hoạt động bán trú.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('announcements')}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/20 transition"
            >
              <Megaphone className="h-4 w-4" />
              <span>Phát thông báo</span>
            </button>
            <button
              onClick={() => onNavigate('teachers')}
              className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/30 hover:bg-blue-400 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm Giáo Viên</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng Học Sinh"
          value="850"
          subtext="24 lớp toàn trường"
          icon={<GraduationCap className="h-6 w-6" />}
          trend={{ value: '+4.2%', isPositive: true }}
          colorScheme="blue"
        />
        <StatCard
          title="Cán Bộ & Giáo Viên"
          value={teachers.length.toString()}
          subtext="100% đạt chuẩn sư phạm"
          icon={<Users className="h-6 w-6" />}
          colorScheme="indigo"
        />
        <StatCard
          title="Chuyên Cần Hôm Nay"
          value="97.4%"
          subtext="828 / 850 học sinh có mặt"
          icon={<CheckCircle2 className="h-6 w-6" />}
          trend={{ value: '+0.8%', isPositive: true }}
          colorScheme="emerald"
        />
        <StatCard
          title="Lượt Quét HN212"
          value={totalScans.toLocaleString()}
          subtext="4 cổng kết nối thời gian thực"
          icon={<ScanFace className="h-6 w-6" />}
          colorScheme="purple"
        />
      </div>

      {/* 3-Tier Educational Level Overview (Mầm non - THCS - THPT) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-700 text-xs font-black">
                3
              </span>
              Phân Hệ Quản Trị Giáo Dục Theo Cấp Học (Mầm Non • THCS • THPT)
            </h2>
            <p className="text-xs text-slate-500">
              Quy mô học sinh, cấu trúc chương trình và đặc thù đào tạo từng phân khu
            </p>
          </div>
          <button
            onClick={() => onNavigate('students')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Quản lý danh sách lớp</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Cấp Mầm Non */}
          <div className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 to-orange-50/30 p-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-800 ring-1 ring-amber-600/20">
                CẤP MẦM NON (Kids)
              </span>
              <span className="text-xs font-bold text-amber-700">Độ tuổi 3 - 5</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">180</span>
              <span className="text-xs font-medium text-slate-500">bé • 6 nhóm lớp</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600">
              Các lớp: <strong>Mầm 1, Chồi 2, Lá 1</strong>... Đánh giá 5 lĩnh vực phát triển & Bán trú 100%.
            </p>
            <div className="mt-3 pt-3 border-t border-amber-200/50 flex items-center justify-between text-[11px]">
              <span className="text-amber-800 font-semibold">GV phụ trách: Cô Minh Châu, Cô Thu Trang</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Ăn xế & Ngủ trưa</span>
            </div>
          </div>

          {/* Cấp THCS */}
          <div className="rounded-xl border border-teal-200/80 bg-gradient-to-br from-teal-50/60 to-emerald-50/30 p-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-extrabold text-teal-800 ring-1 ring-teal-600/20">
                CẤP TRUNG HỌC CƠ SỞ (THCS)
              </span>
              <span className="text-xs font-bold text-teal-700">Khối 6, 7, 8, 9</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">350</span>
              <span className="text-xs font-medium text-slate-500">học sinh • 10 lớp</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600">
              Các lớp: <strong>6A1, 7B2, 8A1, 9A2</strong>... Chương trình GDPT 2018 & Điểm số học bạ.
            </p>
            <div className="mt-3 pt-3 border-t border-teal-200/50 flex items-center justify-between text-[11px]">
              <span className="text-teal-800 font-semibold">Tổ Tự nhiên & Xã hội THCS</span>
              <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">Thẻ NFC & Face AI</span>
            </div>
          </div>

          {/* Cấp THPT */}
          <div className="rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50/60 to-indigo-50/30 p-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-extrabold text-blue-800 ring-1 ring-blue-600/20">
                CẤP TRUNG HỌC PHỔ THÔNG (THPT)
              </span>
              <span className="text-xs font-bold text-blue-700">Khối 10, 11, 12</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">320</span>
              <span className="text-xs font-medium text-slate-500">học sinh • 8 lớp</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600">
              Các lớp: <strong>10A1, 10A2, 11B2, 12A3</strong>... Định hướng nghề nghiệp & Ôn thi Đại học.
            </p>
            <div className="mt-3 pt-3 border-t border-blue-200/50 flex items-center justify-between text-[11px]">
              <span className="text-blue-800 font-semibold">Tổ Toán - Tin, KHTN, Ngữ Văn</span>
              <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded">Học bạ điện tử</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time HN212 Devices status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base font-bold text-slate-800">
              Trạng Thái Hệ Thống Máy Điểm Danh HN212 (Cổng Trường & Nhà Ăn)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('attendance')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Chi tiết thiết bị</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 hover:border-blue-200 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-700">
                  {device.deviceCode}
                </span>
                <Badge variant={device.status === 'ONLINE' ? 'success' : 'danger'} size="sm">
                  {device.status}
                </Badge>
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-800 line-clamp-1">
                {device.name}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {device.location}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px]">
                <span className="text-slate-500">Hôm nay:</span>
                <span className="font-bold text-blue-600">{device.totalScansToday} lượt</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content 2-Column: Live Attendance Stream & School Announcements */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Live Attendance Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Nhật Ký Điểm Danh Nhận Diện Thời Gian Thực
              </h2>
              <p className="text-xs text-slate-500">
                Đồng bộ tự động từ máy quét HN212 và điểm danh tại lớp
              </p>
            </div>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Xem tất cả
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100">
            {attendance.slice(0, 6).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50/80 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">
                    {record.className}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {record.studentName}
                      </span>
                      <span className="text-xs text-slate-400">({record.studentCode})</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Thiết bị: {record.deviceName || 'Điểm danh thủ công'}</span>
                      {record.note && (
                        <span className="text-amber-600 font-medium italic">
                          • {record.note}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {record.status === 'PRESENT' && (
                      <Badge variant="success" size="sm">Có mặt ({record.checkInTime})</Badge>
                    )}
                    {record.status === 'LATE' && (
                      <Badge variant="warning" size="sm">Đi muộn ({record.checkInTime})</Badge>
                    )}
                    {record.status === 'EXCUSED' && (
                      <Badge variant="info" size="sm">Nghỉ có phép</Badge>
                    )}
                    {record.status === 'UNEXCUSED' && (
                      <Badge variant="danger" size="sm">Vắng không phép</Badge>
                    )}
                  </div>
                  <span className="mt-1 block text-[11px] text-slate-400">
                    Phương thức: {record.method === 'FACE' ? 'Khuôn mặt HN212' : record.method === 'CARD' ? 'Thẻ từ' : 'Giáo viên xác nhận'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Announcements & Quick stats */}
        <div className="space-y-6">
          {/* Announcements Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-800">
                Thông Báo Gần Đây
              </h2>
              <button
                onClick={() => onNavigate('announcements')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Quản lý
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-100/60 transition"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={ann.priority === 'HIGH' ? 'danger' : 'info'}
                      size="sm"
                    >
                      {ann.category}
                    </Badge>
                    <span className="text-[10px] text-slate-400">{ann.createdAt}</span>
                  </div>
                  <h4 className="mt-2 text-xs font-bold text-slate-800 line-clamp-1">
                    {ann.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick shortcuts */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 mb-3">
              Lối Tắt Tác Vụ Thường Dùng
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => onNavigate('students')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-left transition"
              >
                Danh Sách 10A1
              </button>
              <button
                onClick={() => onNavigate('canteen')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-left transition"
              >
                Thực Đơn Tuần
              </button>
              <button
                onClick={() => onNavigate('uniforms')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-left transition"
              >
                Kho Đồng Phục
              </button>
              <button
                onClick={() => onNavigate('settings')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-left transition"
              >
                Cấu Hình HN212
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
