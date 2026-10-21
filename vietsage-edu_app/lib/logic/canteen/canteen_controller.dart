import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';
import '../auth/account_manager.dart';

enum DayLockType {
  lockedPast,
  lockedCutoff,
  open,
}

class MenuItem {
  final String id;
  final String name;
  final String desc;
  final int calories;
  final IconData icon;
  final Color iconColor;
  bool isSelected;

  MenuItem({
    required this.id,
    required this.name,
    required this.desc,
    required this.calories,
    required this.icon,
    this.iconColor = const Color(0xFF2563EB),
    this.isSelected = true,
  });
}

class DayMenuData {
  final String id;
  final String shortName;
  final String label;
  final String fullName;
  final bool isToday;
  final List<MenuItem> desserts;
  final List<MenuItem> mainMeals;
  final List<MenuItem> snacks;

  DayMenuData({
    required this.id,
    required this.shortName,
    required this.label,
    required this.fullName,
    required this.isToday,
    required this.desserts,
    required this.mainMeals,
    required this.snacks,
  });
}

class CanteenController extends ChangeNotifier {
  late int _selectedDayIndex;

  int get selectedDayIndex => _selectedDayIndex;

  late final List<DayMenuData> daysData;

  CanteenController() {
    _selectedDayIndex = todayIndex;
    _initDaysData();
  }

