export '../api_client.dart';
export '../api_config.dart';
export '../api_response.dart';
export '../models/api_models.dart';
export 'announcements_api_service.dart';
export 'attendance_api_service.dart';
export 'auth_api_service.dart';
export 'canteen_api_service.dart';
export 'dashboard_api_service.dart';
export 'events_api_service.dart';
export 'grades_api_service.dart';
export 'homework_api_service.dart';
export 'leave_request_api_service.dart';
export 'schedules_api_service.dart';
export 'student_api_service.dart';
export 'uniform_api_service.dart';

import 'announcements_api_service.dart';
import 'attendance_api_service.dart';
import 'auth_api_service.dart';
import 'canteen_api_service.dart';
import 'dashboard_api_service.dart';
import 'events_api_service.dart';
import 'grades_api_service.dart';
import 'homework_api_service.dart';
import 'leave_request_api_service.dart';
import 'schedules_api_service.dart';
import 'student_api_service.dart';
import 'uniform_api_service.dart';

/// Điểm truy cập trung tâm thuận tiện cho toàn bộ các dịch vụ API Vietsage Edu
class ApiServices {
  static final AuthApiService auth = AuthApiService();
  static final StudentApiService student = StudentApiService();
  static final AttendanceApiService attendance = AttendanceApiService();
  static final LeaveRequestApiService leaveRequest = LeaveRequestApiService();
  static final GradesApiService grades = GradesApiService();
  static final HomeworkApiService homework = HomeworkApiService();
  static final CanteenApiService canteen = CanteenApiService();
  static final UniformApiService uniform = UniformApiService();
  static final EventsApiService events = EventsApiService();
  static final AnnouncementsApiService announcements = AnnouncementsApiService();
  static final DashboardApiService dashboard = DashboardApiService();
  static final SchedulesApiService schedules = SchedulesApiService();
}
