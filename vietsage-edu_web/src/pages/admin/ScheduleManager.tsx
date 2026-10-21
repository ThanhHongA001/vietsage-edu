import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  BarChart3,
  Sparkles,
  Search,
  School
} from 'lucide-react';
import { ClassScheduleItem, Teacher } from '../../types';
import { StorageService } from '../../services/storage';
import { INITIAL_SCHEDULE } from '../../data/mockData';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const ScheduleManager: React.FC = () => {
  const [schedule, setSchedule] = useState<ClassScheduleItem[]>(() => StorageService.getSchedule());
  const [teachers] = useState<Teacher[]>(() => StorageService.getTeachers());

  // Filter & View States
  const [viewMode, setViewMode] = useState<'CLASS' | 'TEACHER' | 'ROOM'>('CLASS');
  const [selectedClass, setSelectedClass] = useState<string>('10A1');
  const [selectedTeacher, setSelectedTeacher] = useState<string>(teachers[0]?.fullName || 'ThS. Nguyễn Văn Hùng');
  const [selectedRoom, setSelectedRoom] = useState<string>('Phòng 301');

  // Modal State for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClassScheduleItem | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // Form Fields
  const [formDay, setFormDay] = useState<number>(2);
  const [formPeriod, setFormPeriod] = useState<number>(1);
  const [formSubject, setFormSubject] = useState<string>('Toán Đại số');
  const [formClass, setFormClass] = useState<string>('10A1');
  const [formTeacher, setFormTeacher] = useState<string>(teachers[0]?.fullName || 'ThS. Nguyễn Văn Hùng');
  const [formRoom, setFormRoom] = useState<string>('Phòng 301');

  // Constants
  const days = [
    { day: 2, label: 'Thứ Hai', short: 'T2' },
    { day: 3, label: 'Thứ Ba', short: 'T3' },
    { day: 4, label: 'Thứ Tư', short: 'T4' },
    { day: 5, label: 'Thứ Năm', short: 'T5' },
    { day: 6, label: 'Thứ Sáu', short: 'T6' },
    { day: 7, label: 'Thứ Bảy', short: 'T7' },
  ];

  const periods = [
    { num: 1, time: '07:15 - 08:00' },
    { num: 2, time: '08:05 - 08:50' },
    { num: 3, time: '09:05 - 09:50' },
    { num: 4, time: '09:55 - 10:40' },
    { num: 5, time: '10:45 - 11:30' },
  ];

  const availableClasses = [
    // Mầm non
    'Lá 1',
    'Chồi 2',
    'Mầm 1',
    // THCS
    '6A1',
    '7B2',
    '8A1',
    '9A2',
    // THPT
    '10A1',
    '10A2',
    '10A3',
    '11A1',
    '11B2',
    '12A1',
    '12A3',
    // Liên cấp
    'Toàn trường'
  ];

  const availableRooms = [
    'Sảnh Lá 1',
    'Phòng Lá 1',
    'Vườn sinh thái',
    'Phòng Ăn Mầm Non',
    'Phòng Nghệ Thuật Kids',
    'Phòng 201 (Khu CS)',
    'Lab KHTN 2',
    'Phòng 301',
    'Phòng 302',
    'Phòng 303',
    'Lab Hóa 1',
    'Lab Lý',
    'Phòng Máy 2',
    'Sân trường',
    'Nhà thi đấu'
  ];

  const availableSubjects = [
    // Mầm non
    'Đón trẻ & Thể dục sáng mầm non',
    'Bé làm quen Chữ cái & Kể chuyện',
    'Hoạt động góc & Khám phá thiên nhiên',
    'Vệ sinh cá nhân & Ăn trưa bán trú',
    'Ăn xế chiều & Tạo hình sắc màu',
    // THCS
    'Ngữ Văn THCS',
    'Toán THCS',
    'Khoa học Tự nhiên',
    'Tiếng Anh THCS',
    'Lịch Sử & Địa Lý',
    // THPT
    'Toán Đại số',
    'Toán Hình học',
    'Toán Ôn tập',
    'Ngữ Văn',
    'Tiếng Anh Quốc Tế',
    'Vật Lý',
    'Hóa Học',
    'Sinh Học',
    'Lịch Sử',
    'Địa Lý',
    'Tin Học',
    'GDCD',
    'Thể Dục',
    'Chào cờ đầu tuần liên cấp',
    'Sinh Hoạt Lớp 10A1',
    'Sinh Hoạt Lớp 10A2',
    'Sinh Hoạt Cuối Tuần'
  ];

  // Helper to persist schedule
  const updateSchedule = (newSchedule: ClassScheduleItem[]) => {
    setSchedule(newSchedule);
    StorageService.saveSchedule(newSchedule);
  };

  // Open modal to add at a specific slot
  const handleOpenAddSlot = (day: number, period: number) => {
    setEditingItem(null);
    setFormDay(day);
    setFormPeriod(period);
    setFormSubject('Toán Đại số');
    setFormClass(viewMode === 'CLASS' ? selectedClass : '10A1');
    setFormTeacher(viewMode === 'TEACHER' ? selectedTeacher : (teachers[0]?.fullName || 'ThS. Nguyễn Văn Hùng'));
    setFormRoom(viewMode === 'ROOM' ? selectedRoom : 'Phòng 301');
    setIsModalOpen(true);
  };

  // Open modal to edit existing slot
  const handleOpenEdit = (item: ClassScheduleItem) => {
    setEditingItem(item);
    setFormDay(item.dayOfWeek);
    setFormPeriod(item.period);
    setFormSubject(item.subject);
    setFormClass(item.className);
    setFormTeacher(item.teacherName);
    setFormRoom(item.room);
    setIsModalOpen(true);
  };

  // Delete slot
  const handleDeleteSlot = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa tiết học này khỏi Thời khóa biểu?')) {
      const updated = schedule.filter((s) => s.id !== id);
      updateSchedule(updated);
    }
  };

  // Check conflicts in real-time
  const conflicts = useMemo(() => {
    const list: { type: 'TEACHER' | 'ROOM'; message: string; targetId: string }[] = [];

    // Check teacher conflict: Same teacher, same day, same period, different class
    for (let i = 0; i < schedule.length; i++) {
      for (let j = i + 1; j < schedule.length; j++) {
        const a = schedule[i];
        const b = schedule[j];
        if (
          a.dayOfWeek === b.dayOfWeek &&
          a.period === b.period &&
          a.teacherName === b.teacherName &&
          a.teacherName !== 'Ban Giám Hiệu' &&
          a.className !== b.className
        ) {
          list.push({
            type: 'TEACHER',
            message: `Trùng lịch GV: ${a.teacherName} được xếp dạy cả lớp ${a.className} và ${b.className} (Thứ ${a.dayOfWeek}, Tiết ${a.period})`,
            targetId: a.id
          });
        }

        // Room conflict: Same room, same day, same period, different class
        if (
          a.dayOfWeek === b.dayOfWeek &&
          a.period === b.period &&
          a.room === b.room &&
          a.room !== 'Sân trường' &&
          a.className !== b.className
        ) {
          list.push({
            type: 'ROOM',
            message: `Trùng phòng: ${a.room} được sử dụng cùng lúc bởi lớp ${a.className} và ${b.className} (Thứ ${a.dayOfWeek}, Tiết ${a.period})`,
            targetId: a.id
          });
        }
      }
    }
    return list;
  }, [schedule]);

  // Form conflict warning when filling the form
  const formConflict = useMemo(() => {
    const periodTime = periods.find((p) => p.num === formPeriod)?.time || '';

    // Check if teacher already busy
    const busyTeacher = schedule.find(
      (s) =>
        s.id !== editingItem?.id &&
        s.dayOfWeek === formDay &&
        s.period === formPeriod &&
        s.teacherName === formTeacher &&
        formTeacher !== 'Ban Giám Hiệu' &&
        s.className !== formClass
    );

    if (busyTeacher) {
      return {
        type: 'error',
        message: `⚠️ Giáo viên "${formTeacher}" đã có lịch dạy lớp "${busyTeacher.className}" vào Thứ ${formDay}, Tiết ${formPeriod} (${periodTime})!`
      };
    }

    // Check if room already used
    const busyRoom = schedule.find(
      (s) =>
        s.id !== editingItem?.id &&
        s.dayOfWeek === formDay &&
        s.period === formPeriod &&
        s.room === formRoom &&
        formRoom !== 'Sân trường' &&
        s.className !== formClass
    );

    if (busyRoom) {
      return {
        type: 'warning',
        message: `⚠️ Phòng "${formRoom}" đang có lớp "${busyRoom.className}" sử dụng vào Thứ ${formDay}, Tiết ${formPeriod}!`
      };
    }

    return null;
  }, [schedule, editingItem, formDay, formPeriod, formTeacher, formRoom, formClass]);

  // Save Slot
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const periodObj = periods.find((p) => p.num === formPeriod);
    const timeRange = periodObj ? periodObj.time : '07:15 - 08:00';

    if (editingItem) {
      const updated = schedule.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              dayOfWeek: formDay,
              period: formPeriod,
              timeRange,
              subject: formSubject,
              className: formClass,
              room: formRoom,
              teacherName: formTeacher
            }
          : item
      );
      updateSchedule(updated);
    } else {
      const newItem: ClassScheduleItem = {
        id: `sch_${Date.now()}`,
        dayOfWeek: formDay,
        period: formPeriod,
        timeRange,
        subject: formSubject,
        className: formClass,
        room: formRoom,
        teacherName: formTeacher
      };
      updateSchedule([...schedule, newItem]);
    }

    setIsModalOpen(false);
  };

  // Reset to default mock data
  const handleResetSchedule = () => {
    if (window.confirm('Khôi phục toàn bộ Thời khóa biểu về dữ liệu chuẩn ban đầu?')) {
      updateSchedule(INITIAL_SCHEDULE);
    }
  };

  // Filter items based on current view mode
  const currentViewItems = useMemo(() => {
    if (viewMode === 'CLASS') {
      return schedule.filter((s) => s.className === selectedClass || s.className === 'Toàn trường');
    }
    if (viewMode === 'TEACHER') {
      return schedule.filter((s) => s.teacherName === selectedTeacher || s.teacherName === 'Ban Giám Hiệu');
    }
    return schedule.filter((s) => s.room === selectedRoom);
  }, [schedule, viewMode, selectedClass, selectedTeacher, selectedRoom]);

  // Calculate teacher workload stats
  const teacherStats = useMemo(() => {
    return teachers.map((t) => {
      const teacherSlots = schedule.filter((s) => s.teacherName === t.fullName);
      const classesAssigned = Array.from(new Set(teacherSlots.map((s) => s.className)));
      return {
        ...t,
        totalPeriods: teacherSlots.length,
        classes: classesAssigned
      };
    });
  }, [teachers, schedule]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2.5">
            <CalendarDays className="h-7 w-7 text-blue-600" />
            Phân Bổ & Quản Lý Thời Khóa Biểu
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Xếp lịch giảng dạy tuần cho giáo viên, quản lý phòng học và thời khóa biểu các lớp
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <BarChart3 className="h-4 w-4 text-emerald-600" />
            Định mức giờ dạy ({teachers.length} GV)
          </button>

          <button
            onClick={handleResetSchedule}
            title="Khôi phục TKB gốc"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            Đặt lại
          </button>

          <button
            onClick={() => handleOpenAddSlot(2, 1)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            Phân Bổ Tiết Mới
          </button>
        </div>
      </div>

      {/* Conflict Alert Banner if any */}
      {conflicts.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5 text-amber-900 font-bold text-xs sm:text-sm">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <span>Phát hiện {conflicts.length} xung đột lịch cần kiểm tra:</span>
          </div>
          <div className="mt-2 space-y-1 pl-7">
            {conflicts.slice(0, 3).map((c, i) => (
              <p key={i} className="text-xs text-amber-800">
                • {c.message}
              </p>
            ))}
            {conflicts.length > 3 && (
              <p className="text-[11px] text-amber-700 font-semibold">
                + còn {conflicts.length - 3} xung đột khác...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Control & View Filters Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setViewMode('CLASS')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === 'CLASS'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <School className="h-3.5 w-3.5" />
              Xem theo Lớp học
            </button>
            <button
              onClick={() => setViewMode('TEACHER')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === 'TEACHER'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Xem theo Giáo viên
            </button>
            <button
              onClick={() => setViewMode('ROOM')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === 'ROOM'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              Xem theo Phòng học
            </button>
          </div>

          {/* Active Target Selector Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {viewMode === 'CLASS' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Chọn Lớp:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {availableClasses.map((c) => (
                    <option key={c} value={c}>
                      {c === 'Toàn trường' ? 'Toàn trường (Sinh hoạt chung)' : `Lớp ${c}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {viewMode === 'TEACHER' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Chọn Giáo viên:</span>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.fullName}>
                      {t.fullName} ({t.department})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {viewMode === 'ROOM' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Chọn Phòng:</span>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {availableRooms.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Đã xếp: <strong className="text-blue-600 font-bold">{currentViewItems.length}</strong> tiết/tuần
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Interactive Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700">
                <th className="py-3 px-3 w-32 text-center font-bold">Tiết / Giờ</th>
                {days.map((d) => (
                  <th key={d.day} className="py-3 px-4 text-center font-bold border-l border-slate-200 min-w-[150px]">
                    <div className="text-slate-800 font-bold">{d.label}</div>
                    <span className="text-[10px] text-slate-400 font-normal">Buổi Sáng</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {periods.map((p) => (
                <tr key={p.num} className="hover:bg-slate-50/30 transition">
                  {/* Period column */}
                  <td className="py-4 px-3 text-center bg-slate-50/60 border-r border-slate-200">
                    <div className="font-black text-slate-800 text-sm">Tiết {p.num}</div>
                    <span className="font-mono text-[10px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {p.time}
                    </span>
                  </td>

                  {/* Days cells */}
                  {days.map((d) => {
                    const cellItem = currentViewItems.find(
                      (s) => s.dayOfWeek === d.day && s.period === p.num
                    );

                    // Check if this specific cell has conflict
                    const hasConflict = cellItem && conflicts.some((c) => c.targetId === cellItem.id);

                    return (
                      <td key={d.day} className="p-2 border-l border-slate-200 align-top h-24">
                        {cellItem ? (
                          <div
                            onClick={() => handleOpenEdit(cellItem)}
                            className={`group relative p-2.5 rounded-xl border transition cursor-pointer shadow-sm ${
                              hasConflict
                                ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-400 text-amber-950'
                                : cellItem.className === '10A1'
                                ? 'bg-blue-50/90 border-blue-200 text-blue-950 hover:border-blue-300'
                                : 'bg-emerald-50/90 border-emerald-200 text-emerald-950 hover:border-emerald-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-bold text-xs truncate leading-tight">
                                {cellItem.subject}
                              </span>
                              {hasConflict && (
                                <span title="Phát hiện xung đột lịch" className="shrink-0">
                                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                                </span>
                              )}
                            </div>

                            <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-600">
                              {viewMode !== 'CLASS' && (
                                <div className="flex items-center gap-1 font-semibold text-blue-700">
                                  <School className="h-3 w-3" />
                                  <span>{cellItem.className}</span>
                                </div>
                              )}
                              {viewMode !== 'TEACHER' && (
                                <div className="flex items-center gap-1 text-slate-600 truncate">
                                  <Users className="h-3 w-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{cellItem.teacherName}</span>
                                </div>
                              )}
                              {viewMode !== 'ROOM' && (
                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                                  <span>{cellItem.room}</span>
                                </div>
                              )}
                            </div>

                            {/* Quick Action buttons on hover */}
                            <div className="absolute top-1.5 right-1.5 hidden group-hover:flex items-center gap-1 bg-white/95 rounded-lg p-0.5 shadow border border-slate-200">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEdit(cellItem);
                                }}
                                className="p-1 text-slate-500 hover:text-blue-600 rounded transition"
                                title="Chỉnh sửa"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteSlot(cellItem.id, e)}
                                className="p-1 text-slate-500 hover:text-rose-600 rounded transition"
                                title="Xóa tiết"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenAddSlot(d.day, p.num)}
                            className="w-full h-full min-h-[5rem] rounded-xl border border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-blue-600 group"
                          >
                            <Plus className="h-4 w-4 transition group-hover:scale-110" />
                            <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition">
                              Thêm tiết
                            </span>
                          </button>
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

      {/* Modal Add / Edit Slot */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Chỉnh Sửa Tiết Dạy' : 'Phân Bổ Tiết Dạy Mới'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveSlot} className="space-y-4">
          {formConflict && (
            <div
              className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2 ${
                formConflict.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{formConflict.message}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Thứ trong tuần
              </label>
              <select
                value={formDay}
                onChange={(e) => setFormDay(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                {days.map((d) => (
                  <option key={d.day} value={d.day}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tiết học & Khung giờ
              </label>
              <select
                value={formPeriod}
                onChange={(e) => setFormPeriod(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                {periods.map((p) => (
                  <option key={p.num} value={p.num}>
                    Tiết {p.num} ({p.time})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lớp học
              </label>
              <select
                value={formClass}
                onChange={(e) => setFormClass(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                {availableClasses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Môn học
              </label>
              <select
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                {availableSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Giáo viên phụ trách
              </label>
              <select
                value={formTeacher}
                onChange={(e) => setFormTeacher(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                <option value="Ban Giám Hiệu">Ban Giám Hiệu (Chào cờ/Chung)</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.fullName}>
                    {t.fullName} - {t.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phòng học
              </label>
              <select
                value={formRoom}
                onChange={(e) => setFormRoom(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                {availableRooms.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
            {editingItem ? (
              <button
                type="button"
                onClick={() => {
                  handleDeleteSlot(editingItem.id);
                  setIsModalOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition"
              >
                <Trash2 className="h-4 w-4" />
                Xóa tiết
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition"
              >
                {editingItem ? 'Lưu Thay Đổi' : 'Xác Nhận Phân Bổ'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal Workload Stats */}
      <Modal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        title="Thống Kê Định Mức Giờ Dạy Của Giáo Viên"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Theo dõi tổng số tiết/tuần thực tế so với định mức tiêu chuẩn (18 tiết/tuần cho bậc THPT)
          </p>

          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
            {teacherStats.map((t) => {
              const standard = 18;
              const percentage = Math.min(100, Math.round((t.totalPeriods / standard) * 100));

              return (
                <div key={t.id} className="p-3.5 hover:bg-slate-50/70 transition flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.fullName} className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200" />
                    <div>
                      <div className="font-bold text-xs text-slate-800">{t.fullName}</div>
                      <div className="text-[11px] text-slate-400">
                        {t.department} • {t.homeroomClass ? `CN ${t.homeroomClass}` : 'Bộ môn'}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {t.classes.map((c) => (
                          <span key={c} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right w-44">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-sm font-black text-slate-900">{t.totalPeriods}</span>
                      <span className="text-xs text-slate-400">/ {standard} tiết</span>
                      <Badge
                        variant={
                          t.totalPeriods >= 18
                            ? 'success'
                            : t.totalPeriods >= 12
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {t.totalPeriods >= 18 ? 'Đạt chuẩn' : 'Chưa đủ'}
                      </Badge>
                    </div>

                    <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          t.totalPeriods >= 18 ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsStatsModalOpen(false)}
              className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
