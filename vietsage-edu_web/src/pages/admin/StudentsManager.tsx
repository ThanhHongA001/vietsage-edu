import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Phone,
  User,
  MapPin,
  Utensils,
  Edit2,
  Trash2,
  Heart,
  Baby,
  BookOpen,
  School
} from 'lucide-react';
import { Student, SchoolLevel } from '../../types';
import { StorageService } from '../../services/storage';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const StudentsManager: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => StorageService.getStudents());
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<'ALL' | SchoolLevel>('ALL');
  const [filterClass, setFilterClass] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>('THPT');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [className, setClassName] = useState('10A1');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [address, setAddress] = useState('');
  const [canteenRegistered, setCanteenRegistered] = useState(true);
  // Early childhood fields
  const [heightCm, setHeightCm] = useState<number>(0);
  const [weightKg, setWeightKg] = useState<number>(0);
  const [allergies, setAllergies] = useState('');

  // Classes map by level
  const classesByLevel: Record<SchoolLevel, string[]> = {
    'Mầm non': ['Mầm 1', 'Chồi 2', 'Lá 1'],
    'THCS': ['6A1', '7B2', '8A1', '9A2'],
    'THPT': ['10A1', '10A2', '11B2', '12A3']
  };

  // Dynamic classes available for filtering
  const availableFilterClasses = useMemo(() => {
    if (filterLevel === 'ALL') {
      return ['ALL', 'Lá 1', 'Chồi 2', 'Mầm 1', '6A1', '7B2', '8A1', '9A2', '10A1', '10A2', '11B2', '12A3'];
    }
    return ['ALL', ...classesByLevel[filterLevel]];
  }, [filterLevel]);

  const handleLevelChangeInForm = (lvl: SchoolLevel) => {
    setSchoolLevel(lvl);
    const validClasses = classesByLevel[lvl];
    setClassName(validClasses[0]);
    if (lvl === 'Mầm non') {
      setDob('2021-04-10');
      setCanteenRegistered(true);
    } else if (lvl === 'THCS') {
      setDob('2014-05-15');
    } else {
      setDob('2010-01-01');
    }
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFullName('');
    setSchoolLevel(filterLevel === 'ALL' ? 'THPT' : filterLevel);
    const lvl = filterLevel === 'ALL' ? 'THPT' : filterLevel;
    setClassName(classesByLevel[lvl][0]);
    setDob('');
    setGender('Nam');
    setParentName('');
    setParentPhone('');
    setAddress('');
    setCanteenRegistered(true);
    setHeightCm(0);
    setWeightKg(0);
    setAllergies('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Student) => {
    setEditingStudent(s);
    setFullName(s.fullName);
    setSchoolLevel(s.schoolLevel || 'THPT');
    setDob(s.dob);
    setGender(s.gender);
    setClassName(s.className);
    setParentName(s.parentName);
    setParentPhone(s.parentPhone);
    setAddress(s.address);
    setCanteenRegistered(s.canteenRegistered);
    if (s.preschoolProfile) {
      setHeightCm(s.preschoolProfile.heightCm || 110);
      setWeightKg(s.preschoolProfile.weightKg || 19);
      setAllergies(s.preschoolProfile.allergies || 'Không dị ứng');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      const updated = students.map((s) =>
        s.id === editingStudent.id
          ? {
              ...s,
              fullName,
              schoolLevel,
              dob,
              gender,
              className,
              parentName,
              parentPhone,
              address,
              canteenRegistered,
              preschoolProfile: schoolLevel === 'Mầm non' ? {
                heightCm,
                weightKg,
                allergies,
                healthStatus: 'Tốt' as const
              } : undefined
            }
          : s
      );
      setStudents(updated);
      StorageService.saveStudents(updated);
    } else {
      const codePrefix = schoolLevel === 'Mầm non' ? 'VS-MN' : schoolLevel === 'THCS' ? 'VS-CS' : 'VS-2026';
      const defaultHomeroom =
        schoolLevel === 'Mầm non'
          ? 'Cô Đặng Minh Châu'
          : schoolLevel === 'THCS'
          ? 'Cô Vũ Thúy Hằng'
          : 'ThS. Nguyễn Văn Hùng';

      const newStudent: Student = {
        id: `hs_${Date.now()}`,
        code: `${codePrefix}-${Math.floor(100 + Math.random() * 900)}`,
        fullName,
        dob,
        gender,
        className,
        schoolLevel,
        homeroomTeacher: defaultHomeroom,
        parentName,
        parentPhone,
        address,
        status: 'STUDYING',
        avatar: schoolLevel === 'Mầm non'
          ? 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        canteenRegistered,
        preschoolProfile: schoolLevel === 'Mầm non' ? {
          heightCm,
          weightKg,
          allergies,
          healthStatus: 'Tốt' as const
        } : undefined
      };
      const updated = [newStudent, ...students];
      setStudents(updated);
      StorageService.saveStudents(updated);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa hồ sơ học sinh này?')) {
      const updated = students.filter((s) => s.id !== id);
      setStudents(updated);
      StorageService.saveStudents(updated);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.parentPhone.includes(search) ||
      s.parentName.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = filterLevel === 'ALL' || s.schoolLevel === filterLevel;
    const matchesClass = filterClass === 'ALL' || s.className === filterClass;
    return matchesSearch && matchesLevel && matchesClass;
  });

  const getLevelBadge = (level?: SchoolLevel) => {
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
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800 ring-1 ring-blue-600/20">
            <School className="h-3 w-3 text-blue-600" />
            THPT
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Quản Lý Hồ Sơ Học Sinh
          </h1>
          <p className="text-xs text-slate-500">
            Cơ sở dữ liệu học sinh liên cấp: <strong>Mầm non (Preschool)</strong>, <strong>THCS</strong> và <strong>THPT</strong>
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm Học Sinh Mới</span>
        </button>
      </div>

      {/* Level Tabs Selection */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['ALL', 'Mầm non', 'THCS', 'THPT'] as const).map((lvl) => {
          const isActive = filterLevel === lvl;
          const count = lvl === 'ALL' ? students.length : students.filter((s) => s.schoolLevel === lvl).length;
          return (
            <button
              key={lvl}
              onClick={() => {
                setFilterLevel(lvl);
                setFilterClass('ALL');
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
              <span>{lvl === 'ALL' ? 'Toàn Trường (3 Cấp)' : `Cấp ${lvl}`}</span>
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
            placeholder="Tìm theo tên học sinh, mã số, tên phụ huynh, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500">Lớp:</span>
          {availableFilterClasses.map((cls) => (
            <button
              key={cls}
              onClick={() => setFilterClass(cls)}
              className={`rounded-xl px-2.5 py-1 text-xs font-medium transition ${
                filterClass === cls
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cls === 'ALL' ? 'Tất cả' : cls}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 font-semibold text-slate-600">
                <th className="py-3 px-4">Mã & Học Sinh</th>
                <th className="py-3 px-4">Cấp Học</th>
                <th className="py-3 px-4">Lớp & GVCN</th>
                <th className="py-3 px-4">Ngày sinh & Giới tính</th>
                <th className="py-3 px-4">Phụ huynh & SĐT</th>
                <th className="py-3 px-4">Bán trú & Sức khỏe</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                    Không tìm thấy học sinh nào phù hợp bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.fullName}
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{student.fullName}</p>
                          <span className="font-mono text-[11px] text-blue-600 font-medium">
                            {student.code}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getLevelBadge(student.schoolLevel)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800">{student.className}</span>
                      <p className="text-[11px] text-slate-500">{student.homeroomTeacher}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-700">{student.dob}</span>
                      <p className="text-[11px] text-slate-400">{student.gender}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <User className="h-3 w-3 text-slate-400" />
                        <span>{student.parentName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{student.parentPhone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <Badge
                          variant={student.canteenRegistered ? 'success' : 'neutral'}
                          size="sm"
                        >
                          {student.canteenRegistered ? 'Có ăn bán trú' : 'Tự túc'}
                        </Badge>
                        {student.preschoolProfile && (
                          <p className="text-[10px] text-amber-700 font-medium">
                            {student.preschoolProfile.heightCm}cm • {student.preschoolProfile.weightKg}kg
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition"
                          title="Chỉnh sửa hồ sơ"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Xóa học sinh"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Student */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'Cập Nhật Hồ Sơ Học Sinh' : 'Thêm Học Sinh Mới'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Chọn Cấp học */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Cấp học *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Mầm non', 'THCS', 'THPT'] as SchoolLevel[]).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => handleLevelChangeInForm(lvl)}
                  className={`rounded-xl py-2 px-3 text-xs font-bold border transition ${
                    schoolLevel === lvl
                      ? lvl === 'Mầm non'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : lvl === 'THCS'
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-blue-600 text-white border-blue-600'
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
              Họ và tên học sinh *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={schoolLevel === 'Mầm non' ? 'VD: Nguyễn Bảo An (Bé Bo)' : 'VD: Nguyễn Minh Quân'}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lớp học *
              </label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
              >
                {classesByLevel[schoolLevel].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ngày sinh *
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Giới tính
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>

          {/* Dành cho Mầm non: Thông tin thể chất */}
          {schoolLevel === 'Mầm non' && (
            <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-200/60 space-y-2">
              <span className="text-[11px] font-bold text-amber-900 block flex items-center gap-1">
                <Heart className="h-3.5 w-3.5 text-amber-600" />
                Hồ Sơ Sức Khỏe & Thể Chất Mầm Non
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600">Chiều cao (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-1.5 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600">Cân nặng (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-1.5 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600">Dị ứng thực phẩm</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="Không / Dị ứng..."
                    className="w-full rounded-lg border border-slate-300 p-1.5 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Họ tên Phụ huynh / Giám hộ *
              </label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Số điện thoại liên hệ *
              </label>
              <input
                type="text"
                required
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="0912 345 678"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Địa chỉ thường trú
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, đường, quận/huyện, TP..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="canteenCheck"
              checked={canteenRegistered}
              onChange={(e) => setCanteenRegistered(e.target.checked)}
              className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="canteenCheck" className="font-semibold text-slate-700 cursor-pointer">
              Đăng ký dịch vụ ăn trưa bán trú tại trường
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition"
            >
              {editingStudent ? 'Cập Nhật' : 'Lưu Học Sinh'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
