import React, { useState } from 'react';
import {
  BookOpenCheck,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Paperclip,
  Check,
  Star,
  Users,
  Search,
  MessageSquare
} from 'lucide-react';
import { Homework, HomeworkSubmission } from '../../types';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const HomeworkManager: React.FC = () => {
  const { currentTeacher } = useAuth();
  const [homeworks, setHomeworks] = useState<Homework[]>(() =>
    StorageService.getHomeworks().filter((h) => h.teacherId === currentTeacher.id)
  );

  // Modal Create Homework
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(currentTeacher.subjects[0] || 'Toán Đại số');
  const [className, setClassName] = useState(currentTeacher.homeroomClass || '10A1');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  // Modal Grading Submissions
  const [gradingHw, setGradingHw] = useState<Homework | null>(null);
  const [selectedSub, setSelectedSub] = useState<HomeworkSubmission | null>(null);
  const [inputScore, setInputScore] = useState<number>(10);
  const [inputFeedback, setInputFeedback] = useState<string>('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newHw: Homework = {
      id: `hw_${Date.now()}`,
      title,
      subject,
      className,
      teacherId: currentTeacher.id,
      teacherName: currentTeacher.fullName,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
      description,
      attachments: [attachmentName],
      totalStudents: 38,
      submittedCount: 0,
      gradedCount: 0,
      submissions: []
    };

    const allHw = StorageService.getHomeworks();
    const updated = [newHw, ...allHw];
    StorageService.saveHomeworks(updated);
    setHomeworks([newHw, ...homeworks]);
    setIsCreateOpen(false);
  };

  const handleOpenGrading = (hw: Homework) => {
    setGradingHw(hw);
    if (hw.submissions.length > 0) {
      const sub = hw.submissions[0];
      setSelectedSub(sub);
      setInputScore(sub.score || 8.5);
      setInputFeedback(sub.feedback || 'Bài giải tốt, trình bày mạch lạc.');
    } else {
      setSelectedSub(null);
    }
  };

  const handleSelectSubmission = (sub: HomeworkSubmission) => {
    setSelectedSub(sub);
    setInputScore(sub.score || 8.5);
    setInputFeedback(sub.feedback || '');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingHw || !selectedSub) return;

    const updatedSubmissions = gradingHw.submissions.map((s) =>
      s.id === selectedSub.id
        ? {
            ...s,
            status: 'GRADED' as const,
            score: Number(inputScore),
            feedback: inputFeedback,
            gradedAt: new Date().toISOString()
          }
        : s
    );

    const gradedCount = updatedSubmissions.filter((s) => s.status === 'GRADED').length;

    const updatedHw: Homework = {
      ...gradingHw,
      gradedCount,
      submissions: updatedSubmissions
    };

    setGradingHw(updatedHw);

    const allHw = StorageService.getHomeworks();
    const nextList = allHw.map((h) => (h.id === updatedHw.id ? updatedHw : h));
    StorageService.saveHomeworks(nextList);
    setHomeworks(nextList.filter((h) => h.teacherId === currentTeacher.id));

    // Update selected submission locally
    setSelectedSub({
      ...selectedSub,
      status: 'GRADED',
      score: Number(inputScore),
      feedback: inputFeedback
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Quản Lý Bài Tập Về Nhà & Chấm Điểm
          </h1>
          <p className="text-xs text-slate-500">
            Giao bài tập mới, theo dõi tiến độ nộp bài của học sinh và nhập điểm nhận xét
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-500 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo & Giao Bài Tập Mới</span>
        </button>
      </div>

      {/* Homework Cards */}
      <div className="space-y-4">
        {homeworks.map((hw) => {
          const percentSubmitted = Math.round((hw.submittedCount / hw.totalStudents) * 100);
          return (
            <div
              key={hw.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full ring-1 ring-emerald-500/20">
                      Lớp {hw.className}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      • Môn {hw.subject}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{hw.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{hw.description}</p>
                </div>

                <button
                  onClick={() => handleOpenGrading(hw)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shrink-0"
                >
                  <BookOpenCheck className="h-4 w-4" />
                  <span>Chấm Bài ({hw.submittedCount - hw.gradedCount} bài chờ)</span>
                </button>
              </div>

              {/* Progress & Meta info */}
              <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-3 sm:grid-cols-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-600 mb-1">
                    <span>Tiến độ nộp bài:</span>
                    <span>{hw.submittedCount} / {hw.totalStudents} HS ({percentSubmitted}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-emerald-500 rounded-full"
                      style={{ width: `${percentSubmitted}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Hạn nộp: <strong className="text-slate-800">{hw.dueDate}</strong></span>
                </div>

                <div className="flex items-center justify-end gap-1.5 text-slate-500">
                  <span>Đã chấm điểm:</span>
                  <Badge variant="success" size="sm">
                    {hw.gradedCount} / {hw.submittedCount} bài
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Create Homework */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Tạo Bài Tập Về Nhà Mới"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tiêu đề bài tập *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Ôn tập chương 3: Hệ phương trình bậc nhất hai ẩn"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lớp giao bài *
              </label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-500 focus:outline-none"
              >
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
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Môn học
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Hạn chót nộp bài (Deadline) *
            </label>
            <input
              type="text"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="2026-10-25 23:59"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nội dung yêu cầu / Hướng dẫn giải
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ghi rõ số bài trong SGK, yêu cầu trình bày hoặc ghi chú..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tên file đính kèm (Đề bài PDF / Word)
            </label>
            <input
              type="text"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm"
            >
              Phát Bài Tập Ngay
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Grading Submissions */}
      <Modal
        isOpen={Boolean(gradingHw)}
        onClose={() => setGradingHw(null)}
        title={gradingHw ? `Chấm Bài Tập: ${gradingHw.title}` : 'Chấm Bài'}
        maxWidth="4xl"
      >
        {gradingHw && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Submissions List */}
            <div className="border-r border-slate-100 pr-4 space-y-2 max-h-[65vh] overflow-y-auto">
              <p className="text-xs font-bold uppercase text-slate-500 mb-2">
                Danh Sách Bài Nộp ({gradingHw.submissions.length})
              </p>
              {gradingHw.submissions.length > 0 ? (
                gradingHw.submissions.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSelectSubmission(sub)}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      selectedSub?.id === sub.id
                        ? 'border-emerald-500 bg-emerald-50/70'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{sub.studentName}</span>
                      {sub.status === 'GRADED' ? (
                        <Badge variant="success" size="sm">{sub.score}đ</Badge>
                      ) : (
                        <Badge variant="warning" size="sm">Chờ chấm</Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Nộp: {sub.submittedAt.split(' ')[1]}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-6 text-center">
                  Chưa có học sinh nào nộp bài.
                </p>
              )}
            </div>

            {/* Right: Submission Detail & Grade Input */}
            <div className="md:col-span-2 space-y-4">
              {selectedSub ? (
                <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {selectedSub.studentName} ({selectedSub.studentCode})
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Thời gian nộp: {selectedSub.submittedAt}
                      </p>
                    </div>

                    {selectedSub.status === 'GRADED' && (
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400">Điểm hiện tại:</span>
                        <div className="text-lg font-black text-emerald-600">{selectedSub.score} / 10</div>
                      </div>
                    )}
                  </div>

                  {/* Student Content / Attached Work */}
                  <div className="space-y-2">
                    <label className="font-semibold text-slate-700 block">Nội dung bài làm:</label>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed border border-slate-200">
                      {selectedSub.content || 'Học sinh nộp kèm file đính kèm hình ảnh lời giải.'}
                    </div>

                    {selectedSub.fileUrls && selectedSub.fileUrls.length > 0 && (
                      <div className="mt-2">
                        <label className="font-semibold text-slate-700 block mb-1">Ảnh chụp bài làm:</label>
                        <img
                          src={selectedSub.fileUrls[0]}
                          alt="Bài làm"
                          className="max-h-48 rounded-xl border border-slate-200 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Score & Feedback input */}
                  <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Điểm số (Thang 10) *
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        max="10"
                        required
                        value={inputScore}
                        onChange={(e) => setInputScore(Number(e.target.value))}
                        className="w-full font-bold text-base text-emerald-700 rounded-xl border border-slate-300 p-2 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block font-bold text-slate-800 mb-1">
                        Lời phê & Nhận xét của Giáo viên *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={inputFeedback}
                        onChange={(e) => setInputFeedback(e.target.value)}
                        placeholder="VD: Bài giải rất tốt, lập luận chặt chẽ..."
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition"
                    >
                      <Check className="h-4 w-4" />
                      <span>Lưu Điểm & Gửi Phản Hồi Cho Học Sinh</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Chọn một học sinh từ danh sách bên trái để chấm điểm.
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