  void _initDaysData() {
    daysData = [
      // --- THỨ HAI (T2) ---
      DayMenuData(
        id: 't2',
        shortName: 'T2',
        label: todayIndex == 0 ? 'T2 (Hôm nay)' : 'T2',
        fullName: todayIndex == 0 ? 'Thứ Hai (Hôm nay)' : 'Thứ Hai',
        isToday: todayIndex == 0,
        desserts: [
          MenuItem(
            id: 't2_d1',
            name: 'Dưa Hấu Đỏ Ruột',
            desc: 'Thanh mát, giàu vitamin A & C',
            calories: 60,
            icon: Icons.eco_rounded,
            iconColor: const Color(0xFFEF4444),
          ),
          MenuItem(
            id: 't2_d2',
            name: 'Sữa Chua Nha Đam',
            desc: 'Tốt cho tiêu hóa, mát lành',
            calories: 100,
            icon: Icons.local_drink_rounded,
            iconColor: const Color(0xFF10B981),
          ),
        ],
        mainMeals: [
          MenuItem(
            id: 't2_m1',
            name: 'Bò Hầm Khoai Tây Cà Rốt',
            desc: 'Mềm thơm đậm đà, giàu sắt & đạm',
            calories: 260,
            icon: Icons.dinner_dining_rounded,
            iconColor: const Color(0xFFB45309),
          ),
          MenuItem(
            id: 't2_m2',
            name: 'Đậu Phụ Nhồi Thịt Sốt Cà',
            desc: 'Vị chua ngọt thanh nhẹ',
            calories: 180,
            icon: Icons.lunch_dining_rounded,
            iconColor: const Color(0xFFEA580C),
          ),
          MenuItem(
            id: 't2_m3',
            name: 'Canh Ngao Nấu Chua',
            desc: 'Dứa, cà chua, hành hoa giải nhiệt',
            calories: 90,
            icon: Icons.soup_kitchen_rounded,
            iconColor: const Color(0xFF0284C7),
          ),
          MenuItem(
            id: 't2_m4',
            name: 'Bắp Cải Xào Thịt Nạc',
            desc: 'Rau xanh ngọt tự nhiên, bổ sung chất xơ',
            calories: 110,
            icon: Icons.grass_rounded,
            iconColor: const Color(0xFF16A34A),
          ),
          MenuItem(
            id: 't2_m5',
            name: 'Cơm Gạo ST25 Dẻo Thơm',
            desc: 'Gạo sạch chuẩn an toàn, dẻo ngọt',
            calories: 200,
            icon: Icons.rice_bowl_rounded,
            iconColor: const Color(0xFFD97706),
          ),
        ],
        snacks: [
          MenuItem(
            id: 't2_s1',
            name: 'Bánh Bông Lan Trứng Muối',
            desc: 'Mềm xốp, đậm đà dinh dưỡng',
            calories: 160,
            icon: Icons.cake_rounded,
            iconColor: const Color(0xFFF59E0B),
          ),
          MenuItem(
            id: 't2_s2',
            name: 'Sữa Tươi Tiệt Trùng Ít Đường',
            desc: 'Hộp 180ml bổ sung canxi phát triển chiều cao',
            calories: 120,
            icon: Icons.coffee_rounded,
            iconColor: const Color(0xFF3B82F6),
          ),
        ],
      ),

      // --- THỨ BA (T3) ---
      DayMenuData(
        id: 't3',
        shortName: 'T3',
        label: todayIndex == 1 ? 'T3 (Hôm nay)' : 'T3',
        fullName: todayIndex == 1 ? 'Thứ Ba (Hôm nay)' : 'Thứ Ba',
        isToday: todayIndex == 1,
        desserts: [
          MenuItem(
            id: 't3_d1',
            name: 'Chuối Tiêu Chín Cây',
            desc: 'Bổ sung kali và năng lượng tự nhiên',
            calories: 90,
            icon: Icons.eco_rounded,
            iconColor: const Color(0xFFEAB308),
          ),
          MenuItem(
            id: 't3_d2',
            name: 'Chè Hạt Sen Long Nhãn',
            desc: 'Thanh lọc cơ thể, giúp ngủ ngon',
            calories: 130,
            icon: Icons.icecream_rounded,
            iconColor: const Color(0xFFD97706),
          ),
        ],
        mainMeals: [
          MenuItem(
            id: 't3_m1',
            name: 'Gà Ta Hấp Lá Chanh',
            desc: 'Thịt chắc ngọt thơm nồng vị lá chanh',
            calories: 240,
            icon: Icons.kebab_dining_rounded,
            iconColor: const Color(0xFFD97706),
          ),
          MenuItem(
            id: 't3_m2',
            name: 'Trứng Cuộn Ngũ Sắc',
            desc: 'Trứng gà tươi cuộn cà rốt, bắp ngọt',
            calories: 160,
            icon: Icons.egg_rounded,
            iconColor: const Color(0xFFF59E0B),
          ),
          MenuItem(
            id: 't3_m3',
            name: 'Canh Sườn Nấu Bí Xanh',
            desc: 'Nước hầm xương ngọt thanh mát lành',
            calories: 120,
            icon: Icons.soup_kitchen_rounded,
            iconColor: const Color(0xFF0D9488),
          ),
          MenuItem(
            id: 't3_m4',
            name: 'Cải Thìa Xào Nấm Hương',
            desc: 'Giàu khoáng chất và chất chống oxy hóa',
            calories: 95,
            icon: Icons.grass_rounded,
            iconColor: const Color(0xFF16A34A),
          ),
          MenuItem(
            id: 't3_m5',
            name: 'Cơm Tám Điện Biên',
            desc: 'Hạt cơm tròn mẩy, hương thơm dịu nhẹ',
            calories: 200,
            icon: Icons.rice_bowl_rounded,
            iconColor: const Color(0xFFB45309),
          ),
        ],
        snacks: [
          MenuItem(
            id: 't3_s1',
            name: 'Bánh Bao Nhân Thịt Trứng Cút',
            desc: 'Vỏ bánh mềm mịn, nhân thịt thơm phức',
            calories: 190,
            icon: Icons.breakfast_dining_rounded,
            iconColor: const Color(0xFFEA580C),
          ),
          MenuItem(
            id: 't3_s2',
            name: 'Nước Ép Táo Nguyên Chất',
            desc: '100% táo tươi ép không đường hóa học',
            calories: 95,
            icon: Icons.local_cafe_rounded,
            iconColor: const Color(0xFFEF4444),
          ),
        ],
      ),

      // --- THỨ TƯ (T4 - HÔM NAY) ---
      DayMenuData(
        id: 't4',
        shortName: 'T4',
        label: todayIndex == 2 ? 'T4 (Hôm nay)' : 'T4',
        fullName: todayIndex == 2 ? 'Thứ Tư (Hôm nay)' : 'Thứ Tư',
        isToday: todayIndex == 2,
        desserts: [
          MenuItem(
            id: 't4_d1',
            name: 'Thanh Long Ruột Đỏ',
            desc: 'Tươi ngọt thanh, giàu vitamin C & canxi',
            calories: 70,
            icon: Icons.eco_rounded,
            iconColor: const Color(0xFFEC4899),
          ),
          MenuItem(
            id: 't4_d2',
            name: 'Sữa Chua Hy Lạp Trái Cây',
            desc: 'Nhiều đạm tự nhiên, men vi sinh có lợi',
            calories: 115,
            icon: Icons.icecream_rounded,
            iconColor: const Color(0xFF8B5CF6),
          ),
        ],
        mainMeals: [
          MenuItem(
            id: 't4_m1',
            name: 'Sườn Heo Ram Mặn Ngọt',
            desc: 'Sườn non mềm ngấm sốt đậm đà thơm ngon',
            calories: 280,
            icon: Icons.lunch_dining_rounded,
            iconColor: const Color(0xFFDC2626),
          ),
          MenuItem(
            id: 't4_m2',
            name: 'Tôm Đồng Rim Tiêu Xanh',
            desc: 'Tôm tươi giòn, bổ sung dồi dào canxi',
            calories: 170,
            icon: Icons.set_meal_rounded,
            iconColor: const Color(0xFFF97316),
          ),
          MenuItem(
            id: 't4_m3',
            name: 'Canh Cua Mồng Tơi Mướp Hương',
            desc: 'Cua đồng giã tay, mát ruột chuẩn vị hè',
            calories: 110,
            icon: Icons.soup_kitchen_rounded,
            iconColor: const Color(0xFF059669),
          ),
          MenuItem(
            id: 't4_m4',
            name: 'Bí Đỏ Xào Thịt Băm',
            desc: 'Bí đỏ bùi béo, tốt cho thị lực & trí não',
            calories: 125,
            icon: Icons.grass_rounded,
            iconColor: const Color(0xFFD97706),
          ),
          MenuItem(
            id: 't4_m5',
            name: 'Cơm Hạt Sen Dinh Dưỡng',
            desc: 'Cơm nấu cùng hạt sen tươi thanh nhẹ bổ dưỡng',
            calories: 210,
            icon: Icons.rice_bowl_rounded,
            iconColor: const Color(0xFFCA8A04),
          ),
        ],
        snacks: [
          MenuItem(
            id: 't4_s1',
            name: 'Bánh Mì Hoa Cúc Bơ Sữa',
            desc: 'Thơm ngậy hương hoa cúc, cung cấp năng lượng',
            calories: 175,
            icon: Icons.bakery_dining_rounded,
            iconColor: const Color(0xFFF59E0B),
          ),
          MenuItem(
            id: 't4_s2',
            name: 'Sữa Hạt Hạnh Nhân Óc Chó',
            desc: 'Giàu Omega-3 phát triển trí não cho bé',
            calories: 130,
            icon: Icons.local_drink_rounded,
            iconColor: const Color(0xFF2563EB),
          ),
        ],
      ),

      // --- THỨ NĂM (T5) ---
      DayMenuData(
        id: 't5',
        shortName: 'T5',
        label: todayIndex == 3 ? 'T5 (Hôm nay)' : 'T5',
        fullName: todayIndex == 3 ? 'Thứ Năm (Hôm nay)' : 'Thứ Năm',
        isToday: todayIndex == 3,
        desserts: [
          MenuItem(
            id: 't5_d1',
            name: 'Quýt Sài Gòn Mọng Nước',
            desc: 'Ngọt lịm, tép mọng nước, tăng đề kháng',
            calories: 65,
            icon: Icons.eco_rounded,
            iconColor: const Color(0xFFF97316),
          ),
          MenuItem(
            id: 't5_d2',
            name: 'Thạch Rau Câu Trái Cây',
            desc: 'Thanh nhiệt giòn mát, chiết xuất tự nhiên',
            calories: 80,
            icon: Icons.icecream_rounded,
            iconColor: const Color(0xFF06B6D4),
          ),
        ],
        mainMeals: [
          MenuItem(
            id: 't5_m1',
            name: 'Thịt Kho Trứng Cút Cốt Dừa',
            desc: 'Màu nâu cánh gián, thịt mềm ngậy vị dừa',
            calories: 290,
            icon: Icons.lunch_dining_rounded,
            iconColor: const Color(0xFFB45309),
          ),
          MenuItem(
            id: 't5_m2',
            name: 'Chả Cá Thu Sốt Cà Chua',
            desc: 'Chả cá thu dai giòn thơm ngon hảo hạng',
            calories: 190,
            icon: Icons.set_meal_rounded,
            iconColor: const Color(0xFFEF4444),
          ),
          MenuItem(
            id: 't5_m3',
            name: 'Canh Cải Cúc Nấu Thịt Nạc',
            desc: 'Cải cúc tươi ngọt dịu, thanh lọc cơ thể',
            calories: 95,
            icon: Icons.soup_kitchen_rounded,
            iconColor: const Color(0xFF10B981),
          ),
          MenuItem(
            id: 't5_m4',
            name: 'Đậu Que Xào Thịt Bò',
            desc: 'Đậu que giòn ngọt kết hợp bò mềm bổ máu',
            calories: 135,
            icon: Icons.grass_rounded,
            iconColor: const Color(0xFF16A34A),
          ),
          MenuItem(
            id: 't5_m5',
            name: 'Cơm Gạo Lứt Huyết Rồng',
            desc: 'Giàu chất xơ, vitamin nhóm B hữu cơ',
            calories: 195,
            icon: Icons.rice_bowl_rounded,
            iconColor: const Color(0xFF991B1B),
          ),
        ],
        snacks: [
          MenuItem(
            id: 't5_s1',
            name: 'Bánh Su Kem Phô Mai',
            desc: 'Vỏ mỏng giòn, ngập nhân kem sữa tươi béo ngậy',
            calories: 150,
            icon: Icons.cake_rounded,
            iconColor: const Color(0xFFEAB308),
          ),
          MenuItem(
            id: 't5_s2',
            name: 'Sữa Chua Uống Men Sống',
            desc: 'Tăng cường hệ miễn dịch đường ruột',
            calories: 105,
            icon: Icons.local_drink_rounded,
            iconColor: const Color(0xFF0284C7),
          ),
        ],
      ),

      // --- THỨ SÁU (T6) ---
      DayMenuData(
        id: 't6',
        shortName: 'T6',
        label: todayIndex == 4 ? 'T6 (Hôm nay)' : 'T6',
        fullName: todayIndex == 4 ? 'Thứ Sáu (Hôm nay)' : 'Thứ Sáu',
        isToday: todayIndex == 4,
        desserts: [
          MenuItem(
            id: 't6_d1',
            name: 'Xoài Cát Hòa Lộc',
            desc: 'Thơm lừng, ngọt thanh tự nhiên',
            calories: 110,
            icon: Icons.eco_rounded,
            iconColor: const Color(0xFFF59E0B),
          ),
          MenuItem(
            id: 't6_d2',
            name: 'Pudding Xoài Hạt Chia',
            desc: 'Mềm mượt, dồi dào chất xơ & Omega-3',
            calories: 120,
            icon: Icons.icecream_rounded,
            iconColor: const Color(0xFFE11D48),
          ),
        ],
        mainMeals: [
          MenuItem(
            id: 't6_m1',
            name: 'Cá Hồi Áp Chảo Sốt Cam',
            desc: 'Giàu DHA & protein, sốt cam chua dịu thơm ngon',
            calories: 250,
            icon: Icons.set_meal_rounded,
            iconColor: const Color(0xFFEA580C),
          ),
          MenuItem(
            id: 't6_m2',
            name: 'Bò Xào Nấm Kim Châm',
            desc: 'Thịt bò xào nhanh mềm mọng nước, nấm giòn',
            calories: 230,
            icon: Icons.lunch_dining_rounded,
            iconColor: const Color(0xFF9A3412),
          ),
          MenuItem(
            id: 't6_m3',
            name: 'Canh Rong Biển Đậu Hũ Non',
            desc: 'Thanh khiết, bổ sung i-ốt và canxi thực vật',
            calories: 90,
            icon: Icons.soup_kitchen_rounded,
            iconColor: const Color(0xFF047857),
          ),
          MenuItem(
            id: 't6_m4',
            name: 'Rau Củ Luộc Ngũ Sắc',
            desc: 'Bông cải, cà rốt, su su chấm kho quẹt',
            calories: 80,
            icon: Icons.grass_rounded,
            iconColor: const Color(0xFF16A34A),
          ),
          MenuItem(
            id: 't6_m5',
            name: 'Cơm Trắng Hạt Ngọc Trời',
            desc: 'Gạo dẻo thơm hảo hạng',
            calories: 200,
            icon: Icons.rice_bowl_rounded,
            iconColor: const Color(0xFFCA8A04),
          ),
        ],
        snacks: [
          MenuItem(
            id: 't6_s1',
            name: 'Bánh Tart Trứng Phô Mai',
            desc: 'Đế bánh ngàn lớp thơm lừng bơ Pháp',
            calories: 180,
            icon: Icons.bakery_dining_rounded,
            iconColor: const Color(0xFFD97706),
          ),
          MenuItem(
            id: 't6_s2',
            name: 'Sữa Đậu Nành Tươi Mộc',
            desc: 'Nấu nguyên chất mỗi ngày, ít ngọt thanh khiết',
            calories: 110,
            icon: Icons.coffee_rounded,
            iconColor: const Color(0xFF10B981),
          ),
        ],
      ),

      // --- THỨ BẢY (T7) ---
      DayMenuData(
        id: 't7',
        shortName: 'T7',
        label: todayIndex == 5 ? 'T7 (Hôm nay)' : 'T7',
        fullName: todayIndex == 5 ? 'Thứ Bảy (Hôm nay)' : 'Thứ Bảy',
        isToday: todayIndex == 5,
        desserts: [
          MenuItem(
            id: 't7_d1',
            name: 'Nho Mỹ Không Hạt',
            desc: 'Giòn ngọt, giàu chất chống oxy hóa tự nhiên',
            calories: 80,
            icon: Icons.eco_rounded,
            iconColor: const Color(0xFF7C3AED),
          ),
          MenuItem(
            id: 't7_d2',
            name: 'Sữa Chua Nếp Cẩm',
            desc: 'Vị bùi của nếp cẩm hòa quyện men sữa chua',
            calories: 140,
            icon: Icons.icecream_rounded,
            iconColor: const Color(0xFF9333EA),
          ),
        ],
        mainMeals: [
          MenuItem(
            id: 't7_m1',
            name: 'Mì Ý Sốt Bò Bằm Phô Mai',
            desc: 'Sợi mì dai chuẩn Ý, sốt bò bằm béo ngậy phô mai',
            calories: 310,
            icon: Icons.dinner_dining_rounded,
            iconColor: const Color(0xFFE11D48),
          ),
          MenuItem(
            id: 't7_m2',
            name: 'Đùi Gà Nướng Mật Ong Rừng',
            desc: 'Da gà giòn óng ánh, thịt mọng nước thơm lừng',
            calories: 260,
            icon: Icons.kebab_dining_rounded,
            iconColor: const Color(0xFFEA580C),
          ),
          MenuItem(
            id: 't7_m3',
            name: 'Soup Gà Nấm Hương Ngô Non',
            desc: 'Vị ngọt thanh từ nước luộc gà và ngô ngọt',
            calories: 120,
            icon: Icons.soup_kitchen_rounded,
            iconColor: const Color(0xFFF59E0B),
          ),
          MenuItem(
            id: 't7_m4',
            name: 'Salad Rau Củ Trái Cây Sốt Mayonnaise',
            desc: 'Xà lách, cà chua bi, dưa leo, táo sốt béo dịu',
            calories: 95,
            icon: Icons.grass_rounded,
            iconColor: const Color(0xFF16A34A),
          ),
          MenuItem(
            id: 't7_m5',
            name: 'Bánh Mì Bơ Tỏi Nướng Giòn',
            desc: 'Ăn kèm soup hoặc mì Ý cực thơm ngon',
            calories: 140,
            icon: Icons.breakfast_dining_rounded,
            iconColor: const Color(0xFFB45309),
          ),
        ],
        snacks: [
          MenuItem(
            id: 't7_s1',
            name: 'Bánh Waffle Mật Ong Bơ Tươi',
            desc: 'Bánh quế tổ ong giòn rụm thơm phức',
            calories: 170,
            icon: Icons.cake_rounded,
            iconColor: const Color(0xFFD97706),
          ),
          MenuItem(
            id: 't7_s2',
            name: 'Nước Ép Cam Tươi Nguyên Chất',
            desc: 'Cam sành tươi vắt giàu vitamin C nâng cao thể lực',
            calories: 100,
            icon: Icons.local_drink_rounded,
            iconColor: const Color(0xFFF97316),
          ),
        ],
      ),
    ];
  }

