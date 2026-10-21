import React, { useState, useMemo } from 'react';
import { CalendarDays, Clock, MapPin, School, BookOpen, User, Users } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';

export const TeacherSchedule: React.FC = () => {
  const { currentTeacher } = useAuth();
  const schedule = StorageService.getSchedule();

  // Mode: 'MY_SCHEDULE' (Lịch cá nhân) | 'HOMEROOM' (Lớp chủ nhiệm)
  const [viewMode, setViewMode] = useState<'MY_SCHEDULE' | 'HOMEROOM'>('MY_SCHEDULE');

  const days = [
    { day: 2, label: 'Thứ Hai' },
    { day: 3, label: 'Thứ Ba' },
    { day: 4, label: 'Thứ Tư' },
    { day: 5, label: 'Thứ Năm' },
    { day: 6, label: 'Thứ Sáu' },
    { day: 7, label: 'Thứ Bảy' },
  ];

  const isPreschool = currentTeacher.schoolLevel === 'Mầm non';

  const periods = useMemo(() => {
    if (isPreschool) {
      return [
        { num: 1, time: '07:30 - 08:30', label: 'Đón trẻ & Thể dục sáng' },
        { num: 2, time: '08:30 - 09:15', label: 'Hoạt động học có chủ đích' },
        { num: 3, time: '09:30 - 10:30', label: 'Hoạt động góc / Ngoài trời' },
        { num: 4, time: '10:45 - 11:30', label: 'Ăn trưa bán trú' },
        { num: 5, time: '14:00 - 15:00', label: 'Ăn xế & Sinh hoạt chiều' },
      ];
    }
    return [
      { num: 1, time: '07:15 - 08:00', label: 'Tiết 1' },
      { num: 2, time: '08:05 - 08:50', label: 'Tiết 2' },
      { num: 3, time: '09:05 - 09:50', label: 'Tiết 3' },
      { num: 4, time: '09:55 - 10:40', label: 'Tiết 4' },
      { num: 5, time: '10:45 - 11:30', label: 'Tiết 5' },
    ];
  }, [isPreschool]);

  // Filter schedule based on current mode
  const filteredSchedule = useMemo(() => {
    if (viewMode === 'MY_SCHEDULE') {
      return schedule.filter(
        (s) => s.teacherName === currentTeacher.fullName || s.teacherName === 'Ban Giám Hiệu'
      );
    }
    // Homeroom class schedule
    const hr = currentTeacher.homeroomClass;
    if (!hr) return [];
    return schedule.filter((s) => s.className === hr || s.className === 'Toàn trường');
  }, [schedule, viewMode, currentTeacher]);

  // Total periods count
  const myPeriodsCount = useMemo(() => {
    return schedule.filter((s) => s.teacherName === currentTeacher.fullName).length;
  }, [schedule, currentTeacher]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-emerald-600" />
            Thời Khóa Biểu & Lịch Giảng Dạy
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lịch trình các tiết dạy trong tuần của giáo viên {currentTeacher.fullName} ({currentTeacher.department})
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('MY_SCHEDULE')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === 'MY_SCHEDULE'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              Lịch Dạy Của Tôi ({myPeriodsCount} tiết)
            </button>

            {currentTeacher.homeroomClass && (
              <button
                onClick={() => setViewMode('HOMEROOM')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === 'HOMEROOM'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <School className="h-3.5 w-3.5" />
                TKB Lớp Chủ Nhiệm ({currentTeacher.homeroomClass})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Timetable Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700">
                <th className="py-3 px-3 w-28 text-center font-bold">Tiết / Giờ</th>
                {days.map((d) => (
                  <th key={d.day} className="py-3 px-4 text-center font-bold border-l border-slate-200 min-w-[130px]">
                    <div className="text-slate-800 font-bold">{d.label}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {periods.map((p) => (
                <tr key={p.num} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-3 text-center bg-slate-50/40 border-r border-slate-200">
                    <div className="font-black text-slate-800 text-xs leading-tight">{p.label}</div>
                    <span className="font-mono text-[10px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {p.time}
                    </span>
                  </td>

                  {days.map((d) => {
                    const cellItem = filteredSchedule.find(
                      (s) => s.dayOfWeek === d.day && s.period === p.num
                    );

                    return (
                      <td key={d.day} className="py-3 px-2 border-l border-slate-200 align-top h-24">
                        {cellItem ? (
                          <div
                            className={`p-2.5 rounded-xl border transition ${
                              cellItem.className === '10A1'
                                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950 shadow-sm'
                                : 'bg-blue-50/90 border-blue-200 text-blue-950 shadow-sm'
                            }`}
                          >
                            <div className="font-bold text-xs truncate leading-tight">{cellItem.subject}</div>
                            
                            <div className="flex items-center justify-between mt-2 text-[11px] font-semibold text-slate-600">
                              <span className="rounded bg-white/80 px-1.5 py-0.5 shadow-2xs font-mono">
                                {cellItem.className}
                              </span>
                              <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                                <MapPin className="h-3 w-3 text-slate-400" />
                                {cellItem.room}
                              </span>
                            </div>

                            {viewMode === 'HOMEROOM' && (
                              <div className="mt-1 text-[10px] text-slate-500 truncate">
                                GV: {cellItem.teacherName}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center text-slate-300 text-[11px]">
                            -
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
