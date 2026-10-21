import '../api_client.dart';
import '../api_config.dart';
import '../api_response.dart';
import '../models/api_models.dart';

/// Dịch vụ kết nối API Điểm danh & Thống kê Chuyên cần
class AttendanceApiService {
  final ApiClient _client = ApiClient.instance;

  /// Lấy lịch sử điểm danh của học sinh
  Future<ApiResponse<List<AttendanceRecord>>> getAttendanceHistory({
    String? userId,
    String? studentId,
    String? className,
    String? from,
    String? to,
    int? limit,
  }) async {
    return _client.get<List<AttendanceRecord>>(
      ApiConfig.attendance,
      queryParameters: {
        'userId': userId,
        'studentId': studentId,
        'className': className,
        'from': from,
        'to': to,
        'limit': limit ?? 50,
      },
      fromJson: (json) => (json as List<dynamic>)
          .map((e) => AttendanceRecord.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Lấy thống kê chuyên cần theo lớp hoặc theo tháng
  Future<ApiResponse<AttendanceStats>> getStats({
    String? className,
    String? month,
  }) async {
    return _client.get<AttendanceStats>(
      ApiConfig.attendanceStats,
      queryParameters: {
        'className': className,
        'month': month,
      },
      fromJson: (json) => AttendanceStats.fromJson(json as Map<String, dynamic>),
    );
  }

  /// Thực hiện điểm danh cá nhân (Check-in thủ công hoặc quét thẻ)
  Future<ApiResponse<AttendanceRecord>> checkIn({
    required String studentId,
    required String studentName,
    required String className,
    String status = 'PRESENT',
    String method = 'MANUAL',
    String? note,
  }) async {
    return _client.post<AttendanceRecord>(
      ApiConfig.attendanceCheckIn,
      body: {
        'studentId': studentId,
        'studentName': studentName,
        'className': className,
        'status': status,
        'method': method,
        'note': note,
      },
      fromJson: (json) => AttendanceRecord.fromJson(json as Map<String, dynamic>),
    );
  }
}
