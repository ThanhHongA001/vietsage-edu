import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';
import '../navigation/navigation_service.dart';

class AttendanceDayInfo {
  final String status; // 'on_time' | 'late' | 'leave' | 'weekend' | 'upcoming'
  final String label;  // 'Có mặt' | 'Đi muộn' | 'Nghỉ học' | 'Nghỉ cuối tuần' | 'Chưa diễn ra'
  final String time;
  final String note;

  const AttendanceDayInfo({
    required this.status,
    required this.label,
    required this.time,
    this.note = '',
  });
}

class AttendanceController extends ChangeNotifier {
  DateTime currentMonth = DateTime(DateTime.now().year, DateTime.now().month, 1);
  DateTime selectedDate = DateTime.now();

  int totalSessions = 26;
  int attendedSessions = 24;
  int lateSessions = 1;
  int absentSessions = 1;
  bool isLoading = false;

  AttendanceController() {
    loadAttendanceData();
  }

  // Dữ liệu chuyên cần
  final Map<String, AttendanceDayInfo> _attendanceData = {
    '2026-10-01': const AttendanceDayInfo(status: 'on_time', label: 'Có mặt', time: '07:12 SA', note: 'Cổng chính'),
    '2026-10-02': const AttendanceDayInfo(status: 'on_time', label: 'Có mặt', time: '07:15 SA', note: 'Cổng chính'),
    '2026-10-03': const AttendanceDayInfo(status: 'on_time', label: 'Có mặt', time: '07:20 SA', note: 'Cổng chính'),
    '2026-10-04': const AttendanceDayInfo(status: 'weekend', label: 'Chủ Nhật', time: 'Nghỉ học', note: 'Cuối tuần'),
    '2026-10-05': const AttendanceDayInfo(status: 'on_time', label: 'Có mặt', time: '07:12 SA', note: 'Cổng chính'),
    '2026-10-06': const AttendanceDayInfo(status: 'on_time', label: 'Có mặt', time: '07:05 SA', note: 'Cổng chính'),
    '2026-10-07': const AttendanceDayInfo(status: 'leave', label: 'Nghỉ Có Phép', time: 'Nghỉ cả ngày', note: 'Đơn xin nghỉ ốm'),
    '2026-10-08': const AttendanceDayInfo(status: 'on_time', label: 'Có mặt', time: '07:14 SA', note: 'Cổng chính'),
    '2026-10-09': const AttendanceDayInfo(status: 'late', label: 'Đi Muộn', time: '07:35 SA', note: 'Muộn 15 phút (kẹt xe)'),
    '2026-10-10': const AttendanceDayInfo(status: 'on_time', label: 'Có mặt', time: '07:12 SA', note: 'Cổng chính'),
    '2026-10-11': const AttendanceDayInfo(status: 'weekend', label: 'Chủ Nhật', time: 'Nghỉ học', note: 'Cuối tuần'),
    '2026-10-12': const AttendanceDayInfo(status: 'on_time', label: 'Có mặt', time: '07:18 SA', note: 'Cổng chính'),
    '2026-10-13': const AttendanceDayInfo(status: 'on_time', label: 'Có mặt', time: '07:10 SA', note: 'Cổng chính'),
    '2026-10-14': const AttendanceDayInfo(status: 'on_time', label: 'Có mặt', time: '07:15 SA', note: 'Hôm nay • Cổng chính'),
  };

  List<Map<String, dynamic>> _recentHistory = [
    {
      'date': 'Hôm nay (Thứ Tư, 14/10/2026)',
      'time': '07:15 SA • Cổng chính',
      'status': 'Có mặt',
      'type': 'on_time',
    },
    {
      'date': 'Thứ Ba, 13/10/2026',
      'time': '07:10 SA • Cổng chính',
      'status': 'Có mặt',
      'type': 'on_time',
    },
    {
      'date': 'Thứ Hai, 12/10/2026',
      'time': '07:18 SA • Cổng chính',
      'status': 'Có mặt',
      'type': 'on_time',
    },
    {
      'date': 'Thứ Bảy, 10/10/2026',
      'time': '07:12 SA • Cổng chính',
      'status': 'Có mặt',
      'type': 'on_time',
    },
    {
      'date': 'Thứ Sáu, 09/10/2026',
      'time': '07:35 SA (Muộn 15p)',
      'status': 'Đi Muộn',
      'type': 'late',
    },
  ];

