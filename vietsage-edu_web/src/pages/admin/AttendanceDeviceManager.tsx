import React, { useState } from 'react';
import {
  ScanFace,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Download,
  Filter,
  Calendar,
  Layers
} from 'lucide-react';
import { DeviceHN212, AttendanceRecord } from '../../types';
import { StorageService } from '../../services/storage';
import { ApiService } from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const AttendanceDeviceManager: React.FC = () => {
  const [devices, setDevices] = useState<DeviceHN212[]>(() => StorageService.getDevices());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() =>
    StorageService.getAttendance()
  );
  const [filterClass, setFilterClass] = useState('ALL');
  const [filterMethod, setFilterMethod] = useState('ALL');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState<string | null>(null);

  // Simulate an instant HN212 Face Scan Event
  const handleSimulateScan = async (device: DeviceHN212) => {
    setIsSimulating(true);
    setSimulationMessage(null);

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const dateStr = now.toISOString().split('T')[0];

    const isPreschool = device.deviceCode.includes('MAMNON') || device.name.toLowerCase().includes('mầm non');
    const isTHCS = device.deviceCode.includes('THCS') || device.name.toLowerCase().includes('thcs');

    const sampleStudent = isPreschool
      ? { id: 'hs_mn_001', code: 'VS-MN-001', name: 'Bé Nguyễn Bảo An', className: 'Lá 1' }
      : isTHCS
      ? { id: 'hs_cs_001', code: 'VS-CS-001', name: 'Nguyễn Thị Mai', className: '7B2' }
      : { id: 'hs_001', code: 'VS-2026-001', name: 'Nguyễn Minh Quân', className: '10A1' };

    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      studentId: sampleStudent.id,
      studentCode: sampleStudent.code,
      studentName: sampleStudent.name,
      className: sampleStudent.className,
      date: dateStr,
      status: 'PRESENT',
      checkInTime: timeStr,
      method: 'FACE',
      deviceId: device.id,
      deviceName: device.name
    };

    // Update local state
    const updatedAttendance = [newRecord, ...attendance];
    setAttendance(updatedAttendance);
    StorageService.saveAttendance(updatedAttendance);

    // Update device scan count
    const updatedDevices = devices.map((d) =>
      d.id === device.id
        ? {
            ...d,
            totalScansToday: d.totalScansToday + 1,
            lastSeenAt: `${dateStr} ${timeStr}`
          }
        : d
    );
    setDevices(updatedDevices);
    StorageService.saveDevices(updatedDevices);

    // Also send to backend API adapter if active
    const backendResult = await ApiService.sendHN212Event({
      eventId: `sim_${Date.now()}`,
      deviceCode: device.deviceCode,
      userId: sampleStudent.id,
      occurredAt: now.toISOString(),
      method: 'FACE',
      direction: 'CHECK_IN'
    });

    setIsSimulating(false);
    setSimulationMessage(
      `Đã nhận diện thành công: ${sampleStudent.name} (${sampleStudent.className}) tại ${device.name} lúc ${timeStr}` +
        (backendResult ? ' (Đã gửi vào NestJS API)' : ' (Đã lưu vào bộ nhớ hệ thống)')
    );

    setTimeout(() => setSimulationMessage(null), 6000);
  };

  const exportCSV = () => {
    const headers = ['Mã HS,Họ Tên,Lớp,Ngày,Giờ vào,Giờ ra,Trạng thái,Phương thức,Thiết bị,Ghi chú\n'];
    const rows = attendance.map((a) =>
      [
        a.studentCode,
        `"${a.studentName}"`,
        a.className,
        a.date,
        a.checkInTime || '',
        a.checkOutTime || '',
        a.status,
        a.method,
        `"${a.deviceName || ''}"`,
        `"${a.note || ''}"`
      ].join(',')
    );

    const blob = new Blob([headers.concat(rows.join('\n')).join('')], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Diem_danh_VietSage_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAttendance = attendance.filter((a) => {
    const matchesClass = filterClass === 'ALL' || a.className === filterClass;
    const matchesMethod = filterMethod === 'ALL' || a.method === filterMethod;
    return matchesClass && matchesMethod;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Quản Lý Điểm Danh & Hệ Thống Thiết Bị HN212
          </h1>
          <p className="text-xs text-slate-500">
            Giám sát camera nhận diện khuôn mặt cổng trường, thẻ từ và dữ liệu chấm công thời gian thực
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-500 transition"
        >
          <Download className="h-4 w-4" />
          <span>Xuất Báo Cáo CSV</span>
        </button>
      </div>

      {/* Simulation Feedback Alert */}
      {simulationMessage && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-500/20 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{simulationMessage}</span>
        </div>
      )}

      {/* HN212 Hardware Device Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            Danh Sách Thiết Bị HN212 Đang Kết Nối
          </h2>
          <span className="text-xs text-slate-400">
            Giao thức HN212 Adapter REST/WebSocket API
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ScanFace className="h-5 w-5 text-blue-600" />
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {device.deviceCode}
                    </span>
                  </div>
                  <Badge variant="success" size="sm">
                    {device.status}
                  </Badge>
                </div>

                <h3 className="mt-2 text-sm font-bold text-slate-800">
                  {device.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{device.location}</p>

                <div className="mt-3 space-y-1 rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-600 font-mono">
                  <div className="flex justify-between">
                    <span>IP Thiết bị:</span>
                    <span className="font-semibold">{device.ipAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lượt quét hôm nay:</span>
                    <span className="font-bold text-blue-600">{device.totalScansToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ping gần nhất:</span>
                    <span className="text-slate-400">{device.lastSeenAt.split(' ')[1]}</span>
                  </div>
                </div>
              </div>

              {/* Test scan trigger */}
              <button
                disabled={isSimulating}
                onClick={() => handleSimulateScan(device)}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-50 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Test Quét Khuôn Mặt</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="flex flex-col gap-3 p-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Nhật Ký Chấm Công & Điểm Danh Toàn Trường
            </h2>
            <p className="text-xs text-slate-500">
              Tổng cộng {filteredAttendance.length} lượt ghi nhận
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Class filter */}
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">Tất cả các lớp</option>
              <optgroup label="Khối Mầm Non">
                <option value="Lá 1">Lớp Lá 1 (Mầm Non)</option>
                <option value="Chồi 2">Lớp Chồi 2 (Mầm Non)</option>
                <option value="Mầm 1">Lớp Mầm 1 (Mầm Non)</option>
              </optgroup>
              <optgroup label="Khối THCS">
                <option value="7B2">Lớp 7B2 (THCS)</option>
                <option value="6A1">Lớp 6A1 (THCS)</option>
                <option value="8A1">Lớp 8A1 (THCS)</option>
                <option value="9A2">Lớp 9A2 (THCS)</option>
              </optgroup>
              <optgroup label="Khối THPT">
                <option value="10A1">Lớp 10A1 (THPT)</option>
                <option value="10A2">Lớp 10A2 (THPT)</option>
                <option value="11B2">Lớp 11B2 (THPT)</option>
                <option value="12A3">Lớp 12A3 (THPT)</option>
              </optgroup>
            </select>

            {/* Method filter */}
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">Tất cả phương thức</option>
              <option value="FACE">Khuôn mặt HN212</option>
              <option value="CARD">Thẻ thông minh</option>
              <option value="MANUAL">Thủ công</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 font-semibold text-slate-600">
                <th className="py-3 px-4">Thời Gian</th>
                <th className="py-3 px-4">Mã & Học Sinh</th>
                <th className="py-3 px-4">Lớp</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4">Phương Thức & Thiết Bị</th>
                <th className="py-3 px-4">Ghi Chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-slate-800">
                      {rec.checkInTime || 'Chưa vào'}
                    </div>
                    <span className="text-[10px] text-slate-400">{rec.date}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{rec.studentName}</div>
                    <span className="font-mono text-[10px] text-blue-600">{rec.studentCode}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {rec.className}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {rec.status === 'PRESENT' && (
                      <Badge variant="success" size="sm">Có mặt</Badge>
                    )}
                    {rec.status === 'LATE' && (
                      <Badge variant="warning" size="sm">Đi muộn</Badge>
                    )}
                    {rec.status === 'EXCUSED' && (
                      <Badge variant="info" size="sm">Nghỉ có phép</Badge>
                    )}
                    {rec.status === 'UNEXCUSED' && (
                      <Badge variant="danger" size="sm">Không phép</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">
                      {rec.method === 'FACE' ? 'Nhận diện khuôn mặt' : rec.method === 'CARD' ? 'Thẻ từ RFID' : 'Thủ công'}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {rec.deviceName || 'Giáo viên xác nhận'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 italic">
                    {rec.note || '-'}
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
