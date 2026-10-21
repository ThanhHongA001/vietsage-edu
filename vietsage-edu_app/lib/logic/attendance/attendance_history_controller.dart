import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';

class AttendanceHistoryController extends ChangeNotifier {
  bool isLoading = false;

  AttendanceHistoryController() {
    loadHistory();
  }

  List<Map<String, String>> historyList = [
    {'date': 'Thứ Tư, 14/10/2026', 'status': 'Đi Học Đúng Giờ', 'time': '07:15 SA', 'type': 'on_time'},
    {'date': 'Thứ Ba, 13/10/2026', 'status': 'Đi Học Đúng Giờ', 'time': '07:10 SA', 'type': 'on_time'},
    {'date': 'Thứ Hai, 12/10/2026', 'status': 'Đi Học Đúng Giờ', 'time': '07:18 SA', 'type': 'on_time'},
    {'date': 'Thứ Bảy, 10/10/2026', 'status': 'Đi Học Đúng Giờ', 'time': '07:12 SA', 'type': 'on_time'},
    {'date': 'Thứ Sáu, 09/10/2026', 'status': 'Đi Muộn (07:35 SA)', 'time': '07:35 SA', 'type': 'late'},
    {'date': 'Thứ Năm, 08/10/2026', 'status': 'Đi Học Đúng Giờ', 'time': '07:14 SA', 'type': 'on_time'},
    {'date': 'Thứ Tư, 07/10/2026', 'status': 'Nghỉ Có Phép (Ốm)', 'time': 'Nghỉ cả ngày', 'type': 'leave'},
    {'date': 'Thứ Ba, 06/10/2026', 'status': 'Đi Học Đúng Giờ', 'time': '07:05 SA', 'type': 'on_time'},
    {'date': 'Thứ Hai, 05/10/2026', 'status': 'Đi Học Đúng Giờ', 'time': '07:12 SA', 'type': 'on_time'},
  ];

  Future<void> loadHistory() async {
    isLoading = true;
    notifyListeners();

    try {
      final response = await ApiServices.attendance.getAttendanceHistory(limit: 50);
      if (response.success && response.data != null && response.data!.isNotEmpty) {
        historyList = response.data!.map((rec) {
          final isLate = rec.status == 'LATE';
          final isLeave = rec.status == 'EXCUSED';
          final type = isLate ? 'late' : (isLeave ? 'leave' : 'on_time');
          final statusLabel = isLate ? 'Đi Muộn (${rec.timestamp.length >= 16 ? rec.timestamp.substring(11, 16) : ""})' : (isLeave ? 'Nghỉ Có Phép' : 'Đi Học Đúng Giờ');

          return {
            'date': rec.timestamp.length >= 10 ? rec.timestamp.substring(0, 10) : rec.timestamp,
            'status': statusLabel,
            'time': '${rec.timestamp.length >= 16 ? rec.timestamp.substring(11, 16) : ""} • ${rec.deviceName ?? "Cổng trường HN212"}',
            'type': type,
          };
        }).toList();
      }
    } catch (_) {}

    isLoading = false;
    notifyListeners();
  }
}
