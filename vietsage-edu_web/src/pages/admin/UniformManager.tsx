import React, { useState } from 'react';
import {
  Shirt,
  Package,
  Plus,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Tag,
  Baby,
  BookOpen,
  School
} from 'lucide-react';
import { UniformItem, SchoolLevel } from '../../types';
import { StorageService } from '../../services/storage';
import { Badge } from '../../components/common/Badge';

export const UniformManager: React.FC = () => {
  const [uniforms, setUniforms] = useState<UniformItem[]>(() => StorageService.getUniforms());
  const [filterLevel, setFilterLevel] = useState<'ALL' | SchoolLevel>('ALL');

  const handleStockAdjust = (id: string, delta: number) => {
    const updated = uniforms.map((u) =>
      u.id === id ? { ...u, inStock: Math.max(0, u.inStock + delta) } : u
    );
    setUniforms(updated);
    StorageService.saveUniforms(updated);
  };

  const filteredUniforms = uniforms.filter((u) =>
    filterLevel === 'ALL' ? true : u.gradeGroup === filterLevel
  );

  const getLevelBadge = (level: SchoolLevel) => {
    switch (level) {
      case 'Mầm non':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 text-white px-2.5 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-md">
            <Baby className="h-3 w-3" />
            Mầm non
          </span>
        );
      case 'THCS':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-600/90 text-white px-2.5 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-md">
            <BookOpen className="h-3 w-3" />
            THCS
          </span>
        );
      case 'THPT':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/90 text-white px-2.5 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-md">
            <School className="h-3 w-3" />
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
            Quản Lý Đồng Phục Học Sinh
          </h1>
          <p className="text-xs text-slate-500">
            Kiểm kê kho đồng phục cho 3 cấp: <strong>Mầm non</strong>, <strong>THCS</strong> và <strong>THPT</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-800 ring-1 ring-blue-500/20">
            Tổng tồn kho: <strong>{filteredUniforms.reduce((a, b) => a + b.inStock, 0)} chiếc</strong>
          </span>
        </div>
      </div>

      {/* Tabs Filter 3 Levels */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['ALL', 'Mầm non', 'THCS', 'THPT'] as const).map((lvl) => {
          const isActive = filterLevel === lvl;
          const count = lvl === 'ALL' ? uniforms.length : uniforms.filter((u) => u.gradeGroup === lvl).length;
          return (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
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
              <span>{lvl === 'ALL' ? 'Tất Cả 3 Cấp' : `Đồng Phục ${lvl}`}</span>
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

      {/* Uniforms Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUniforms.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <div>
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="rounded-full bg-slate-900/75 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                    {item.category}
                  </span>
                  {getLevelBadge(item.gradeGroup)}
                </div>
                <span className="absolute bottom-3 right-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white shadow">
                  {item.price.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="p-4">
                <span className="font-mono text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  {item.code}
                </span>
                <h3 className="mt-1 text-sm font-bold text-slate-900 line-clamp-2">{item.name}</h3>

                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-semibold mr-1">Size:</span>
                  {item.sizes.map((s) => (
                    <span
                      key={s}
                      className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stock Management */}
            <div className="p-4 pt-0">
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[11px] text-slate-400 block">Tồn trong kho:</span>
                  <span
                    className={`text-sm font-bold ${
                      item.inStock < 50 ? 'text-amber-600' : 'text-slate-800'
                    }`}
                  >
                    {item.inStock} chiếc
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStockAdjust(item.id, -10)}
                    className="h-7 w-7 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                    title="Giảm 10"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => handleStockAdjust(item.id, +10)}
                    className="h-7 w-7 rounded-lg bg-blue-50 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                    title="Thêm 10"
                  >
                    +10
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
