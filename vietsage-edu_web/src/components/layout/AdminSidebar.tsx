import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  ScanFace,
  UtensilsCrossed,
  Shirt,
  Megaphone,
  Settings,
  HelpCircle
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'teachers'
  | 'students'
  | 'schedule'
  | 'attendance'
  | 'canteen'
  | 'uniforms'
  | 'announcements'
  | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentTab, onSelectTab }) => {
  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Tổng Quan Trường Học',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      id: 'teachers',
      label: 'Quản Lý Giáo Viên',
      icon: <Users className="h-5 w-5" />,
      badge: '5'
    },
    {
      id: 'students',
      label: 'Học Sinh & Lớp Học',
      icon: <GraduationCap className="h-5 w-5" />,
      badge: '8'
    },
    {
      id: 'schedule',
      label: 'Thời Khóa Biểu & Lịch Dạy',
      icon: <CalendarDays className="h-5 w-5" />,
      badge: 'Mới'
    },
    {
      id: 'attendance',
      label: 'Chấm Công & HN212',
      icon: <ScanFace className="h-5 w-5" />,
      badge: 'Live'
    },
    {
      id: 'canteen',
      label: 'Bán Trú & Nhà Ăn',
      icon: <UtensilsCrossed className="h-5 w-5" />
    },
    {
      id: 'uniforms',
      label: 'Quản Lý Đồng Phục',
      icon: <Shirt className="h-5 w-5" />
    },
    {
      id: 'announcements',
      label: 'Thông Báo Nhà Trường',
      icon: <Megaphone className="h-5 w-5" />,
      badge: '3'
    },
    {
      id: 'settings',
      label: 'Cấu Hình Hệ Thống',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between py-4 select-none">
      <div>
        <div className="px-4 pb-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Khu vực Quản trị (Admin)
          </p>
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
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
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
                        : item.badge === 'Live'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
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

      {/* Footer Info */}
      <div className="px-4 pt-4 border-t border-slate-100">
        <div className="rounded-xl bg-blue-50/70 p-3 ring-1 ring-blue-500/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <span>Hỗ trợ kỹ thuật</span>
          </div>
          <p className="mt-1 text-[11px] text-blue-700/80">
            Hotline IT: 024 3888 9999
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            VietSage Education Cloud © 2026
          </p>
        </div>
      </div>
    </aside>
  );
};
