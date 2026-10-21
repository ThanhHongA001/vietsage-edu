import '../api_client.dart';
import '../api_config.dart';
import '../api_response.dart';
import '../models/api_models.dart';

/// Dịch vụ kết nối API Điểm số & Bảng điểm học bạ
class GradesApiService {
  final ApiClient _client = ApiClient.instance;

  /// Lấy bảng điểm chi tiết và GPA theo mã học sinh
  Future<ApiResponse<StudentGradesSummary>> getStudentGrades({
    required String studentId,
    String? semester,
  }) async {
    return _client.get<StudentGradesSummary>(
      ApiConfig.studentGrades(studentId),
      queryParameters: {
        'semester': semester,
      },
      fromJson: (json) => StudentGradesSummary.fromJson(json as Map<String, dynamic>),
    );
  }

  /// Lấy danh sách bảng điểm của lớp
  Future<ApiResponse<List<dynamic>>> getClassGrades({
    String? className,
    String? subject,
    String? semester,
  }) async {
    return _client.get<List<dynamic>>(
      ApiConfig.grades,
      queryParameters: {
        'className': className,
        'subject': subject,
        'semester': semester,
      },
      fromJson: (json) => json as List<dynamic>,
    );
  }
}
