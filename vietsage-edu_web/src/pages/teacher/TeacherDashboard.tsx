import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  ClipboardCheck,
  BookOpenCheck,
  TableProperties,
  Sparkles,
  School
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { TeacherTab } from '../../components/layout/TeacherSidebar';

interface TeacherDashboardProps {
  onNavigate: (tab: TeacherTab) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const { currentTeacher } = useAuth();
  const schedule = StorageService.getSchedule();
  const homeworks = StorageService.getHomeworks();
  const attendance = StorageService.getAttendance();

  // Find classes today (Thứ 2 = dayOfWeek 2)
  const todayClasses = schedule.filter((s) => s.dayOfWeek === 2 && s.teacherName === currentTeacher.fullName);
  const pendingGrading = homeworks.reduce((acc, hw) => acc + (hw.submittedCount - hw.gradedCount), 0);

  return (
    <div className="space-y-6">
      {/* Teacher Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 p-6 text-white shadow-xl shadow-emerald-950/10">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <School className="h-4 w-4 text-emerald-300" />
              <span>Lớp Chủ Nhiệm: {currentTeacher.homeroomClass || 'Bộ môn'}</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Xin chào, {currentTeacher.fullName}!
            </h1>
            <p className="mt-1 text-sm text-emerald-100/90">
              Hôm nay bạn có <strong>{todayClasses.length} tiết giảng dạy</strong> và <strong>{pendingGrading} bài tập học sinh chờ chấm</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-900 shadow-md hover:bg-emerald-50 transition"
            >
              <ClipboardCheck className="h-4 w-4 text-emerald-600" />
              <span>Điểm Danh {currentTeacher.homeroomClass ? `Lớp ${currentTeacher.homeroomClass}` : 'Học Sinh'}</span>
            </button>
            <button
              onClick={() => onNavigate('homework')}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-500 transition"
            >
              <BookOpenCheck className="h-4 w-4" />
              <span>Chấm Bài Tập ({pendingGrading})</span>
            </button>
          </div>
        </div>

        {/* Glow */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={`Sĩ Số Chủ Nhiệm (${currentTeacher.homeroomClass || 'Bộ môn'})`}
          value={currentTeacher.schoolLevel === 'Mầm non' ? '25 Bé' : '38 Học Sinh'}
          subtext="Có mặt 100% • Sức khỏe tốt"
          icon={<School className="h-6 w-6" />}
          colorScheme="emerald"
        />
        <StatCard
          title="Tiết Dạy Hôm Nay"
          value={`${todayClasses.length} Tiết`}
          subtext="Tiết 2, 3 (Phòng 301)"
          icon={<Clock className="h-6 w-6" />}
          colorScheme="blue"
        />
        <StatCard
          title="Bài Tập Chờ Chấm"
          value={pendingGrading.toString()}
          subtext="Môn Toán Đại số 10A1"
          icon={<BookOpenCheck className="h-6 w-6" />}
          trend={{ value: 'Cần hoàn thành', isPositive: false }}
          colorScheme="amber"
        />
        <StatCard
          title="Chấm Công Của Bạn"
          value="Đã Check-in"
          subtext="07:05 tại Máy Hiệu Bộ HN212"
          icon={<CheckCircle2 className="h-6 w-6" />}
          colorScheme="purple"
        />
      </div>

      {/* 2-Column: Today's Schedule & Quick Attendance View */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's Teaching Schedule */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Lịch Dạy Hôm Nay (Thứ Hai)
              </h2>
              <p className="text-xs text-slate-500">
                Lịch trình giảng dạy và phòng học theo thời khóa biểu
              </p>
            </div>
            <button
              onClick={() => onNavigate('schedule')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Xem cả tuần</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todayClasses.length > 0 ? (
              todayClasses.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:border-emerald-200 hover:bg-emerald-50/30 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-800 text-sm">
                      T{item.period}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.subject}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Lớp: <strong className="text-slate-700">{item.className}</strong> • Phòng:{' '}
                        <strong className="text-slate-700">{item.room}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      {item.timeRange}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                Không có tiết dạy nào vào buổi hôm nay.
              </p>
            )}
          </div>
        </div>

        {/* Homeroom Attendance Snapshot */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">
              Điểm Danh Lớp 10A1
            </h2>
            <Badge variant="success" size="sm">Hôm Nay</Badge>
          </div>

          <div className="rounded-xl bg-emerald-50/60 p-4 border border-emerald-100">
            <div className="flex items-center justify-between text-xs text-emerald-900">
              <span className="font-semibold">Tỷ lệ hiện diện</span>
              <span className="font-bold">97.4%</span>
            </div>
            <div className="mt-2 w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '97.4%' }}></div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-emerald-200/50">
              <div>
                <span className="text-[10px] text-slate-500 block">Có mặt</span>
                <span className="font-bold text-emerald-700">37</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Đi muộn</span>
                <span className="font-bold text-amber-600">1</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Có phép</span>
                <span className="font-bold text-blue-600">1</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Lưu ý chuyên cần:</p>
            <div className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 space-y-1">
              <p>• <strong>Phạm Đức Huy</strong>: Phụ huynh xin phép nghỉ khám bệnh sáng nay.</p>
              <p>• <strong>Trần Gia Bảo</strong>: Vào cổng lúc 07:22 (muộn 22 phút do tắc đường).</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('attendance')}
            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition shadow-sm"
          >
            Mở Bảng Điểm Danh Chi Tiết
          </button>
        </div>
      </div>
    </div>
  );
};
