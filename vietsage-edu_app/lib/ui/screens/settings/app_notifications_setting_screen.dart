import 'package:flutter/material.dart';
import '../../../logic/settings/app_notifications_controller.dart';
import '../../theme/app_theme.dart';

class AppNotificationsSettingScreen extends StatefulWidget {
  const AppNotificationsSettingScreen({super.key});

  @override
  State<AppNotificationsSettingScreen> createState() => _AppNotificationsSettingScreenState();
}

class _AppNotificationsSettingScreenState extends State<AppNotificationsSettingScreen> {
  late final AppNotificationsController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AppNotificationsController();
  }

  @override
  void dispose() {
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
            title: const Text('Thông Báo Ứng Dụng'),
          ),
          body: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Card(
                child: Column(
                  children: [
                    SwitchListTile(
                      secondary: const CircleAvatar(
                        backgroundColor: Color(0xFFDCFCE7),
                        child: Icon(Icons.check_circle, color: AppTheme.success),
                      ),
                      title: const Text('Điểm Danh & Chuyên Cần', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      subtitle: const Text('Nhận thông báo tức thì khi con đến trường hoặc tan học', style: TextStyle(fontSize: 12)),
                      value: _controller.attendanceNotification,
                      onChanged: _controller.toggleAttendance,
                    ),
                    const Divider(height: 1),
                    SwitchListTile(
                      secondary: const CircleAvatar(
                        backgroundColor: AppTheme.primaryContainer,
                        child: Icon(Icons.menu_book, color: AppTheme.primary),
                      ),
                      title: const Text('Điểm Số & Kết Quả Học Tập', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      subtitle: const Text('Thông báo khi giáo viên cập nhật điểm kiểm tra mới', style: TextStyle(fontSize: 12)),
                      value: _controller.gradeNotification,
                      onChanged: _controller.toggleGrade,
                    ),
                    const Divider(height: 1),
                    SwitchListTile(
                      secondary: const CircleAvatar(
                        backgroundColor: Color(0xFFFEF3C7),
                        child: Icon(Icons.assignment, color: AppTheme.warning),
                      ),
                      title: const Text('Bài Tập Về Nhà & Nhắc Hạn', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      subtitle: const Text('Nhắc nhở hạn nộp bài tập về nhà trước 24 giờ', style: TextStyle(fontSize: 12)),
                      value: _controller.homeworkNotification,
                      onChanged: _controller.toggleHomework,
                    ),
                    const Divider(height: 1),
                    SwitchListTile(
                      secondary: const CircleAvatar(
                        backgroundColor: Color(0xFFF3E8FF),
                        child: Icon(Icons.room_service_rounded, color: Colors.purple),
                      ),
                      title: const Text('Dịch Vụ Nhà Trường', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      subtitle: const Text('Thông báo thực đơn bán trú và dịch vụ học đường', style: TextStyle(fontSize: 12)),
                      value: _controller.serviceNotification,
                      onChanged: _controller.toggleService,
                    ),
                    const Divider(height: 1),
                    SwitchListTile(
                      secondary: const CircleAvatar(
                        backgroundColor: Color(0xFFE0F2FE),
                        child: Icon(Icons.celebration, color: Colors.blue),
                      ),
                      title: const Text('Sự Kiện & Tin Tức Trường', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      subtitle: const Text('Thông báo các hoạt động ngoại khóa, hội thao, lễ hội', style: TextStyle(fontSize: 12)),
                      value: _controller.schoolEventsNotification,
                      onChanged: _controller.toggleSchoolEvents,
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
