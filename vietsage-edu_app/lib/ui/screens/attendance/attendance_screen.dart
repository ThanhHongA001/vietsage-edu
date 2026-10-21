import 'package:flutter/material.dart';
import '../../../logic/attendance/attendance_controller.dart';
import '../../theme/app_theme.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  late final AttendanceController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AttendanceController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  int _getDaysInMonth(int year, int month) {
    return DateTime(year, month + 1, 0).day;
  }

  String _formatDateVietnamese(DateTime dt) {
    final weekdays = [
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy',
      'Chủ Nhật'
    ];
    final dayStr = dt.day.toString().padLeft(2, '0');
    final monthStr = dt.month.toString().padLeft(2, '0');
    final weekdayStr = weekdays[dt.weekday - 1];
    return '$weekdayStr, $dayStr/$monthStr/${dt.year}';
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _controller,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('Chuyên Cần & Điểm Danh'),
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // 1. LỊCH HOÀN CHỈNH DƯỚI TIÊU ĐỀ MÀN HÌNH
                _buildCompleteCalendarCard(),

                const SizedBox(height: 16),

                // 2. LỊCH SỬ ĐIỂM DANH GẦN ĐÂY (5 MỤC TRONG LIST)
                _buildRecentHistorySection(),

                const SizedBox(height: 20),

                // 4. NÚT GỬI ĐƠN XIN NGHỈ HỌC
                ElevatedButton.icon(
                  onPressed: _controller.openLeaveRequest,
                  icon: const Icon(Icons.assignment_late_outlined, size: 20),
                  label: const Text('Gửi Đơn Xin Nghỉ Học Trực Tuyến'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ==========================================
  // 1. LỊCH HOÀN CHỈNH (COMPLETE CALENDAR CARD)
  // ==========================================
  Widget _buildCompleteCalendarCard() {
    final year = _controller.currentMonth.year;
    final month = _controller.currentMonth.month;
    final daysInMonth = _getDaysInMonth(year, month);
    final firstWeekday = DateTime(year, month, 1).weekday; // 1 = Thứ 2, 7 = CN
    final leadingOffset = firstWeekday - 1; // Số ô trống trước ngày 1

    final totalCells = leadingOffset + daysInMonth;
    final rowCount = (totalCells / 7).ceil();
    final gridCells = rowCount * 7;

    final selectedDayInfo = _controller.getAttendanceForDate(_controller.selectedDate);

    return Card(
      elevation: 1.5,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: BorderSide(color: AppTheme.border.withValues(alpha: 0.8)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            // Thanh chuyển tháng & tiêu đề tháng
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  tooltip: 'Tháng trước',
                  icon: const Icon(Icons.chevron_left_rounded, size: 26),
                  onPressed: _controller.previousMonth,
                ),
                Text(
                  _controller.currentMonthText,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primary,
                  ),
                ),
                IconButton(
                  tooltip: 'Tháng sau',
                  icon: const Icon(Icons.chevron_right_rounded, size: 26),
                  onPressed: _controller.nextMonth,
                ),
              ],
            ),

            const SizedBox(height: 6),
            const Divider(height: 1, thickness: 0.8, color: Color(0xFFF1F5F9)),
            const SizedBox(height: 8),

            // Hàng thứ trong tuần (T2 - CN)
            Row(
              children: [
                _buildWeekdayHeader('T2'),
                _buildWeekdayHeader('T3'),
                _buildWeekdayHeader('T4'),
                _buildWeekdayHeader('T5'),
                _buildWeekdayHeader('T6'),
                _buildWeekdayHeader('T7'),
                _buildWeekdayHeader('CN', isSunday: true),
              ],
            ),

            const SizedBox(height: 6),

            // Lưới các ngày trong tháng (7 cột)
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: gridCells,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 7,
                mainAxisSpacing: 2,
                crossAxisSpacing: 4,
                childAspectRatio: 1.3,
              ),
              itemBuilder: (context, index) {
                final dayNumber = index - leadingOffset + 1;
                if (dayNumber < 1 || dayNumber > daysInMonth) {
                  return const SizedBox(); // Ô ngoài tháng
                }

                final cellDate = DateTime(year, month, dayNumber);
                final isSelected = _controller.selectedDate.year == cellDate.year &&
                    _controller.selectedDate.month == cellDate.month &&
                    _controller.selectedDate.day == cellDate.day;

                final isToday = cellDate.year == 2026 &&
                    cellDate.month == 10 &&
                    cellDate.day == 14;

                final isSunday = cellDate.weekday == DateTime.sunday;
                final dayInfo = _controller.getAttendanceForDate(cellDate);

                return InkWell(
                  onTap: () => _controller.selectDate(cellDate),
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppTheme.primary
                          : (isToday ? AppTheme.primaryContainer.withValues(alpha: 0.45) : Colors.transparent),
                      borderRadius: BorderRadius.circular(10),
                      border: isToday && !isSelected
                          ? Border.all(color: AppTheme.primary, width: 1.2)
                          : null,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          '$dayNumber',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: isSelected || isToday ? FontWeight.bold : FontWeight.w600,
                            color: isSelected
                                ? Colors.white
                                : (isSunday ? Colors.grey.shade400 : AppTheme.textPrimary),
                          ),
                        ),
                        const SizedBox(height: 2),
                        _buildStatusDot(dayInfo.status, isSelected),
                      ],
                    ),
                  ),
                );
              },
            ),

            const SizedBox(height: 8),

            // Thông tin chi tiết của ngày đang được chọn trên lịch
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppTheme.border.withValues(alpha: 0.7)),
              ),
              child: Row(
                children: [
                  Icon(
                    _getStatusIcon(selectedDayInfo.status),
                    size: 18,
                    color: _getStatusColor(selectedDayInfo.status),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _formatDateVietnamese(_controller.selectedDate),
                          style: const TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                        Text(
                          '${selectedDayInfo.label}: ${selectedDayInfo.time} (${selectedDayInfo.note})',
                          style: TextStyle(
                            fontSize: 11,
                            color: _getStatusColor(selectedDayInfo.status),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 10),

            // Chú thích các chấm màu điểm danh
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildLegendItem(const Color(0xFF16A34A), 'Có mặt (${_controller.attendedSessions})'),
                _buildLegendItem(const Color(0xFFEA580C), 'Đi muộn (${_controller.lateSessions})'),
                _buildLegendItem(const Color(0xFFDC2626), 'Nghỉ học (${_controller.absentSessions})'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWeekdayHeader(String label, {bool isSunday = false}) {
    return Expanded(
      child: Center(
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: isSunday ? const Color(0xFFDC2626) : AppTheme.textSecondary,
          ),
        ),
      ),
    );
  }

  Widget _buildStatusDot(String status, bool isSelected) {
    Color dotColor;
    switch (status) {
      case 'on_time':
        dotColor = isSelected ? Colors.greenAccent : const Color(0xFF16A34A);
        break;
      case 'late':
        dotColor = isSelected ? Colors.amberAccent : const Color(0xFFEA580C);
        break;
      case 'leave':
        dotColor = isSelected ? Colors.redAccent : const Color(0xFFDC2626);
        break;
      case 'weekend':
        return const SizedBox(height: 5);
      default:
        dotColor = isSelected ? Colors.white54 : Colors.transparent;
    }

    return Container(
      width: 5,
      height: 5,
      decoration: BoxDecoration(
        color: dotColor,
        shape: BoxShape.circle,
      ),
    );
  }

  Widget _buildLegendItem(Color color, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 7,
          height: 7,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 4),
        Text(
          text,
          style: const TextStyle(fontSize: 10.5, color: AppTheme.textSecondary, fontWeight: FontWeight.w500),
        ),
      ],
    );
  }

  IconData _getStatusIcon(String status) {
    switch (status) {
      case 'on_time':
        return Icons.check_circle_rounded;
      case 'late':
        return Icons.access_time_filled_rounded;
      case 'leave':
        return Icons.cancel_rounded;
      case 'weekend':
        return Icons.weekend_rounded;
      default:
        return Icons.event_available_rounded;
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'on_time':
        return const Color(0xFF16A34A);
      case 'late':
        return const Color(0xFFEA580C);
      case 'leave':
        return const Color(0xFFDC2626);
      case 'weekend':
        return Colors.blueGrey;
      default:
        return AppTheme.primary;
    }
  }

  // ==============================================================
  // 2. LỊCH SỬ ĐIỂM DANH GẦN ĐÂY (5 MỤC TRONG LIST)
  // ==============================================================
  Widget _buildRecentHistorySection() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Lịch Sử Điểm Danh Gần Đây',
              style: TextStyle(
                fontSize: 15.5,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
            TextButton(
              onPressed: _controller.openHistory,
              child: const Text('Xem Tất Cả'),
            ),
          ],
        ),
        Card(
          elevation: 1,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: AppTheme.border.withValues(alpha: 0.7)),
          ),
          child: Column(
            children: _controller.recentHistory.asMap().entries.map((entry) {
              final index = entry.key;
              final item = entry.value;
              final isLate = item['type'] == 'late';
              final isLeave = item['type'] == 'leave';
              final isLast = index == _controller.recentHistory.length - 1;

              Color badgeColor = const Color(0xFF16A34A);
              Color badgeBg = const Color(0xFFDCFCE7);
              IconData iconData = Icons.check_circle_rounded;

              if (isLate) {
                badgeColor = const Color(0xFFEA580C);
                badgeBg = const Color(0xFFFFEDD5);
                iconData = Icons.access_time_filled_rounded;
              } else if (isLeave) {
                badgeColor = const Color(0xFFDC2626);
                badgeBg = const Color(0xFFFEE2E2);
                iconData = Icons.cancel_rounded;
              }

              return Column(
                children: [
                  ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
                    leading: Container(
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(
                        color: badgeBg,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(iconData, color: badgeColor, size: 20),
                    ),
                    title: Text(
                      item['date'] ?? '',
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                    ),
                    subtitle: Text(
                      item['time'] ?? '',
                      style: const TextStyle(fontSize: 11.5, color: AppTheme.textSecondary),
                    ),
                    trailing: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                      decoration: BoxDecoration(
                        color: badgeBg,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        item['status'] ?? '',
                        style: TextStyle(
                          color: badgeColor,
                          fontSize: 11.5,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  if (!isLast)
                    const Divider(height: 1, thickness: 0.8, color: Color(0xFFF1F5F9)),
                ],
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
