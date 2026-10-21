import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Bell,
  RefreshCw,
  Search,
  Server,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { role, switchRole, currentUser, backendOnline, checkBackendStatus, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md transition-all lg:px-8">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white shadow-md shadow-blue-500/20">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              VietSage <span className="text-blue-600">Edu</span>
            </span>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-blue-700 ring-1 ring-blue-600/20">
              Mầm Non • THCS • THPT
            </span>
          </div>
          <p className="hidden text-xs text-slate-500 sm:block">
            Hệ thống Quản lý Giáo dục Liên Cấp Thông Minh
          </p>
        </div>
      </div>

      {/* Center: Role Indicator / Switcher */}
      {currentUser.role === 'ADMIN' ? (
        <div className="flex items-center rounded-xl bg-slate-100 p-1 ring-1 ring-slate-200/70">
          <button
            onClick={() => switchRole('ADMIN')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              role === 'ADMIN'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Chuyển sang Cổng Quản Trị Viên (Ban Giám Hiệu)"
          >
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Cổng Admin</span>
          </button>

          <button
            onClick={() => switchRole('TEACHER')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              role === 'TEACHER'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Xem giao diện Cổng Giáo Viên"
          >
            <UserCheck className="h-4 w-4 text-emerald-600" />
            <span>Cổng Giáo Viên</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20">
          <UserCheck className="h-4 w-4 text-emerald-600" />
          <span>Cổng Giáo Viên</span>
          <span className="hidden sm:inline text-[11px] text-emerald-600/80 font-normal">| VietSage Edu Web</span>
        </div>
      )}

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-3">
        {/* Backend API status badge */}
        <button
          onClick={() => checkBackendStatus()}
          className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium md:flex ${
            backendOnline
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20'
              : 'bg-amber-50 text-amber-700 ring-1 ring-amber-500/20'
          }`}
          title={backendOnline ? 'API NestJS kết nối tốt (localhost:3000)' : 'Chế độ CSDL Offline (Bấm để thử kết nối lại)'}
        >
          <Server className="h-3.5 w-3.5" />
          <span>{backendOnline ? 'API: Online' : 'CSDL Demo'}</span>
          <RefreshCw className="h-3 w-3 hover:rotate-180 transition-transform" />
        </button>

        {/* Search shortcut */}
        <div className="relative hidden xl:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm học sinh, GV, lớp..."
            className="h-9 w-48 rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Notification Bell */}
        <button
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
          title="Thông báo"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Current User Pill */}
        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.fullName}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100"
          />
          <div className="hidden text-left lg:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {currentUser.fullName}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              {role === 'ADMIN' ? 'Ban Giám Hiệu' : 'Giáo viên bộ môn & GVCN'}
            </p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition shadow-sm ml-1 cursor-pointer"
          title="Đăng xuất khỏi Cổng Web"
        >
          <LogOut className="h-3.5 w-3.5 text-slate-500 group-hover:text-red-600" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};
