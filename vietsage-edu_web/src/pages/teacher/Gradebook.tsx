import React, { useState, useMemo } from 'react';
import {
  TableProperties,
  Save,
  Download,
  Calculator,
  CheckCircle2,
  Sparkles,
  Baby,
  Star,
  Award,
  BookOpen,
  School,
  HeartHandshake
} from 'lucide-react';
import { GradeEntry, SchoolLevel } from '../../types';
import { StorageService } from '../../services/storage';

export const Gradebook: React.FC = () => {
  const [grades, setGrades] = useState<GradeEntry[]>(() => StorageService.getGrades());
  const [selectedLevel, setSelectedLevel] = useState<SchoolLevel>('THPT');
  const [selectedClass, setSelectedClass] = useState('10A1');
  const [selectedSubject, setSelectedSubject] = useState('Toán Đại số');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Available classes & subjects by level
  const classesByLevel: Record<SchoolLevel, string[]> = {
    'Mầm non': ['Lá 1', 'Chồi 2', 'Mầm 1'],
    'THCS': ['7B2', '6A1', '8A1', '9A2'],
    'THPT': ['10A1', '10A2', '11B2', '12A3']
  };

  const subjectsByLevel: Record<SchoolLevel, string[]> = {
    'Mầm non': ['Đánh giá 5 lĩnh vực phát triển & Bé ngoan'],
    'THCS': ['Ngữ Văn THCS', 'Toán THCS', 'Khoa học Tự nhiên', 'Tiếng Anh THCS', 'Lịch Sử & Địa Lý'],
    'THPT': ['Toán Đại số', 'Toán Hình học', 'Ngữ Văn', 'Vật Lý', 'Hóa Học', 'Tiếng Anh Quốc Tế']
  };

  const handleLevelChange = (lvl: SchoolLevel) => {
    setSelectedLevel(lvl);
    setSelectedClass(classesByLevel[lvl][0]);
    setSelectedSubject(subjectsByLevel[lvl][0]);
  };

  // Auto calculate ĐTB môn for secondary and high school:
  const calculateAverage = (g: GradeEntry): number => {
    let totalScore = 0;
    let totalWeight = 0;

    if (g.scoreOral1 !== undefined) { totalScore += g.scoreOral1; totalWeight += 1; }
    if (g.scoreOral2 !== undefined) { totalScore += g.scoreOral2; totalWeight += 1; }
    if (g.score15m1 !== undefined) { totalScore += g.score15m1; totalWeight += 1; }
    if (g.score15m2 !== undefined) { totalScore += g.score15m2; totalWeight += 1; }
    if (g.score1Period !== undefined) { totalScore += g.score1Period * 2; totalWeight += 2; }
    if (g.scoreMidTerm !== undefined) { totalScore += g.scoreMidTerm * 2; totalWeight += 2; }
    if (g.scoreFinal !== undefined) { totalScore += g.scoreFinal * 3; totalWeight += 3; }

    if (totalWeight === 0) return 0;
    return Number((totalScore / totalWeight).toFixed(1));
  };

  const handleScoreChange = (
    studentId: string,
    field: keyof Omit<GradeEntry, 'studentId' | 'studentCode' | 'studentName' | 'averageScore' | 'preschoolEvaluation'>,
    valStr: string
  ) => {
    const val = valStr === '' ? undefined : Math.min(10, Math.max(0, Number(valStr)));
    const updated = grades.map((g) => {
      if (g.studentId === studentId) {
        const temp = { ...g, [field]: val };
        temp.averageScore = calculateAverage(temp);
        return temp;
      }
      return g;
    });
    setGrades(updated);
  };

  const handlePreschoolChange = (
    studentId: string,
    field: string,
    val: any
  ) => {
    const updated = grades.map((g) => {
      if (g.studentId === studentId) {
        return {
          ...g,
          preschoolEvaluation: {
            ...g.preschoolEvaluation,
            [field]: val
          } as any
        };
      }
      return g;
    });
    setGrades(updated);
  };

  const handleSaveAll = () => {
    StorageService.saveGrades(grades);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const currentLevelGrades = useMemo(() => {
    return grades.filter((g) => {
      if (g.schoolLevel) return g.schoolLevel === selectedLevel;
      return selectedLevel === 'THPT';
    });
  }, [grades, selectedLevel]);

  const exportCSV = () => {
    if (selectedLevel === 'Mầm non') {
      const headers = ['Mã Bé,Họ và Tên,Lớp,Thể Chất,Nhận Thức,Ngôn Ngữ,Tình Cảm XH,Thẩm Mỹ,Bé Ngoan,Nhận Xét Cô Giáo\n'];
      const rows = currentLevelGrades.map((g) =>
        [
          g.studentCode,
          `"${g.studentName}"`,
          selectedClass,
          g.preschoolEvaluation?.physicalDevelopment || 'Đạt',
          g.preschoolEvaluation?.cognitiveDevelopment || 'Đạt',
          g.preschoolEvaluation?.languageDevelopment || 'Đạt',
          g.preschoolEvaluation?.socialEmotionalDevelopment || 'Đạt',
          g.preschoolEvaluation?.aestheticDevelopment || 'Đạt',
          g.preschoolEvaluation?.isWellBehaved ? 'Có' : 'Chưa',
          `"${g.preschoolEvaluation?.generalComment || ''}"`
        ].join(',')
      );
      const blob = new Blob([headers.concat(rows.join('\n')).join('')], {
        type: 'text/csv;charset=utf-8;'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Danh_gia_Mam_Non_${selectedClass}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const headers = ['Mã HS,Họ và Tên,Lớp,Môn,Miệng 1,Miệng 2,15p (1),15p (2),1 Tiết,Giữa Kỳ,Cuối Kỳ,Điểm TB\n'];
    const rows = currentLevelGrades.map((g) =>
      [
        g.studentCode,
        `"${g.studentName}"`,
        selectedClass,
        `"${selectedSubject}"`,
        g.scoreOral1 ?? '',
        g.scoreOral2 ?? '',
        g.score15m1 ?? '',
        g.score15m2 ?? '',
        g.score1Period ?? '',
        g.scoreMidTerm ?? '',
        g.scoreFinal ?? '',
        g.averageScore ?? ''
      ].join(',')
    );

    const blob = new Blob([headers.concat(rows.join('\n')).join('')], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bang_diem_${selectedLevel}_${selectedClass}_${selectedSubject}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <TableProperties className="h-6 w-6 text-emerald-600" />
            {selectedLevel === 'Mầm non'
              ? 'Đánh Giá Sự Phát Triển Bé Mầm Non'
              : 'Sổ Điểm Điện Tử & Đánh Giá Học Tập'}
          </h1>
          <p className="text-xs text-slate-500">
            {selectedLevel === 'Mầm non'
              ? 'Theo dõi 5 lĩnh vực phát triển theo Thông tư Bộ GD&ĐT & Phiếu bé ngoan trong tuần'
              : 'Học kỳ I • Tự động tính điểm trung bình môn THCS & THPT theo chuẩn GDPT'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Download className="h-4 w-4" />
            <span>Xuất Báo Cáo CSV</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-500 transition"
          >
            <Save className="h-4 w-4" />
            <span>Lưu Đánh Giá</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-500/20 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Đã lưu thành công dữ liệu học vụ vào hệ thống!</span>
        </div>
      )}

      {/* Level Selection Tabs */}
      <div className="flex items-center gap-2">
        {(['Mầm non', 'THCS', 'THPT'] as SchoolLevel[]).map((lvl) => {
          const isActive = selectedLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => handleLevelChange(lvl)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                isActive
                  ? lvl === 'Mầm non'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : lvl === 'THCS'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {lvl === 'Mầm non' ? (
                <Baby className="h-4 w-4 text-amber-700" />
              ) : lvl === 'THCS' ? (
                <BookOpen className="h-4 w-4 text-teal-700" />
              ) : (
                <School className="h-4 w-4 text-blue-700" />
              )}
              <span>Cấp {lvl}</span>
            </button>
          );
        })}
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Lớp học:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 font-bold text-emerald-700 focus:outline-none"
          >
            {classesByLevel[selectedLevel].map((c) => (
              <option key={c} value={c}>
                Lớp {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">
            {selectedLevel === 'Mầm non' ? 'Học phần:' : 'Môn học:'}
          </span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 font-bold text-slate-800 focus:outline-none"
          >
            {subjectsByLevel[selectedLevel].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table: If Preschool (Mầm non), show 5-Domain Evaluation Table */}
      {selectedLevel === 'Mầm non' ? (
        <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
          <div className="p-4 bg-amber-50/70 border-b border-amber-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-amber-600" />
              <span className="font-bold text-amber-950 text-xs">
                Bảng Theo Dõi & Đánh Giá 5 Lĩnh Vực Phát Triển (Trẻ Mầm Non)
              </span>
            </div>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
              Thang đánh giá: Đạt / Vượt trội / Cần rèn luyện
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 font-semibold text-slate-600">
                  <th className="py-3 px-4 text-left">Bé Mầm Non</th>
                  <th className="py-3 px-2">1. Thể chất</th>
                  <th className="py-3 px-2">2. Nhận thức</th>
                  <th className="py-3 px-2">3. Ngôn ngữ</th>
                  <th className="py-3 px-2">4. TC & KNXH</th>
                  <th className="py-3 px-2">5. Thẩm mỹ</th>
                  <th className="py-3 px-2">Bé Ngoan ⭐</th>
                  <th className="py-3 px-4 text-left">Nhận xét của cô giáo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentLevelGrades.map((g) => (
                  <tr key={g.studentId} className="hover:bg-amber-50/30 transition">
                    <td className="py-3.5 px-4 text-left">
                      <div className="font-bold text-slate-900">{g.studentName}</div>
                      <span className="font-mono text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        {g.studentCode}
                      </span>
                    </td>

                    {/* 5 Domains */}
                    {([
                      'physicalDevelopment',
                      'cognitiveDevelopment',
                      'languageDevelopment',
                      'socialEmotionalDevelopment',
                      'aestheticDevelopment'
                    ] as const).map((field) => (
                      <td key={field} className="py-3 px-2">
                        <select
                          value={g.preschoolEvaluation?.[field] || 'Đạt'}
                          onChange={(e) => handlePreschoolChange(g.studentId, field, e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white p-1 text-[11px] font-bold text-slate-700 focus:outline-none"
                        >
                          <option value="Đạt">Đạt</option>
                          <option value="Vượt trội">Vượt trội</option>
                          <option value="Cần rèn luyện">Cần rèn</option>
                        </select>
                      </td>
                    ))}

                    {/* Bé ngoan */}
                    <td className="py-3 px-2">
                      <button
                        type="button"
                        onClick={() =>
                          handlePreschoolChange(
                            g.studentId,
                            'isWellBehaved',
                            !g.preschoolEvaluation?.isWellBehaved
                          )
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                          g.preschoolEvaluation?.isWellBehaved
                            ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-500/30'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Star className={`h-3.5 w-3.5 ${g.preschoolEvaluation?.isWellBehaved ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                        <span>{g.preschoolEvaluation?.isWellBehaved ? 'Bé Ngoan' : 'Bình thường'}</span>
                      </button>
                    </td>

                    {/* Lời nhận xét */}
                    <td className="py-3 px-4 text-left">
                      <input
                        type="text"
                        value={g.preschoolEvaluation?.generalComment || ''}
                        onChange={(e) =>
                          handlePreschoolChange(g.studentId, 'generalComment', e.target.value)
                        }
                        placeholder="Nhập nhận xét tuần cho bé..."
                        className="w-full rounded-lg border border-slate-200 p-1.5 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Table: THCS and THPT Numerical Gradebook */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 font-semibold text-slate-600">
                  <th className="py-3 px-4 text-left">Học Sinh</th>
                  <th className="py-3 px-2 w-20">Miệng 1</th>
                  <th className="py-3 px-2 w-20">Miệng 2</th>
                  <th className="py-3 px-2 w-20">15 Phút (1)</th>
                  <th className="py-3 px-2 w-20">15 Phút (2)</th>
                  <th className="py-3 px-2 w-20">1 Tiết (x2)</th>
                  <th className="py-3 px-2 w-20">Giữa Kỳ (x2)</th>
                  <th className="py-3 px-2 w-20">Cuối Kỳ (x3)</th>
                  <th className="py-3 px-4 w-24 text-right bg-emerald-50 text-emerald-800 font-bold">
                    ĐTB Môn
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentLevelGrades.map((g) => (
                  <tr key={g.studentId} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 text-left">
                      <div className="font-bold text-slate-900">{g.studentName}</div>
                      <span className="font-mono text-[10px] text-blue-600">{g.studentCode}</span>
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={g.scoreOral1 ?? ''}
                        onChange={(e) => handleScoreChange(g.studentId, 'scoreOral1', e.target.value)}
                        className="w-14 rounded-lg border border-slate-200 p-1.5 text-center font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={g.scoreOral2 ?? ''}
                        onChange={(e) => handleScoreChange(g.studentId, 'scoreOral2', e.target.value)}
                        className="w-14 rounded-lg border border-slate-200 p-1.5 text-center font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={g.score15m1 ?? ''}
                        onChange={(e) => handleScoreChange(g.studentId, 'score15m1', e.target.value)}
                        className="w-14 rounded-lg border border-slate-200 p-1.5 text-center font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={g.score15m2 ?? ''}
                        onChange={(e) => handleScoreChange(g.studentId, 'score15m2', e.target.value)}
                        className="w-14 rounded-lg border border-slate-200 p-1.5 text-center font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={g.score1Period ?? ''}
                        onChange={(e) => handleScoreChange(g.studentId, 'score1Period', e.target.value)}
                        className="w-14 rounded-lg border border-slate-200 p-1.5 text-center font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={g.scoreMidTerm ?? ''}
                        onChange={(e) => handleScoreChange(g.studentId, 'scoreMidTerm', e.target.value)}
                        className="w-14 rounded-lg border border-slate-200 p-1.5 text-center font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={g.scoreFinal ?? ''}
                        onChange={(e) => handleScoreChange(g.studentId, 'scoreFinal', e.target.value)}
                        className="w-14 rounded-lg border border-slate-200 p-1.5 text-center font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </td>

                    <td className="py-2 px-4 text-right bg-emerald-50/50">
                      <span
                        className={`text-sm font-extrabold ${
                          (g.averageScore || 0) >= 8.0
                            ? 'text-emerald-700'
                            : (g.averageScore || 0) >= 6.5
                            ? 'text-blue-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {g.averageScore !== undefined ? g.averageScore.toFixed(1) : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