  static int get todayIndex {
    final wd = DateTime.now().weekday; // 1 = Thứ 2 ... 6 = Thứ 7, 7 = CN
    if (wd >= 1 && wd <= 6) return wd - 1;
    return 0; // Chủ nhật mặc định hiển thị Thứ 2
  }
  static const int cutoffHour = 10; // Chốt lúc 10:00 sáng
  static const int cutoffMinute = 0;

  bool _simulateBeforeCutoff = false; // Chế độ giả lập trước 10:00 để test

  bool get simulateBeforeCutoff => _simulateBeforeCutoff;

  void toggleSimulation() {
    _simulateBeforeCutoff = !_simulateBeforeCutoff;
    notifyListeners();
  }

  bool get isPastCutoffToday {
    if (_simulateBeforeCutoff) return false;
    final now = DateTime.now();
    if (now.hour > cutoffHour) return true;
    if (now.hour == cutoffHour && now.minute >= cutoffMinute) return true;
    return false;
  }

  DayLockType getDayLockType(int dayIndex) {
    if (dayIndex < todayIndex) {
      return DayLockType.lockedPast; // Đã qua
    } else if (dayIndex == todayIndex) {
      return isPastCutoffToday ? DayLockType.lockedCutoff : DayLockType.open;
    } else {
      return DayLockType.open; // Mở cho chọn trước
    }
  }

