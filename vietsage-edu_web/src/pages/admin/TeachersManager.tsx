import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  BookOpen,
  School,
  Edit2,
  Trash2,
  CheckCircle2,
  Baby
} from 'lucide-react';
import { Teacher, SchoolLevel } from '../../types';
import { StorageService } from '../../services/storage';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const TeachersManager: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(() => StorageService.getTeachers());
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<'ALL' | SchoolLevel>('ALL');
  const [filterDept, setFilterDept] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel | 'Toàn trường'>('THPT');
  const [department, setDepartment] = useState('Tổ Toán - Tin THPT');
  const [homeroomClass, setHomeroomClass] = useState('');
  const [subjectsStr, setSubjectsStr] = useState('');

  const departments = [
    'ALL',
    'Tổ Giáo dục Mầm non',
    'Tổ Tự nhiên THCS',
    'Tổ Xã hội THCS',
    'Tổ Toán - Tin THPT',
    'Tổ Ngữ Văn THPT',
    'Tổ KHTN THPT',
    'Tổ Ngoại Ngữ Liên Cấp'
  ];

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setSchoolLevel(filterLevel === 'ALL' ? 'THPT' : filterLevel);
    setDepartment(filterLevel === 'Mầm non' ? 'Tổ Giáo dục Mầm non' : filterLevel === 'THCS' ? 'Tổ Tự nhiên THCS' : 'Tổ Toán - Tin THPT');
    setHomeroomClass('');
    setSubjectsStr(filterLevel === 'Mầm non' ? 'Tạo hình & Âm nhạc, Kỹ năng sống' : 'Toán Đại số');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setFullName(t.fullName);
    setEmail(t.email);
    setPhone(t.phone);
    setSchoolLevel(t.schoolLevel || 'THPT');
    setDepartment(t.department);
    setHomeroomClass(t.homeroomClass || '');
    setSubjectsStr(t.subjects.join(', '));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const subjects = subjectsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingTeacher) {
      const updated = teachers.map((t) =>
        t.id === editingTeacher.id
          ? {
              ...t,
              fullName,
              email,
              phone,
              schoolLevel,
              department,
              homeroomClass: homeroomClass.trim() || undefined,
              subjects
            }
          : t
      );
      setTeachers(updated);
      StorageService.saveTeachers(updated);
    } else {
      const newTeacher: Teacher = {
        id: `tc_${Date.now()}`,
        code: `GV-${Math.floor(100 + Math.random() * 900)}`,
        fullName,
        email,
        phone,
        schoolLevel,
        department,
        homeroomClass: homeroomClass.trim() || undefined,
        subjects,
        status: 'ACTIVE',
        avatar: schoolLevel === 'Mầm non'
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinDate: new Date().toISOString().split('T')[0]
      };
      const updated = [newTeacher, ...teachers];
      setTeachers(updated);
      StorageService.saveTeachers(updated);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa giáo viên này khỏi hệ thống?')) {
      const updated = teachers.filter((t) => t.id !== id);
      setTeachers(updated);
      StorageService.saveTeachers(updated);
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    const matchesLevel =
      filterLevel === 'ALL' || t.schoolLevel === filterLevel || t.schoolLevel === 'Toàn trường';
    const matchesDept = filterDept === 'ALL' || t.department === filterDept;
    return matchesSearch && matchesLevel && matchesDept;
  });

  const getLevelBadge = (level?: SchoolLevel | 'Toàn trường') => {
    switch (level) {
      case 'Mầm non':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-600/20">
            <Baby className="h-3 w-3 text-amber-600" />
            Mầm non
          </span>
        );
      case 'THCS':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800 ring-1 ring-teal-600/20">
            <BookOpen className="h-3 w-3 text-teal-600" />
            THCS
          </span>
        );
      case 'THPT':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800 ring-1 ring-blue-600/20">
            <School className="h-3 w-3 text-blue-600" />
            THPT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-800 ring-1 ring-purple-600/20">
            Liên cấp
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Quản Lý Đội Ngũ Giáo Viên
          </h1>
          <p className="text-xs text-slate-500">
            Nhân sự sư phạm liên cấp: <strong>Tổ Mầm non</strong>, <strong>Tổ THCS</strong>, <strong>Tổ THPT</strong> và <strong>Tổ Ngoại ngữ liên cấp</strong>
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm Giáo Viên Mới</span>
        </button>
      </div>

      {/* Level Tabs Selection */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['ALL', 'Mầm non', 'THCS', 'THPT'] as const).map((lvl) => {
          const isActive = filterLevel === lvl;
          const count =
            lvl === 'ALL'
              ? teachers.length
              : teachers.filter((t) => t.schoolLevel === lvl || t.schoolLevel === 'Toàn trường').length;
          return (
            <button
              key={lvl}
              onClick={() => {
                setFilterLevel(lvl);
                setFilterDept('ALL');
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                isActive
                  ? lvl === 'Mầm non'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : lvl === 'THCS'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : lvl === 'THPT'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{lvl === 'ALL' ? 'Toàn Bộ Giáo Viên (3 Cấp)' : `Giáo Viên ${lvl}`}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên giáo viên, mã GV, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                filterDept === dept
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept === 'ALL' ? 'Tất cả tổ' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={teacher.avatar}
                    alt={teacher.fullName}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {teacher.code}
                      </span>
                      {getLevelBadge(teacher.schoolLevel)}
                    </div>
                    <h3 className="mt-1 text-sm font-bold text-slate-900 line-clamp-1">
                      {teacher.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{teacher.department}</p>
                  </div>
                </div>

                <Badge
                  variant={teacher.status === 'ACTIVE' ? 'success' : 'neutral'}
                  size="sm"
                >
                  {teacher.status === 'ACTIVE' ? 'Đang dạy' : 'Nghỉ phép'}
                </Badge>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <School className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    Chủ nhiệm:{' '}
                    {teacher.homeroomClass ? (
                      <strong className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Lớp {teacher.homeroomClass}
                      </strong>
                    ) : (
                      <em className="text-slate-400">Không</em>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                  <span className="line-clamp-1">
                    Môn: <strong className="text-slate-800">{teacher.subjects.join(', ')}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-mono text-[11px] text-slate-500">{teacher.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{teacher.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
              <span>Tham gia: {teacher.joinDate}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(teacher)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition"
                  title="Chỉnh sửa giáo viên"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(teacher.id)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
                  title="Xóa giáo viên"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Teacher */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? 'Cập Nhật Hồ Sơ Giáo Viên' : 'Thêm Giáo Viên Mới'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Cấp học phụ trách *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Mầm non', 'THCS', 'THPT', 'Toàn trường'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => {
                    setSchoolLevel(lvl);
                    if (lvl === 'Mầm non') setDepartment('Tổ Giáo dục Mầm non');
                    else if (lvl === 'THCS') setDepartment('Tổ Tự nhiên THCS');
                    else if (lvl === 'THPT') setDepartment('Tổ Toán - Tin THPT');
                    else setDepartment('Tổ Ngoại Ngữ Liên Cấp');
                  }}
                  className={`rounded-xl py-2 px-2 text-xs font-bold border text-center transition ${
                    schoolLevel === lvl
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Họ và tên giáo viên *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="VD: Cô Đặng Minh Châu"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email cơ quan *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chau.dm@vietsage.edu.vn"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Số điện thoại *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 678"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tổ chuyên môn
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
              >
                {departments
                  .filter((d) => d !== 'ALL')
                  .map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lớp Chủ Nhiệm (Nếu có)
              </label>
              <input
                type="text"
                value={homeroomClass}
                onChange={(e) => setHomeroomClass(e.target.value)}
                placeholder="VD: Lá 1, 7B2, 10A1..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Môn Giảng Dạy (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              required
              value={subjectsStr}
              onChange={(e) => setSubjectsStr(e.target.value)}
              placeholder="VD: Tạo hình & Âm nhạc, Kỹ năng sống..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition"
            >
              {editingTeacher ? 'Cập Nhật' : 'Lưu Giáo Viên'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
