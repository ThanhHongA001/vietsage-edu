import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpenCheck,
  TableProperties,
  CalendarDays,
  Contact,
  UserCheck2,
  ChevronDown
} from 'lucide-react';
import { INITIAL_TEACHERS } from '../../data/mockData';

export type TeacherTab =
  | 'dashboard'
  | 'attendance'
  | 'homework'
  | 'gradebook'
  | 'schedule'
  | 'students'
  | 'checkin';

interface TeacherSidebarProps {
  currentTab: TeacherTab;
  onSelectTab: (tab: TeacherTab) => void;
}

export const TeacherSidebar: React.FC<TeacherSidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentTeacher, setCurrentTeacher } = useAuth();
  const [showTeacherSelect, setShowTeacherSelect] = React.useState(false);

  const hrClass = currentTeacher.homeroomClass;
  const menuItems: { id: TeacherTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Bàn Làm Việc',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      id: 'attendance',
      label: 'Điểm Danh Lớp Học',
      icon: <ClipboardCheck className="h-5 w-5" />,
      badge: hrClass ? `Lớp ${hrClass}` : undefined
    },
    {
      id: 'homework',
      label: 'Bài Tập & Chấm Điểm',
      icon: <BookOpenCheck className="h-5 w-5" />,
      badge: 'Mới'
    },
    {
      id: 'gradebook',
      label: 'Sổ Điểm & Đánh Giá',
      icon: <TableProperties className="h-5 w-5" />
    },
    {
      id: 'schedule',
      label: 'Lịch Giảng Dạy',
      icon: <CalendarDays className="h-5 w-5" />
    },
    {
      id: 'students',
      label: 'Học Sinh & Liên Lạc',
      icon: <Contact className="h-5 w-5" />,
      badge: hrClass ? hrClass : undefined
    },
    {
      id: 'checkin',
      label: 'Chấm Công Cá Nhân',
      icon: <UserCheck2 className="h-5 w-5" />
    }
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between py-4 select-none">
      <div>
        {/* Active Teacher Card with Switcher */}
        <div className="px-4 pb-3">
          <div className="relative">
            <button
              onClick={() => setShowTeacherSelect(!showTeacherSelect)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-emerald-50/80 border border-emerald-200/80 hover:bg-emerald-100/60 transition text-left"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={currentTeacher.avatar}
                  alt={currentTeacher.fullName}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-400"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {currentTeacher.fullName}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold truncate">
                    GVCN {currentTeacher.homeroomClass || 'Bộ môn'}
                  </p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-emerald-600 shrink-0" />
            </button>

            {showTeacherSelect && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1 max-h-56 overflow-y-auto">
                <p className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400">
                  Chọn Giáo Viên Mô Phỏng:
                </p>
                {INITIAL_TEACHERS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentTeacher(t);
                      setShowTeacherSelect(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-slate-50 transition ${
                      t.id === currentTeacher.id ? 'bg-emerald-50 font-semibold text-emerald-700' : 'text-slate-700'
                    }`}
                  >
                    <img src={t.avatar} className="h-6 w-6 rounded-full object-cover" />
                    <div className="truncate">
                      <p className="truncate">{t.fullName}</p>
                      <p className="text-[10px] text-slate-400">{t.department}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Homeroom shortcut */}
      <div className="px-4 pt-4 border-t border-slate-100">
        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
          <p className="text-xs font-bold text-slate-800">
            Lớp Chủ Nhiệm: {currentTeacher.homeroomClass || 'Chưa phân công'}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
            <span>Sĩ số: 38 học sinh</span>
            <span className="text-emerald-600 font-bold">Vắng: 1</span>
          </div>
          <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '97.4%' }}></div>
          </div>
        </div>
      </div>
    </aside>
  );
};
