import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  Send,
  AlertCircle,
  Calendar,
  Users
} from 'lucide-react';
import { Announcement } from '../../types';
import { StorageService } from '../../services/storage';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AnnouncementsManager: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    StorageService.getAnnouncements()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'TOÀN TRƯỜNG' | 'GIÁO VIÊN' | 'PHỤ HUYNH' | 'KHẨN CẤP'>('TOÀN TRƯỜNG');
  const [targetAudience, setTargetAudience] = useState('');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');

  const handleOpenAdd = () => {
    setTitle('');
    setContent('');
    setCategory('TOÀN TRƯỜNG');
    setTargetAudience('');
    setPriority('NORMAL');
    setIsModalOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const newAnn: Announcement = {
      id: `ann_${Date.now()}`,
      title,
      content,
      author: 'Ban Giám Hiệu',
      category,
      targetAudience,
      createdAt: dateStr,
      priority
    };

    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    StorageService.saveAnnouncements(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa thông báo này?')) {
      const updated = announcements.filter((a) => a.id !== id);
      setAnnouncements(updated);
      StorageService.saveAnnouncements(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Bản Tin & Thông Báo Nhà Trường
          </h1>
          <p className="text-xs text-slate-500">
            Kênh thông tin chính thức phát đến ứng dụng di động của giáo viên và phụ huynh
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo Thông Báo Mới</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      ann.priority === 'URGENT'
                        ? 'danger'
                        : ann.priority === 'HIGH'
                        ? 'warning'
                        : 'info'
                    }
                    size="sm"
                  >
                    {ann.category}
                  </Badge>
                  <span className="text-xs text-slate-400">• Đăng lúc {ann.createdAt}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
              </div>

              <button
                onClick={() => handleDelete(ann.id)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                title="Xóa thông báo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <span>Người nhận: <strong>{ann.targetAudience}</strong></span>
              </div>
              <span>Người phát: <strong>{ann.author}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* New Announcement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Đăng Bản Tin / Thông Báo Mới"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tiêu đề thông báo *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Lịch nghỉ lễ và tổ chức hội đồng thi thử THPT"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Phân loại đối tượng
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value="TOÀN TRƯỜNG">TOÀN TRƯỜNG</option>
                <option value="GIÁO VIÊN">GIÁO VIÊN</option>
                <option value="PHỤ HUYNH">PHỤ HUYNH</option>
                <option value="KHẨN CẤP">KHẨN CẤP</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Độ ưu tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value="NORMAL">Bình thường (Normal)</option>
                <option value="HIGH">Quan trọng (High)</option>
                <option value="URGENT">Khẩn cấp (Urgent)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Phạm vi gửi cụ thể (Cấp học / Đối tượng)
            </label>
            <input
              type="text"
              list="audience-presets"
              required
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Chọn hoặc nhập đối tượng (VD: Phụ huynh Khối Mầm Non...)"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
            />
            <datalist id="audience-presets">
              <option value="Toàn trường (Mầm non • THCS • THPT)" />
              <option value="Phụ huynh Khối Mầm Non (Lá 1, Chồi 2, Mầm 1)" />
              <option value="Phụ huynh & Học sinh Khối THCS" />
              <option value="Phụ huynh & Học sinh Khối THPT" />
              <option value="Toàn thể Giáo viên & Cán bộ Nhà trường" />
            </datalist>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nội dung chi tiết *
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung đầy đủ của thông báo..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm"
            >
              Phát Thông Báo Ngay
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
