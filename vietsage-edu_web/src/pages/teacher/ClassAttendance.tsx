import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Save,
  CheckCheck,
  ScanFace,
  Calendar,
  Sparkles
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, Student } from '../../types';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';

export const ClassAttendance: React.FC = () => {
  const { currentTeacher } = useAuth();
  const [selectedClass, setSelectedClass] = useState(currentTeacher.homeroomClass || '10A1');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const allStudents = StorageService.getStudents();
  const students = React.useMemo(() => {
    return allStudents.filter((s) => s.className === selectedClass);
  }, [allStudents, selectedClass]);

  // Local state of attendance for this session
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; note: string }>>(() => {
    const existing = StorageService.getAttendance().filter((a) => a.className === (currentTeacher.homeroomClass || '10A1'));
    const map: Record<string, { status: AttendanceStatus; note: string }> = {};
    existing.forEach((rec) => {
      map[rec.studentId] = { status: rec.status, note: rec.note || '' };
    });
    return map;
  });

  const [savedAlert, setSavedAlert] = useState(false);

  const getStatus = (studentId: string): AttendanceStatus => {
    return attendanceMap[studentId]?.status || 'PRESENT';
  };

  const getNote = (studentId: string): string => {
    return attendanceMap[studentId]?.note || '';
  };

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const setNote = (studentId: string, note: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'PRESENT',
        note
      }
    }));
  };

  const handleMarkAllPresent = () => {
    const nextMap: Record<string, { status: AttendanceStatus; note: string }> = {};
    students.forEach((s) => {
      nextMap[s.id] = { status: 'PRESENT', note: '' };
    });
    setAttendanceMap(nextMap);
  };

  const handleSaveAttendance = () => {
    const allAttendance = StorageService.getAttendance();
    // Keep other classes / dates
    const otherRecords = allAttendance.filter(
      (a) => !(a.className === selectedClass && a.date === date)
    );

    const newRecords: AttendanceRecord[] = students.map((s) => {
      const entry = attendanceMap[s.id] || { status: 'PRESENT', note: '' };
      return {
        id: `att_${s.id}_${date}`,
        studentId: s.id,
        studentCode: s.code,
        studentName: s.fullName,
        className: s.className,
        date,
        status: entry.status,
        checkInTime: entry.status === 'PRESENT' || entry.status === 'LATE' ? '07:05:00' : undefined,
        method: 'MANUAL',
        note: entry.note
      };
    });

    const updated = [...newRecords, ...otherRecords];
    StorageService.saveAttendance(updated);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Điểm Danh Sĩ Số Lớp Học
          </h1>
          <p className="text-xs text-slate-500">
            Giáo viên xác nhận chuyên cần đầu giờ, đối soát với dữ liệu camera cổng trường HN212
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <CheckCheck className="h-4 w-4 text-emerald-600" />
            <span>Đánh Dấu Tất Cả Có Mặt</span>
          </button>

          <button
            onClick={handleSaveAttendance}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-500 transition"
          >
            <Save className="h-4 w-4" />
            <span>Lưu Bảng Điểm Danh</span>
          </button>
        </div>
      </div>

      {savedAlert && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-500/20 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Bảng điểm danh đã được lưu thành công và đồng bộ thông báo tới Phụ huynh!</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <span>Chọn Lớp:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1 font-bold text-emerald-700 focus:outline-none"
            >
              <optgroup label="Cấp Mầm Non (Kids)">
                <option value="Lá 1">Lớp Lá 1 (5-6 tuổi)</option>
                <option value="Chồi 2">Lớp Chồi 2 (4-5 tuổi)</option>
                <option value="Mầm 1">Lớp Mầm 1 (3-4 tuổi)</option>
              </optgroup>
              <optgroup label="Cấp THCS">
                <option value="7B2">Lớp 7B2</option>
                <option value="6A1">Lớp 6A1</option>
                <option value="8A1">Lớp 8A1</option>
                <option value="9A2">Lớp 9A2</option>
              </optgroup>
              <optgroup label="Cấp THPT">
                <option value="10A1">Lớp 10A1</option>
                <option value="10A2">Lớp 10A2</option>
                <option value="11B2">Lớp 11B2</option>
                <option value="12A3">Lớp 12A3</option>
              </optgroup>
            </select>
          </div>

          <div className="flex items-center gap-1.5 font-semibold text-slate-600">
            <Calendar className="h-4 w-4 text-slate-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Có mặt: <strong>{students.filter(s => getStatus(s.id) === 'PRESENT').length}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Đi muộn: <strong>{students.filter(s => getStatus(s.id) === 'LATE').length}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Có phép: <strong>{students.filter(s => getStatus(s.id) === 'EXCUSED').length}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Không phép: <strong>{students.filter(s => getStatus(s.id) === 'UNEXCUSED').length}</strong>
          </span>
        </div>
      </div>

      {/* Interactive Attendance Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 font-semibold text-slate-600">
                <th className="py-3 px-4">STT & Học Sinh</th>
                <th className="py-3 px-4">Dữ liệu HN212 Cổng</th>
                <th className="py-3 px-4 text-center">Trạng Thái Điểm Danh</th>
                <th className="py-3 px-4">Ghi Chú / Lý Do</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student, idx) => {
                const status = getStatus(student.id);
                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-400 font-bold w-5">
                          {idx + 1}
                        </span>
                        <img
                          src={student.avatar}
                          alt={student.fullName}
                          className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {student.fullName}
                          </div>
                          <span className="font-mono text-[10px] text-blue-600 font-semibold">
                            {student.code}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700">
                        <ScanFace className="h-4 w-4 text-emerald-600" />
                        <span className="font-semibold">06:58:12</span>
                        <span className="text-[10px] text-slate-400">(Cổng A)</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setStatus(student.id, 'PRESENT')}
                          className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-bold transition ${
                            status === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Có mặt</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setStatus(student.id, 'LATE')}
                          className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-bold transition ${
                            status === 'LATE'
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Clock className="h-3.5 w-3.5" />
                          <span>Đi muộn</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setStatus(student.id, 'EXCUSED')}
                          className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-bold transition ${
                            status === 'EXCUSED'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Có phép</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setStatus(student.id, 'UNEXCUSED')}
                          className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-bold transition ${
                            status === 'UNEXCUSED'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Vắng</span>
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Ghi chú lý do..."
                        value={getNote(student.id)}
                        onChange={(e) => setNote(student.id, e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
