import '../api_client.dart';
import '../api_config.dart';
import '../api_response.dart';
import '../models/api_models.dart';

/// Dịch vụ kết nối API Thời khóa biểu
class SchedulesApiService {
  final ApiClient _client = ApiClient.instance;

  /// Lấy danh sách thời khóa biểu theo lớp học hoặc giáo viên
  Future<ApiResponse<List<ScheduleItem>>> getSchedules({
    String? className,
    String? teacherName,
    int? dayOfWeek,
  }) async {
    return _client.get<List<ScheduleItem>>(
      ApiConfig.schedules,
      queryParameters: {
        'className': className,
        'teacherName': teacherName,
        'dayOfWeek': dayOfWeek,
      },
      fromJson: (json) => (json as List<dynamic>)
          .map((e) => ScheduleItem.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}
