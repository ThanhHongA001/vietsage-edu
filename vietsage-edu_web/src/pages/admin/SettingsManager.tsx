import React, { useState } from 'react';
import {
  Settings,
  Server,
  ShieldCheck,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { ApiService, API_BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const SettingsManager: React.FC = () => {
  const { backendOnline, checkBackendStatus } = useAuth();
  const [schoolName, setSchoolName] = useState('Hệ Thống Trường Học Liên Cấp VietSage Edu (Mầm non - THCS - THPT)');
  const [academicYear, setAcademicYear] = useState('2026 - 2027');
  const [hn212Key, setHn212Key] = useState('dev-hn212-key-viet-sage-2026');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetData = () => {
    if (confirm('Bạn có chắc muốn khôi phục toàn bộ dữ liệu demo về trạng thái ban đầu?')) {
      StorageService.resetAll();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          Cấu Hình Hệ Thống & Tích Hợp HN212
        </h1>
        <p className="text-xs text-slate-500">
          Thiết lập thông tin trường học, khóa API và trạng thái kết nối NestJS Backend
        </p>
      </div>

      {isSaved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-500/20">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Đã lưu thành công cấu hình hệ thống!</span>
        </div>
      )}

      {/* Backend API status card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${backendOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <Server className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Backend API NestJS (D:\Code\vietsage-edu\vietsage-edu_api)
              </h3>
              <p className="text-xs text-slate-500">
                Endpoint: <code>{API_BASE_URL}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                backendOnline
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {backendOnline ? 'Đang hoạt động' : 'Offline (Chạy Mock Data)'}
            </span>
            <button
              onClick={() => checkBackendStatus()}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
              title="Kiểm tra lại kết nối"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-600">
          Hệ thống web được thiết kế tương thích kép: Hoạt động trơn tru với CSDL nội bộ
          (LocalStorage) và tự động đồng bộ sang NestJS REST API khi backend khởi chạy.
        </p>
      </div>

      {/* General Settings Form */}
      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
          Thông Tin Trường Học
        </h3>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Tên cơ sở giáo dục
          </label>
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Niên khóa hiện tại
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Khóa API Thiết Bị HN212 (x-device-api-key)
            </label>
            <input
              type="text"
              value={hn212Key}
              onChange={(e) => setHn212Key(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-2">
          <span className="font-bold text-slate-800 text-xs block">
            Cấu Trúc 3 Cấp Học Đang Kích Hoạt:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/60">
              <span className="font-bold text-amber-900 block text-[11px]">1. Cấp Mầm Non</span>
              <p className="text-[10px] text-amber-700 mt-0.5">Nhà trẻ & Mẫu giáo (Mầm, Chồi, Lá). Đánh giá 5 lĩnh vực phát triển & Bé ngoan.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200/60">
              <span className="font-bold text-teal-900 block text-[11px]">2. Cấp THCS</span>
              <p className="text-[10px] text-teal-700 mt-0.5">Khối 6, 7, 8, 9. Chương trình GDPT mới, sổ điểm hệ số, quản lý chuyên cần thẻ/khuôn mặt.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200/60">
              <span className="font-bold text-blue-900 block text-[11px]">3. Cấp THPT</span>
              <p className="text-[10px] text-blue-700 mt-0.5">Khối 10, 11, 12. Tổ hợp môn định hướng đại học, sổ học bạ điện tử, điểm danh HN212.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3">
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition"
          >
            Lưu Thay Đổi
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-rose-900">Khôi Phục Dữ Liệu Demo</h4>
            <p className="text-[11px] text-rose-700 mt-0.5">
              Đặt lại toàn bộ danh sách điểm danh, bài tập, học sinh về trạng thái ban đầu.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetData}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 shadow-sm"
          >
            Reset Dữ Liệu
          </button>
        </div>
      </div>
    </div>
  );
};
