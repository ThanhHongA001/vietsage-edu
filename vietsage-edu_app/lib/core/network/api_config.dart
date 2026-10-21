import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

/// Cấu hình kết nối API trung tâm cho ứng dụng di động Vietsage Edu.
/// Hỗ trợ cả kết nối nội bộ (localhost/máy ảo) và Dev Tunnel đám mây.
class ApiConfig {
  // URLs định nghĩa
  static const String devTunnelUrl = 'https://vgv2316k-1000.asse.devtunnels.ms/api/v1';
  static const String localDeviceUrl = 'http://127.0.0.1:8080/api/v1';
  static const String localDesktopUrl = 'http://127.0.0.1:1000/api/v1';
  static const String localAndroidEmulatorUrl = 'http://10.0.2.2:1000/api/v1';

  /// URL mặc định theo nền tảng
  static String get defaultBaseUrl {
    if (kIsWeb) {
      return localDesktopUrl;
    }
    try {
      if (Platform.isAndroid || Platform.isIOS) {
        return devTunnelUrl;
      }
      if (Platform.isWindows || Platform.isMacOS || Platform.isLinux) {
        return localDesktopUrl;
      }
    } catch (_) {
      // Fallback
    }
    return devTunnelUrl;
  }

  /// URL hiện tại đang sử dụng (có thể đổi runtime nếu cần kiểm thử Dev Tunnel hoặc Local)
  static String _baseUrl = defaultBaseUrl;

  static String get baseUrl => _baseUrl;

  static void setBaseUrl(String newUrl) {
    if (newUrl.isNotEmpty) {
      _baseUrl = newUrl.endsWith('/') ? newUrl.substring(0, newUrl.length - 1) : newUrl;
    }
  }

  static void useLocalhost() {
    _baseUrl = defaultBaseUrl;
  }

  static void useDevTunnel() {
    _baseUrl = devTunnelUrl;
  }

  // ==========================================
  // ENDPOINT URL BUILDERS
  // ==========================================
  // Health
  static String get health => '$baseUrl/health';

  // Dashboard
  static String get dashboardSummary => '$baseUrl/dashboard/summary';

  // Auth
  static String get authLogin => '$baseUrl/auth/login';
  static String get authForgotPassword => '$baseUrl/auth/forgot-password';
  static String get authVerifyOtp => '$baseUrl/auth/verify-otp';
  static String get authResetPassword => '$baseUrl/auth/reset-password';
  static String get authRefresh => '$baseUrl/auth/refresh';
  static String get authLogout => '$baseUrl/auth/logout';

  // Students
  static String get students => '$baseUrl/students';
  static String get studentClasses => '$baseUrl/students/classes';
  static String studentDetail(String id) => '$baseUrl/students/$id';

  // Teachers
  static String get teachers => '$baseUrl/teachers';
  static String teacherDetail(String id) => '$baseUrl/teachers/$id';

  // Attendance
  static String get attendance => '$baseUrl/attendance';
  static String get attendanceMy => '$baseUrl/attendance/my';
  static String get attendanceStats => '$baseUrl/attendance/stats';
  static String get attendanceCheckIn => '$baseUrl/attendance/check-in';

  // Leave Requests
  static String get leaveRequests => '$baseUrl/leave-requests';
  static String leaveRequestDetail(String id) => '$baseUrl/leave-requests/$id';
  static String leaveRequestStatus(String id) => '$baseUrl/leave-requests/$id/status';

  // Schedules
  static String get schedules => '$baseUrl/schedules';

  // Grades
  static String get grades => '$baseUrl/grades';
  static String studentGrades(String studentId) => '$baseUrl/grades/student/$studentId';

  // Homework
  static String get homework => '$baseUrl/homework';
  static String homeworkDetail(String id) => '$baseUrl/homework/$id';
  static String homeworkSubmit(String id) => '$baseUrl/homework/$id/submit';

  // Canteen
  static String get canteenMenu => '$baseUrl/canteen/menu';
  static String get canteenToday => '$baseUrl/canteen/today';
  static String get canteenRegister => '$baseUrl/canteen/register';
  static String get canteenRegistrations => '$baseUrl/canteen/registrations';

  // Uniforms
  static String get uniforms => '$baseUrl/uniforms';
  static String get uniformOrders => '$baseUrl/uniforms/orders';
  static String uniformOrderStatus(String orderCode) => '$baseUrl/uniforms/orders/$orderCode/status';

  // Events
  static String get events => '$baseUrl/events';
  static String eventDetail(String id) => '$baseUrl/events/$id';

  // Announcements
  static String get announcements => '$baseUrl/announcements';
  static String announcementMarkRead(String id) => '$baseUrl/announcements/$id/read';

  // Settings
  static String get settings => '$baseUrl/settings';

  // Timeouts & Headers
  static const Duration requestTimeout = Duration(seconds: 10);
  static const String apiKeyHN212 = 'dev-hn212-key';
}
