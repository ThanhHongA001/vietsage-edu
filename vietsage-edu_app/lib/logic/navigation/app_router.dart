import 'package:flutter/material.dart';
import '../../ui/screens/academic/academic_results_screen.dart';
import '../../ui/screens/academic/grade_detail_screen.dart';
import '../../ui/screens/attendance/attendance_history_screen.dart';
import '../../ui/screens/attendance/attendance_screen.dart';
import '../../ui/screens/attendance/leave_request_screen.dart';
import '../../ui/screens/auth/forgot_password_screen.dart';
import '../../ui/screens/auth/login_screen.dart';
import '../../ui/screens/auth/otp_screen.dart';
import '../../ui/screens/auth/reset_password_screen.dart';
import '../../ui/screens/canteen/canteen_screen.dart';
import '../../ui/screens/events/event_detail_screen.dart';
import '../../ui/screens/events/events_screen.dart';
import '../../ui/screens/homework/homework_detail_screen.dart';
import '../../ui/screens/homework/homework_screen.dart';
import '../../ui/screens/main_layout_screen.dart';
import '../../ui/screens/notifications/notification_detail_screen.dart';
import '../../ui/screens/notifications/notification_list_screen.dart';
import '../../ui/screens/profile/student_profile_screen.dart';
import '../../ui/screens/settings/appearance_language_screen.dart';
import '../../ui/screens/settings/app_notifications_setting_screen.dart';
import '../../ui/screens/uniform/uniform_screen.dart';
import 'app_routes.dart';

class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    final args = settings.arguments;

    switch (settings.name) {
      // Auth flow
      case AppRoutes.login:
        return _buildRoute(const LoginScreen(), settings);
      case AppRoutes.forgotPassword:
        return _buildRoute(const ForgotPasswordScreen(), settings);
      case AppRoutes.otp:
        return _buildRoute(const OtpScreen(), settings);
      case AppRoutes.resetPassword:
        return _buildRoute(const ResetPasswordScreen(), settings);

      // Main dashboard (3 tabs)
      case AppRoutes.main:
        return _buildRoute(const MainLayoutScreen(), settings);

      // Academic flow
      case AppRoutes.academicResults:
        return _buildRoute(const AcademicResultsScreen(), settings);
      case AppRoutes.gradeDetail:
        final data = args as Map<String, dynamic>? ?? {};
        return _buildRoute(
          GradeDetailScreen(
            subjectName: data['subjectName'] ?? 'Toán Học',
            score: data['score'] ?? '9.0',
            teacher: data['teacher'] ?? 'Thầy Trần Minh Đức',
          ),
          settings,
        );

      // Attendance flow
      case AppRoutes.attendance:
        return _buildRoute(const AttendanceScreen(), settings);
      case AppRoutes.attendanceHistory:
        return _buildRoute(const AttendanceHistoryScreen(), settings);
      case AppRoutes.leaveRequest:
        return _buildRoute(const LeaveRequestScreen(), settings);

      // Services flow
      case AppRoutes.canteen:
        return _buildRoute(const CanteenScreen(), settings);
      case AppRoutes.uniform:
        return _buildRoute(const UniformScreen(), settings);
      case AppRoutes.events:
        return _buildRoute(const EventsScreen(), settings);
      case AppRoutes.eventDetail:
        final data = args as Map<String, dynamic>? ?? {};
        return _buildRoute(
          EventDetailScreen(
            title: data['title'] ?? 'Sự Kiện',
            date: data['date'] ?? '',
            location: data['location'] ?? '',
            description: data['description'] ?? '',
            icon: data['icon'] ?? Icons.celebration,
          ),
          settings,
        );
      case AppRoutes.homework:
        return _buildRoute(const HomeworkScreen(), settings);
      case AppRoutes.homeworkDetail:
        final data = args as Map<String, dynamic>? ?? {};
        return _buildRoute(
          HomeworkDetailScreen(
            task: data['task'] as Map<String, dynamic>? ?? {},
          ),
          settings,
        );

      // Notifications flow
      case AppRoutes.notifications:
        return _buildRoute(const NotificationListScreen(), settings);
      case AppRoutes.notificationDetail:
        final data = args as Map<String, dynamic>? ?? {};
        return _buildRoute(
          NotificationDetailScreen(
            title: data['title'] ?? 'Thông Báo',
            date: data['date'] ?? '',
            sender: data['sender'] ?? 'Nhà Trường',
            content: data['content'] ?? '',
            imageUrl: data['imageUrl'] as String?,
          ),
          settings,
        );

      // Profile & Settings flow
      case AppRoutes.studentProfile:
        return _buildRoute(const StudentProfileScreen(), settings);
      case AppRoutes.appearanceLanguage:
        return _buildRoute(const AppearanceLanguageScreen(), settings);
      case AppRoutes.appNotificationsSetting:
        return _buildRoute(const AppNotificationsSettingScreen(), settings);

      default:
        return _buildRoute(
          Scaffold(
            appBar: AppBar(title: const Text('Không tìm thấy trang')),
            body: Center(
              child: Text('Trang ${settings.name} không tồn tại!'),
            ),
          ),
          settings,
        );
    }
  }

  static MaterialPageRoute _buildRoute(Widget page, RouteSettings settings) {
    return MaterialPageRoute(
      builder: (_) => page,
      settings: settings,
    );
  }
}
