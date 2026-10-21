import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Flame,
  Calendar,
  CheckCircle2,
  Users,
  Edit2,
  Baby,
  School,
  Milk,
  Apple
} from 'lucide-react';
import { CanteenMeal, SchoolLevel } from '../../types';
import { StorageService } from '../../services/storage';
import { Modal } from '../../components/common/Modal';

export const CanteenManager: React.FC = () => {
  const [meals, setMeals] = useState<CanteenMeal[]>(() => StorageService.getCanteen());
  const [activeTab, setActiveTab] = useState<'ALL' | 'MAM_NON' | 'THCS_THPT'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<CanteenMeal | null>(null);

  // Form State
  const [date, setDate] = useState('2026-10-19');
  const [dayOfWeek, setDayOfWeek] = useState('Thứ Hai');
  const [mainDish, setMainDish] = useState('');
  const [sideDish, setSideDish] = useState('');
  const [soup, setSoup] = useState('');
  const [dessert, setDessert] = useState('');
  const [nutritionKcal, setNutritionKcal] = useState(700);

  // Preschool Form State
  const [morningSnack, setMorningSnack] = useState('');
  const [lunchMain, setLunchMain] = useState('');
  const [afternoonSnack, setAfternoonSnack] = useState('');
  const [milkType, setMilkType] = useState('');

  const handleOpenEdit = (meal: CanteenMeal) => {
    setEditingMeal(meal);
    setDate(meal.date);
    setDayOfWeek(meal.dayOfWeek);
    setMainDish(meal.mainDish);
    setSideDish(meal.sideDish);
    setSoup(meal.soup);
    setDessert(meal.dessert);
    setNutritionKcal(meal.nutritionKcal);
    if (meal.preschoolMenu) {
      setMorningSnack(meal.preschoolMenu.morningSnack);
      setLunchMain(meal.preschoolMenu.lunchMain);
      setAfternoonSnack(meal.preschoolMenu.afternoonSnack);
      setMilkType(meal.preschoolMenu.milkType);
    } else {
      setMorningSnack('Cháo sườn non hạt sen');
      setLunchMain('Cơm mềm, thịt băm rim trứng, canh rau ngót');
      setAfternoonSnack('Sữa chua & Bánh flan mềm');
      setMilkType('Sữa tươi thanh trùng 180ml');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMeal) {
      const updated = meals.map((m) =>
        m.id === editingMeal.id
          ? {
              ...m,
              date,
              dayOfWeek,
              mainDish,
              sideDish,
              soup,
              dessert,
              nutritionKcal,
              preschoolMenu: {
                morningSnack,
                lunchMain,
                afternoonSnack,
                milkType
              }
            }
          : m
      );
      setMeals(updated);
      StorageService.saveCanteen(updated);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Quản Lý Bán Trú & Suất Ăn Dinh Dưỡng
          </h1>
          <p className="text-xs text-slate-500">
            Chế độ ăn chuyên biệt cho 3 cấp: <strong>Thực đơn 3 bữa Mầm non</strong> & <strong>Suất trưa năng lượng THCS - THPT</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-800 ring-1 ring-amber-500/20">
            Tổng suất ăn hôm nay: <strong>680 suất (180 bé Mầm non + 500 học sinh THCS/THPT)</strong>
          </span>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'ALL'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <UtensilsCrossed className="h-4 w-4" />
          <span>Tổng Quan Cả 3 Cấp</span>
        </button>

        <button
          onClick={() => setActiveTab('MAM_NON')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'MAM_NON'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Baby className="h-4 w-4 text-amber-700" />
          <span>Thực Đơn Mầm Non (3 Bữa + Sữa)</span>
        </button>

        <button
          onClick={() => setActiveTab('THCS_THPT')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'THCS_THPT'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <School className="h-4 w-4 text-blue-700" />
          <span>Thực Đơn THCS & THPT (Suất Trưa)</span>
        </button>
      </div>

      {/* Weekly Menu Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="font-extrabold text-sm text-blue-600">
                    {meal.dayOfWeek}
                  </span>
                  <p className="text-xs text-slate-400">{meal.date}</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-500/20">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span>{meal.nutritionKcal} Kcal (THCS/THPT)</span>
                </div>
              </div>

              {/* Phân khu THCS & THPT */}
              {(activeTab === 'ALL' || activeTab === 'THCS_THPT') && (
                <div className="mt-3 rounded-xl bg-blue-50/40 p-3 border border-blue-100/70 space-y-2 text-xs">
                  <span className="font-bold text-blue-900 text-[11px] uppercase flex items-center gap-1.5">
                    <School className="h-3.5 w-3.5 text-blue-600" />
                    Khẩu phần THCS & THPT:
                  </span>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">MÓN MẶN:</span>
                    <p className="font-bold text-slate-800">{meal.mainDish}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">MÓN PHỤ & CANH:</span>
                    <p className="text-slate-700 font-medium">{meal.sideDish} • {meal.soup}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">TRÁNG MIỆNG:</span>
                    <p className="text-emerald-700 font-semibold">{meal.dessert}</p>
                  </div>
                </div>
              )}

              {/* Phân khu Mầm Non */}
              {(activeTab === 'ALL' || activeTab === 'MAM_NON') && meal.preschoolMenu && (
                <div className="mt-3 rounded-xl bg-amber-50/50 p-3 border border-amber-200/70 space-y-2 text-xs">
                  <span className="font-bold text-amber-900 text-[11px] uppercase flex items-center gap-1.5">
                    <Baby className="h-3.5 w-3.5 text-amber-600" />
                    Khẩu phần Mầm Non (3 bữa dinh dưỡng):
                  </span>
                  <div>
                    <span className="text-[10px] text-amber-800 font-semibold block">BỮA PHỤ SÁNG (08:00):</span>
                    <p className="font-medium text-slate-800">{meal.preschoolMenu.morningSnack}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-800 font-semibold block">BỮA TRƯA MỀM (10:45):</span>
                    <p className="font-bold text-slate-800">{meal.preschoolMenu.lunchMain}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-800 font-semibold block">BỮA XẾ CHIỀU (14:15):</span>
                    <p className="font-medium text-slate-800">{meal.preschoolMenu.afternoonSnack}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-blue-700 font-semibold pt-1 border-t border-amber-200/40">
                    <Milk className="h-3.5 w-3.5 text-blue-500" />
                    <span>{meal.preschoolMenu.milkType}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => handleOpenEdit(meal)}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Cập nhật món tuần</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Meal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Chỉnh Sửa Thực Đơn ${dayOfWeek} (3 Cấp Học)`}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="font-bold text-slate-800 border-b pb-1 text-sm">
            1. Khẩu phần THCS & THPT
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Món mặn chính *</label>
              <input
                type="text"
                required
                value={mainDish}
                onChange={(e) => setMainDish(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Món xào / phụ *</label>
              <input
                type="text"
                required
                value={sideDish}
                onChange={(e) => setSideDish(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Canh dinh dưỡng</label>
              <input
                type="text"
                required
                value={soup}
                onChange={(e) => setSoup(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tráng miệng</label>
              <input
                type="text"
                required
                value={dessert}
                onChange={(e) => setDessert(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Năng lượng (Kcal)</label>
              <input
                type="number"
                value={nutritionKcal}
                onChange={(e) => setNutritionKcal(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
              />
            </div>
          </div>

          <div className="font-bold text-amber-900 border-b pb-1 pt-2 text-sm flex items-center gap-1.5">
            <Baby className="h-4 w-4 text-amber-600" />
            <span>2. Khẩu phần Dinh dưỡng Bé Mầm Non</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bữa phụ sáng (Cháo/Súp)</label>
              <input
                type="text"
                value={morningSnack}
                onChange={(e) => setMorningSnack(e.target.value)}
                placeholder="VD: Cháo sườn non hạt sen"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bữa trưa mềm & Canh</label>
              <input
                type="text"
                value={lunchMain}
                onChange={(e) => setLunchMain(e.target.value)}
                placeholder="VD: Cơm mềm, thịt bò băm rim..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bữa xế chiều (Bánh/Sữa chua)</label>
              <input
                type="text"
                value={afternoonSnack}
                onChange={(e) => setAfternoonSnack(e.target.value)}
                placeholder="VD: Sữa chua hoa quả & Bánh flan"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Loại sữa uống</label>
              <input
                type="text"
                value={milkType}
                onChange={(e) => setMilkType(e.target.value)}
                placeholder="VD: Sữa tươi thanh trùng 180ml"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
              />
            </div>
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
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-500"
            >
              Lưu Thực Đơn
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