  List<Map<String, dynamic>> get recentHistory => _recentHistory;
  String get currentMonthText => 'Tháng ${currentMonth.month} / ${currentMonth.year}';

  Future<void> loadAttendanceData() async {
    isLoading = true;
    notifyListeners();

    try {
      final monthStr = '${currentMonth.year}-${currentMonth.month.toString().padLeft(2, '0')}';
      final response = await ApiServices.attendance.getAttendanceHistory(limit: 20);
      if (response.success && response.data != null && response.data!.isNotEmpty) {
        final list = response.data!;
        _recentHistory = list.take(5).map((rec) {
          final isLate = rec.status == 'LATE';
          final isLeave = rec.status == 'EXCUSED';
          final type = isLate ? 'late' : (isLeave ? 'leave' : 'on_time');
          final statusLabel = isLate ? 'Đi Muộn' : (isLeave ? 'Nghỉ Có Phép' : 'Có mặt');

          return {
            'date': rec.timestamp.length >= 10 ? rec.timestamp.substring(0, 10) : rec.timestamp,
            'time': '${rec.timestamp.length >= 16 ? rec.timestamp.substring(11, 16) : ''} • ${rec.deviceName ?? "Máy chấm công HN212"}',
            'status': statusLabel,
            'type': type,
          };
        }).toList();

        for (var rec in list) {
          if (rec.timestamp.length >= 10) {
            final dateKey = rec.timestamp.substring(0, 10);
            final isLate = rec.status == 'LATE';
            final isLeave = rec.status == 'EXCUSED';
            final type = isLate ? 'late' : (isLeave ? 'leave' : 'on_time');
            final label = isLate ? 'Đi Muộn' : (isLeave ? 'Nghỉ phép' : 'Có mặt');

            _attendanceData[dateKey] = AttendanceDayInfo(
              status: type,
              label: label,
              time: rec.timestamp.length >= 16 ? rec.timestamp.substring(11, 16) : '07:15',
              note: rec.note ?? (rec.deviceName ?? 'Cổng chính'),
            );
          }
        }
      }

      // Thống kê chuyên cần
      final statsRes = await ApiServices.attendance.getStats(month: monthStr);
      if (statsRes.success && statsRes.data != null) {
        final stats = statsRes.data!;
        attendedSessions = stats.present;
        lateSessions = stats.late;
        absentSessions = stats.excused;
        totalSessions = stats.totalScans > 0 ? stats.totalScans : (attendedSessions + lateSessions + absentSessions);
      }
    } catch (_) {
      // Giữ dữ liệu offline
    }

    isLoading = false;
    notifyListeners();
  }

  void previousMonth() {
    currentMonth = DateTime(currentMonth.year, currentMonth.month - 1, 1);
    loadAttendanceData();
  }

  void nextMonth() {
    currentMonth = DateTime(currentMonth.year, currentMonth.month + 1, 1);
    loadAttendanceData();
  }

  void selectDate(DateTime date) {
    selectedDate = date;
    notifyListeners();
  }

  AttendanceDayInfo getAttendanceForDate(DateTime date) {
    final key = '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
    if (_attendanceData.containsKey(key)) {
      return _attendanceData[key]!;
    }
    if (date.weekday == DateTime.sunday) {
      return const AttendanceDayInfo(status: 'weekend', label: 'Chủ Nhật', time: 'Nghỉ học', note: 'Cuối tuần');
    }
    return const AttendanceDayInfo(status: 'upcoming', label: 'Chưa diễn ra', time: '--:--', note: 'Tiết học dự kiến 07:30');
  }

  void openHistory() => NavigationService.goToAttendanceHistory();
  void openLeaveRequest() => NavigationService.goToLeaveRequest();
}