  bool isDayLocked(int dayIndex) {
    return getDayLockType(dayIndex) != DayLockType.open;
  }

  bool get isCurrentDayLocked => isDayLocked(_selectedDayIndex);

  String getDayLockReason(int dayIndex) {
    final type = getDayLockType(dayIndex);
    switch (type) {
      case DayLockType.lockedPast:
        return 'Thực đơn ngày này đã qua thời gian chọn và được lưu trữ.';
      case DayLockType.lockedCutoff:
        return 'Đã quá 10:00 sáng - Bếp ăn đã chốt thực đơn chuẩn bị bữa trưa.';
      case DayLockType.open:
        return dayIndex == todayIndex
            ? 'Đang mở chọn món cho hôm nay (Hạn chót: trước 10:00 sáng).'
            : 'Đang mở chọn trước món ăn cho bé.';
    }
  }

  // Trạng thái đã lưu/chốt chọn của phụ huynh từng ngày
  late final Map<int, bool> _daySavedStatus = {
    for (int i = 0; i < 6; i++) i: i < todayIndex,
  };

  bool isDaySaved(int dayIndex) => _daySavedStatus[dayIndex] ?? false;

  bool get isCurrentDaySaved => isDaySaved(_selectedDayIndex);

  void markDayAsSaved(int dayIndex) {
    _daySavedStatus[dayIndex] = true;
    notifyListeners();
    _syncMealRegistrationToApi(dayIndex);
  }

