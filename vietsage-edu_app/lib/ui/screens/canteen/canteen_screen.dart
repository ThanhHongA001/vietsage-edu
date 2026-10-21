import 'package:flutter/material.dart';
import '../../../logic/canteen/canteen_controller.dart';
import '../../theme/app_theme.dart';

class CanteenScreen extends StatefulWidget {
  const CanteenScreen({super.key});

  @override
  State<CanteenScreen> createState() => _CanteenScreenState();
}

class _CanteenScreenState extends State<CanteenScreen> with SingleTickerProviderStateMixin {
  late final CanteenController _controller;
  late final TabController _tabController;

  @override
  void initState() {
    super.initState();
    _controller = CanteenController();
    _tabController = TabController(
      length: _controller.daysData.length,
      initialIndex: _controller.selectedDayIndex,
      vsync: this,
    );
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) {
        _controller.selectDay(_tabController.index);
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _controller,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('Thực Đơn'),
            actions: [
              // Nút tiện ích để test nhanh giả lập giờ trước/sau 10:00 sáng
              IconButton(
                tooltip: _controller.simulateBeforeCutoff
                    ? 'Đang giả lập: 09:00 (Trước 10:00 - Mở chọn)'
                    : 'Giờ thực tế: Sau 10:00 (Đã khóa hôm nay)',
                icon: Icon(
                  _controller.simulateBeforeCutoff
                      ? Icons.lock_open_rounded
                      : Icons.lock_clock_rounded,
                  color: _controller.simulateBeforeCutoff ? Colors.amberAccent : Colors.white,
                ),
                onPressed: () {
                  _controller.toggleSimulation();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        _controller.simulateBeforeCutoff
                            ? 'Đã kích hoạt giả lập 09:00 sáng (Chưa đến 10:00 -> Hôm nay mở chọn món)'
                            : 'Đang theo giờ thực tế (Đã quá 10:00 -> Hôm nay đã khóa chọn món)',
                      ),
                      duration: const Duration(seconds: 2),
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                },
              ),
            ],
            bottom: TabBar(
              controller: _tabController,
              isScrollable: true,
              tabAlignment: TabAlignment.start,
              labelColor: Colors.white,
              unselectedLabelColor: Colors.white70,
              indicatorColor: Colors.white,
              indicatorWeight: 3,
              tabs: _controller.daysData.asMap().entries.map((entry) {
                final index = entry.key;
                final d = entry.value;
                final isLocked = _controller.isDayLocked(index);

                return Tab(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (isLocked) ...[
                        const Icon(Icons.lock_rounded, size: 13, color: Colors.white70),
                        const SizedBox(width: 4),
                      ],
                      Text(
                        d.shortName,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      if (d.isToday) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.amber.shade300,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Text(
                            'Hôm nay',
                            style: TextStyle(
                              color: Color(0xFF78350F),
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
          body: TabBarView(
            controller: _tabController,
            children: _controller.daysData.asMap().entries.map((entry) {
              return _buildDayContent(entry.value, entry.key);
            }).toList(),
          ),
          bottomNavigationBar: _buildBottomBar(context),
        );
      },
    );
  }

  Widget _buildDayContent(DayMenuData day, int dayIndex) {
    final isLocked = _controller.isDayLocked(dayIndex);

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
      children: [
        // 1. Banner tổng quan trạng thái ngày & dinh dưỡng
        _buildDayBanner(day, dayIndex),
        const SizedBox(height: 10),

        // Thông báo hệ thống tự chọn mặc định nếu phụ huynh không chọn
        _buildDefaultPolicyNotice(dayIndex, isLocked),
        const SizedBox(height: 12),

        // 2. Nhóm Tráng Miệng (2 món)
        _buildMealSection(
          title: 'Tráng Miệng',
          timeBadge: 'Sau bữa trưa',
          icon: Icons.eco_rounded,
          iconColor: const Color(0xFF10B981),
          items: day.desserts,
          dayIndex: dayIndex,
        ),
        const SizedBox(height: 14),

        // 3. Nhóm Bữa Chính (4-6 món: 5 món)
        _buildMealSection(
          title: 'Bữa Chính',
          timeBadge: 'Bữa trưa 11:30 - 12:00',
          icon: Icons.restaurant_rounded,
          iconColor: const Color(0xFF2563EB),
          items: day.mainMeals,
          dayIndex: dayIndex,
        ),
        const SizedBox(height: 14),

        // 4. Nhóm Bữa Phụ (2 món)
        _buildMealSection(
          title: 'Bữa Phụ',
          timeBadge: 'Chiều 15:30',
          icon: Icons.bakery_dining_rounded,
          iconColor: const Color(0xFFF59E0B),
          items: day.snacks,
          dayIndex: dayIndex,
        ),
        const SizedBox(height: 14),

        // 5. Cam kết an toàn thực phẩm
        _buildSafetyNotice(),
      ],
    );
  }

  Widget _buildDayBanner(DayMenuData day, int dayIndex) {
    final lockType = _controller.getDayLockType(dayIndex);

    List<Color> gradientColors;
    IconData statusIcon;
    String statusTitle;
    String statusSubtitle;
    String statusBadge;
    Color badgeBg;
    Color badgeTextColor;

    switch (lockType) {
      case DayLockType.lockedPast:
        gradientColors = const [Color(0xFF475569), Color(0xFF64748B)];
        statusIcon = Icons.lock_outline_rounded;
        statusTitle = 'Thực Đơn Đã Khóa (${day.fullName})';
        statusSubtitle = 'Ngày đã qua thời hạn. Khẩu phần của bé đã hoàn tất.';
        statusBadge = 'ĐÃ QUA HẠN';
        badgeBg = Colors.white24;
        badgeTextColor = Colors.white;
        break;

      case DayLockType.lockedCutoff:
        gradientColors = const [Color(0xFF9A3412), Color(0xFFEA580C)];
        statusIcon = Icons.lock_clock_rounded;
        statusTitle = 'Đã Chốt Thực Đơn Hôm Nay (${day.shortName})';
        statusSubtitle = 'Đã quá 10:00 sáng. Nhà bếp đã chốt số lượng chế biến.';
        statusBadge = 'QUÁ HẠN 10:00';
        badgeBg = Colors.black26;
        badgeTextColor = Colors.amber.shade200;
        break;

      case DayLockType.open:
        gradientColors = const [Color(0xFF0F766E), Color(0xFF0D9488)];
        statusIcon = Icons.edit_calendar_rounded;
        statusTitle = day.isToday
            ? 'Đang Mở Chọn Món Hôm Nay (${day.shortName})'
            : 'Mở Đăng Ký Chọn Trước (${day.fullName})';
        statusSubtitle = day.isToday
            ? 'Chốt thực đơn vào 10:00 sáng hôm nay.'
            : 'Phụ huynh có thể chọn trước các món cho bé.';
        statusBadge = day.isToday ? 'HÔM NAY' : 'CHỌN TRƯỚC';
        badgeBg = Colors.amber.shade300;
        badgeTextColor = const Color(0xFF78350F);
        break;
    }

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: gradientColors,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: gradientColors.last.withValues(alpha: 0.25),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.18),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(statusIcon, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        statusTitle,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14.5,
                          fontWeight: FontWeight.bold,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                      decoration: BoxDecoration(
                        color: badgeBg,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        statusBadge,
                        style: TextStyle(
                          color: badgeTextColor,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  statusSubtitle,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 11.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDefaultPolicyNotice(int dayIndex, bool isLocked) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          const Icon(Icons.info_outline_rounded, color: AppTheme.textSecondary, size: 16),
          const SizedBox(width: 8),
          const Expanded(
            child: Text(
              'Nếu không tùy chọn, hệ thống tự động chọn mặc định đầy đủ món.',
              style: TextStyle(fontSize: 11.5, color: AppTheme.textSecondary),
            ),
          ),
          if (!isLocked)
            InkWell(
              borderRadius: BorderRadius.circular(8),
              onTap: () {
                _controller.resetToDefault(dayIndex);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      'Đã đặt lại thực đơn ${_controller.daysData[dayIndex].shortName} về mặc định của trường!',
                    ),
                    behavior: SnackBarBehavior.floating,
                    duration: const Duration(seconds: 1),
                  ),
                );
              },
              child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.restart_alt_rounded, size: 14, color: AppTheme.primary),
                    SizedBox(width: 2),
                    Text(
                      'Mặc định',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildMealSection({
    required String title,
    required String timeBadge,
    required IconData icon,
    required Color iconColor,
    required List<MenuItem> items,
    required int dayIndex,
  }) {
    final selectedCount = items.where((i) => i.isSelected).length;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.border.withValues(alpha: 0.7)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(7),
                decoration: BoxDecoration(
                  color: iconColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    Text(
                      timeBadge,
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: selectedCount == items.length
                      ? AppTheme.primaryContainer.withValues(alpha: 0.6)
                      : const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  'Đã chọn: $selectedCount/${items.length}',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: selectedCount == items.length
                        ? AppTheme.primary
                        : AppTheme.textSecondary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Divider(height: 1, thickness: 1, color: Color(0xFFF1F5F9)),
          const SizedBox(height: 8),

          ...items.map((item) => _buildDishItem(item, dayIndex)),
        ],
      ),
    );
  }

  Widget _buildDishItem(MenuItem item, int dayIndex) {
    final isLocked = _controller.isDayLocked(dayIndex);

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3.5),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: () {
            final success = _controller.toggleItem(item, dayIndex);
            if (!success) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(_controller.getDayLockReason(dayIndex)),
                  backgroundColor: const Color(0xFFDC2626),
                  behavior: SnackBarBehavior.floating,
                  duration: const Duration(seconds: 2),
                ),
              );
            }
          },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: item.isSelected
                  ? (isLocked ? const Color(0xFFF1F5F9) : const Color(0xFFF8FAFC))
                  : const Color(0xFFFAFAFA).withValues(alpha: 0.7),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: item.isSelected
                    ? (isLocked ? Colors.grey.shade300 : AppTheme.primary.withValues(alpha: 0.35))
                    : const Color(0xFFE2E8F0).withValues(alpha: 0.7),
                width: item.isSelected ? 1.2 : 1,
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: item.isSelected
                        ? item.iconColor.withValues(alpha: isLocked ? 0.08 : 0.12)
                        : Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    item.icon,
                    color: item.isSelected
                        ? (isLocked ? item.iconColor.withValues(alpha: 0.6) : item.iconColor)
                        : Colors.grey.shade400,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          item.name,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: item.isSelected
                                ? AppTheme.textPrimary
                                : AppTheme.textSecondary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (isLocked)
                        Container(
                          margin: const EdgeInsets.only(left: 6),
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.grey.shade200,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.lock_rounded, size: 10, color: AppTheme.textSecondary),
                              SizedBox(width: 2),
                              Text(
                                'Đã chốt',
                                style: TextStyle(fontSize: 10, color: AppTheme.textSecondary),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Icon(
                  item.isSelected
                      ? Icons.check_circle_rounded
                      : Icons.radio_button_unchecked_rounded,
                  color: item.isSelected
                      ? (isLocked ? Colors.grey.shade400 : AppTheme.primary)
                      : Colors.grey.shade300,
                  size: 22,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSafetyNotice() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDF4),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFBBF7D0)),
      ),
      child: const Row(
        children: [
          Icon(Icons.verified_rounded, color: AppTheme.success, size: 20),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              'Thực phẩm tươi sạch chuẩn VietGAP, đạt chứng nhận VSATTP, thực đơn cân đối do chuyên gia dinh dưỡng phê duyệt.',
              style: TextStyle(fontSize: 11.5, color: Color(0xFF166534), height: 1.3),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar(BuildContext context) {
    final isLocked = _controller.isCurrentDayLocked;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 10,
            offset: const Offset(0, -3),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        'Đã chọn: ${_controller.selectedCount}/${_controller.totalCount} món',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      if (isLocked) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                          decoration: BoxDecoration(
                            color: Colors.red.shade50,
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: Colors.red.shade200),
                          ),
                          child: const Text(
                            'Đã khóa',
                            style: TextStyle(
                              color: Color(0xFFDC2626),
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
            if (isLocked)
              OutlinedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(_controller.getDayLockReason(_controller.selectedDayIndex)),
                      backgroundColor: const Color(0xFFDC2626),
                      behavior: SnackBarBehavior.floating,
                      duration: const Duration(seconds: 2),
                    ),
                  );
                },
                icon: const Icon(Icons.lock_rounded, size: 16, color: AppTheme.textSecondary),
                label: const Text(
                  'Đã Khóa Chọn',
                  style: TextStyle(color: AppTheme.textSecondary),
                ),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: Colors.grey.shade300),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              )
            else if (_controller.isCurrentDaySaved)
              ElevatedButton.icon(
                onPressed: () => _showSaveConfirmationDialog(context),
                icon: const Icon(Icons.check_circle_rounded, size: 18),
                label: const Text('Đã Chọn'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF16A34A),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              )
            else
              ElevatedButton.icon(
                onPressed: () => _showSaveConfirmationDialog(context),
                icon: const Icon(Icons.bookmark_added_rounded, size: 18),
                label: const Text('Lưu Thực Đơn'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  void _showSaveConfirmationDialog(BuildContext context) {
    final currentDay = _controller.currentDayMenu;
    final selectedCount = _controller.selectedCount;
    final selectedDesserts = currentDay.desserts.where((i) => i.isSelected).map((i) => i.name).toList();
    final selectedMains = currentDay.mainMeals.where((i) => i.isSelected).map((i) => i.name).toList();
    final selectedSnacks = currentDay.snacks.where((i) => i.isSelected).map((i) => i.name).toList();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        titlePadding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
        contentPadding: const EdgeInsets.fromLTRB(20, 14, 20, 14),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppTheme.primaryContainer.withValues(alpha: 0.6),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.restaurant_menu_rounded, color: AppTheme.primary, size: 22),
            ),
            const SizedBox(width: 10),
            const Expanded(
              child: Text(
                'Xác Nhận Lưu Thực Đơn',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Xác nhận đăng ký khẩu phần ăn cho bé ngày ${currentDay.fullName}:',
              style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
            ),
            const SizedBox(height: 12),

            // Hộp tóm tắt các món đã chọn
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Đã chọn: $selectedCount/${_controller.totalCount} món',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const Divider(height: 14, thickness: 0.8),
                  if (selectedMains.isNotEmpty) ...[
                    _buildSummaryRow('Bữa chính:', selectedMains.join(', ')),
                    const SizedBox(height: 4),
                  ],
                  if (selectedDesserts.isNotEmpty) ...[
                    _buildSummaryRow('Tráng miệng:', selectedDesserts.join(', ')),
                    const SizedBox(height: 4),
                  ],
                  if (selectedSnacks.isNotEmpty) ...[
                    _buildSummaryRow('Bữa phụ:', selectedSnacks.join(', ')),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 10),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.info_outline_rounded, size: 15, color: AppTheme.textSecondary),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    'Phụ huynh có thể chỉnh sửa lại lựa chọn bất cứ lúc nào trước 10:00 sáng ngày ăn.',
                    style: TextStyle(fontSize: 11, color: Colors.grey.shade600, height: 1.3),
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Xem Lại', style: TextStyle(color: AppTheme.textSecondary)),
          ),
          ElevatedButton.icon(
            onPressed: () {
              _controller.markDayAsSaved(_controller.selectedDayIndex);
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    'Đã lưu thực đơn ${currentDay.shortName} ($selectedCount món) cho bé thành công!',
                  ),
                  backgroundColor: AppTheme.success,
                  behavior: SnackBarBehavior.floating,
                  duration: const Duration(seconds: 2),
                ),
              );
            },
            icon: const Icon(Icons.check_rounded, size: 16),
            label: const Text('Xác Nhận Lưu'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value) {
    return RichText(
      maxLines: 2,
      overflow: TextOverflow.ellipsis,
      text: TextSpan(
        style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
        children: [
          TextSpan(
            text: '$label ',
            style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
          ),
          TextSpan(text: value),
        ],
      ),
    );
  }
}
