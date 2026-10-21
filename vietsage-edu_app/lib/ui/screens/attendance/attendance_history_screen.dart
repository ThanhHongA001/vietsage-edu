import 'package:flutter/material.dart';
import '../../../logic/attendance/attendance_history_controller.dart';
import '../../theme/app_theme.dart';

class AttendanceHistoryScreen extends StatefulWidget {
  const AttendanceHistoryScreen({super.key});

  @override
  State<AttendanceHistoryScreen> createState() => _AttendanceHistoryScreenState();
}

class _AttendanceHistoryScreenState extends State<AttendanceHistoryScreen> {
  late final AttendanceHistoryController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AttendanceHistoryController();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lịch Sử Điểm Danh Gần Đây'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _controller.historyList.length,
        itemBuilder: (context, index) {
          final item = _controller.historyList[index];
          Color statusColor;
          IconData statusIcon;

          if (item['type'] == 'on_time') {
            statusColor = AppTheme.success;
            statusIcon = Icons.check_circle_rounded;
          } else if (item['type'] == 'late') {
            statusColor = AppTheme.warning;
            statusIcon = Icons.access_time_rounded;
          } else {
            statusColor = AppTheme.danger;
            statusIcon = Icons.event_busy_rounded;
          }

          return Card(
            margin: const EdgeInsets.only(bottom: 8),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: statusColor.withValues(alpha: 0.15),
                child: Icon(statusIcon, color: statusColor),
              ),
              title: Text(
                item['date']!,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              subtitle: Text(
                'Giờ điểm danh: ${item['time']}',
                style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
              ),
              trailing: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  item['status']!,
                  style: TextStyle(
                    color: statusColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
