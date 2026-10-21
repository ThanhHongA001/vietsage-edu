import React, { useState } from 'react';
import {
  Contact,
  Search,
  Phone,
  MessageSquare,
  Cake,
  Home,
  CheckCircle2,
  FileEdit
} from 'lucide-react';
import { Student } from '../../types';
import { StorageService } from '../../services/storage';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';

export const StudentDirectory: React.FC = () => {
  const { currentTeacher } = useAuth();
  const homeroom = currentTeacher.homeroomClass || '10A1';
  const allStudents = StorageService.getStudents();
  const students = React.useMemo(() => {
    const list = allStudents.filter((s) => s.className === homeroom);
    return list.length > 0 ? list : allStudents.slice(0, 6);
  }, [allStudents, homeroom]);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [conductNote, setConductNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const handleOpenNote = (s: Student) => {
    setSelectedStudent(s);
    setConductNote('Học sinh chăm chỉ, tập trung nghe giảng, tích cực phát biểu xây dựng bài.');
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    setNoteSaved(true);
    setTimeout(() => {
      setNoteSaved(false);
      setSelectedStudent(null);
    }, 1500);
  };

  const filtered = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.parentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Danh Sách Học Sinh Lớp Chủ Nhiệm {homeroom}
          </h1>
          <p className="text-xs text-slate-500">
            Sổ liên lạc học sinh và kênh kết nối trực tiếp với phụ huynh
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm học sinh, phụ huynh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={s.avatar}
                  alt={s.fullName}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-100"
                />
                <div>
                  <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {s.code}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{s.fullName}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{s.gender}</span>
                    <span>• {s.dob}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <div>
                  <span className="text-[11px] text-slate-400 block">Phụ huynh đại diện:</span>
                  <strong className="text-slate-800">{s.parentName}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Số điện thoại:</span>
                  <a
                    href={`tel:${s.parentPhone}`}
                    className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    <span>{s.parentPhone}</span>
                  </a>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Địa chỉ:</span>
                  <span className="text-slate-700 line-clamp-1">{s.address}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`tel:${s.parentPhone}`}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Gọi Phụ Huynh</span>
              </a>

              <button
                onClick={() => handleOpenNote(s)}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <FileEdit className="h-3.5 w-3.5" />
                <span>Ghi Nhận Xét</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Note Modal */}
      <Modal
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent ? `Sổ Theo Dõi: ${selectedStudent.fullName}` : ''}
      >
        <form onSubmit={handleSaveNote} className="space-y-4 text-xs">
          {noteSaved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Đã lưu nhận xét vào học bạ điện tử của học sinh!</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nhận xét đạo đức, hạnh kiểm & tình hình học tập
            </label>
            <textarea
              required
              rows={4}
              value={conductNote}
              onChange={(e) => setConductNote(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-500 shadow-sm"
            >
              Lưu Đánh Giá
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
