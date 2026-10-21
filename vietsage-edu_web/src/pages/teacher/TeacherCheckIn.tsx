import React, { useState } from 'react';
import {
  UserCheck2,
  ScanFace,
  CheckCircle2,
  Clock,
  Calendar,
  Building,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';

export const TeacherCheckIn: React.FC = () => {
  const { currentTeacher } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('07:05:22');
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [justToggled, setJustToggled] = useState<string | null>(null);

  const handleManualToggle = () => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    if (isCheckedIn && !checkOutTime) {
      setCheckOutTime(timeStr);
      setJustToggled(`Đã check-out thành công lúc ${timeStr}!`);
    } else {
      setIsCheckedIn(true);
      setCheckInTime(timeStr);
      setCheckOutTime(null);
      setJustToggled(`Đã check-in thành công lúc ${timeStr}!`);
    }
    setTimeout(() => setJustToggled(null), 4000);
  };

  const history = [
    { date: '18/10/2026', checkIn: '07:05:22', checkOut: checkOutTime || 'Chưa ra', device: 'HN212 Văn Phòng Hiệu Bộ', status: 'Đúng giờ' },
    { date: '17/10/2026', checkIn: '07:08:15', checkOut: '17:15:00', device: 'HN212 Văn Phòng Hiệu Bộ', status: 'Đúng giờ' },
    { date: '16/10/2026', checkIn: '07:02:40', checkOut: '17:30:10', device: 'HN212 Cổng Chính A', status: 'Đúng giờ' },
    { date: '15/10/2026', checkIn: '07:11:05', checkOut: '16:55:00', device: 'HN212 Văn Phòng Hiệu Bộ', status: 'Đúng giờ' },
    { date: '14/10/2026', checkIn: '06:58:30', checkOut: '17:05:40', device: 'HN212 Văn Phòng Hiệu Bộ', status: 'Đúng giờ' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          Chấm Công & Giờ Giảng Dạy Của Giáo Viên
        </h1>
        <p className="text-xs text-slate-500">
          Dữ liệu nhận diện khuôn mặt tự động từ máy chấm công HN212 tại Tòa Hiệu Bộ
        </p>
      </div>

      {justToggled && (
        <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 ring-1 ring-emerald-500/20 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{justToggled}</span>
        </div>
      )}

      {/* Today's Punch Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ScanFace className="h-8 w-8" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Hôm Nay: {new Date().toLocaleDateString('vi-VN')}
              </span>
              <h3 className="text-lg font-black text-slate-900">
                {currentTeacher.fullName} ({currentTeacher.code})
              </h3>
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Đã ghi nhận ca làm việc tại trường</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleManualToggle}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition"
          >
            {!checkOutTime ? 'Bấm Điểm Danh Check-out' : 'Check-in Lại'}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4 text-xs">
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-[11px] text-slate-400 block">Giờ vào (Check-in):</span>
            <span className="text-sm font-bold text-slate-800">{checkInTime}</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-[11px] text-slate-400 block">Giờ ra (Check-out):</span>
            <span className="text-sm font-bold text-slate-800">{checkOutTime || 'Chưa ghi nhận'}</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-[11px] text-slate-400 block">Thiết bị quét:</span>
            <span className="text-xs font-bold text-emerald-700">HN212 Văn Phòng</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-[11px] text-slate-400 block">Trạng thái:</span>
            <span className="text-xs font-bold text-emerald-600">Hợp lệ (Đúng giờ)</span>
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">
            Lịch Sử Chấm Công 5 Ngày Gần Nhất
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 font-semibold text-slate-600">
                <th className="py-3 px-4">Ngày</th>
                <th className="py-3 px-4">Giờ Vào</th>
                <th className="py-3 px-4">Giờ Ra</th>
                <th className="py-3 px-4">Thiết Bị Ghi Nhận</th>
                <th className="py-3 px-4 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-800">{row.date}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-700">{row.checkIn}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{row.checkOut}</td>
                  <td className="py-3 px-4 text-slate-600">{row.device}</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">{row.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