  void _syncMealRegistrationToApi(int dayIndex) async {
    try {
      final day = daysData[dayIndex];
      final selectedItems = [
        ...day.desserts.where((m) => m.isSelected).map((m) => m.name),
        ...day.mainMeals.where((m) => m.isSelected).map((m) => m.name),
        ...day.snacks.where((m) => m.isSelected).map((m) => m.name),
      ];
      final currentAcc = AccountManager().currentAccount;
      await ApiServices.canteen.registerMeal(
        studentId: currentAcc.studentCode,
        studentName: currentAcc.name,
        dayId: day.id,
        selectedItems: selectedItems,
      );
    } catch (_) {}
  }

  DayMenuData get currentDayMenu => daysData[_selectedDayIndex];

  void selectDay(int index) {
    if (index >= 0 && index < daysData.length) {
      _selectedDayIndex = index;
      notifyListeners();
    }
  }

  bool toggleItem(MenuItem item, int dayIndex) {
    if (isDayLocked(dayIndex)) {
      return false; // Không thể sửa ngày đã bị khóa
    }
    item.isSelected = !item.isSelected;
    _daySavedStatus[dayIndex] = false; // Khi thay đổi món thì quay về trạng thái chưa lưu
    notifyListeners();
    return true;
  }

  // Khôi phục về khẩu phần chuẩn dinh dưỡng mặc định của trường
  void resetToDefault(int dayIndex) {
    if (isDayLocked(dayIndex)) return;
    final day = daysData[dayIndex];
    for (final item in [...day.desserts, ...day.mainMeals, ...day.snacks]) {
      item.isSelected = true;
    }
    _daySavedStatus[dayIndex] = false;
    notifyListeners();
  }

  int get selectedCount => selectedCountForDay(_selectedDayIndex);

  int selectedCountForDay(int dayIndex) {
    final day = daysData[dayIndex];
    int count = 0;
    for (final item in [...day.desserts, ...day.mainMeals, ...day.snacks]) {
      if (item.isSelected) count++;
    }
    return count;
  }

  int get totalCount => totalCountForDay(_selectedDayIndex);

  int totalCountForDay(int dayIndex) {
    final day = daysData[dayIndex];
    return day.desserts.length + day.mainMeals.length + day.snacks.length;
  }

  int get totalCalories => totalCaloriesForDay(_selectedDayIndex);

  int totalCaloriesForDay(int dayIndex) {
    final day = daysData[dayIndex];
    int cal = 0;
    for (final item in [...day.desserts, ...day.mainMeals, ...day.snacks]) {
      if (item.isSelected) cal += item.calories;
    }
    return cal;
  }
}
